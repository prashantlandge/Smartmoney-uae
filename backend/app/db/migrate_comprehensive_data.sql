-- Comprehensive product data migration - Credit Cards (Part 1)
-- Updates key_features JSONB with rich data for all products

-- 1. Emirates NBD Go4it Cashback
UPDATE products SET
  description_en = 'One of the UAE''s most popular cashback cards offering up to 5% cashback on dining and entertainment, 3% on groceries, and 1% on everything else. No annual fee in the first year makes it an excellent starter card for mid-income earners.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Platinum",
    "annual_fee_first_year": "AED 0",
    "annual_fee_subsequent": "AED 399",
    "min_salary": "AED 8,000",
    "interest_rate": "3.25% per month",
    "interest_rate_cash": "3.49% per month",
    "cashback_rate": "up to 5%",
    "cashback_categories": {"dining": "5%", "entertainment": "5%", "groceries": "3%", "petrol": "2%", "utilities": "1%", "other": "0.5%"},
    "rewards_program": "Go4it Cashback",
    "welcome_bonus": "AED 500 cashback on spending AED 5,000 in first 60 days",
    "supplementary_cards": "Free (up to 4)",
    "balance_transfer_rate": "1.49% per month for 12 months",
    "foreign_transaction_fee": "2.75%",
    "cash_advance_fee": "AED 99 or 3% (whichever is higher)",
    "late_payment_fee": "AED 200",
    "minimum_payment": "5% of balance or AED 100",
    "lounge_access": false,
    "travel_insurance": false,
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "airport_transfer": false,
    "golf": false,
    "dining_offers": true,
    "entertainment_offers": true,
    "salary_transfer_required": false,
    "sharia_compliant": false,
    "nationalities": "All nationalities with UAE residency",
    "employer_types": "Government, Semi-government, Listed companies, MNCs, Private sector",
    "best_for": "Everyday cashback on dining and groceries"
  }'::jsonb
WHERE id = '21f77ba9-5ec4-4d5a-8544-449330074977';

-- 2. FAB Rewards Platinum
UPDATE products SET
  description_en = 'Earn FAB Rewards points on every purchase with 1 point per AED 1 spent domestically and 2 points per AED 1 internationally. Includes complimentary airport lounge access and comprehensive travel insurance.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Platinum",
    "annual_fee_first_year": "AED 500",
    "annual_fee_subsequent": "AED 500",
    "min_salary": "AED 15,000",
    "interest_rate": "3.49% per month",
    "interest_rate_cash": "3.49% per month",
    "cashback_rate": "N/A (points-based)",
    "rewards_program": "FAB Rewards",
    "earn_rate": "1 point per AED 1 domestic, 2 points per AED 1 international",
    "welcome_bonus": "50,000 FAB Rewards points on AED 10,000 spend in 90 days",
    "supplementary_cards": "1 free, additional AED 250 each",
    "balance_transfer_rate": "1.99% per month",
    "foreign_transaction_fee": "2.50%",
    "cash_advance_fee": "3% or AED 99 minimum",
    "late_payment_fee": "AED 225",
    "minimum_payment": "5% or AED 100",
    "lounge_access": true,
    "lounge_program": "LoungeKey",
    "lounge_visits": "4 complimentary per year",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 750,000",
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "airport_transfer": false,
    "golf": false,
    "dining_offers": true,
    "entertainment_offers": true,
    "salary_transfer_required": false,
    "sharia_compliant": false,
    "nationalities": "All nationalities",
    "employer_types": "Government, Semi-government, Listed companies, MNCs",
    "best_for": "Reward points collectors and frequent travellers"
  }'::jsonb
WHERE id = '278c8120-b148-4da5-8292-69359e6bcca2';

-- 3. FAB Cashback
UPDATE products SET
  description_en = 'A straightforward cashback card from First Abu Dhabi Bank offering unlimited cashback on all categories. Ideal for everyday spending with no complex reward structures.',
  key_features = '{
    "card_network": "Mastercard",
    "card_tier": "World",
    "annual_fee_first_year": "AED 0",
    "annual_fee_subsequent": "AED 399",
    "min_salary": "AED 10,000",
    "interest_rate": "3.25% per month",
    "cashback_rate": "up to 5%",
    "cashback_categories": {"dining": "5%", "groceries": "3%", "petrol": "2%", "online_shopping": "2%", "other": "1%"},
    "rewards_program": "FAB Cashback",
    "welcome_bonus": "AED 300 cashback on AED 3,000 spend in 60 days",
    "supplementary_cards": "Free (up to 3)",
    "foreign_transaction_fee": "2.75%",
    "cash_advance_fee": "3% or AED 99",
    "late_payment_fee": "AED 200",
    "minimum_payment": "5% or AED 100",
    "lounge_access": false,
    "travel_insurance": false,
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "salary_transfer_required": false,
    "sharia_compliant": false,
    "nationalities": "All nationalities",
    "best_for": "Simple unlimited cashback on all spending"
  }'::jsonb
WHERE id = '648e41fe-6c4e-4789-a73d-7c6e8d913ffe';

-- 4. ADCB TouchPoints Infinite
UPDATE products SET
  description_en = 'ADCB''s premium Infinite card offering up to 10x TouchPoints on travel and dining, unlimited worldwide lounge access, dedicated concierge, and comprehensive travel insurance up to AED 1.5M. Requires a minimum salary of AED 30,000.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Infinite",
    "annual_fee_first_year": "AED 1,000",
    "annual_fee_subsequent": "AED 1,000 (waived on AED 250,000 annual spend)",
    "min_salary": "AED 30,000",
    "interest_rate": "3.49% per month",
    "cashback_rate": "N/A (points-based)",
    "rewards_program": "ADCB TouchPoints",
    "earn_rate": "Up to 10x TouchPoints on travel, 5x on dining, 2x on other",
    "cashback_categories": {"travel": "10x points", "dining": "5x points", "groceries": "2x points", "petrol": "2x points", "other": "1x point"},
    "welcome_bonus": "100,000 TouchPoints on AED 15,000 spend in 90 days",
    "supplementary_cards": "2 free, additional AED 500 each",
    "balance_transfer_rate": "0.99% per month for 12 months",
    "foreign_transaction_fee": "2.25%",
    "cash_advance_fee": "3% or AED 150",
    "late_payment_fee": "AED 250",
    "minimum_payment": "5% or AED 200",
    "lounge_access": true,
    "lounge_program": "Priority Pass + LoungeKey",
    "lounge_visits": "Unlimited worldwide",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 1,500,000",
    "purchase_protection": true,
    "concierge": true,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": true,
    "airport_transfer": true,
    "golf": true,
    "dining_offers": true,
    "entertainment_offers": true,
    "salary_transfer_required": false,
    "sharia_compliant": false,
    "nationalities": "All nationalities",
    "employer_types": "Government, Semi-government, Listed companies",
    "best_for": "Premium travel and lifestyle with unlimited lounge access"
  }'::jsonb
WHERE id = '134eca66-8530-4aaf-87ac-9a8ba3d68b0a';

-- 5. ADCB Traveller
UPDATE products SET
  description_en = 'Earn 2 Skywards miles per AED 1 on airlines and hotels with unlimited worldwide lounge access. Premium travel card with golf benefits, hotel discounts, and comprehensive travel insurance.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Signature",
    "annual_fee_first_year": "AED 1,575",
    "annual_fee_subsequent": "AED 1,575",
    "min_salary": "AED 25,000",
    "interest_rate": "3.49% per month",
    "rewards_program": "Emirates Skywards",
    "earn_rate": "2 Skywards miles per AED 1 on travel, 1 mile on other",
    "cashback_categories": {"airlines": "2x miles", "hotels": "2x miles", "dining": "1.5x miles", "other": "1x mile"},
    "welcome_bonus": "25,000 Skywards miles on AED 5,000 spend",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.50%",
    "cash_advance_fee": "3% or AED 100",
    "late_payment_fee": "AED 225",
    "minimum_payment": "5% or AED 100",
    "lounge_access": true,
    "lounge_program": "Priority Pass",
    "lounge_visits": "Unlimited worldwide",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 1,000,000",
    "purchase_protection": true,
    "concierge": true,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": true,
    "airport_transfer": false,
    "golf": true,
    "dining_offers": true,
    "salary_transfer_required": false,
    "nationalities": "All nationalities",
    "best_for": "Skywards miles collectors and frequent flyers"
  }'::jsonb
