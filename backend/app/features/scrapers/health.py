"""Health dashboard data functions for scraper monitoring."""

import logging
from datetime import datetime, timezone
from app.db.connection import get_pool

logger = logging.getLogger("scrapers.health")


async def get_provider_health() -> list[dict]:
    """Get per-provider health status including product counts and last update times."""
    pool = await get_pool()
    try:
        rows = await pool.fetch(
            """
            SELECT
                p.id,
                p.name_en,
                p.type,
                COUNT(DISTINCT pr.id) as product_count,
                MAX(pr.last_updated) as last_product_update,
                COUNT(DISTINCT CASE WHEN pr.data_source = 'pdf' THEN pr.id END) as pdf_products,
                COUNT(DISTINCT CASE WHEN pr.data_source = 'scrape' THEN pr.id END) as html_products,
                COUNT(DISTINCT CASE WHEN pr.data_source = 'scrape_fallback' THEN pr.id END) as fallback_products
            FROM providers p
            LEFT JOIN products pr ON pr.provider_id = p.id AND pr.active = true
            WHERE p.active = true
            GROUP BY p.id, p.name_en, p.type
            ORDER BY p.type, p.name_en
            """
        )
        return [
            {
                "id": str(row["id"]),
                "name": row["name_en"],
                "type": row["type"],
                "product_count": row["product_count"],
                "last_updated": row["last_product_update"].isoformat() if row["last_product_update"] else None,
                "pdf_products": row["pdf_products"],
                "html_products": row["html_products"],
                "fallback_products": row["fallback_products"],
            }
            for row in rows
        ]
    except Exception as e:
        logger.error(f"Failed to get provider health: {e}")
        return []


async def get_scrape_history(limit: int = 10) -> list[dict]:
    """Get recent scrape run history."""
    pool = await get_pool()
    try:
        rows = await pool.fetch(
            """
            SELECT id, started_at, completed_at, duration_seconds,
                   total_scraped, total_upserted, total_errors, details
            FROM scrape_runs
            ORDER BY started_at DESC
            LIMIT $1
            """,
            limit,
        )
        return [
            {
                "id": str(row["id"]),
                "started_at": row["started_at"].isoformat() if row["started_at"] else None,
                "completed_at": row["completed_at"].isoformat() if row["completed_at"] else None,
                "duration_seconds": float(row["duration_seconds"]) if row["duration_seconds"] else None,
                "total_scraped": row["total_scraped"],
                "total_upserted": row["total_upserted"],
                "total_errors": row["total_errors"],
            }
            for row in rows
        ]
    except Exception as e:
        logger.error(f"Failed to get scrape history: {e}")
        return []


async def get_data_quality_summary() -> dict:
    """Get data quality metrics across all providers."""
    pool = await get_pool()
    try:
        row = await pool.fetchrow(
            """
            SELECT
                COUNT(*) as total_products,
                COUNT(CASE WHEN data_source = 'pdf' THEN 1 END) as pdf_sourced,
                COUNT(CASE WHEN data_source = 'scrape' THEN 1 END) as html_sourced,
                COUNT(CASE WHEN data_source = 'scrape_fallback' THEN 1 END) as fallback_sourced,
                COUNT(CASE WHEN data_source = 'manual_entry' THEN 1 END) as manual_sourced,
                COUNT(DISTINCT provider_id) as providers_with_products
            FROM products
            WHERE active = true
            """
        )
        return {
            "total_products": row["total_products"],
            "pdf_sourced": row["pdf_sourced"],
            "html_sourced": row["html_sourced"],
            "fallback_sourced": row["fallback_sourced"],
            "manual_sourced": row["manual_sourced"],
            "providers_with_products": row["providers_with_products"],
        }
    except Exception as e:
        logger.error(f"Failed to get data quality summary: {e}")
        return {}
