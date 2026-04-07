"""Personalized product insight generator.

Generates "What this means for you" messages for each product based on user profile.
Rule-based engine — no external API dependency. Produces contextual, actionable
insights similar to RupeeLens-style recommendations.

User profile fields used:
    - monthly_salary_aed: Income level
    - nationality: Country code (e.g., "IN", "PK", "PH")
    - residency_status: "resident" | "non_resident"
    - employer_category: "government" | "listed_company" | "private" | "any"
    - transfer_frequency: "weekly" | "monthly" | "quarterly" | "rarely"
"""

import re
from typing import Optional


# ── Nationality display names ───────────────────────────────────────────────
NATIONALITY_NAMES = {
    "IN": "Indian", "PK": "Pakistani", "PH": "Filipino", "BD": "Bangladeshi",
    "EG": "Egyptian", "LK": "Sri Lankan", "NP": "Nepali", "JO": "Jordanian",
    "LB": "Lebanese", "AE": "Emirati", "GB": "British", "US": "American",
    "CA": "Canadian", "AU": "Australian", "SA": "Saudi",
}

# ── Salary tier thresholds ──────────────────────────────────────────────────
SALARY_LOW = 5000
SALARY_MID = 15000
SALARY_HIGH = 30000
SALARY_PREMIUM = 50000


def _salary_tier(salary: Optional[float]) -> str:
    if salary is None:
        return "unknown"
    if salary < SALARY_LOW:
        return "entry"
    if salary < SALARY_MID:
        return "mid"
    if salary < SALARY_HIGH:
        return "high"
    if salary < SALARY_PREMIUM:
        return "premium"
    return "ultra_premium"


def _format_aed(amount) -> str:
    """Format number as AED currency."""
    try:
        num = float(str(amount).replace(",", "").replace("AED", "").strip())
        if num >= 1000:
            return f"AED {num:,.0f}"
        return f"AED {num:.0f}"
    except (ValueError, TypeError):
        return str(amount)


