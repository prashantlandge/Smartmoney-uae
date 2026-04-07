"""Scrapers for digital banks: Liv. by Emirates NBD and Wio Bank."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.digital_banks")


class LivScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000012"
    PROVIDER_NAME = "Liv."
    BASE_URL = "https://www.liv.me"

    CC_URL = "https://www.liv.me/en/cards"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.CC_URL)
        if not soup:
            return self._fallback_credit_cards()

        products = []
        card_sections = soup.find_all("div", class_=re.compile(r"card|product", re.I))
        for section in card_sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 3:
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_features(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"Liv. {title}" if "liv" not in title.lower() else title,
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Liv] Error parsing card: {e}")

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _extract_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
        if cb:
            features["cashback_rate"] = f"up to {cb.group(1)}%"

        if "no annual fee" in text or "zero fee" in text:
            features["annual_fee"] = "AED 0"

        features["digital_only"] = True
        return features

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[Liv] Using fallback data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Liv. Credit Card",
                name_ar="بطاقة ليف",
                description_en="Digital-first credit card from Liv. by Emirates NBD. No annual fee, instant issuance.",
                min_salary_aed=5000,
                representative_rate=3.25,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 0",
                    "cashback_rate": "up to 2%",
                    "digital_only": True,
                    "instant_issuance": True,
                    "contactless": True,
                    "apple_pay": True,
                    "best_for": "Digital-first banking",
                },
                affiliate_deep_link_en="https://liv.me/cards?utm_source=smartmoney",
                data_source="scrape_fallback",
            ),
        ]


class WioScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000013"
    PROVIDER_NAME = "Wio Bank"
    BASE_URL = "https://wio.io"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        # Wio is primarily a digital bank — limited public product pages
        return self._fallback_credit_cards()

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[Wio] Using fallback data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Wio Credit Card",
                name_ar="بطاقة ويو",
                description_en="Digital-first credit card from Wio Bank. Zero annual fee, instant issuance via app.",
                min_salary_aed=5000,
                representative_rate=3.25,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 0",
                    "cashback_rate": "up to 1.5%",
                    "digital_only": True,
                    "instant_issuance": True,
                    "contactless": True,
                    "best_for": "Digital-first banking, SME owners",
                },
                affiliate_deep_link_en="https://wio.io?utm_source=smartmoney",
                data_source="scrape_fallback",
            ),
        ]
