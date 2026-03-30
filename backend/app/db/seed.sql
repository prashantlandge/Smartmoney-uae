-- SmartMoney UAE Seed Data
-- 20 Providers + Products across all categories

-- ============================================================
-- PROVIDERS (20)
-- ============================================================

-- Remittance / Fintech providers
INSERT INTO providers (id, name_en, name_ar, type, website_url, affiliate_network, active) VALUES
('a0000001-0000-0000-0000-000000000001', 'Wise', 'وايز', 'fintech', 'https://wise.com', 'direct', true),
('a0000001-0000-0000-0000-000000000002', 'Remitly', 'ريميتلي', 'fintech', 'https://remitly.com', 'direct', true),
('a0000001-0000-0000-0000-000000000003', 'Western Union', 'ويسترن يونيون', 'fintech', 'https://westernunion.com', 'awin', true),
('a0000001-0000-0000-0000-000000000004', 'Al Ansari Exchange', 'الأنصاري للصرافة', 'exchange_house', 'https://alansariexchange.com', 'direct', true),
('a0000001-0000-0000-0000-000000000005', 'UAE Exchange', 'الإمارات للصرافة', 'exchange_house', 'https://uaeexchange.com', 'direct', true),
('a0000001-0000-0000-0000-000000000006', 'Lulu Exchange', 'لولو للصرافة', 'exchange_house', 'https://luluexchange.com', 'direct', true);

-- Banks
INSERT INTO providers (id, name_en, name_ar, type, website_url, affiliate_network, active) VALUES
('b0000001-0000-0000-0000-000000000001', 'Emirates NBD', 'الإمارات دبي الوطني', 'bank', 'https://emiratesnbd.com', 'direct', true),
('b0000001-0000-0000-0000-000000000002', 'First Abu Dhabi Bank (FAB)', 'بنك أبوظبي الأول', 'bank', 'https://bankfab.com', 'direct', true),
('b0000001-0000-0000-0000-000000000003', 'ADCB', 'بنك أبوظبي التجاري', 'bank', 'https://adcb.com', 'direct', true),
('b0000001-0000-0000-0000-000000000004', 'Mashreq', 'مصرف المشرق', 'bank', 'https://mashreqbank.com', 'direct', true),
('b0000001-0000-0000-0000-000000000005', 'RAKBANK', 'بنك رأس الخيمة الوطني', 'bank', 'https://rakbank.ae', 'yallacompare', true),
('b0000001-0000-0000-0000-000000000006', 'Dubai Islamic Bank', 'بنك دبي الإسلامي', 'bank', 'https://dib.ae', 'direct', true),
('b0000001-0000-0000-0000-000000000007', 'ADIB', 'مصرف أبوظبي الإسلامي', 'bank', 'https://adib.ae', 'direct', true),
('b0000001-0000-0000-0000-000000000008', 'Emirates Islamic', 'الإمارات الإسلامي', 'bank', 'https://emiratesislamic.ae', 'direct', true),
('b0000001-0000-0000-0000-000000000009', 'HSBC UAE', 'إتش إس بي سي الإمارات', 'bank', 'https://hsbc.ae', 'direct', true),
('b0000001-0000-0000-0000-000000000010', 'Standard Chartered UAE', 'ستاندرد تشارترد الإمارات', 'bank', 'https://sc.com/ae', 'direct', true),
('b0000001-0000-0000-0000-000000000011', 'Citibank UAE', 'سيتي بنك الإمارات', 'bank', 'https://citibank.ae', 'direct', true);

-- Aggregators / Insurance
INSERT INTO providers (id, name_en, name_ar, type, website_url, affiliate_network, active) VALUES
('c0000001-0000-0000-0000-000000000001', 'Souqalmal', 'سوق المال', 'fintech', 'https://souqalmal.com', 'souqalmal', true),
('c0000001-0000-0000-0000-000000000002', 'Yallacompare', 'يلا كومبير', 'fintech', 'https://yallacompare.com', 'yallacompare', true),
('c0000001-0000-0000-0000-000000000003', 'Policybazaar UAE', 'بوليسي بازار الإمارات', 'insurance', 'https://policybazaar.ae', 'direct', true);


