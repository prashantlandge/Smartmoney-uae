"""Scraper validation engine — proactive detection of broken URLs, changed selectors, and data quality issues.

Runs daily BEFORE scraping to catch problems early.
Validates:
1. URL accessibility (HEAD requests for HTML pages and PDF documents)
2. Page structure fingerprinting (detect when bank websites redesign)
3. Data quality sanity checks (numeric ranges, required fields)
4. Product count drift (alert if product count drops significantly)
"""

import asyncio
import hashlib
import json
import logging
import re
from datetime import datetime, timezone
from typing import Optional

import httpx

from app.db.connection import get_pool

logger = logging.getLogger("scrapers.validator")

# Common browser headers
_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# ── URL registry for HTML scrapers ──────────────────────────────────────────

HTML_URLS: dict[str, list[dict]] = {
    "Emirates NBD": [
        {"url": "https://www.emiratesnbd.com/en/personal-banking/cards/credit-cards", "type": "credit_cards"},
        {"url": "https://www.emiratesnbd.com/en/personal-banking/loans/personal-loans", "type": "personal_loans"},
    ],
    "FAB": [
        {"url": "https://www.bankfab.com/en-ae/personal/cards/credit-cards", "type": "credit_cards"},
        {"url": "https://www.bankfab.com/en-ae/personal/loans/personal-loan", "type": "personal_loans"},
    ],
    "ADCB": [
        {"url": "https://www.adcb.com/en/personal/cards/credit-cards/", "type": "credit_cards"},
        {"url": "https://www.adcb.com/en/personal/loans/personal-loans/", "type": "personal_loans"},
    ],
    "Mashreq": [
        {"url": "https://www.mashreqbank.com/en/uae/personal/cards/credit-cards", "type": "credit_cards"},
        {"url": "https://www.mashreqbank.com/en/uae/personal/loans/personal-loan", "type": "personal_loans"},
    ],
    "RAKBANK": [
        {"url": "https://rakbank.ae/wps/portal/retail-banking/cards/credit-cards", "type": "credit_cards"},
        {"url": "https://rakbank.ae/wps/portal/retail-banking/loans/personal-loans", "type": "personal_loans"},
    ],
    "DIB": [
        {"url": "https://www.dib.ae/personal/cards/credit-cards", "type": "credit_cards"},
        {"url": "https://www.dib.ae/personal/finance/personal-finance", "type": "personal_loans"},
    ],
    "ADIB": [
        {"url": "https://www.adib.ae/en/personal/cards/covered-cards", "type": "credit_cards"},
        {"url": "https://www.adib.ae/en/personal/finance/personal-finance", "type": "personal_loans"},
    ],
    "HSBC": [
        {"url": "https://www.hsbc.ae/credit-cards/", "type": "credit_cards"},
        {"url": "https://www.hsbc.ae/loans/", "type": "personal_loans"},
    ],
    "Standard Chartered": [
        {"url": "https://www.sc.com/ae/credit-cards/", "type": "credit_cards"},
        {"url": "https://www.sc.com/ae/loans/personal-loan/", "type": "personal_loans"},
    ],
    "Emirates Islamic": [
        {"url": "https://www.emiratesislamic.ae/eng/personal-banking/cards/credit-cards/", "type": "credit_cards"},
    ],
    "Citibank": [
        {"url": "https://www.citibank.ae/gcb/credit-cards/", "type": "credit_cards"},
    ],
    "CBD": [
        {"url": "https://www.cbd.ae/personal/cards/credit-cards", "type": "credit_cards"},
        {"url": "https://www.cbd.ae/personal/loans/personal-loan", "type": "personal_loans"},
    ],
    "Liv.": [
        {"url": "https://www.liv.me/en/cards", "type": "credit_cards"},
    ],
    "Wio Bank": [
        {"url": "https://www.wio.io/personal", "type": "credit_cards"},
    ],
    "Ajman Bank": [
        {"url": "https://www.ajmanbank.ae/site/personal-banking/cards.html", "type": "credit_cards"},
    ],
    "Sharjah Islamic Bank": [
        {"url": "https://www.sib.ae/en/personal-banking/cards", "type": "credit_cards"},
    ],
}

# ── Key selectors we expect to find on bank pages ───────────────────────────
# These are the CSS selectors/patterns that each scraper relies on.
# If a page no longer contains these patterns, the scraper will likely break.

