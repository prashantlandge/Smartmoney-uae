"""
Remittance Comparison Engine — Core Logic

Fetches live rates from multiple providers, calculates effective rates,
ranks by best value for the recipient, and caches results.
"""

import asyncio
from datetime import datetime, timezone

from app.db.connection import get_pool
from app.features.remittance.providers.base import ProviderRate
from app.features.remittance.providers.wise import WiseProvider
from app.features.remittance.providers.remitly import RemitlyProvider
from app.features.remittance.providers.western_union import WesternUnionProvider
from app.features.remittance.providers.al_ansari import AlAnsariProvider
from app.features.remittance.providers.uae_exchange import UAEExchangeProvider
from app.features.remittance.providers.lulu_exchange import LuluExchangeProvider
from app.features.remittance.providers.xe_baseline import XEBaseline
from app.features.remittance.cache import get_cached_result, set_cached_result
from app.features.remittance.schemas import (
    ProviderResult,
    RemittanceCompareResponse,
)
from app.features.rates.recorder import record_rates


PROVIDERS = [
    WiseProvider(),
    RemitlyProvider(),
    WesternUnionProvider(),
    AlAnsariProvider(),
    UAEExchangeProvider(),
    LuluExchangeProvider(),
]

XE = XEBaseline()


def _format_speed(hours: int) -> str:
    if hours < 1:
        return "Minutes"
    if hours <= 1:
        return "1 hour"
    if hours < 24:
        return f"{hours} hours"
    days = hours // 24
    if days == 1:
        return "1 business day"
    return f"{days} business days"


async def _fetch_db_fallback_rates(send_amount_aed: float) -> list[ProviderRate]:
    """Fall back to database rates when live APIs are unavailable."""
    pool = await get_pool()
    rows = await pool.fetch(
        """
        SELECT r.exchange_rate, r.fee_aed, r.transfer_speed_hours,
               r.affiliate_link, p.name_en, p.logo_url
        FROM remittance_rates r
        JOIN providers p ON r.provider_id = p.id
        WHERE r.send_currency = 'AED' AND r.receive_currency = 'INR'
          AND p.active = true
        ORDER BY r.updated_at DESC
        """
    )
    rates = []
    for row in rows:
        rates.append(
            ProviderRate(
                provider_name=row["name_en"],
                provider_logo=row["logo_url"] or "",
                exchange_rate=float(row["exchange_rate"]),
                fee_aed=float(row["fee_aed"]),
                transfer_speed_hours=row["transfer_speed_hours"] or 24,
                affiliate_link=row["affiliate_link"] or "",
            )
        )
    return rates


async def _fetch_db_mid_market() -> float | None:
    """Get average rate from DB as mid-market fallback."""
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        SELECT AVG(exchange_rate) as avg_rate
        FROM remittance_rates
        WHERE send_currency = 'AED' AND receive_currency = 'INR'
        """
    )
    if row and row["avg_rate"]:
        return float(row["avg_rate"])
    return None


async def compare_rates(send_amount_aed: float, receive_currency: str = "INR") -> RemittanceCompareResponse:
    # 1. Check cache first
    cached = await get_cached_result(send_amount_aed, receive_currency)
    if cached:
        return RemittanceCompareResponse(**cached)

    # 2. Fetch live rates from all providers + XE mid-market in parallel
    provider_tasks = [p.fetch_rate(send_amount_aed) for p in PROVIDERS]
    xe_task = XE.fetch_mid_market_rate()

    results = await asyncio.gather(*provider_tasks, xe_task, return_exceptions=True)

    # Separate provider results from XE result
    provider_rates: list[ProviderRate] = []
    for result in results[:-1]:
        if isinstance(result, ProviderRate):
            provider_rates.append(result)

    xe_mid_market = results[-1] if isinstance(results[-1], float) else None

    # 2b. Record live rates to history for trend analysis
    if provider_rates:
        try:
            await record_rates(provider_rates, send_amount_aed, "AED", receive_currency)
        except Exception:
            pass  # History recording should never block the response

    # 3. Fall back to DB if no live rates available
    if not provider_rates:
        provider_rates = await _fetch_db_fallback_rates(send_amount_aed)

    if xe_mid_market is None:
        xe_mid_market = await _fetch_db_mid_market()

    # Final fallback for mid-market
    if xe_mid_market is None and provider_rates:
        xe_mid_market = sum(r.exchange_rate for r in provider_rates) / len(provider_rates)
    elif xe_mid_market is None:
        xe_mid_market = 22.50  # Hardcoded last-resort fallback

    # 4. Calculate effective rates and build response
    provider_results: list[ProviderResult] = []
    for rate in provider_rates:
        recipient_receives = (send_amount_aed - rate.fee_aed) * rate.exchange_rate
        effective_rate = recipient_receives / send_amount_aed if send_amount_aed > 0 else 0
        cost_vs_mid = ((xe_mid_market - effective_rate) / xe_mid_market * 100) if xe_mid_market > 0 else 0

        provider_results.append(
            ProviderResult(
                provider_name=rate.provider_name,
                provider_logo=rate.provider_logo,
                exchange_rate=round(rate.exchange_rate, 4),
                fee_aed=round(rate.fee_aed, 2),
                recipient_receives_inr=round(recipient_receives, 2),
                transfer_speed=_format_speed(rate.transfer_speed_hours),
                cost_vs_mid_market_percent=round(cost_vs_mid, 2),
                affiliate_link=rate.affiliate_link,
                savings_vs_worst=0,  # Calculated below
            )
        )

    # 5. Sort by recipient receives (best first)
    provider_results.sort(key=lambda p: p.recipient_receives_inr, reverse=True)

    # 6. Calculate savings vs worst provider
    if provider_results:
        worst_receives = provider_results[-1].recipient_receives_inr
        for p in provider_results:
            p.savings_vs_worst = round(p.recipient_receives_inr - worst_receives, 2)

    now = datetime.now(timezone.utc)
    response = RemittanceCompareResponse(
        mid_market_rate=round(xe_mid_market, 4),
        providers=provider_results,
        last_updated=now,
    )

    # 7. Cache the result
    await set_cached_result(send_amount_aed, receive_currency, response.model_dump())

    return response
