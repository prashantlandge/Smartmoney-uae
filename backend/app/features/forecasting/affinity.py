"""Product affinity scoring — computes how well each product matches a user."""

import json
import logging
from app.db.connection import get_pool

logger = logging.getLogger(__name__)


async def compute_affinity_scores() -> int:
    """Batch job: compute affinity scores for active users."""
    pool = await get_pool()

    # Get active sessions with segments
    sessions = await pool.fetch(
        """SELECT us.session_id, us.segment
           FROM user_segments us
           WHERE us.computed_at > NOW() - INTERVAL '7 days'"""
    )

    products = await pool.fetch(
        """SELECT p.id, p.category, p.min_salary_aed, p.islamic_compliant,
                  p.nationality_restrictions, pr.name_en as provider_name
           FROM products p
           JOIN providers pr ON p.provider_id = pr.id
           WHERE p.active = true"""
    )

    count = 0
    for session in sessions:
        sid = session["session_id"]
        segment = session["segment"]

        # Get user's click history
        clicks = await pool.fetch(
            """SELECT event_data FROM user_events
               WHERE session_id = $1 AND event_type IN ('click_product', 'click_provider', 'click_recommendation')
               ORDER BY created_at DESC LIMIT 50""",
            sid,
        )

        clicked_providers = set()
        clicked_categories = set()
        for c in clicks:
            data = c["event_data"]
            if isinstance(data, str):
                try:
                    data = json.loads(data)
                except (json.JSONDecodeError, TypeError):
                    continue
            if isinstance(data, dict):
                if data.get("provider_name"):
                    clicked_providers.add(data["provider_name"])
                if data.get("category"):
                    clicked_categories.add(data["category"])

        # Get profile
        profile = await pool.fetchrow(
            "SELECT monthly_salary_aed, nationality, islamic_preference FROM user_profiles WHERE session_id = $1",
            sid,
        )
        salary = float(profile["monthly_salary_aed"]) if profile and profile.get("monthly_salary_aed") else 0
        islamic_pref = profile["islamic_preference"] if profile else False

        # Score each product
        for prod in products:
            pid = prod["id"]

            # Click score (0-30)
            click_score = 0
            if prod["provider_name"] in clicked_providers:
                click_score += 15
            if prod["category"] in clicked_categories:
                click_score += 15
            click_score = min(click_score, 30)

            # Segment match score (0-30)
            segment_score = _segment_product_match(segment, prod)

            # Profile match score (0-20)
            profile_score = 20  # Start with full, subtract for mismatches
            if prod["min_salary_aed"] and salary > 0 and salary < float(prod["min_salary_aed"]):
                profile_score = max(0, profile_score - 15)
            if islamic_pref and not prod["islamic_compliant"]:
                profile_score = max(0, profile_score - 10)

            # Similar users score (0-20) — from social proof
            similar_score = 0
            sp_row = await pool.fetchrow(
                "SELECT click_count FROM social_proof_stats WHERE segment = $1 AND product_id = $2",
                segment, pid,
            )
            if sp_row and sp_row["click_count"] >= 3:
                similar_score = min(20, sp_row["click_count"] * 4)

            total = min(click_score + segment_score + profile_score + similar_score, 100)

            signals = {
                "click_score": click_score,
                "segment_match": segment_score,
                "profile_match": profile_score,
                "similar_users": similar_score,
            }

            await pool.execute(
                """INSERT INTO product_affinity_scores (session_id, product_id, affinity_score, signals, computed_at)
                   VALUES ($1, $2, $3, $4, NOW())
                   ON CONFLICT (session_id, product_id)
                   DO UPDATE SET affinity_score = $3, signals = $4, computed_at = NOW()""",
                sid,
                pid,
                total,
                json.dumps(signals),
            )
            count += 1

    logger.info("Computed %d affinity scores", count)
    return count


def _segment_product_match(segment: str, product: dict) -> int:
    """Score how well a product matches a user segment (0-30)."""
    category = product.get("category", "")

    scores = {
        "fee_sensitive": {
            "personal_loan": 25,
            "current_account": 20,
            "remittance": 25,
        },
        "speed_first": {
            "remittance": 30,
            "credit_card": 20,
        },
        "price_hunter": {
            "credit_card": 25,
            "personal_loan": 20,
            "remittance": 25,
        },
        "islamic_focused": {
            "islamic_finance": 30,
            "home_finance": 20,
            "savings": 20,
        },
        "balanced": {},  # 15 for everything
    }

    segment_scores = scores.get(segment, {})
    return segment_scores.get(category, 15)
