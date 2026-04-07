import logging
from fastapi import APIRouter
from app.db.connection import get_pool
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

logger = logging.getLogger(__name__)

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
    # Persist quiz answers to user_profiles if session_id provided
    if request.session_id:
        try:
            pool = await get_pool()
            await pool.execute(
                """INSERT INTO user_profiles
                   (session_id, monthly_salary_aed, nationality, islamic_preference,
                    spending_categories, risk_tolerance, quiz_completed_at, updated_at)
                   VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                   ON CONFLICT (session_id) WHERE session_id IS NOT NULL
                   DO UPDATE SET
                     monthly_salary_aed = COALESCE($2, user_profiles.monthly_salary_aed),
                     nationality = COALESCE($3, user_profiles.nationality),
                     islamic_preference = $4,
                     spending_categories = $5,
                     risk_tolerance = $6,
                     quiz_completed_at = NOW(),
                     updated_at = NOW()""",
                request.session_id,
                request.salary_aed,
                request.nationality,
                request.islamic_preference,
                request.spending_categories,
                request.risk_tolerance,
            )
        except Exception as e:
            logger.warning("Failed to persist quiz answers: %s", e)

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
