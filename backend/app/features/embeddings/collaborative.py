"""Collaborative filtering — 'users with similar profiles chose X'."""

import logging
from app.db.connection import get_pool

logger = logging.getLogger(__name__)


async def find_similar_users(session_id: str, limit: int = 10) -> list[str]:
    """Find users with similar preference embeddings using pgvector."""
    pool = await get_pool()

    try:
        rows = await pool.fetch(
            """SELECT up2.session_id,
                      1 - (up1.preference_embedding <=> up2.preference_embedding) as similarity
               FROM user_profiles up1
               JOIN user_profiles up2 ON up1.session_id != up2.session_id
               WHERE up1.session_id = $1
                 AND up1.preference_embedding IS NOT NULL
                 AND up2.preference_embedding IS NOT NULL
               ORDER BY up1.preference_embedding <=> up2.preference_embedding
               LIMIT $2""",
            session_id,
            limit,
        )
        return [r["session_id"] for r in rows]
    except Exception as e:
        logger.warning("Similar user search failed: %s", e)
        # Fallback: same segment
        rows = await pool.fetch(
            """SELECT us2.session_id
               FROM user_segments us1
               JOIN user_segments us2 ON us1.segment = us2.segment AND us1.session_id != us2.session_id
               WHERE us1.session_id = $1
               LIMIT $2""",
            session_id,
            limit,
        )
        return [r["session_id"] for r in rows]


async def get_collaborative_recommendations(session_id: str, limit: int = 5) -> list[dict]:
    """Get products chosen by similar users that this user hasn't seen."""
    pool = await get_pool()

    similar_users = await find_similar_users(session_id, limit=20)
    if not similar_users:
        return []

    # Find products clicked by similar users but not by this user
    rows = await pool.fetch(
        """SELECT p.id, p.name_en, pr.name_en as provider_name, p.category,
                  COUNT(DISTINCT ac.session_id) as chooser_count
           FROM affiliate_clicks ac
           JOIN products p ON ac.product_id = p.id
           JOIN providers pr ON p.provider_id = pr.id
           WHERE ac.session_id = ANY($1)
             AND ac.product_id NOT IN (
                 SELECT product_id FROM affiliate_clicks WHERE session_id = $2 AND product_id IS NOT NULL
             )
             AND p.active = true
           GROUP BY p.id, p.name_en, pr.name_en, p.category
           ORDER BY chooser_count DESC
           LIMIT $3""",
        similar_users,
        session_id,
        limit,
    )

    return [
        {
            "product_id": str(r["id"]),
            "product_name": r["name_en"],
            "provider_name": r["provider_name"],
            "category": r["category"],
            "chooser_count": r["chooser_count"],
            "reason": f"Chosen by {r['chooser_count']} users with similar preferences",
        }
        for r in rows
    ]
