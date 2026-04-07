"""Insurance company PDF parsers — all 6 insurers."""

import logging
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.base import PDFScraper
from app.features.scrapers.pdf.extractor import extract_insurance_data

logger = logging.getLogger("scrapers.pdf.insurance")


class _InsurancePDFBase(PDFScraper):
    """Shared logic for insurance PDF parsers."""

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        category = doc_info.get("category", "car_insurance")
        doc_name = doc_info.get("name", "Policy Document")

        features = extract_insurance_data(text, tables)
        if not features:
            return []

        features["source_document"] = doc_name
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category=category,
            name_en=f"{self.PROVIDER_NAME} {self._category_label(category)}",
            description_en=f"Extracted from {doc_name}",
            key_features=features,
        )]

    def _category_label(self, category: str) -> str:
        return {
            "car_insurance": "Motor Insurance",
            "health_insurance": "Health Insurance",
        }.get(category, "Insurance")


class OmanInsurancePDFScraper(_InsurancePDFBase):
    PROVIDER_ID = "c0000001-0000-0000-0000-000000000004"
    PROVIDER_NAME = "Oman Insurance"
    PROVIDER_KEY = "oman_insurance"


class OrientInsurancePDFScraper(_InsurancePDFBase):
    PROVIDER_ID = "c0000001-0000-0000-0000-000000000005"
    PROVIDER_NAME = "Orient Insurance"
    PROVIDER_KEY = "orient_insurance"


class AXAGulfPDFScraper(_InsurancePDFBase):
    PROVIDER_ID = "c0000001-0000-0000-0000-000000000006"
    PROVIDER_NAME = "AXA Gulf"
    PROVIDER_KEY = "axa_gulf"


class DamanHealthPDFScraper(_InsurancePDFBase):
    PROVIDER_ID = "c0000001-0000-0000-0000-000000000007"
    PROVIDER_NAME = "Daman Health"
    PROVIDER_KEY = "daman_health"

    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        text = pdf_data["text"]
        tables = pdf_data["tables"]
        doc_name = doc_info.get("name", "")

        features = extract_insurance_data(text, tables)

        # Daman-specific: extract network info from network list PDFs
        if "network" in doc_name.lower():
            hospital_count = text.lower().count("hospital")
            clinic_count = text.lower().count("clinic")
            if hospital_count > 0:
                features["network_hospitals_approx"] = hospital_count
            if clinic_count > 0:
                features["network_clinics_approx"] = clinic_count

        if not features:
            return []

        features["source_document"] = doc_name
        return [ScrapedProduct(
            provider_id=self.PROVIDER_ID,
            category="health_insurance",
            name_en=f"Daman {doc_name}",
            key_features=features,
        )]


class SukoonInsurancePDFScraper(_InsurancePDFBase):
    PROVIDER_ID = "c0000001-0000-0000-0000-000000000008"
    PROVIDER_NAME = "Sukoon Insurance"
    PROVIDER_KEY = "sukoon_insurance"


class RSAInsurancePDFScraper(_InsurancePDFBase):
    PROVIDER_ID = "c0000001-0000-0000-0000-000000000009"
    PROVIDER_NAME = "RSA Insurance UAE"
    PROVIDER_KEY = "rsa_insurance"
