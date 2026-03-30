import httpx
from app.config import settings


class XEBaseline:
    """Fetch mid-market AED→INR rate from XE API as baseline reference."""

    API_BASE = "https://xecdapi.xe.com/v1"

    async def fetch_mid_market_rate(self) -> float | None:
        if not settings.xe_api_key:
            return None
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    f"{self.API_BASE}/convert_from.json",
                    params={
                        "from": "AED",
                        "to": "INR",
                        "amount": 1,
                    },
                    auth=(settings.xe_api_key, ""),
                )
                resp.raise_for_status()
                data = resp.json()

                to_entries = data.get("to", [])
                if to_entries:
                    return float(to_entries[0].get("mid", 0))
        except Exception:
            pass
        return None
