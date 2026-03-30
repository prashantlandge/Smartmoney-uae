from fastapi import APIRouter, HTTPException
from app.db.connection import get_pool
from app.features.profile.schemas import ProfileCreateRequest, ProfileResponse

router = APIRouter()


@router.post("", response_model=ProfileResponse)
async def upsert_profile(request: ProfileCreateRequest):
    """Create or update a user profile by session_id."""
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        INSERT INTO user_profiles (
            session_id, nationality, residency_status, monthly_salary_aed,
            employer_category, preferred_language, transfer_frequency,
            preferred_speed, onboarded, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
        ON CONFLICT (session_id) WHERE session_id IS NOT NULL
        DO UPDATE SET
            nationality = COALESCE($2, user_profiles.nationality),
            residency_status = COALESCE($3, user_profiles.residency_status),
            monthly_salary_aed = COALESCE($4, user_profiles.monthly_salary_aed),
            employer_category = COALESCE($5, user_profiles.employer_category),
            preferred_language = COALESCE($6, user_profiles.preferred_language),
            transfer_frequency = COALESCE($7, user_profiles.transfer_frequency),
            preferred_speed = COALESCE($8, user_profiles.preferred_speed),
            onboarded = true,
            updated_at = NOW()
        RETURNING session_id, nationality, residency_status, monthly_salary_aed,
                  employer_category, preferred_language, transfer_frequency,
                  preferred_speed, onboarded
        """,
        request.session_id,
        request.nationality,
        request.residency_status,
        request.monthly_salary_aed,
        request.employer_category,
        request.preferred_language,
        request.transfer_frequency,
        request.preferred_speed,
    )
    return ProfileResponse(**dict(row))


@router.get("/{session_id}", response_model=ProfileResponse)
async def get_profile(session_id: str):
    """Retrieve a user profile by session_id."""
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        SELECT session_id, nationality, residency_status, monthly_salary_aed,
               employer_category, preferred_language, transfer_frequency,
               preferred_speed, onboarded
        FROM user_profiles
        WHERE session_id = $1
        """,
        session_id,
    )
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(**dict(row))
