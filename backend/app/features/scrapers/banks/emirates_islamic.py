"""Scraper for Emirates Islamic products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.emirates_islamic")


class EmiratesIslamicScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000008"
    PROVIDER_NAME = "Emirates Islamic"
    BASE_URL = "https://www.emiratesislamic.ae"

    CC_URL = "https://www.emiratesislamic.ae/eng/personal-banking/cards/credit-cards/"
    PL_URL = "https://www.emiratesislamic.ae/eng/personal-banking/finance/personal-finance/"

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
                if not any(kw in title.lower() for kw in ["card", "cashback", "rewards", "platinum", "skywards"]):
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_card_features(section)
                link = self._extract_link(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"Emirates Islamic {title}",
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Emirates Islamic] Error parsing card: {e}")

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        # Emirates Islamic offers "personal finance" (Islamic)
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        products = []
        soup = await self.fetch_page(self.PL_URL)
        if not soup:
            return self._fallback_islamic_finance()

        sections = soup.find_all("div", class_=re.compile(r"card|product|finance", re.I))
        for section in sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                if not any(kw in title.lower() for kw in ["finance", "murabaha", "tawarruq"]):
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""
                features = self._extract_finance_features(section)
                link = self._extract_link(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="islamic_finance",
                    name_en=f"Emirates Islamic {title}",
                    description_en=desc[:500],
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/finance?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[Emirates Islamic] Error parsing finance: {e}")

        if not products:
            return self._fallback_islamic_finance()
        return products

    def _extract_card_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
        if cb:
            features["cashback_rate"] = f"up to {cb.group(1)}%"

        fee = re.search(r"(?:annual\s*fee|fee)\s*(?:of|:)?\s*(?:aed\s*)?([\d,]+)", text)
        if fee:
            features["annual_fee"] = f"AED {fee.group(1)}"
        elif "no annual fee" in text or "free" in text:
            features["annual_fee"] = "AED 0"

        sal = re.search(r"(?:min(?:imum)?\s*salary|salary)\s*(?:aed\s*)?([\d,]+)", text)
        if sal:
            features["min_salary"] = float(sal.group(1).replace(",", ""))

        features["islamic_compliant"] = True
        return features

    def _extract_finance_features(self, section) -> dict:
        features = {}
        text = section.get_text(" ", strip=True).lower()

        rate = re.search(r"(?:profit|rate)\s*(?:from|starting)\s*(\d+(?:\.\d+)?)\s*%", text)
        if rate:
            features["profit_rate"] = f"{rate.group(1)}%"

        proc = re.search(r"processing\s*fee\s*(\d+(?:\.\d+)?)\s*%", text)
        if proc:
            features["processing_fee"] = f"{proc.group(1)}%"

        features["islamic_compliant"] = True
        features["sharia_compliant"] = True
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
        logger.info("[Emirates Islamic] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Emirates Islamic Skywards Signature Credit Card",
                name_ar="بطاقة الإمارات الإسلامي سكاي واردز سيجنتشر",
                description_en="Earn Emirates Skywards miles on every purchase. Sharia-compliant covered card.",
                min_salary_aed=15000,
                key_features={
                    "annual_fee": "AED 750",
                    "rewards_rate": "up to 3 Skywards miles per AED",
                    "lounge_access": True,
                    "travel_insurance": True,
                    "islamic_compliant": True,
                    "contactless": True,
                    "apple_pay": True,
                },
                affiliate_deep_link_en="https://emiratesislamic.ae/cards/skywards?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Emirates Islamic Cashback Credit Card",
                name_ar="بطاقة الإمارات الإسلامي كاش باك",
                description_en="Earn up to 5% cashback on dining and entertainment. Sharia-compliant.",
                min_salary_aed=8000,
                key_features={
                    "annual_fee": "AED 0 first year, AED 399 after",
                    "cashback_rate": "up to 5%",
                    "islamic_compliant": True,
                    "contactless": True,
                },
                affiliate_deep_link_en="https://emiratesislamic.ae/cards/cashback?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
        ]

    def _fallback_islamic_finance(self) -> list[ScrapedProduct]:
        logger.info("[Emirates Islamic] Using fallback Islamic finance data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="Emirates Islamic Personal Finance",
                name_ar="تمويل شخصي من الإمارات الإسلامي",
                description_en="Sharia-compliant personal finance with competitive profit rates.",
                min_salary_aed=5000,
                representative_rate=5.49,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "profit_rate": "from 5.49% p.a.",
                    "processing_fee": "1% of finance amount",
                    "structure": "Murabaha",
                    "early_settlement_fee": "1% of outstanding",
                    "sharia_compliant": True,
                    "salary_transfer_required": True,
                },
                affiliate_deep_link_en="https://emiratesislamic.ae/finance?utm_source=smartmoney",
                islamic_compliant=True,
                data_source="scrape_fallback",
            ),
        ]
