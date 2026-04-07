"""Nightly intelligence batch jobs.

Follows the same asyncio pattern as scrapers/scheduler.py.
Runs at 4:00 AM GST (1 hour after scraper).
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta

logger = logging.getLogger("intelligence.scheduler")

UAE_OFFSET = timedelta(hours=4)
TARGET_HOUR = 4
TARGET_MINUTE = 0

_scheduler_task: asyncio.Task | None = None


def _seconds_until_next_run() -> float:
    """Calculate seconds until next 4:00 AM GST."""
    now_utc = datetime.now(timezone.utc)
    now_uae = now_utc + UAE_OFFSET

    target_today = now_uae.replace(
        hour=TARGET_HOUR, minute=TARGET_MINUTE, second=0, microsecond=0
    )

    if now_uae >= target_today:
        target = target_today + timedelta(days=1)
    else:
        target = target_today

    target_utc = target - UAE_OFFSET
    delta = (target_utc - now_utc).total_seconds()
    return max(delta, 60)


async def _intelligence_loop():
    """Main loop — runs segmentation, social proof, forecasting, and affinity nightly."""
    logger.info("Intelligence scheduler started")

    while True:
        wait_seconds = _seconds_until_next_run()
        next_run = datetime.now(timezone.utc) + timedelta(seconds=wait_seconds) + UAE_OFFSET
        logger.info(
            f"Next intelligence batch at {next_run.strftime('%Y-%m-%d %H:%M')} GST "
            f"(in {wait_seconds / 3600:.1f} hours)"
        )

        await asyncio.sleep(wait_seconds)

        try:
            logger.info("Starting intelligence batch...")

            # Phase 2: Segmentation
            from app.features.segmentation.engine import compute_all_segments
            from app.features.segmentation.social_proof import compute_social_proof

            segmented = await compute_all_segments()
            proof_count = await compute_social_proof()
            logger.info(f"Segmentation: {segmented} users, {proof_count} social proof stats")

            # Phase 3: Forecasting and affinity (imported when available)
            try:
                from app.features.forecasting.rate_forecast import compute_rate_forecasts
                from app.features.forecasting.affinity import compute_affinity_scores

                forecast_count = await compute_rate_forecasts()
                affinity_count = await compute_affinity_scores()
                logger.info(f"Forecasting: {forecast_count} forecasts, {affinity_count} affinity scores")
            except ImportError:
                pass

            # Phase 4: Embeddings (imported when available)
            try:
                from app.features.embeddings.engine import compute_all_embeddings
                embed_count = await compute_all_embeddings()
                logger.info(f"Embeddings: {embed_count} products embedded")
            except ImportError:
                pass

            logger.info("Intelligence batch complete")
        except Exception as e:
            logger.error(f"Intelligence batch failed: {e}", exc_info=True)

        await asyncio.sleep(60)


def start_intelligence_scheduler():
    global _scheduler_task
    if _scheduler_task is None or _scheduler_task.done():
        _scheduler_task = asyncio.create_task(_intelligence_loop())
        logger.info("Intelligence scheduler task created")


def stop_intelligence_scheduler():
    global _scheduler_task
    if _scheduler_task and not _scheduler_task.done():
        _scheduler_task.cancel()
        logger.info("Intelligence scheduler task cancelled")
