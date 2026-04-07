"""Deactivate non-product entries and sparse junk entries."""
import asyncio
import os
import asyncpg

# Exact names of junk entries to deactivate
JUNK_NAMES = [
    # Junk scraped entries (not actual products)
    "FAB Landlord Loans",
    "FAB Indicative Personal Loan EMI Calculator",
    "FAB New to Country Loans / New to Employment Loans",
    "Emirates NBD Apply for an Emirates NBD loan and be part of the most innovative bank in the region",
    # Old sparse entries that will be replaced by enriched scraper data
    "FAB Personal Loans",
    "FAB Non-listed Company Personal Loan",
]

JUNK_PATTERNS = [
    "%Visit one of our branches%",
    "%Chat anytime%",
    "%Frequently Asked Questions%",
    "%Credit Card Services%",
    "%basics you need to know%",
    "%Important Reminders%",
    "%Credit Bureau ratings%",
    "%Visa Instalment Solution%",
    "%Indicative%Calculator%",
    "%Landlord Loans%",
    "%New to Country%",
    "%Apply for an%loan and be part%",
]


async def main():
    dsn = os.environ.get(
        "DATABASE_URL",
        "postgresql://smartmoney:smartmoney@postgres:5432/smartmoney_uae",
    )
    conn = await asyncpg.connect(dsn=dsn)

    # Deactivate by exact name
    for name in JUNK_NAMES:
        result = await conn.execute(
            "UPDATE products SET active = false WHERE name_en = $1", name
        )
        print(f"  Name '{name}': {result}")

    # Deactivate by pattern
    for pat in JUNK_PATTERNS:
        result = await conn.execute(
            "UPDATE products SET active = false WHERE name_en ILIKE $1", pat
        )
        print(f"  Pattern '{pat}': {result}")

    # Deactivate personal loans with 0-1 features (too sparse to be useful)
    result = await conn.execute("""
        UPDATE products SET active = false
        WHERE category = 'personal_loan'
          AND active = true
          AND (key_features IS NULL OR jsonb_array_length(to_jsonb(array(SELECT jsonb_object_keys(key_features)))) <= 1)
    """)
    print(f"  Sparse loans (0-1 features): {result}")

    # Show remaining active products summary
    rows = await conn.fetch("""
        SELECT category, COUNT(*) as cnt,
               ROUND(AVG(jsonb_array_length(to_jsonb(array(SELECT jsonb_object_keys(key_features)))))) as avg_features
        FROM products WHERE active = true
        GROUP BY category ORDER BY category
    """)
    print("\nActive products summary:")
    for r in rows:
        print(f"  {r['category']}: {r['cnt']} products, ~{r['avg_features']} avg features")

    await conn.close()
    print("\nDone.")

if __name__ == "__main__":
    asyncio.run(main())
