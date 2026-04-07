"""HSBC + Standard Chartered PDF parsers."""

import re
import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_personal_loan_data,
)

logger = logging.getLogger("scrapers.pdf.hsbc")


class HSBCPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000009"
    PROVIDER_NAME = "HSBC UAE"
    PROVIDER_KEY = "hsbc"

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
        products = []

        card_types = re.findall(
            r"(Live\+?|Cashback|Platinum|Gold|Black|Premier)", text, re.I
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
                    name_en=f"HSBC {ct.strip()} Credit Card",
                    key_features=cf,
                ))
        elif features:
            features["source_document"] = "KFS"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="HSBC Credit Card (KFS)",
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
            name_en="HSBC Personal Loan",
            key_features=features,
        )]

    def _extract_fees(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = {}
        for table in tables:
            for row in table:
                if len(row) >= 2:
                    label = row[0].lower()
                    value = row[1].strip() if row[1] else ""
                    if value:
                        if "annual" in label and "fee" in label:
                            features["annual_fee_soc"] = value
                        elif "late" in label:
                            features["late_payment_fee_soc"] = value
        if features:
            features["source_document"] = "T&C"
            return [ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="HSBC Terms & Conditions",
                key_features=features,
            )]
        return []


class StandardCharteredPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000010"
    PROVIDER_NAME = "Standard Chartered UAE"
    PROVIDER_KEY = "standard_chartered"

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
        products = []

        card_types = re.findall(
            r"(Infinite|Platinum|Rewards\+?|Cashback|Priority)", text, re.I
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
                    name_en=f"Standard Chartered {ct.strip()} Credit Card",
                    key_features=cf,
                ))
        elif features:
            features["source_document"] = "KFS"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Standard Chartered Credit Card (KFS)",
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
            name_en="Standard Chartered Personal Loan",
            key_features=features,
        )]

    def _extract_fees(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = {}
        for table in tables:
            for row in table:
                if len(row) >= 2:
                    label = row[0].lower()
                    value = row[1].strip() if row[1] else ""
                    if value:
                        if "annual" in label and "fee" in label:
                            features["annual_fee_soc"] = value
                        elif "late" in label:
                            features["late_payment_fee_soc"] = value
                        elif "cash" in label and "advance" in label:
                            features["cash_advance_fee_soc"] = value
        if features:
            features["source_document"] = "SOC"
            return [ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Standard Chartered Schedule of Charges",
                key_features=features,
            )]
        return []