WHERE id = 'abdf32e3-570c-43a9-8f73-6b7c37534693';

-- 6. Mashreq Neo Visa
UPDATE products SET
  description_en = 'A digital-first credit card with instant online approval and zero annual fees. Perfect for young professionals with a low minimum salary of AED 5,000. Earn up to 2% cashback and enjoy Apple Pay and contactless payments.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Classic",
    "annual_fee_first_year": "AED 0",
    "annual_fee_subsequent": "AED 0 (lifetime free)",
    "min_salary": "AED 5,000",
    "interest_rate": "3.15% per month",
    "cashback_rate": "up to 2%",
    "cashback_categories": {"dining": "2%", "online_shopping": "2%", "groceries": "1%", "other": "0.5%"},
    "rewards_program": "Mashreq Cashback",
    "welcome_bonus": "AED 200 cashback on AED 2,000 spend in 30 days",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.99%",
    "cash_advance_fee": "AED 75 or 3%",
    "late_payment_fee": "AED 150",
    "minimum_payment": "5% or AED 50",
    "lounge_access": false,
    "travel_insurance": false,
    "purchase_protection": false,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "salary_transfer_required": false,
    "sharia_compliant": false,
    "nationalities": "All nationalities (no min salary for UAE nationals)",
    "employer_types": "Government, Semi-government, Listed companies, MNCs, Private, Self-employed",
    "best_for": "Digital-first users wanting zero annual fees"
  }'::jsonb
WHERE id = 'd325b5e1-1903-4061-88a3-d8849818380b';

-- 7. Mashreq Solitaire Visa Infinite
UPDATE products SET
  description_en = 'Mashreq''s ultra-premium Infinite card featuring unlimited lounge access, dedicated concierge, airport meet-and-greet, valet parking, and comprehensive travel insurance. Designed for high-net-worth individuals.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Infinite",
    "annual_fee_first_year": "AED 1,500",
    "annual_fee_subsequent": "AED 1,500",
    "min_salary": "AED 35,000",
    "interest_rate": "3.25% per month",
    "rewards_program": "Mashreq Solitaire Rewards",
    "earn_rate": "3 points per AED 1 on travel, 2 points on dining, 1 point on other",
    "cashback_categories": {"travel": "3x points", "dining": "2x points", "shopping": "1.5x points", "other": "1x point"},
    "welcome_bonus": "75,000 reward points on AED 20,000 spend in 90 days",
    "supplementary_cards": "2 free",
    "foreign_transaction_fee": "2.25%",
    "cash_advance_fee": "3% or AED 150",
    "late_payment_fee": "AED 250",
    "minimum_payment": "5% or AED 200",
    "lounge_access": true,
    "lounge_program": "Priority Pass + DragonPass",
    "lounge_visits": "Unlimited worldwide",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 2,000,000",
    "purchase_protection": true,
    "concierge": true,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": true,
    "airport_transfer": true,
    "golf": true,
    "dining_offers": true,
    "entertainment_offers": true,
    "salary_transfer_required": false,
    "nationalities": "All nationalities",
    "employer_types": "Government, Semi-government, Listed companies",
    "best_for": "Premium lifestyle with unlimited lounge and concierge"
  }'::jsonb
WHERE id = '43418cae-457e-4485-868d-3b336eb5b186';

-- 8. RAKBANK World Elite Mastercard
UPDATE products SET
  description_en = 'RAKBANK''s flagship World Elite card with free valet parking, airport transfers, unlimited lounge access, and up to 3% cashback. Includes Mastercard Priceless experiences and travel protection.',
  key_features = '{
    "card_network": "Mastercard",
    "card_tier": "World Elite",
    "annual_fee_first_year": "AED 750",
    "annual_fee_subsequent": "AED 750",
    "min_salary": "AED 20,000",
    "interest_rate": "3.39% per month",
    "cashback_rate": "up to 3%",
    "cashback_categories": {"dining": "3%", "travel": "3%", "groceries": "2%", "petrol": "1.5%", "other": "1%"},
    "rewards_program": "RAKBANK Cashback",
    "welcome_bonus": "AED 750 cashback on AED 7,500 spend in 60 days",
    "supplementary_cards": "2 free",
    "foreign_transaction_fee": "2.75%",
    "cash_advance_fee": "3% or AED 99",
    "late_payment_fee": "AED 200",
    "minimum_payment": "5% or AED 100",
    "lounge_access": true,
    "lounge_program": "LoungeKey",
    "lounge_visits": "8 complimentary per year",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 1,000,000",
    "purchase_protection": true,
    "concierge": true,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": true,
    "airport_transfer": true,
    "golf": false,
    "dining_offers": true,
    "salary_transfer_required": false,
    "nationalities": "All nationalities",
    "best_for": "Cashback with premium travel perks and valet parking"
  }'::jsonb
WHERE id = '0dcc01c2-9f50-4dca-870e-7b28a4526a27';

-- 9. RAKBANK Titanium
UPDATE products SET
  description_en = 'A mid-tier cashback card from RAKBANK offering up to 2% cashback, no annual fee in the first year, and a low salary requirement of AED 7,000. Great value for salaried professionals.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Titanium",
    "annual_fee_first_year": "AED 0",
    "annual_fee_subsequent": "AED 350",
    "min_salary": "AED 7,000",
    "interest_rate": "3.39% per month",
    "cashback_rate": "up to 2%",
    "cashback_categories": {"dining": "2%", "groceries": "1.5%", "petrol": "1%", "other": "0.5%"},
    "welcome_bonus": "AED 200 cashback on AED 3,000 spend",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.99%",
    "cash_advance_fee": "3% or AED 75",
    "late_payment_fee": "AED 175",
    "minimum_payment": "5% or AED 100",
    "lounge_access": false,
    "travel_insurance": false,
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "salary_transfer_required": false,
    "nationalities": "All nationalities",
    "employer_types": "All employer types",
    "best_for": "Mid-income earners wanting no-fee cashback card"
  }'::jsonb
WHERE id = '364e8bf2-df80-452f-b2f4-d33ce86d533f';
-- Comprehensive product data - Credit Cards Part 2 + Islamic Cards

-- 10. ADIB Covered Card Visa Signature
UPDATE products SET
  description_en = 'ADIB''s flagship Sharia-compliant covered card with up to 3% cashback on dining, 2% on groceries, and no interest charges — only a fixed monthly fee. Ideal for Islamic banking customers who want cashback rewards.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Signature",
    "annual_fee_first_year": "AED 400",
    "annual_fee_subsequent": "AED 400",
    "min_salary": "AED 12,000",
    "interest_rate": "N/A (fixed monthly fee: 2.75%)",
    "cashback_rate": "up to 3%",
    "cashback_categories": {"dining": "3%", "groceries": "2%", "petrol": "1%", "online_shopping": "1.5%", "other": "0.5%"},
    "rewards_program": "ADIB Cashback",
    "welcome_bonus": "AED 300 cashback on AED 5,000 spend in 60 days",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.75%",
    "late_payment_fee": "AED 200 (donated to charity)",
    "minimum_payment": "5% or AED 100",
    "lounge_access": true,
    "lounge_program": "LoungeKey",
    "lounge_visits": "2 complimentary per quarter",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 500,000",
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "salary_transfer_required": false,
    "sharia_compliant": true,
    "nationalities": "All nationalities",
    "best_for": "Islamic cashback with no interest charges"
  }'::jsonb
