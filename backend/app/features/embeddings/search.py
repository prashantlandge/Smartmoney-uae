"""Semantic search — pgvector cosine similarity search on products."""

import logging
from app.db.connection import get_pool
from app.features.embeddings.engine import embed_text

logger = logging.getLogger(__name__)


async def semantic_search(query: str, limit: int = 10) -> list[dict]:
    """Search products by semantic similarity to a natural language query.

    Uses pgvector cosine similarity on product embeddings.
    Falls back to text-based search if embeddings unavailable.
    """
    query_embedding = embed_text(query)

    pool = await get_pool()

    if query_embedding:
        vec_str = "[" + ",".join(str(x) for x in query_embedding) + "]"
        try:
            rows = await pool.fetch(
                """SELECT p.id, p.name_en, p.category, p.description_en,
                          pr.name_en as provider_name, p.islamic_compliant,
                          1 - (p.embedding <=> $1::vector) as similarity
                   FROM products p
                   JOIN providers pr ON p.provider_id = pr.id
                   WHERE p.active = true AND p.embedding IS NOT NULL
                   ORDER BY p.embedding <=> $1::vector
                   LIMIT $2""",
                vec_str,
                limit,
            )
            return [
                {
                    "product_id": str(r["id"]),
                    "product_name": r["name_en"],
                    "provider_name": r["provider_name"],
                    "category": r["category"],
                    "description": r["description_en"] or "",
                    "islamic_compliant": r["islamic_compliant"],
                    "similarity": round(float(r["similarity"]), 4),
                }
                for r in rows
            ]
        except Exception as e:
            logger.warning("Vector search failed, falling back to text: %s", e)

    # Fallback: simple text search
    rows = await pool.fetch(
        """SELECT p.id, p.name_en, p.category, p.description_en,
                  pr.name_en as provider_name, p.islamic_compliant
           FROM products p
           JOIN providers pr ON p.provider_id = pr.id
           WHERE p.active = true
             AND (p.name_en ILIKE $1 OR p.description_en ILIKE $1 OR p.category ILIKE $2)
           LIMIT $3""",
        f"%{query}%",
        f"%{query.replace(' ', '_')}%",
        limit,
    )
    return [
        {
            "product_id": str(r["id"]),
            "product_name": r["name_en"],
            "provider_name": r["provider_name"],
            "category": r["category"],
            "description": r["description_en"] or "",
            "islamic_compliant": r["islamic_compliant"],
            "similarity": 0.5,
        }
        for r in rows
    ]
