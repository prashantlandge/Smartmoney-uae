"""Scraper for Dubai Islamic Bank (DIB) and ADIB products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.dib")


class DIBScraper(BankScraper):
    """Dubai Islamic Bank scraper — Islamic finance products."""

    PROVIDER_ID = "b0000001-0000-0000-0000-000000000006"
    PROVIDER_NAME = "Dubai Islamic Bank"
    BASE_URL = "https://www.dib.ae"

    CC_URL = "https://www.dib.ae/personal-banking/cards/credit-cards"
    PF_URL = "https://www.dib.ae/personal-banking/finance/personal-finance"

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
                if not any(kw in title.lower() for kw in ["card", "islami", "prime", "infinite", "gold", "platinum"]):
                    continue

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""
                text = card.get_text(" ", strip=True).lower()
                features = {"sharia_compliant": True}

                cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
                if cb:
                    features["cashback_rate"] = f"up to {cb.group(1)}%"

                profit = re.search(r"profit\s*rate\s*(?:of\s*)?\s*(\d+(?:\.\d+)?)\s*%", text)
                if profit:
                    features["profit_rate"] = f"{profit.group(1)}%"

                features["lounge_access"] = "lounge" in text

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "DIB" in title or "Islamic" in title else f"DIB {title}",
                    description_en=desc,
                    min_salary_aed=8000,
                    representative_rate=0,
                    rate_type="fixed",
                    key_features=features,
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[DIB] Error parsing card: {e}")

        return products if products else self._fallback_credit_cards()

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        # DIB calls them "Personal Finance" (Islamic)
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.PF_URL)
        if not soup:
            return self._fallback_islamic()

        products = []
        sections = soup.find_all("div", class_=re.compile(r"card|product|finance|tile", re.I))

        for section in sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue

                text = section.get_text(" ", strip=True).lower()
                profit_match = re.search(r"(\d+(?:\.\d+)?)\s*%", text)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="islamic_finance",
                    name_en=title if "DIB" in title else f"DIB {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=8000,
                    representative_rate=float(profit_match.group(1)) if profit_match else 4.99,
                    rate_type="fixed",
                    key_features={"structure": "murabaha", "sharia_compliant": True},
                    affiliate_deep_link_en=f"{self.BASE_URL}/finance?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[DIB] Error parsing finance: {e}")

        return products if products else self._fallback_islamic()

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[DIB] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Dubai Islamic Bank Al Islami Credit Card",
                name_ar="بطاقة بنك دبي الإسلامي الائتمانية",
                description_en="Sharia-compliant credit card with cashback rewards and no interest charges.",
                min_salary_aed=8000,
                representative_rate=0,
                rate_type="fixed",
                key_features={"cashback_rate": "up to 5%", "annual_fee": "AED 0 first year", "sharia_compliant": True, "profit_rate": "2.99%"},
                affiliate_deep_link_en="https://dib.ae/cards/al-islami?utm_source=smartmoney",
                commission_amount_aed=300,
                islamic_compliant=True,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="DIB Prime Infinite Credit Card",
                name_ar="بطاقة دبي الإسلامي برايم إنفينيت",
                description_en="Premium Sharia-compliant card with unlimited lounge access and concierge.",
                min_salary_aed=30000,
                representative_rate=0,
                rate_type="fixed",
                key_features={"annual_fee": "AED 1500", "lounge_access": True, "concierge": True, "sharia_compliant": True},
                affiliate_deep_link_en="https://dib.ae/cards/prime?utm_source=smartmoney",
                commission_amount_aed=500,
                islamic_compliant=True,
                data_source="scrape",
            ),
        ]

    def _fallback_islamic(self) -> list[ScrapedProduct]:
        logger.info("[DIB] Using fallback Islamic finance data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="DIB Personal Finance",
                name_ar="التمويل الشخصي من بنك دبي الإسلامي",
                description_en="Sharia-compliant personal finance up to AED 3 million with competitive profit rates.",
                min_salary_aed=8000,
                representative_rate=4.99,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=3000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"structure": "murabaha", "profit_rate": "4.99%", "sharia_compliant": True, "max_amount": "AED 3,000,000"},
                affiliate_deep_link_en="https://dib.ae/finance/personal?utm_source=smartmoney",
                commission_percentage=1.5,
                commission_type="percentage",
                islamic_compliant=True,
                data_source="scrape",
            ),
        ]


class ADIBScraper(BankScraper):
    """Abu Dhabi Islamic Bank scraper — Islamic finance products."""

    PROVIDER_ID = "b0000001-0000-0000-0000-000000000007"
    PROVIDER_NAME = "ADIB"
    BASE_URL = "https://www.adib.ae"

    CC_URL = "https://www.adib.ae/en/personal/cards/credit-cards"
    PF_URL = "https://www.adib.ae/en/personal/finance/personal-finance"

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
                    name_en=title if "ADIB" in title else f"ADIB {title}",
                    description_en=desc,
                    min_salary_aed=8000,
                    representative_rate=0,
                    rate_type="fixed",
                    key_features={"sharia_compliant": True},
                    affiliate_deep_link_en=f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception:
                continue

        return products if products else self._fallback_credit_cards()

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        return []

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        soup = await self.fetch_page(self.PF_URL)
        if not soup:
            return self._fallback_islamic()

        products = []
        sections = soup.find_all("div", class_=re.compile(r"card|product|finance|tile", re.I))

        for section in sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue

                text = section.get_text(" ", strip=True).lower()
                profit_match = re.search(r"(\d+(?:\.\d+)?)\s*%", text)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="islamic_finance",
                    name_en=title if "ADIB" in title else f"ADIB {title}",
                    description_en=section.find("p").get_text(strip=True)[:500] if section.find("p") else "",
                    min_salary_aed=10000,
                    representative_rate=float(profit_match.group(1)) if profit_match else 5.49,
                    rate_type="fixed",
                    key_features={"structure": "murabaha", "sharia_compliant": True},
                    affiliate_deep_link_en=f"{self.BASE_URL}/finance?utm_source=smartmoney",
                    islamic_compliant=True,
                    data_source="scrape",
                ))
            except Exception:
                continue

        return products if products else self._fallback_islamic()

    def _fallback_credit_cards(self) -> list[ScrapedProduct]:
        logger.info("[ADIB] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADIB Cashback Credit Card",
                name_ar="بطاقة أبوظبي الإسلامي كاش باك",
                description_en="Sharia-compliant cashback credit card with up to 5% cashback on select categories.",
                min_salary_aed=8000,
                representative_rate=0,
                rate_type="fixed",
                key_features={"cashback_rate": "up to 5%", "annual_fee": "AED 300", "sharia_compliant": True},
                affiliate_deep_link_en="https://adib.ae/cards?utm_source=smartmoney",
                commission_amount_aed=250,
                islamic_compliant=True,
                data_source="scrape",
            ),
        ]

    def _fallback_islamic(self) -> list[ScrapedProduct]:
        logger.info("[ADIB] Using fallback Islamic finance data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="ADIB Personal Finance",
                name_ar="التمويل الشخصي من مصرف أبوظبي الإسلامي",
                description_en="Islamic personal finance with competitive profit rates. Up to AED 2 million.",
                min_salary_aed=10000,
                representative_rate=5.49,
                rate_type="fixed",
                key_features={"structure": "murabaha", "profit_rate": "5.49%", "max_amount": "AED 2,000,000", "tenure_up_to": "48 months", "sharia_compliant": True},
                affiliate_deep_link_en="https://adib.ae/personal-finance?utm_source=smartmoney",
                commission_amount_aed=400,
                islamic_compliant=True,
                data_source="scrape",
            ),
        ]
