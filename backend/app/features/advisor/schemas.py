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


class ProductRecommendRequest(BaseModel):
    salary_aed: float = 10000
    nationality: str = "IN"
    islamic_preference: bool = False
    spending_categories: list[str] = []  # e.g. ["dining", "travel", "groceries"]
    risk_tolerance: str = "moderate"  # conservative, moderate, aggressive
    category: Optional[str] = None  # filter to specific category


class ProductRecommendation(BaseModel):
    product_id: str
    product_name: str
    provider_name: str
    score: int
    reason: str
    highlight: str = ""


class ProductRecommendResponse(BaseModel):
    recommendations: list[ProductRecommendation]
