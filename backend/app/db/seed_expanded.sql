-- SmartMoney UAE — Expanded Product Catalog
-- Run AFTER the base seed.sql (additive — uses ON CONFLICT DO NOTHING)
-- Adds 50+ products inspired by UAE fintech comparison platforms

-- ============================================================
-- ADDITIONAL PROVIDERS (banks not in original seed)
-- ============================================================
INSERT INTO providers (id, name_en, name_ar, type, website_url, affiliate_network, active) VALUES
('b0000001-0000-0000-0000-000000000012', 'Liv. by Emirates NBD', 'ليف من الإمارات دبي الوطني', 'bank', 'https://liv.me', 'direct', true),
('b0000001-0000-0000-0000-000000000013', 'Wio Bank', 'بنك ويو', 'bank', 'https://wio.io', 'direct', true),
('b0000001-0000-0000-0000-000000000014', 'CBD (Commercial Bank of Dubai)', 'بنك دبي التجاري', 'bank', 'https://cbd.ae', 'direct', true),
('b0000001-0000-0000-0000-000000000015', 'Ajman Bank', 'مصرف عجمان', 'bank', 'https://ajmanbank.ae', 'direct', true),
('b0000001-0000-0000-0000-000000000016', 'Sharjah Islamic Bank', 'مصرف الشارقة الإسلامي', 'bank', 'https://sib.ae', 'direct', true),
('c0000001-0000-0000-0000-000000000004', 'Oman Insurance', 'عُمان للتأمين', 'insurance', 'https://omaninsurance.ae', 'direct', true),
('c0000001-0000-0000-0000-000000000005', 'Orient Insurance', 'أورينت للتأمين', 'insurance', 'https://orientinsurance.ae', 'direct', true),
('c0000001-0000-0000-0000-000000000006', 'AXA Gulf', 'أكسا الخليج', 'insurance', 'https://axa-gulf.com', 'direct', true),
('c0000001-0000-0000-0000-000000000007', 'Daman Health', 'ضمان الصحية', 'insurance', 'https://damanhealth.ae', 'direct', true),
('c0000001-0000-0000-0000-000000000008', 'Sukoon Insurance', 'سكون للتأمين', 'insurance', 'https://sukoon.com', 'direct', true),
('c0000001-0000-0000-0000-000000000009', 'RSA Insurance UAE', 'آر إس إيه للتأمين', 'insurance', 'https://rsagroup.ae', 'direct', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CREDIT CARDS — 15 additional (total ~21)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_salary_aed, residency_required, nationality_restrictions, employer_categories, representative_rate, rate_type, key_features, affiliate_deep_link_en, commission_amount_aed, commission_type, islamic_compliant, data_source) VALUES

-- FAB Cashback Credit Card
('b0000001-0000-0000-0000-000000000002', 'credit_card',
 'FAB Cashback Credit Card',
 'بطاقة فاب كاش باك',
 'Up to 10% cashback on dining and entertainment. No annual fee for the first year with salary transfer.',
 'استرداد نقدي يصل إلى 10% على المطاعم والترفيه. بدون رسوم سنوية للسنة الأولى مع تحويل الراتب.',
 5000, true, '{}', '{government,listed_company,private,self_employed,any}',
 3.99, 'variable',
 '{"cashback_rate": "up to 10%", "annual_fee": "AED 0 first year, AED 300 after", "lounge_access": true, "cinema_offers": true, "no_salary_transfer": true}',
 'https://bankfab.com/cards/cashback?utm_source=smartmoney_uae',
 200, 'flat', false, 'manual_entry'),

-- HSBC Live+ Credit Card
('b0000001-0000-0000-0000-000000000009', 'credit_card',
 'HSBC Live+ Credit Card',
 'بطاقة إتش إس بي سي لايف بلس',
 'Earn up to 3% cashback with Zomato Gold and Careem Plus memberships included.',
 'احصل على استرداد نقدي يصل إلى 3% مع عضوية زوماتو جولد وكريم بلس مشمولة.',
 12500, true, '{}', '{government,listed_company,private}',
 3.69, 'variable',
 '{"cashback_rate": "up to 3%", "annual_fee": "AED 314", "lounge_access": true, "cinema_offers": true, "zomato_gold": true, "careem_plus": true}',
 'https://hsbc.ae/cards/live-plus?utm_source=smartmoney_uae',
 300, 'flat', false, 'manual_entry'),

-- HSBC Cash+ Credit Card
('b0000001-0000-0000-0000-000000000009', 'credit_card',
 'HSBC Cash+ Credit Card',
 'بطاقة إتش إس بي سي كاش بلس',
 'Premium cashback card with up to 5% on groceries and dining. Free for first year.',
 'بطاقة استرداد نقدي مميزة تصل إلى 5% على البقالة والمطاعم. مجانية للسنة الأولى.',
 30000, true, '{}', '{government,listed_company}',
 3.69, 'variable',
 '{"cashback_rate": "up to 5%", "annual_fee": "AED 1,050 (free 1st year)", "lounge_access": true, "travel_insurance": true, "careem_plus": true}',
 'https://hsbc.ae/cards/cash-plus?utm_source=smartmoney_uae',
 400, 'flat', false, 'manual_entry'),

