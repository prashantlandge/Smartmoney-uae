"""User segmentation engine — classifies users into behavioral segments."""

import json
import logging
from collections import Counter
from app.db.connection import get_pool

logger = logging.getLogger(__name__)

SEGMENTS = ['fee_sensitive', 'speed_first', 'balanced', 'price_hunter', 'islamic_focused', 'new_user']


async def extract_user_features(session_id: str) -> dict:
    """Extract behavioral features from user_events for a single user."""
    pool = await get_pool()
    rows = await pool.fetch(
        "SELECT event_type, event_data FROM user_events WHERE session_id = $1 ORDER BY created_at DESC LIMIT 200",
        session_id,
    )

    if not rows:
        return {}

    total_events = len(rows)
    type_counts = Counter()
    providers_clicked = []
    amounts = []
    categories = Counter()
    islamic_clicks = 0
    total_product_clicks = 0

    for r in rows:
        event_type = r["event_type"]
        type_counts[event_type] += 1

        data = r["event_data"]
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except (json.JSONDecodeError, TypeError):
                data = {}
        if not isinstance(data, dict):
            continue

        if event_type in ("click_provider", "click_product", "click_recommendation"):
            total_product_clicks += 1
            name = data.get("provider_name", "")
            if name:
                providers_clicked.append(name)
            if data.get("islamic") or data.get("islamic_compliant"):
                islamic_clicks += 1

        if data.get("send_amount_aed"):
            try:
                amounts.append(float(data["send_amount_aed"]))
            except (ValueError, TypeError):
                pass

        if data.get("category"):
            categories[data["category"]] += 1

    # Get profile data
    profile = await pool.fetchrow(
        """SELECT monthly_salary_aed, risk_tolerance, islamic_preference,
                  spending_categories, quiz_completed_at
           FROM user_profiles WHERE session_id = $1""",
        session_id,
    )

    salary = float(profile["monthly_salary_aed"]) if profile and profile.get("monthly_salary_aed") else 0
    risk = profile["risk_tolerance"] if profile else "moderate"
    islamic_pref = profile["islamic_preference"] if profile else False

    # Compute feature vector
    compare_count = type_counts.get("compare_rates", 0) + type_counts.get("compare", 0)
    sort_fee = type_counts.get("sort_by_fee", 0)
    sort_speed = type_counts.get("sort_by_speed", 0)

    features = {
        "total_events": total_events,
        "total_comparisons": compare_count,
        "total_product_clicks": total_product_clicks,
        "avg_send_amount": sum(amounts) / len(amounts) if amounts else 0,
        "sort_by_fee_count": sort_fee,
        "sort_by_speed_count": sort_speed,
        "islamic_click_ratio": islamic_clicks / max(total_product_clicks, 1),
        "islamic_preference": islamic_pref,
        "salary_aed": salary,
        "risk_tolerance": risk or "moderate",
        "unique_providers_clicked": len(set(providers_clicked)),
        "category_diversity": len(categories),
    }
    return features


def classify_segment(features: dict) -> tuple[str, float]:
    """Classify a user into a segment based on their feature vector.

    Uses rule-based classification initially. Can be replaced with KMeans
    once sufficient training data is accumulated.
    """
    if not features or features.get("total_events", 0) < 3:
        return "new_user", 0.5

    islamic_ratio = features.get("islamic_click_ratio", 0)
    islamic_pref = features.get("islamic_preference", False)
    if islamic_ratio > 0.3 or islamic_pref:
        return "islamic_focused", min(0.6 + islamic_ratio, 0.95)

    sort_fee = features.get("sort_by_fee_count", 0)
    sort_speed = features.get("sort_by_speed_count", 0)
    salary = features.get("salary_aed", 0)

    if sort_fee > sort_speed and salary < 10000:
        return "fee_sensitive", 0.75

    if sort_speed > sort_fee:
        return "speed_first", 0.7

    comparisons = features.get("total_comparisons", 0)
    clicks = features.get("total_product_clicks", 0)
    if comparisons > 5 and clicks < comparisons * 0.3:
        return "price_hunter", 0.65

    return "balanced", 0.6


async def compute_all_segments() -> int:
    """Batch job: compute segments for all users with sufficient event data."""
    pool = await get_pool()

    # Get all session_ids with >= 3 events in last 30 days
    sessions = await pool.fetch(
        """SELECT DISTINCT session_id
           FROM user_events
           WHERE created_at > NOW() - INTERVAL '30 days'
           GROUP BY session_id
           HAVING COUNT(*) >= 3""",
    )

    count = 0
    for row in sessions:
        sid = row["session_id"]
        try:
            features = await extract_user_features(sid)
            if not features:
                continue

            segment, confidence = classify_segment(features)

            await pool.execute(
                """INSERT INTO user_segments (session_id, segment, confidence, features, computed_at)
                   VALUES ($1, $2, $3, $4, NOW())
                   ON CONFLICT (session_id)
                   DO UPDATE SET segment = $2, confidence = $3, features = $4, computed_at = NOW()""",
                sid,
                segment,
                confidence,
                json.dumps(features, default=str),
            )
            count += 1
        except Exception as e:
            logger.warning("Failed to segment user %s: %s", sid, e)

    logger.info("Segmented %d users", count)
    return count


async def get_user_segment(session_id: str) -> tuple[str, float]:
    """Get cached segment for a user, or compute on-the-fly."""
    pool = await get_pool()
    row = await pool.fetchrow(
        "SELECT segment, confidence FROM user_segments WHERE session_id = $1",
        session_id,
    )
    if row:
        return row["segment"], float(row["confidence"])

    # Compute on-the-fly for unknown users
    features = await extract_user_features(session_id)
    return classify_segment(features)