SELECTOR_FINGERPRINTS: dict[str, list[str]] = {
    "Emirates NBD": ["card", "product", "h2", "h3"],
    "FAB": ["card", "product", "credit", "h2", "h3"],
    "ADCB": ["card", "product", "touchpoints", "h2", "h3"],
    "Mashreq": ["card", "product", "h2", "h3"],
    "RAKBANK": ["card", "product", "h2", "h3"],
    "DIB": ["card", "product", "h2", "h3"],
    "ADIB": ["card", "product", "covered", "h2", "h3"],
    "HSBC": ["card", "product", "h2", "h3"],
    "Standard Chartered": ["card", "product", "h2", "h3"],
    "Emirates Islamic": ["card", "product", "h2", "h3"],
    "Citibank": ["card", "product", "h2", "h3"],
    "CBD": ["card", "product", "h2", "h3"],
    "Liv.": ["card", "product", "h2", "h3"],
    "Wio Bank": ["card", "product", "h2", "h3"],
    "Ajman Bank": ["card", "product", "h2", "h3"],
    "Sharjah Islamic Bank": ["card", "product", "h2", "h3"],
}

# ── Data quality rules per category ─────────────────────────────────────────

DATA_QUALITY_RULES: dict[str, list[dict]] = {
    "credit_card": [
        {"field": "annual_fee", "type": "numeric", "min": 0, "max": 10000, "required": False},
        {"field": "interest_rate_retail", "type": "numeric", "min": 0, "max": 60, "required": False},
        {"field": "interest_rate_cash", "type": "numeric", "min": 0, "max": 60, "required": False},
        {"field": "min_salary", "type": "numeric", "min": 1000, "max": 100000, "required": False},
        {"field": "late_payment_fee", "type": "numeric", "min": 0, "max": 1000, "required": False},
    ],
    "personal_loan": [
        {"field": "flat_rate", "type": "numeric", "min": 0, "max": 30, "required": False},
        {"field": "reducing_rate", "type": "numeric", "min": 0, "max": 50, "required": False},
        {"field": "processing_fee_pct", "type": "numeric", "min": 0, "max": 10, "required": False},
        {"field": "min_salary", "type": "numeric", "min": 1000, "max": 100000, "required": False},
        {"field": "max_loan_amount", "type": "numeric", "min": 5000, "max": 10000000, "required": False},
    ],
    "islamic_finance": [
        {"field": "profit_rate", "type": "numeric", "min": 0, "max": 30, "required": False},
        {"field": "processing_fee_pct", "type": "numeric", "min": 0, "max": 10, "required": False},
        {"field": "min_salary", "type": "numeric", "min": 1000, "max": 100000, "required": False},
    ],
}

# Minimum expected product counts per provider (baseline from last successful run)
EXPECTED_PRODUCT_COUNTS: dict[str, int] = {
    "Emirates NBD": 4,
    "FAB": 4,
    "ADCB": 4,
    "Mashreq": 4,
    "RAKBANK": 4,
    "DIB": 3,
    "ADIB": 3,
    "HSBC": 3,
    "Standard Chartered": 3,
    "Emirates Islamic": 3,
    "Citibank": 3,
    "CBD": 3,
    "Liv.": 2,
    "Wio Bank": 2,
    "Ajman Bank": 3,
    "Sharjah Islamic Bank": 3,
}