-- ADCB Traveller Credit Card
('b0000001-0000-0000-0000-000000000003', 'credit_card',
 'ADCB Traveller Credit Card',
 'بطاقة أبوظبي التجاري المسافر',
 'Earn 2 Skywards miles per AED 1 spent on airlines and hotels. Unlimited lounge access worldwide.',
 'اكسب 2 أميال سكاي واردز لكل درهم على الطيران والفنادق. دخول غير محدود لصالات المطار.',
 20000, true, '{}', '{government,listed_company}',
 3.69, 'variable',
 '{"miles_rate": "2x on travel", "annual_fee": "AED 1,575", "lounge_access": true, "travel_insurance": true, "hotel_discounts": true, "golf_benefits": true}',
 'https://adcb.com/cards/traveller?utm_source=smartmoney_uae',
 500, 'flat', false, 'manual_entry'),

-- Standard Chartered Infinite
('b0000001-0000-0000-0000-000000000010', 'credit_card',
 'Standard Chartered Infinite Credit Card',
 'بطاقة ستاندرد تشارترد إنفينيت',
 'Ultra-premium card with worldwide concierge service, unlimited airport transfers, and Visa Infinite perks.',
 'بطاقة فائقة التميز مع خدمة كونسيرج عالمية ونقل غير محدود من المطار.',
 50000, true, '{}', '{government,listed_company}',
 3.49, 'variable',
 '{"rewards_rate": "5x points on dining", "annual_fee": "AED 3,000", "lounge_access": true, "concierge": true, "airport_transfer": true, "travel_insurance": true}',
 'https://sc.com/ae/cards/infinite?utm_source=smartmoney_uae',
 600, 'flat', false, 'manual_entry'),

-- Standard Chartered Cashback
('b0000001-0000-0000-0000-000000000010', 'credit_card',
 'Standard Chartered Cashback Credit Card',
 'بطاقة ستاندرد تشارترد كاش باك',
 'Flat 2% unlimited cashback on all spends. No categories to track, no cap on cashback.',
 'استرداد نقدي ثابت 2% غير محدود على جميع المشتريات. بدون فئات أو حد أقصى.',
 8000, true, '{}', '{government,listed_company,private,any}',
 3.49, 'variable',
 '{"cashback_rate": "flat 2% unlimited", "annual_fee": "AED 525", "lounge_access": false, "no_category_tracking": true}',
 'https://sc.com/ae/cards/cashback?utm_source=smartmoney_uae',
 250, 'flat', false, 'manual_entry'),

-- Citibank Rewards
('b0000001-0000-0000-0000-000000000011', 'credit_card',
 'Citibank Rewards Credit Card',
 'بطاقة سيتي بنك ريواردز',
 '10x reward points on online shopping, dining & groceries. ThankYou Rewards redeemable for flights.',
 '10 أضعاف نقاط المكافآت على التسوق أونلاين والمطاعم والبقالة.',
 15000, true, '{}', '{government,listed_company,private}',
 3.49, 'variable',
 '{"rewards_rate": "10x on select categories", "annual_fee": "AED 500", "lounge_access": true, "online_shopping_bonus": true, "global_acceptance": true}',
 'https://citibank.ae/cards/rewards?utm_source=smartmoney_uae',
 350, 'flat', false, 'manual_entry'),

-- Citibank Cashback
('b0000001-0000-0000-0000-000000000011', 'credit_card',
 'Citibank Cashback Credit Card',
 'بطاقة سيتي بنك كاش باك',
 'Up to 3% cashback on supermarket, utility bills & telecom. No minimum spend required.',
 'استرداد نقدي يصل إلى 3% على السوبرماركت والفواتير والاتصالات.',
 8000, true, '{}', '{government,listed_company,private,any}',
 3.49, 'variable',
 '{"cashback_rate": "up to 3%", "annual_fee": "AED 300", "supermarket_bonus": true, "utility_cashback": true, "no_min_spend": true}',
 'https://citibank.ae/cards/cashback?utm_source=smartmoney_uae',
 200, 'flat', false, 'manual_entry'),

-- Emirates Islamic Skywards
('b0000001-0000-0000-0000-000000000008', 'credit_card',
 'Emirates Islamic Skywards Signature Credit Card',
 'بطاقة الإمارات الإسلامي سكاي واردز',
 'Shariah-compliant card earning Emirates Skywards miles on every spend. Free travel insurance.',
 'بطاقة متوافقة مع الشريعة تكسب أميال سكاي واردز على كل عملية شراء.',
 15000, true, '{}', '{government,listed_company,private}',
 0, 'fixed',
 '{"miles_rate": "1.5 miles per AED 1", "annual_fee": "AED 750", "lounge_access": true, "travel_insurance": true, "sharia_compliant": true}',
 'https://emiratesislamic.ae/cards/skywards?utm_source=smartmoney_uae',
 350, 'flat', true, 'manual_entry'),

