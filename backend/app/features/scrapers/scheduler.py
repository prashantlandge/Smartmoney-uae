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

# Schedule targets (GST):
#   Validation check: Daily at 2:00 AM GST (before scraping)
#   HTML scrapers: Daily at 3:00 AM GST
#   PDF scrapers: Weekly on Sundays at 4:00 AM GST
#   Staleness check: Daily at 5:00 AM GST
VALIDATION_HOUR = 2
HTML_SCRAPE_HOUR = 3
PDF_SCRAPE_HOUR = 4
STALENESS_CHECK_HOUR = 5

_validation_task: asyncio.Task | None = None
_html_scheduler_task: asyncio.Task | None = None
_pdf_scheduler_task: asyncio.Task | None = None
_staleness_task: asyncio.Task | None = None
_heartbeat_task: asyncio.Task | None = None

# Track last successful run timestamps for crash detection
_last_heartbeats: dict[str, datetime] = {}
HEARTBEAT_CHECK_INTERVAL = 3600  # Check every hour
TASK_TIMEOUT_HOURS = 26  # Alert if a daily task hasn't run in 26 hours


def _seconds_until_target(hour: int, minute: int = 0) -> float:
    """Calculate seconds until next target time in GST."""
    now_utc = datetime.now(timezone.utc)
    now_uae = now_utc + UAE_OFFSET

    target_today = now_uae.replace(
        hour=hour, minute=minute, second=0, microsecond=0
    )

    if now_uae >= target_today:
        target = target_today + timedelta(days=1)
    else:
        target = target_today

    target_utc = target - UAE_OFFSET
    delta = (target_utc - now_utc).total_seconds()
    return max(delta, 60)


def _seconds_until_next_sunday(hour: int) -> float:
    """Calculate seconds until next Sunday at the given hour (GST)."""
    now_utc = datetime.now(timezone.utc)
    now_uae = now_utc + UAE_OFFSET

    # Find next Sunday
    days_ahead = 6 - now_uae.weekday()  # Sunday = 6
    if days_ahead == 0:
        # It's Sunday — check if target time has passed
        target_today = now_uae.replace(hour=hour, minute=0, second=0, microsecond=0)
        if now_uae >= target_today:
            days_ahead = 7
    elif days_ahead < 0:
        days_ahead += 7

    target = now_uae.replace(hour=hour, minute=0, second=0, microsecond=0) + timedelta(days=days_ahead)
    target_utc = target - UAE_OFFSET
    delta = (target_utc - now_utc).total_seconds()
    return max(delta, 60)


async def _validation_loop():
    """Daily validation loop — 2:00 AM GST (runs before scraping)."""
    from app.features.scrapers.validator import ScraperValidator

    logger.info("Validation scheduler started (daily 2 AM GST)")

    while True:
        wait_seconds = _seconds_until_target(VALIDATION_HOUR)
        next_run = datetime.now(timezone.utc) + timedelta(seconds=wait_seconds) + UAE_OFFSET
        logger.info(
            f"Next validation at {next_run.strftime('%Y-%m-%d %H:%M')} GST "
            f"(in {wait_seconds / 3600:.1f} hours)"
        )

        await asyncio.sleep(wait_seconds)

        try:
            logger.info("Starting scheduled scraper validation...")
            validator = ScraperValidator()
            report = await validator.validate_all()
            summary = report.get("summary", {})
            _record_heartbeat("validation")
            logger.info(
                f"Scheduled validation complete: "
                f"{summary.get('urls_failing', 0)} URL failures, "
                f"{summary.get('structure_changes', 0)} structure changes"
            )
        except Exception as e:
            logger.error(f"Scheduled validation failed: {e}", exc_info=True)
            _record_heartbeat("validation")  # Record even on failure — task is alive

        await asyncio.sleep(60)


async def _html_scheduler_loop():
    """Daily HTML scraper loop — 3:00 AM GST."""
    from app.features.scrapers.runner import run_all_scrapers

    logger.info("HTML scraper scheduler started (daily 3 AM GST)")

    while True:
        wait_seconds = _seconds_until_target(HTML_SCRAPE_HOUR)
        next_run = datetime.now(timezone.utc) + timedelta(seconds=wait_seconds) + UAE_OFFSET
        logger.info(
            f"Next HTML scrape at {next_run.strftime('%Y-%m-%d %H:%M')} GST "
            f"(in {wait_seconds / 3600:.1f} hours)"
        )

        await asyncio.sleep(wait_seconds)

        try:
            logger.info("Starting scheduled HTML scrape run...")
            summary = await run_all_scrapers()
            _record_heartbeat("html_scrape")
            logger.info(
                f"Scheduled HTML scrape complete: "
                f"{summary['total_upserted']} products updated in "
                f"{summary['duration_seconds']}s"
            )
        except Exception as e:
            logger.error(f"Scheduled HTML scrape failed: {e}", exc_info=True)
            _record_heartbeat("html_scrape")

        await asyncio.sleep(60)


