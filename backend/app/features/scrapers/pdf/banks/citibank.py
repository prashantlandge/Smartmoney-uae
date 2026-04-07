"""Citibank UAE PDF parser."""

import re
import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import extract_credit_card_data

logger = logging.getLogger("scrapers.pdf.citibank")


class CitibankPDFScraper(PDFScraper):
    PROVIDER_ID = "b0000001-0000-0000-0000-000000000011"
    PROVIDER_NAME = "Citibank UAE"
    PROVIDER_KEY = "citibank"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "")
        doc_type = doc_info.get("doc_type", "")

        if category == "credit_card":
            return self._extract_credit_cards(text, tables)
        elif doc_type == "soc":
            return self._extract_fees(text, tables)
        return []

    def _extract_credit_cards(self, text: str, tables: list) -> list[ScrapedProduct]:
        features = extract_credit_card_data(text, tables)
        products = []

        card_types = re.findall(
            r"(Prestige|Premier|Rewards\+?|Cashback|Gold)", text, re.I
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
                    name_en=f"Citi {ct.strip()} Credit Card",
                    key_features=cf,
                ))
        elif features:
            features["source_document"] = "KFS"
            products.append(ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Citibank Credit Card (KFS)",
                key_features=features,
            ))
        return products

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
            features["source_document"] = "Fee Schedule"
            return [ScrapedProduct(
                provider_id=self.PROVIDER_ID,
                category="credit_card",
                name_en="Citibank Fee Schedule",
                key_features=features,
            )]
        return []
