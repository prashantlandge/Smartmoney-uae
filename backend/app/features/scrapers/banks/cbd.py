"""Scraper for CBD (Commercial Bank of Dubai) products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.cbd")


class CBDScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000014"
    PROVIDER_NAME = "CBD"
    BASE_URL = "https://www.cbd.ae"

    CC_URL = "https://www.cbd.ae/personal/cards/credit-cards"
    PL_URL = "https://www.cbd.ae/personal/loans/personal-loan"

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
                if not any(kw in title.lower() for kw in ["card", "cashback", "rewards", "world", "platinum"]):
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_card_features(section)
                link = self._extract_link(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"CBD {title}",
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[CBD] Error parsing card: {e}")

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        products = []
        soup = await self.fetch_page(self.PL_URL)
        if not soup:
            return self._fallback_personal_loans()

        sections = soup.find_all("div", class_=re.compile(r"card|product|loan", re.I))
        for section in sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                if not any(kw in title.lower() for kw in ["loan", "personal", "finance"]):
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_loan_features(section)
                link = self._extract_link(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="personal_loan",
                    name_en=f"CBD {title}",
                    description_en=desc[:500],
                    min_salary_aed=features.get("min_salary", 5000),
                    representative_rate=features.get("interest_rate"),
                    rate_type="fixed",
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[CBD] Error parsing loan: {e}")

        if not products:
            return self._fallback_personal_loans()
        return products

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

    def _extract_loan_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        rate = re.search(r"(?:from|starting)\s*(\d+(?:\.\d+)?)\s*%", text)
        if rate:
            features["interest_rate"] = float(rate.group(1))

        proc = re.search(r"processing\s*fee\s*(\d+(?:\.\d+)?)\s*%", text)
        if proc:
            features["processing_fee"] = f"{proc.group(1)}%"

        sal = re.search(r"(?:min(?:imum)?\s*salary|salary)\s*(?:aed\s*)?([\d,]+)", text)
        if sal:
            features["min_salary"] = float(sal.group(1).replace(",", ""))

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
        logger.info("[CBD] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="CBD World Mastercard Credit Card",
                name_ar="بطاقة بنك دبي التجاري وورلد ماستركارد",
                description_en="Premium card with cashback and lounge access.",
                min_salary_aed=15000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 500",
                    "cashback_rate": "up to 3%",
                    "lounge_access": True,
                    "contactless": True,
                    "best_for": "CBD salary transfer customers",
                },
                affiliate_deep_link_en="https://cbd.ae/cards/world?utm_source=smartmoney",
                data_source="scrape_fallback",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        logger.info("[CBD] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="CBD Personal Loan",
                name_ar="قرض شخصي من بنك دبي التجاري",
                description_en="Competitive personal loan rates for salary transfer customers.",
                min_salary_aed=5000,
                representative_rate=5.99,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "flat_rate": "from 5.99% p.a.",
                    "processing_fee": "1% of loan amount",
                    "salary_transfer_required": True,
                    "early_settlement_fee": "1% of outstanding",
                },
                affiliate_deep_link_en="https://cbd.ae/loans/personal?utm_source=smartmoney",
                data_source="scrape_fallback",
            ),
        ]
