"""Records live rates into history table after each comparison fetch."""

from app.db.connection import get_pool
from app.features.remittance.providers.base import ProviderRate


async def record_rates(
    provider_rates: list[ProviderRate],
    send_amount_aed: float,
    send_currency: str = "AED",
    receive_currency: str = "INR",
) -> None:
    """Store fetched rates in the history table for trend analysis."""
    if not provider_rates:
        return

    pool = await get_pool()

    # Resolve provider IDs from names
    rows = await pool.fetch(
        "SELECT id, name_en FROM providers WHERE active = true"
    )
    name_to_id = {row["name_en"]: row["id"] for row in rows}

    for rate in provider_rates:
        provider_id = name_to_id.get(rate.provider_name)
        if not provider_id:
            continue

        effective = ((send_amount_aed - rate.fee_aed) * rate.exchange_rate) / send_amount_aed if send_amount_aed > 0 else 0

        await pool.execute(
            """
            INSERT INTO remittance_rate_history
                (provider_id, send_currency, receive_currency, exchange_rate, fee_aed, effective_rate)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            provider_id,
            send_currency,
            receive_currency,
            rate.exchange_rate,
            rate.fee_aed,
            effective,
        )
