from fastapi import APIRouter
from app.features.advisor.engine import chat, get_recommendations
from app.features.advisor.schemas import (
    ChatRequest,
    ChatResponse,
    RecommendRequest,
    RecommendResponse,
)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def advisor_chat(request: ChatRequest):
    """Chat with the AI financial advisor."""
    return await chat(
        session_id=request.session_id,
        message=request.message,
        language=request.language,
    )


@router.post("/recommend", response_model=RecommendResponse)
async def advisor_recommend(request: RecommendRequest):
    """Get AI-powered provider recommendations based on user profile."""
    recommendations = await get_recommendations(
        session_id=request.session_id,
        send_amount_aed=request.send_amount_aed,
        receive_currency=request.receive_currency,
    )
    return RecommendResponse(recommendations=recommendations)