WHERE id = 'c3ac71c6-c127-42ea-a4f1-9cfe89c572af';

-- 11. DIB Al Islami Credit Card
UPDATE products SET
  description_en = 'Dubai Islamic Bank''s popular Sharia-compliant credit card offering up to 5% cashback, zero annual fee in the first year, and no interest. Late fees are donated to charity in accordance with Islamic principles.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Gold",
    "annual_fee_first_year": "AED 0",
    "annual_fee_subsequent": "AED 300",
    "min_salary": "AED 8,000",
    "interest_rate": "N/A (profit rate: 2.99% per month)",
    "cashback_rate": "up to 5%",
    "cashback_categories": {"dining": "5%", "groceries": "3%", "petrol": "2%", "shopping": "1%", "other": "0.5%"},
    "rewards_program": "DIB Cashback",
    "welcome_bonus": "AED 200 cashback on AED 3,000 spend",
    "supplementary_cards": "Free (up to 3)",
    "foreign_transaction_fee": "2.75%",
    "late_payment_fee": "AED 175 (donated to charity)",
    "minimum_payment": "5% or AED 100",
    "lounge_access": false,
    "travel_insurance": false,
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": false,
    "salary_transfer_required": false,
    "sharia_compliant": true,
    "nationalities": "All nationalities",
    "employer_types": "Government, Semi-government, Listed companies, MNCs, Private",
    "best_for": "Sharia-compliant cashback with zero first-year fee"
  }'::jsonb
WHERE id = 'f650b2ab-d991-434a-91c2-9a9ecced40b3';

-- 12. Emirates Islamic Skywards Signature
UPDATE products SET
  description_en = 'Earn Emirates Skywards miles on every purchase with this Sharia-compliant card. 3 miles per AED 1 on airlines and hotels, unlimited lounge access, and no interest charges — only profit-based fees.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Signature",
    "annual_fee_first_year": "AED 900",
    "annual_fee_subsequent": "AED 900",
    "min_salary": "AED 20,000",
    "interest_rate": "N/A (profit rate: 2.99% per month)",
    "rewards_program": "Emirates Skywards",
    "earn_rate": "3 Skywards miles per AED 1 on airlines/hotels, 1 mile on other",
    "cashback_categories": {"airlines": "3x miles", "hotels": "3x miles", "dining": "2x miles", "other": "1x mile"},
    "welcome_bonus": "30,000 Skywards miles on AED 5,000 spend",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.50%",
    "late_payment_fee": "AED 225 (donated to charity)",
    "minimum_payment": "5% or AED 100",
    "lounge_access": true,
    "lounge_program": "Marhaba Lounge + Priority Pass",
    "lounge_visits": "Unlimited",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 1,000,000",
    "purchase_protection": true,
    "concierge": true,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "valet_parking": true,
    "airport_transfer": false,
    "golf": false,
    "salary_transfer_required": false,
    "sharia_compliant": true,
    "nationalities": "All nationalities",
    "best_for": "Islamic Skywards miles with premium travel benefits"
  }'::jsonb
WHERE id = '752e87ac-f4e7-4b5d-ba2d-ad13db012699';

-- 13. HSBC Live+
UPDATE products SET
  description_en = 'HSBC''s lifestyle credit card with accelerated rewards on dining and entertainment. Earn 5x points on dining, 3x on entertainment, and enjoy exclusive HSBC Entertainer offers for buy-one-get-one dining deals.',
  key_features = '{
    "card_network": "Visa",
    "card_tier": "Platinum",
    "annual_fee_first_year": "AED 0",
    "annual_fee_subsequent": "AED 450",
    "min_salary": "AED 15,000",
    "interest_rate": "3.49% per month",
    "rewards_program": "HSBC Rewards+",
    "earn_rate": "5x points on dining, 3x on entertainment, 1x on other",
    "cashback_categories": {"dining": "5x points", "entertainment": "3x points", "shopping": "2x points", "other": "1x point"},
    "welcome_bonus": "40,000 reward points on AED 5,000 spend in 60 days",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.75%",
    "cash_advance_fee": "3% or AED 99",
    "late_payment_fee": "AED 200",
    "minimum_payment": "5% or AED 100",
    "lounge_access": false,
    "travel_insurance": false,
    "purchase_protection": true,
    "concierge": false,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "dining_offers": true,
    "entertainment_offers": true,
    "salary_transfer_required": false,
    "nationalities": "All nationalities",
    "best_for": "Dining and entertainment enthusiasts"
  }'::jsonb
WHERE id = 'bd019e3b-c9d6-4769-914e-d673e57b9636';

-- 14. HSBC Cash+
UPDATE products SET
  description_en = 'HSBC''s dedicated cashback card offering up to 3% unlimited cashback on all spending categories. Simple and transparent with no points to track. Fee waived on AED 100,000 annual spend.',
  key_features = '{
    "card_network": "Mastercard",
    "card_tier": "World",
    "annual_fee_first_year": "AED 500",
    "annual_fee_subsequent": "AED 500 (waived on AED 100,000 spend)",
    "min_salary": "AED 15,000",
    "interest_rate": "3.49% per month",
    "cashback_rate": "up to 3%",
    "cashback_categories": {"dining": "3%", "groceries": "2%", "petrol": "2%", "utilities": "1%", "other": "1%"},
    "rewards_program": "HSBC Cash+",
    "welcome_bonus": "AED 500 cashback on AED 5,000 spend in 60 days",
    "supplementary_cards": "1 free",
    "foreign_transaction_fee": "2.75%",
    "cash_advance_fee": "3% or AED 99",
    "late_payment_fee": "AED 200",
    "minimum_payment": "5% or AED 100",
    "lounge_access": true,
    "lounge_program": "LoungeKey",
    "lounge_visits": "4 per year",
    "travel_insurance": true,
    "travel_insurance_coverage": "Up to AED 500,000",
    "purchase_protection": true,
    "contactless": true,
    "apple_pay": true,
    "samsung_pay": true,
    "salary_transfer_required": false,
    "nationalities": "All nationalities",
    "best_for": "Straightforward high-value cashback"
  }'::jsonb
WHERE id = '59c36604-9ce6-467d-b7e4-cb37cd9b9740';

-- 15-21: Remaining credit cards (Citibank, CBD, Liv, SC, Wio)
UPDATE products SET
  description_en = 'Earn ThankYou reward points on every purchase with accelerated earning on dining and travel. Redeem points for flights, merchandise, or statement credit.',
  key_features = '{"card_network":"Visa","card_tier":"Rewards","annual_fee_first_year":"AED 0","annual_fee_subsequent":"AED 350","min_salary":"AED 10,000","interest_rate":"3.49% per month","rewards_program":"Citi ThankYou","earn_rate":"3x points on dining, 2x on travel, 1x on other","cashback_categories":{"dining":"3x points","travel":"2x points","shopping":"1x point","other":"1x point"},"welcome_bonus":"30,000 ThankYou points on AED 5,000 spend","supplementary_cards":"1 free","foreign_transaction_fee":"2.75%","late_payment_fee":"AED 200","minimum_payment":"5% or AED 100","lounge_access":false,"travel_insurance":false,"contactless":true,"apple_pay":true,"samsung_pay":true,"salary_transfer_required":false,"nationalities":"All nationalities","best_for":"Reward points with global redemption options"}'::jsonb
WHERE id = '440a4329-68a7-42b2-bb34-8c39e72ddcc8';

