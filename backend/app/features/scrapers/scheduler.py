"""Background scheduler for daily scraping.

Uses asyncio-based scheduling to run scrapers once per day at 3:00 AM GST (UTC+4).
No external dependencies needed — runs within the FastAPI process.
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta

logger = logging.getLogger("scrapers.scheduler")

# UAE time offset (GST = UTC+4)
UAE_OFFSET = timedelta(hours=4)
# Target time: 3:00 AM GST daily
TARGET_HOUR = 3
TARGET_MINUTE = 0

_scheduler_task: asyncio.Task | None = None


def _seconds_until_next_run() -> float:
    """Calculate seconds until next 3:00 AM GST."""
    now_utc = datetime.now(timezone.utc)
    now_uae = now_utc + UAE_OFFSET

    target_today = now_uae.replace(
        hour=TARGET_HOUR, minute=TARGET_MINUTE, second=0, microsecond=0
    )

    if now_uae >= target_today:
        # Already passed today's target, schedule for tomorrow
        target = target_today + timedelta(days=1)
    else:
        target = target_today

    # Convert back to UTC for comparison
    target_utc = target - UAE_OFFSET
    delta = (target_utc - now_utc).total_seconds()
    return max(delta, 60)  # Minimum 60 seconds


async def _scheduler_loop():
    """Main scheduler loop — runs forever, executing scrapers daily."""
    from app.features.scrapers.runner import run_all_scrapers

    logger.info("Scraper scheduler started")

    while True:
        wait_seconds = _seconds_until_next_run()
        next_run = datetime.now(timezone.utc) + timedelta(seconds=wait_seconds) + UAE_OFFSET
        logger.info(
            f"Next scrape scheduled at {next_run.strftime('%Y-%m-%d %H:%M')} GST "
            f"(in {wait_seconds / 3600:.1f} hours)"
        )

        await asyncio.sleep(wait_seconds)

        try:
            logger.info("Starting scheduled scrape run...")
            summary = await run_all_scrapers()
            logger.info(
                f"Scheduled scrape complete: "
                f"{summary['total_upserted']} products updated in "
                f"{summary['duration_seconds']}s"
            )
        except Exception as e:
            logger.error(f"Scheduled scrape failed: {e}", exc_info=True)

        # Wait a bit to avoid double-triggering
        await asyncio.sleep(60)


def start_scheduler():
    """Start the background scraper scheduler.

    Call this during FastAPI lifespan startup.
    """
    global _scheduler_task
    if _scheduler_task is None or _scheduler_task.done():
        _scheduler_task = asyncio.create_task(_scheduler_loop())
        logger.info("Scraper scheduler task created")


def stop_scheduler():
    """Stop the background scraper scheduler.

    Call this during FastAPI lifespan shutdown.
    """
    global _scheduler_task
    if _scheduler_task and not _scheduler_task.done():
        _scheduler_task.cancel()
        logger.info("Scraper scheduler task cancelled")
