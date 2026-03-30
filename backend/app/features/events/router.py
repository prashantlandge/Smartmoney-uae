from fastapi import APIRouter
from app.features.events.tracker import record_event, record_affiliate_click
from app.features.events.schemas import (
    TrackEventRequest,
    TrackEventBatchRequest,
    TrackEventResponse,
)

router = APIRouter()


@router.post("/track", response_model=TrackEventResponse)
async def track_event(request: TrackEventRequest):
    """Record a single user event."""
    if request.event_type == "click_provider":
        await record_affiliate_click(
            session_id=request.session_id,
            provider_name=request.event_data.get("provider_name", ""),
            affiliate_link=request.event_data.get("affiliate_link", ""),
            send_amount_aed=request.event_data.get("send_amount_aed"),
        )
    else:
        await record_event(request.session_id, request.event_type, request.event_data)
    return TrackEventResponse(recorded=1)


@router.post("/track/batch", response_model=TrackEventResponse)
async def track_events_batch(request: TrackEventBatchRequest):
    """Record multiple user events in a single request."""
    count = 0
    for event in request.events:
        try:
            if event.event_type == "click_provider":
                await record_affiliate_click(
                    session_id=event.session_id,
                    provider_name=event.event_data.get("provider_name", ""),
                    affiliate_link=event.event_data.get("affiliate_link", ""),
                    send_amount_aed=event.event_data.get("send_amount_aed"),
                )
            else:
                await record_event(event.session_id, event.event_type, event.event_data)
            count += 1
        except Exception:
            continue
    return TrackEventResponse(recorded=count)