UPDATE products SET
  description_en = 'Citibank''s pure cashback card with up to 4% cashback on supermarket and utility spending, 2% on dining, and 0.5% on everything else. No cap on cashback earned.',
  key_features = '{"card_network":"Mastercard","card_tier":"World","annual_fee_first_year":"AED 0","annual_fee_subsequent":"AED 500","min_salary":"AED 15,000","interest_rate":"3.49% per month","cashback_rate":"up to 4%","cashback_categories":{"supermarkets":"4%","utilities":"4%","dining":"2%","petrol":"1%","other":"0.5%"},"rewards_program":"Citi Cashback","welcome_bonus":"AED 400 cashback on AED 5,000 spend","supplementary_cards":"1 free","foreign_transaction_fee":"2.50%","late_payment_fee":"AED 225","minimum_payment":"5% or AED 100","lounge_access":true,"lounge_program":"LoungeKey","lounge_visits":"2 per year","travel_insurance":true,"travel_insurance_coverage":"Up to AED 500,000","contactless":true,"apple_pay":true,"samsung_pay":true,"salary_transfer_required":false,"nationalities":"All nationalities","best_for":"High cashback on supermarkets and utilities"}'::jsonb
WHERE id = '95d8b506-4585-4eba-bf32-c9fddc76b79e';

UPDATE products SET
  description_en = 'CBD''s flagship World Mastercard with up to 4% cashback, worldwide lounge access, comprehensive travel insurance, and golf benefits. Low annual fee for premium tier features.',
  key_features = '{"card_network":"Mastercard","card_tier":"World","annual_fee_first_year":"AED 500","annual_fee_subsequent":"AED 500","min_salary":"AED 15,000","interest_rate":"3.39% per month","cashback_rate":"up to 4%","cashback_categories":{"dining":"4%","travel":"3%","groceries":"2%","petrol":"1.5%","other":"0.5%"},"welcome_bonus":"AED 500 cashback on AED 5,000 spend","supplementary_cards":"1 free","foreign_transaction_fee":"2.50%","late_payment_fee":"AED 200","minimum_payment":"5% or AED 100","lounge_access":true,"lounge_program":"LoungeKey","lounge_visits":"6 per year","travel_insurance":true,"travel_insurance_coverage":"Up to AED 750,000","purchase_protection":true,"contactless":true,"apple_pay":true,"samsung_pay":true,"golf":true,"salary_transfer_required":false,"nationalities":"All nationalities","best_for":"Value premium card with golf and lounge"}'::jsonb
WHERE id = '4c2c299c-007a-41e2-ab24-45e2a3e2e4bb';

UPDATE products SET
  description_en = 'A sleek metal card from Liv. (Emirates NBD''s digital bank) with up to 3% cashback on all spending, Apple Pay integration, and a fully digital experience. No annual fee forever for qualifying customers.',
  key_features = '{"card_network":"Visa","card_tier":"Platinum (Metal)","annual_fee_first_year":"AED 0","annual_fee_subsequent":"AED 0 (with salary transfer)","min_salary":"AED 5,000","interest_rate":"3.25% per month","cashback_rate":"up to 3%","cashback_categories":{"dining":"3%","online_shopping":"3%","groceries":"2%","entertainment":"2%","other":"1%"},"welcome_bonus":"AED 200 cashback on AED 2,000 spend","supplementary_cards":"Not available","foreign_transaction_fee":"2.75%","late_payment_fee":"AED 150","minimum_payment":"5% or AED 100","lounge_access":false,"travel_insurance":false,"contactless":true,"apple_pay":true,"samsung_pay":true,"online_banking":true,"salary_transfer_required":true,"nationalities":"All nationalities","employer_types":"All employer types","best_for":"Digital-first millennials wanting a metal card"}'::jsonb
WHERE id = '0d418b3e-23eb-47f8-b4fd-fcd63289c44d';

UPDATE products SET
  description_en = 'Standard Chartered''s unlimited cashback card with up to 3% on dining and travel, and 1% on everything else. Includes 2 complimentary lounge visits per quarter.',
  key_features = '{"card_network":"Visa","card_tier":"Platinum","annual_fee_first_year":"AED 0","annual_fee_subsequent":"AED 400","min_salary":"AED 10,000","interest_rate":"3.49% per month","cashback_rate":"up to 3%","cashback_categories":{"dining":"3%","travel":"3%","groceries":"1.5%","other":"1%"},"welcome_bonus":"AED 300 on AED 3,000 spend","supplementary_cards":"1 free","foreign_transaction_fee":"2.75%","late_payment_fee":"AED 200","minimum_payment":"5% or AED 100","lounge_access":true,"lounge_program":"LoungeKey","lounge_visits":"2 per quarter","travel_insurance":true,"travel_insurance_coverage":"Up to AED 500,000","contactless":true,"apple_pay":true,"samsung_pay":true,"salary_transfer_required":false,"nationalities":"All nationalities","best_for":"Cashback with quarterly lounge access"}'::jsonb
WHERE id = '9b801840-bc5f-4ee4-b4ed-451c9f6db68c';

UPDATE products SET
  description_en = 'Standard Chartered''s most premium card with unlimited worldwide lounge access, dedicated concierge, comprehensive travel insurance, and accelerated rewards on international spending.',
  key_features = '{"card_network":"Visa","card_tier":"Infinite","annual_fee_first_year":"AED 1,200","annual_fee_subsequent":"AED 1,200","min_salary":"AED 30,000","interest_rate":"3.49% per month","rewards_program":"SC Rewards","earn_rate":"3x points international, 2x domestic dining, 1x other","welcome_bonus":"100,000 reward points on AED 15,000 spend","supplementary_cards":"2 free","foreign_transaction_fee":"2.25%","late_payment_fee":"AED 250","minimum_payment":"5% or AED 200","lounge_access":true,"lounge_program":"Priority Pass","lounge_visits":"Unlimited worldwide","travel_insurance":true,"travel_insurance_coverage":"Up to AED 2,000,000","purchase_protection":true,"concierge":true,"contactless":true,"apple_pay":true,"samsung_pay":true,"valet_parking":true,"airport_transfer":true,"golf":true,"salary_transfer_required":false,"nationalities":"All nationalities","best_for":"Premium unlimited worldwide lounge access"}'::jsonb
WHERE id = '7e12350d-f587-44e1-bdf5-a40d2cf734fb';

UPDATE products SET
  description_en = 'Wio Bank''s modern cashback card offering up to 5% cashback on select partners and 1% on all other purchases. Fully managed through the Wio app with instant virtual card issuance.',
  key_features = '{"card_network":"Visa","card_tier":"Classic","annual_fee_first_year":"AED 0","annual_fee_subsequent":"AED 0 (lifetime free)","min_salary":"AED 3,000","interest_rate":"3.15% per month","cashback_rate":"up to 5%","cashback_categories":{"wio_partners":"5%","dining":"2%","groceries":"2%","other":"1%"},"welcome_bonus":"AED 100 cashback on first AED 1,000 spend","supplementary_cards":"Not available","foreign_transaction_fee":"2.99%","late_payment_fee":"AED 100","minimum_payment":"5% or AED 50","lounge_access":false,"travel_insurance":false,"contactless":true,"apple_pay":true,"samsung_pay":true,"online_banking":true,"salary_transfer_required":false,"nationalities":"All nationalities","employer_types":"All (including freelancers)","best_for":"Digital-native banking with partner cashback"}'::jsonb
WHERE id = '6d9fe47c-25b0-4efd-95c2-6d07887554f2';
-- Comprehensive product data - Personal Loans (10 products)

