import asyncpg
from app.config import settings

pool: asyncpg.Pool | None = None


async def create_pool() -> asyncpg.Pool:
    global pool
    pool = await asyncpg.create_pool(
        dsn=settings.database_url,
        min_size=2,
        max_size=10,
    )
    return pool


async def close_pool() -> None:
    global pool
    if pool:
        await pool.close()
        pool = None


async def get_pool() -> asyncpg.Pool:
    if pool is None:
        return await create_pool()
    return pool
