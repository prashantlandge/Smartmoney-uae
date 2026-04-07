# SmartMoney UAE — Project Context

## Branch
All development happens on: `claude/uae-remittance-platform-5UudM`

## Project Overview
UAE financial product comparison platform (credit cards, personal loans, Islamic finance, insurance, remittance). Full-stack: FastAPI backend + Next.js/React frontend + PostgreSQL.

---

## Architecture

### Backend (`backend/app/`)
- **FastAPI** app in `main.py` — lifespan manages DB pool + scheduler startup
- **Database**: PostgreSQL via `asyncpg`, connection pool in `db/connection.py`
- **Scrapers**: HTML + PDF scraper system for 31 financial institutions
  - `features/scrapers/banks/` — HTML scrapers per bank
  - `features/scrapers/pdf/` — PDF scrapers (KFS/SOC documents)
  - `features/scrapers/pdf/registry.py` — PDF URL registry for all providers
  - `features/scrapers/runner.py` — orchestrator, runs all scrapers, upserts to DB
  - `features/scrapers/scheduler.py` — asyncio-based daily scheduling (validation 2AM, HTML 3AM, PDF 4AM Sunday, staleness 5AM GST)
  - `features/scrapers/validator.py` — proactive URL health + page structure checks
  - `features/scrapers/alerts.py` — alert engine for scraper health monitoring
- **Products API**: `features/products/router.py` — list/search/get endpoints
- **Insights**: `features/products/insights.py` — personalized product insights based on user profile
- **DB Schema**: `db/schema.sql`

### Frontend (`frontend/src/`)
- **Next.js** with TypeScript, Tailwind CSS
- **Product pages**: `pages/` per category, `components/products/ProductCard.tsx`
- **Admin**: `pages/admin/scraper-health.tsx` — scraper monitoring dashboard
- **Hooks**: `hooks/useProducts.ts` — fetches products with profile params

---

## Completed Work (All Committed & Pushed)

### 1. Scraper System (commits ccbe843, 2316983)
- HTML scrapers for 16 banks with rich fallback data (15 features per product)
- PDF scraper framework for 31 institutions (banks, insurance, exchange houses)
- PDF base class handles download, pdfplumber extraction, content-type validation

### 2. PDF URL Registry Fix (commit c6563e6)
- Replaced ALL placeholder URLs with verified real URLs from bank websites
- Key verified URLs:
  - ENBD: `cdn.emiratesnbd.com/enbd/files/pdf/kfs_credit_cards_horizontal_em_new.pdf`
  - FAB: `bankfab.com/-/media/fab-uds/personal/key-facts-statements/credit-cards/fab-consolidated-credit-cards-en.pdf`
  - HSBC: `hsbc.ae/content/dam/hsbc/ae/docs/en/cards/kfs-credit-cards.pdf`
  - DIB, ADIB, Emirates Islamic, Citibank, Liv, Al Ansari, Daman, Sukoon — all verified
- Added `is_webpage: True` flag for Wise, Remitly, UAE Exchange (no downloadable PDFs)
- Fixed `.ashx` URL support for Mashreq
- PDF scraper success: 21/28 providers working

### 3. Scraper Validation System (commit 7a1b73f)
- `validator.py`: proactive daily checks at 2 AM GST before scraping
- URL health checks, page structure fingerprinting, selector presence, product count drift
- `scraper_fingerprints` DB table for tracking page structure changes
- Admin UI: "Validate URLs" button + validation report with summary cards

### 4. Personalized Product Insights (commit 7a1b73f)
- `insights.py`: rule-based engine generating "What this means for you" per product
- Category-specific: credit cards, loans, Islamic finance, insurance, remittance
- Uses profile: salary, nationality, employer_category, transfer_frequency
- Frontend: sky-blue "What this means for you" section on ProductCard
- API: query params on `/products/list/{category}` for salary/nationality/residency/employer

