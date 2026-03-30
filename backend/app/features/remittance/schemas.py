from pydantic import BaseModel, Field
from datetime import datetime


class RemittanceCompareRequest(BaseModel):
    send_amount_aed: float = Field(gt=0, le=100000, description="Amount to send in AED")
    receive_currency: str = Field(default="INR", pattern="^[A-Z]{3}$")


class ProviderResult(BaseModel):
    provider_name: str
    provider_logo: str
    exchange_rate: float
    fee_aed: float
    recipient_receives_inr: float
    transfer_speed: str
    cost_vs_mid_market_percent: float
    affiliate_link: str
    savings_vs_worst: float


class RemittanceCompareResponse(BaseModel):
    mid_market_rate: float
    providers: list[ProviderResult]
    last_updated: datetime