-- ============================================================
-- PRODUCTS: CREDIT CARDS (5)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_salary_aed, residency_required, nationality_restrictions, employer_categories, representative_rate, rate_type, key_features, affiliate_deep_link_en, commission_amount_aed, commission_type, islamic_compliant, data_source) VALUES

-- 1. Emirates NBD Go4it Cashback
('b0000001-0000-0000-0000-000000000001', 'credit_card',
 'Emirates NBD Go4it Cashback Credit Card',
 'بطاقة الإمارات دبي الوطني كاش باك',
 'Earn up to 5% cashback on dining and entertainment. No annual fee for the first year.',
 'احصل على ما يصل إلى 5% استرداد نقدي على المطاعم والترفيه. بدون رسوم سنوية للسنة الأولى.',
 8000, true, '{}', '{government,listed_company,private,any}',
 3.25, 'variable',
 '{"cashback_rate": "up to 5%", "annual_fee": "AED 0 first year, AED 399 after", "supplementary_cards": "free", "lounge_access": false}',
 'https://emiratesnbd.com/cards/go4it?utm_source=uae_platform',
 250, 'flat', false, 'manual_entry'),

-- 2. FAB Rewards Platinum
('b0000001-0000-0000-0000-000000000002', 'credit_card',
 'FAB Rewards Platinum Credit Card',
 'بطاقة فاب ريواردز البلاتينية',
 'Earn FAB Rewards points on every spend. Airport lounge access included.',
 'اكسب نقاط مكافآت فاب على كل عملية شراء. الدخول إلى صالات المطار مشمول.',
 15000, true, '{}', '{government,listed_company,private}',
 3.49, 'variable',
 '{"rewards_rate": "1 point per AED 1", "annual_fee": "AED 500", "lounge_access": true, "travel_insurance": true}',
 'https://bankfab.com/cards/rewards-platinum?utm_source=uae_platform',
 350, 'flat', false, 'manual_entry'),

-- 3. Mashreq Neo Visa
('b0000001-0000-0000-0000-000000000004', 'credit_card',
 'Mashreq Neo Visa Credit Card',
 'بطاقة مشرق نيو فيزا',
 'Digital-first credit card with instant approval. No minimum salary for UAE nationals.',
 'بطاقة ائتمان رقمية مع موافقة فورية. لا حد أدنى للراتب لمواطني الإمارات.',
 5000, true, '{}', '{government,listed_company,private,self_employed,any}',
 3.15, 'variable',
 '{"cashback_rate": "up to 2%", "annual_fee": "AED 0", "contactless": true, "apple_pay": true}',
 'https://mashreqbank.com/neo?utm_source=uae_platform',
 200, 'flat', false, 'manual_entry'),

-- 4. ADCB TouchPoints Infinite
('b0000001-0000-0000-0000-000000000003', 'credit_card',
 'ADCB TouchPoints Infinite Credit Card',
 'بطاقة أبوظبي التجاري إنفينيت',
 'Premium card with unlimited airport lounge access and up to 10x TouchPoints.',
 'بطاقة متميزة مع دخول غير محدود إلى صالات المطار وحتى 10 أضعاف نقاط المكافآت.',
 30000, true, '{}', '{government,listed_company}',
 3.49, 'variable',
 '{"rewards_rate": "up to 10x points", "annual_fee": "AED 1000", "lounge_access": true, "concierge": true, "travel_insurance": true}',
 'https://adcb.com/cards/infinite?utm_source=uae_platform',
 500, 'flat', false, 'manual_entry'),

-- 5. RAKBANK World Elite
('b0000001-0000-0000-0000-000000000005', 'credit_card',
 'RAKBANK World Elite Mastercard',
 'بطاقة راك بنك وورلد إليت',
 'World Elite benefits with free valet parking and airport transfers.',
 'مزايا وورلد إليت مع خدمة صف السيارات المجانية والتوصيل من وإلى المطار.',
 20000, true, '{}', '{government,listed_company,private}',
 3.39, 'variable',
 '{"cashback_rate": "up to 3%", "annual_fee": "AED 750", "lounge_access": true, "valet_parking": true}',
 'https://rakbank.ae/cards/world-elite?utm_source=uae_platform',
 400, 'flat', false, 'yallacompare');


