from pydantic import BaseModel
from typing import Optional


class FeedbackRequest(BaseModel):
    session_id: str
    recommendation_id: str
    recommendation_type: str  # 'product' or 'provider'
    feedback: str  # 'up' or 'down'
    context: Optional[dict] = None


class FeedbackResponse(BaseModel):
    id: str
    recorded: bool


class FeedbackItem(BaseModel):
    recommendation_id: str
    recommendation_type: str
    feedback: str
    created_at: str
