"""Embedding engine — generates vector embeddings for products and user preferences.

Uses sentence-transformers (all-MiniLM-L6-v2) for 384-dimensional embeddings.
Falls back gracefully if torch/sentence-transformers not installed.
"""

import json
import logging
from app.db.connection import get_pool

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Lazy-load the sentence transformer model."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Loaded sentence-transformers model: all-MiniLM-L6-v2")
        except ImportError:
            logger.warning("sentence-transformers not installed, embeddings disabled")
            return None
    return _model


def embed_text(text: str) -> list[float] | None:
    """Generate a 384-dim embedding for a text string."""
    model = _get_model()
    if model is None:
        return None
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def embed_product(product: dict) -> list[float] | None:
    """Generate embedding for a product based on its attributes."""
    parts = [
        product.get("name_en", ""),
        product.get("category", ""),
        product.get("description_en", "") or "",
        product.get("provider_name", ""),
    ]

    # Add key features
    features = product.get("key_features", {})
    if isinstance(features, str):
        try:
            features = json.loads(features)
        except (json.JSONDecodeError, TypeError):
            features = {}
    if isinstance(features, dict):
        for k, v in features.items():
            parts.append(f"{k}: {v}")

    if product.get("islamic_compliant"):
        parts.append("Islamic Shariah-compliant")

    text = " | ".join(p for p in parts if p)
    return embed_text(text)


def embed_user_preferences(profile: dict) -> list[float] | None:
    """Generate embedding for a user's preferences."""
    parts = []
    if profile.get("nationality"):
        parts.append(f"nationality: {profile['nationality']}")
    if profile.get("spending_categories"):
        cats = profile["spending_categories"]
        if isinstance(cats, list):
            parts.append(f"spending: {', '.join(cats)}")
    if profile.get("risk_tolerance"):
        parts.append(f"risk tolerance: {profile['risk_tolerance']}")
    if profile.get("islamic_preference"):
        parts.append("prefers Islamic finance")
    if profile.get("preferred_speed"):
        parts.append(f"transfer speed: {profile['preferred_speed']}")

    if not parts:
        return None

    text = " | ".join(parts)
    return embed_text(text)


async def compute_all_embeddings() -> int:
    """Batch job: compute embeddings for all products and user profiles."""
    model = _get_model()
    if model is None:
        logger.warning("Skipping embedding computation — model not available")
        return 0

    pool = await get_pool()
    count = 0

    # Embed products
    products = await pool.fetch(
        """SELECT p.id, p.name_en, p.category, p.description_en, p.key_features,
                  p.islamic_compliant, pr.name_en as provider_name
           FROM products p
           JOIN providers pr ON p.provider_id = pr.id
           WHERE p.active = true"""
    )

    for prod in products:
        try:
            embedding = embed_product(dict(prod))
            if embedding:
                # Store as pgvector format
                vec_str = "[" + ",".join(str(x) for x in embedding) + "]"
                await pool.execute(
                    "UPDATE products SET embedding = $1 WHERE id = $2",
                    vec_str,
                    prod["id"],
                )
                count += 1
        except Exception as e:
            logger.warning("Failed to embed product %s: %s", prod["id"], e)

    # Embed user preferences
    profiles = await pool.fetch(
        """SELECT session_id, nationality, spending_categories, risk_tolerance,
                  islamic_preference, preferred_speed
           FROM user_profiles
           WHERE quiz_completed_at IS NOT NULL"""
    )

    for profile in profiles:
        try:
            embedding = embed_user_preferences(dict(profile))
            if embedding:
                vec_str = "[" + ",".join(str(x) for x in embedding) + "]"
                await pool.execute(
                    "UPDATE user_profiles SET preference_embedding = $1 WHERE session_id = $2",
                    vec_str,
                    profile["session_id"],
                )
                count += 1
        except Exception as e:
            logger.warning("Failed to embed user %s: %s", profile["session_id"], e)

    logger.info("Computed %d embeddings", count)
    return count
