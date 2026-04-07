"""Liv. + Wio Bank PDF parsers."""

import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import extract_credit_card_data

logger = logging.getLogger("scrapers.pdf.digital_banks")


class LivPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000012"
    PROVIDER_NAME = "Liv."
    PROVIDER_KEY = "liv"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        features["source_document"] = "Product Terms"
        features["digital_only"] = True
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="credit_card",
            name_en="Liv. Credit Card",
            key_features=features,
        )]


class WioPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000013"
    PROVIDER_NAME = "Wio Bank"
    PROVIDER_KEY = "wio"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        features = extract_credit_card_data(text, tables)
        if not features:
            return []

        features["source_document"] = "Product Terms"
        features["digital_only"] = True
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="credit_card",
            name_en="Wio Credit Card",
            key_features=features,
        )]
