import httpx
from app.config import settings
from .base import RemittanceProvider, ProviderRate


class WesternUnionProvider(RemittanceProvider):
    """Fetch live AED→INR rates from Western Union API."""

    API_BASE = "https://www.westernunion.com/wuconnect/rest/api/v1.0"

    async def fetch_rate(self, send_amount_aed: float) -> ProviderRate | None:
        if not settings.western_union_affiliate_id:
            return None
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.post(
                    f"{self.API_BASE}/GetEstimatedDeliveryDate",
                    json={
                        "sendAmount": str(send_amount_aed),
                        "sendCurrency": "AED",
                        "receiveCurrency": "INR",
                        "sendCountry": "AE",
                        "receiveCountry": "IN",
                    },
                )
                resp.raise_for_status()
                data = resp.json()

                rate = float(data.get("exchangeRate", 0))
                fee = float(data.get("totalFee", 0))

                return ProviderRate(
                    provider_name="Western Union",
                    provider_logo="/images/providers/western-union.svg",
                    exchange_rate=rate,
                    fee_aed=fee,
                    transfer_speed_hours=48,
                    affiliate_link=f"https://westernunion.com/ae/en/send-money.html?utm_source=uae_platform&utm_medium=remittance&utm_campaign=western_union",
                )
        except Exception:
            return None
