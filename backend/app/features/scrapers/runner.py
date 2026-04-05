"""Scraper runner — orchestrates all bank scrapers and upserts results to DB."""

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Optional

from app.db.connection import get_pool
from app.features.scrapers.base import ScrapedProduct
from app.features.scrapers.banks.emirates_nbd import EmiratesNBDScraper
from app.features.scrapers.banks.fab import FABScraper
from app.features.scrapers.banks.adcb import ADCBScraper
from app.features.scrapers.banks.mashreq import MashreqScraper
from app.features.scrapers.banks.rakbank import RAKBANKScraper
from app.features.scrapers.banks.dib import DIBScraper, ADIBScraper
from app.features.scrapers.banks.hsbc import HSBCScraper, StandardCharteredScraper

logger = logging.getLogger("scrapers.runner")

# All registered scrapers
SCRAPERS = [
    EmiratesNBDScraper,
    FABScraper,
    ADCBScraper,
    MashreqScraper,
    RAKBANKScraper,
    DIBScraper,
    ADIBScraper,
    HSBCScraper,
    StandardCharteredScraper,
]


async def upsert_product(pool, product: ScrapedProduct) -> Optional[str]:
    """Upsert a scraped product into the database.

    Uses (provider_id, name_en) as the unique key.
    Updates existing products; inserts new ones.
    Returns the product ID.
    """
    # Check if product already exists
    existing = await pool.fetchrow(
        """
        SELECT id FROM products
        WHERE provider_id = $1 AND name_en = $2
        """,
        product.provider_id,
        product.name_en,
    )

    features_json = json.dumps(product.key_features)
    nationality_json = json.dumps(product.nationality_restrictions)
    employer_arr = product.employer_categories
    eligibility_json = json.dumps(product.eligibility_criteria)
    now = datetime.now(timezone.utc)

    if existing:
        # Update existing product
        product_id = str(existing["id"])
        await pool.execute(
            """
            UPDATE products SET
                description_en = COALESCE(NULLIF($1, ''), description_en),
                description_ar = COALESCE(NULLIF($2, ''), description_ar),
                name_ar = COALESCE(NULLIF($3, ''), name_ar),
                min_salary_aed = COALESCE($4, min_salary_aed),
                residency_required = $5,
                nationality_restrictions = COALESCE($6::jsonb, nationality_restrictions),
                employer_categories = COALESCE($7, employer_categories),
                representative_rate = COALESCE($8, representative_rate),
                rate_type = $9,
                min_amount_aed = COALESCE($10, min_amount_aed),
                max_amount_aed = COALESCE($11, max_amount_aed),
                min_tenure_months = COALESCE($12, min_tenure_months),
                max_tenure_months = COALESCE($13, max_tenure_months),
                key_features = COALESCE($14::jsonb, key_features),
                affiliate_deep_link_en = COALESCE(NULLIF($15, ''), affiliate_deep_link_en),
                islamic_compliant = $16,
                data_source = $17,
                eligibility_criteria = COALESCE($18::jsonb, eligibility_criteria),
                last_updated = $19,
                active = true
            WHERE id = $20
            """,
            product.description_en,
            product.description_ar,
            product.name_ar,
            product.min_salary_aed,
            product.residency_required,
            nationality_json,
            employer_arr,
            product.representative_rate,
            product.rate_type,
            product.min_amount_aed,
            product.max_amount_aed,
            product.min_tenure_months,
            product.max_tenure_months,
            features_json,
            product.affiliate_deep_link_en,
            product.islamic_compliant,
            product.data_source,
            eligibility_json,
            now,
            existing["id"],
        )
        logger.info(f"Updated product: {product.name_en} (id={product_id})")
        return product_id
    else:
        # Insert new product
        row = await pool.fetchrow(
            """
            INSERT INTO products (
                provider_id, category, name_en, name_ar,
                description_en, description_ar,
                min_salary_aed, residency_required,
                nationality_restrictions, employer_categories,
                representative_rate, rate_type,
                min_amount_aed, max_amount_aed,
                min_tenure_months, max_tenure_months,
                key_features, affiliate_deep_link_en,
                commission_amount_aed, commission_percentage, commission_type,
                islamic_compliant, data_source,
                eligibility_criteria, last_updated, active
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10,
                $11, $12, $13, $14, $15, $16, $17::jsonb, $18,
                $19, $20, $21, $22, $23, $24::jsonb, $25, true
            )
            RETURNING id
            """,
            product.provider_id,
            product.category,
            product.name_en,
            product.name_ar,
            product.description_en,
            product.description_ar,
            product.min_salary_aed,
            product.residency_required,
            nationality_json,
            employer_arr,
            product.representative_rate,
            product.rate_type,
            product.min_amount_aed,
            product.max_amount_aed,
            product.min_tenure_months,
            product.max_tenure_months,
            features_json,
            product.affiliate_deep_link_en,
            product.commission_amount_aed,
            product.commission_percentage,
            product.commission_type,
            product.islamic_compliant,
            product.data_source,
            eligibility_json,
            now,
        )
        product_id = str(row["id"])
        logger.info(f"Inserted new product: {product.name_en} (id={product_id})")
        return product_id


