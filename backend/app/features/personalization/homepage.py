"""Homepage personalization — adapts content for returning users."""

import json
import logging
from app.db.connection import get_pool

logger = logging.getLogger(__name__)

# Default category order
DEFAULT_CATEGORIES = [
    "remittance", "credit_card", "personal_loan", "savings",
    "car_insurance", "health_insurance", "islamic_finance",
    "home_finance", "current_account",
]


async def get_personalized_homepage(session_id: str) -> dict:
    """Get personalized homepage configuration for a user.

    Returns category ordering, featured products, and segment-specific messaging.
    """
    pool = await get_pool()

    # Check if returning user
    profile = await pool.fetchrow(
        """SELECT nationality, monthly_salary_aed, islamic_preference,
                  spending_categories, quiz_completed_at
           FROM user_profiles WHERE session_id = $1""",
        session_id,
    )

    segment_row = await pool.fetchrow(
        "SELECT segment, confidence FROM user_segments WHERE session_id = $1",
        session_id,
    )

    if not profile or not segment_row:
        return {
            "personalized": False,
            "categories": DEFAULT_CATEGORIES,
            "featured_products": [],
            "hero_message": None,
        }

    segment = segment_row["segment"]

    # Reorder categories based on segment
    category_order = _get_category_order(segment)

    # Get top affinity products
    featured = await pool.fetch(
        """SELECT pas.product_id, p.name_en, pr.name_en as provider_name,
                  p.category, pas.affinity_score
           FROM product_affinity_scores pas
           JOIN products p ON pas.product_id = p.id
           JOIN providers pr ON p.provider_id = pr.id
           WHERE pas.session_id = $1
           ORDER BY pas.affinity_score DESC
           LIMIT 3""",
        session_id,
    )

    hero_messages = {
        "fee_sensitive": "Find the lowest-cost financial products in UAE",
        "speed_first": "Fast transfers, instant approvals — products for busy professionals",
        "balanced": "Smart choices across all your financial needs",
        "price_hunter": "Compare and save — the best deals in one place",
        "islamic_focused": "Shariah-compliant financial products for your values",
        "new_user": "Welcome to SmartMoney UAE — your financial comparison platform",
    }

    return {
        "personalized": True,
        "segment": segment,
        "categories": category_order,
        "featured_products": [
            {
                "product_id": str(r["product_id"]),
                "product_name": r["name_en"],
                "provider_name": r["provider_name"],
                "category": r["category"],
                "affinity_score": float(r["affinity_score"]),
            }
            for r in featured
        ],
        "hero_message": hero_messages.get(segment),
    }


def _get_category_order(segment: str) -> list[str]:
    """Reorder categories based on user segment."""
    orders = {
        "fee_sensitive": [
            "remittance", "current_account", "personal_loan", "savings",
            "credit_card", "car_insurance", "health_insurance",
            "islamic_finance", "home_finance",
        ],
        "speed_first": [
            "remittance", "credit_card", "current_account", "personal_loan",
            "savings", "car_insurance", "health_insurance",
            "islamic_finance", "home_finance",
        ],
        "islamic_focused": [
            "islamic_finance", "home_finance", "savings", "remittance",
            "credit_card", "personal_loan", "current_account",
            "car_insurance", "health_insurance",
        ],
        "price_hunter": [
            "credit_card", "remittance", "personal_loan", "savings",
            "car_insurance", "health_insurance", "current_account",
            "islamic_finance", "home_finance",
        ],
    }
    return orders.get(segment, DEFAULT_CATEGORIES)
