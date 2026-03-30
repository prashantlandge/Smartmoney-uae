"""Query rate history for charts and trend analysis."""

from datetime import datetime, timedelta, timezone
from app.db.connection import get_pool
from app.features.rates.schemas import RateHistoryPoint, RateHistoryResponse


async def get_rate_history(
    days: int = 7,
    provider_id: str | None = None,
    send_currency: str = "AED",
    receive_currency: str = "INR",
) -> RateHistoryResponse:
    pool = await get_pool()
    since = datetime.now(timezone.utc) - timedelta(days=days)

    if provider_id:
        rows = await pool.fetch(
            """
            SELECT h.exchange_rate, h.fee_aed, h.effective_rate, h.recorded_at,
                   p.name_en as provider_name
            FROM remittance_rate_history h
            JOIN providers p ON h.provider_id = p.id
            WHERE h.provider_id = $1
              AND h.send_currency = $2
              AND h.receive_currency = $3
              AND h.recorded_at >= $4
            ORDER BY h.recorded_at ASC
            """,
            provider_id, send_currency, receive_currency, since,
        )
    else:
        rows = await pool.fetch(
            """
            SELECT h.exchange_rate, h.fee_aed, h.effective_rate, h.recorded_at,
                   p.name_en as provider_name
            FROM remittance_rate_history h
            JOIN providers p ON h.provider_id = p.id
            WHERE h.send_currency = $1
              AND h.receive_currency = $2
              AND h.recorded_at >= $3
            ORDER BY h.recorded_at ASC
            """,
            send_currency, receive_currency, since,
        )

    points = [
        RateHistoryPoint(
            provider_name=row["provider_name"],
            exchange_rate=float(row["exchange_rate"]),
            effective_rate=float(row["effective_rate"]) if row["effective_rate"] else None,
            fee_aed=float(row["fee_aed"]),
            recorded_at=row["recorded_at"],
        )
        for row in rows
    ]

    return RateHistoryResponse(
        send_currency=send_currency,
        receive_currency=receive_currency,
        days=days,
        points=points,
    )
