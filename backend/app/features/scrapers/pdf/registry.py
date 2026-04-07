"""PDF URL registry for all financial institution documents.

Centralized registry mapping provider keys to their official PDF documents.
Each entry specifies:
    - url: Direct download URL for the PDF
    - category: Product category (credit_card, personal_loan, etc.)
    - doc_type: Document type (kfs, soc, brochure, fee_schedule, policy, rate_card)
    - name: Human-readable document name

URLs point to official bank/institution websites for KFS (Key Fact Statements),
SOC (Schedule of Charges), policy wordings, and fee schedules.
"""

PDF_REGISTRY: dict[str, list[dict]] = {
    # ================================================================
    # TIER 1: Banks with existing HTML scrapers (9 banks)
    # ================================================================

    "emirates_nbd": [
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/pdfs/personal/cards/credit-cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ENBD Credit Cards KFS",
        },
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/pdfs/personal/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "ENBD Personal Loans KFS",
        },
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/pdfs/personal/schedule-of-charges.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ENBD Schedule of Charges",
        },
    ],

    "fab": [
        {
            "url": "https://www.bankfab.com/-/media/fab/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "FAB Credit Cards KFS",
        },
        {
            "url": "https://www.bankfab.com/-/media/fab/pdfs/personal/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "FAB Personal Loans KFS",
        },
        {
            "url": "https://www.bankfab.com/-/media/fab/pdfs/fees-and-charges.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "FAB Fees & Charges",
        },
    ],

    "adcb": [
        {
            "url": "https://www.adcb.com/-/media/project/adcb/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ADCB Credit Cards KFS",
        },
        {
            "url": "https://www.adcb.com/-/media/project/adcb/pdfs/personal/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "ADCB Personal Loans KFS",
        },
        {
            "url": "https://www.adcb.com/-/media/project/adcb/pdfs/schedule-of-charges.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ADCB Schedule of Charges",
        },
    ],

    "mashreq": [
        {
            "url": "https://www.mashreqbank.com/-/media/mashreq/pdfs/personal/cards/kfs-credit-cards.ashx",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Mashreq Credit Cards KFS",
        },
        {
            "url": "https://www.mashreqbank.com/-/media/mashreq/pdfs/personal/loans/kfs-personal-loans.ashx",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "Mashreq Personal Loans KFS",
        },
        {
            "url": "https://www.mashreqbank.com/-/media/mashreq/pdfs/schedule-of-charges.ashx",
            "category": "all",
            "doc_type": "soc",
            "name": "Mashreq Schedule of Charges",
        },
    ],

    "rakbank": [
        {
            "url": "https://www.rakbank.ae/-/media/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "RAKBANK Credit Cards KFS",
        },
        {
            "url": "https://www.rakbank.ae/-/media/pdfs/personal/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "RAKBANK Personal Loans KFS",
        },
        {
            "url": "https://www.rakbank.ae/-/media/pdfs/savings-and-protection-guide.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "RAKBANK S&P Guide",
        },
    ],

    "dib": [
        {
            "url": "https://www.dib.ae/-/media/dib/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "DIB Credit Cards KFS",
        },
        {
            "url": "https://www.dib.ae/-/media/dib/pdfs/personal/financing/kfs-personal-finance.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "DIB Personal Finance KFS",
        },
        {
            "url": "https://www.dib.ae/-/media/dib/pdfs/product-brochure.pdf",
            "category": "all",
            "doc_type": "brochure",
            "name": "DIB Product Brochure",
        },
    ],

    "adib": [
        {
            "url": "https://www.adib.ae/-/media/adib/pdfs/personal/cards/kfs-covered-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ADIB Covered Cards KFS",
        },
        {
            "url": "https://www.adib.ae/-/media/adib/pdfs/personal/financing/kfs-personal-finance.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "ADIB Personal Finance KFS",
        },
        {
            "url": "https://www.adib.ae/-/media/adib/pdfs/fee-schedule.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ADIB Fee Schedule",
        },
    ],

    "hsbc": [
        {
            "url": "https://www.hsbc.ae/-/media/hsbc-ae/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "HSBC Credit Cards KFS",
        },
        {
            "url": "https://www.hsbc.ae/-/media/hsbc-ae/pdfs/personal/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "HSBC Personal Loans KFS",
        },
        {
            "url": "https://www.hsbc.ae/-/media/hsbc-ae/pdfs/terms-and-conditions.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "HSBC Terms & Conditions",
        },
    ],

    "standard_chartered": [
        {
            "url": "https://www.sc.com/ae/-/media/files/ae/pdfs/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "StanChart Credit Cards KFS",
        },
        {
            "url": "https://www.sc.com/ae/-/media/files/ae/pdfs/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "StanChart Personal Loans KFS",
        },
        {
            "url": "https://www.sc.com/ae/-/media/files/ae/pdfs/schedule-of-charges.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "StanChart Schedule of Charges",
        },
    ],

    # ================================================================
    # TIER 2: Banks WITHOUT existing scrapers (7 banks)
    # ================================================================

    "emirates_islamic": [
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Emirates Islamic Credit Cards KFS",
        },
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/personal/financing/kfs-personal-finance.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "Emirates Islamic Personal Finance KFS",
        },
    ],

    "citibank": [
        {
            "url": "https://www.citibank.ae/-/media/citibank-ae/pdfs/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Citibank Credit Cards KFS",
        },
        {
            "url": "https://www.citibank.ae/-/media/citibank-ae/pdfs/fee-schedule.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "Citibank Fee Schedule",
        },
    ],

    "liv": [
        {
            "url": "https://www.liv.me/-/media/liv/pdfs/terms-and-conditions.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Liv. Product Terms",
        },
    ],

    "wio": [
        {
            "url": "https://wio.io/-/media/pdfs/product-terms.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Wio Bank Product Terms",
        },
    ],

    "cbd": [
        {
            "url": "https://www.cbd.ae/-/media/cbd/pdfs/personal/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "CBD Credit Cards KFS",
        },
        {
            "url": "https://www.cbd.ae/-/media/cbd/pdfs/personal/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "CBD Personal Loans KFS",
        },
        {
            "url": "https://www.cbd.ae/-/media/cbd/pdfs/schedule-of-charges.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "CBD Schedule of Charges",
        },
    ],

    "ajman_bank": [
        {
            "url": "https://www.ajmanbank.ae/-/media/ajman/pdfs/personal/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Ajman Bank Credit Cards KFS",
        },
        {
            "url": "https://www.ajmanbank.ae/-/media/ajman/pdfs/personal/kfs-personal-finance.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "Ajman Bank Personal Finance KFS",
        },
    ],

    "sharjah_islamic": [
        {
            "url": "https://www.sib.ae/-/media/sib/pdfs/personal/kfs-covered-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "SIB Covered Cards KFS",
        },
        {
            "url": "https://www.sib.ae/-/media/sib/pdfs/personal/kfs-personal-finance.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "SIB Personal Finance KFS",
        },
    ],

    # ================================================================
    # TIER 3: Remittance & Exchange Houses (6 providers)
    # ================================================================

    "wise": [
        {
            "url": "https://wise.com/imaginary/fee-transparency-uae.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Wise Fee Transparency",
        },
    ],

    "remitly": [
        {
            "url": "https://www.remitly.com/imaginary/disclosure-uae.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Remitly Fee Disclosure",
        },
    ],

    "western_union": [
        {
            "url": "https://www.westernunion.com/content/dam/wu/pdfs/uae-fee-schedule.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Western Union UAE Fee Schedule",
        },
    ],

    "al_ansari": [
        {
            "url": "https://www.alansariexchange.com/-/media/pdfs/rate-card.pdf",
            "category": "remittance",
            "doc_type": "rate_card",
            "name": "Al Ansari Rate Card",
        },
        {
            "url": "https://www.alansariexchange.com/-/media/pdfs/service-charges.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Al Ansari Service Charges",
        },
    ],

    "uae_exchange": [
        {
            "url": "https://www.uaeexchange.com/-/media/pdfs/rate-card.pdf",
            "category": "remittance",
            "doc_type": "rate_card",
            "name": "UAE Exchange Rate Card",
        },
        {
            "url": "https://www.uaeexchange.com/-/media/pdfs/fee-schedule.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "UAE Exchange Fee Schedule",
        },
    ],

    "lulu_exchange": [
        {
            "url": "https://www.luluexchange.com/-/media/pdfs/rate-card.pdf",
            "category": "remittance",
            "doc_type": "rate_card",
            "name": "Lulu Exchange Rate Card",
        },
        {
            "url": "https://www.luluexchange.com/-/media/pdfs/fee-schedule.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Lulu Exchange Fee Schedule",
        },
    ],

    # ================================================================
    # TIER 4: Insurance Companies (6 companies)
    # ================================================================

    "oman_insurance": [
        {
            "url": "https://www.omaninsurance.ae/-/media/pdfs/motor/policy-wording.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "Oman Insurance Motor Policy",
        },
        {
            "url": "https://www.omaninsurance.ae/-/media/pdfs/health/benefit-schedule.pdf",
            "category": "health_insurance",
            "doc_type": "policy",
            "name": "Oman Insurance Health Benefits",
        },
    ],

    "orient_insurance": [
        {
            "url": "https://www.orientinsurance.ae/-/media/pdfs/motor/policy-wording.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "Orient Insurance Motor Policy",
        },
        {
            "url": "https://www.orientinsurance.ae/-/media/pdfs/health/benefit-schedule.pdf",
            "category": "health_insurance",
            "doc_type": "policy",
            "name": "Orient Insurance Health Benefits",
        },
    ],

    "axa_gulf": [
        {
            "url": "https://www.axa-gulf.com/-/media/pdfs/motor-product-brochure.pdf",
            "category": "car_insurance",
            "doc_type": "brochure",
            "name": "AXA Gulf Motor Brochure",
        },
        {
            "url": "https://www.axa-gulf.com/-/media/pdfs/health-benefit-table.pdf",
            "category": "health_insurance",
            "doc_type": "brochure",
            "name": "AXA Gulf Health Benefits",
        },
    ],

    "daman_health": [
        {
            "url": "https://www.damanhealth.ae/-/media/pdfs/network-list.pdf",
            "category": "health_insurance",
            "doc_type": "policy",
            "name": "Daman Network List",
        },
        {
            "url": "https://www.damanhealth.ae/-/media/pdfs/plan-comparison.pdf",
            "category": "health_insurance",
            "doc_type": "brochure",
            "name": "Daman Plan Comparison",
        },
    ],

    "sukoon_insurance": [
        {
            "url": "https://www.sukoon.com/-/media/pdfs/motor-policy-wording.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "Sukoon Motor Policy",
        },
        {
            "url": "https://www.sukoon.com/-/media/pdfs/health-coverage.pdf",
            "category": "health_insurance",
            "doc_type": "policy",
            "name": "Sukoon Health Coverage",
        },
    ],

    "rsa_insurance": [
        {
            "url": "https://www.rsagroup.ae/-/media/pdfs/motor-policy-wording.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "RSA Motor Policy",
        },
        {
            "url": "https://www.rsagroup.ae/-/media/pdfs/premium-guide.pdf",
            "category": "car_insurance",
            "doc_type": "brochure",
            "name": "RSA Premium Guide",
        },
    ],
}
