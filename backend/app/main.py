import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.connection import create_pool, close_pool

# ── Logging Configuration ──────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
# Reduce noise from third-party libraries
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("asyncpg").setLevel(logging.WARNING)

logger = logging.getLogger("app.main")
from app.utils.redis_client import close_redis
from app.features.remittance.router import router as remittance_router
from app.features.profile.router import router as profile_router
from app.features.rates.router import router as rates_router
from app.features.advisor.router import router as advisor_router
from app.features.events.router import router as events_router
from app.features.products.router import router as products_router
from app.features.eligibility.router import router as eligibility_router
from app.features.scrapers.router import router as scraper_router
from app.features.scrapers.scheduler import start_scheduler, stop_scheduler
from app.features.admin.router import router as admin_router
from app.features.feedback.router import router as feedback_router
from app.features.segmentation.router import router as segmentation_router
from app.features.segmentation.scheduler import start_intelligence_scheduler, stop_intelligence_scheduler
from app.features.forecasting.router import router as forecasting_router
from app.features.embeddings.router import router as embeddings_router
from app.features.experiments.router import router as experiments_router
from app.features.personalization.router import router as personalization_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Database — required for the app to function
    try:
        await create_pool()
        logger.info("Database pool initialized")
    except Exception as e:
        logger.critical(f"FATAL: Database connection failed on startup: {e}")
        raise  # App cannot function without DB

    # Schedulers — non-critical, app can serve requests without them
    try:
        start_scheduler()
        logger.info("Scraper scheduler started")
    except Exception as e:
        logger.error(f"Scraper scheduler failed to start (non-fatal): {e}")

    try:
        start_intelligence_scheduler()
        logger.info("Intelligence scheduler started")
    except Exception as e:
        logger.error(f"Intelligence scheduler failed to start (non-fatal): {e}")

    yield

    stop_intelligence_scheduler()
    stop_scheduler()
    await close_pool()
    await close_redis()


app = FastAPI(
    title="SmartMoney UAE API",
    description="UAE financial product comparison platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(remittance_router, prefix="/api/remittance", tags=["remittance"])
app.include_router(profile_router, prefix="/api/profile", tags=["profile"])
app.include_router(rates_router, prefix="/api/rates", tags=["rates"])
app.include_router(advisor_router, prefix="/api/advisor", tags=["advisor"])
app.include_router(events_router, prefix="/api/events", tags=["events"])
app.include_router(products_router, prefix="/api/products", tags=["products"])
app.include_router(eligibility_router, prefix="/api/eligibility", tags=["eligibility"])
app.include_router(scraper_router, prefix="/api/scrapers", tags=["scrapers"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(feedback_router, prefix="/api/feedback", tags=["feedback"])
app.include_router(segmentation_router, prefix="/api/segmentation", tags=["segmentation"])
app.include_router(forecasting_router, prefix="/api/forecast", tags=["forecast"])
app.include_router(embeddings_router, prefix="/api/search", tags=["search"])
app.include_router(experiments_router, prefix="/api/experiments", tags=["experiments"])
app.include_router(personalization_router, prefix="/api/personalize", tags=["personalization"])


@app.get("/api/health")
async def health_check():
    """Health check that verifies DB connectivity — not just process alive."""
    from app.db.connection import check_pool_health

    db_health = await check_pool_health()
    db_ok = db_health.get("status") == "healthy"

    return {
        "status": "ok" if db_ok else "degraded",
        "database": db_health,
    }
