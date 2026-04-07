import asyncio
import logging

import asyncpg

from app.config import settings

logger = logging.getLogger("db.connection")

pool: asyncpg.Pool | None = None

MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds


async def create_pool() -> asyncpg.Pool:
    """Create the database connection pool with retry logic."""
    global pool
    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            pool = await asyncpg.create_pool(
                dsn=settings.database_url,
                min_size=2,
                max_size=10,
                command_timeout=30,
                timeout=10,
            )
            # Verify connection works
            async with pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            logger.info("Database connection pool created successfully")
            return pool
        except Exception as e:
            last_error = e
            logger.error(
                f"Database connection attempt {attempt}/{MAX_RETRIES} failed: {e}"
            )
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY * attempt)

    logger.critical(f"Failed to connect to database after {MAX_RETRIES} attempts: {last_error}")
    raise ConnectionError(f"Database connection failed: {last_error}")


async def close_pool() -> None:
    global pool
    if pool:
        await pool.close()
        pool = None
        logger.info("Database connection pool closed")


async def get_pool() -> asyncpg.Pool:
    if pool is None:
        return await create_pool()
    return pool


async def check_pool_health() -> dict:
    """Check if the database pool is healthy. Returns status dict."""
    if pool is None:
        return {"status": "disconnected", "pool_size": 0, "free_size": 0}
    try:
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {
            "status": "healthy",
            "pool_size": pool.get_size(),
            "free_size": pool.get_idle_size(),
            "min_size": pool.get_min_size(),
            "max_size": pool.get_max_size(),
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}
