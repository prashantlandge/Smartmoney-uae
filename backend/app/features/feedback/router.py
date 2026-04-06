"""Recommendation feedback API — records thumbs up/down on recommendations."""

import json
from fastapi import APIRouter, HTTPException
from app.db.connection import get_pool
from app.features.feedback.schemas import FeedbackRequest, FeedbackResponse, FeedbackItem

router = APIRouter()


@router.post("", response_model=FeedbackResponse)
async def record_feedback(request: FeedbackRequest):
    """Record thumbs up/down feedback on a recommendation."""
    if request.feedback not in ("up", "down"):
        raise HTTPException(status_code=400, detail="Feedback must be 'up' or 'down'")

    pool = await get_pool()
    row = await pool.fetchrow(
        """INSERT INTO recommendation_feedback
           (session_id, recommendation_id, recommendation_type, feedback, context)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id""",
        request.session_id,
        request.recommendation_id,
        request.recommendation_type,
        request.feedback,
        json.dumps(request.context or {}),
    )
    return FeedbackResponse(id=str(row["id"]), recorded=True)


@router.get("/{session_id}", response_model=list[FeedbackItem])
async def get_feedback(session_id: str):
    """Get all feedback for a session."""
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT recommendation_id, recommendation_type, feedback, created_at
           FROM recommendation_feedback
           WHERE session_id = $1
           ORDER BY created_at DESC
           LIMIT 100""",
        session_id,
    )
    return [
        FeedbackItem(
            recommendation_id=r["recommendation_id"],
            recommendation_type=r["recommendation_type"],
            feedback=r["feedback"],
            created_at=str(r["created_at"]),
        )
        for r in rows
    ]
