"""Emirates Islamic PDF parser."""

import re
import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_islamic_finance_data,
)

logger = logging.getLogger("scrapers.pdf.emirates_islamic")


class EmiratesIslamicPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000008"
    PROVIDER_NAME = "Emirates Islamic"
    PROVIDER_KEY = "emirates_islamic"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")

        if category == "credit_card":
            return self._extract_credit_cards(text, tables)
        elif category == "islamic_finance":
            return self._extract_islamic_finance(text, tables)
        return []

    def _extract_credit_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        products = []
        card_types = re.findall(
            r"(Skywards\s*(?:Signature|Infinite|Gold)?|Cashback|Flex|Classic)", text, re.I
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
                    name_en=f"Emirates Islamic {ct.strip()} Card",
                    key_features=cf,
                    islamic_compliant=True,
                ))
        else:
            features["source_document"] = "KFS"
            features["islamic_compliant"] = True
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Emirates Islamic Credit Card (KFS)",
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
            name_en="Emirates Islamic Personal Finance",
            key_features=features,
            islamic_compliant=True,
        )]
