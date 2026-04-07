"""Generic data extractors for PDF content.

Category-specific extraction functions that work across banks.
Each function takes text + tables from parsed PDFs and returns structured data.
"""

import re
import logging
from typing import Optional

logger = logging.getLogger("scrapers.pdf.extractor")


# ── Utility Helpers ─────────────────────────────────────────────

def extract_rate(text: str, pattern: str) -> Optional[float]:
    """Extract a percentage rate from text using a regex pattern.

    The pattern should have a capture group for the number.
    """
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1).replace(",", ""))
        except (ValueError, IndexError):
            pass
    return None


def extract_amount(text: str, pattern: str) -> Optional[float]:
    """Extract a monetary amount from text using a regex pattern.

    Handles comma-separated numbers and 'million' suffix.
    """
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        try:
            val = float(match.group(1).replace(",", ""))
            # Check for 'million' near the match
            context = text[match.start():match.end() + 20]
            if "million" in context.lower():
                val *= 1_000_000
            return val
        except (ValueError, IndexError):
            pass
    return None


def extract_field(text: str, pattern: str) -> Optional[str]:
    """Extract a text field using regex. Returns first capture group."""
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None


def extract_boolean(text: str, positive_keywords: list[str], negative_keywords: list[str] = None) -> Optional[bool]:
    """Check if text contains positive/negative keywords for a boolean field."""
    text_lower = text.lower()
    if any(kw.lower() in text_lower for kw in positive_keywords):
        return True
    if negative_keywords and any(kw.lower() in text_lower for kw in negative_keywords):
        return False
    return None


def extract_fee_from_table(table: list[list[str]], fee_name: str) -> Optional[str]:
    """Search a table for a fee by name and return its value."""
    fee_lower = fee_name.lower()
    for row in table:
        if len(row) >= 2:
            if fee_lower in row[0].lower():
                return row[1].strip() if row[1] else None
    return None


# ── Credit Card Extraction ──────────────────────────────────────

