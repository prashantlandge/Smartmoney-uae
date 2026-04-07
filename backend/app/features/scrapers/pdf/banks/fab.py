"""FAB (First Abu Dhabi Bank) PDF parser."""

import re
import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_personal_loan_data,
)

logger = logging.getLogger("scrapers.pdf.fab")


class FABPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000002"
    PROVIDER_NAME = "First Abu Dhabi Bank"
    PROVIDER_KEY = "fab"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")
        doc_type = doc_info.get("doc_type", "")

        if category == "credit_card":
            return self._extract_credit_cards(text, tables)
        elif category == "personal_loan":
            return self._extract_personal_loans(text, tables)
        elif doc_type == "soc":
            return self._extract_fees(text, tables)
        return []

    def _extract_credit_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        products = []
        card_names = self._find_card_names(text)

        if card_names:
            for name in card_names:
                # Extract section around card name
                idx = text.lower().find(name.lower())
                section = text[max(0, idx - 100):idx + 2000] if idx >= 0 else text
                features = extract_credit_card_data(section, tables)
                features["source_document"] = "KFS"
                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"FAB {name}",
                    key_features=features,
                ))
        else:
            features = extract_credit_card_data(text, tables)
            if features:
                features["source_document"] = "KFS"
                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en="FAB Credit Card (KFS)",
                    key_features=features,
                ))
        return products

    def _extract_personal_loans(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_personal_loan_data(text, tables)
        if not features:
            return []

        features["source_document"] = "KFS"
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="personal_loan",
            name_en="FAB Personal Loan",
            key_features=features,
        )]

    def _extract_fees(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = {}
        for table in tables:
            for row in table:
                if len(row) >= 2:
                    label = row[0].lower()
                    value = row[1].strip() if row[1] else ""
                    if not value:
                        continue
                    if "annual" in label and "fee" in label:
                        features["annual_fee_soc"] = value
                    elif "cash advance" in label:
                        features["cash_advance_fee_soc"] = value
                    elif "late" in label and "payment" in label:
                        features["late_payment_fee_soc"] = value
        if features:
            features["source_document"] = "SOC"
            return [ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="FAB Schedule of Charges",
                key_features=features,
            )]
        return []

    def _find_card_names(self, text: str) -> list[str]:
        patterns = [
            r"FAB\s+(Rewards?\s*(?:Platinum|Infinite|World)?)",
            r"FAB\s+(Cashback\s*(?:Credit)?)",
            r"FAB\s+(Emirates\s*(?:Skywards)?)",
            r"FAB\s+(Etihad\s*(?:Guest)?)",
        ]
        names = []
        for p in patterns:
            matches = re.findall(p, text, re.I)
            names.extend(matches)
        return list(set(names))