-- Mashreq Solitaire Visa Infinite
('b0000001-0000-0000-0000-000000000004', 'credit_card',
 'Mashreq Solitaire Visa Infinite Credit Card',
 'بطاقة مشرق سوليتير فيزا إنفينيت',
 'Luxury card with buy-1-get-1 dining, golf access, and exclusive Marriott Bonvoy Gold status.',
 'بطاقة فاخرة مع عروض اشتر 1 واحصل على 1 في المطاعم ودخول الجولف.',
 30000, true, '{}', '{government,listed_company}',
 3.25, 'variable',
 '{"rewards_rate": "4x on dining", "annual_fee": "AED 2,000", "lounge_access": true, "bogo_dining": true, "golf_access": true, "hotel_status": "Marriott Gold"}',
 'https://mashreqbank.com/solitaire?utm_source=smartmoney_uae',
 500, 'flat', false, 'manual_entry'),

-- Liv. Metal Card
('b0000001-0000-0000-0000-000000000012', 'credit_card',
 'Liv. Metal Credit Card',
 'بطاقة ليف ميتال',
 'Digital-first metal card with no minimum salary. Earn cashback on dining, streaming & delivery apps.',
 'بطاقة معدنية رقمية بدون حد أدنى للراتب. استرداد نقدي على المطاعم والبث والتوصيل.',
 0, true, '{}', '{government,listed_company,private,self_employed,any}',
 3.15, 'variable',
 '{"cashback_rate": "up to 5% on dining", "annual_fee": "AED 0", "no_min_salary": true, "apple_pay": true, "instant_approval": true, "streaming_cashback": true}',
 'https://liv.me/cards/metal?utm_source=smartmoney_uae',
 150, 'flat', false, 'manual_entry'),

-- CBD World Mastercard
('b0000001-0000-0000-0000-000000000014', 'credit_card',
 'CBD World Mastercard Credit Card',
 'بطاقة بنك دبي التجاري وورلد ماستركارد',
 'Earn up to 4% cashback on international spends. Free airport transfer twice a year.',
 'استرداد نقدي يصل إلى 4% على المشتريات الدولية. نقل مجاني من المطار مرتين سنوياً.',
 15000, true, '{}', '{government,listed_company,private}',
 3.49, 'variable',
 '{"cashback_rate": "up to 4% international", "annual_fee": "AED 600", "lounge_access": true, "airport_transfer": "2x per year", "global_assistance": true}',
 'https://cbd.ae/cards/world?utm_source=smartmoney_uae',
 300, 'flat', false, 'manual_entry'),

-- ADIB Covered Card
('b0000001-0000-0000-0000-000000000007', 'credit_card',
 'ADIB Covered Card Visa Signature',
 'بطاقة أبوظبي الإسلامي المغطاة فيزا',
 'Shariah-compliant covered card with cashback rewards. No interest — only fixed fees.',
 'بطاقة مغطاة متوافقة مع الشريعة مع استرداد نقدي. بدون فوائد — رسوم ثابتة فقط.',
 10000, true, '{}', '{government,listed_company,private}',
 0, 'fixed',
 '{"cashback_rate": "up to 3%", "annual_fee": "AED 400", "lounge_access": true, "sharia_compliant": true, "no_interest": true, "profit_rate": "2.75%"}',
 'https://adib.ae/cards/covered?utm_source=smartmoney_uae',
 300, 'flat', true, 'manual_entry'),

-- Wio Cashback Card
('b0000001-0000-0000-0000-000000000013', 'credit_card',
 'Wio Cashback Credit Card',
 'بطاقة ويو كاش باك',
 'UAE digital bank card. 2% flat cashback, no annual fee, instant virtual issuance via app.',
 'بطاقة بنك رقمي إماراتي. استرداد نقدي 2% ثابت، بدون رسوم سنوية، إصدار فوري عبر التطبيق.',
 0, true, '{}', '{government,listed_company,private,self_employed,any}',
 3.25, 'variable',
 '{"cashback_rate": "flat 2%", "annual_fee": "AED 0", "no_min_salary": true, "instant_virtual_card": true, "apple_pay": true, "samsung_pay": true}',
 'https://wio.io/cards?utm_source=smartmoney_uae',
 100, 'flat', false, 'manual_entry'),

-- RAKBANK Titanium
('b0000001-0000-0000-0000-000000000005', 'credit_card',
 'RAKBANK Titanium Credit Card',
 'بطاقة راك بنك تيتانيوم',
 'Entry-level card with up to 1% cashback and free supplementary cards. Low salary requirement.',
 'بطاقة أساسية مع استرداد نقدي يصل إلى 1% وبطاقات إضافية مجانية.',
 5000, true, '{}', '{government,listed_company,private,self_employed,any}',
 3.39, 'variable',
 '{"cashback_rate": "up to 1%", "annual_fee": "AED 150", "supplementary_cards": "free", "contactless": true, "low_min_salary": true}',
 'https://rakbank.ae/cards/titanium?utm_source=smartmoney_uae',
 100, 'flat', false, 'yallacompare');


-- ============================================================
-- PERSONAL LOANS — 7 additional (total ~10)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_salary_aed, residency_required, nationality_restrictions, employer_categories, representative_rate, rate_type, min_amount_aed, max_amount_aed, min_tenure_months, max_tenure_months, key_features, affiliate_deep_link_en, commission_percentage, commission_type, islamic_compliant, data_source) VALUES