-- ============================================================
-- PRODUCTS: PERSONAL LOANS (3)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_salary_aed, residency_required, nationality_restrictions, employer_categories, representative_rate, rate_type, min_amount_aed, max_amount_aed, min_tenure_months, max_tenure_months, key_features, affiliate_deep_link_en, commission_percentage, commission_type, islamic_compliant, data_source) VALUES

-- 1. Emirates NBD Personal Loan
('b0000001-0000-0000-0000-000000000001', 'personal_loan',
 'Emirates NBD Personal Loan',
 'قرض شخصي من الإمارات دبي الوطني',
 'Competitive rates starting from 5.99% with salary transfer. Quick approval within 30 minutes.',
 'أسعار تنافسية تبدأ من 5.99% مع تحويل الراتب. موافقة سريعة خلال 30 دقيقة.',
 5000, true, '{}', '{government,listed_company,private,any}',
 5.99, 'fixed', 10000, 1000000, 12, 48,
 '{"processing_fee": "1%", "early_settlement": "1% of outstanding", "salary_transfer_required": true, "insurance_included": true}',
 'https://emiratesnbd.com/loans/personal?utm_source=uae_platform',
 1.5, 'percentage', false, 'manual_entry'),

-- 2. ADCB Personal Loan
('b0000001-0000-0000-0000-000000000003', 'personal_loan',
 'ADCB Personal Loan',
 'قرض شخصي من أبوظبي التجاري',
 'Flexible personal loan with no salary transfer required. Rates from 6.49%.',
 'قرض شخصي مرن بدون تحويل راتب. أسعار تبدأ من 6.49%.',
 10000, true, '{}', '{government,listed_company,private}',
 6.49, 'fixed', 15000, 750000, 12, 48,
 '{"processing_fee": "1.05%", "early_settlement": "1% of outstanding", "salary_transfer_required": false}',
 'https://adcb.com/loans/personal?utm_source=uae_platform',
 1.25, 'percentage', false, 'manual_entry'),

-- 3. HSBC Personal Loan
('b0000001-0000-0000-0000-000000000009', 'personal_loan',
 'HSBC UAE Personal Loan',
 'قرض شخصي من إتش إس بي سي',
 'Premium rates for existing HSBC customers. Loan up to 20x monthly salary.',
 'أسعار مميزة لعملاء إتش إس بي سي الحاليين. قرض يصل إلى 20 ضعف الراتب الشهري.',
 15000, true, '{}', '{government,listed_company}',
 6.99, 'fixed', 20000, 1500000, 12, 48,
 '{"processing_fee": "1.1%", "salary_transfer_required": true, "max_dti_ratio": "50%"}',
 'https://hsbc.ae/loans/personal?utm_source=uae_platform',
 1.0, 'percentage', false, 'manual_entry');


-- ============================================================
-- PRODUCTS: ISLAMIC FINANCE (2)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_salary_aed, residency_required, nationality_restrictions, employer_categories, representative_rate, rate_type, key_features, affiliate_deep_link_en, commission_amount_aed, commission_type, islamic_compliant, data_source) VALUES

-- 1. Dubai Islamic Bank Credit Card
('b0000001-0000-0000-0000-000000000006', 'credit_card',
 'Dubai Islamic Bank Al Islami Credit Card',
 'بطاقة بنك دبي الإسلامي الائتمانية',
 'Sharia-compliant credit card with cashback rewards and no interest charges.',
 'بطاقة ائتمان متوافقة مع الشريعة الإسلامية مع استرداد نقدي وبدون رسوم فائدة.',
 8000, true, '{}', '{government,listed_company,private,any}',
 0, 'fixed',
 '{"cashback_rate": "up to 5%", "annual_fee": "AED 0 first year", "sharia_compliant": true, "profit_rate": "2.99%"}',
 'https://dib.ae/cards/al-islami?utm_source=uae_platform',
 300, 'flat', true, 'manual_entry'),

-- 2. ADIB Personal Finance
('b0000001-0000-0000-0000-000000000007', 'islamic_finance',
 'ADIB Personal Finance',
 'التمويل الشخصي من مصرف أبوظبي الإسلامي',
 'Islamic personal finance with competitive profit rates. Up to AED 2 million.',
 'تمويل شخصي إسلامي بأسعار ربح تنافسية. حتى 2 مليون درهم.',
 10000, true, '{}', '{government,listed_company,private}',
 5.49, 'fixed',
 '{"structure": "murabaha", "profit_rate": "5.49%", "max_amount": "AED 2,000,000", "tenure_up_to": "48 months", "sharia_compliant": true}',
 'https://adib.ae/personal-finance?utm_source=uae_platform',
 400, 'flat', true, 'manual_entry');


