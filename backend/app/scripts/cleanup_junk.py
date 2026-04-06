"""Deactivate non-product entries that got scraped by mistake."""
import asyncio
import os
import asyncpg

JUNK_PATTERNS = [
    "%Visit one of our branches%",
    "%Chat anytime%",
    "%Frequently Asked Questions%",
    "%Credit Card Services%",
    "%basics you need to know%",
    "%Important Reminders%",
    "%Credit Bureau ratings%",
    "%Visa Instalment Solution%",
]

async def main():
    dsn = os.environ.get(
        "DATABASE_URL",
        "postgresql://smartmoney:smartmoney@postgres:5432/smartmoney_uae",
    )
    conn = await asyncpg.connect(dsn=dsn)
    for pat in JUNK_PATTERNS:
        result = await conn.execute(
            "UPDATE products SET active = false WHERE name_en ILIKE $1", pat
        )
        print(f"  {pat}: {result}")
    await conn.close()
    print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
