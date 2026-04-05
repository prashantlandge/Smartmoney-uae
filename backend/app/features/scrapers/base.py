"""Base scraper class for bank product data."""

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger("scrapers")


@dataclass
class ScrapedProduct:
    """A product scraped from a bank website."""

    provider_id: str
    category: str  # credit_card, personal_loan, islamic_finance, car_insurance, health_insurance
    name_en: str
    name_ar: str = ""
    description_en: str = ""
    description_ar: str = ""
    min_salary_aed: Optional[float] = None
    residency_required: bool = True
    nationality_restrictions: dict = field(default_factory=dict)
    employer_categories: list = field(default_factory=lambda: ["government", "listed_company", "private", "any"])
    representative_rate: Optional[float] = None
    rate_type: str = "variable"
    min_amount_aed: Optional[float] = None
    max_amount_aed: Optional[float] = None
    min_tenure_months: Optional[int] = None
    max_tenure_months: Optional[int] = None
    key_features: dict = field(default_factory=dict)
    affiliate_deep_link_en: str = ""
    affiliate_deep_link_ar: str = ""
    commission_amount_aed: Optional[float] = None
    commission_percentage: Optional[float] = None
    commission_type: str = "flat"
    islamic_compliant: bool = False
    data_source: str = "scrape"
    eligibility_criteria: dict = field(default_factory=dict)


class BankScraper(ABC):
    """Abstract base class for bank product scrapers."""

    # Subclasses must set these
    PROVIDER_ID: str = ""
    PROVIDER_NAME: str = ""
    BASE_URL: str = ""

    # Common headers to avoid bot detection
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
    }

    def __init__(self):
        self.client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient(
            timeout=30,
            headers=self.HEADERS,
            follow_redirects=True,
        )
        return self

    async def __aexit__(self, *args):
        if self.client:
            await self.client.aclose()

    async def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch a URL and return parsed HTML."""
        try:
            resp = await self.client.get(url)
            resp.raise_for_status()
            return BeautifulSoup(resp.text, "lxml")
        except Exception as e:
            logger.error(f"[{self.PROVIDER_NAME}] Failed to fetch {url}: {e}")
            return None

    async def fetch_json(self, url: str, **kwargs) -> Optional[dict]:
        """Fetch JSON from a URL (for API-based banks)."""
        try:
            resp = await self.client.get(url, **kwargs)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.error(f"[{self.PROVIDER_NAME}] Failed to fetch JSON {url}: {e}")
            return None

    @abstractmethod
    async def scrape_credit_cards(self) -> list[ScrapedProduct]:
        """Scrape credit card products. Override in subclass."""
        return []

    @abstractmethod
    async def scrape_personal_loans(self) -> list[ScrapedProduct]:
        """Scrape personal loan products. Override in subclass."""
        return []

    @abstractmethod
    async def scrape_islamic_finance(self) -> list[ScrapedProduct]:
        """Scrape Islamic finance products. Override in subclass."""
        return []

    async def scrape_all(self) -> list[ScrapedProduct]:
        """Run all scrapers and return combined results."""
        products = []
        for scraper_fn in [
            self.scrape_credit_cards,
            self.scrape_personal_loans,
            self.scrape_islamic_finance,
        ]:
            try:
                result = await scraper_fn()
                products.extend(result)
                logger.info(
                    f"[{self.PROVIDER_NAME}] {scraper_fn.__name__} returned {len(result)} products"
                )
            except Exception as e:
                logger.error(f"[{self.PROVIDER_NAME}] {scraper_fn.__name__} failed: {e}")
        return products
