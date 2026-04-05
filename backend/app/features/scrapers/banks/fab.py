"""Scraper for First Abu Dhabi Bank (FAB) products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.fab")


class FABScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000002"
    PROVIDER_NAME = "First Abu Dhabi Bank (FAB)"
    BASE_URL = "https://www.bankfab.com"

    CC_URL = "https://www.bankfab.com/en-ae/personal/cards/credit-cards"
    PL_URL = "https://www.bankfab.com/en-ae/personal/loans/personal-loans"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.CC_URL)
        if not soup:
            return self._fallback_credit_cards()

        products = []
        card_els = soup.find_all("div", class_=re.compile(r"card|product|tile", re.I))

        for el in card_els:
            try:
                title_el = el.find(["h2", "h3", "h4", "h5"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                if not any(kw in title.lower() for kw in ["card", "platinum", "infinite", "signature", "rewards", "cashback", "gold"]):
                    continue

                desc_el = el.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_features(el)
                link = self._extract_link(el)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "FAB" in title or "Abu Dhabi" in title else f"FAB {title}",
                    description_en=desc[:500],
                    min_salary_aed=features.get("min_salary", 15000),
                    representative_rate=features.get("interest_rate", 3.49),
                    rate_type="variable",
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[FAB] Error parsing card: {e}")

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
                if not title or not any(kw in title.lower() for kw in ["loan", "personal", "finance"]):
                    continue

                text = section.get_text(" ", strip=True).lower()
                rate_match = re.search(r"(\d+(?:\.\d+)?)\s*%", text)
                rate = float(rate_match.group(1)) if rate_match else None

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="personal_loan",
                    name_en=title if "FAB" in title else f"FAB {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=10000,
                    representative_rate=rate,
                    rate_type="fixed",
                    min_tenure_months=12,
                    max_tenure_months=48,
                    key_features={"interest_rate": rate} if rate else {},
                    affiliate_deep_link_en=f"{self.BASE_URL}/loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[FAB] Error parsing loan: {e}")

        return products if products else self._fallback_personal_loans()

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return []

    def _extract_features(self, el) -> dict:
        features = {}
        text = el.get_text(" ", strip=True).lower()

        rate_m = re.search(r"(\d+)\s*(?:x|times)\s*(?:points|rewards)", text)
        if rate_m:
            features["rewards_rate"] = f"{rate_m.group(1)}x points"

        fee_m = re.search(r"(?:annual\s*fee|fee)\s*(?:aed\s*)?([\d,]+)", text)
        if fee_m:
            features["annual_fee"] = f"AED {fee_m.group(1)}"

        sal_m = re.search(r"(?:salary)\s*(?:aed\s*)?([\d,]+)", text)
        if sal_m:
            features["min_salary"] = float(sal_m.group(1).replace(",", ""))

        features["lounge_access"] = "lounge" in text
        features["travel_insurance"] = "travel insurance" in text or "travel cover" in text

        return features

    def _extract_link(self, el) -> str:
        a = el.find("a", href=True)
        if a:
            href = a["href"]
            if href.startswith("/"):
                return f"{self.BASE_URL}{href}?utm_source=smartmoney"
            if href.startswith("http"):
                return href
        return ""

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[FAB] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="FAB Rewards Platinum Credit Card",
                name_ar="بطاقة فاب ريواردز البلاتينية",
                description_en="Earn FAB Rewards points on every spend. Airport lounge access included.",
                min_salary_aed=15000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={"rewards_rate": "1 point per AED 1", "annual_fee": "AED 500", "lounge_access": True, "travel_insurance": True},
                affiliate_deep_link_en="https://bankfab.com/cards/rewards-platinum?utm_source=smartmoney",
                commission_amount_aed=350,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[FAB] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="FAB Personal Loan",
                name_ar="قرض شخصي من بنك أبوظبي الأول",
                description_en="Personal loan with competitive rates and flexible tenures up to 48 months.",
                min_salary_aed=10000,
                representative_rate=6.25,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1%", "salary_transfer_required": True},
                affiliate_deep_link_en="https://bankfab.com/loans/personal?utm_source=smartmoney",
                commission_percentage=1.25,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