UPDATE products SET
  description_en = 'Emirates NBD''s flagship personal loan with rates starting from 5.99% flat for salary transfer customers. Quick 30-minute approval with same-day disbursement. Loan up to 20x monthly salary with flexible tenure up to 48 months.',
  key_features = '{"interest_rate":"Starting from 5.99% flat p.a.","flat_rate":"5.99% p.a. (with salary transfer)","reducing_rate":"10.99% p.a.","processing_fee":"1% of loan amount (min AED 525)","min_amount":"AED 10,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 5,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding balance","late_payment_fee":"AED 250","insurance":"Life insurance included (0.8% of loan)","dbr":"50% debt burden ratio","approval_time":"30 minutes","disbursement_time":"Same day","documents_required":["Emirates ID (front and back)","Salary certificate (dated within 30 days)","Bank statements (last 3 months)","Passport copy with valid visa page","Salary transfer letter"],"nationalities":"All nationalities with UAE residency","employer_types":"Government, Semi-government, Listed companies, MNCs, Private (selected)","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Salary transfer customers wanting lowest rates"}'::jsonb
WHERE id = '57387d53-eebd-40ee-91d5-67b4d490d103';

UPDATE products SET
  description_en = 'ADCB''s flexible personal loan with no salary transfer required. Rates from 6.49% flat with loan amounts up to AED 750,000. Suitable for professionals at listed companies and government employees.',
  key_features = '{"interest_rate":"Starting from 6.49% flat p.a.","flat_rate":"6.49% p.a. (no salary transfer)","reducing_rate":"11.99% p.a.","processing_fee":"1.05% of loan amount","min_amount":"AED 15,000","max_amount":"AED 750,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 10,000","salary_transfer_required":false,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 225","insurance":"Life insurance optional (0.7% of loan)","dbr":"50%","approval_time":"2 hours","disbursement_time":"Same day to next business day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy with visa"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies, MNCs","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"No salary transfer with competitive rates"}'::jsonb
WHERE id = 'b29c49e8-484b-48cd-90a2-feb398609fb8';

UPDATE products SET
  description_en = 'FAB Personal Loan with competitive rates from 6.25% for FAB salary transfer customers. Up to AED 1,000,000 loan with flexible repayment over 48 months.',
  key_features = '{"interest_rate":"Starting from 6.25% flat p.a.","flat_rate":"6.25% p.a. (salary transfer)","reducing_rate":"11.49% p.a.","processing_fee":"1% of loan amount (min AED 500)","min_amount":"AED 10,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 10,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200","insurance":"Life insurance included","dbr":"50%","approval_time":"1 hour","disbursement_time":"Same day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport with valid visa"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies, MNCs","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"FAB salary transfer customers"}'::jsonb
WHERE id = 'd59b8687-7fbd-49ac-8279-91618f6f0e45';

UPDATE products SET
  description_en = 'HSBC''s premium personal loan for existing customers offering rates from 6.99% and up to 20x monthly salary. Exclusive rates for HSBC Premier customers.',
  key_features = '{"interest_rate":"Starting from 6.99% flat p.a.","flat_rate":"6.99% p.a.","reducing_rate":"12.49% p.a.","processing_fee":"1.1% of loan amount","min_amount":"AED 20,000","max_amount":"AED 1,500,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 15,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 250","insurance":"Life insurance included","dbr":"50%","approval_time":"24 hours","disbursement_time":"1-2 business days","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport with valid visa","HSBC account statement"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Existing HSBC customers and high earners"}'::jsonb
WHERE id = 'e4444080-4c48-46c4-9006-26ea48826155';

UPDATE products SET
  description_en = 'Mashreq''s quick personal loan with online application and instant pre-approval. Rates from 6.25% flat with flexible tenure. Neo app customers get faster processing.',
  key_features = '{"interest_rate":"Starting from 6.25% flat p.a.","flat_rate":"6.25% p.a.","reducing_rate":"11.49% p.a.","processing_fee":"1% of loan amount","min_amount":"AED 10,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 5,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200","insurance":"Life insurance included (0.85%)","dbr":"50%","approval_time":"30 minutes (Neo app)","disbursement_time":"Same day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies, MNCs, Private","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Quick approval via Neo digital banking"}'::jsonb
WHERE id = '5dab02df-3001-467b-ae79-e61289f65b67';

UPDATE products SET
  description_en = 'RAKBANK personal loan with one of the lowest salary requirements at AED 5,000. Rates from 5.99% flat. Up to AED 500,000 with flexible tenure options.',
  key_features = '{"interest_rate":"Starting from 5.99% flat p.a.","flat_rate":"5.99% p.a. (salary transfer)","reducing_rate":"10.99% p.a.","processing_fee":"1% of loan amount (min AED 500)","min_amount":"AED 5,000","max_amount":"AED 500,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 5,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 175","insurance":"Life insurance optional","dbr":"50%","approval_time":"1 hour","disbursement_time":"Same day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"nationalities":"All nationalities","employer_types":"All employer types","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Low salary earners needing quick financing"}'::jsonb
WHERE id = 'fcbc26bb-61fa-4fd6-98f6-fccc85c7194f';

UPDATE products SET
  description_en = 'Standard Chartered personal loan with competitive rates and fast processing. Pre-approved offers for existing SC customers with rates from 6.49%.',
  key_features = '{"interest_rate":"Starting from 6.49% flat p.a.","flat_rate":"6.49% p.a.","reducing_rate":"11.99% p.a.","processing_fee":"1% of loan amount","min_amount":"AED 15,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 15,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 225","insurance":"Life insurance included","dbr":"50%","approval_time":"2 hours","disbursement_time":"Next business day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Existing SC customers with pre-approved offers"}'::jsonb
WHERE id = 'edac5ba6-52d8-4003-adee-eee5fbb1a1e6';

UPDATE products SET
  description_en = 'Citibank personal loan with global banking benefits. Rates from 6.75% flat with up to AED 1 million financing for Citi banking customers.',
  key_features = '{"interest_rate":"Starting from 6.75% flat p.a.","flat_rate":"6.75% p.a.","reducing_rate":"12.25% p.a.","processing_fee":"1.05% of loan amount","min_amount":"AED 20,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 15,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 225","insurance":"Life insurance included","dbr":"50%","approval_time":"4 hours","disbursement_time":"1-2 business days","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport with valid visa"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies, MNCs","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Citi banking customers and international professionals"}'::jsonb
WHERE id = '9907d13e-1705-4c48-80ac-c702da05d879';

UPDATE products SET
  description_en = 'CBD personal loan with flexible repayment options and competitive rates from 6.49%. No salary transfer option available at slightly higher rates.',
  key_features = '{"interest_rate":"Starting from 6.49% flat p.a.","flat_rate":"6.49% p.a. (salary transfer)","reducing_rate":"11.99% p.a.","processing_fee":"1% of loan amount","min_amount":"AED 10,000","max_amount":"AED 750,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 8,000","salary_transfer_required":false,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200","insurance":"Life insurance optional","dbr":"50%","approval_time":"2 hours","disbursement_time":"Same day to next business day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"nationalities":"All nationalities","employer_types":"Government, Semi-government, Listed companies, MNCs, Private","top_up":true,"balance_transfer":true,"online_application":true,"best_for":"Flexible loan without mandatory salary transfer"}'::jsonb
WHERE id = 'f8b5f960-cfb4-4002-84af-6c776271332e';

UPDATE products SET
  description_en = 'Liv.''s fully digital personal loan with instant approval through the Liv. app. Competitive rates for Emirates NBD ecosystem customers with paperless processing.',
  key_features = '{"interest_rate":"Starting from 6.49% flat p.a.","flat_rate":"6.49% p.a.","reducing_rate":"11.99% p.a.","processing_fee":"1% of loan amount","min_amount":"AED 5,000","max_amount":"AED 300,000","min_tenure":"12 months","max_tenure":"36 months","min_salary":"AED 5,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 150","insurance":"Life insurance included","dbr":"50%","approval_time":"Instant (in-app)","disbursement_time":"Immediate","documents_required":["Emirates ID (scanned in app)","Salary auto-verified via banking data"],"nationalities":"All nationalities","employer_types":"All employer types","top_up":false,"balance_transfer":false,"online_application":true,"best_for":"Instant digital loans via mobile app"}'::jsonb