### 5. Data Integrity & Silent Failure Prevention (commit d0a9812)
- **DB connection** (`connection.py`): retry logic (3 attempts, exponential backoff), `command_timeout=30`, `timeout=10`, connection verification via `SELECT 1`, `check_pool_health()` function
- **Product validation** (`runner.py`): `_validate_product()` checks provider_id, name_en, category, rate ranges, min_salary non-negative, UUID validity before DB write
- **Post-upsert integrity** (`alerts.py`): `check_data_integrity()` detects empty key_features, missing required fields, providers with 0 active products
- **Scheduler heartbeat** (`scheduler.py`): `_heartbeat_monitor_loop()` checks hourly for crashed/stalled tasks, fires CRITICAL alerts; heartbeat recorded after each task run
- **Product API hardening** (`router.py`): validates category (400 for invalid), returns 503 on DB errors, logs empty results as warnings
- **Logging** (`main.py`): `logging.basicConfig()` with timestamps to stdout, suppressed httpx/httpcore/asyncpg noise
- **Resilient startup** (`main.py`): DB failure = fatal, scheduler failure = non-fatal (logged)
- **Runner error handling** (`runner.py`): ValueError (validation) vs Exception (DB) separated, detailed error logging with provider/category/source

### 6. UI Improvements (earlier commits)
- RupeeLens color scheme unification (blue brand, no teal)
- Mobile UI fixes: white space, table alignment, font sizes
- Nav dropdown hover gap fix
- Admin scraper health dashboard

---

## Known Issues

### PDF Scrapers — Partially Working (7 providers failing)
- **Mashreq**: Website under maintenance, URLs correct (.ashx format) but temporarily 404
- **Wio**: `personal-fees.pdf` and `business-fees.pdf` return HTML/JS, not real PDFs (pdfplumber error: "No /Root object")
- **SIB (Sharjah Islamic Bank)**: 403 Forbidden — blocks direct PDF downloads
- **Lulu Exchange**: 503 — temporary server unavailability
- **AXA Gulf**: 403 — access restricted to portal users
- **Al Hilal, NBF**: URLs need verification

### Database
- `scrape_runs` table may not exist in all environments (graceful fallback in runner)
- `scraper_fingerprints` table needs to be created from `schema.sql`

---

## Remaining TODOs / Future Work

### High Priority
1. **Fix remaining 7 PDF scrapers** — find alternative URLs or implement browser-based download for 403/503 providers
2. **End-to-end testing** — verify full pipeline: scrape -> validate -> upsert -> API -> frontend
3. **Run schema migrations** — ensure `scraper_fingerprints` and `scrape_runs` tables exist in production

### Medium Priority
4. **Scraper alerting notifications** — alerts currently go to DB only; add email/Slack/webhook notifications
5. **PDF content parsing** — improve pdfplumber extraction logic for different PDF layouts across banks
6. **Comparison engine** — build product comparison feature on frontend
7. **User profiles** — persist user profile (salary, nationality, etc.) for personalized insights

### Low Priority
8. **Rate limiting** on scraper requests to avoid bank IP blocks
9. **Caching layer** for product API responses
10. **Admin dashboard enhancements** — historical scrape trends, per-provider drill-down

---

## Key File Reference

| File | Purpose |
|------|---------|
| `backend/app/main.py` | FastAPI app, lifespan, logging config |
| `backend/app/db/connection.py` | DB pool with retry + health checks |
| `backend/app/db/schema.sql` | Full DB schema |
| `backend/app/features/scrapers/runner.py` | Scraper orchestrator + upsert logic |
| `backend/app/features/scrapers/scheduler.py` | Background task scheduling + heartbeat |
| `backend/app/features/scrapers/validator.py` | Proactive scraper health validation |
| `backend/app/features/scrapers/alerts.py` | Alert engine + data integrity checks |
| `backend/app/features/scrapers/pdf/registry.py` | PDF URL registry (all 28 providers) |
| `backend/app/features/scrapers/pdf/base.py` | Base PDF scraper class |
| `backend/app/features/products/router.py` | Products API with validation |
| `backend/app/features/products/insights.py` | Personalized insight generator |
| `backend/app/features/products/schemas.py` | Pydantic response schemas |
| `frontend/src/components/products/ProductCard.tsx` | Product card with insight UI |
| `frontend/src/hooks/useProducts.ts` | Product fetch hook with profile params |
| `frontend/src/pages/admin/scraper-health.tsx` | Admin scraper dashboard |
