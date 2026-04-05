"""AI-powered product recommendation engine using Claude."""

import json
from app.config import settings
from app.db.connection import get_pool
from app.features.advisor.schemas import ProductRecommendation
import anthropic


SYSTEM_PRODUCT_RECOMMEND = """You are a UAE financial product recommendation engine.

Given a user's profile and a list of available products, select the top products that best match
the user's needs. Score each recommended product from 0 to 100.

Matching criteria:
- Salary eligibility: Only recommend products the user qualifies for based on min_salary requirements
- Islamic preference: If user prefers Islamic products, prioritize Shariah-compliant options
- Spending habits: Match credit card rewards to user's top spending categories
- Risk tolerance: Conservative users get lower-risk products; aggressive users get high-reward options
- Transfer needs: For remittance users, match based on corridor, frequency, and amount
- Budget sensitivity: Lower-income users should see products with lower/no fees

Output a JSON array with objects:
{"product_id": string, "product_name": string, "provider_name": string, "score": int, "reason": string, "highlight": string}

The "highlight" field should be a short (5-7 word) tagline for why this product is great for the user.
Return maximum 5 products. Only output the JSON array, no other text."""


async def get_product_recommendations(
    profile: dict,
    category: str | None = None,
) -> list[ProductRecommendation]:
    """Get AI-scored product recommendations based on user profile."""
    if not settings.anthropic_api_key:
        return []

    pool = await get_pool()

    # Fetch products
    if category:
        category_map = {
            "credit-cards": "credit_card",
            "personal-loans": "personal_loan",
            "islamic-finance": "islamic_finance",
            "car-insurance": "car_insurance",
            "health-insurance": "health_insurance",
        }
        db_cat = category_map.get(category, category)
        rows = await pool.fetch(
            """SELECT p.id, p.name_en, p.category, p.description_en, p.key_features, p.islamic_compliant,
                      pr.name_en as provider_name
               FROM products p JOIN providers pr ON p.provider_id = pr.id
               WHERE p.active = true AND p.category = $1
               ORDER BY pr.name_en""",
            db_cat,
        )
    else:
        rows = await pool.fetch(
            """SELECT p.id, p.name_en, p.category, p.description_en, p.key_features, p.islamic_compliant,
                      pr.name_en as provider_name
               FROM products p JOIN providers pr ON p.provider_id = pr.id
               WHERE p.active = true
               ORDER BY pr.name_en LIMIT 50"""
        )

    if not rows:
        return []

    products_data = []
    for r in rows:
        features = r["key_features"]
        if isinstance(features, str):
            try:
                features = json.loads(features)
            except Exception:
                features = {}
        products_data.append({
            "id": str(r["id"]),
            "name": r["name_en"],
            "category": r["category"],
            "provider": r["provider_name"],
            "islamic": r["islamic_compliant"],
            "features": features or {},
            "description": r["description_en"] or "",
        })

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=SYSTEM_PRODUCT_RECOMMEND,
        messages=[{
            "role": "user",
            "content": f"User profile: {json.dumps(profile)}\n\nAvailable products: {json.dumps(products_data)}",
        }],
    )

    try:
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        recs = json.loads(raw)
        return [
            ProductRecommendation(
                product_id=r["product_id"],
                product_name=r["product_name"],
                provider_name=r["provider_name"],
                score=r["score"],
                reason=r["reason"],
                highlight=r.get("highlight", ""),
            )
            for r in recs[:5]
        ]
    except (json.JSONDecodeError, KeyError):
        return []
