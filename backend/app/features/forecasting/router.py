"""Forecasting API — rate predictions, best time, affinity scores."""

import json
from fastapi import APIRouter
from app.db.connection import get_pool
from app.features.forecasting.rate_forecast import get_best_time_prediction
from app.features.forecasting.schemas import (
    RateForecastPoint,
    RateForecastResponse,
    BestTimePrediction,
    AffinityItem,
    AffinityResponse,
)

router = APIRouter()


@router.get("/rates", response_model=RateForecastResponse)
async def get_rate_forecast(send: str = "AED", receive: str = "INR"):
    """Get 7-day rate forecast with confidence intervals."""
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT forecast_date, predicted_rate, confidence_lower, confidence_upper, model_type
           FROM rate_forecasts
           WHERE send_currency = $1 AND receive_currency = $2
             AND forecast_date >= CURRENT_DATE
           ORDER BY forecast_date
           LIMIT 7""",
        send,
        receive,
    )

    model_type = rows[0]["model_type"] if rows else "none"
    forecasts = [
        RateForecastPoint(
            date=str(r["forecast_date"]),
            predicted_rate=float(r["predicted_rate"]),
            confidence_lower=float(r["confidence_lower"]) if r["confidence_lower"] else float(r["predicted_rate"]),
            confidence_upper=float(r["confidence_upper"]) if r["confidence_upper"] else float(r["predicted_rate"]),
        )
        for r in rows
    ]

    return RateForecastResponse(
        send_currency=send,
        receive_currency=receive,
        model_type=model_type,
        forecasts=forecasts,
    )


@router.get("/best-time", response_model=BestTimePrediction)
async def best_time(send: str = "AED", receive: str = "INR"):
    """Get predictive best time to send money."""
    result = await get_best_time_prediction(send, receive)
    return BestTimePrediction(**result)


@router.get("/affinity/{session_id}", response_model=AffinityResponse)
async def get_affinity(session_id: str):
    """Get top product affinity scores for a user."""
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT pas.product_id, p.name_en as product_name, pr.name_en as provider_name,
                  pas.affinity_score, pas.signals
           FROM product_affinity_scores pas
           JOIN products p ON pas.product_id = p.id
           JOIN providers pr ON p.provider_id = pr.id
           WHERE pas.session_id = $1
           ORDER BY pas.affinity_score DESC
           LIMIT 10""",
        session_id,
    )

    items = []
    for r in rows:
        signals = r["signals"]
        if isinstance(signals, str):
            try:
                signals = json.loads(signals)
            except (json.JSONDecodeError, TypeError):
                signals = {}
        items.append(
            AffinityItem(
                product_id=str(r["product_id"]),
                product_name=r["product_name"],
                provider_name=r["provider_name"],
                affinity_score=float(r["affinity_score"]),
                signals=signals or {},
            )
        )

    return AffinityResponse(session_id=session_id, items=items)