async def run_scraper(scraper_class, semaphore: asyncio.Semaphore) -> dict:
    """Run a single bank scraper with concurrency control."""
    async with semaphore:
        scraper_name = scraper_class.PROVIDER_NAME if hasattr(scraper_class, 'PROVIDER_NAME') else scraper_class.__name__
        try:
            async with scraper_class() as scraper:
                products = await scraper.scrape_all()
                return {
                    "provider": scraper_name,
                    "products": products,
                    "status": "success",
                    "count": len(products),
                }
        except Exception as e:
            logger.error(f"Scraper {scraper_name} failed: {e}")
            return {
                "provider": scraper_name,
                "products": [],
                "status": "error",
                "error": str(e),
                "count": 0,
            }


async def run_all_scrapers() -> dict:
    """Run all bank scrapers concurrently and upsert results.

    Returns a summary of the scrape run.
    """
    start_time = datetime.now(timezone.utc)
    logger.info("=== Starting daily scrape run ===")

    # Limit concurrent scrapers to avoid overwhelming bank sites
    semaphore = asyncio.Semaphore(3)

    # Run all scrapers concurrently
    tasks = [run_scraper(cls, semaphore) for cls in SCRAPERS]
    results = await asyncio.gather(*tasks)

    # Upsert all products to database
    pool = await get_pool()
    total_upserted = 0
    total_errors = 0
    provider_summaries = []

    for result in results:
        provider_summary = {
            "provider": result["provider"],
            "scraped": result["count"],
            "status": result["status"],
            "upserted": 0,
            "errors": 0,
        }

        if result.get("error"):
            provider_summary["error"] = result["error"]

        for product in result["products"]:
            try:
                await upsert_product(pool, product)
                provider_summary["upserted"] += 1
                total_upserted += 1
            except Exception as e:
                logger.error(f"Failed to upsert {product.name_en}: {e}")
                provider_summary["errors"] += 1
                total_errors += 1

        provider_summaries.append(provider_summary)

    end_time = datetime.now(timezone.utc)
    duration = (end_time - start_time).total_seconds()

    summary = {
        "started_at": start_time.isoformat(),
        "completed_at": end_time.isoformat(),
        "duration_seconds": round(duration, 2),
        "total_scraped": sum(r["count"] for r in results),
        "total_upserted": total_upserted,
        "total_errors": total_errors,
        "providers": provider_summaries,
    }

    logger.info(
        f"=== Scrape complete: {total_upserted} upserted, {total_errors} errors "
        f"in {duration:.1f}s ==="
    )

    # Record scrape run in database for audit trail
    try:
        await pool.execute(
            """
            INSERT INTO scrape_runs (started_at, completed_at, duration_seconds,
                                     total_scraped, total_upserted, total_errors, details)
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
            """,
            start_time,
            end_time,
            round(duration, 2),
            summary["total_scraped"],
            total_upserted,
            total_errors,
            json.dumps(provider_summaries),
        )
    except Exception as e:
        # Table might not exist yet — that's ok
        logger.warning(f"Could not record scrape run: {e}")

    return summary