async def _pdf_scheduler_loop():
    """Weekly PDF scraper loop — Sundays 4:00 AM GST."""
    from app.features.scrapers.runner import run_all_pdf_scrapers

    logger.info("PDF scraper scheduler started (weekly Sundays 4 AM GST)")

    while True:
        wait_seconds = _seconds_until_next_sunday(PDF_SCRAPE_HOUR)
        next_run = datetime.now(timezone.utc) + timedelta(seconds=wait_seconds) + UAE_OFFSET
        logger.info(
            f"Next PDF scrape at {next_run.strftime('%Y-%m-%d %H:%M')} GST "
            f"(in {wait_seconds / 3600:.1f} hours)"
        )

        await asyncio.sleep(wait_seconds)

        try:
            logger.info("Starting scheduled PDF scrape run...")
            summary = await run_all_pdf_scrapers()
            _record_heartbeat("pdf_scrape")
            logger.info(
                f"Scheduled PDF scrape complete: "
                f"{summary['total_upserted']} products updated in "
                f"{summary['duration_seconds']}s"
            )
        except Exception as e:
            logger.error(f"Scheduled PDF scrape failed: {e}", exc_info=True)
            _record_heartbeat("pdf_scrape")

        await asyncio.sleep(60)


def _record_heartbeat(task_name: str):
    """Record that a scheduler task ran successfully."""
    _last_heartbeats[task_name] = datetime.now(timezone.utc)
    logger.debug(f"Heartbeat recorded: {task_name}")


async def _heartbeat_monitor_loop():
    """Monitor scheduler tasks for crashes. Checks every hour."""
    from app.features.scrapers.alerts import ScraperAlertEngine

    logger.info("Heartbeat monitor started (hourly checks)")
    # Give tasks time to register their first heartbeat
    await asyncio.sleep(300)

    while True:
        await asyncio.sleep(HEARTBEAT_CHECK_INTERVAL)
        now = datetime.now(timezone.utc)
        alert_engine = ScraperAlertEngine()

        # Check each named task
        tasks_to_check = {
            "validation": _validation_task,
            "html_scrape": _html_scheduler_task,
            "pdf_scrape": _pdf_scheduler_task,
            "staleness_check": _staleness_task,
        }
        for name, task in tasks_to_check.items():
            if task is None:
                continue
            # Detect crashed tasks (done but not cancelled)
            if task.done() and not task.cancelled():
                exc = task.exception() if not task.cancelled() else None
                try:
                    await alert_engine.record_alert(
                        alert_type="scheduler_crash",
                        severity="critical",
                        provider_name="SCHEDULER",
                        message=f"Scheduler task '{name}' crashed unexpectedly",
                        details={"exception": str(exc) if exc else "unknown"},
                    )
                except Exception:
                    pass
                logger.critical(f"Scheduler task '{name}' has crashed: {exc}")

            # Detect tasks that haven't run within expected window
            last_beat = _last_heartbeats.get(name)
            if last_beat:
                hours_since = (now - last_beat).total_seconds() / 3600
                if hours_since > TASK_TIMEOUT_HOURS:
                    logger.warning(
                        f"Scheduler task '{name}' last ran {hours_since:.1f}h ago "
                        f"(threshold: {TASK_TIMEOUT_HOURS}h)"
                    )
                    try:
                        await alert_engine.record_alert(
                            alert_type="scheduler_stalled",
                            severity="high",
                            provider_name="SCHEDULER",
                            message=f"Task '{name}' hasn't run in {hours_since:.0f} hours",
                            details={"last_heartbeat": last_beat.isoformat()},
                        )
                    except Exception:
                        pass

        logger.debug("Heartbeat check complete")


async def _staleness_check_loop():
    """Daily staleness check — 5:00 AM GST."""
    from app.features.scrapers.alerts import ScraperAlertEngine

    logger.info("Staleness check scheduler started (daily 5 AM GST)")

    while True:
        wait_seconds = _seconds_until_target(STALENESS_CHECK_HOUR)
        await asyncio.sleep(wait_seconds)

        try:
            alert_engine = ScraperAlertEngine()
            await alert_engine.check_staleness()
            _record_heartbeat("staleness_check")
            logger.info("Staleness check complete")
        except Exception as e:
            logger.error(f"Staleness check failed: {e}", exc_info=True)
            _record_heartbeat("staleness_check")

        await asyncio.sleep(60)


def start_scheduler():
    """Start all background scraper schedulers.

    Call this during FastAPI lifespan startup.
    """
    global _validation_task, _html_scheduler_task, _pdf_scheduler_task, _staleness_task, _heartbeat_task

    if _validation_task is None or _validation_task.done():
        _validation_task = asyncio.create_task(_validation_loop())
        logger.info("Validation scheduler task created")

    if _html_scheduler_task is None or _html_scheduler_task.done():
        _html_scheduler_task = asyncio.create_task(_html_scheduler_loop())
        logger.info("HTML scraper scheduler task created")

    if _pdf_scheduler_task is None or _pdf_scheduler_task.done():
        _pdf_scheduler_task = asyncio.create_task(_pdf_scheduler_loop())
        logger.info("PDF scraper scheduler task created")

    if _staleness_task is None or _staleness_task.done():
        _staleness_task = asyncio.create_task(_staleness_check_loop())
        logger.info("Staleness check scheduler task created")

    if _heartbeat_task is None or _heartbeat_task.done():
        _heartbeat_task = asyncio.create_task(_heartbeat_monitor_loop())
        logger.info("Heartbeat monitor task created")


def stop_scheduler():
    """Stop all background scraper schedulers.

    Call this during FastAPI lifespan shutdown.
    """
    global _validation_task, _html_scheduler_task, _pdf_scheduler_task, _staleness_task, _heartbeat_task

    for task_name, task in [
        ("Validation", _validation_task),
        ("HTML", _html_scheduler_task),
        ("PDF", _pdf_scheduler_task),
        ("Staleness", _staleness_task),
        ("Heartbeat", _heartbeat_task),
    ]:
        if task and not task.done():
            task.cancel()
            logger.info(f"{task_name} scheduler task cancelled")
