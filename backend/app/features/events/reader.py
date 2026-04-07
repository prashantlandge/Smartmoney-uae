"""Event reader — reads user events back for personalization context."""

import json
from collections import Counter
from app.db.connection import get_pool


async def get_recent_events(session_id: str, limit: int = 50) -> list[dict]:
    """Read recent user events for a session."""
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT event_type, event_data, created_at
           FROM user_events
           WHERE session_id = $1
           ORDER BY created_at DESC LIMIT $2""",
        session_id,
        limit,
    )
    result = []
    for r in rows:
        data = r["event_data"]
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except (json.JSONDecodeError, TypeError):
                data = {}
        result.append({
            "event_type": r["event_type"],
            "event_data": data,
            "created_at": str(r["created_at"]),
        })
    return result


async def get_browsing_summary(session_id: str) -> str:
    """Build a text summary of user's browsing history for Claude context.

    Returns a concise string (max ~200 words) describing what the user
    has been looking at, suitable for injection into Claude prompts.
    """
    events = await get_recent_events(session_id, limit=50)
    if not events:
        return ""

    # Aggregate by type
    type_counts = Counter(e["event_type"] for e in events)

    # Extract providers clicked
    providers_clicked = []
    products_viewed = []
    categories_browsed = set()
    amounts = []

    for e in events:
        data = e.get("event_data", {})
        if not isinstance(data, dict):
            continue

        if e["event_type"] in ("click_provider", "click_product"):
            name = data.get("provider_name") or data.get("product_name")
            if name:
                providers_clicked.append(name)

        if data.get("product_name"):
            products_viewed.append(data["product_name"])

        if data.get("category"):
            categories_browsed.add(data["category"])
        if data.get("product_type"):
            categories_browsed.add(data["product_type"])

        if data.get("send_amount_aed"):
            try:
                amounts.append(float(data["send_amount_aed"]))
            except (ValueError, TypeError):
                pass

    parts = []
    if providers_clicked:
        top = Counter(providers_clicked).most_common(5)
        parts.append(f"Clicked providers: {', '.join(f'{n}({c}x)' for n, c in top)}")

    if products_viewed:
        top = Counter(products_viewed).most_common(5)
        parts.append(f"Viewed products: {', '.join(f'{n}' for n, _ in top)}")

    if categories_browsed:
        parts.append(f"Categories browsed: {', '.join(sorted(categories_browsed))}")

    if amounts:
        avg = sum(amounts) / len(amounts)
        parts.append(f"Avg send amount: AED {avg:.0f}")

    compare_count = type_counts.get("compare_rates", 0) + type_counts.get("compare", 0)
    if compare_count:
        parts.append(f"Rate comparisons: {compare_count}")

    return ". ".join(parts) if parts else ""
