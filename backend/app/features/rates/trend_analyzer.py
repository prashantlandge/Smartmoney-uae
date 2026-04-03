"""Analyze rate trends from historical data."""

from datetime import datetime, timedelta
from app.db.connection import get_pool
from app.features.rates.schemas import RateTrendResponse, BestTimeResponse


async def get_rate_trend(
    send_currency: str = "AED",
    receive_currency: str = "INR",
) -> RateTrendResponse:
    pool = await get_pool()
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    # Current average rate (last 24 hours)
    current = await pool.fetchrow(
        """
        SELECT AVG(exchange_rate) as avg_rate
        FROM remittance_rate_history
        WHERE send_currency = $1 AND receive_currency = $2
          AND recorded_at >= $3
        """,
        send_currency, receive_currency, now - timedelta(hours=24),
    )

    # Week-ago average rate (24h window starting 7 days ago)
    past = await pool.fetchrow(
        """
        SELECT AVG(exchange_rate) as avg_rate
        FROM remittance_rate_history
        WHERE send_currency = $1 AND receive_currency = $2
          AND recorded_at >= $3 AND recorded_at < $4
        """,
        send_currency, receive_currency,
        week_ago - timedelta(hours=24), week_ago,
    )

    current_rate = float(current["avg_rate"]) if current and current["avg_rate"] else 0
    past_rate = float(past["avg_rate"]) if past and past["avg_rate"] else current_rate

    if past_rate > 0:
        change = ((current_rate - past_rate) / past_rate) * 100
    else:
        change = 0

    if change > 0.1:
        direction = "up"
        summary = f"AED to {receive_currency} rate is up {abs(change):.1f}% this week — good time to send!"
    elif change < -0.1:
        direction = "down"
        summary = f"AED to {receive_currency} rate is down {abs(change):.1f}% this week — you might want to wait."
    else:
        direction = "stable"
        summary = f"AED to {receive_currency} rate is stable this week."

    return RateTrendResponse(
        send_currency=send_currency,
        receive_currency=receive_currency,
        current_avg_rate=round(current_rate, 4),
        week_ago_avg_rate=round(past_rate, 4),
        change_percent=round(change, 2),
        direction=direction,
        summary=summary,
    )


async def get_best_time_to_send(
    send_currency: str = "AED",
    receive_currency: str = "INR",
) -> BestTimeResponse:
    pool = await get_pool()

    # Analyze by day of week over last 30 days
    rows = await pool.fetch(
        """
        SELECT EXTRACT(DOW FROM recorded_at) as day_of_week,
               AVG(exchange_rate) as avg_rate,
               COUNT(*) as data_points
        FROM remittance_rate_history
        WHERE send_currency = $1 AND receive_currency = $2
          AND recorded_at >= NOW() - INTERVAL '30 days'
        GROUP BY EXTRACT(DOW FROM recorded_at)
        ORDER BY avg_rate DESC
        LIMIT 1
        """,
        send_currency, receive_currency,
    )

    total_count = await pool.fetchval(
        """
        SELECT COUNT(*) FROM remittance_rate_history
        WHERE send_currency = $1 AND receive_currency = $2
          AND recorded_at >= NOW() - INTERVAL '30 days'
        """,
        send_currency, receive_currency,
    )

    day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    if rows and rows[0]["avg_rate"]:
        best_day_num = int(rows[0]["day_of_week"])
        best_day = day_names[best_day_num]
        avg_rate = float(rows[0]["avg_rate"])

        return BestTimeResponse(
            recommendation=f"Based on 30-day patterns, {best_day}s tend to have the best AED to {receive_currency} rates (avg {avg_rate:.4f}).",
            best_day=best_day,
            avg_rate_at_best_time=round(avg_rate, 4),
            data_points_analyzed=total_count or 0,
        )

    return BestTimeResponse(
        recommendation="Not enough data yet to determine the best time to send. Check back after a few days of rate tracking.",
        data_points_analyzed=total_count or 0,
    )
