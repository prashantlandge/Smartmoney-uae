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
                name_en="ADCB Traveller Credit Card",
                name_ar="بطاقة أبوظبي التجاري ترافلر",
                description_en="Earn Etihad Guest Miles on every purchase. Free airport lounge access and golf privileges.",
                min_salary_aed=15000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 525",
                    "min_salary": "AED 15,000",
                    "rewards_rate": "up to 3x Etihad Miles",
                    "card_tier": "Signature",
                    "best_for": "Skywards miles collectors and frequent flyers",
                    "lounge_access": True,
                    "travel_insurance": True,
                    "concierge": False,
                    "contactless": True,
                    "apple_pay": True,
                    "golf": True,
                    "supplementary_cards": "Free",
                    "interest_free_days": "55 days",
                },
                affiliate_deep_link_en="https://adcb.com/cards/traveller?utm_source=smartmoney",
                commission_amount_aed=350,
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADCB TouchPoints Infinite Credit Card",
                name_ar="بطاقة أبوظبي التجاري إنفينيت",
                description_en="Premium card with unlimited airport lounge access and up to 10x TouchPoints on select categories.",
                min_salary_aed=30000,
                representative_rate=3.49,
                rate_type="variable",
                key_features={
                    "annual_fee": "AED 1,000",
                    "min_salary": "AED 30,000",
                    "rewards_rate": "up to 10x TouchPoints",
                    "card_tier": "Infinite",
                    "best_for": "Maximizing TouchPoints rewards",
                    "lounge_access": True,
                    "travel_insurance": True,
                    "concierge": True,
                    "contactless": True,
                    "apple_pay": True,
                    "valet_parking": True,
                    "golf": True,
                    "supplementary_cards": "Free",
                },
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
                description_en="Competitive rates starting from 6.49% with salary transfer. Quick approval within 30 minutes.",
                description_ar="أسعار تنافسية تبدأ من 6.49% مع تحويل الراتب.",
                min_salary_aed=5000,
                representative_rate=6.49,
                rate_type="fixed",
                min_amount_aed=15000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={
                    "flat_rate": "6.49% p.a. (salary transfer)",
                    "reducing_rate": "11.99% p.a.",
                    "processing_fee": "1.05% of loan amount",
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
                    "best_for": "Salary transfer customers seeking flexibility",
                },
                affiliate_deep_link_en="https://adcb.com/loans/personal?utm_source=smartmoney",
                commission_percentage=1.25,
                commission_type="percentage",
                data_source="scrape",
            ),
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="ADCB Instant Loan",
                name_ar="قرض فوري من أبوظبي التجاري",
                description_en="Instant personal loan for existing ADCB customers. Approval in 10 minutes.",
                description_ar="قرض فوري للعملاء الحاليين. الموافقة خلال 10 دقائق.",
                min_salary_aed=10000,
                representative_rate=7.75,
                rate_type="fixed",
                min_amount_aed=15000,
                max_amount_aed=300000,
                min_tenure_months=12,
                max_tenure_months=36,
                key_features={
                    "flat_rate": "7.75% p.a. (non-salary transfer)",
                    "reducing_rate": "14.25% p.a.",
                    "processing_fee": "1.5% of loan amount",
                    "min_salary": "AED 10,000",
                    "max_loan_amount": "AED 300,000",
                    "max_tenure": "36 months",
                    "salary_transfer_required": False,
                    "insurance_included": True,
                    "early_settlement_fee": "1.5% of outstanding balance",
                    "dbr": "50%",
                    "disbursement_time": "10 minutes (existing customers)",
                    "top_up": False,
                    "balance_transfer": False,
                    "nationality": "All nationalities",
                    "best_for": "Existing ADCB customers needing quick funds",
                },
                affiliate_deep_link_en="https://adcb.com/loans/instant?utm_source=smartmoney",
                commission_percentage=1.0,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
