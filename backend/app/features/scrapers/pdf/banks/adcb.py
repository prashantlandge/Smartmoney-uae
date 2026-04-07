"""ADCB PDF parser."""

import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_personal_loan_data,
)

logger = logging.getLogger("scrapers.pdf.adcb")


class ADCBPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000003"
    PROVIDER_NAME = "ADCB"
    PROVIDER_KEY = "adcb"

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
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        # ADCB uses TouchPoints branding
        products = []
        import re
        card_types = re.findall(
            r"(TouchPoints?\s*(?:Infinite|Platinum|Titanium|Classic))", text, re.I
        )
        if card_types:
            for ct in set(card_types):
                idx = text.lower().find(ct.lower())
                section = text[max(0, idx - 100):idx + 2000] if idx >= 0 else text
                cf = extract_credit_card_data(section, tables)
                cf["source_document"] = "KFS"
                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"ADCB {ct.strip()} Credit Card",
                    key_features=cf,
                ))
        else:
            features["source_document"] = "KFS"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADCB Credit Card (KFS)",
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
            name_en="ADCB Personal Loan",
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
                    elif "processing" in label and "fee" in label:
                        features["processing_fee_soc"] = value
                    elif "early" in label and "settlement" in label:
                        features["early_settlement_fee_soc"] = value
        if features:
            features["source_document"] = "SOC"
            return [ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADCB Schedule of Charges",
                key_features=features,
            )]
        return []
