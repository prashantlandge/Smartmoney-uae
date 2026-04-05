"""Scraper for HSBC UAE and Standard Chartered UAE products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.hsbc")


class HSBCScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000009"
    PROVIDER_NAME = "HSBC UAE"
    BASE_URL = "https://www.hsbc.ae"

    CC_URL = "https://www.hsbc.ae/credit-cards"
    PL_URL = "https://www.hsbc.ae/personal-loans"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.CC_URL)
        if not soup:
            return self._fallback_credit_cards()

        products = []
        cards = soup.find_all("div", class_=re.compile(r"card|product|tile|module", re.I))

        for card in cards:
            try:
                title_el = card.find(["h2", "h3", "h4", "h5"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                if not any(kw in title.lower() for kw in ["card", "cashback", "platinum", "black", "gold", "visa", "premier"]):
                    continue

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""
                text = card.get_text(" ", strip=True).lower()
                features = {}

                cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
                if cb:
                    features["cashback_rate"] = f"up to {cb.group(1)}%"

                features["lounge_access"] = "lounge" in text

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "HSBC" in title else f"HSBC {title}",
                    description_en=desc,
                    min_salary_aed=15000,
                    representative_rate=3.49,
                    rate_type="variable",
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/credit-cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[HSBC] Error parsing card: {e}")

        return products if products else self._fallback_credit_cards()

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.PL_URL)
        if not soup:
            return self._fallback_personal_loans()

        products = []
        sections = soup.find_all("div", class_=re.compile(r"card|product|loan|tile|module", re.I))

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
                    name_en=title if "HSBC" in title else f"HSBC {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=15000,
                    representative_rate=float(rate_match.group(1)) if rate_match else 6.99,
                    rate_type="fixed",
                    min_amount_aed=20000,
                    max_amount_aed=1500000,
                    min_tenure_months=12,
                    max_tenure_months=48,
                    key_features={"salary_transfer_required": True},
                    affiliate_deep_link_en=f"{self.BASE_URL}/personal-loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[HSBC] Error parsing loan: {e}")

        return products if products else self._fallback_personal_loans()

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[HSBC] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="HSBC Cashback Credit Card",
                name_ar="بطاقة إتش إس بي سي كاش باك",
                description_en="Earn unlimited cashback on all purchases with no annual fee for the first year.",
                min_salary_aed=15000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={"cashback_rate": "up to 3%", "annual_fee": "AED 0 first year", "lounge_access": False},
                affiliate_deep_link_en="https://hsbc.ae/credit-cards?utm_source=smartmoney",
                commission_amount_aed=300,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="HSBC Black Credit Card",
                name_ar="بطاقة إتش إس بي سي بلاك",
                description_en="Premium HSBC card with unlimited lounge access and travel benefits.",
                min_salary_aed=30000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={"annual_fee": "AED 900", "lounge_access": True, "travel_insurance": True, "concierge": True},
                affiliate_deep_link_en="https://hsbc.ae/credit-cards/black?utm_source=smartmoney",
                commission_amount_aed=500,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[HSBC] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="HSBC UAE Personal Loan",
                name_ar="قرض شخصي من إتش إس بي سي",
                description_en="Premium rates for existing HSBC customers. Loan up to 20x monthly salary.",
                min_salary_aed=15000,
                representative_rate=6.99,
                rate_type="fixed",
                min_amount_aed=20000,
                max_amount_aed=1500000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1.1%", "salary_transfer_required": True, "max_dti_ratio": "50%"},
                affiliate_deep_link_en="https://hsbc.ae/loans/personal?utm_source=smartmoney",
                commission_percentage=1.0,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]


class StandardCharteredScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000010"
    PROVIDER_NAME = "Standard Chartered UAE"
    BASE_URL = "https://www.sc.com/ae"

    CC_URL = "https://www.sc.com/ae/credit-cards/"
    PL_URL = "https://www.sc.com/ae/personal-loans/"

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

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "Standard Chartered" in title else f"Standard Chartered {title}",
                    description_en=desc,
                    min_salary_aed=15000,
                    representative_rate=3.49,
                    rate_type="variable",
                    key_features={},
                    affiliate_deep_link_en=f"{self.BASE_URL}/credit-cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception:
                continue

        return products if products else self._fallback_credit_cards()

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        return self._fallback_personal_loans()

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[SC] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Standard Chartered Infinite Credit Card",
                name_ar="بطاقة ستاندرد تشارترد إنفينيت",
                description_en="Premium credit card with unlimited lounge access and lifestyle rewards.",
                min_salary_aed=25000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={"annual_fee": "AED 800", "lounge_access": True, "travel_insurance": True},
                affiliate_deep_link_en="https://sc.com/ae/credit-cards?utm_source=smartmoney",
                commission_amount_aed=400,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[SC] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="Standard Chartered Personal Loan",
                name_ar="قرض شخصي من ستاندرد تشارترد",
                description_en="Personal loan with competitive rates and quick processing.",
                min_salary_aed=15000,
                representative_rate=6.49,
                rate_type="fixed",
                min_amount_aed=15000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1%"},
                affiliate_deep_link_en="https://sc.com/ae/personal-loans?utm_source=smartmoney",
                commission_percentage=1.0,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
