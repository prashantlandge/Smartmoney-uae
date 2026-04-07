-- Migration: Add scrape_runs table for audit trail
-- Run this once on existing databases

CREATE TABLE IF NOT EXISTS scrape_runs (
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

CREATE INDEX IF NOT EXISTS idx_scrape_runs_started ON scrape_runs(started_at DESC);
