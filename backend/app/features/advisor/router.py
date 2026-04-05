from fastapi import APIRouter
from app.features.advisor.engine import chat, get_recommendations
from app.features.advisor.product_recommend import get_product_recommendations
from app.features.advisor.schemas import (
    ChatRequest,
    ChatResponse,
    RecommendRequest,
    RecommendResponse,
    ProductRecommendRequest,
    ProductRecommendResponse,
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


@router.post("/smart-recommend", response_model=ProductRecommendResponse)
async def smart_recommend(request: ProductRecommendRequest):
    """Get AI-powered personalized product recommendations across all categories."""
    profile = {
        "salary_aed": request.salary_aed,
        "nationality": request.nationality,
        "islamic_preference": request.islamic_preference,
        "spending_categories": request.spending_categories,
        "risk_tolerance": request.risk_tolerance,
    }
    recommendations = await get_product_recommendations(
        profile=profile,
        category=request.category,
    )
    return ProductRecommendResponse(recommendations=recommendations)