-- FAB Personal Loan
('b0000001-0000-0000-0000-000000000002', 'personal_loan',
 'FAB Personal Loan',
 'قرض شخصي من بنك أبوظبي الأول',
 'Competitive rates from 5.75% with salary transfer. Pre-approved offers for existing customers.',
 'أسعار تنافسية تبدأ من 5.75% مع تحويل الراتب. عروض مسبقة الموافقة للعملاء الحاليين.',
 8000, true, '{}', '{government,listed_company,private,any}',
 5.75, 'fixed', 10000, 1500000, 12, 48,
 '{"processing_fee": "0.99%", "early_settlement": "1% of outstanding", "salary_transfer_required": true, "insurance_included": true, "pre_approved": true}',
 'https://bankfab.com/loans/personal?utm_source=smartmoney_uae',
 1.25, 'percentage', false, 'manual_entry'),

-- Mashreq Personal Loan
('b0000001-0000-0000-0000-000000000004', 'personal_loan',
 'Mashreq Personal Loan',
 'قرض شخصي من المشرق',
 'Quick 30-minute approval with competitive rates. Up to 20x monthly salary.',
 'موافقة سريعة خلال 30 دقيقة بأسعار تنافسية. حتى 20 ضعف الراتب الشهري.',
 5000, true, '{}', '{government,listed_company,private,self_employed}',
 6.25, 'fixed', 10000, 1000000, 12, 48,
 '{"processing_fee": "1%", "early_settlement": "1%", "salary_transfer_required": false, "quick_approval": "30 minutes", "buyout_available": true}',
 'https://mashreqbank.com/loans/personal?utm_source=smartmoney_uae',
 1.0, 'percentage', false, 'manual_entry'),

-- RAKBANK Personal Loan
('b0000001-0000-0000-0000-000000000005', 'personal_loan',
 'RAKBANK Personal Loan',
 'قرض شخصي من راك بنك',
 'Low processing fee of 0.75%. Salary transfer not mandatory. Quick online application.',
 'رسوم معالجة منخفضة 0.75%. تحويل الراتب غير إلزامي. تقديم سريع عبر الإنترنت.',
 5000, true, '{}', '{government,listed_company,private,any}',
 6.49, 'fixed', 5000, 750000, 12, 48,
 '{"processing_fee": "0.75%", "early_settlement": "1%", "salary_transfer_required": false, "online_application": true, "low_processing_fee": true}',
 'https://rakbank.ae/loans/personal?utm_source=smartmoney_uae',
 1.0, 'percentage', false, 'yallacompare'),

-- Standard Chartered Personal Loan
('b0000001-0000-0000-0000-000000000010', 'personal_loan',
 'Standard Chartered Personal Loan',
 'قرض شخصي من ستاندرد تشارترد',
 'Premium rates for Priority Banking customers. Loan up to AED 2 million with flexible tenure.',
 'أسعار مميزة لعملاء الخدمات المصرفية الممتازة. قرض يصل إلى 2 مليون درهم.',
 15000, true, '{}', '{government,listed_company}',
 5.99, 'fixed', 20000, 2000000, 12, 48,
 '{"processing_fee": "1%", "early_settlement": "1%", "salary_transfer_required": true, "max_dti_ratio": "50%", "priority_rates": true}',
 'https://sc.com/ae/loans/personal?utm_source=smartmoney_uae',
 1.5, 'percentage', false, 'manual_entry'),

-- Citibank Personal Loan
('b0000001-0000-0000-0000-000000000011', 'personal_loan',
 'Citibank Personal Loan',
 'قرض شخصي من سيتي بنك',
 'Top-up existing loans or consolidate debt. Competitive rates for Citibank credit card holders.',
 'أعد تمويل القروض الحالية أو وحّد الديون. أسعار تنافسية لحاملي بطاقات سيتي بنك.',
 15000, true, '{}', '{government,listed_company,private}',
 6.99, 'fixed', 20000, 1000000, 12, 48,
 '{"processing_fee": "1.05%", "early_settlement": "1%", "salary_transfer_required": true, "debt_consolidation": true, "existing_card_bonus": true}',
 'https://citibank.ae/loans/personal?utm_source=smartmoney_uae',
 1.0, 'percentage', false, 'manual_entry'),

-- CBD Personal Loan
('b0000001-0000-0000-0000-000000000014', 'personal_loan',
 'CBD Personal Loan',
 'قرض شخصي من بنك دبي التجاري',
 'Low processing fee and flexible repayment. No salary transfer required for select employers.',
 'رسوم معالجة منخفضة وسداد مرن. لا يتطلب تحويل الراتب لجهات عمل محددة.',
 7000, true, '{}', '{government,listed_company,private,any}',
 6.75, 'fixed', 10000, 500000, 12, 48,
 '{"processing_fee": "0.99%", "early_settlement": "1%", "salary_transfer_required": false, "online_application": true}',
 'https://cbd.ae/loans/personal?utm_source=smartmoney_uae',
 1.0, 'percentage', false, 'manual_entry'),

