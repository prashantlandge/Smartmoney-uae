import httpx
from app.config import settings
from .base import RemittanceProvider, ProviderRate


class RemitlyProvider(RemittanceProvider):
    """Fetch live AED→INR rates from Remitly API."""

    API_BASE = "https://api.remitly.io/v3"

    async def fetch_rate(self, send_amount_aed: float) -> ProviderRate | None:
        if not settings.remitly_api_key:
            return None
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    f"{self.API_BASE}/calculator/estimate",
                    params={
                        "sendCountry": "ARE",
                        "receiveCountry": "IND",
                        "sendCurrency": "AED",
                        "receiveCurrency": "INR",
                        "sendAmount": send_amount_aed,
                    },
                    headers={"Authorization": f"Bearer {settings.remitly_api_key}"},
                )
                resp.raise_for_status()
                data = resp.json()

                rate = data.get("exchangeRate", 0)
                fee = data.get("totalFee", 0)
                speed_min = data.get("deliverySpeedMinutes", 240)

                return ProviderRate(
                    provider_name="Remitly",
                    provider_logo="/images/providers/remitly.svg",
                    exchange_rate=rate,
                    fee_aed=fee,
                    transfer_speed_hours=max(1, speed_min // 60),
                    affiliate_link=f"https://remitly.com/us/en/india?utm_source=uae_platform&utm_medium=remittance&utm_campaign=remitly&amount={send_amount_aed}",
                )
        except Exception:
            return None
