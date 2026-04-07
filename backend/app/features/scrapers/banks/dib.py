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
                key_features={
                    "annual_fee": "AED 0 first year, AED 399 after",
                    "min_salary": "AED 8,000",
                    "cashback_rate": "up to 5%",
                    "card_tier": "Platinum",
                    "best_for": "Islamic cashback with no interest charges",
                    "sharia_compliant": True,
                    "profit_rate": "2.99% p.a.",
                    "contactless": True,
                    "apple_pay": True,
                    "supplementary_cards": "Free",
                    "lounge_access": False,
                    "concierge": False,
                    "interest_free_days": "55 days",
                },
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
                description_en="Premium Sharia-compliant card with unlimited lounge access and concierge services.",
                min_salary_aed=30000,
                representative_rate=0,
                rate_type="fixed",
                key_features={
                    "annual_fee": "AED 1,500",
                    "min_salary": "AED 30,000",
                    "rewards_rate": "up to 5x Skywards Miles",
                    "card_tier": "Infinite",
                    "best_for": "Premium Islamic card with travel perks",
                    "sharia_compliant": True,
                    "lounge_access": True,
                    "concierge": True,
                    "travel_insurance": True,
                    "valet_parking": True,
                    "contactless": True,
                    "apple_pay": True,
                    "golf": True,
                    "supplementary_cards": "Free",
                },
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
                name_en="DIB Personal Finance (Salary Transfer)",
                name_ar="التمويل الشخصي من بنك دبي الإسلامي (تحويل الراتب)",
                description_en="Sharia-compliant personal finance with competitive profit rates from 4.99%. Up to AED 3 million.",
                description_ar="تمويل شخصي متوافق مع الشريعة بأسعار ربح تبدأ من 4.99%.",
                min_salary_aed=8000,
                representative_rate=4.99,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=3000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "profit_rate": "4.99% p.a. (salary transfer)",
                    "reducing_rate": "9.25% p.a.",
                    "processing_fee": "1% of financing amount",
                    "min_salary": "AED 8,000",
                    "max_financing": "AED 3,000,000",
                    "max_tenure": "48 months",
                    "salary_transfer_required": True,
                    "takaful_included": True,
                    "murabaha_structure": True,
                    "early_settlement_fee": "1% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "Same day",
                    "top_up": True,
                    "nationality": "All nationalities",
                    "best_for": "Sharia-compliant salary transfer customers",
                },
                affiliate_deep_link_en="https://dib.ae/finance/personal?utm_source=smartmoney",
                commission_percentage=1.5,
                commission_type="percentage",
                islamic_compliant=True,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="DIB Personal Finance (Non-Salary Transfer)",
                name_ar="التمويل الشخصي من بنك دبي الإسلامي (بدون تحويل الراتب)",
                description_en="Flexible Sharia-compliant personal finance without salary transfer. Profit rates from 6.49%.",
                description_ar="تمويل شخصي مرن متوافق مع الشريعة بدون تحويل الراتب.",
                min_salary_aed=10000,
                representative_rate=6.49,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "profit_rate": "6.49% p.a. (non-salary transfer)",
                    "reducing_rate": "11.99% p.a.",
                    "processing_fee": "1.25% of financing amount",
                    "min_salary": "AED 10,000",
                    "max_financing": "AED 1,000,000",
                    "max_tenure": "48 months",
                    "salary_transfer_required": False,
                    "takaful_included": True,
                    "murabaha_structure": True,
                    "early_settlement_fee": "1% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "Same day",
                    "top_up": False,
                    "nationality": "All nationalities",
                    "best_for": "Non-salary transfer Islamic finance seekers",
                },
                affiliate_deep_link_en="https://dib.ae/finance/personal-nst?utm_source=smartmoney",
                commission_percentage=1.2,
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
                # Skip non-product content (FAQ, chat, branch locators)
                skip_words = ["visit", "branch", "chat", "faq", "question", "assistant", "contact", "call"]
                if any(sw in title.lower() for sw in skip_words):
                    continue

                desc = card.find("p").get_text(strip=True)[:500] if card.find("p") else ""

                text = card.get_text(" ", strip=True).lower()
                features = {"sharia_compliant": True, "contactless": True, "apple_pay": True}

                cb = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
                if cb:
                    features["cashback_rate"] = f"up to {cb.group(1)}%"

                fee_m = re.search(r"(?:fee)\s*(?:aed\s*)?([\d,]+)", text)
                if fee_m:
                    features["annual_fee"] = f"AED {fee_m.group(1)}"

                features["lounge_access"] = "lounge" in text
                features["concierge"] = "concierge" in text

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=title if "ADIB" in title else f"ADIB {title}",
                    description_en=desc,
                    min_salary_aed=8000,
                    representative_rate=0,
                    rate_type="fixed",
                    key_features=features,
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
                key_features={
                    "annual_fee": "AED 300",
                    "min_salary": "AED 8,000",
                    "cashback_rate": "up to 5%",
                    "card_tier": "Platinum",
                    "best_for": "Islamic cashback with no interest charges",
                    "sharia_compliant": True,
                    "contactless": True,
                    "apple_pay": True,
                    "supplementary_cards": "Free",
                    "lounge_access": False,
                    "concierge": False,
                    "interest_free_days": "55 days",
                },
                affiliate_deep_link_en="https://adib.ae/cards/cashback?utm_source=smartmoney",
                commission_amount_aed=250,
                islamic_compliant=True,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADIB Covered Card Visa Signature",
                name_ar="بطاقة أبوظبي الإسلامي كفرد فيزا سيغنتشر",
                description_en="Islamic cashback card with no interest charges. Up to 10% cashback on partner merchants.",
                min_salary_aed=15000,
                representative_rate=0,
                rate_type="fixed",
                key_features={
                    "annual_fee": "AED 0",
                    "min_salary": "AED 15,000",
                    "cashback_rate": "up to 10%",
                    "card_tier": "Signature",
                    "best_for": "Islamic cashback with no interest charges",
                    "sharia_compliant": True,
                    "contactless": True,
                    "apple_pay": True,
                    "lounge_access": True,
                    "travel_insurance": True,
                    "concierge": False,
                    "supplementary_cards": "Free",
                    "interest_free_days": "55 days",
                },
                affiliate_deep_link_en="https://adib.ae/cards/covered-card?utm_source=smartmoney",
                commission_amount_aed=350,
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
                name_en="ADIB Personal Finance (Salary Transfer)",
                name_ar="التمويل الشخصي من مصرف أبوظبي الإسلامي (تحويل الراتب)",
                description_en="Sharia-compliant personal finance with competitive profit rates from 5.49%. Up to AED 2 million with salary transfer.",
                description_ar="تمويل شخصي متوافق مع الشريعة بأسعار ربح تبدأ من 5.49% مع تحويل الراتب.",
                min_salary_aed=10000,
                representative_rate=5.49,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=2000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "profit_rate": "5.49% p.a. (salary transfer)",
                    "reducing_rate": "10.25% p.a.",
                    "processing_fee": "1% of financing amount",
                    "min_salary": "AED 10,000",
                    "max_financing": "AED 2,000,000",
                    "max_tenure": "48 months",
                    "salary_transfer_required": True,
                    "takaful_included": True,
                    "murabaha_structure": True,
                    "early_settlement_fee": "1% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "Same day",
                    "top_up": True,
                    "nationality": "All nationalities",
                    "best_for": "Sharia-compliant salary transfer customers",
                },
                affiliate_deep_link_en="https://adib.ae/personal-finance?utm_source=smartmoney",
                commission_percentage=1.5,
                commission_type="percentage",
                islamic_compliant=True,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="ADIB Personal Finance (Non-Salary Transfer)",
                name_ar="التمويل الشخصي من مصرف أبوظبي الإسلامي (بدون تحويل الراتب)",
                description_en="Flexible Sharia-compliant personal finance without salary transfer. Profit rates from 7.25%.",
                description_ar="تمويل شخصي مرن متوافق مع الشريعة بدون تحويل الراتب.",
                min_salary_aed=15000,
                representative_rate=7.25,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=750000,
                min_tenure_months=12,
                max_tenure_months=36,
                key_features={
                    "profit_rate": "7.25% p.a. (non-salary transfer)",
                    "reducing_rate": "13.25% p.a.",
                    "processing_fee": "1.5% of financing amount",
                    "min_salary": "AED 15,000",
                    "max_financing": "AED 750,000",
                    "max_tenure": "36 months",
                    "salary_transfer_required": False,
                    "takaful_included": True,
                    "murabaha_structure": True,
                    "early_settlement_fee": "1.5% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "Next business day",
                    "top_up": False,
                    "nationality": "All nationalities",
                    "best_for": "Non-salary transfer Islamic finance seekers",
                },
                affiliate_deep_link_en="https://adib.ae/personal-finance/non-st?utm_source=smartmoney",
                commission_percentage=1.2,
                commission_type="percentage",
                islamic_compliant=True,
                data_source="scrape",
            ),
        ]
