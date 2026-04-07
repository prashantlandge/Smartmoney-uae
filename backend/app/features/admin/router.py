from fastapi import APIRouter
from app.db.connection import get_pool

router = APIRouter()


@router.get("/stats")
async def get_stats():
    pool = await get_pool()

    # Total products by category
    products = await pool.fetch(
        "SELECT category, count(*) as count FROM products WHERE active=true GROUP BY category ORDER BY count DESC"
    )

    # Affiliate clicks - last 7 days
    clicks_7d = await pool.fetchval(
        "SELECT count(*) FROM affiliate_clicks WHERE clicked_at > NOW() - INTERVAL '7 days'"
    )
    clicks_today = await pool.fetchval(
        "SELECT count(*) FROM affiliate_clicks WHERE clicked_at > CURRENT_DATE"
    )
    total_clicks = await pool.fetchval("SELECT count(*) FROM affiliate_clicks")

    # Top clicked products
    top_products = await pool.fetch("""
        SELECT p.name_en, p.category, count(*) as clicks
        FROM affiliate_clicks ac
        JOIN products p ON ac.product_id = p.id
        GROUP BY p.name_en, p.category
        ORDER BY clicks DESC LIMIT 10
    """)

    # Daily clicks last 7 days
    daily_clicks = await pool.fetch("""
        SELECT DATE(clicked_at) as date, count(*) as clicks
        FROM affiliate_clicks
        WHERE clicked_at > NOW() - INTERVAL '7 days'
        GROUP BY DATE(clicked_at)
        ORDER BY date DESC
    """)

    # Last scrape run
    last_scrape = await pool.fetchrow(
        "SELECT * FROM scrape_runs ORDER BY started_at DESC LIMIT 1"
    )

    # Total user sessions
    total_sessions = await pool.fetchval(
        "SELECT count(DISTINCT session_id) FROM user_events"
    )

    return {
        "products": [
            {"category": r["category"], "count": r["count"]} for r in products
        ],
        "clicks": {
            "today": clicks_today or 0,
            "last_7_days": clicks_7d or 0,
            "total": total_clicks or 0,
        },
        "top_products": [
            {"name": r["name_en"], "category": r["category"], "clicks": r["clicks"]}
            for r in (top_products or [])
        ],
        "daily_clicks": [
            {"date": r["date"].isoformat(), "clicks": r["clicks"]}
            for r in (daily_clicks or [])
        ],
        "last_scrape": {
            "completed_at": last_scrape["completed_at"].isoformat()
            if last_scrape and last_scrape["completed_at"]
            else None,
            "total_upserted": last_scrape["total_upserted"] if last_scrape else 0,
            "total_errors": last_scrape["total_errors"] if last_scrape else 0,
        }
        if last_scrape
        else None,
        "total_sessions": total_sessions or 0,
    }