-- ============================================================
-- PRODUCTS: REMITTANCE (6)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_amount_aed, max_amount_aed, key_features, affiliate_deep_link_en, commission_amount_aed, commission_type, data_source) VALUES

('a0000001-0000-0000-0000-000000000001', 'remittance',
 'Wise AED to INR Transfer', 'تحويل وايز من الدرهم إلى الروبية',
 'Low-cost international transfers with the real exchange rate. Fees from AED 5.', 'تحويلات دولية منخفضة التكلفة بسعر الصرف الحقيقي.',
 50, 50000, '{"speed": "1-2 business days", "fee_model": "transparent"}',
 'https://wise.com/send?source=AED&target=INR&utm_source=uae_platform', 5, 'flat', 'api'),

('a0000001-0000-0000-0000-000000000002', 'remittance',
 'Remitly AED to INR Transfer', 'تحويل ريميتلي من الدرهم إلى الروبية',
 'Fast money transfers to India with promotional rates for new users.', 'تحويلات مالية سريعة إلى الهند مع أسعار ترويجية للمستخدمين الجدد.',
 100, 25000, '{"speed": "minutes to 2 days", "delivery_options": "bank, mobile wallet, cash pickup"}',
 'https://remitly.com/send?from=AE&to=IN&utm_source=uae_platform', 3, 'flat', 'api'),

('a0000001-0000-0000-0000-000000000003', 'remittance',
 'Western Union AED to INR Transfer', 'تحويل ويسترن يونيون من الدرهم إلى الروبية',
 'Send money to India with cash pickup or bank deposit. Largest agent network.', 'أرسل الأموال إلى الهند مع استلام نقدي أو إيداع بنكي. أكبر شبكة وكلاء.',
 50, 100000, '{"speed": "minutes to 5 days", "delivery_options": "bank, cash pickup, mobile wallet"}',
 'https://westernunion.com/send?from=AE&to=IN&utm_source=uae_platform', 4, 'flat', 'api'),

('a0000001-0000-0000-0000-000000000004', 'remittance',
 'Al Ansari Exchange AED to INR', 'الأنصاري للصرافة تحويل درهم إلى روبية',
 'UAE''s largest exchange house with over 200 branches. Competitive INR rates.', 'أكبر صرافة في الإمارات مع أكثر من 200 فرع. أسعار تنافسية للروبية الهندية.',
 100, 50000, '{"speed": "same day to 2 days", "branches": "200+", "delivery_options": "bank deposit"}',
 'https://alansariexchange.com?utm_source=uae_platform', 2, 'flat', 'scrape'),

('a0000001-0000-0000-0000-000000000005', 'remittance',
 'UAE Exchange AED to INR', 'الإمارات للصرافة تحويل درهم إلى روبية',
 'Trusted exchange house with competitive rates and multiple delivery options.', 'صرافة موثوقة بأسعار تنافسية وخيارات توصيل متعددة.',
 100, 50000, '{"speed": "same day to 2 days", "delivery_options": "bank, cash pickup"}',
 'https://uaeexchange.com?utm_source=uae_platform', 2, 'flat', 'scrape'),

('a0000001-0000-0000-0000-000000000006', 'remittance',
 'Lulu Exchange AED to INR', 'لولو للصرافة تحويل درهم إلى روبية',
 'Popular exchange house among Indian expats with competitive INR rates.', 'صرافة شعبية بين المقيمين الهنود بأسعار تنافسية للروبية.',
 50, 30000, '{"speed": "same day to 2 days", "branches": "90+"}',
 'https://luluexchange.com?utm_source=uae_platform', 2, 'flat', 'scrape');


-- ============================================================
-- PRODUCTS: CAR INSURANCE (2)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, min_amount_aed, max_amount_aed, key_features, affiliate_deep_link_en, commission_percentage, commission_type, data_source) VALUES

