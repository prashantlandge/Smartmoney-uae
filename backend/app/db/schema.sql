-- SmartMoney UAE Database Schema
-- PostgreSQL with pgvector extension

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- pgvector is optional — only available with pgvector-enabled PostgreSQL images
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS "vector";
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pgvector extension not available, skipping';
END $$;

-- ============================================================
-- PROVIDERS TABLE
-- ============================================================
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    logo_url VARCHAR(500),
    type VARCHAR(50) NOT NULL CHECK (type IN ('bank', 'exchange_house', 'insurance', 'fintech')),
    country VARCHAR(10) DEFAULT 'UAE',
    website_url VARCHAR(500),
    affiliate_network VARCHAR(50) CHECK (affiliate_network IN ('direct', 'yallacompare', 'souqalmal', 'awin')),
    affiliate_id VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_providers_type ON providers(type);
CREATE INDEX idx_providers_active ON providers(active);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'credit_card', 'personal_loan', 'remittance', 'car_insurance',
        'health_insurance', 'home_finance', 'current_account', 'savings',
        'islamic_finance'
    )),
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    description_en TEXT,
    description_ar TEXT,
    min_salary_aed DECIMAL(12,2),
    min_salary_currency VARCHAR(10) DEFAULT 'AED',
    residency_required BOOLEAN DEFAULT true,
    nationality_restrictions TEXT[],
    employer_categories TEXT[],
    representative_rate DECIMAL(10,4),
    rate_type VARCHAR(20) CHECK (rate_type IN ('fixed', 'variable', 'exchange_rate')),
    min_amount_aed DECIMAL(12,2),
    max_amount_aed DECIMAL(12,2),
    min_tenure_months INTEGER,
    max_tenure_months INTEGER,
    key_features JSONB DEFAULT '{}',
    eligibility_criteria JSONB DEFAULT '{}',
    affiliate_deep_link_en VARCHAR(500),
    affiliate_deep_link_ar VARCHAR(500),
    commission_amount_aed DECIMAL(10,2),
    commission_type VARCHAR(20) CHECK (commission_type IN ('flat', 'percentage')),
    commission_percentage DECIMAL(5,2),
    islamic_compliant BOOLEAN DEFAULT false,
    last_updated TIMESTAMP DEFAULT NOW(),
    data_source VARCHAR(255),
    active BOOLEAN DEFAULT true
);

CREATE INDEX idx_products_provider ON products(provider_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_salary ON products(min_salary_aed);
CREATE INDEX idx_products_islamic ON products(islamic_compliant);

-- ============================================================
-- REMITTANCE RATES TABLE
-- ============================================================
CREATE TABLE remittance_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    send_currency VARCHAR(10) DEFAULT 'AED',
    receive_currency VARCHAR(10) DEFAULT 'INR',
    exchange_rate DECIMAL(12,6) NOT NULL,
    fee_aed DECIMAL(10,2) DEFAULT 0,
    fee_percentage DECIMAL(5,2) DEFAULT 0,
    transfer_speed_hours INTEGER,
    min_transfer_aed DECIMAL(10,2),
    max_transfer_aed DECIMAL(10,2),
    affiliate_link VARCHAR(500),
    commission_per_transfer_aed DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_remittance_provider ON remittance_rates(provider_id);
CREATE INDEX idx_remittance_currencies ON remittance_rates(send_currency, receive_currency);
CREATE INDEX idx_remittance_updated ON remittance_rates(updated_at DESC);

-- ============================================================
-- USER PROFILES TABLE
-- ============================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    nationality VARCHAR(10),
    residency_status VARCHAR(20) CHECK (residency_status IN ('resident', 'non_resident', 'citizen')),
    monthly_salary_aed DECIMAL(12,2),
    employer_category VARCHAR(50),
    employer_name VARCHAR(255),
    credit_score_band VARCHAR(20) CHECK (credit_score_band IN ('excellent', 'good', 'fair', 'poor', 'unknown')),
    existing_liabilities_aed DECIMAL(12,2),
    preferred_language VARCHAR(5) DEFAULT 'en',
    transfer_frequency VARCHAR(20) CHECK (transfer_frequency IN ('weekly', 'monthly', 'occasional')),
    preferred_speed VARCHAR(20) CHECK (preferred_speed IN ('fastest', 'cheapest', 'balanced')),
    onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_session ON user_profiles(session_id);
CREATE UNIQUE INDEX idx_user_profiles_session_unique ON user_profiles(session_id) WHERE session_id IS NOT NULL;

-- ============================================================
-- AFFILIATE CLICKS TABLE
-- ============================================================
CREATE TABLE affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    user_profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(255),
    clicked_at TIMESTAMP DEFAULT NOW(),
    converted BOOLEAN DEFAULT false,
    commission_earned_aed DECIMAL(10,2)
);

