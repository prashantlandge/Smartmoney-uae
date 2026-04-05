"""Scraper for RAKBANK products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.rakbank")


class RAKBANKScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000005"
    PROVIDER_NAME = "RAKBANK"
    BASE_URL = "https://rakbank.ae"

    CC_URL = "https://rakbank.ae/wps/portal/retail-banking/cards/credit-cards"
    PL_URL = "https://rakbank.ae/wps/portal/retail-banking/loans/personal-loans"

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
                if not any(kw in title.lower() for kw in ["card", "world", "elite", "platinum", "visa", "mastercard"]):
                    continue

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""
                text = card.get_text(" ", strip=True).lower()
                features = {}

                cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
                if cb:
                    features["cashback_rate"] = f"up to {cb.group(1)}%"

                features["lounge_access"] = "lounge" in text
                features["valet_parking"] = "valet" in text

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "RAKBANK" in title or "RAK" in title else f"RAKBANK {title}",
                    description_en=desc,
                    min_salary_aed=10000,
                    representative_rate=3.39,
                    rate_type="variable",
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[RAKBANK] Error parsing card: {e}")

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
                    name_en=title if "RAKBANK" in title else f"RAKBANK {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=5000,
                    representative_rate=float(rate_match.group(1)) if rate_match else 5.99,
                    rate_type="fixed",
                    min_amount_aed=5000,
                    max_amount_aed=500000,
                    min_tenure_months=12,
                    max_tenure_months=48,
                    key_features={},
                    affiliate_deep_link_en=f"{self.BASE_URL}/loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[RAKBANK] Error parsing loan: {e}")

        return products if products else self._fallback_personal_loans()

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[RAKBANK] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="RAKBANK World Elite Mastercard",
                name_ar="بطاقة راك بنك وورلد إليت",
                description_en="World Elite benefits with free valet parking and airport transfers.",
                min_salary_aed=20000,
                representative_rate=3.39,
                rate_type="variable",
                key_features={"cashback_rate": "up to 3%", "annual_fee": "AED 750", "lounge_access": True, "valet_parking": True},
                affiliate_deep_link_en="https://rakbank.ae/cards/world-elite?utm_source=smartmoney",
                commission_amount_aed=400,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[RAKBANK] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="RAKBANK Personal Loan",
                name_ar="قرض شخصي من راك بنك",
                description_en="Competitive personal loan rates with flexible repayment options.",
                min_salary_aed=5000,
                representative_rate=5.99,
                rate_type="fixed",
                min_amount_aed=5000,
                max_amount_aed=500000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1%", "early_settlement_fee": "1%"},
                affiliate_deep_link_en="https://rakbank.ae/loans/personal?utm_source=smartmoney",
                commission_percentage=1.0,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
