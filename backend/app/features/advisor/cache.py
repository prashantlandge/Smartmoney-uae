"""Redis caching for personalized recommendations."""

import json
from app.utils.redis_client import get_redis

PERSONALIZED_TTL = 30 * 60  # 30 minutes


async def get_cached_personalized(session_id: str, cache_type: str) -> dict | None:
    """Get cached personalized data for a user."""
    r = await get_redis()
    key = f"personalized:{cache_type}:{session_id}"
    data = await r.get(key)
    return json.loads(data) if data else None


async def set_cached_personalized(session_id: str, cache_type: str, data: dict | list) -> None:
    """Cache personalized data for a user."""
    r = await get_redis()
    key = f"personalized:{cache_type}:{session_id}"
    await r.set(key, json.dumps(data, default=str), ex=PERSONALIZED_TTL)


async def invalidate_user_cache(session_id: str) -> None:
    """Invalidate all personalized caches for a user."""
    r = await get_redis()
    cursor = 0
    keys_to_delete = []
    while True:
        cursor, keys = await r.scan(cursor, match=f"personalized:*:{session_id}", count=100)
        keys_to_delete.extend(keys)
        if cursor == 0:
            break
    if keys_to_delete:
        await r.delete(*keys_to_delete)
