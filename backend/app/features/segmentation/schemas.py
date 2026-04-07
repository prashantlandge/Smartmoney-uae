from pydantic import BaseModel
from typing import Optional


class UserSegmentResponse(BaseModel):
    session_id: str
    segment: str
    confidence: float
    computed_at: Optional[str] = None


class SocialProofItem(BaseModel):
    product_id: str
    product_name: str
    provider_name: str
    click_count: int
    label: str


class SocialProofResponse(BaseModel):
    segment: str
    items: list[SocialProofItem]


class QuizStateResponse(BaseModel):
    returning_user: bool
    known_fields: list[str]
    suggested_skip_steps: list[int]
    salary_aed: Optional[float] = None
    nationality: Optional[str] = None
