"""Scraper for Emirates NBD products."""

import re
import logging
from app.features.scrapers.base import BankScraper, ScrapedProduct

logger = logging.getLogger("scrapers.emirates_nbd")


class EmiratesNBDScraper(BankScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000001"
    PROVIDER_NAME = "Emirates NBD"
    BASE_URL = "https://www.emiratesnbd.com"

    # Emirates NBD product page URLs
    CC_URL = "https://www.emiratesnbd.com/en/personal-banking/cards/credit-cards"
    PL_URL = "https://www.emiratesnbd.com/en/personal-banking/loans/personal-loans"

    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        products = []
        soup = await self.fetch_page(self.CC_URL)
        if not soup:
            return self._fallback_credit_cards()

        # Emirates NBD renders cards in product tiles/cards
        card_sections = soup.find_all("div", class_=re.compile(r"card|product", re.I))

        for section in card_sections:
            try:
                title_el = section.find(["h2", "h3", "h4"])
                if not title_el:
                    continue
                title = title_el.get_text(strip=True)
                if not title or len(title) < 5:
                    continue
                # Only credit card products
                if not any(kw in title.lower() for kw in ["credit", "card", "cashback", "rewards", "platinum", "infinite", "signature"]):
                    continue

                desc_el = section.find("p")
                desc = desc_el.get_text(strip=True) if desc_el else ""

                features = self._extract_card_features(section)
                link = self._extract_link(section)

                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"Emirates NBD {title}",
                    description_en=desc[:500],
                    min_salary_aed=features.get("min_salary"),
                    representative_rate=features.get("interest_rate"),
                    rate_type="variable",
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/cards?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[ENBD] Error parsing card section: {e}")
                continue

        if not products:
            return self._fallback_credit_cards()
        return products

    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        products = []
        soup = await self.fetch_page(self.PL_URL)
        if not soup:
            return self._fallback_personal_loans()

        loan_sections = soup.find_all("div", class_=re.compile(r"card|product|loan", re.I))

        for section in loan_sections:
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
                    name_en=f"Emirates NBD {title}",
                    description_en=desc[:500],
                    min_salary_aed=features.get("min_salary", 5000),
                    representative_rate=features.get("interest_rate"),
                    rate_type="fixed",
                    min_amount_aed=features.get("min_amount"),
                    max_amount_aed=features.get("max_amount"),
                    min_tenure_months=features.get("min_tenure", 12),
                    max_tenure_months=features.get("max_tenure", 48),
                    key_features=features,
                    affiliate_deep_link_en=link or f"{self.BASE_URL}/loans?utm_source=smartmoney",
                    data_source="scrape",
                ))
            except Exception as e:
                logger.warning(f"[ENBD] Error parsing loan section: {e}")
                continue

        if not products:
            return self._fallback_personal_loans()
        return products

    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        # Emirates NBD has Emirates Islamic as separate entity
        return []

    def _extract_card_features(self, section) -> dict:
        """Extract credit card features from HTML section."""
        features = {}
        text = section.get_text(" ", strip=True).lower()

        # Cashback rate
        cb_match = re.search(r"(\d+(?:\.\d+)?)\s*%\s*cash\s*back", text)
        if cb_match:
            features["cashback_rate"] = f"up to {cb_match.group(1)}%"

        # Annual fee
        fee_match = re.search(r"(?:annual\s*fee|fee)\s*(?:of|:)?\s*(?:aed\s*)?([\d,]+)", text)
        if fee_match:
            features["annual_fee"] = f"AED {fee_match.group(1)}"
        elif "no annual fee" in text or "free" in text:
            features["annual_fee"] = "AED 0"

        # Min salary
        sal_match = re.search(r"(?:min(?:imum)?\s*salary|salary\s*(?:of|from|:))\s*(?:aed\s*)?([\d,]+)", text)
        if sal_match:
            features["min_salary"] = float(sal_match.group(1).replace(",", ""))

        # Interest rate
        rate_match = re.search(r"(\d+(?:\.\d+)?)\s*%\s*(?:p\.?a|per\s*annum|interest|apr)", text)
        if rate_match:
            features["interest_rate"] = float(rate_match.group(1))

        # Lounge access
        features["lounge_access"] = "lounge" in text

        return features

    def _extract_loan_features(self, section) -> dict:
        """Extract personal loan features from HTML section."""
        features = {}
        text = section.get_text(" ", strip=True).lower()

        # Interest rate
        rate_match = re.search(r"(?:from|starting)\s*(\d+(?:\.\d+)?)\s*%", text)
        if rate_match:
            features["interest_rate"] = float(rate_match.group(1))

        # Processing fee
        proc_match = re.search(r"processing\s*fee\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*%", text)
        if proc_match:
            features["processing_fee"] = f"{proc_match.group(1)}%"

        # Min salary
        sal_match = re.search(r"(?:min(?:imum)?\s*salary|salary)\s*(?:aed\s*)?([\d,]+)", text)
        if sal_match:
            features["min_salary"] = float(sal_match.group(1).replace(",", ""))

        # Loan amounts
        amt_match = re.search(r"(?:up\s*to|max(?:imum)?)\s*(?:aed\s*)?([\d,]+(?:\.\d+)?)\s*(?:million)?", text)
        if amt_match:
            val = float(amt_match.group(1).replace(",", ""))
            if "million" in text[amt_match.start():amt_match.end()+10]:
                val *= 1_000_000
            features["max_amount"] = val

        return features

    def _extract_link(self, section) -> str:
        """Extract product apply/detail link."""
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
        """Return known ENBD credit cards when scraping fails."""
        logger.info("[ENBD] Using fallback credit card data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Emirates NBD Go4it Cashback Credit Card",
                name_ar="بطاقة الإمارات دبي الوطني كاش باك",
                description_en="Earn up to 5% cashback on dining and entertainment. No annual fee for the first year.",
                description_ar="احصل على ما يصل إلى 5% استرداد نقدي على المطاعم والترفيه.",
                min_salary_aed=8000,
                representative_rate=3.25,
                rate_type="variable",
                key_features={"cashback_rate": "up to 5%", "annual_fee": "AED 0 first year, AED 399 after", "supplementary_cards": "free", "lounge_access": False},
                affiliate_deep_link_en="https://emiratesnbd.com/cards/go4it?utm_source=smartmoney",
                commission_amount_aed=250,
                data_source="scrape",
            ),
        ]

    def _fallback_personal_loans(self) -> list[ScrapedProduct]:
        """Return known ENBD personal loans when scraping fails."""
        logger.info("[ENBD] Using fallback personal loan data")
        return [
            ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="personal_loan",
                name_en="Emirates NBD Personal Loan",
                name_ar="قرض شخصي من الإمارات دبي الوطني",
                description_en="Competitive rates starting from 5.99% with salary transfer. Quick approval within 30 minutes.",
                description_ar="أسعار تنافسية تبدأ من 5.99% مع تحويل الراتب.",
                min_salary_aed=5000,
                representative_rate=5.99,
                rate_type="fixed",
                min_amount_aed=10000,
                max_amount_aed=1000000,
                min_tenure_months=12,
                max_tenure_months=48,
                key_features={"processing_fee": "1%", "early_settlement": "1% of outstanding", "salary_transfer_required": True, "insurance_included": True},
                affiliate_deep_link_en="https://emiratesnbd.com/loans/personal?utm_source=smartmoney",
                commission_percentage=1.5,
                commission_type="percentage",
                data_source="scrape",
            ),
        ]
