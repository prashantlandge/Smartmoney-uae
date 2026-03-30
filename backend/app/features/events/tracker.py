"""Event recording — stores user interactions for behavioral intelligence."""

import json
from app.db.connection import get_pool


async def record_event(session_id: str, event_type: str, event_data: dict | None = None) -> None:
    pool = await get_pool()
    await pool.execute(
        """
        INSERT INTO user_events (session_id, event_type, event_data)
        VALUES ($1, $2, $3)
        """,
        session_id,
        event_type,
        json.dumps(event_data or {}),
    )


async def record_affiliate_click(
    session_id: str,
    provider_name: str,
    affiliate_link: str,
    send_amount_aed: float | None = None,
) -> None:
    """Record an affiliate click in both user_events and affiliate_clicks tables."""
    pool = await get_pool()

    # Record in user_events
    await record_event(session_id, "click_provider", {
        "provider_name": provider_name,
        "affiliate_link": affiliate_link,
        "send_amount_aed": send_amount_aed,
    })

    # Record in affiliate_clicks (find product_id by provider name)
    product_row = await pool.fetchrow(
        """
        SELECT p.id FROM products p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE pr.name_en = $1 AND p.category = 'remittance'
        LIMIT 1
        """,
        provider_name,
    )

    product_id = product_row["id"] if product_row else None

    await pool.execute(
        """
        INSERT INTO affiliate_clicks (product_id, session_id, utm_source, utm_medium, utm_campaign)
        VALUES ($1, $2, 'uae_platform', 'remittance', $3)
        """,
        product_id,
        session_id,
        provider_name.lower().replace(" ", "_"),
    )