WHERE id = '1718d471-44e9-47a6-a42c-809f5ead4620';
-- Comprehensive product data - Islamic Finance (9 products)

UPDATE products SET
  description_en = 'ADIB Personal Finance based on Murabaha structure with competitive profit rates from 5.49%. Up to AED 2 million financing for UAE residents. All transactions supervised by ADIB Fatwa & Sharia Supervisory Board.',
  key_features = '{"finance_type":"Personal Finance","structure_type":"Murabaha","profit_rate":"From 5.49% per annum (reducing)","processing_fee":"1% of finance amount","min_amount":"AED 10,000","max_amount":"AED 2,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 10,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding (max 3 months profit)","late_payment_fee":"AED 250 (donated to charity)","takaful":"Takaful life cover included","sharia_board":"ADIB Fatwa & Sharia Supervisory Board","approval_time":"24-48 hours","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy with valid visa"],"sharia_compliant":true,"best_for":"Sharia-compliant personal financing with competitive rates"}'::jsonb
WHERE id = '2c128600-855f-463c-bbf9-d2fdb3261651';

UPDATE products SET
  description_en = 'ADIB Ghina Savings Account is a Sharia-compliant savings solution offering competitive profit rates based on Wakala structure. No minimum balance requirement with monthly profit distribution.',
  key_features = '{"finance_type":"Savings Account","structure_type":"Wakala","profit_rate":"Up to 4.25% per annum","processing_fee":"None","min_amount":"AED 0 (no minimum balance)","max_amount":"No limit","min_salary":"No requirement","salary_transfer_required":false,"early_settlement_fee":"N/A","late_payment_fee":"N/A","takaful":"N/A","sharia_board":"ADIB Fatwa & Sharia Supervisory Board","approval_time":"Same day","documents_required":["Emirates ID","Passport copy"],"sharia_compliant":true,"best_for":"Halal savings with competitive returns"}'::jsonb
WHERE id = '92d13dbf-bf20-420d-a75d-9247b251757b';

UPDATE products SET
  description_en = 'ADIB Home Finance with Ijarah structure for purchasing or building your dream home. Finance up to AED 15 million with tenure up to 25 years. Competitive profit rates for UAE nationals and residents.',
  key_features = '{"finance_type":"Home Finance","structure_type":"Ijarah (lease-to-own)","profit_rate":"From 4.49% per annum (variable)","processing_fee":"1% of finance amount (max AED 15,000)","min_amount":"AED 250,000","max_amount":"AED 15,000,000","min_tenure":"60 months","max_tenure":"300 months (25 years)","min_salary":"AED 15,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 500 (donated to charity)","takaful":"Property Takaful required","sharia_board":"ADIB Fatwa & Sharia Supervisory Board","approval_time":"5-7 business days","documents_required":["Emirates ID","Salary certificate","Bank statements (6 months)","Property valuation report","Title deed or sales agreement","Passport with valid visa"],"sharia_compliant":true,"best_for":"Islamic home purchase financing up to 25 years"}'::jsonb
WHERE id = '7ad70a2d-792b-40dd-afcf-0f35f1754d35';

UPDATE products SET
  description_en = 'Ajman Bank personal finance based on Murabaha structure. Accessible Islamic financing option with lower salary requirements. Available for all UAE residents.',
  key_features = '{"finance_type":"Personal Finance","structure_type":"Murabaha","profit_rate":"From 5.99% per annum (reducing)","processing_fee":"1% of finance amount","min_amount":"AED 10,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 5,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200 (donated to charity)","takaful":"Takaful life cover included","sharia_board":"Ajman Bank Sharia Board","approval_time":"24-48 hours","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"sharia_compliant":true,"best_for":"Accessible Islamic personal financing"}'::jsonb
WHERE id = '09805351-1038-4529-949a-f21492d6410b';

UPDATE products SET
  description_en = 'DIB Auto Finance for purchasing new or pre-owned vehicles. Up to 80% financing with competitive profit rates. Quick processing with dedicated auto finance team.',
  key_features = '{"finance_type":"Auto Finance","structure_type":"Murabaha","profit_rate":"From 2.49% per annum (flat)","processing_fee":"AED 525","min_amount":"AED 20,000","max_amount":"AED 500,000","min_tenure":"12 months","max_tenure":"60 months","min_salary":"AED 8,000","salary_transfer_required":false,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200 (donated to charity)","takaful":"Comprehensive car Takaful required","sharia_board":"DIB Sharia Supervisory Board","approval_time":"Same day","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Vehicle quotation from dealer","Driving license"],"sharia_compliant":true,"best_for":"Islamic car financing with low profit rates"}'::jsonb
WHERE id = '810b55dc-ece6-4280-8666-c31f248ddfc3';

UPDATE products SET
  description_en = 'DIB Personal Finance offering competitive Murabaha-based financing up to AED 3 million. Flexible tenure and quick approvals with profit rates from 4.99%. All fees in compliance with Sharia principles.',
  key_features = '{"finance_type":"Personal Finance","structure_type":"Murabaha","profit_rate":"From 4.99% per annum (reducing)","processing_fee":"1% of finance amount","min_amount":"AED 10,000","max_amount":"AED 3,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 8,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 250 (donated to charity)","takaful":"Takaful life cover included","sharia_board":"DIB Sharia Supervisory Board","approval_time":"24 hours","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport with valid visa"],"sharia_compliant":true,"best_for":"High-value Islamic personal financing up to AED 3M"}'::jsonb
WHERE id = '906cbea1-ad9b-434b-8371-25a045d48c59';

UPDATE products SET
  description_en = 'Emirates Islamic personal finance with Murabaha structure and competitive profit rates. Part of Emirates NBD Group, offering seamless banking integration and quick processing.',
  key_features = '{"finance_type":"Personal Finance","structure_type":"Murabaha","profit_rate":"From 5.25% per annum (reducing)","processing_fee":"1% of finance amount","min_amount":"AED 10,000","max_amount":"AED 1,500,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 8,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200 (donated to charity)","takaful":"Takaful life cover included","sharia_board":"Emirates Islamic Fatwa Committee","approval_time":"24-48 hours","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"sharia_compliant":true,"best_for":"Emirates NBD customers wanting Islamic financing"}'::jsonb
WHERE id = '996e094f-312e-4468-9b76-b97f348e3211';

UPDATE products SET
  description_en = 'Emirates Islamic Kunooz Savings Account based on Mudaraba principle. Prize-linked savings with monthly and quarterly draws for cash prizes. Minimum AED 1,000 balance to qualify.',
  key_features = '{"finance_type":"Savings Account","structure_type":"Mudaraba (prize-linked)","profit_rate":"Profit shared based on Mudaraba ratio","processing_fee":"None","min_amount":"AED 1,000 (to qualify for draws)","max_amount":"No limit","min_salary":"No requirement","salary_transfer_required":false,"early_settlement_fee":"N/A","late_payment_fee":"N/A","takaful":"N/A","sharia_board":"Emirates Islamic Fatwa Committee","approval_time":"Same day","documents_required":["Emirates ID","Passport copy"],"sharia_compliant":true,"best_for":"Prize-linked Sharia-compliant savings"}'::jsonb
WHERE id = '1e40c6b9-f9f3-4f82-b4fd-1f4b056a1972';