-- Liv. Flexi Loan
('b0000001-0000-0000-0000-000000000012', 'personal_loan',
 'Liv. Flexi Personal Loan',
 'قرض ليف المرن',
 'Digital-first personal loan with instant approval via app. No branch visit required.',
 'قرض شخصي رقمي مع موافقة فورية عبر التطبيق. لا حاجة لزيارة الفرع.',
 5000, true, '{}', '{government,listed_company,private,self_employed,any}',
 7.49, 'fixed', 5000, 200000, 6, 36,
 '{"processing_fee": "1%", "instant_approval": true, "no_branch_visit": true, "salary_transfer_required": false, "app_only": true}',
 'https://liv.me/loans?utm_source=smartmoney_uae',
 0.75, 'percentage', false, 'manual_entry');


-- ============================================================
-- ISLAMIC FINANCE — 8 additional (total ~10)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_salary_aed, residency_required, nationality_restrictions, employer_categories, representative_rate, rate_type, key_features, affiliate_deep_link_en, commission_amount_aed, commission_type, islamic_compliant, data_source) VALUES

-- Dubai Islamic Bank Personal Finance
('b0000001-0000-0000-0000-000000000006', 'islamic_finance',
 'DIB Personal Finance',
 'التمويل الشخصي من بنك دبي الإسلامي',
 'Shariah-compliant personal finance up to AED 3 million. Competitive profit rates from 4.99%.',
 'تمويل شخصي متوافق مع الشريعة يصل إلى 3 مليون درهم. أسعار ربح تنافسية من 4.99%.',
 8000, true, '{}', '{government,listed_company,private,any}',
 4.99, 'fixed',
 '{"structure": "murabaha", "profit_rate": "from 4.99%", "max_amount": "AED 3,000,000", "tenure_up_to": "48 months", "sharia_compliant": true, "salary_transfer": true}',
 'https://dib.ae/personal-finance?utm_source=smartmoney_uae',
 400, 'flat', true, 'manual_entry'),

-- Emirates Islamic Personal Finance
('b0000001-0000-0000-0000-000000000008', 'islamic_finance',
 'Emirates Islamic Personal Finance',
 'التمويل الشخصي من الإمارات الإسلامي',
 'Flexible Islamic personal finance with instant pre-approval. No salary transfer for select companies.',
 'تمويل شخصي إسلامي مرن مع موافقة مسبقة فورية.',
 5000, true, '{}', '{government,listed_company,private}',
 5.25, 'fixed',
 '{"structure": "murabaha", "profit_rate": "from 5.25%", "max_amount": "AED 2,000,000", "tenure_up_to": "48 months", "sharia_compliant": true, "instant_approval": true}',
 'https://emiratesislamic.ae/personal-finance?utm_source=smartmoney_uae',
 350, 'flat', true, 'manual_entry'),

-- ADIB Home Finance
('b0000001-0000-0000-0000-000000000007', 'islamic_finance',
 'ADIB Home Finance',
 'التمويل العقاري من مصرف أبوظبي الإسلامي',
 'Shariah-compliant home finance for UAE residents. Finance up to 80% of property value.',
 'تمويل عقاري متوافق مع الشريعة للمقيمين في الإمارات. تمويل يصل إلى 80% من قيمة العقار.',
 15000, true, '{}', '{government,listed_company,private}',
 3.99, 'fixed',
 '{"structure": "ijara", "profit_rate": "from 3.99%", "ltv_ratio": "up to 80%", "max_tenure": "25 years", "sharia_compliant": true, "property_types": "villa, apartment, townhouse"}',
 'https://adib.ae/home-finance?utm_source=smartmoney_uae',
 1000, 'flat', true, 'manual_entry'),

-- DIB Auto Finance
('b0000001-0000-0000-0000-000000000006', 'islamic_finance',
 'DIB Auto Finance',
 'تمويل السيارات من بنك دبي الإسلامي',
 'Shariah-compliant car finance for new and pre-owned vehicles. Quick approval within 24 hours.',
 'تمويل سيارات متوافق مع الشريعة للسيارات الجديدة والمستعملة. موافقة سريعة خلال 24 ساعة.',
 5000, true, '{}', '{government,listed_company,private,self_employed}',
 3.49, 'fixed',
 '{"structure": "murabaha", "profit_rate": "from 3.49%", "new_and_used": true, "max_tenure": "60 months", "sharia_compliant": true, "quick_approval": "24 hours"}',
 'https://dib.ae/auto-finance?utm_source=smartmoney_uae',
 300, 'flat', true, 'manual_entry'),

-- Ajman Bank Personal Finance
('b0000001-0000-0000-0000-000000000015', 'islamic_finance',
 'Ajman Bank Personal Finance',
 'التمويل الشخصي من مصرف عجمان',
 'Islamic personal finance with low profit rates. Salary transfer not mandatory for select employers.',
 'تمويل شخصي إسلامي بأسعار ربح منخفضة. تحويل الراتب غير إلزامي لجهات عمل محددة.',
 5000, true, '{}', '{government,listed_company,private}',
 5.49, 'fixed',
 '{"structure": "murabaha", "profit_rate": "from 5.49%", "max_amount": "AED 1,000,000", "tenure_up_to": "48 months", "sharia_compliant": true}',
 'https://ajmanbank.ae/personal-finance?utm_source=smartmoney_uae',
 250, 'flat', true, 'manual_entry'),

