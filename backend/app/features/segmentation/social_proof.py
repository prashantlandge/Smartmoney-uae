"""Social proof engine — computes 'users like you chose X' stats per segment."""

import logging
from app.db.connection import get_pool

logger = logging.getLogger(__name__)


async def compute_social_proof() -> int:
    """Batch job: compute social proof stats per segment.

    Counts affiliate_clicks joined with user_segments to determine
    which products are most popular within each behavioral segment.
    """
    pool = await get_pool()

    # Clear stale data
    await pool.execute("DELETE FROM social_proof_stats WHERE computed_at < NOW() - INTERVAL '2 days'")

    rows = await pool.fetch(
        """SELECT us.segment, ac.product_id, COUNT(*) as click_count,
                  SUM(CASE WHEN ac.converted THEN 1 ELSE 0 END) as conversion_count
           FROM affiliate_clicks ac
           JOIN user_segments us ON ac.session_id = us.session_id
           WHERE ac.product_id IS NOT NULL
             AND ac.clicked_at > NOW() - INTERVAL '30 days'
           GROUP BY us.segment, ac.product_id
           HAVING COUNT(*) >= 2
           ORDER BY us.segment, click_count DESC""",
    )

    count = 0
    for r in rows:
        await pool.execute(
            """INSERT INTO social_proof_stats (segment, product_id, click_count, conversion_count, computed_at)
               VALUES ($1, $2, $3, $4, NOW())
               ON CONFLICT (segment, product_id)
               DO UPDATE SET click_count = $3, conversion_count = $4, computed_at = NOW()""",
            r["segment"],
            r["product_id"],
            r["click_count"],
            r["conversion_count"],
        )
        count += 1

    logger.info("Computed %d social proof stats", count)
    return count


async def get_social_proof(segment: str, product_ids: list[str] | None = None) -> dict:
    """Get social proof data for a segment.

    Returns {product_id: {click_count, conversion_count, label}}.
    """
    pool = await get_pool()

    if product_ids:
        rows = await pool.fetch(
            """SELECT product_id, click_count, conversion_count
               FROM social_proof_stats
               WHERE segment = $1 AND product_id = ANY($2::uuid[])
               ORDER BY click_count DESC LIMIT 10""",
            segment,
            product_ids,
        )
    else:
        rows = await pool.fetch(
            """SELECT sps.product_id, sps.click_count, sps.conversion_count,
                      p.name_en as product_name, pr.name_en as provider_name
               FROM social_proof_stats sps
               JOIN products p ON sps.product_id = p.id
               JOIN providers pr ON p.provider_id = pr.id
               WHERE sps.segment = $1
               ORDER BY sps.click_count DESC LIMIT 10""",
            segment,
        )

    segment_labels = {
        "fee_sensitive": "cost-conscious",
        "speed_first": "speed-focused",
        "balanced": "similar",
        "price_hunter": "deal-seeking",
        "islamic_focused": "Islamic finance",
        "new_user": "new",
    }
    label = segment_labels.get(segment, "similar")

    result = {}
    for r in rows:
        pid = str(r["product_id"])
        result[pid] = {
            "click_count": r["click_count"],
            "conversion_count": r["conversion_count"],
            "label": f"Popular with {label} users",
            "product_name": r.get("product_name", ""),
            "provider_name": r.get("provider_name", ""),
        }
    return result
