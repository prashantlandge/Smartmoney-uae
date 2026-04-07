from pydantic import BaseModel
from typing import Optional


class RateForecastPoint(BaseModel):
    date: str
    predicted_rate: float
    confidence_lower: float
    confidence_upper: float


class RateForecastResponse(BaseModel):
    send_currency: str
    receive_currency: str
    model_type: str
    forecasts: list[RateForecastPoint]


class BestTimePrediction(BaseModel):
    has_forecast: bool
    best_date: Optional[str] = None
    predicted_rate: Optional[float] = None
    confidence_lower: Optional[float] = None
    confidence_upper: Optional[float] = None
    recommendation: str


class AffinityItem(BaseModel):
    product_id: str
    product_name: str
    provider_name: str
    affinity_score: float
    signals: dict


class AffinityResponse(BaseModel):
    session_id: str
    items: list[AffinityItem]