UPDATE products SET
  description_en = 'Sharjah Islamic Bank personal finance with competitive Murabaha rates. Accessible to a wider range of salary earners with transparent fee structure.',
  key_features = '{"finance_type":"Personal Finance","structure_type":"Murabaha","profit_rate":"From 5.75% per annum (reducing)","processing_fee":"1% of finance amount","min_amount":"AED 10,000","max_amount":"AED 1,000,000","min_tenure":"12 months","max_tenure":"48 months","min_salary":"AED 5,000","salary_transfer_required":true,"early_settlement_fee":"1% of outstanding","late_payment_fee":"AED 200 (donated to charity)","takaful":"Takaful life cover included","sharia_board":"SIB Sharia Board","approval_time":"48 hours","documents_required":["Emirates ID","Salary certificate","Bank statements (3 months)","Passport copy"],"sharia_compliant":true,"best_for":"Accessible Islamic financing from Sharjah Islamic Bank"}'::jsonb
WHERE id = 'b2b17811-cf31-4203-8f80-f5f4aafb9b24';
-- Comprehensive product data - Car Insurance (8 products) + Health Insurance (8 products)

-- CAR INSURANCE
UPDATE products SET
  description_en = 'AXA SmartDriver rewards safe driving with lower premiums. Telematics-based pricing means careful drivers pay less. Comprehensive coverage with agency repair, roadside assistance, and GCC extension.',
  key_features = '{"coverage_type":"Comprehensive + Third-Party","comprehensive":true,"third_party":true,"starting_premium":"From AED 1,200/year","natural_disasters":true,"personal_accident":true,"personal_accident_coverage":"AED 200,000","agency_repair":true,"non_agency_repair":true,"claim_settlement_time":"5-7 working days","rent_a_car":true,"new_for_old":true,"roadside_assistance":true,"towing":true,"windscreen_cover":true,"off_road_cover":false,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Up to 25%","excess":"AED 500 (waived for AED 150 add-on)","cashless_garages":150,"online_claims":true,"best_for":"Safe drivers who want telematics-based savings"}'::jsonb
WHERE id = 'a4481e0e-b2ed-4ba5-900a-8f2ddad2d2e0';

UPDATE products SET
  description_en = 'Oman Insurance comprehensive motor plan with one of the widest garage networks in the UAE. Agency repair, natural disaster cover, personal accident, and GCC-wide coverage.',
  key_features = '{"coverage_type":"Comprehensive","comprehensive":true,"third_party":true,"starting_premium":"From AED 1,100/year","natural_disasters":true,"personal_accident":true,"personal_accident_coverage":"AED 200,000","agency_repair":true,"non_agency_repair":true,"claim_settlement_time":"7-10 working days","rent_a_car":true,"new_for_old":true,"roadside_assistance":true,"towing":true,"windscreen_cover":true,"off_road_cover":true,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Up to 30%","excess":"AED 500","cashless_garages":200,"online_claims":true,"best_for":"Comprehensive coverage with wide garage network"}'::jsonb
WHERE id = 'd26e536d-2577-4187-a763-281b9542c743';

UPDATE products SET
  description_en = 'Orient Insurance motor plan with flexible coverage options. Choose between comprehensive and third-party. Competitive pricing with optional add-ons for roadside assistance and rent-a-car.',
  key_features = '{"coverage_type":"Comprehensive + Third-Party options","comprehensive":true,"third_party":true,"starting_premium":"From AED 900/year","natural_disasters":true,"personal_accident":true,"personal_accident_coverage":"AED 150,000","agency_repair":true,"non_agency_repair":true,"claim_settlement_time":"7-10 working days","rent_a_car":false,"new_for_old":false,"roadside_assistance":true,"towing":true,"windscreen_cover":true,"off_road_cover":false,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Up to 25%","excess":"AED 500","online_claims":true,"best_for":"Budget-friendly coverage with essential benefits"}'::jsonb
WHERE id = 'b02e049a-eaa3-420d-8e03-538616c09ebd';

UPDATE products SET
  description_en = 'Compare car insurance from 12+ UAE providers instantly. AI-powered recommendations based on your vehicle and driving profile. Lowest price guaranteed with Policybazaar.',
  key_features = '{"coverage_type":"Comparison platform (Comprehensive + Third-Party)","comprehensive":true,"third_party":true,"starting_premium":"From AED 750/year","providers_compared":12,"quote_time":"Instant","natural_disasters":true,"personal_accident":true,"agency_repair":true,"non_agency_repair":true,"roadside_assistance":true,"towing":true,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Varies by provider","cashless_garages":300,"online_claims":true,"best_for":"Finding lowest premium across 12+ insurers"}'::jsonb
WHERE id = 'f4fd859f-9870-494a-8633-d04be557c3b3';

UPDATE products SET
  description_en = 'RSA (Royal & Sun Alliance) motor insurance with global backing and local expertise. Comprehensive and third-party options with competitive pricing for fleet and individual vehicles.',
  key_features = '{"coverage_type":"Comprehensive + Third-Party","comprehensive":true,"third_party":true,"starting_premium":"From AED 1,000/year","natural_disasters":true,"personal_accident":true,"personal_accident_coverage":"AED 200,000","agency_repair":true,"non_agency_repair":true,"claim_settlement_time":"5-7 working days","rent_a_car":true,"new_for_old":false,"roadside_assistance":true,"towing":true,"windscreen_cover":true,"off_road_cover":false,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Up to 25%","excess":"AED 500","online_claims":true,"best_for":"Global insurer with strong local claims network"}'::jsonb
WHERE id = 'abdc7168-875d-43ac-8d7f-5639b18f53f2';

UPDATE products SET
  description_en = 'Compare car insurance plans from 15+ UAE providers on Souqalmal. Get free quotes in minutes and find the best coverage at the lowest price.',
  key_features = '{"coverage_type":"Comparison platform (Comprehensive + Third-Party)","comprehensive":true,"third_party":true,"starting_premium":"From AED 700/year","providers_compared":15,"quote_time":"2-3 minutes","natural_disasters":true,"personal_accident":true,"agency_repair":true,"roadside_assistance":true,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Varies by provider","online_claims":true,"best_for":"Comparing 15+ car insurers in one place"}'::jsonb
WHERE id = '6ca3715f-27b5-4504-b4dd-9cc40b4526da';

UPDATE products SET
  description_en = 'Sukoon comprehensive car insurance (Takaful) following Islamic principles. Surplus distribution, Sharia-compliant investment of premiums, and full comprehensive coverage.',
  key_features = '{"coverage_type":"Comprehensive Takaful","comprehensive":true,"third_party":true,"starting_premium":"From AED 1,300/year","natural_disasters":true,"personal_accident":true,"personal_accident_coverage":"AED 200,000","agency_repair":true,"non_agency_repair":true,"claim_settlement_time":"7-10 working days","rent_a_car":true,"new_for_old":true,"roadside_assistance":true,"towing":true,"windscreen_cover":true,"off_road_cover":false,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Up to 20%","excess":"AED 500","sharia_compliant":true,"online_claims":true,"best_for":"Sharia-compliant Takaful car insurance"}'::jsonb
WHERE id = '4700db1f-ec95-48d7-9f7e-b22b1a33c592';

UPDATE products SET
  description_en = 'Compare car insurance from 15+ UAE providers on Yallacompare. Get quotes in under 2 minutes and buy online instantly. Price match guarantee.',
  key_features = '{"coverage_type":"Comparison platform (Comprehensive + Third-Party)","comprehensive":true,"third_party":true,"starting_premium":"From AED 650/year","providers_compared":15,"quote_time":"Under 2 minutes","natural_disasters":true,"personal_accident":true,"agency_repair":true,"roadside_assistance":true,"gcc_cover":true,"oman_extension":true,"no_claim_discount":"Varies by provider","cashless_garages":250,"online_claims":true,"best_for":"Fastest car insurance comparison and instant purchase"}'::jsonb
WHERE id = 'c26e9b95-ae42-465b-a191-6c4150c2d609';

