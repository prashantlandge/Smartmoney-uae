"""A/B experiments API."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.features.experiments.engine import (
    get_assignment,
    record_conversion,
    get_experiment_results,
)

router = APIRouter()


class AssignmentResponse(BaseModel):
    experiment: str
    variant: Optional[str]


class ConversionRequest(BaseModel):
    session_id: str
    experiment: str
    metric_name: str
    metric_value: float = 1.0


class ConversionResponse(BaseModel):
    recorded: bool


@router.get("/assign", response_model=AssignmentResponse)
async def assign(session_id: str, experiment: str):
    """Get A/B experiment assignment for a session."""
    variant = await get_assignment(session_id, experiment)
    return AssignmentResponse(experiment=experiment, variant=variant)


@router.post("/convert", response_model=ConversionResponse)
async def convert(request: ConversionRequest):
    """Record a conversion event."""
    ok = await record_conversion(
        request.session_id,
        request.experiment,
        request.metric_name,
        request.metric_value,
    )
    return ConversionResponse(recorded=ok)


@router.get("/{name}/results")
async def results(name: str):
    """Get experiment results with conversion rates."""
    return await get_experiment_results(name)