-- Sharjah Islamic Bank Finance
('b0000001-0000-0000-0000-000000000016', 'islamic_finance',
 'SIB Personal Finance',
 'التمويل الشخصي من مصرف الشارقة الإسلامي',
 'Shariah-compliant personal finance for UAE residents and nationals. Competitive profit rates.',
 'تمويل شخصي متوافق مع الشريعة للمقيمين والمواطنين في الإمارات.',
 5000, true, '{}', '{government,listed_company,private}',
 5.75, 'fixed',
 '{"structure": "murabaha", "profit_rate": "from 5.75%", "max_amount": "AED 1,500,000", "tenure_up_to": "48 months", "sharia_compliant": true, "uae_nationals_special": true}',
 'https://sib.ae/personal-finance?utm_source=smartmoney_uae',
 200, 'flat', true, 'manual_entry'),

-- Emirates Islamic Savings Account
('b0000001-0000-0000-0000-000000000008', 'islamic_finance',
 'Emirates Islamic Kunooz Savings Account',
 'حساب كنوز للتوفير من الإمارات الإسلامي',
 'Shariah-compliant savings account with quarterly prize draws. Chance to win AED 1 million.',
 'حساب توفير متوافق مع الشريعة مع سحوبات ربع سنوية. فرصة للفوز بمليون درهم.',
 0, true, '{}', '{government,listed_company,private,self_employed,any}',
 0, 'fixed',
 '{"type": "savings_account", "min_balance": "AED 1,000", "prize_draws": "quarterly", "max_prize": "AED 1,000,000", "sharia_compliant": true, "no_min_salary": true}',
 'https://emiratesislamic.ae/kunooz?utm_source=smartmoney_uae',
 50, 'flat', true, 'manual_entry'),

-- ADIB Ghina Investment
('b0000001-0000-0000-0000-000000000007', 'islamic_finance',
 'ADIB Ghina Savings Account',
 'حساب غنى للادخار من مصرف أبوظبي الإسلامي',
 'Islamic savings account with monthly prize draws worth AED 500,000. No minimum balance.',
 'حساب ادخار إسلامي مع سحوبات شهرية بقيمة 500,000 درهم. بدون حد أدنى للرصيد.',
 0, true, '{}', '{government,listed_company,private,self_employed,any}',
 0, 'fixed',
 '{"type": "savings_account", "min_balance": "AED 0", "prize_draws": "monthly", "max_prize": "AED 500,000", "sharia_compliant": true, "no_min_salary": true}',
 'https://adib.ae/ghina?utm_source=smartmoney_uae',
 50, 'flat', true, 'manual_entry');


-- ============================================================
-- CAR INSURANCE — 6 additional (total ~8)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_amount_aed, max_amount_aed, key_features, affiliate_deep_link_en, commission_percentage, commission_type, residency_required, data_source) VALUES

-- Oman Insurance Comprehensive
('c0000001-0000-0000-0000-000000000004', 'car_insurance',
 'Oman Insurance Comprehensive Motor',
 'عُمان للتأمين الشامل للسيارات',
 'A-rated insurer with agency repair and roadside assistance. Covers natural disasters and theft.',
 'شركة تأمين مصنفة A مع إصلاح وكالة ومساعدة على الطريق.',
 1000, 20000,
 '{"type": "comprehensive", "agency_repair": true, "roadside_assistance": true, "natural_disaster": true, "theft_cover": true, "personal_accident": "AED 200,000", "oman_extension": true}',
 'https://omaninsurance.ae/motor?utm_source=smartmoney_uae',
 12, 'percentage', true, 'direct'),

-- Orient Insurance
('c0000001-0000-0000-0000-000000000005', 'car_insurance',
 'Orient Insurance Motor Plan',
 'أورينت للتأمين خطة السيارات',
 'Flexible car insurance with optional add-ons. GCC coverage included. Fast claims processing.',
 'تأمين سيارات مرن مع إضافات اختيارية. تغطية دول الخليج مشمولة.',
 800, 15000,
 '{"type": "comprehensive & third-party", "gcc_coverage": true, "fast_claims": true, "add_ons": "windshield, agency repair, PAB", "off_road_cover": false}',
 'https://orientinsurance.ae/motor?utm_source=smartmoney_uae',
 10, 'percentage', true, 'direct'),

-- AXA Gulf Motor
('c0000001-0000-0000-0000-000000000006', 'car_insurance',
 'AXA SmartDriver Car Insurance',
 'أكسا سمارت درايفر تأمين سيارات',
 'Telematics-based insurance that rewards safe driving with up to 25% discount. Agency repair included.',
 'تأمين قائم على التلماتيكس يكافئ القيادة الآمنة بخصم يصل إلى 25%.',
 900, 18000,
 '{"type": "comprehensive", "telematics_discount": "up to 25%", "agency_repair": true, "roadside_assistance": true, "windshield_cover": true, "safe_driving_rewards": true}',
 'https://axa-gulf.com/motor?utm_source=smartmoney_uae',
 14, 'percentage', true, 'direct'),

