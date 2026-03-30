import httpx
from bs4 import BeautifulSoup
from .base import RemittanceProvider, ProviderRate


class UAEExchangeProvider(RemittanceProvider):
    """Scrape AED→INR rates from UAE Exchange / Lulu Exchange public pages."""

    RATE_URL = "https://www.uaeexchange.com/exchange-rates"

    async def fetch_rate(self, send_amount_aed: float) -> ProviderRate | None:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(
                    self.RATE_URL,
                    headers={
                        "User-Agent": "Mozilla/5.0 (compatible; SmartMoneyBot/1.0)"
                    },
                )
                resp.raise_for_status()

                soup = BeautifulSoup(resp.text, "lxml")
                rate = self._parse_inr_rate(soup)
                if not rate:
                    return None

                return ProviderRate(
                    provider_name="UAE Exchange",
                    provider_logo="/images/providers/uae-exchange.svg",
                    exchange_rate=rate,
                    fee_aed=0,
                    transfer_speed_hours=24,
                    affiliate_link="https://uaeexchange.com?utm_source=uae_platform&utm_medium=remittance&utm_campaign=uae_exchange",
                )
        except Exception:
            return None

    def _parse_inr_rate(self, soup: BeautifulSoup) -> float | None:
        for row in soup.find_all("tr"):
            cells = row.find_all("td")
            for cell in cells:
                text = cell.get_text(strip=True).upper()
                if "INR" in text or "INDIAN" in text:
                    for sibling_cell in cells:
                        try:
                            val = float(sibling_cell.get_text(strip=True).replace(",", ""))
                            if 15 < val < 30:
                                return val
                        except ValueError:
                            continue
        return None
