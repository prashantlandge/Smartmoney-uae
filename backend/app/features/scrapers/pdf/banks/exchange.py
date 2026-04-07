"""Exchange house / remittance provider PDF parsers."""

import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import extract_fee_schedule

logger = logging.getLogger("scrapers.pdf.exchange")


class _ExchangePDFBase(PDFScraper):
    """Shared logic for exchange house/remittance PDF parsers."""

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        doc_name = doc_info.get("name", "Fee Schedule")

        features = extract_fee_schedule(text, tables)
        if not features:
            return []

        features["source_document"] = doc_name
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="remittance",
            name_en=f"{self.PROVIDER_NAME} Fee Schedule",
            description_en=f"Fee and rate data from {doc_name}",
            key_features=features,
        )]


class WisePDFScraper(_ExchangePDFBase):
    PROVIDER_ID = "a0000001-0000-0000-0000-000000000001"
    PROVIDER_NAME = "Wise"
    PROVIDER_KEY = "wise"


class RemitlyPDFScraper(_ExchangePDFBase):
    PROVIDER_ID = "a0000001-0000-0000-0000-000000000002"
    PROVIDER_NAME = "Remitly"
    PROVIDER_KEY = "remitly"


class WesternUnionPDFScraper(_ExchangePDFBase):
    PROVIDER_ID = "a0000001-0000-0000-0000-000000000003"
    PROVIDER_NAME = "Western Union"
    PROVIDER_KEY = "western_union"


class AlAnsariPDFScraper(_ExchangePDFBase):
    PROVIDER_ID = "a0000001-0000-0000-0000-000000000004"
    PROVIDER_NAME = "Al Ansari Exchange"
    PROVIDER_KEY = "al_ansari"


class UAEExchangePDFScraper(_ExchangePDFBase):
    PROVIDER_ID = "a0000001-0000-0000-0000-000000000005"
    PROVIDER_NAME = "UAE Exchange"
    PROVIDER_KEY = "uae_exchange"


class LuluExchangePDFScraper(_ExchangePDFBase):
    PROVIDER_ID = "a0000001-0000-0000-0000-000000000006"
    PROVIDER_NAME = "Lulu Exchange"
    PROVIDER_KEY = "lulu_exchange"
