"""DIB (Dubai Islamic Bank) + ADIB PDF parsers."""

import re
import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_islamic_finance_data,
)

logger = logging.getLogger("scrapers.pdf.dib")


class DIBPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000006"
    PROVIDER_NAME = "Dubai Islamic Bank"
    PROVIDER_KEY = "dib"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")

        if category == "credit_card":
            return self._extract_credit_cards(text, tables)
        elif category == "islamic_finance":
            return self._extract_islamic_finance(text, tables)
        return self._extract_generic(text, tables)

    def _extract_credit_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        products = []
        card_types = re.findall(
            r"(Prime\s*(?:Infinite|Platinum)?|Al\s*Islami|Classic|Gold)", text, re.I
        )
        if card_types:
            for ct in set(card_types):
                idx = text.lower().find(ct.lower())
                section = text[max(0, idx - 100):idx + 2000] if idx >= 0 else text
                cf = extract_credit_card_data(section, tables)
                cf["source_document"] = "KFS"
                cf["islamic_compliant"] = True
                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"DIB {ct.strip()} Card",
                    key_features=cf,
                    islamic_compliant=True,
                ))
        else:
            features["source_document"] = "KFS"
            features["islamic_compliant"] = True
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="DIB Credit Card (KFS)",
                key_features=features,
                islamic_compliant=True,
            ))
        return products

    def _extract_islamic_finance(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_islamic_finance_data(text, tables)
        if not features:
            return []
        features["source_document"] = "KFS"
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="islamic_finance",
            name_en="DIB Personal Finance",
            key_features=features,
            islamic_compliant=True,
        )]

    def _extract_generic(self, text: str, tables: list) -> list[ScrapedProduct]:
        # Brochure — extract whatever is available
        cc_features = extract_credit_card_data(text, tables)
        if_features = extract_islamic_finance_data(text, tables)
        products = []
        if cc_features:
            cc_features["source_document"] = "Brochure"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="DIB Credit Card (Brochure)",
                key_features=cc_features,
                islamic_compliant=True,
            ))
        if if_features:
            if_features["source_document"] = "Brochure"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="islamic_finance",
                name_en="DIB Personal Finance (Brochure)",
                key_features=if_features,
                islamic_compliant=True,
            ))
        return products


class ADIBPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000007"
    PROVIDER_NAME = "ADIB"
    PROVIDER_KEY = "adib"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")
        doc_type = doc_info.get("doc_type", "")

        if category == "credit_card":
            return self._extract_covered_cards(text, tables)
        elif category == "islamic_finance":
            return self._extract_islamic_finance(text, tables)
        elif doc_type == "soc":
            return self._extract_fees(text, tables)
        return []

    def _extract_covered_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        products = []
        card_types = re.findall(
            r"(Dana|Etihad\s*Guest|Classic|Gold|Platinum|Infinite)", text, re.I
        )
        if card_types:
            for ct in set(card_types):
                idx = text.lower().find(ct.lower())
                section = text[max(0, idx - 100):idx + 2000] if idx >= 0 else text
                cf = extract_credit_card_data(section, tables)
                cf["source_document"] = "KFS"
                cf["islamic_compliant"] = True
                products.append(ScrapedProduct(
                    provider_id=self.PROVIDER_ID,
                    category="credit_card",
                    name_en=f"ADIB {ct.strip()} Covered Card",
                    key_features=cf,
                    islamic_compliant=True,
                ))
        else:
            features["source_document"] = "KFS"
            features["islamic_compliant"] = True
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADIB Covered Card (KFS)",
                key_features=features,
                islamic_compliant=True,
            ))
        return products

    def _extract_islamic_finance(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_islamic_finance_data(text, tables)
        if not features:
            return []
        features["source_document"] = "KFS"
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="islamic_finance",
            name_en="ADIB Personal Finance",
            key_features=features,
            islamic_compliant=True,
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
                        elif "processing" in label:
                            features["processing_fee_soc"] = value
                        elif "early" in label and "settlement" in label:
                            features["early_settlement_fee_soc"] = value
        if features:
            features["source_document"] = "Fee Schedule"
            return [ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="ADIB Fee Schedule",
                key_features=features,
                islamic_compliant=True,
            )]
        return []
