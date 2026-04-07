"""Scraper for Citibank UAE products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.citibank")


class CitibankScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000011"
    PROVIDER_NAME = "Citibank UAE"
    BASE_URL = "https://www.citibank.ae"

    CC_URL = "https://www.citibank.ae/credit-cards"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        products = []
        soup = await self.fetch_page(self.CC_URL)
        if not soup:
            return self._fallback_credit_cards()

        card_sections = soup.find_all("div", class_=re.compile(r"card|product", re.I))
        for section in card_sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                if not any(kw in title.lower() for kw in ["citi", "card", "prestige", "premier", "rewards", "cashback"]):
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_card_features(section)
                link = self._extract_link(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"Citibank {title}" if "citi" not in title.lower() else title,
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/credit-cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Citibank] Error parsing card: {e}")

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        # Citibank UAE focuses on credit cards
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _extract_card_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
        if cb:
            features["cashback_rate"] = f"up to {cb.group(1)}%"

        fee = re.search(r"annual\s*fee\s*(?:of|:)?\s*(?:aed\s*)?([\d,]+)", text)
        if fee:
            features["annual_fee"] = f"AED {fee.group(1)}"

        sal = re.search(r"(?:min(?:imum)?\s*salary|salary)\s*(?:aed\s*)?([\d,]+)", text)
        if sal:
            features["min_salary"] = float(sal.group(1).replace(",", ""))

        features["lounge_access"] = "lounge" in text
        return features

    def _extract_link(self, section) -> str:
        link = section.find("a", href=True)
        if link:
            href = link["href"]
            if href.startswith("/"):
                return f"{self.BASE_URL}{href}?utm_source=smartmoney"
            if href.startswith("http"):
                sep = "&" if "?" in href else "?"
                return f"{href}{sep}utm_source=smartmoney"
        return ""

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[Citibank] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Citi Prestige Credit Card",
                name_ar="بطاقة سيتي بريستيج",
                description_en="Premium card with complimentary 4th night hotel benefit and unlimited airport lounge access.",
                min_salary_aed=30000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 1,500",
                    "min_salary": "AED 30,000",
                    "lounge_access": True,
                    "travel_insurance": True,
                    "concierge": True,
                    "hotel_benefit": "4th night free",
                    "contactless": True,
                    "apple_pay": True,
                    "best_for": "Premium travelers",
                },
                affiliate_deep_link_en="https://citibank.ae/prestige?utm_source=smartmoney",
                commission_amount_aed=500,
                data_source="scrape_fallback",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Citi Cashback Credit Card",
                name_ar="بطاقة سيتي كاش باك",
                description_en="Earn up to 5% cashback on supermarkets and utility bills.",
                min_salary_aed=10000,
                representative_rate=3.25,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 500",
                    "cashback_rate": "up to 5%",
                    "min_salary": "AED 10,000",
                    "contactless": True,
                    "best_for": "Supermarket and utility cashback",
                },
                affiliate_deep_link_en="https://citibank.ae/cashback?utm_source=smartmoney",
                commission_amount_aed=300,
                data_source="scrape_fallback",
            ),
        ]