-- HEALTH INSURANCE
UPDATE products SET
  description_en = 'AXA Gulf''s comprehensive health insurance with extensive inpatient and outpatient coverage. Access 300+ network hospitals across UAE. Dental, optical, and maternity benefits included.',
  key_features = '{"plan_type":"Individual and Family","starting_premium":"From AED 4,500/year","inpatient_cover":"AED 1,000,000","outpatient_cover":"AED 15,000","annual_limit":"AED 1,000,000","room_type":"Private room","dental":true,"dental_limit":"AED 3,000","optical":true,"optical_limit":"AED 1,500","maternity":true,"maternity_waiting_period":"12 months","maternity_limit":"AED 20,000","pre_existing":"Covered after 6 months waiting period","mental_health":true,"alternative_medicine":true,"network_hospitals":300,"network_type":"Enhanced","dha_compliant":true,"haad_compliant":true,"copay_consultation":"20%","copay_pharmacy":"0%","emergency_cover":true,"ambulance_cover":true,"repatriation":true,"excess":"AED 0","best_for":"Comprehensive family coverage with wide network"}'::jsonb
WHERE id = '452da7e3-ec34-42ce-9377-6a1459f7c0f8';

UPDATE products SET
  description_en = 'Daman Enhanced plan offers premium health coverage for UAE residents. Enhanced network access to top-tier hospitals, comprehensive inpatient/outpatient care, and generous maternity benefits.',
  key_features = '{"plan_type":"Individual and Family","starting_premium":"From AED 6,000/year","inpatient_cover":"AED 1,500,000","outpatient_cover":"AED 20,000","annual_limit":"AED 1,500,000","room_type":"Private room","dental":true,"dental_limit":"AED 5,000","optical":true,"optical_limit":"AED 2,000","maternity":true,"maternity_waiting_period":"10 months","maternity_limit":"AED 25,000","pre_existing":"Covered after 6 months","mental_health":true,"alternative_medicine":true,"network_hospitals":400,"network_type":"Enhanced Plus","dha_compliant":true,"haad_compliant":true,"copay_consultation":"20%","copay_pharmacy":"0%","emergency_cover":true,"ambulance_cover":true,"repatriation":true,"excess":"AED 0","best_for":"Premium coverage with Enhanced Plus network access"}'::jsonb
WHERE id = 'c65ff743-9ca1-4eca-a64b-c389ef1d4948';

UPDATE products SET
  description_en = 'Daman Thiqa is the mandatory health insurance scheme for Abu Dhabi nationals (UAE citizens). Comprehensive coverage with zero co-pay, unlimited benefits, and access to all network hospitals.',
  key_features = '{"plan_type":"UAE Nationals (Abu Dhabi)","starting_premium":"Government-funded","inpatient_cover":"Unlimited","outpatient_cover":"Unlimited","annual_limit":"Unlimited","room_type":"Private room","dental":true,"dental_limit":"Included","optical":true,"optical_limit":"Included","maternity":true,"maternity_waiting_period":"None","maternity_limit":"Included","pre_existing":"Fully covered","mental_health":true,"alternative_medicine":true,"network_hospitals":500,"network_type":"Thiqa Network","dha_compliant":true,"haad_compliant":true,"copay_consultation":"0%","copay_pharmacy":"0%","emergency_cover":true,"ambulance_cover":true,"repatriation":true,"excess":"AED 0","best_for":"Abu Dhabi UAE nationals (government-funded)"}'::jsonb
WHERE id = 'bbd59f62-45c8-4134-b4fc-7c10c39e9c47';

UPDATE products SET
  description_en = 'Oman Insurance individual health plan with flexible coverage tiers. Choose from Basic, Enhanced, or Premium networks based on your needs and budget.',
  key_features = '{"plan_type":"Individual and Family","starting_premium":"From AED 3,500/year","inpatient_cover":"AED 500,000","outpatient_cover":"AED 10,000","annual_limit":"AED 500,000","room_type":"Semi-private (upgradable)","dental":true,"dental_limit":"AED 2,500","optical":true,"optical_limit":"AED 1,000","maternity":true,"maternity_waiting_period":"12 months","maternity_limit":"AED 15,000","pre_existing":"Covered after 6 months","mental_health":true,"alternative_medicine":false,"network_hospitals":200,"network_type":"General","dha_compliant":true,"haad_compliant":true,"copay_consultation":"20%","copay_pharmacy":"10%","emergency_cover":true,"ambulance_cover":true,"repatriation":true,"excess":"AED 250","best_for":"Budget-friendly individual health coverage"}'::jsonb
WHERE id = '24f97a6d-9606-4b2d-b1ad-9cb0b18fdad4';

UPDATE products SET
  description_en = 'Compare health insurance from 10+ UAE providers on Policybazaar. AI-powered plan recommendations based on your profile, family size, and medical history.',
  key_features = '{"plan_type":"Comparison platform (Individual, Family, Corporate)","starting_premium":"From AED 2,800/year","providers_compared":10,"quote_time":"Instant","inpatient_cover":"Varies by plan","outpatient_cover":"Varies by plan","dental":true,"optical":true,"maternity":true,"network_hospitals":500,"dha_compliant":true,"haad_compliant":true,"online_claims":true,"best_for":"AI-powered health insurance comparison"}'::jsonb
WHERE id = 'ca188f47-4b1d-490a-891f-89aec6a26639';

UPDATE products SET
  description_en = 'Compare health insurance plans from 10+ UAE providers on Souqalmal. Find DHA and HAAD-compliant plans for individuals and families at competitive rates.',
  key_features = '{"plan_type":"Comparison platform (Individual, Family)","starting_premium":"From AED 2,500/year","providers_compared":10,"quote_time":"2-3 minutes","inpatient_cover":"Varies by plan","outpatient_cover":"Varies by plan","dental":true,"optical":true,"maternity":true,"network_hospitals":450,"dha_compliant":true,"haad_compliant":true,"online_claims":true,"best_for":"Comparing health plans from 10+ insurers"}'::jsonb
WHERE id = '74b096d7-10b0-413b-b309-5b6a65fbde3e';

UPDATE products SET
  description_en = 'Sukoon Health Takaful plan following Islamic Takaful principles. Surplus sharing, Sharia-compliant investments, and comprehensive health coverage for individuals and families.',
  key_features = '{"plan_type":"Individual and Family (Takaful)","starting_premium":"From AED 4,000/year","inpatient_cover":"AED 500,000","outpatient_cover":"AED 10,000","annual_limit":"AED 500,000","room_type":"Semi-private","dental":true,"dental_limit":"AED 2,500","optical":true,"optical_limit":"AED 1,000","maternity":true,"maternity_waiting_period":"12 months","maternity_limit":"AED 15,000","pre_existing":"Covered after 6 months","mental_health":true,"alternative_medicine":true,"network_hospitals":200,"network_type":"General","dha_compliant":true,"haad_compliant":true,"copay_consultation":"20%","copay_pharmacy":"10%","emergency_cover":true,"ambulance_cover":true,"sharia_compliant":true,"excess":"AED 0","best_for":"Islamic Takaful health insurance with surplus sharing"}'::jsonb
WHERE id = '460dc1ed-e760-4e48-9d80-6d5c6b0ffa91';

UPDATE products SET
  description_en = 'Compare health insurance from 15+ UAE providers on Yallacompare. Quick online quotes and instant policy issuance. Find DHA/HAAD compliant plans for your budget.',
  key_features = '{"plan_type":"Comparison platform (Individual, Family, Corporate)","starting_premium":"From AED 2,500/year","providers_compared":15,"quote_time":"Under 2 minutes","inpatient_cover":"Varies by plan","outpatient_cover":"Varies by plan","dental":true,"optical":true,"maternity":true,"network_hospitals":500,"dha_compliant":true,"haad_compliant":true,"online_claims":true,"best_for":"Fastest health insurance comparison and purchase"}'::jsonb
WHERE id = '9c57dce4-fb29-43db-b59f-c2b36948d957';
