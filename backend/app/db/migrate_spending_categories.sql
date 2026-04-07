-- Add spending category rewards to credit card key_features
-- This enables intelligent search like "credit card for petrol"

-- Emirates NBD Go4it Cashback — dining focused
UPDATE products SET key_features = key_features || '{"best_for": "dining, entertainment", "petrol_cashback": "1%", "dining_cashback": "5%", "grocery_cashback": "1%", "online_shopping_cashback": "1%"}'::jsonb
WHERE name_en = 'Emirates NBD Go4it Cashback Credit Card';

-- FAB Rewards Platinum — travel focused
UPDATE products SET key_features = key_features || '{"best_for": "travel, rewards", "petrol_cashback": "1 point/AED", "dining_cashback": "1 point/AED", "travel_bonus": "2x points on airlines & hotels", "airport_lounge": true}'::jsonb
WHERE name_en = 'FAB Rewards Platinum Credit Card';

-- Mashreq Neo — everyday & digital
UPDATE products SET key_features = key_features || '{"best_for": "everyday, digital", "petrol_cashback": "1%", "dining_cashback": "2%", "grocery_cashback": "1%", "online_shopping_cashback": "2%"}'::jsonb
WHERE name_en = 'Mashreq Neo Visa Credit Card';

-- ADCB TouchPoints Infinite — premium travel
UPDATE products SET key_features = key_features || '{"best_for": "travel, premium", "petrol_cashback": "2x points", "dining_cashback": "5x points", "travel_bonus": "10x points on travel", "grocery_cashback": "2x points"}'::jsonb
WHERE name_en = 'ADCB TouchPoints Infinite Credit Card';

-- RAKBANK World Elite — premium
UPDATE products SET key_features = key_features || '{"best_for": "premium, petrol", "petrol_cashback": "3%", "dining_cashback": "3%", "grocery_cashback": "1%", "travel_bonus": "free airport transfers"}'::jsonb
WHERE name_en = 'RAKBANK World Elite Mastercard';

-- FAB Cashback — cashback king
UPDATE products SET key_features = key_features || '{"best_for": "cashback, dining, petrol", "petrol_cashback": "5%", "dining_cashback": "10%", "grocery_cashback": "3%", "online_shopping_cashback": "3%", "entertainment_cashback": "10%"}'::jsonb
WHERE name_en = 'FAB Cashback Credit Card';

-- HSBC Live+ — lifestyle
UPDATE products SET key_features = key_features || '{"best_for": "lifestyle, dining, delivery", "petrol_cashback": "1%", "dining_cashback": "3%", "grocery_cashback": "1%", "delivery_apps_cashback": "3%", "streaming_cashback": "3%"}'::jsonb
WHERE name_en = 'HSBC Live+ Credit Card';

-- HSBC Cash+ — groceries & petrol
UPDATE products SET key_features = key_features || '{"best_for": "groceries, petrol, dining", "petrol_cashback": "5%", "dining_cashback": "5%", "grocery_cashback": "5%", "utility_cashback": "3%"}'::jsonb
WHERE name_en = 'HSBC Cash+ Credit Card';

-- ADCB Traveller — travel
UPDATE products SET key_features = key_features || '{"best_for": "travel, airlines, hotels", "petrol_cashback": "1x miles", "dining_cashback": "2x miles on travel dining", "travel_bonus": "2 Skywards miles per AED 1", "hotel_bonus": "2x miles on hotels"}'::jsonb
WHERE name_en = 'ADCB Traveller Credit Card';

-- StanChart Infinite — premium travel
UPDATE products SET key_features = key_features || '{"best_for": "premium, dining, travel", "petrol_cashback": "2x points", "dining_cashback": "5x points", "travel_bonus": "3x points on travel", "grocery_cashback": "1x points"}'::jsonb
WHERE name_en = 'Standard Chartered Infinite Credit Card';