-- RSA Insurance
('c0000001-0000-0000-0000-000000000009', 'car_insurance',
 'RSA Motor Insurance',
 'آر إس إيه تأمين سيارات',
 'Competitive comprehensive and third-party plans with zero depreciation option. 24/7 claims support.',
 'خطط شاملة وتأمين طرف ثالث تنافسية مع خيار صفر استهلاك.',
 700, 12000,
 '{"type": "comprehensive & third-party", "zero_depreciation": true, "claims_support": "24/7", "personal_accident": true, "hire_car": "7 days"}',
 'https://rsagroup.ae/motor?utm_source=smartmoney_uae',
 10, 'percentage', true, 'direct'),

-- Sukoon Car Insurance
('c0000001-0000-0000-0000-000000000008', 'car_insurance',
 'Sukoon Comprehensive Car Insurance',
 'سكون تأمين سيارات شامل',
 'Shariah-compliant car insurance (Takaful). Agency repair and GCC coverage. Ethical insurance option.',
 'تأمين سيارات تكافلي متوافق مع الشريعة. إصلاح وكالة وتغطية خليجية.',
 900, 14000,
 '{"type": "takaful comprehensive", "sharia_compliant": true, "agency_repair": true, "gcc_coverage": true, "roadside_assistance": true, "ethical_insurance": true}',
 'https://sukoon.com/motor?utm_source=smartmoney_uae',
 11, 'percentage', true, 'direct'),

-- Souqalmal Car Insurance Comparison
('c0000001-0000-0000-0000-000000000001', 'car_insurance',
 'Souqalmal Car Insurance Comparison',
 'مقارنة تأمين السيارات من سوق المال',
 'Compare car insurance from 20+ UAE providers side-by-side. Get the cheapest quote in 60 seconds.',
 'قارن تأمين السيارات من أكثر من 20 مزوداً في الإمارات. احصل على أرخص عرض في 60 ثانية.',
 500, 20000,
 '{"providers_compared": 20, "quote_time": "60 seconds", "types": "comprehensive, third-party, takaful", "cashback_offer": true}',
 'https://souqalmal.com/car-insurance?utm_source=smartmoney_uae',
 13, 'percentage', true, 'souqalmal');


-- ============================================================
-- HEALTH INSURANCE — 6 additional (total ~8)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, key_features, affiliate_deep_link_en, commission_percentage, commission_type, residency_required, data_source) VALUES

-- Daman Health Essential Plan
('c0000001-0000-0000-0000-000000000007', 'health_insurance',
 'Daman National Health Insurance (Thiqa)',
 'ضمان التأمين الصحي الوطني (ثقة)',
 'Abu Dhabi mandatory health insurance for UAE nationals. Comprehensive coverage with no co-pay for basic services.',
 'تأمين صحي إلزامي لمواطني الإمارات في أبوظبي. تغطية شاملة بدون مشاركة في الدفع للخدمات الأساسية.',
 '{"type": "mandatory", "network": "Abu Dhabi", "co_pay": "none for basic", "maternity": true, "dental": true, "optical": true, "chronic_diseases": true}',
 'https://damanhealth.ae/thiqa?utm_source=smartmoney_uae',
 5, 'percentage', true, 'direct'),

-- Daman Enhanced Plan
('c0000001-0000-0000-0000-000000000007', 'health_insurance',
 'Daman Enhanced Health Plan',
 'خطة ضمان الصحية المحسنة',
 'Enhanced plan for Abu Dhabi visa holders. Wider network including private hospitals. Low co-payment.',
 'خطة محسنة لحاملي تأشيرة أبوظبي. شبكة أوسع تشمل المستشفيات الخاصة.',
 '{"type": "enhanced", "network": "Abu Dhabi + Dubai", "co_pay": "20%", "maternity": true, "dental": "basic", "network_hospitals": "500+", "annual_limit": "AED 500,000"}',
 'https://damanhealth.ae/enhanced?utm_source=smartmoney_uae',
 8, 'percentage', true, 'direct'),

-- Oman Insurance Health
('c0000001-0000-0000-0000-000000000004', 'health_insurance',
 'Oman Insurance Individual Health Plan',
 'خطة عُمان للتأمين الصحي الفردية',
 'Individual and family health plans compliant with DHA and HAAD requirements. International coverage option.',
 'خطط صحية فردية وعائلية متوافقة مع هيئة الصحة. خيار تغطية دولية.',
 '{"type": "individual, family", "compliant": "DHA, HAAD", "international_option": true, "maternity": true, "dental": true, "optical": true, "network_hospitals": "800+"}',
 'https://omaninsurance.ae/health?utm_source=smartmoney_uae',
 10, 'percentage', true, 'direct'),

-- AXA Gulf Health
('c0000001-0000-0000-0000-000000000006', 'health_insurance',
 'AXA Gulf Comprehensive Health Insurance',
 'أكسا الخليج للتأمين الصحي الشامل',
 'International health coverage with direct billing at 1500+ hospitals worldwide. Wellness programs included.',
 'تغطية صحية دولية مع فوترة مباشرة في أكثر من 1500 مستشفى حول العالم.',
 '{"type": "comprehensive international", "direct_billing": true, "network_hospitals": "1500+ worldwide", "maternity": true, "dental": true, "wellness_programs": true, "mental_health": true}',
 'https://axa-gulf.com/health?utm_source=smartmoney_uae',
 12, 'percentage', true, 'direct'),

