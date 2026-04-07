"""Scrapers for smaller UAE banks: Ajman Bank and Sharjah Islamic Bank."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.small_banks")


class AjmanBankScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000015"
    PROVIDER_NAME = "Ajman Bank"
    BASE_URL = "https://www.ajmanbank.ae"

    CC_URL = "https://www.ajmanbank.ae/personal/cards/credit-cards"

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
                if not title or len(title) < 5:
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_features(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"Ajman Bank {title}",
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Ajman Bank] Error parsing card: {e}")

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return self._fallback_islamic_finance()

    def _extract_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        fee = re.search(r"annual\s*fee\s*(?:of|:)?\s*(?:aed\s*)?([\d,]+)", text)
        if fee:
            features["annual_fee"] = f"AED {fee.group(1)}"

        cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
        if cb:
            features["cashback_rate"] = f"up to {cb.group(1)}%"

        features["islamic_compliant"] = True
        return features

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[Ajman Bank] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Ajman Bank Classic Covered Card",
                name_ar="بطاقة مصرف عجمان كلاسيك",
                description_en="Sharia-compliant covered card with cashback rewards.",
                min_salary_aed=5000,
                key_features={
                    "annual_fee": "AED 200",
                    "cashback_rate": "up to 2%",
                    "islamic_compliant": True,
                    "contactless": True,
                },
                affiliate_deep_link_en="https://ajmanbank.ae/cards?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
        ]

    def _fallback_islamic_finance(self) -> list[ScrapedProduct]:
        logger.info("[Ajman Bank] Using fallback Islamic finance data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="Ajman Bank Personal Finance",
                name_ar="تمويل شخصي من مصرف عجمان",
                description_en="Sharia-compliant personal finance for UAE residents.",
                min_salary_aed=5000,
                representative_rate=6.49,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=500000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "profit_rate": "from 6.49% p.a.",
                    "processing_fee": "1%",
                    "structure": "Murabaha",
                    "sharia_compliant": True,
                },
                affiliate_deep_link_en="https://ajmanbank.ae/finance?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
        ]


class SharjahIslamicScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000016"
    PROVIDER_NAME = "Sharjah Islamic Bank"
    BASE_URL = "https://www.sib.ae"

    CC_URL = "https://www.sib.ae/personal/cards"

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
                if not title or len(title) < 5:
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_features(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"SIB {title}",
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[SIB] Error parsing card: {e}")

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        return self._fallback_islamic_finance()

    def _extract_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        fee = re.search(r"annual\s*fee\s*(?:of|:)?\s*(?:aed\s*)?([\d,]+)", text)
        if fee:
            features["annual_fee"] = f"AED {fee.group(1)}"

        features["islamic_compliant"] = True
        return features

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[SIB] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="SIB Platinum Covered Card",
                name_ar="بطاقة مصرف الشارقة الإسلامي البلاتينية",
                description_en="Sharia-compliant platinum covered card with travel benefits.",
                min_salary_aed=10000,
                key_features={
                    "annual_fee": "AED 500",
                    "lounge_access": True,
                    "islamic_compliant": True,
                    "contactless": True,
                    "best_for": "Sharjah residents",
                },
                affiliate_deep_link_en="https://sib.ae/cards?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
        ]

    def _fallback_islamic_finance(self) -> list[ScrapedProduct]:
        logger.info("[SIB] Using fallback Islamic finance data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="SIB Personal Finance",
                name_ar="تمويل شخصي من مصرف الشارقة الإسلامي",
                description_en="Sharia-compliant personal finance with competitive profit rates.",
                min_salary_aed=5000,
                representative_rate=6.25,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=500000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "profit_rate": "from 6.25% p.a.",
                    "processing_fee": "1%",
                    "structure": "Murabaha",
                    "sharia_compliant": True,
                    "salary_transfer_required": True,
                },
                affiliate_deep_link_en="https://sib.ae/finance?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
        ]
