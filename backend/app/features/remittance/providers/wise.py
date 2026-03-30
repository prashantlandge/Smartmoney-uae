import httpx
from app.config import settings
from .base import RemittanceProvider, ProviderRate


class WiseProvider(RemittanceProvider):
    """Fetch live AED→INR rates from Wise API."""

    API_BASE = "https://api.wise.com"

    async def fetch_rate(self, send_amount_aed: float) -> ProviderRate | None:
        if not settings.wise_api_key:
            return None
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Get quote for AED to INR
                resp = await client.get(
                    f"{self.API_BASE}/v3/quotes",
                    params={
                        "sourceCurrency": "AED",
                        "targetCurrency": "INR",
                        "sourceAmount": send_amount_aed,
                    },
                    headers={"Authorization": f"Bearer {settings.wise_api_key}"},
                )
                resp.raise_for_status()
                data = resp.json()

                rate = data.get("rate", 0)
                fee = data.get("fee", 0)
                delivery_hours = 24  # default estimate

                # Parse delivery estimate if available
                estimates = data.get("deliveryEstimate", {})
                if estimates.get("estimatedDeliveryHours"):
                    delivery_hours = estimates["estimatedDeliveryHours"]

                return ProviderRate(
                    provider_name="Wise",
                    provider_logo="/images/providers/wise.svg",
                    exchange_rate=rate,
                    fee_aed=fee,
                    transfer_speed_hours=delivery_hours,
                    affiliate_link=f"https://wise.com/send?source=AED&target=INR&amount={send_amount_aed}&utm_source=uae_platform&utm_medium=remittance&utm_campaign=wise",
                )
        except Exception:
            return None
