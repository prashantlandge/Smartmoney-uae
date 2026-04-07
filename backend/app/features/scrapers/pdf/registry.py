"""PDF URL registry for all financial institution documents.

Centralized registry mapping provider keys to their official PDF documents.
Each entry specifies:
    - url: Direct download URL for the PDF
    - category: Product category (credit_card, personal_loan, etc.)
    - doc_type: Document type (kfs, soc, brochure, fee_schedule, policy, rate_card)
    - name: Human-readable document name

URLs verified from official bank/institution websites — KFS (Key Fact Statements),
SOC (Schedule of Charges), policy wordings, and fee schedules.
"""

PDF_REGISTRY: dict[str, list[dict]] = {
    # ================================================================
    # TIER 1: Banks with existing HTML scrapers (9 banks)
    # ================================================================

    "emirates_nbd": [
        {
            "url": "https://cdn.emiratesnbd.com/enbd/files/pdf/kfs_credit_cards_horizontal_em_new.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ENBD Credit Cards KFS",
        },
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/files/kfs/kfs_personal_loan_fixed_interest_rate.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "ENBD Personal Loan KFS (Fixed Rate)",
        },
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/files/loan/personal-loan/kfs_personal_loan_variable_interest_rate.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "ENBD Personal Loan KFS (Variable Rate)",
        },
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/files/accounts/fees_charges_personal_banking_soc_poster.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ENBD Personal Banking Schedule of Charges",
        },
        {
            "url": "https://www.emiratesnbd.com/-/media/enbd/files/credit-cards/emiratesnbd_credit_card_fees_charges.pdf",
            "category": "credit_card",
            "doc_type": "soc",
            "name": "ENBD Credit Card Fees & Charges",
        },
    ],

    "fab": [
        {
            "url": "https://www.bankfab.com/-/media/fab-uds/personal/key-facts-statements/credit-cards/fab-consolidated-credit-cards-en.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "FAB Consolidated Credit Cards KFS",
        },
        {
            "url": "https://www.bankfab.com/-/media/fab-uds/personal/key-facts-statements/loans/personal-loan-en.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "FAB Personal Loan KFS",
        },
        {
            "url": "https://www.bankfab.com/-/media/fab-uds/personal/key-facts-statements/fab-islamic/islamic-personal-finance-en.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "FAB Islamic Personal Finance KFS",
        },
        {
            "url": "https://www.bankfab.com/-/media/fab-uds/personal/key-facts-statements/fab-islamic/fab-credit-cards-islamic-key-facts-statement.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "FAB Islamic Credit Cards KFS",
        },
    ],

    "adcb": [
        {
            "url": "https://www.adcb.com/Images/EY_ADCB_SOF_Jul_En_tcm9-1795.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ADCB Consumer Banking Schedule of Fees",
        },
        {
            "url": "https://www.adcb.com/images/SOF_DL_eng.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ADCB Personal Banking Schedule of Fees",
        },
        {
            "url": "https://www.adcb.com/images/SOF_DL_eng_brand_V14.pdf",
            "category": "all",
            "doc_type": "soc",
            "name": "ADCB Personal Banking Schedule of Fees (Latest)",
        },
        {
            "url": "https://www.adcb.com/Images/ADCB_CreditCard_EngTC_tcm9-51260.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ADCB Credit Card Terms & Conditions",
        },
    ],

    "mashreq": [
        {
            "url": "https://www.mashreqbank.com/-/jssmedia/pdfs/personal/cards/KFS-TnC/Mashreq-Cards-KFS-Final-EngArb.ashx",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Mashreq Credit Cards KFS",
        },
        {
            "url": "https://www.mashreqbank.com/-/jssmedia/pdfs/neo/loans/kfs-tnc/Mashreq-personal-loans-KFS-english.ashx",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "Mashreq Personal Loans KFS",
        },
        {
            "url": "https://www.mashreqbank.com/-/jssmedia/pdfs/personal/cards/migrated/SOC_Credit_Cards-English.ashx",
            "category": "credit_card",
            "doc_type": "soc",
            "name": "Mashreq Credit Cards Schedule of Charges",
        },
        {
            "url": "https://www.mashreqbank.com/-/jssmedia/pdfs/personal/cards/KFS-TnC/Cards-KFS-EngArb.ashx",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Mashreq Cards KFS (English/Arabic)",
        },
    ],

    "rakbank": [
        {
            "url": "https://www.rakbank.ae/globalassets/rakbank/all-pdfs/001---key-fact-statements/bilingual/kfs-elevate-credit-card.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "RAKBANK Elevate Credit Card KFS",
        },
        {
            "url": "https://www.rakbank.ae/globalassets/rakbank/all-pdfs/001---key-fact-statements/bilingual/kfs040-travel-prepaid-card.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "RAKBANK Travel Prepaid Card KFS",
        },
    ],

    "dib": [
        {
            "url": "https://www.dib.ae/docs/default-source/cpr/kfs/cards-kfs-dib-new-credit-cards-cm-sign-reqd-static.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "DIB Credit Cards KFS",
        },
        {
            "url": "https://www.dib.ae/docs/default-source/cpr/kfs/Cards-KFS-DIB-Credit-Cards-ENR-Sales-Product-CM-Sign-Reqd-Static.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "DIB Covered Card KFS",
        },
        {
            "url": "https://www.dib.ae/docs/default-source/cpr/kfs/Personal-Finance-KFS-PF-Service-Ijara-Static.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "DIB Personal Finance KFS (Ijara)",
        },
        {
            "url": "https://www.dib.ae/docs/default-source/cpr/kfs/Home-Finance-KFS-Interim-Pre-Service-Static.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "DIB Home Finance KFS",
        },
    ],

    "adib": [
        {
            "url": "https://www.adib.ae/-/media/Project/ADIB/ADIBSite/docs/kfs/ADIB-Covered-Cards_KFS.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ADIB Covered Cards KFS",
        },
        {
            "url": "https://www.adib.ae/-/media/Project/ADIB/ADIBSite/docs/kfs/adib-personal-finance_kfs.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "ADIB Personal Finance KFS",
        },
        {
            "url": "https://www.adib.ae/-/media/Project/ADIB/ADIBSite/docs/kfs/adib-home-finance_kfs.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "ADIB Home Finance KFS",
        },
        {
            "url": "https://www.adib.ae/-/media/project/adib/adibsite/docs/kfs/adib-smart-banking_kfs.pdf",
            "category": "all",
            "doc_type": "kfs",
            "name": "ADIB Smart Account KFS",
        },
        {
            "url": "https://www.adib.ae/pages/-/media/Project/ADIB/ADIBSite/docs/kfs/adib-cards_isic-and-darhoom_kfs.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "ADIB ISIC & Darhoom Cards KFS",
        },
    ],

    "hsbc": [
        {
            "url": "https://www.hsbc.ae/content/dam/hsbc/ae/docs/en/cards/kfs-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "HSBC Credit Cards KFS",
        },
        {
            "url": "https://www.hsbc.ae/content/dam/hsbc/ae/docs/en/cards/key-fact-statement-credit-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "HSBC Key Fact Statement Credit Cards",
        },
        {
            "url": "https://www.hsbc.ae/content/dam/hsbc/ae/docs/en/loans/kfs-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "HSBC Personal Loans KFS (Unsecured)",
        },
        {
            "url": "https://www.hsbc.ae/content/dam/hsbc/ae/docs/en/loans/kfs-secured-personal-loans.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "HSBC Personal Loans KFS (Secured)",
        },
        {
            "url": "https://www.hsbc.ae/content/dam/hsbc/ae/docs/en/loans/kfs-balance-transfer.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "HSBC Balance Transfer KFS",
        },
    ],

    "standard_chartered": [
        {
            "url": "https://av.sc.com/ae/content/docs/ae-credit-card-fee.pdf",
            "category": "credit_card",
            "doc_type": "soc",
            "name": "StanChart Credit Card Fees",
        },
        {
            "url": "https://av.sc.com/ae/content/docs/tccc.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "StanChart Credit Cards T&C",
        },
        {
            "url": "https://av.sc.com/ae/content/docs/tplod.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "StanChart Personal Loans T&C",
        },
    ],

    # ================================================================
    # TIER 2: Banks WITHOUT existing scrapers (7 banks)
    # ================================================================

    "emirates_islamic": [
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/key-information/kfs_cards_ea.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Emirates Islamic Credit Cards KFS",
        },
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/key-information/kfs_personalfinance_ea.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "Emirates Islamic Personal Finance KFS",
        },
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/key-information/kfs_homefinance_ea.pdf",
            "category": "islamic_finance",
            "doc_type": "kfs",
            "name": "Emirates Islamic Home Finance KFS",
        },
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/key-information/kfs_prepaid_cards_ea.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Emirates Islamic Prepaid Cards KFS",
        },
        {
            "url": "https://www.emiratesislamic.ae/-/media/ei/pdfs/key-information/kfs_deposits_ea.pdf",
            "category": "all",
            "doc_type": "kfs",
            "name": "Emirates Islamic Deposits KFS",
        },
    ],

    "citibank": [
        {
            "url": "https://www.citibank.ae/content/dam/cgcpc/ae/prelogin/www-citibank-ae/doc/pdf/kfs-cards.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Citibank Credit Cards KFS",
        },
        {
            "url": "https://www.citibank.ae/pdf/1221/key-facts-statement-en.pdf",
            "category": "all",
            "doc_type": "kfs",
            "name": "Citibank Key Facts Statement",
        },
        {
            "url": "https://www.citibank.ae/content/dam/cgcpc/ae/prelogin/www-citibank-ae/doc/pdf/kfs-securities-backed-finance.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "Citibank Securities-Backed Finance KFS",
        },
    ],

    "liv": [
        {
            "url": "https://www.liv.me/-/media/liv/website/pdf/kfs/liv_tamayaz_credit_card_kfs.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Liv. Tamayaz Credit Card KFS (Jan 2026)",
        },
        {
            "url": "https://www.liv.me/-/media/liv/website/pdf/2024/kfs/apr/liv-credit-card-key-facts-statement-kfs-english.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Liv. Credit Card KFS",
        },
        {
            "url": "https://www.liv.me/-/media/liv/website/pdf/2023/kfs-category/liv-personal-loan-key-facts-statement-kfs-june-2023-en.pdf",
            "category": "personal_loan",
            "doc_type": "kfs",
            "name": "Liv. Personal Loan KFS",
        },
    ],

    "wio": [
        {
            "url": "https://wio.io/file/personal-fees.pdf",
            "category": "all",
            "doc_type": "fee_schedule",
            "name": "Wio Personal Schedule of Fees",
        },
        {
            "url": "https://wio.io/file/business-fees.pdf",
            "category": "all",
            "doc_type": "fee_schedule",
            "name": "Wio Business Schedule of Fees",
        },
        {
            "url": "https://wio.io/file/pricing-plan-how-it-works.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Wio Pricing Plan (Swift Transfers)",
        },
    ],

    "cbd": [
        {
            "url": "https://www.cbd.ae/docs/default-source/default-document-library/kfs-sa_conventional_credit-card_en-ar.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "CBD Conventional Credit Card KFS",
        },
        {
            "url": "https://www.cbd.ae/docs/default-source/document/cards/cbd-kfs-conventional_super-saver-cc.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "CBD Super Saver Credit Card KFS",
        },
        {
            "url": "https://www.cbd.ae/docs/default-source/revamp-doc/kfs/visa-corporate-kfs.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "CBD Business Credit Card KFS",
        },
    ],

    "ajman_bank": [
        {
            "url": "https://www.ajmanbank.ae/site/files/148KFS_Credit_Card.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Ajman Bank Credit Card KFS",
        },
        {
            "url": "https://www.ajmanbank.ae/site/files/KFS_EN_AR_Credit_Card.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Ajman Bank Credit Card KFS (EN/AR)",
        },
        {
            "url": "https://www.ajmanbank.ae/site/files/KFS%20-%20ENAR%20ULTRACASH%20Card%20(ULTRA%20C)%20R3.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "Ajman Bank UltraCash Card KFS",
        },
    ],

    "sharjah_islamic": [
        {
            "url": "https://www.sib.ae/docs/default-source/default-document-library/covered-cards-tc-en.pdf",
            "category": "credit_card",
            "doc_type": "kfs",
            "name": "SIB Covered Cards T&C",
        },
    ],

    # ================================================================
    # TIER 3: Remittance & Exchange Houses (6 providers)
    # ================================================================

    "wise": [
        {
            "url": "https://wise.com/us/pricing/send-money",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Wise Fee Pricing Page",
            "is_webpage": True,
        },
    ],

    "remitly": [
        {
            "url": "https://www.remitly.com/blog/finance/how-remittance-companies-set-rates/",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Remitly Pricing Guide",
            "is_webpage": True,
        },
    ],

    "western_union": [
        {
            "url": "https://www.westernunion.com/content/dam/wu/EU/EN/210439812_D_Fee_table_update_EN_v2_LowRes.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Western Union Fee Table",
        },
        {
            "url": "https://www.westernunion.com/content/dam/wu/EU/EN/feeTableRetailEN-ES.PDF",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Western Union Retail Fee Table",
        },
    ],

    "al_ansari": [
        {
            "url": "https://alansariexchange.com/wp-content/uploads/2019/10/Key%20Fact%20Statement%20-%20Remittance%20-%20EN.pdf",
            "category": "remittance",
            "doc_type": "kfs",
            "name": "Al Ansari Remittance KFS",
        },
        {
            "url": "https://alansariexchange.com/wp-content/uploads/2019/10/Key%20Fact%20Statement%20-%20Foreign%20Currency%20Exchange%20Services%20-%20EN.pdf",
            "category": "remittance",
            "doc_type": "kfs",
            "name": "Al Ansari Foreign Currency Exchange KFS",
        },
    ],

    "uae_exchange": [
        {
            "url": "https://ae.uaeexchange.com/termsconditions.html",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "UAE Exchange Terms & Conditions",
            "is_webpage": True,
        },
    ],

    "lulu_exchange": [
        {
            "url": "https://luluexchange.com/wp-content/uploads/2023/09/LuLu-International-Exchange-Service-Charges-Main.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Lulu Exchange Service Charges",
        },
        {
            "url": "https://luluexchange.com/wp-content/uploads/2024/07/Remittance-LE-UAE-KEY-FACT-STATEMENTS-REMITTANCE-1.pdf",
            "category": "remittance",
            "doc_type": "kfs",
            "name": "Lulu Exchange Remittance KFS",
        },
        {
            "url": "https://luluexchange.com/wp-content/uploads/2024/04/Revised-Charges.pdf",
            "category": "remittance",
            "doc_type": "fee_schedule",
            "name": "Lulu Exchange Revised Remittance Charges",
        },
    ],

    # ================================================================
    # TIER 4: Insurance Companies (6 companies)
    # ================================================================

    "oman_insurance": [
        {
            "url": "https://www.sukoon.com/-/media/oic/oic-media/oic-documents/individual/motor/comprehensive/product-information---motor-comprehensive-brochure.pdf",
            "category": "car_insurance",
            "doc_type": "brochure",
            "name": "Sukoon Motor Comprehensive Brochure",
        },
        {
            "url": "https://www.sukoon.com/-/media/oic/oic-media/oic-documents/individual/motor/comprehensive/product-information--motor-comprehensive-terms-and-conditions-english.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "Sukoon Motor Comprehensive T&C",
        },
    ],

    "orient_insurance": [
        {
            "url": "https://www.mashreq.com/-/jssmedia/pdfs/neo/insurance/Orient-motor-Ins-KFD-En-Ar.ashx",
            "category": "car_insurance",
            "doc_type": "kfs",
            "name": "Orient Motor Insurance Key Facts (via Mashreq)",
        },
    ],

    "axa_gulf": [
        {
            "url": "https://online.axa-gulf.com/cmsfiles/Motor Perfect T&C_UAE_EN.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "AXA Gulf Motor Perfect T&C",
        },
    ],

    "daman_health": [
        {
            "url": "https://www.damanhealth.ae/wp-content/uploads/2023/12/SP_Flexi-Health-Insurance_Mat_0Ded_NoDental.pdf",
            "category": "health_insurance",
            "doc_type": "policy",
            "name": "Daman Flexi Health Insurance Schedule of Benefits",
        },
        {
            "url": "https://www.damanhealth.ae/wp-content/uploads/2024/04/Member-Guide-Damans-Health-Insurance-Plans-15Apr24.pdf",
            "category": "health_insurance",
            "doc_type": "brochure",
            "name": "Daman Member Guide",
        },
        {
            "url": "https://damanhealth.ae/main/bottom-carousel/Abu%20Dhabi%20Basic%20Plan%20Premium%20Rate%20-%2001Jan19.pdf",
            "category": "health_insurance",
            "doc_type": "fee_schedule",
            "name": "Daman Abu Dhabi Basic Plan Premium Rates",
        },
    ],

    "sukoon_insurance": [
        {
            "url": "https://www.sukoon.com/-/media/oic/oic-media/oic-documents/individual/motor/comprehensive/product-information---motor-comprehensive-brochure.pdf",
            "category": "car_insurance",
            "doc_type": "brochure",
            "name": "Sukoon Motor Comprehensive Brochure",
        },
        {
            "url": "https://www.sukoon.com/-/media/oic/oic-media/oic-documents/individual/motor/comprehensive/product-information--motor-comprehensive-terms-and-conditions-english.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "Sukoon Motor Comprehensive Policy Wording",
        },
    ],

    "rsa_insurance": [
        {
            "url": "https://www.livainsurance.ae/sites/default/files/files/new_motor_policy_wording_effective01.07.16.pdf",
            "category": "car_insurance",
            "doc_type": "policy",
            "name": "Liva (RSA) Motor Insurance Policy Wording",
        },
    ],
}
