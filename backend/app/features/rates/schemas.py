from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class RateHistoryPoint(BaseModel):
    provider_name: str
    exchange_rate: float
    effective_rate: Optional[float] = None
    fee_aed: float
    recorded_at: datetime


class RateHistoryResponse(BaseModel):
    send_currency: str = "AED"
    receive_currency: str = "INR"
    days: int
    points: list[RateHistoryPoint]


class RateTrendResponse(BaseModel):
    send_currency: str = "AED"
    receive_currency: str = "INR"
    current_avg_rate: float
    week_ago_avg_rate: float
    change_percent: float
    direction: str  # "up", "down", "stable"
    summary: str  # Natural language summary


class RateAlertCreateRequest(BaseModel):
    session_id: str
    email: str = Field(min_length=5)
    target_rate: float = Field(gt=0)
    direction: str = Field(default="above", pattern="^(above|below)$")
    send_currency: str = "AED"
    receive_currency: str = "INR"


class RateAlertResponse(BaseModel):
    id: str
    target_rate: float
    direction: str
    active: bool
    created_at: datetime


class BestTimeResponse(BaseModel):
    recommendation: str
    best_day: Optional[str] = None
    best_hour_utc: Optional[int] = None
    avg_rate_at_best_time: Optional[float] = None
    current_rate: Optional[float] = None
    data_points_analyzed: int