('c0000001-0000-0000-0000-000000000002', 'car_insurance',
 'Yallacompare Car Insurance', 'يلا كومبير تأمين سيارات',
 'Compare car insurance from 15+ UAE providers. Get quotes in 2 minutes.', 'قارن تأمين السيارات من أكثر من 15 شركة في الإمارات. احصل على عروض في دقيقتين.',
 800, 15000, '{"providers_compared": 15, "quote_time": "2 minutes", "types": "comprehensive, third-party"}',
 'https://yallacompare.com/car-insurance?utm_source=uae_platform',
 15, 'percentage', 'yallacompare'),

('c0000001-0000-0000-0000-000000000003', 'car_insurance',
 'Policybazaar UAE Car Insurance', 'بوليسي بازار تأمين سيارات',
 'AI-powered car insurance comparison with instant quotes.', 'مقارنة تأمين السيارات بالذكاء الاصطناعي مع عروض فورية.',
 750, 12000, '{"providers_compared": 12, "quote_time": "instant", "cashless_garages": true}',
 'https://policybazaar.ae/car-insurance?utm_source=uae_platform',
 12, 'percentage', 'direct');


-- ============================================================
-- PRODUCTS: HEALTH INSURANCE (2)
-- ============================================================

INSERT INTO products (provider_id, category, name_en, name_ar, description_en, description_ar, key_features, affiliate_deep_link_en, commission_percentage, commission_type, residency_required, data_source) VALUES

('c0000001-0000-0000-0000-000000000002', 'health_insurance',
 'Yallacompare Health Insurance', 'يلا كومبير تأمين صحي',
 'Compare health insurance plans for individuals and families. DHA and HAAD compliant.', 'قارن خطط التأمين الصحي للأفراد والعائلات. متوافق مع هيئة الصحة.',
 '{"types": "individual, family", "compliant": "DHA, HAAD", "providers_compared": 10}',
 'https://yallacompare.com/health-insurance?utm_source=uae_platform',
 10, 'percentage', true, 'yallacompare'),

('c0000001-0000-0000-0000-000000000003', 'health_insurance',
 'Policybazaar UAE Health Insurance', 'بوليسي بازار تأمين صحي',
 'Comprehensive health insurance comparison for UAE residents and families.', 'مقارنة شاملة للتأمين الصحي للمقيمين والعائلات في الإمارات.',
 '{"types": "individual, family, corporate", "compliant": "DHA, HAAD", "network_hospitals": "1000+"}',
 'https://policybazaar.ae/health-insurance?utm_source=uae_platform',
 10, 'percentage', true, 'direct');


-- ============================================================
-- REMITTANCE RATES (initial baseline rates for AED->INR)
-- ============================================================

INSERT INTO remittance_rates (provider_id, send_currency, receive_currency, exchange_rate, fee_aed, fee_percentage, transfer_speed_hours, min_transfer_aed, max_transfer_aed, affiliate_link, commission_per_transfer_aed) VALUES
('a0000001-0000-0000-0000-000000000001', 'AED', 'INR', 22.65, 5.00, 0, 24, 50, 50000,
 'https://wise.com/send?source=AED&target=INR&utm_source=uae_platform', 5.00),
('a0000001-0000-0000-0000-000000000002', 'AED', 'INR', 22.55, 10.00, 0, 4, 100, 25000,
 'https://remitly.com/send?from=AE&to=IN&utm_source=uae_platform', 3.00),
('a0000001-0000-0000-0000-000000000003', 'AED', 'INR', 22.40, 15.00, 0, 48, 50, 100000,
 'https://westernunion.com/send?from=AE&to=IN&utm_source=uae_platform', 4.00),
('a0000001-0000-0000-0000-000000000004', 'AED', 'INR', 22.58, 0.00, 0, 24, 100, 50000,
 'https://alansariexchange.com?utm_source=uae_platform', 2.00),
('a0000001-0000-0000-0000-000000000005', 'AED', 'INR', 22.52, 0.00, 0, 24, 100, 50000,
 'https://uaeexchange.com?utm_source=uae_platform', 2.00),
('a0000001-0000-0000-0000-000000000006', 'AED', 'INR', 22.60, 0.00, 0, 24, 50, 30000,
 'https://luluexchange.com?utm_source=uae_platform', 2.00);
