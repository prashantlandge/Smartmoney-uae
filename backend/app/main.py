from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.connection import create_pool, close_pool
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_pool()
    start_scheduler()
    yield
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


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