CREATE INDEX idx_clicks_product ON affiliate_clicks(product_id);
CREATE INDEX idx_clicks_session ON affiliate_clicks(session_id);
CREATE INDEX idx_clicks_date ON affiliate_clicks(clicked_at DESC);
CREATE INDEX idx_clicks_converted ON affiliate_clicks(converted);

-- ============================================================
-- CONTENT POSTS TABLE
-- ============================================================
CREATE TABLE content_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    slug_en VARCHAR(255) UNIQUE,
    slug_ar VARCHAR(255) UNIQUE,
    meta_description_en VARCHAR(155),
    meta_description_ar VARCHAR(155),
    body_en TEXT,
    body_ar TEXT,
    category VARCHAR(100),
    target_keywords TEXT[],
    affiliate_links_injected BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_slug_en ON content_posts(slug_en);
CREATE INDEX idx_content_slug_ar ON content_posts(slug_ar);
CREATE INDEX idx_content_status ON content_posts(status);
CREATE INDEX idx_content_category ON content_posts(category);

-- ============================================================
-- REMITTANCE RATE HISTORY TABLE (Phase 3: Rate Intelligence)
-- ============================================================
CREATE TABLE remittance_rate_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    send_currency VARCHAR(10) DEFAULT 'AED',
    receive_currency VARCHAR(10) DEFAULT 'INR',
    exchange_rate DECIMAL(12,6) NOT NULL,
    fee_aed DECIMAL(10,2) DEFAULT 0,
    effective_rate DECIMAL(12,6),
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rate_history_lookup ON remittance_rate_history(provider_id, send_currency, receive_currency, recorded_at DESC);
CREATE INDEX idx_rate_history_time ON remittance_rate_history(recorded_at DESC);

-- ============================================================
-- RATE ALERTS TABLE (Phase 3: Rate Intelligence)
-- ============================================================
CREATE TABLE rate_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    send_currency VARCHAR(10) DEFAULT 'AED',
    receive_currency VARCHAR(10) DEFAULT 'INR',
    target_rate DECIMAL(12,6) NOT NULL,
    direction VARCHAR(10) DEFAULT 'above' CHECK (direction IN ('above', 'below')),
    active BOOLEAN DEFAULT true,
    triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rate_alerts_session ON rate_alerts(session_id);
CREATE INDEX idx_rate_alerts_active ON rate_alerts(active) WHERE active = true;

-- ============================================================
-- USER EVENTS TABLE (Phase 4: Behavioral Intelligence)
-- ============================================================
CREATE TABLE user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_events_session ON user_events(session_id, created_at DESC);
CREATE INDEX idx_user_events_type ON user_events(event_type, created_at DESC);

-- ============================================================
-- SCRAPE RUNS TABLE (Audit trail for daily scrapers)
-- ============================================================
CREATE TABLE scrape_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds DECIMAL(10, 2),
    total_scraped INTEGER DEFAULT 0,
    total_upserted INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    details JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scrape_runs_started ON scrape_runs(started_at DESC);
