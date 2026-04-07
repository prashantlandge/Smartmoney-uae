import json
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.db.connection import get_pool
from app.features.products.schemas import ProductResponse
from app.features.products.insights import generate_insight

logger = logging.getLogger("products.router")

VALID_CATEGORIES = {
    "credit-cards", "credit_cards", "credit_card",
    "personal-loans", "personal_loans", "personal_loan",
    "islamic-finance", "islamic_finance",
    "car-insurance", "car_insurance",
    "health-insurance", "health_insurance",
    "remittance",
}


def _parse_features(raw) -> dict:
    """Parse JSONB features which asyncpg may return as string."""
    if raw is None:
        return {}
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            return {}
    return {}

router = APIRouter()


@router.get("/list/{category}", response_model=List[ProductResponse])
async def list_products(
    category: str,
    salary: Optional[float] = Query(None, description="User monthly salary in AED"),
    nationality: str = Query("IN", description="User nationality ISO code"),
    residency: str = Query("resident", description="resident or non_resident"),
    employer: Optional[str] = Query(None, description="Employer category"),
    transfer_frequency: Optional[str] = Query(None, description="Transfer frequency"),
):
    """List products by category with optional personalized insights."""
    # Validate category early — don't silently return empty for typos
    if category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid category '{category}'. Valid: credit-cards, personal-loans, islamic-finance, car-insurance, health-insurance, remittance",
        )

    # Map URL slugs to DB category values
    category_map = {
        "credit-cards": "credit_card",
        "credit_cards": "credit_card",
        "personal-loans": "personal_loan",
        "personal_loans": "personal_loan",
        "islamic-finance": "islamic_finance",
        "car-insurance": "car_insurance",
        "car_insurance": "car_insurance",
        "health-insurance": "health_insurance",
        "health_insurance": "health_insurance",
        "remittance": "remittance",
    }

    db_category = category_map.get(category, category)

    try:
        pool = await get_pool()
    except Exception as e:
        logger.error(f"Database connection failed in list_products: {e}")
        raise HTTPException(status_code=503, detail="Database temporarily unavailable")

    try:
        rows = await pool.fetch(
        """
        SELECT p.id, pr.name_en as provider_name, pr.logo_url as provider_logo,
               p.name_en as product_name, p.category as product_type,
               p.description_en as description,
               p.key_features as features, p.affiliate_deep_link_en as affiliate_link,
               p.islamic_compliant as is_islamic, p.active as is_active
        FROM products p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE p.category = $1 AND p.active = true
        ORDER BY pr.name_en
        """,
            db_category,
        )
    except Exception as e:
        logger.error(f"Database query failed for category '{db_category}': {e}")
        raise HTTPException(status_code=503, detail="Failed to fetch products")

    if not rows:
        logger.warning(f"No products found for category '{db_category}' — may indicate missing data")

    results = []
    for row in rows:
        parsed_features = _parse_features(row["features"])
        product_dict = {
            "product_name": row["product_name"],
            "provider_name": row["provider_name"],
        }

        # Generate personalized insight if user profile provided
        insight = None
        if salary is not None:
            insight = generate_insight(
                product=product_dict,
                features=parsed_features,
                category=db_category,
                salary=salary,
                nationality=nationality,
                residency_status=residency,
                employer_category=employer,
                transfer_frequency=transfer_frequency,
            )

        results.append(
            ProductResponse(
                id=str(row["id"]),
                provider_name=row["provider_name"],
                provider_logo=row["provider_logo"] or "",
                product_name=row["product_name"],
                product_type=row["product_type"],
                description=row["description"] or "",
                features=parsed_features,
                affiliate_link=row["affiliate_link"] or "#",
                is_islamic=row["is_islamic"],
                is_active=row["is_active"],
                personalized_insight=insight,
            )
        )
    return results


