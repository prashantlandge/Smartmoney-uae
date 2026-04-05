"""API routes for scraper management.

Provides endpoints to manually trigger scrapes and view run history.
Admin-only endpoints protected by basic auth.
"""

import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.config import settings
from app.db.connection import get_pool

logger = logging.getLogger("scrapers.router")
router = APIRouter()
security = HTTPBasic()


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Simple admin auth for scraper endpoints."""
    if (
        credentials.username != settings.admin_username
        or credentials.password != settings.admin_password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials


@router.post("/run", dependencies=[Depends(verify_admin)])
async def trigger_scrape():
    """Manually trigger a full scrape run.

    Requires admin credentials. Returns scrape summary.
    """
    from app.features.scrapers.runner import run_all_scrapers

    logger.info("Manual scrape triggered via API")
    try:
        summary = await run_all_scrapers()
        return summary
    except Exception as e:
        logger.error(f"Manual scrape failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", dependencies=[Depends(verify_admin)])
async def get_scrape_history(limit: int = 10):
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
                "duration_seconds": row["duration_seconds"],
                "total_scraped": row["total_scraped"],
                "total_upserted": row["total_upserted"],
                "total_errors": row["total_errors"],
                "details": row["details"],
            }
            for row in rows
        ]
    except Exception:
        # Table might not exist yet
        return []


@router.get("/status")
async def scraper_status():
    """Get current scraper status (public, no auth needed)."""
    pool = await get_pool()
    try:
        last_run = await pool.fetchrow(
            """
            SELECT started_at, completed_at, total_upserted, total_errors
            FROM scrape_runs
            ORDER BY started_at DESC
            LIMIT 1
            """
        )
        if last_run:
            return {
                "last_run": last_run["completed_at"].isoformat() if last_run["completed_at"] else None,
                "products_updated": last_run["total_upserted"],
                "errors": last_run["total_errors"],
                "status": "operational",
            }
    except Exception:
        pass

    return {
        "last_run": None,
        "products_updated": 0,
        "errors": 0,
        "status": "no_runs_yet",
    }