class ScraperValidator:
    """Proactive scraper validation engine."""

    def __init__(self):
        self.results: list[dict] = []

    async def validate_all(self) -> dict:
        """Run all validation checks and return a comprehensive report."""
        logger.info("=== Starting scraper validation ===")

        url_results = await self.check_url_health()
        structure_results = await self.check_page_structure()
        data_results = await self.check_data_quality()
        drift_results = await self.check_product_count_drift()

        # Fire alerts for critical issues
        await self._fire_alerts(url_results, structure_results, data_results, drift_results)

        report = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "url_health": url_results,
            "page_structure": structure_results,
            "data_quality": data_results,
            "product_drift": drift_results,
            "summary": {
                "urls_checked": sum(len(r.get("urls", [])) for r in url_results),
                "urls_failing": sum(
                    1 for r in url_results
                    for u in r.get("urls", [])
                    if u.get("status") != "ok"
                ),
                "structure_changes": sum(
                    1 for r in structure_results if r.get("changed")
                ),
                "quality_issues": sum(
                    len(r.get("issues", [])) for r in data_results
                ),
                "drift_alerts": sum(
                    1 for r in drift_results if r.get("drift_detected")
                ),
            },
        }

        logger.info(
            f"=== Validation complete: "
            f"{report['summary']['urls_failing']} URL failures, "
            f"{report['summary']['structure_changes']} structure changes, "
            f"{report['summary']['quality_issues']} quality issues, "
            f"{report['summary']['drift_alerts']} drift alerts ==="
        )

        return report

    # ── URL Health Check ────────────────────────────────────────────────────

    async def check_url_health(self) -> list[dict]:
        """Check all HTML and PDF URLs are accessible via HEAD requests."""
        results = []

        async with httpx.AsyncClient(
            timeout=15, headers=_HEADERS, follow_redirects=True
        ) as client:
            # Check HTML URLs
            for provider, urls in HTML_URLS.items():
                provider_result = {"provider": provider, "type": "html", "urls": []}
                for url_info in urls:
                    check = await self._check_single_url(client, url_info["url"])
                    check["page_type"] = url_info["type"]
                    provider_result["urls"].append(check)
                results.append(provider_result)

            # Check PDF URLs from registry
            try:
                from app.features.scrapers.pdf.registry import PDF_REGISTRY
                for provider_key, pdf_list in PDF_REGISTRY.items():
                    provider_result = {"provider": provider_key, "type": "pdf", "urls": []}
                    for pdf_info in pdf_list:
                        check = await self._check_single_url(client, pdf_info["url"])
                        check["doc_type"] = pdf_info.get("doc_type", "unknown")
                        check["name"] = pdf_info.get("name", "")
                        provider_result["urls"].append(check)
                    results.append(provider_result)
            except ImportError:
                logger.warning("PDF registry not available for validation")

        return results

    async def _check_single_url(self, client: httpx.AsyncClient, url: str) -> dict:
        """Check a single URL with HEAD request, fallback to GET."""
        try:
            resp = await client.head(url)
            if resp.status_code == 405:
                # Some servers don't allow HEAD, try GET
                resp = await client.get(url)

            return {
                "url": url,
                "status_code": resp.status_code,
                "status": "ok" if resp.status_code < 400 else "failing",
                "content_type": resp.headers.get("content-type", ""),
                "redirect": str(resp.url) if str(resp.url) != url else None,
            }
        except httpx.TimeoutException:
            return {"url": url, "status_code": 0, "status": "timeout", "error": "Request timed out"}
        except Exception as e:
            return {"url": url, "status_code": 0, "status": "error", "error": str(e)[:200]}

    # ── Page Structure Fingerprinting ───────────────────────────────────────

    async def check_page_structure(self) -> list[dict]:
        """Check if page structures have changed by comparing element fingerprints.

        Downloads each HTML page and creates a fingerprint based on:
        - Presence of expected CSS class patterns (card, product, etc.)
        - Count of heading elements (h2, h3, h4)
        - Count of product-like sections
        Then compares with the stored fingerprint from last successful run.
        """
        results = []
        pool = await get_pool()

        async with httpx.AsyncClient(
            timeout=20, headers=_HEADERS, follow_redirects=True
        ) as client:
            for provider, urls in HTML_URLS.items():
                for url_info in urls:
                    try:
                        resp = await client.get(url_info["url"])
                        if resp.status_code >= 400:
                            results.append({
                                "provider": provider,
                                "url": url_info["url"],
                                "changed": False,
                                "error": f"HTTP {resp.status_code}",
                            })
                            continue

                        html = resp.text
                        fingerprint = self._compute_fingerprint(provider, html)

                        # Compare with stored fingerprint
                        stored = await self._get_stored_fingerprint(pool, provider, url_info["url"])

                        changed = False
                        change_details = None
                        if stored and stored != fingerprint:
                            changed = True
                            change_details = f"Fingerprint changed from {stored[:16]}... to {fingerprint[:16]}..."

                        # Store current fingerprint
                        await self._store_fingerprint(pool, provider, url_info["url"], fingerprint)

                        results.append({
                            "provider": provider,
                            "url": url_info["url"],
                            "fingerprint": fingerprint[:16],
                            "changed": changed,
                            "change_details": change_details,
                            "expected_selectors": SELECTOR_FINGERPRINTS.get(provider, []),
                            "selectors_found": self._check_selectors(provider, html),
                        })

                    except Exception as e:
                        results.append({
                            "provider": provider,
                            "url": url_info["url"],
                            "changed": False,
                            "error": str(e)[:200],
                        })

        return results

    def _compute_fingerprint(self, provider: str, html: str) -> str:
        """Compute a structural fingerprint of an HTML page.

        Focuses on structural elements, not content (which changes daily).
        """
        # Count structural elements
        h2_count = len(re.findall(r"<h2\b", html, re.I))
        h3_count = len(re.findall(r"<h3\b", html, re.I))
        h4_count = len(re.findall(r"<h4\b", html, re.I))

        # Count class patterns that scrapers rely on
        card_classes = len(re.findall(r'class="[^"]*card[^"]*"', html, re.I))
        product_classes = len(re.findall(r'class="[^"]*product[^"]*"', html, re.I))

        # Count links (rough proxy for page complexity)
        link_count = len(re.findall(r"<a\b", html, re.I))

        # Build fingerprint from structural metrics (bucketized to reduce noise)
        structure = (
            f"h2:{h2_count // 3}|h3:{h3_count // 3}|h4:{h4_count // 3}|"
            f"card:{card_classes // 5}|prod:{product_classes // 5}|"
            f"links:{link_count // 20}"
        )

        return hashlib.sha256(structure.encode()).hexdigest()

    def _check_selectors(self, provider: str, html: str) -> dict:
        """Check which expected selectors are still present on the page."""
        expected = SELECTOR_FINGERPRINTS.get(provider, [])
        found = {}
        html_lower = html.lower()
        for selector in expected:
            # Check for class names or tag names
            if selector in ("h2", "h3", "h4"):
                found[selector] = f"<{selector}" in html_lower
            else:
                found[selector] = selector.lower() in html_lower
        return found

    async def _get_stored_fingerprint(
        self, pool, provider: str, url: str
    ) -> Optional[str]:
        """Get the last stored fingerprint for a provider/URL combo."""
        try:
            row = await pool.fetchrow(
                """
                SELECT fingerprint FROM scraper_fingerprints
                WHERE provider_name = $1 AND url = $2
                """,
                provider,
                url,
            )
            return row["fingerprint"] if row else None
        except Exception:
            # Table may not exist yet
            return None

    async def _store_fingerprint(
        self, pool, provider: str, url: str, fingerprint: str
    ):
        """Store/update the fingerprint for a provider/URL combo."""
        try:
            await pool.execute(
                """
                INSERT INTO scraper_fingerprints (provider_name, url, fingerprint, checked_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (provider_name, url) DO UPDATE
                SET fingerprint = $3, checked_at = NOW()
                """,
                provider,
                url,
                fingerprint,
            )
        except Exception as e:
            logger.debug(f"Could not store fingerprint (table may not exist): {e}")

    # ── Data Quality Checks ─────────────────────────────────────────────────

    async def check_data_quality(self) -> list[dict]:
        """Validate product data in the database against sanity rules."""
        pool = await get_pool()
        results = []

        try:
            rows = await pool.fetch(
                """
                SELECT p.id, p.name_en, p.category, p.key_features,
                       pr.name_en as provider_name
                FROM products p
                JOIN providers pr ON p.provider_id = pr.id
                WHERE p.active = true
                """
            )
        except Exception as e:
            logger.error(f"Data quality check failed: {e}")
            return []

        for row in rows:
            issues = []
            features = row["key_features"] or {}
            if isinstance(features, str):
                try:
                    features = json.loads(features)
                except (json.JSONDecodeError, TypeError):
                    features = {}

            category = row["category"]
            rules = DATA_QUALITY_RULES.get(category, [])

            for rule in rules:
                field = rule["field"]
                value = features.get(field)

                if value is None:
                    if rule.get("required"):
                        issues.append({
                            "field": field,
                            "issue": "missing_required",
                            "message": f"Required field '{field}' is missing",
                        })
                    continue

                if rule["type"] == "numeric":
                    try:
                        # Handle string values like "AED 500" or "3.99%"
                        if isinstance(value, str):
                            numeric_match = re.search(r"[\d,.]+", value.replace(",", ""))
                            if numeric_match:
                                num_val = float(numeric_match.group())
                            else:
                                continue
                        else:
                            num_val = float(value)

                        if num_val < rule.get("min", float("-inf")):
                            issues.append({
                                "field": field,
                                "issue": "below_minimum",
                                "value": num_val,
                                "min": rule["min"],
                                "message": f"'{field}' value {num_val} is below minimum {rule['min']}",
                            })
                        if num_val > rule.get("max", float("inf")):
                            issues.append({
                                "field": field,
                                "issue": "above_maximum",
                                "value": num_val,
                                "max": rule["max"],
                                "message": f"'{field}' value {num_val} exceeds maximum {rule['max']}",
                            })
                    except (ValueError, TypeError):
                        issues.append({
                            "field": field,
                            "issue": "not_numeric",
                            "value": str(value)[:50],
                            "message": f"'{field}' expected numeric, got '{str(value)[:50]}'",
                        })

            if issues:
                results.append({
                    "product_id": str(row["id"]),
                    "product_name": row["name_en"],
                    "provider": row["provider_name"],
                    "category": category,
                    "issues": issues,
                })

        return results

    # ── Product Count Drift Detection ───────────────────────────────────────

    async def check_product_count_drift(self) -> list[dict]:
        """Detect significant drops in product count per provider.

        Compares current active product count against expected baseline.
        A 50%+ drop triggers an alert.
        """
        pool = await get_pool()
        results = []

        try:
            rows = await pool.fetch(
                """
                SELECT pr.name_en, COUNT(p.id) as current_count
                FROM providers pr
                LEFT JOIN products p ON p.provider_id = pr.id AND p.active = true
                WHERE pr.active = true
                GROUP BY pr.name_en
                """
            )
        except Exception as e:
            logger.error(f"Product drift check failed: {e}")
            return []

        for row in rows:
            provider = row["name_en"]
            current = row["current_count"]
            expected = EXPECTED_PRODUCT_COUNTS.get(provider)

            if expected is None:
                continue

            drift_pct = ((current - expected) / expected * 100) if expected > 0 else 0
            drift_detected = current < expected * 0.5  # 50% drop threshold

            results.append({
                "provider": provider,
                "current_count": current,
                "expected_count": expected,
                "drift_pct": round(drift_pct, 1),
                "drift_detected": drift_detected,
            })

        return results

    # ── Alert Firing ────────────────────────────────────────────────────────

    async def _fire_alerts(
        self,
        url_results: list[dict],
        structure_results: list[dict],
        data_results: list[dict],
        drift_results: list[dict],
    ):
        """Fire alerts for validation failures."""
        from app.features.scrapers.alerts import ScraperAlertEngine

        alert_engine = ScraperAlertEngine()

        # URL failures
        for provider_result in url_results:
            provider = provider_result["provider"]
            for url_check in provider_result.get("urls", []):
                if url_check.get("status") in ("failing", "timeout", "error"):
                    await alert_engine.record_alert(
                        alert_type="url_broken",
                        severity="high",
                        provider_name=provider,
                        message=f"URL check failed: {url_check['url']} ({url_check.get('status_code', 'N/A')})",
                        details=url_check,
                    )

        # Structure changes
        for result in structure_results:
            if result.get("changed"):
                await alert_engine.record_alert(
                    alert_type="structure_changed",
                    severity="high",
                    provider_name=result["provider"],
                    message=f"Page structure changed at {result['url']} — scraper selectors may be broken",
                    details=result,
                )

            # Missing selectors
            selectors = result.get("selectors_found", {})
            missing = [s for s, found in selectors.items() if not found]
            if missing:
                await alert_engine.record_alert(
                    alert_type="selectors_missing",
                    severity="medium",
                    provider_name=result["provider"],
                    message=f"Expected selectors missing from page: {', '.join(missing)}",
                    details={"url": result.get("url"), "missing": missing},
                )

        # Product drift
        for result in drift_results:
            if result.get("drift_detected"):
                await alert_engine.record_alert(
                    alert_type="product_count_drop",
                    severity="high",
                    provider_name=result["provider"],
                    message=(
                        f"Product count dropped significantly: "
                        f"{result['current_count']} vs expected {result['expected_count']} "
                        f"({result['drift_pct']}%)"
                    ),
                    details=result,
                )
