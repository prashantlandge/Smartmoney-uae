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
                description_en="Digital-first credit card with instant approval and up to 2% unlimited cashback.",
                min_salary_aed=5000,
                representative_rate=3.15,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 0",
                    "min_salary": "AED 5,000",
                    "cashback_rate": "up to 2%",
                    "card_tier": "Classic",
                    "best_for": "Low salary requirement with instant approval",
                    "contactless": True,
                    "apple_pay": True,
                    "supplementary_cards": "Free",
                    "lounge_access": False,
                    "travel_insurance": False,
                    "concierge": False,
                    "interest_free_days": "52 days",
                },
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
                key_features={
                    "annual_fee": "AED 750",
                    "min_salary": "AED 25,000",
                    "rewards_rate": "up to 5x Salaam points",
                    "card_tier": "World Elite",
                    "best_for": "Premium lifestyle and travel benefits",
                    "lounge_access": True,
                    "travel_insurance": True,
                    "concierge": True,
                    "contactless": True,
                    "apple_pay": True,
                    "valet_parking": True,
                    "supplementary_cards": "Free",
                },
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
                description_en="Competitive rates starting from 6.25% with salary transfer. Quick approval within 30 minutes.",
                description_ar="أسعار تنافسية تبدأ من 6.25% مع تحويل الراتب.",
                min_salary_aed=5000,
                representative_rate=6.25,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "flat_rate": "6.25% p.a. (salary transfer)",
                    "reducing_rate": "11.50% p.a.",
                    "processing_fee": "1% of loan amount",
                    "min_salary": "AED 5,000",
                    "max_loan_amount": "AED 1,000,000",
                    "max_tenure": "48 months",
                    "salary_transfer_required": True,
                    "insurance_included": True,
                    "early_settlement_fee": "1% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "30 minutes",
                    "top_up": True,
                    "balance_transfer": True,
                    "nationality": "All nationalities",
                    "best_for": "Salaried professionals",
                },
                affiliate_deep_link_en="https://mashreqbank.com/loans/personal?utm_source=smartmoney",
                commission_percentage=1.0,
                commission_type="percentage",
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="Mashreq Cashback Loan",
                name_ar="قرض كاش باك من مشرق",
                description_en="Personal loan with zero processing fee and cashback benefits. Rates from 7.25%.",
                description_ar="قرض شخصي بدون رسوم معالجة مع مزايا استرداد نقدي.",
                min_salary_aed=8000,
                representative_rate=7.25,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=500000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "flat_rate": "7.25% p.a. (non-salary transfer)",
                    "reducing_rate": "13.25% p.a.",
                    "processing_fee": "0% of loan amount",
                    "min_salary": "AED 8,000",
                    "max_loan_amount": "AED 500,000",
                    "max_tenure": "48 months",
                    "salary_transfer_required": False,
                    "insurance_included": True,
                    "early_settlement_fee": "1% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "Same day",
                    "top_up": True,
                    "balance_transfer": False,
                    "nationality": "All nationalities",
                    "best_for": "Zero processing fee seekers",
                },
                affiliate_deep_link_en="https://mashreqbank.com/loans/cashback?utm_source=smartmoney",
                commission_percentage=0.8,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
