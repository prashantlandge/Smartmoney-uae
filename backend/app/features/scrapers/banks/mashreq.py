"""Scraper for Mashreq Bank products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.mashreq")


class MashreqScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000004"
    PROVIDER_NAME = "Mashreq"
    BASE_URL = "https://www.mashreqbank.com"

    CC_URL = "https://www.mashreqbank.com/en/uae/personal/cards/credit-cards"
    PL_URL = "https://www.mashreqbank.com/en/uae/personal/loans"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.CC_URL)
        if not soup:
            return self._fallback_credit_cards()

        products = []
        cards = soup.find_all("div", class_=re.compile(r"card|product|tile", re.I))

        for card in cards:
            try:
                title_el = card.find(["h2", "h3", "h4", "h5"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                if not any(kw in title.lower() for kw in ["card", "neo", "solitaire", "platinum", "gold", "world"]):
                    continue

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""
                text = card.get_text(" ", strip=True).lower()
                features = {}

                cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
                if cb:
                    features["cashback_rate"] = f"up to {cb.group(1)}%"

                features["contactless"] = "contactless" in text
                features["apple_pay"] = "apple pay" in text or "apple" in text

                fee_m = re.search(r"(?:fee)\s*(?:aed\s*)?([\d,]+)", text)
                if fee_m:
                    features["annual_fee"] = f"AED {fee_m.group(1)}"
                elif "no fee" in text or "zero fee" in text:
                    features["annual_fee"] = "AED 0"

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "Mashreq" in title else f"Mashreq {title}",
                    description_en=desc,
                    min_salary_aed=5000,
                    representative_rate=3.15,
                    rate_type="variable",
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Mashreq] Error parsing card: {e}")

        return products if products else self._fallback_credit_cards()

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.PL_URL)
        if not soup:
            return self._fallback_personal_loans()

        products = []
        sections = soup.find_all("div", class_=re.compile(r"card|product|loan|tile", re.I))

        for section in sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not any(kw in title.lower() for kw in ["loan", "personal", "finance"]):
                    continue

                text = section.get_text(" ", strip=True).lower()
                rate_match = re.search(r"(\d+(?:\.\d+)?)\s*%", text)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="personal_loan",
                    name_en=title if "Mashreq" in title else f"Mashreq {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=5000,
                    representative_rate=float(rate_match.group(1)) if rate_match else 6.49,
                    rate_type="fixed",
                    min_amount_aed=10000,
                    max_amount_aed=1000000,
                    min_tenure_months=12,
                    max_tenure_months=48,
                    key_features={},
                    affiliate_deep_link_en=f"{self.BASE_URL}/loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Mashreq] Error parsing loan: {e}")

        return products if products else self._fallback_personal_loans()

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[Mashreq] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Mashreq Neo Visa Credit Card",
                name_ar="بطاقة مشرق نيو فيزا",
                description_en="Digital-first credit card with instant approval. No minimum salary for UAE nationals.",
                min_salary_aed=5000,
                representative_rate=3.15,
                rate_type="variable",
                key_features={"cashback_rate": "up to 2%", "annual_fee": "AED 0", "contactless": True, "apple_pay": True},
                affiliate_deep_link_en="https://mashreqbank.com/neo?utm_source=smartmoney",
                commission_amount_aed=200,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Mashreq Solitaire Credit Card",
                name_ar="بطاقة مشرق سوليتير",
                description_en="Premium card with lifestyle benefits, concierge service and airport lounge access.",
                min_salary_aed=25000,
                representative_rate=3.25,
                rate_type="variable",
                key_features={"annual_fee": "AED 750", "lounge_access": True, "concierge": True, "travel_insurance": True},
                affiliate_deep_link_en="https://mashreqbank.com/solitaire?utm_source=smartmoney",
                commission_amount_aed=400,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[Mashreq] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="Mashreq Personal Loan",
                name_ar="قرض شخصي من مشرق",
                description_en="Quick personal loan with competitive rates. Apply online for instant approval.",
                min_salary_aed=5000,
                representative_rate=6.25,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1%", "salary_transfer_required": True},
                affiliate_deep_link_en="https://mashreqbank.com/loans?utm_source=smartmoney",
                commission_percentage=1.0,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
