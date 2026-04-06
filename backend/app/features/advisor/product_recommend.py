"""AI-powered product recommendation engine using Claude."""

import json
import re
import logging
from app.config import settings
from app.db.connection import get_pool
from app.features.advisor.schemas import ProductRecommendation
import anthropic

logger = logging.getLogger(__name__)


def _extract_json_array(raw: str) -> list[dict]:
    """Robustly extract a JSON array from Claude's response text."""
    raw = raw.strip()
    try:
        result = json.loads(raw)
        if isinstance(result, list):
            return result
    except json.JSONDecodeError:
        pass
    if "```" in raw:
        match = re.search(r'```(?:json)?\s*\n?(.*?)```', raw, re.DOTALL)
        if match:
            try:
                result = json.loads(match.group(1).strip())
                if isinstance(result, list):
                    return result
            except json.JSONDecodeError:
                pass
    bracket_start = raw.find('[')
    bracket_end = raw.rfind(']')
    if bracket_start != -1 and bracket_end > bracket_start:
        try:
            result = json.loads(raw[bracket_start:bracket_end + 1])
            if isinstance(result, list):
                return result
        except json.JSONDecodeError:
            pass
    logger.warning("Failed to extract JSON array from Claude response: %s", raw[:200])
    return []


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

    # Inject segment context if available
    segment_context = ""
    try:
        from app.features.segmentation.engine import get_user_segment
        # Use session_id from profile if available (passed via quiz)
        if profile.get("session_id"):
            segment, confidence = await get_user_segment(profile["session_id"])
            segment_context = (
                f"\n\nUser behavioral segment: {segment} (confidence: {confidence:.0%}). "
                f"Prioritize products matching this behavioral pattern."
            )
    except Exception:
        pass

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=SYSTEM_PRODUCT_RECOMMEND,
        messages=[{
            "role": "user",
            "content": f"User profile: {json.dumps(profile)}\n\nAvailable products: {json.dumps(products_data)}"
            + segment_context,
        }],
    )

    raw = response.content[0].text
    recs = _extract_json_array(raw)
    result = []
    for r in recs[:5]:
        try:
            result.append(
                ProductRecommendation(
                    product_id=r["product_id"],
                    product_name=r["product_name"],
                    provider_name=r["provider_name"],
                    score=r["score"],
                    reason=r["reason"],
                    highlight=r.get("highlight", ""),
                )
            )
        except (KeyError, TypeError):
            continue
    return result