def extract_credit_card_data(text: str, tables: list[list[list[str]]]) -> dict:
    """Extract credit card features from KFS/SOC PDF content.

    Returns dict of key_features for a credit card product.
    """
    features = {}

    # Annual fee
    annual_fee = extract_field(text, r"annual\s*(?:card\s*)?fee[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if annual_fee:
        features["annual_fee"] = f"AED {annual_fee}"
    elif re.search(r"(?:no|zero|nil|waived)\s*annual\s*fee", text, re.I):
        features["annual_fee"] = "AED 0"

    # Supplementary card fee
    supp_fee = extract_field(text, r"supplementary\s*(?:card\s*)?fee[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if supp_fee:
        features["supplementary_card_fee"] = f"AED {supp_fee}"

    # Interest rates
    retail_rate = extract_rate(text, r"(?:retail|purchase)\s*(?:interest|rate)[:\s]*(\d+(?:\.\d+)?)\s*%")
    if retail_rate:
        features["interest_rate_retail"] = f"{retail_rate}%"

    cash_rate = extract_rate(text, r"cash\s*(?:advance|withdrawal)\s*(?:interest|rate)[:\s]*(\d+(?:\.\d+)?)\s*%")
    if cash_rate:
        features["interest_rate_cash"] = f"{cash_rate}%"

    # Fees
    cash_adv_fee = extract_field(text, r"cash\s*advance\s*fee[:\s]*([\d,]+(?:\.\d+)?%?(?:\s*or\s*(?:aed\s*)?[\d,]+)?)")
    if cash_adv_fee:
        features["cash_advance_fee"] = cash_adv_fee

    late_fee = extract_field(text, r"late\s*payment\s*(?:charge|fee)[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if late_fee:
        features["late_payment_fee"] = f"AED {late_fee}"

    overlimit_fee = extract_field(text, r"over[\s-]*limit\s*(?:charge|fee)[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if overlimit_fee:
        features["overlimit_fee"] = f"AED {overlimit_fee}"

    fx_markup = extract_rate(text, r"(?:foreign|fx|cross[\s-]*border)\s*(?:currency|transaction|exchange)\s*(?:markup|fee|charge)[:\s]*(\d+(?:\.\d+)?)\s*%")
    if fx_markup:
        features["fx_markup"] = f"{fx_markup}%"

    # Minimum payment
    min_pay = extract_rate(text, r"minimum\s*(?:monthly\s*)?payment[:\s]*(\d+(?:\.\d+)?)\s*%")
    if min_pay:
        features["min_payment_pct"] = f"{min_pay}%"

    # Interest-free period
    ifd = extract_field(text, r"(?:interest[\s-]*free|grace)\s*(?:period|days)[:\s]*(?:up\s*to\s*)?(\d+)\s*days")
    if ifd:
        features["interest_free_days"] = f"{ifd} days"

    # Balance transfer fee
    bt_fee = extract_field(text, r"balance\s*transfer\s*(?:fee|charge)[:\s]*([\d,]+(?:\.\d+)?%?)")
    if bt_fee:
        features["balance_transfer_fee"] = bt_fee

    # Other fees from tables
    for table in tables:
        for row in table:
            if len(row) >= 2:
                label = row[0].lower()
                value = row[1].strip() if row[1] else ""
                if not value:
                    continue
                if "replacement" in label and "card" in label:
                    features["replacement_card_fee"] = value
                elif "statement" in label and "copy" in label:
                    features["statement_copy_fee"] = value
                elif "sms" in label and "alert" in label:
                    features["sms_alert_fee"] = value
                elif "salary" in label and ("min" in label or "requirement" in label):
                    features["min_salary_requirement"] = value

    return features


# ── Personal Loan Extraction ────────────────────────────────────

def extract_personal_loan_data(text: str, tables: list[list[list[str]]]) -> dict:
    """Extract personal loan features from KFS PDF content."""
    features = {}

    # Interest rates
    flat_st = extract_rate(text, r"(?:flat\s*rate|fixed\s*rate)\s*(?:\(?\s*(?:with\s*)?salary\s*transfer\s*\)?\s*)?[:\s]*(\d+(?:\.\d+)?)\s*%")
    if flat_st:
        features["flat_rate_salary_transfer"] = f"{flat_st}%"

    flat_nst = extract_rate(text, r"(?:flat\s*rate|fixed\s*rate)\s*\(?\s*(?:without|non[\s-]?)salary\s*transfer\s*\)?\s*[:\s]*(\d+(?:\.\d+)?)\s*%")
    if flat_nst:
        features["flat_rate_non_salary"] = f"{flat_nst}%"

    reducing = extract_rate(text, r"reducing\s*(?:balance\s*)?rate[:\s]*(\d+(?:\.\d+)?)\s*%")
    if reducing:
        features["reducing_rate"] = f"{reducing}%"

    # Processing fee
    proc_fee = extract_field(text, r"processing\s*fee[:\s]*([\d,]+(?:\.\d+)?%?(?:\s*(?:of|on)\s*[^.\n]+)?)")
    if proc_fee:
        features["processing_fee"] = proc_fee

    # Early settlement
    early = extract_field(text, r"early\s*(?:settlement|closure)\s*(?:fee|charge|penalty)[:\s]*([\d,]+(?:\.\d+)?%?[^\n.]*)")
    if early:
        features["early_settlement_fee"] = early.strip()

    # Partial settlement
    partial = extract_field(text, r"partial\s*(?:settlement|prepayment)\s*(?:fee|charge)[:\s]*([\d,]+(?:\.\d+)?%?[^\n.]*)")
    if partial:
        features["partial_settlement_fee"] = partial.strip()

    # Late payment
    late_fee = extract_field(text, r"late\s*payment\s*(?:charge|fee|penalty)[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if late_fee:
        features["late_payment_fee"] = f"AED {late_fee}"

    # Insurance
    ins_fee = extract_field(text, r"(?:life\s*)?insurance\s*(?:fee|premium|charge)[:\s]*([\d,]+(?:\.\d+)?%?[^\n.]*)")
    if ins_fee:
        features["insurance_fee"] = ins_fee.strip()

    # Salary
    min_sal = extract_amount(text, r"(?:minimum|min)\s*(?:monthly\s*)?salary[:\s]*(?:aed\s*)?([\d,]+)")
    if min_sal:
        features["min_salary"] = f"AED {int(min_sal):,}"

    # Loan amounts
    max_loan = extract_amount(text, r"(?:maximum|max)\s*(?:loan|finance)\s*amount[:\s]*(?:aed\s*)?([\d,]+)")
    if max_loan:
        features["max_loan_amount"] = f"AED {int(max_loan):,}"

    # Tenure
    min_t = extract_field(text, r"(?:minimum|min)\s*(?:loan\s*)?tenure[:\s]*(\d+)\s*months?")
    if min_t:
        features["min_tenure"] = f"{min_t} months"

    max_t = extract_field(text, r"(?:maximum|max)\s*(?:loan\s*)?tenure[:\s]*(\d+)\s*months?")
    if max_t:
        features["max_tenure"] = f"{max_t} months"

    # DBR
    dbr = extract_rate(text, r"(?:dbr|debt\s*burden\s*ratio)[:\s]*(\d+(?:\.\d+)?)\s*%")
    if dbr:
        features["dbr"] = f"{dbr}%"

    # Cheque bounce
    cheque = extract_field(text, r"(?:cheque|check)\s*(?:bounce|return)\s*(?:fee|charge)[:\s]*(?:aed\s*)?([\d,]+)")
    if cheque:
        features["cheque_bounce_fee"] = f"AED {cheque}"

    return features


# ── Islamic Finance Extraction ──────────────────────────────────

def extract_islamic_finance_data(text: str, tables: list[list[list[str]]]) -> dict:
    """Extract Islamic finance features from KFS PDF content."""
    features = {}

    # Profit rate
    profit = extract_rate(text, r"(?:profit|murabaha)\s*rate[:\s]*(\d+(?:\.\d+)?)\s*%")
    if profit:
        features["profit_rate"] = f"{profit}%"

    # Structure type
    if re.search(r"murabaha", text, re.I):
        features["structure"] = "Murabaha"
    elif re.search(r"ijara|ijarah", text, re.I):
        features["structure"] = "Ijarah"
    elif re.search(r"musharaka", text, re.I):
        features["structure"] = "Diminishing Musharaka"
    elif re.search(r"tawarruq", text, re.I):
        features["structure"] = "Tawarruq"

    # Takaful fee
    takaful = extract_field(text, r"takaful\s*(?:fee|premium|charge)[:\s]*([\d,]+(?:\.\d+)?%?[^\n.]*)")
    if takaful:
        features["takaful_fee"] = takaful.strip()

    # Processing fee
    proc = extract_field(text, r"processing\s*(?:fee|charge)[:\s]*([\d,]+(?:\.\d+)?%?[^\n.]*)")
    if proc:
        features["processing_fee"] = proc.strip()

    # Early settlement
    early = extract_field(text, r"early\s*(?:settlement|closure)\s*(?:fee|charge)[:\s]*([\d,]+(?:\.\d+)?%?[^\n.]*)")
    if early:
        features["early_settlement_fee"] = early.strip()

    # Max financing
    max_fin = extract_amount(text, r"(?:maximum|max)\s*(?:financing|finance)\s*(?:amount|limit)[:\s]*(?:aed\s*)?([\d,]+)")
    if max_fin:
        features["max_financing_amount"] = f"AED {int(max_fin):,}"

    # Sharia compliance
    features["sharia_compliant"] = True
    if re.search(r"(?:fatwa|sharia\s*board|sharia\s*(?:supervisory|advisory))", text, re.I):
        features["sharia_board_approved"] = True

    return features


# ── Insurance Extraction ────────────────────────────────────────

def extract_insurance_data(text: str, tables: list[list[list[str]]]) -> dict:
    """Extract insurance product features from policy/brochure PDFs."""
    features = {}

    # Coverage type
    if re.search(r"comprehensive", text, re.I):
        features["coverage_type"] = "comprehensive"
    elif re.search(r"third[\s-]*party", text, re.I):
        features["coverage_type"] = "third_party"

    # Premium
    premium = extract_field(text, r"(?:annual\s*)?premium[:\s]*(?:from\s*)?(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if premium:
        features["premium_from_aed"] = f"AED {premium}"

    # Deductible
    deductible = extract_field(text, r"(?:deductible|excess)[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if deductible:
        features["deductible_aed"] = f"AED {deductible}"

    # Coverage limits
    limit_match = extract_amount(text, r"(?:coverage|sum\s*insured)\s*(?:limit|up\s*to)[:\s]*(?:aed\s*)?([\d,]+)")
    if limit_match:
        features["coverage_limit_aed"] = f"AED {int(limit_match):,}"

    # Geographical coverage
    geo = extract_field(text, r"(?:geographical|geographic)\s*(?:coverage|scope)[:\s]*([^\n.]+)")
    if geo:
        features["geographical_coverage"] = geo.strip()

    # Waiting period
    waiting = extract_field(text, r"waiting\s*period[:\s]*(\d+\s*(?:days?|months?|weeks?))")
    if waiting:
        features["waiting_period"] = waiting

    # Health-specific
    if re.search(r"maternity", text, re.I):
        features["maternity_cover"] = True
    if re.search(r"dental", text, re.I):
        features["dental_cover"] = True
    if re.search(r"optical|vision", text, re.I):
        features["optical_cover"] = True
    if re.search(r"pre[\s-]*existing\s*conditions?\s*(?:are\s*)?covered", text, re.I):
        features["pre_existing_conditions"] = "covered"
    elif re.search(r"pre[\s-]*existing\s*conditions?\s*(?:are\s*)?(?:not|excluded)", text, re.I):
        features["pre_existing_conditions"] = "excluded"

    # Network
    network = extract_field(text, r"(?:hospital|provider)\s*network[:\s]*([^\n.]+)")
    if network:
        features["network"] = network.strip()

    return features


# ── Fee Schedule Extraction (Exchange Houses) ───────────────────

def extract_fee_schedule(text: str, tables: list[list[list[str]]]) -> dict:
    """Extract fee schedule data from exchange house PDFs."""
    features = {}

    # Transfer fees
    fee_match = extract_field(text, r"transfer\s*fee[:\s]*(?:aed\s*)?([\d,]+(?:\.\d+)?)")
    if fee_match:
        features["transfer_fee_aed"] = f"AED {fee_match}"

    # Min/max transfer
    min_t = extract_amount(text, r"(?:minimum|min)\s*(?:transfer|remittance)\s*(?:amount)?[:\s]*(?:aed\s*)?([\d,]+)")
    if min_t:
        features["min_transfer_aed"] = f"AED {int(min_t):,}"

    max_t = extract_amount(text, r"(?:maximum|max)\s*(?:transfer|remittance)\s*(?:amount)?[:\s]*(?:aed\s*)?([\d,]+)")
    if max_t:
        features["max_transfer_aed"] = f"AED {int(max_t):,}"

    # Delivery options
    delivery = []
    if re.search(r"bank\s*(?:transfer|deposit|account)", text, re.I):
        delivery.append("bank_transfer")
    if re.search(r"cash\s*(?:pickup|collection|payout)", text, re.I):
        delivery.append("cash_pickup")
    if re.search(r"mobile\s*(?:wallet|money)", text, re.I):
        delivery.append("mobile_wallet")
    if delivery:
        features["delivery_options"] = delivery

    # Processing time
    speed = extract_field(text, r"(?:processing|delivery|transfer)\s*(?:time|speed|duration)[:\s]*([^\n.]+)")
    if speed:
        features["processing_time"] = speed.strip()

    # Fee tables by corridor
    corridor_fees = {}
    for table in tables:
        for row in table:
            if len(row) >= 3:
                country = row[0].strip()
                if country and re.match(r"^[A-Z]", country):
                    try:
                        fee = row[-1].strip()
                        if fee and re.match(r"[\d,.]+", fee):
                            corridor_fees[country] = f"AED {fee}"
                    except (IndexError, ValueError):
                        pass
    if corridor_fees:
        features["corridor_fees"] = corridor_fees

    return features
