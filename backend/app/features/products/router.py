from fastapi import APIRouter, HTTPException
from typing import List
from app.db.connection import get_pool
from app.features.products.schemas import ProductResponse

router = APIRouter()


@router.get("/list/{category}", response_model=List[ProductResponse])
async def list_products(category: str):
    """List products by category."""
    pool = await get_pool()

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

    return [
        ProductResponse(
            id=str(row["id"]),
            provider_name=row["provider_name"],
            provider_logo=row["provider_logo"] or "",
            product_name=row["product_name"],
            product_type=row["product_type"],
            description=row["description"] or "",
            features=row["features"] or {},
            affiliate_link=row["affiliate_link"] or "#",
            is_islamic=row["is_islamic"],
            is_active=row["is_active"],
        )
        for row in rows
    ]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get a single product by ID."""
    pool = await get_pool()

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
        product_id,
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
        features=row["features"] or {},
        affiliate_link=row["affiliate_link"] or "#",
        is_islamic=row["is_islamic"],
        is_active=row["is_active"],
    )
