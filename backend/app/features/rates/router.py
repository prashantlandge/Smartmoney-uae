from fastapi import APIRouter, Query
from typing import Optional
from app.features.rates.history import get_rate_history
from app.features.rates.trend_analyzer import get_rate_trend, get_best_time_to_send
from app.features.rates.alerts import create_alert
from app.features.rates.schemas import (
    RateHistoryResponse,
    RateTrendResponse,
    RateAlertCreateRequest,
    RateAlertResponse,
    BestTimeResponse,
)

router = APIRouter()


@router.get("/history", response_model=RateHistoryResponse)
async def rate_history(
    days: int = Query(default=7, ge=1, le=90),
    provider_id: Optional[str] = None,
    send_currency: str = "AED",
    receive_currency: str = "INR",
):
    """Get historical rate data for charts."""
    return await get_rate_history(
        days=days,
        provider_id=provider_id,
        send_currency=send_currency,
        receive_currency=receive_currency,
    )


@router.get("/trend", response_model=RateTrendResponse)
async def rate_trend(
    send_currency: str = "AED",
    receive_currency: str = "INR",
):
    """Get rate trend analysis (up/down/stable with percentage)."""
    return await get_rate_trend(send_currency, receive_currency)


@router.post("/alert", response_model=RateAlertResponse)
async def create_rate_alert(request: RateAlertCreateRequest):
    """Create a rate alert subscription."""
    return await create_alert(request)


@router.get("/best-time", response_model=BestTimeResponse)
async def best_time_to_send(
    send_currency: str = "AED",
    receive_currency: str = "INR",
):
    """AI-powered best time to send recommendation."""
    return await get_best_time_to_send(send_currency, receive_currency)