-- Sukoon Health Takaful
('c0000001-0000-0000-0000-000000000008', 'health_insurance',
 'Sukoon Health Takaful Plan',
 'خطة سكون للتكافل الصحي',
 'Shariah-compliant health insurance. Ethical insurance with competitive rates for families.',
 'تأمين صحي تكافلي متوافق مع الشريعة. تأمين أخلاقي بأسعار تنافسية للعائلات.',
 '{"type": "takaful family", "sharia_compliant": true, "maternity": true, "dental": "basic", "network_hospitals": "400+", "ethical_insurance": true}',
 'https://sukoon.com/health?utm_source=smartmoney_uae',
 9, 'percentage', true, 'direct'),

-- Souqalmal Health Comparison
('c0000001-0000-0000-0000-000000000001', 'health_insurance',
 'Souqalmal Health Insurance Comparison',
 'مقارنة التأمين الصحي من سوق المال',
 'Compare health insurance from 15+ providers. DHA and HAAD compliant plans for individuals, families, and companies.',
 'قارن التأمين الصحي من أكثر من 15 شركة. خطط متوافقة مع هيئة الصحة للأفراد والعائلات والشركات.',
 '{"providers_compared": 15, "types": "individual, family, corporate, domestic help", "compliant": "DHA, HAAD", "free_comparison": true}',
 'https://souqalmal.com/health-insurance?utm_source=smartmoney_uae',
 10, 'percentage', true, 'souqalmal');


-- ============================================================
-- REMITTANCE — Additional corridors (PKR, PHP, BDT)
-- ============================================================

INSERT INTO remittance_rates (provider_id, send_currency, receive_currency, exchange_rate, fee_aed, fee_percentage, transfer_speed_hours, min_transfer_aed, max_transfer_aed, affiliate_link, commission_per_transfer_aed) VALUES
-- AED to PKR
('a0000001-0000-0000-0000-000000000001', 'AED', 'PKR', 76.20, 5.00, 0, 24, 50, 50000, 'https://wise.com/send?source=AED&target=PKR&utm_source=smartmoney_uae', 5.00),
('a0000001-0000-0000-0000-000000000002', 'AED', 'PKR', 75.90, 10.00, 0, 4, 100, 25000, 'https://remitly.com/send?from=AE&to=PK&utm_source=smartmoney_uae', 3.00),
('a0000001-0000-0000-0000-000000000003', 'AED', 'PKR', 75.50, 15.00, 0, 48, 50, 100000, 'https://westernunion.com/send?from=AE&to=PK&utm_source=smartmoney_uae', 4.00),
('a0000001-0000-0000-0000-000000000004', 'AED', 'PKR', 76.00, 0.00, 0, 24, 100, 50000, 'https://alansariexchange.com?utm_source=smartmoney_uae', 2.00),
('a0000001-0000-0000-0000-000000000005', 'AED', 'PKR', 75.80, 0.00, 0, 24, 100, 50000, 'https://uaeexchange.com?utm_source=smartmoney_uae', 2.00),
('a0000001-0000-0000-0000-000000000006', 'AED', 'PKR', 76.10, 0.00, 0, 24, 50, 30000, 'https://luluexchange.com?utm_source=smartmoney_uae', 2.00),
-- AED to PHP
('a0000001-0000-0000-0000-000000000001', 'AED', 'PHP', 15.35, 5.00, 0, 24, 50, 50000, 'https://wise.com/send?source=AED&target=PHP&utm_source=smartmoney_uae', 5.00),
('a0000001-0000-0000-0000-000000000002', 'AED', 'PHP', 15.25, 10.00, 0, 4, 100, 25000, 'https://remitly.com/send?from=AE&to=PH&utm_source=smartmoney_uae', 3.00),
('a0000001-0000-0000-0000-000000000003', 'AED', 'PHP', 15.10, 15.00, 0, 48, 50, 100000, 'https://westernunion.com/send?from=AE&to=PH&utm_source=smartmoney_uae', 4.00),
('a0000001-0000-0000-0000-000000000004', 'AED', 'PHP', 15.28, 0.00, 0, 24, 100, 50000, 'https://alansariexchange.com?utm_source=smartmoney_uae', 2.00),
-- AED to BDT
('a0000001-0000-0000-0000-000000000001', 'AED', 'BDT', 32.50, 5.00, 0, 48, 50, 50000, 'https://wise.com/send?source=AED&target=BDT&utm_source=smartmoney_uae', 5.00),
('a0000001-0000-0000-0000-000000000002', 'AED', 'BDT', 32.30, 10.00, 0, 4, 100, 25000, 'https://remitly.com/send?from=AE&to=BD&utm_source=smartmoney_uae', 3.00),
('a0000001-0000-0000-0000-000000000003', 'AED', 'BDT', 32.00, 15.00, 0, 48, 50, 100000, 'https://westernunion.com/send?from=AE&to=BD&utm_source=smartmoney_uae', 4.00),
('a0000001-0000-0000-0000-000000000004', 'AED', 'BDT', 32.40, 0.00, 0, 24, 100, 50000, 'https://alansariexchange.com?utm_source=smartmoney_uae', 2.00);

