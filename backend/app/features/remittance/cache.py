import json
from datetime import datetime
from app.utils.redis_client import get_redis

CACHE_TTL_SECONDS = 15 * 60  # 15 minutes


def _cache_key(send_amount_aed: float, receive_currency: str) -> str:
    # Round to nearest 10 to improve cache hit rates
    rounded = round(send_amount_aed / 10) * 10
    return f"remittance:{rounded}:{receive_currency}"


async def get_cached_result(send_amount_aed: float, receive_currency: str) -> dict | None:
    try:
        r = await get_redis()
        key = _cache_key(send_amount_aed, receive_currency)
        data = await r.get(key)
        if data:
            return json.loads(data)
    except Exception:
        pass
    return None


async def set_cached_result(
    send_amount_aed: float, receive_currency: str, result: dict
) -> None:
    try:
        r = await get_redis()
        key = _cache_key(send_amount_aed, receive_currency)
        await r.set(key, json.dumps(result, default=str), ex=CACHE_TTL_SECONDS)
    except Exception:
        pass  # Cache failures should not break the response