@router.get("/search", response_model=List[ProductResponse])
async def search_products(
    q: str = Query(min_length=2, max_length=100),
    limit: int = Query(default=10, ge=1, le=50),
):
    """Search products across all categories by name, provider, description, and features.

    Understands spending categories like 'petrol', 'dining', 'groceries', 'travel'
    by expanding queries to match related keywords in product features.
    """
    try:
        pool = await get_pool()
    except Exception as e:
        logger.error(f"Database connection failed in search_products: {e}")
        raise HTTPException(status_code=503, detail="Database temporarily unavailable")

    # Expand common spending category synonyms so "petrol" also matches "fuel", etc.
    KEYWORD_EXPANSIONS: dict[str, list[str]] = {
        "petrol": ["petrol", "fuel", "gas_station", "gas"],
        "fuel": ["petrol", "fuel", "gas_station", "gas"],
        "dining": ["dining", "restaurant", "food", "dine"],
        "restaurant": ["dining", "restaurant", "food", "dine"],
        "food": ["dining", "restaurant", "food", "grocery", "groceries"],
        "groceries": ["grocery", "groceries", "supermarket"],
        "grocery": ["grocery", "groceries", "supermarket"],
        "supermarket": ["grocery", "groceries", "supermarket"],
        "travel": ["travel", "airline", "hotel", "miles", "lounge", "airport"],
        "airline": ["travel", "airline", "miles", "airport"],
        "hotel": ["travel", "hotel", "hotels"],
        "shopping": ["shopping", "online_shopping", "retail"],
        "online": ["online", "online_shopping", "streaming"],
    }

    q_lower = q.lower().strip()
    search_term = f"%{q}%"
    category_term = f"%{q.replace('-', '_').replace(' ', '_')}%"

    # Build expanded feature search terms from keyword synonyms
    feature_terms = [search_term]  # always include the raw query
    for word in q_lower.split():
        if word in KEYWORD_EXPANSIONS:
            for synonym in KEYWORD_EXPANSIONS[word]:
                term = f"%{synonym}%"
                if term not in feature_terms:
                    feature_terms.append(term)

    # Build dynamic OR clause for feature matching
    feature_conditions = " OR ".join(
        f"CAST(p.key_features AS TEXT) ILIKE ${i + 4}"
        for i in range(len(feature_terms))
    )

    query_sql = f"""
        SELECT p.id, pr.name_en as provider_name, pr.logo_url as provider_logo,
               p.name_en as product_name, p.category as product_type,
               p.description_en as description,
               p.key_features as features, p.affiliate_deep_link_en as affiliate_link,
               p.islamic_compliant as is_islamic, p.active as is_active
        FROM products p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE p.active = true AND (
            p.name_en ILIKE $1 OR p.name_ar ILIKE $1
            OR pr.name_en ILIKE $1 OR pr.name_ar ILIKE $1
            OR p.description_en ILIKE $1
            OR p.category ILIKE $2
            OR {feature_conditions}
        )
        ORDER BY
            CASE WHEN p.name_en ILIKE $1 THEN 0
                 WHEN pr.name_en ILIKE $1 THEN 1
                 WHEN ({feature_conditions}) THEN 2
                 ELSE 3 END,
            pr.name_en
        LIMIT $3
    """

    try:
        rows = await pool.fetch(
            query_sql,
            search_term,
            category_term,
            limit,
            *feature_terms,
        )
    except Exception as e:
        logger.error(f"Search query failed for '{q}': {e}")
        raise HTTPException(status_code=503, detail="Search failed")

    return [
        ProductResponse(
            id=str(row["id"]),
            provider_name=row["provider_name"],
            provider_logo=row["provider_logo"] or "",
            product_name=row["product_name"],
            product_type=row["product_type"],
            description=row["description"] or "",
            features=_parse_features(row["features"]),
            affiliate_link=row["affiliate_link"] or "#",
            is_islamic=row["is_islamic"],
            is_active=row["is_active"],
        )
        for row in rows
    ]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get a single product by ID."""
    import uuid as _uuid

    # Validate UUID format
    try:
        valid_uuid = _uuid.UUID(product_id)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        pool = await get_pool()
    except Exception as e:
        logger.error(f"Database connection failed in get_product: {e}")
        raise HTTPException(status_code=503, detail="Database temporarily unavailable")

    row = await pool.fetchrow(
        """
        SELECT p.id, pr.name_en as provider_name, pr.logo_url as provider_logo,
               p.name_en as product_name, p.category as product_type,
               p.description_en as description,
               p.key_features as features, p.affiliate_deep_link_en as affiliate_link,
               p.islamic_compliant as is_islamic, p.active as is_active
        FROM products p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE p.id = $1
        """,
        valid_uuid,
    )

    if not row:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductResponse(
        id=str(row["id"]),
        provider_name=row["provider_name"],
        provider_logo=row["provider_logo"] or "",
        product_name=row["product_name"],
        product_type=row["product_type"],
        description=row["description"] or "",
        features=_parse_features(row["features"]),
        affiliate_link=row["affiliate_link"] or "#",
        is_islamic=row["is_islamic"],
        is_active=row["is_active"],
    )