-- StanChart Cashback — flat cashback
UPDATE products SET key_features = key_features || '{"best_for": "everything, petrol, groceries", "petrol_cashback": "2%", "dining_cashback": "2%", "grocery_cashback": "2%", "online_shopping_cashback": "2%", "flat_rate": true}'::jsonb
WHERE name_en = 'Standard Chartered Cashback Credit Card';

-- Citibank Rewards — online shopping
UPDATE products SET key_features = key_features || '{"best_for": "online shopping, dining, groceries", "petrol_cashback": "1x points", "dining_cashback": "10x points", "grocery_cashback": "10x points", "online_shopping_cashback": "10x points"}'::jsonb
WHERE name_en = 'Citibank Rewards Credit Card';

-- Citibank Cashback — supermarket & utilities
UPDATE products SET key_features = key_features || '{"best_for": "supermarket, utilities, telecom", "petrol_cashback": "1%", "dining_cashback": "1%", "grocery_cashback": "3%", "utility_cashback": "3%", "telecom_cashback": "3%"}'::jsonb
WHERE name_en = 'Citibank Cashback Credit Card';

-- Emirates Islamic Skywards — Islamic travel
UPDATE products SET key_features = key_features || '{"best_for": "travel, Islamic, airlines", "petrol_cashback": "1 mile/AED", "dining_cashback": "1.5 miles/AED", "travel_bonus": "1.5 Skywards miles per AED 1"}'::jsonb
WHERE name_en = 'Emirates Islamic Skywards Signature Credit Card';

-- Mashreq Solitaire — premium dining
UPDATE products SET key_features = key_features || '{"best_for": "dining, premium, golf", "petrol_cashback": "2x points", "dining_cashback": "4x points + buy-1-get-1", "grocery_cashback": "1x points", "entertainment_cashback": "2x points"}'::jsonb
WHERE name_en = 'Mashreq Solitaire Visa Infinite Credit Card';

-- Liv. Metal — digital lifestyle
UPDATE products SET key_features = key_features || '{"best_for": "dining, delivery, streaming", "petrol_cashback": "1%", "dining_cashback": "5%", "grocery_cashback": "1%", "delivery_apps_cashback": "5%", "streaming_cashback": "5%"}'::jsonb
WHERE name_en = 'Liv. Metal Credit Card';

-- CBD World Mastercard — international
UPDATE products SET key_features = key_features || '{"best_for": "international spending, travel", "petrol_cashback": "1%", "dining_cashback": "2%", "international_cashback": "4%", "travel_bonus": "airport transfer 2x/year"}'::jsonb
WHERE name_en = 'CBD World Mastercard Credit Card';

-- ADIB Covered Card — Islamic cashback
UPDATE products SET key_features = key_features || '{"best_for": "Islamic, cashback, everyday", "petrol_cashback": "1%", "dining_cashback": "3%", "grocery_cashback": "2%"}'::jsonb
WHERE name_en = 'ADIB Covered Card Visa Signature';

-- Wio Cashback — flat digital
UPDATE products SET key_features = key_features || '{"best_for": "everything, digital, no-fee", "petrol_cashback": "2%", "dining_cashback": "2%", "grocery_cashback": "2%", "online_shopping_cashback": "2%", "flat_rate": true}'::jsonb
WHERE name_en = 'Wio Cashback Credit Card';

-- RAKBANK Titanium — entry level
UPDATE products SET key_features = key_features || '{"best_for": "entry level, low salary", "petrol_cashback": "0.5%", "dining_cashback": "1%", "grocery_cashback": "0.5%"}'::jsonb
WHERE name_en = 'RAKBANK Titanium Credit Card';

-- DIB Al Islami — Islamic
UPDATE products SET key_features = key_features || '{"best_for": "Islamic, cashback, everyday", "petrol_cashback": "2%", "dining_cashback": "5%", "grocery_cashback": "2%", "online_shopping_cashback": "2%"}'::jsonb
WHERE name_en = 'Dubai Islamic Bank Al Islami Credit Card';
