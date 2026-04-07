"""Personalization API — homepage personalization."""

from fastapi import APIRouter
from app.features.personalization.homepage import get_personalized_homepage

router = APIRouter()


@router.get("/{session_id}")
async def personalize(session_id: str):
    """Get personalized homepage configuration."""
    return await get_personalized_homepage(session_id)
