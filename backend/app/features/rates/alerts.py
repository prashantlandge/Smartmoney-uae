"""Rate alert management — create, check, and trigger alerts."""

from app.db.connection import get_pool
from app.features.rates.schemas import RateAlertCreateRequest, RateAlertResponse


async def create_alert(request: RateAlertCreateRequest) -> RateAlertResponse:
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        INSERT INTO rate_alerts (session_id, email, target_rate, direction, send_currency, receive_currency)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, target_rate, direction, active, created_at
        """,
        request.session_id,
        request.email,
        request.target_rate,
        request.direction,
        request.send_currency,
        request.receive_currency,
    )
    return RateAlertResponse(
        id=str(row["id"]),
        target_rate=float(row["target_rate"]),
        direction=row["direction"],
        active=row["active"],
        created_at=row["created_at"],
    )


async def check_and_trigger_alerts(
    current_rate: float,
    send_currency: str = "AED",
    receive_currency: str = "INR",
) -> list[dict]:
    """Check active alerts against current rate and mark triggered ones."""
    pool = await get_pool()
    triggered = await pool.fetch(
        """
        UPDATE rate_alerts
        SET active = false, triggered_at = NOW()
        WHERE active = true
          AND send_currency = $1
          AND receive_currency = $2
          AND (
            (direction = 'above' AND $3 >= target_rate)
            OR (direction = 'below' AND $3 <= target_rate)
          )
        RETURNING id, session_id, email, target_rate, direction
        """,
        send_currency, receive_currency, current_rate,
    )
    return [dict(row) for row in triggered]
