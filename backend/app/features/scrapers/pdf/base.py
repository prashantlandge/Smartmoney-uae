"""Base class for PDF scrapers.

Provides download, parse, and extract capabilities using httpx + pdfplumber.
Follows the same ScrapedProduct output format as the HTML BankScraper.
"""

import io
import logging
from abc import ABC, abstractmethod
from typing import Optional

import httpx

from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.pdf.parser import extract_tables, extract_text

logger = logging.getLogger("scrapers.pdf")


class PDFScraper(ABC):
    """Abstract base class for PDF-based product scrapers.

    Subclasses implement extract_products() to parse bank-specific PDF layouts.
    """

    PROVIDER_ID: str = ""
    PROVIDER_NAME: str = ""
    PROVIDER_KEY: str = ""  # Key in PDF_REGISTRY

    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/pdf,*/*",
    }

    MAX_RETRIES = 3
    TIMEOUT = 60

    def __init__(self):
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient(
            timeout=self.TIMEOUT,
            headers=self.HEADERS,
            follow_redirects=True,
        )
        return self

    async def __aexit__(self, *args):
        if self.client:
            await self.client.aclose()

    async def download_pdf(self, url: str) -> Optional[bytes]:
        """Download a PDF from a URL with retry logic.

        Returns raw PDF bytes or None on failure.
        """
        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                resp = await self.client.get(url)
                resp.raise_for_status()
                content_type = resp.headers.get("content-type", "")
                if "pdf" not in content_type and not url.lower().endswith(".pdf"):
                    logger.warning(
                        f"[{self.PROVIDER_NAME}] URL may not be PDF: {url} "
                        f"(content-type: {content_type})"
                    )
                return resp.content
            except Exception as e:
                logger.warning(
                    f"[{self.PROVIDER_NAME}] PDF download attempt {attempt}/{self.MAX_RETRIES} "
                    f"failed for {url}: {e}"
                )
                if attempt < self.MAX_RETRIES:
                    import asyncio
                    await asyncio.sleep(2 ** attempt)
        logger.error(f"[{self.PROVIDER_NAME}] Failed to download PDF after {self.MAX_RETRIES} attempts: {url}")
        return None

    def parse_pdf(self, pdf_bytes: bytes) -> dict:
        """Parse a PDF into structured data.

        Returns dict with:
            - tables: list of extracted tables
            - text: full text content
            - page_count: number of pages
        """
        try:
            tables = extract_tables(pdf_bytes)
            text = extract_text(pdf_bytes)
            return {
                "tables": tables,
                "text": text,
                "page_count": text.count("\n--- Page") + 1 if text else 0,
            }
        except Exception as e:
            logger.error(f"[{self.PROVIDER_NAME}] PDF parse error: {e}")
            return {"tables": [], "text": "", "page_count": 0}

    def _get_pdf_urls(self) -> list[dict]:
        """Get registered PDF URLs for this provider from the registry."""
        from app.features.scrapers.pdf.registry import PDF_REGISTRY
        return PDF_REGISTRY.get(self.PROVIDER_KEY, [])

    @abstractmethod
    def extract_products(self, pdf_data: dict, doc_info: dict) -> list[ScrapedProduct]:
        """Extract products from parsed PDF data.

        Args:
            pdf_data: Output from parse_pdf() with tables, text, page_count.
            doc_info: Registry entry dict with url, category, doc_type, name.

        Returns:
            List of ScrapedProduct instances.
        """
        ...

    async def scrape_pdfs(self) -> list[ScrapedProduct]:
        """Download and parse all registered PDFs for this provider.

        Returns combined list of ScrapedProduct from all PDFs.
        """
        pdf_urls = self._get_pdf_urls()
        if not pdf_urls:
            logger.info(f"[{self.PROVIDER_NAME}] No PDF URLs registered")
            return []

        all_products = []
        for doc_info in pdf_urls:
            url = doc_info.get("url", "")
            if not url:
                continue

            logger.info(f"[{self.PROVIDER_NAME}] Downloading PDF: {doc_info.get('name', url)}")
            pdf_bytes = await self.download_pdf(url)
            if not pdf_bytes:
                continue

            pdf_data = self.parse_pdf(pdf_bytes)
            if not pdf_data["text"] and not pdf_data["tables"]:
                logger.warning(
                    f"[{self.PROVIDER_NAME}] No content extracted from PDF: {url}"
                )
                continue

            try:
                products = self.extract_products(pdf_data, doc_info)
                all_products.extend(products)
                logger.info(
                    f"[{self.PROVIDER_NAME}] Extracted {len(products)} products from "
                    f"{doc_info.get('name', 'PDF')}"
                )
            except Exception as e:
                logger.error(
                    f"[{self.PROVIDER_NAME}] Product extraction failed for "
                    f"{doc_info.get('name', url)}: {e}"
                )

        # Set data_source for all PDF-extracted products
        for p in all_products:
            p.data_source = "pdf"

        logger.info(
            f"[{self.PROVIDER_NAME}] PDF scrape complete: {len(all_products)} total products"
        )
        return all_products
