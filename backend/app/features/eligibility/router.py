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
    probability: float = 1.0  # 0.0 to 1.0
    reasons: list[str]
    match_level: str  # "eligible", "likely_eligible", "possible", "not_eligible"


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
    """Check eligibility with probabilistic scoring. Returns (eligible, probability, reasons, match_level)."""
    probability = 1.0
    issues = []
    warnings = []

    # Salary check — probabilistic
    if min_salary and salary_aed < min_salary:
        ratio = salary_aed / min_salary if min_salary > 0 else 0
        if ratio >= 0.9:
            probability *= 0.7
            warnings.append(f"You're close to the minimum salary of AED {min_salary:,.0f} — worth applying")
        elif ratio >= 0.8:
            probability *= 0.4
            warnings.append(f"Below minimum salary AED {min_salary:,.0f} but some flexibility may exist")
        else:
            probability *= 0.1
            issues.append(f"Minimum salary AED {min_salary:,.0f} required (yours: AED {salary_aed:,.0f})")

    # Nationality check
    if nationality_restrictions and len(nationality_restrictions) > 0:
        nat_upper = [n.upper() for n in nationality_restrictions]
        if nationality.upper() in nat_upper:
            probability *= 0.05
            issues.append(f"Not available for {nationality} nationals")

    # Employer check — probabilistic
    if employer_categories and len(employer_categories) > 0:
        cats = [c.lower() for c in employer_categories]
        if 'any' not in cats and employer_type.lower() not in cats:
            # Private sector often accepted even when not listed
            if employer_type.lower() == 'private' and ('listed_company' in cats or 'government' in cats):
                probability *= 0.6
                warnings.append(f"Primarily for {', '.join(employer_categories)} — private sector may be considered")
            else:
                probability *= 0.2
                issues.append(f"Requires employer type: {', '.join(employer_categories)}")

    # Residency check
    if residency_required and residency_status == 'non_resident':
        probability *= 0.1
        issues.append("UAE residency required")

    # Extra eligibility criteria
    if eligibility_criteria:
        min_credit = eligibility_criteria.get("min_credit_score")
        if min_credit:
            probability *= 0.85
            warnings.append(f"May require minimum credit score of {min_credit}")

        max_dti = eligibility_criteria.get("max_dti_ratio")
        if max_dti:
            probability *= 0.9
            warnings.append(f"Debt-to-income ratio must be below {max_dti}")

        min_tenure = eligibility_criteria.get("min_uae_tenure_months")
        if min_tenure:
            probability *= 0.85
            warnings.append(f"Requires {min_tenure} months minimum UAE residency")

    # Determine match level based on probability
    probability = round(probability, 4)
    eligible = probability >= 0.5

    if probability >= 0.8:
        match_level = "eligible"
        if not issues and not warnings:
            warnings.append("You meet all eligibility criteria")
    elif probability >= 0.5:
        match_level = "likely_eligible"
    elif probability >= 0.3:
        match_level = "possible"
    else:
        match_level = "not_eligible"

    all_reasons = issues + warnings if issues or warnings else ["You meet all eligibility criteria"]
    return eligible, probability, all_reasons, match_level


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
        eligible, probability, reasons, match_level = check_product_eligibility(
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
            probability=probability,
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

    eligible, probability, reasons, match_level = check_product_eligibility(
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
        probability=probability,
        reasons=reasons,
        match_level=match_level,
    )
