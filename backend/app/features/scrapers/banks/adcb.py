"""Scraper for Abu Dhabi Commercial Bank (ADCB) products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.adcb")


class ADCBScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000003"
    PROVIDER_NAME = "ADCB"
    BASE_URL = "https://www.adcb.com"

    CC_URL = "https://www.adcb.com/en/personal/cards/credit-cards"
    PL_URL = "https://www.adcb.com/en/personal/loans/personal-loans"

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
                if not any(kw in title.lower() for kw in ["card", "touchpoints", "platinum", "infinite", "visa", "mastercard"]):
                    continue

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""
                text = card.get_text(" ", strip=True).lower()
                features = {}

                # Extract points multiplier
                pts = re.search(r"(\d+)\s*x\s*(?:touch\s*points|points)", text)
                if pts:
                    features["rewards_rate"] = f"up to {pts.group(1)}x points"

                fee_m = re.search(r"(?:fee)\s*(?:aed\s*)?([\d,]+)", text)
                if fee_m:
                    features["annual_fee"] = f"AED {fee_m.group(1)}"

                features["lounge_access"] = "lounge" in text
                features["concierge"] = "concierge" in text

                link = card.find("a", href=True)
                href = f"{self.BASE_URL}{link['href']}?utm_source=smartmoney" if link and link["href"].startswith("/") else ""

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "ADCB" in title else f"ADCB {title}",
                    description_en=desc,
                    min_salary_aed=15000,
                    representative_rate=3.49,
                    rate_type="variable",
                    key_features=features,
                    affiliate_deep_link_en=href or f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[ADCB] Error parsing card: {e}")

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
                rate = float(rate_match.group(1)) if rate_match else None

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="personal_loan",
                    name_en=title if "ADCB" in title else f"ADCB {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=10000,
                    representative_rate=rate or 6.49,
                    rate_type="fixed",
                    min_amount_aed=15000,
                    max_amount_aed=750000,
                    min_tenure_months=12,
                    max_tenure_months=48,
                    key_features={"processing_fee": "1.05%", "salary_transfer_required": False},
                    affiliate_deep_link_en=f"{self.BASE_URL}/loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[ADCB] Error parsing loan: {e}")

        return products if products else self._fallback_personal_loans()

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[ADCB] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADCB TouchPoints Infinite Credit Card",
                name_ar="بطاقة أبوظبي التجاري إنفينيت",
                description_en="Premium card with unlimited airport lounge access and up to 10x TouchPoints.",
                min_salary_aed=30000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={"rewards_rate": "up to 10x points", "annual_fee": "AED 1000", "lounge_access": True, "concierge": True, "travel_insurance": True},
                affiliate_deep_link_en="https://adcb.com/cards/infinite?utm_source=smartmoney",
                commission_amount_aed=500,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[ADCB] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="ADCB Personal Loan",
                name_ar="قرض شخصي من أبوظبي التجاري",
                description_en="Flexible personal loan with no salary transfer required. Rates from 6.49%.",
                min_salary_aed=10000,
                representative_rate=6.49,
                rate_type="fixed",
                min_amount_aed=15000,
                max_amount_aed=750000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1.05%", "early_settlement": "1% of outstanding", "salary_transfer_required": False},
                affiliate_deep_link_en="https://adcb.com/loans/personal?utm_source=smartmoney",
                commission_percentage=1.25,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
