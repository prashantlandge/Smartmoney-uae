"""Emirates NBD PDF parser — extracts product data from KFS and SOC PDFs."""

import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_personal_loan_data,
)

logger = logging.getLogger("scrapers.pdf.emirates_nbd")


class EmiratesNBDPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000001"
    PROVIDER_NAME = "Emirates NBD"
    PROVIDER_KEY = "emirates_nbd"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")
        doc_type = doc_info.get("doc_type", "")

        if category == "credit_card" or (doc_type == "kfs" and "credit" in doc_info.get("name", "").lower()):
            return self._extract_credit_cards(text, tables)
        elif category == "personal_loan" or (doc_type == "kfs" and "loan" in doc_info.get("name", "").lower()):
            return self._extract_personal_loans(text, tables)
        elif doc_type == "soc":
            return self._extract_soc_enhancements(text, tables)
        return []

    def _extract_credit_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        products = []
        # KFS typically covers multiple card variants in sections
        card_sections = self._split_card_sections(text)

        if card_sections:
            for card_name, section_text in card_sections.items():
                card_features = extract_credit_card_data(section_text, tables)
                card_features.update({"source_document": "KFS"})
                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"Emirates NBD {card_name}",
                    key_features=card_features,
                    representative_rate=card_features.get("interest_rate_retail"),
                ))
        else:
            # Single card or combined KFS
            features["source_document"] = "KFS"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Emirates NBD Credit Card (KFS)",
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
            name_en="Emirates NBD Personal Loan",
            key_features=features,
            representative_rate=features.get("flat_rate_salary_transfer"),
            min_salary_aed=features.get("min_salary"),
        )]

    def _extract_soc_enhancements(self, text: str, tables: list) -> list[ScrapedProduct]:
        """Extract fee data from Schedule of Charges to enhance existing products."""
        # SOC data merges into existing products via upsert
        features = {}
        for table in tables:
            for row in table:
                if len(row) >= 2:
                    label = row[0].lower().strip()
                    value = row[1].strip() if row[1] else ""
                    if not value:
                        continue
                    if "cheque" in label and "return" in label:
                        features["cheque_return_fee"] = value
                    elif "atm" in label and "withdrawal" in label:
                        features["atm_withdrawal_fee"] = value
                    elif "balance" in label and "enquiry" in label:
                        features["balance_enquiry_fee"] = value
                    elif "duplicate" in label and "statement" in label:
                        features["duplicate_statement_fee"] = value

        if not features:
            return []

        features["source_document"] = "SOC"
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="credit_card",
            name_en="Emirates NBD Schedule of Charges",
            key_features=features,
        )]

    def _split_card_sections(self, text: str) -> dict[str, str]:
        """Split KFS text into per-card sections."""
        import re
        sections = {}
        # Common ENBD card names
        card_patterns = [
            r"(Go4it\s*(?:Cashback)?)",
            r"(Skywards\s*(?:Infinite|Signature|Gold)?)",
            r"(Platinum\s*(?:Credit)?)",
            r"(Infinite\s*(?:Credit)?)",
            r"(World\s*(?:Credit)?)",
            r"(Classic\s*(?:Credit)?)",
        ]
        combined = "|".join(card_patterns)
        matches = list(re.finditer(combined, text, re.I))

        for i, match in enumerate(matches):
            card_name = match.group(0).strip()
            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            sections[card_name] = text[start:end]

        return sections
