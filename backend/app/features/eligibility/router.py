"""Product eligibility checker."""

import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.db.connection import get_pool


class EligibilityRequest(BaseModel):
    salary_aed: float
    nationality: str = "IN"
    employer_type: str = "private"  # government, listed_company, private, self_employed, any
    residency_status: str = "resident"  # resident, non_resident, citizen


class ProductEligibility(BaseModel):
    product_id: str
    product_name: str
    provider_name: str
    eligible: bool
    reasons: list[str]
    match_level: str  # "eligible", "likely_eligible", "not_eligible"


class EligibilityResponse(BaseModel):
    results: list[ProductEligibility]


router = APIRouter()


def _parse_jsonb(raw) -> dict:
    if raw is None:
        return {}
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            return {}
    return {}


def _parse_array(raw) -> list:
    if raw is None:
        return []
    if isinstance(raw, list):
        return raw
    return []


def check_product_eligibility(
    salary_aed: float,
    nationality: str,
    employer_type: str,
    residency_status: str,
    min_salary: float | None,
    nationality_restrictions: list,
    employer_categories: list,
    residency_required: bool,
    eligibility_criteria: dict,
) -> tuple[bool, list[str], str]:
    """Check if a user is eligible for a product. Returns (eligible, reasons, match_level)."""
    issues = []
    warnings = []

    # Salary check
    if min_salary and salary_aed < min_salary:
        issues.append(f"Minimum salary AED {min_salary:,.0f} required (yours: AED {salary_aed:,.0f})")

    # Nationality check
    if nationality_restrictions and len(nationality_restrictions) > 0:
        # If restrictions are a blacklist style
        nat_upper = [n.upper() for n in nationality_restrictions]
        if nationality.upper() in nat_upper:
            issues.append(f"Not available for {nationality} nationals")

    # Employer check
    if employer_categories and len(employer_categories) > 0:
        cats = [c.lower() for c in employer_categories]
        if 'any' not in cats and employer_type.lower() not in cats:
            issues.append(f"Requires employer type: {', '.join(employer_categories)}")

    # Residency check
    if residency_required and residency_status == 'non_resident':
        issues.append("UAE residency required")

    # Extra eligibility criteria
    if eligibility_criteria:
        min_credit = eligibility_criteria.get("min_credit_score")
        if min_credit:
            warnings.append(f"May require minimum credit score of {min_credit}")

        max_dti = eligibility_criteria.get("max_dti_ratio")
        if max_dti:
            warnings.append(f"Debt-to-income ratio must be below {max_dti}")

        min_tenure = eligibility_criteria.get("min_uae_tenure_months")
        if min_tenure:
            warnings.append(f"Requires {min_tenure} months minimum UAE residency")

    if issues:
        return False, issues, "not_eligible"
    elif warnings:
        return True, warnings, "likely_eligible"
    else:
        return True, ["You meet all eligibility criteria"], "eligible"


@router.post("/check", response_model=EligibilityResponse)
async def check_eligibility(request: EligibilityRequest):
    """Check eligibility across all active products."""
    pool = await get_pool()

    rows = await pool.fetch(
        """
        SELECT p.id, p.name_en, pr.name_en as provider_name,
               p.min_salary_aed, p.nationality_restrictions, p.employer_categories,
               p.residency_required, p.eligibility_criteria
        FROM products p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE p.active = true
        ORDER BY p.category, pr.name_en
        """
    )

    results = []
    for row in rows:
        eligible, reasons, match_level = check_product_eligibility(
            salary_aed=request.salary_aed,
            nationality=request.nationality,
            employer_type=request.employer_type,
            residency_status=request.residency_status,
            min_salary=float(row["min_salary_aed"]) if row["min_salary_aed"] else None,
            nationality_restrictions=_parse_array(row["nationality_restrictions"]),
            employer_categories=_parse_array(row["employer_categories"]),
            residency_required=row["residency_required"] if row["residency_required"] is not None else True,
            eligibility_criteria=_parse_jsonb(row["eligibility_criteria"]),
        )
        results.append(ProductEligibility(
            product_id=str(row["id"]),
            product_name=row["name_en"],
            provider_name=row["provider_name"],
            eligible=eligible,
            reasons=reasons,
            match_level=match_level,
        ))

    return EligibilityResponse(results=results)


@router.post("/check/{product_id}", response_model=ProductEligibility)
async def check_single_eligibility(product_id: str, request: EligibilityRequest):
    """Check eligibility for a single product."""
    pool = await get_pool()

    row = await pool.fetchrow(
        """
        SELECT p.id, p.name_en, pr.name_en as provider_name,
               p.min_salary_aed, p.nationality_restrictions, p.employer_categories,
               p.residency_required, p.eligibility_criteria
        FROM products p
        JOIN providers pr ON p.provider_id = pr.id
        WHERE p.id = $1
        """,
        product_id,
    )

    if not row:
        return ProductEligibility(
            product_id=product_id,
            product_name="Unknown",
            provider_name="Unknown",
            eligible=False,
            reasons=["Product not found"],
            match_level="not_eligible",
        )

    eligible, reasons, match_level = check_product_eligibility(
        salary_aed=request.salary_aed,
        nationality=request.nationality,
        employer_type=request.employer_type,
        residency_status=request.residency_status,
        min_salary=float(row["min_salary_aed"]) if row["min_salary_aed"] else None,
        nationality_restrictions=_parse_array(row["nationality_restrictions"]),
        employer_categories=_parse_array(row["employer_categories"]),
        residency_required=row["residency_required"] if row["residency_required"] is not None else True,
        eligibility_criteria=_parse_jsonb(row["eligibility_criteria"]),
    )

    return ProductEligibility(
        product_id=str(row["id"]),
        product_name=row["name_en"],
        provider_name=row["provider_name"],
        eligible=eligible,
        reasons=reasons,
        match_level=match_level,
    )
