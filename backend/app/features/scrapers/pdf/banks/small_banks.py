"""Ajman Bank + Sharjah Islamic Bank PDF parsers."""

import re
import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import (
    extract_credit_card_data,
    extract_islamic_finance_data,
)

logger = logging.getLogger("scrapers.pdf.small_banks")


class AjmanBankPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000015"
    PROVIDER_NAME = "Ajman Bank"
    PROVIDER_KEY = "ajman_bank"

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
        features["source_document"] = "KFS"
        features["islamic_compliant"] = True
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="credit_card",
            name_en="Ajman Bank Covered Card (KFS)",
            key_features=features,
            islamic_compliant=True,
        )]

    def _extract_islamic_finance(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_islamic_finance_data(text, tables)
        if not features:
            return []
        features["source_document"] = "KFS"
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="islamic_finance",
            name_en="Ajman Bank Personal Finance",
            key_features=features,
            islamic_compliant=True,
        )]


class SharjahIslamicPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000016"
    PROVIDER_NAME = "Sharjah Islamic Bank"
    PROVIDER_KEY = "sharjah_islamic"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")

        if category == "credit_card":
            return self._extract_covered_cards(text, tables)
        elif category == "islamic_finance":
            return self._extract_islamic_finance(text, tables)
        return []

    def _extract_covered_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_credit_card_data(text, tables)
        if not features:
            return []
        features["source_document"] = "KFS"
        features["islamic_compliant"] = True
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="credit_card",
            name_en="SIB Covered Card (KFS)",
            key_features=features,
            islamic_compliant=True,
        )]

    def _extract_islamic_finance(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_islamic_finance_data(text, tables)
        if not features:
            return []
        features["source_document"] = "KFS"
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="islamic_finance",
            name_en="SIB Personal Finance",
            key_features=features,
            islamic_compliant=True,
        )]