def _extract_numeric(value) -> Optional[float]:
    """Extract numeric value from a string like 'AED 500' or '3.99%'."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        match = re.search(r"[\d,.]+", value.replace(",", ""))
        if match:
            try:
                return float(match.group())
            except ValueError:
                pass
    return None


def generate_insight(
    product: dict,
    features: dict,
    category: str,
    salary: Optional[float] = None,
    nationality: str = "IN",
    residency_status: str = "resident",
    employer_category: Optional[str] = None,
    transfer_frequency: Optional[str] = None,
) -> str:
    """Generate a personalized insight message for a product.

    Returns a 1-3 sentence insight explaining what the product means
    for this specific user profile.
    """
    tier = _salary_tier(salary)
    nat_name = NATIONALITY_NAMES.get(nationality, "expat")

    if category == "credit_card":
        return _credit_card_insight(product, features, salary, tier, nat_name, employer_category)
    elif category == "personal_loan":
        return _personal_loan_insight(product, features, salary, tier, nat_name, employer_category)
    elif category == "islamic_finance":
        return _islamic_finance_insight(product, features, salary, tier, nat_name, employer_category)
    elif category in ("car_insurance", "health_insurance"):
        return _insurance_insight(product, features, category, salary, tier, nat_name)
    elif category == "remittance":
        return _remittance_insight(product, features, salary, nationality, nat_name, transfer_frequency)
    else:
        return _generic_insight(product, features, salary, tier)


# ── Credit Card Insights ────────────────────────────────────────────────────

def _credit_card_insight(
    product: dict, features: dict, salary: Optional[float],
    tier: str, nat_name: str, employer_category: Optional[str],
) -> str:
    parts = []
    product_name = product.get("product_name", "This card")

    annual_fee = _extract_numeric(features.get("annual_fee"))
    min_salary = _extract_numeric(features.get("min_salary"))
    cashback = features.get("cashback_rate") or features.get("cashback")
    rewards = features.get("rewards_program") or features.get("reward_points")
    lounge = features.get("airport_lounge") or features.get("lounge_access")
    interest_rate = _extract_numeric(features.get("interest_rate_retail"))

    # Eligibility check
    if salary and min_salary:
        if salary >= min_salary:
            margin = salary - min_salary
            if margin > min_salary * 0.5:
                parts.append(f"You comfortably qualify with your salary — the minimum is {_format_aed(min_salary)}.")
            else:
                parts.append(f"You meet the minimum salary requirement of {_format_aed(min_salary)}.")
        else:
            shortfall = min_salary - salary
            parts.append(
                f"This card requires a minimum salary of {_format_aed(min_salary)}, "
                f"which is {_format_aed(shortfall)} above your current income. "
                f"Consider cards with lower salary requirements."
            )
            return " ".join(parts)

    # Fee value analysis
    if annual_fee is not None:
        if annual_fee == 0:
            parts.append("No annual fee means you keep all your rewards without paying for the privilege.")
        elif annual_fee <= 300:
            parts.append(f"The {_format_aed(annual_fee)} annual fee is competitive for this tier of card.")
        elif annual_fee <= 700:
            if tier in ("high", "premium", "ultra_premium"):
                parts.append(f"At {_format_aed(annual_fee)}/year, the fee is reasonable given the premium benefits included.")
            else:
                parts.append(
                    f"The {_format_aed(annual_fee)} annual fee is significant — "
                    f"make sure you'll use enough benefits to justify the cost."
                )
        else:
            if tier in ("premium", "ultra_premium"):
                parts.append(f"The {_format_aed(annual_fee)} annual fee reflects the premium positioning, but check if fee waivers apply with minimum spend.")
            else:
                parts.append(
                    f"At {_format_aed(annual_fee)}/year, this is a premium card. "
                    f"Consider whether the benefits match your spending patterns."
                )

    # Cashback/rewards value
    if cashback:
        cashback_val = _extract_numeric(cashback)
        if cashback_val and salary:
            # Estimate monthly cashback assuming 40% of salary spent on card
            est_spend = salary * 0.4
            est_monthly_cashback = est_spend * cashback_val / 100
            if est_monthly_cashback > 50:
                parts.append(
                    f"With typical spending, you could earn around {_format_aed(est_monthly_cashback)} "
                    f"cashback monthly at the {cashback_val}% rate."
                )

    # Lounge access for frequent travelers
    if lounge and str(lounge).lower() not in ("no", "false", "0", "none"):
        parts.append("The complimentary airport lounge access is valuable if you travel frequently.")

    # Interest rate warning for revolvers
    if interest_rate and interest_rate > 30:
        parts.append(
            f"The {interest_rate}% annual interest rate is steep — "
            f"pay your balance in full each month to avoid charges."
        )

    # Employer preference
    if employer_category == "government":
        parts.append("Government employees often qualify for preferential rates and fee waivers with this bank.")

    if not parts:
        parts.append(f"{product_name} is a solid option in its category based on your profile.")

    return " ".join(parts[:3])


# ── Personal Loan Insights ──────────────────────────────────────────────────

def _personal_loan_insight(
    product: dict, features: dict, salary: Optional[float],
    tier: str, nat_name: str, employer_category: Optional[str],
) -> str:
    parts = []

    flat_rate = _extract_numeric(features.get("flat_rate") or features.get("flat_rate_salary_transfer"))
    reducing_rate = _extract_numeric(features.get("reducing_rate") or features.get("reducing_rate_salary_transfer"))
    max_amount = _extract_numeric(features.get("max_loan_amount"))
    processing_fee = _extract_numeric(features.get("processing_fee_pct") or features.get("processing_fee"))
    min_salary = _extract_numeric(features.get("min_salary"))
    max_tenure = _extract_numeric(features.get("max_tenure_months") or features.get("max_tenure"))
    early_settlement = _extract_numeric(features.get("early_settlement_fee_pct") or features.get("early_settlement_fee"))

    # Eligibility
    if salary and min_salary:
        if salary >= min_salary:
            # Estimate max borrowing (rough: salary * DBR * tenure)
            dbr = 0.5  # 50% debt burden ratio
            est_max = salary * dbr * (max_tenure / 12 if max_tenure else 4)
            parts.append(
                f"Based on your salary, you could potentially borrow up to {_format_aed(est_max)} "
                f"(subject to existing obligations and bank assessment)."
            )
        else:
            parts.append(
                f"The minimum salary requirement is {_format_aed(min_salary)}. "
                f"You may need to look at options with lower thresholds."
            )
            return " ".join(parts)

    # Rate analysis
    if flat_rate:
        if salary and salary > 0:
            # Monthly EMI estimate for AED 100k loan over 4 years
            loan_example = 100000
            total_interest = loan_example * flat_rate / 100 * 4
            monthly_emi = (loan_example + total_interest) / 48
            parts.append(
                f"At a {flat_rate}% flat rate, a {_format_aed(loan_example)} loan over 4 years "
                f"would cost roughly {_format_aed(monthly_emi)}/month."
            )

    # Salary transfer benefit
    if employer_category == "government" or employer_category == "listed_company":
        non_salary_rate = _extract_numeric(features.get("flat_rate_non_salary"))
        if flat_rate and non_salary_rate and non_salary_rate > flat_rate:
            saving = non_salary_rate - flat_rate
            parts.append(
                f"Transferring your salary to this bank saves you {saving:.2f}% "
                f"on the interest rate — worth considering for significant loans."
            )

    # Processing fee
    if processing_fee:
        parts.append(f"The {processing_fee}% processing fee is deducted upfront from your loan disbursement.")

    # Early settlement
    if early_settlement and early_settlement > 0:
        parts.append(f"Early settlement carries a {early_settlement}% fee on the outstanding balance.")

    if not parts:
        product_name = product.get("product_name", "This loan")
        parts.append(f"{product_name} offers competitive terms for {nat_name} residents in the UAE.")

    return " ".join(parts[:3])


# ── Islamic Finance Insights ────────────────────────────────────────────────

def _islamic_finance_insight(
    product: dict, features: dict, salary: Optional[float],
    tier: str, nat_name: str, employer_category: Optional[str],
) -> str:
    parts = []

    profit_rate = _extract_numeric(features.get("profit_rate"))
    min_salary = _extract_numeric(features.get("min_salary"))
    structure = features.get("murabaha_structure") or features.get("financing_structure")

    if salary and min_salary:
        if salary >= min_salary:
            parts.append(f"You meet the minimum salary of {_format_aed(min_salary)} for this Sharia-compliant product.")
        else:
            parts.append(f"This requires {_format_aed(min_salary)} minimum salary — consider other Islamic options.")
            return " ".join(parts)

    if profit_rate:
        parts.append(f"The {profit_rate}% profit rate is the bank's margin on this Islamic financing arrangement.")

    if structure and isinstance(structure, str):
        parts.append(f"This is structured as a {structure} arrangement, which is a Sharia-compliant alternative to conventional interest.")

    if not parts:
        parts.append("This Sharia-compliant product follows Islamic banking principles with no interest charges.")

    return " ".join(parts[:3])


# ── Insurance Insights ──────────────────────────────────────────────────────

def _insurance_insight(
    product: dict, features: dict, category: str,
    salary: Optional[float], tier: str, nat_name: str,
) -> str:
    parts = []

    premium = _extract_numeric(features.get("premium_range") or features.get("annual_premium"))
    coverage = features.get("coverage_type")
    deductible = _extract_numeric(features.get("deductible") or features.get("excess_amount"))

    if category == "car_insurance":
        if coverage:
            coverage_str = str(coverage).lower()
            if "comprehensive" in coverage_str:
                parts.append("Comprehensive coverage protects you against theft, damage, and third-party claims.")
            elif "third" in coverage_str:
                parts.append("Third-party only covers damage to others — your own vehicle isn't covered.")

        if premium and salary:
            pct_of_salary = premium / (salary * 12) * 100
            if pct_of_salary < 2:
                parts.append(f"At around {_format_aed(premium)}/year, this is a small fraction of your annual income.")
            else:
                parts.append(f"The estimated premium of {_format_aed(premium)}/year is worth comparing across providers.")

    elif category == "health_insurance":
        network = features.get("network_hospitals") or features.get("network")
        maternity = features.get("maternity_cover")
        dental = features.get("dental_cover")

        if network:
            parts.append(f"This plan covers treatment at {network} network hospitals across the UAE.")
        if maternity and str(maternity).lower() not in ("no", "false", "0"):
            parts.append("Maternity coverage is included, which is important for family planning.")
        if dental and str(dental).lower() not in ("no", "false", "0"):
            parts.append("Dental coverage is included as part of the plan benefits.")

    if deductible:
        parts.append(f"You'll pay {_format_aed(deductible)} as a deductible per claim before coverage kicks in.")

    if not parts:
        parts.append("Compare coverage limits and exclusions carefully before choosing this plan.")

    return " ".join(parts[:3])


# ── Remittance Insights ─────────────────────────────────────────────────────

def _remittance_insight(
    product: dict, features: dict, salary: Optional[float],
    nationality: str, nat_name: str, transfer_frequency: Optional[str],
) -> str:
    parts = []

    transfer_fee = _extract_numeric(features.get("transfer_fee") or features.get("transfer_fee_aed"))
    fx_markup = _extract_numeric(features.get("fx_markup") or features.get("exchange_rate_margin"))
    delivery_time = features.get("processing_time") or features.get("delivery_time")
    corridors = features.get("corridors") or features.get("supported_countries")

    # Corridor relevance
    corridor_relevant = False
    if corridors and isinstance(corridors, str):
        country_map = {"IN": "india", "PK": "pakistan", "PH": "philippines", "BD": "bangladesh", "EG": "egypt", "LK": "sri lanka", "NP": "nepal"}
        country_name = country_map.get(nationality, "").lower()
        if country_name and country_name in corridors.lower():
            corridor_relevant = True
            parts.append(f"This provider supports transfers to {country_name.title()}, your home country.")

    # Cost analysis for typical transfer
    if salary and transfer_fee is not None:
        typical_transfer = salary * 0.3  # Assume 30% of salary sent home
        if transfer_fee > 0:
            cost_pct = transfer_fee / typical_transfer * 100
            parts.append(
                f"For a typical {_format_aed(typical_transfer)} transfer, "
                f"the {_format_aed(transfer_fee)} fee is {cost_pct:.1f}% of the amount."
            )
        else:
            parts.append(f"Zero transfer fee on a {_format_aed(typical_transfer)} send is excellent value.")

    # FX markup
    if fx_markup:
        parts.append(f"The {fx_markup}% exchange rate margin is applied on top of the mid-market rate.")

    # Speed
    if delivery_time:
        parts.append(f"Transfers typically arrive in {delivery_time}.")

    # Frequency tip
    if transfer_frequency == "weekly":
        if transfer_fee and transfer_fee > 0:
            monthly_fees = transfer_fee * 4
            parts.append(
                f"Sending weekly means ~{_format_aed(monthly_fees)}/month in fees — "
                f"consider batching into monthly transfers to save."
            )

    if not parts:
        parts.append(f"Compare exchange rates and fees carefully for your {nat_name} corridor.")

    return " ".join(parts[:3])


# ── Generic Insight ─────────────────────────────────────────────────────────

def _generic_insight(
    product: dict, features: dict, salary: Optional[float], tier: str,
) -> str:
    product_name = product.get("product_name", "This product")
    provider = product.get("provider_name", "this provider")

    if tier in ("premium", "ultra_premium"):
        return f"{product_name} from {provider} is positioned for high-income professionals. Review the full terms to see if the premium features match your needs."
    elif tier in ("entry", "mid"):
        return f"{product_name} from {provider} is worth considering at your income level. Pay close attention to fees and eligibility requirements."
    else:
        return f"{product_name} from {provider} — review features and compare with alternatives to find the best fit for your profile."
