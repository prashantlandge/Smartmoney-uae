"""Segmentation API — user segments and social proof."""

from fastapi import APIRouter
from app.features.segmentation.engine import get_user_segment
from app.features.segmentation.social_proof import get_social_proof
from app.features.segmentation.schemas import (
    UserSegmentResponse,
    SocialProofItem,
    SocialProofResponse,
)

router = APIRouter()


@router.get("/segment/{session_id}", response_model=UserSegmentResponse)
async def get_segment(session_id: str):
    """Get user's behavioral segment."""
    segment, confidence = await get_user_segment(session_id)
    return UserSegmentResponse(
        session_id=session_id,
        segment=segment,
        confidence=confidence,
    )


@router.get("/social-proof/{segment}", response_model=SocialProofResponse)
async def social_proof(segment: str):
    """Get social proof stats for a segment."""
    data = await get_social_proof(segment)
    items = [
        SocialProofItem(
            product_id=pid,
            product_name=info.get("product_name", ""),
            provider_name=info.get("provider_name", ""),
            click_count=info["click_count"],
            label=info["label"],
        )
        for pid, info in data.items()
    ]
    return SocialProofResponse(segment=segment, items=items)
