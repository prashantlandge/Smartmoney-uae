"""Scraper alert engine — monitors scrape health and records alerts."""

import json
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional

from app.db.connection import get_pool

logger = logging.getLogger("scrapers.alerts")


class ScraperAlertEngine:
    """Records and manages scraper health alerts."""

    SEVERITY_LEVELS = ("low", "medium", "high", "critical")

    async def record_alert(
        self,
        alert_type: str,
        severity: str,
        message: str,
        provider_name: str = "",
        details: dict = None,
    ) -> Optional[str]:
        """Insert a new alert into scraper_alerts table."""
        if severity not in self.SEVERITY_LEVELS:
            severity = "medium"

        pool = await get_pool()
        try:
            row = await pool.fetchrow(
                """
                INSERT INTO scraper_alerts (alert_type, severity, provider_name, message, details)
                VALUES ($1, $2, $3, $4, $5::jsonb)
                RETURNING id
                """,
                alert_type,
                severity,
                provider_name,
                message,
                json.dumps(details or {}),
            )
            alert_id = str(row["id"])
            logger.warning(
                f"[ALERT:{severity.upper()}] {provider_name}: {message}"
            )
            return alert_id
        except Exception as e:
            logger.error(f"Failed to record alert: {e}")
            return None

    async def check_post_scrape(self, provider_summaries: list[dict]):
        """Check HTML scrape results and fire alerts for problems.

        Called after run_all_scrapers() completes.
        """
        for summary in provider_summaries:
            provider = summary.get("provider", "Unknown")
            status = summary.get("status", "")
            scraped = summary.get("scraped", 0)
            errors = summary.get("errors", 0)

            if status == "error":
                await self.record_alert(
                    alert_type="scrape_failure",
                    severity="critical",
                    provider_name=provider,
                    message=f"HTML scraper failed completely: {summary.get('error', 'unknown error')}",
                    details=summary,
                )
            elif scraped == 0:
                await self.record_alert(
                    alert_type="no_products",
                    severity="high",
                    provider_name=provider,
                    message="HTML scraper returned 0 products (likely using fallback data)",
                    details=summary,
                )
            elif errors > 0:
                await self.record_alert(
                    alert_type="partial_failure",
                    severity="medium",
                    provider_name=provider,
                    message=f"HTML scraper had {errors} upsert errors out of {scraped} products",
                    details=summary,
                )

    async def check_pdf_health(self, pdf_results: list[dict]):
        """Check PDF scrape results for download/parse failures.

        Called after run_all_pdf_scrapers() completes.
        """
        for result in pdf_results:
            provider = result.get("provider", "Unknown")
            status = result.get("status", "")
            count = result.get("count", 0)

            if status == "error":
                await self.record_alert(
                    alert_type="pdf_failure",
                    severity="high",
                    provider_name=provider,
                    message=f"PDF scraper failed: {result.get('error', 'unknown error')}",
                    details=result,
                )
            elif count == 0:
                await self.record_alert(
                    alert_type="pdf_no_data",
                    severity="medium",
                    provider_name=provider,
                    message="PDF scraper extracted 0 products (PDFs may have changed or URLs broken)",
                    details=result,
                )

    async def check_staleness(self):
        """Check for providers with no recent scrape data.

        Fires alert if a provider hasn't been updated in 14+ days.
        """
        pool = await get_pool()
        try:
            stale_cutoff = datetime.now(timezone.utc) - timedelta(days=14)
            rows = await pool.fetch(
                """
                SELECT p.name_en, MAX(pr.last_updated) as last_update
                FROM providers p
                LEFT JOIN products pr ON pr.provider_id = p.id
                WHERE p.active = true
                GROUP BY p.name_en
                HAVING MAX(pr.last_updated) < $1 OR MAX(pr.last_updated) IS NULL
                """,
                stale_cutoff,
            )
            for row in rows:
                last = row["last_update"]
                msg = "No products found" if last is None else f"Last updated {last.strftime('%Y-%m-%d')}"
                await self.record_alert(
                    alert_type="stale_data",
                    severity="high",
                    provider_name=row["name_en"],
                    message=f"Stale data: {msg} (threshold: 14 days)",
                )
        except Exception as e:
            logger.error(f"Staleness check failed: {e}")

    async def check_data_integrity(self):
        """Post-upsert data integrity checks.

        Verifies products have valid data after insertion:
        - Products with empty key_features
        - Products with NULL required fields
        - Products with stale data_source markers
        """
        pool = await get_pool()
        try:
            # Check for products with empty or missing key_features
            empty_features = await pool.fetch(
                """
                SELECT pr.name_en as provider_name, p.category, COUNT(*) as cnt
                FROM products p
                JOIN providers pr ON p.provider_id = pr.id
                WHERE p.active = true
                  AND (p.key_features IS NULL
                       OR p.key_features = '{}'::jsonb
                       OR p.key_features = 'null'::jsonb)
                GROUP BY pr.name_en, p.category
                """
            )
            for row in empty_features:
                await self.record_alert(
                    alert_type="empty_features",
                    severity="high",
                    provider_name=row["provider_name"],
                    message=(
                        f"{row['cnt']} active {row['category']} product(s) have empty key_features"
                    ),
                    details={"category": row["category"], "count": row["cnt"]},
                )

            # Check for products missing required fields
            missing_fields = await pool.fetch(
                """
                SELECT pr.name_en as provider_name, p.name_en as product_name, p.category
                FROM products p
                JOIN providers pr ON p.provider_id = pr.id
                WHERE p.active = true
                  AND (p.name_en IS NULL OR p.name_en = ''
                       OR p.category IS NULL OR p.category = '')
                """
            )
            if missing_fields:
                await self.record_alert(
                    alert_type="missing_required_fields",
                    severity="critical",
                    provider_name="SYSTEM",
                    message=f"{len(missing_fields)} product(s) missing name or category",
                    details={
                        "products": [
                            {
                                "provider": r["provider_name"],
                                "product": r["product_name"],
                                "category": r["category"],
                            }
                            for r in missing_fields[:10]
                        ]
                    },
                )

            # Check for providers with 0 active products
            empty_providers = await pool.fetch(
                """
                SELECT p.name_en
                FROM providers p
                WHERE p.active = true
                  AND NOT EXISTS (
                    SELECT 1 FROM products pr
                    WHERE pr.provider_id = p.id AND pr.active = true
                  )
                """
            )
            for row in empty_providers:
                await self.record_alert(
                    alert_type="empty_provider",
                    severity="medium",
                    provider_name=row["name_en"],
                    message="Active provider has 0 active products in database",
                )

            checked = len(empty_features) + len(missing_fields) + len(empty_providers)
            logger.info(
                f"Data integrity check complete: "
                f"{len(empty_features)} empty features, "
                f"{len(missing_fields)} missing fields, "
                f"{len(empty_providers)} empty providers"
            )
            return {
                "empty_features": len(empty_features),
                "missing_fields": len(missing_fields),
                "empty_providers": len(empty_providers),
            }
        except Exception as e:
            logger.error(f"Data integrity check failed: {e}")
            return {"error": str(e)}

    async def get_active_alerts(
        self, severity: str = None, limit: int = 50
    ) -> list[dict]:
        """Get unacknowledged alerts, optionally filtered by severity."""
        pool = await get_pool()
        try:
            if severity:
                rows = await pool.fetch(
                    """
                    SELECT id, alert_type, severity, provider_name, message, details, created_at
                    FROM scraper_alerts
                    WHERE acknowledged = false AND severity = $1
                    ORDER BY created_at DESC
                    LIMIT $2
                    """,
                    severity,
                    limit,
                )
            else:
                rows = await pool.fetch(
                    """
                    SELECT id, alert_type, severity, provider_name, message, details, created_at
                    FROM scraper_alerts
                    WHERE acknowledged = false
                    ORDER BY created_at DESC
                    LIMIT $1
                    """,
                    limit,
                )
            return [
                {
                    "id": str(row["id"]),
                    "alert_type": row["alert_type"],
                    "severity": row["severity"],
                    "provider_name": row["provider_name"],
                    "message": row["message"],
                    "details": row["details"],
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                }
                for row in rows
            ]
        except Exception as e:
            logger.error(f"Failed to get alerts: {e}")
            return []

    async def acknowledge_alert(self, alert_id: str) -> bool:
        """Mark an alert as acknowledged."""
        pool = await get_pool()
        try:
            alert_uuid = uuid.UUID(alert_id)
            result = await pool.execute(
                """
                UPDATE scraper_alerts
                SET acknowledged = true, acknowledged_at = NOW()
                WHERE id = $1
                """,
                alert_uuid,
            )
            return "UPDATE 1" in result
        except Exception as e:
            logger.error(f"Failed to acknowledge alert {alert_id}: {e}")
            return False

    async def get_health_summary(self) -> dict:
        """Get overall health summary for all providers."""
        pool = await get_pool()
        try:
            # Provider status
            providers = await pool.fetch(
                """
                SELECT
                    p.name_en,
                    p.type,
                    COUNT(pr.id) as product_count,
                    MAX(pr.last_updated) as last_updated,
                    AVG(jsonb_array_length(
                        CASE WHEN jsonb_typeof(pr.key_features) = 'object'
                        THEN (SELECT jsonb_agg(k) FROM jsonb_object_keys(pr.key_features) k)
                        ELSE '[]'::jsonb END
                    )) as avg_features
                FROM providers p
                LEFT JOIN products pr ON pr.provider_id = p.id AND pr.active = true
                WHERE p.active = true
                GROUP BY p.name_en, p.type
                ORDER BY p.name_en
                """
            )

            # Active alert counts
            alert_counts = await pool.fetch(
                """
                SELECT provider_name, severity, COUNT(*) as cnt
                FROM scraper_alerts
                WHERE acknowledged = false
                GROUP BY provider_name, severity
                """
            )

            alert_map = {}
            for row in alert_counts:
                name = row["provider_name"] or "Unknown"
                if name not in alert_map:
                    alert_map[name] = {}
                alert_map[name][row["severity"]] = row["cnt"]

            provider_statuses = []
            for p in providers:
                name = p["name_en"]
                alerts = alert_map.get(name, {})
                has_critical = alerts.get("critical", 0) > 0
                has_high = alerts.get("high", 0) > 0

                if has_critical:
                    status = "failing"
                elif has_high or p["product_count"] == 0:
                    status = "degraded"
                else:
                    status = "healthy"

                provider_statuses.append({
                    "name": name,
                    "type": p["type"],
                    "status": status,
                    "product_count": p["product_count"],
                    "last_updated": p["last_updated"].isoformat() if p["last_updated"] else None,
                    "alerts": alerts,
                })

            return {
                "providers": provider_statuses,
                "total_providers": len(provider_statuses),
                "healthy": sum(1 for p in provider_statuses if p["status"] == "healthy"),
                "degraded": sum(1 for p in provider_statuses if p["status"] == "degraded"),
                "failing": sum(1 for p in provider_statuses if p["status"] == "failing"),
            }
        except Exception as e:
            logger.error(f"Failed to get health summary: {e}")
            return {"providers": [], "total_providers": 0, "healthy": 0, "degraded": 0, "failing": 0}
