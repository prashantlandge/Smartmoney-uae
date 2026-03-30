from pydantic import BaseModel
from typing import Optional


class TrackEventRequest(BaseModel):
    session_id: str
    event_type: str  # compare, click_provider, chat, set_alert, view_chart, profile_update
    event_data: Optional[dict] = {}


class TrackEventBatchRequest(BaseModel):
    events: list[TrackEventRequest]


class TrackEventResponse(BaseModel):
    recorded: int
