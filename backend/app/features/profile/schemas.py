from pydantic import BaseModel, Field
from typing import Optional


class ProfileCreateRequest(BaseModel):
    session_id: str
    nationality: Optional[str] = "IN"
    residency_status: Optional[str] = "resident"
    monthly_salary_aed: Optional[float] = None
    employer_category: Optional[str] = None
    preferred_language: Optional[str] = "en"
    transfer_frequency: Optional[str] = None
    preferred_speed: Optional[str] = None


class ProfileResponse(BaseModel):
    session_id: str
    nationality: Optional[str] = None
    residency_status: Optional[str] = None
    monthly_salary_aed: Optional[float] = None
    employer_category: Optional[str] = None
    preferred_language: str = "en"
    transfer_frequency: Optional[str] = None
    preferred_speed: Optional[str] = None
    onboarded: bool = False
