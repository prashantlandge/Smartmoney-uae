from pydantic import BaseModel
from typing import Optional


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"
    context: Optional[dict] = None  # Optional rate/product context


class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str] = []


class RecommendRequest(BaseModel):
    session_id: str
    send_amount_aed: float = 1000
    receive_currency: str = "INR"


class ProviderRecommendation(BaseModel):
    provider_name: str
    score: int
    reason: str


class RecommendResponse(BaseModel):
    recommendations: list[ProviderRecommendation]
