from fastapi import APIRouter, HTTPException
from app.features.remittance.schemas import RemittanceCompareRequest, RemittanceCompareResponse
from app.features.remittance.engine import compare_rates

router = APIRouter()


@router.post("/compare", response_model=RemittanceCompareResponse)
async def compare_remittance_rates(request: RemittanceCompareRequest):
    """Compare live remittance rates from multiple providers for AED to INR."""
    try:
        return await compare_rates(
            send_amount_aed=request.send_amount_aed,
            receive_currency=request.receive_currency,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch rates: {str(e)}")
