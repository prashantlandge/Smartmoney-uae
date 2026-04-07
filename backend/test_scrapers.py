"""Full test script — runs all HTML + PDF scrapers and upserts to database."""

import asyncio
import json
import sys
import time
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault("DATABASE_URL", "postgresql://smartmoney:smartmoney_dev@localhost:5432/smartmoney_uae")

from app.features.scrapers.base import ScrapedProduct


async def run_html_scrapers():
    """Run all HTML bank scrapers and collect results."""
    from app.features.scrapers.banks.emirates_nbd import EmiratesNBDScraper
    from app.features.scrapers.banks.fab import FABScraper
    from app.features.scrapers.banks.adcb import ADCBScraper
    from app.features.scrapers.banks.mashreq import MashreqScraper
    from app.features.scrapers.banks.rakbank import RAKBANKScraper
    from app.features.scrapers.banks.dib import DIBScraper, ADIBScraper
    from app.features.scrapers.banks.hsbc import HSBCScraper, StandardCharteredScraper
    from app.features.scrapers.banks.emirates_islamic import EmiratesIslamicScraper
    from app.features.scrapers.banks.citibank import CitibankScraper
    from app.features.scrapers.banks.cbd import CBDScraper
    from app.features.scrapers.banks.digital_banks import LivScraper, WioScraper
    from app.features.scrapers.banks.small_banks import AjmanBankScraper, SharjahIslamicScraper

    scrapers = [
        EmiratesNBDScraper, FABScraper, ADCBScraper, MashreqScraper,
        RAKBANKScraper, DIBScraper, ADIBScraper, HSBCScraper,
        StandardCharteredScraper, EmiratesIslamicScraper, CitibankScraper,
        CBDScraper, LivScraper, WioScraper, AjmanBankScraper, SharjahIslamicScraper,
    ]

    results = []
    for scraper_cls in scrapers:
        name = scraper_cls.PROVIDER_NAME
        start = time.time()
        try:
            async with scraper_cls() as scraper:
                products = await scraper.scrape_all()
                elapsed = time.time() - start
                results.append({
                    "provider": name,
                    "products": products,
                    "count": len(products),
                    "time": round(elapsed, 2),
                    "status": "success",
                    "data_sources": list(set(p.data_source for p in products)),
                })
        except Exception as e:
            elapsed = time.time() - start
            results.append({
                "provider": name,
                "products": [],
                "count": 0,
                "time": round(elapsed, 2),
                "status": "error",
                "error": str(e),
            })
    return results


async def run_pdf_scrapers():
    """Run all PDF scrapers and collect results."""
    from app.features.scrapers.pdf.banks.emirates_nbd import EmiratesNBDPDFScraper
    from app.features.scrapers.pdf.banks.fab import FABPDFScraper
    from app.features.scrapers.pdf.banks.adcb import ADCBPDFScraper
    from app.features.scrapers.pdf.banks.mashreq import MashreqPDFScraper
    from app.features.scrapers.pdf.banks.rakbank import RAKBANKPDFScraper
    from app.features.scrapers.pdf.banks.dib import DIBPDFScraper, ADIBPDFScraper
    from app.features.scrapers.pdf.banks.hsbc import HSBCPDFScraper, StandardCharteredPDFScraper
    from app.features.scrapers.pdf.banks.emirates_islamic import EmiratesIslamicPDFScraper
    from app.features.scrapers.pdf.banks.citibank import CitibankPDFScraper
    from app.features.scrapers.pdf.banks.cbd import CBDPDFScraper
    from app.features.scrapers.pdf.banks.digital_banks import LivPDFScraper, WioPDFScraper
    from app.features.scrapers.pdf.banks.small_banks import AjmanBankPDFScraper, SharjahIslamicPDFScraper
    from app.features.scrapers.pdf.banks.insurance import (
        OmanInsurancePDFScraper, OrientInsurancePDFScraper, AXAGulfPDFScraper,
        DamanHealthPDFScraper, SukoonInsurancePDFScraper, RSAInsurancePDFScraper,
    )
    from app.features.scrapers.pdf.banks.exchange import (
        WisePDFScraper, RemitlyPDFScraper, WesternUnionPDFScraper,
        AlAnsariPDFScraper, UAEExchangePDFScraper, LuluExchangePDFScraper,
    )

    scrapers = [
        # Tier 1: Banks
        EmiratesNBDPDFScraper, FABPDFScraper, ADCBPDFScraper, MashreqPDFScraper,
        RAKBANKPDFScraper, DIBPDFScraper, ADIBPDFScraper, HSBCPDFScraper,
        StandardCharteredPDFScraper,
        # Tier 2: New banks
        EmiratesIslamicPDFScraper, CitibankPDFScraper, CBDPDFScraper,
        LivPDFScraper, WioPDFScraper, AjmanBankPDFScraper, SharjahIslamicPDFScraper,
        # Tier 3: Exchange
        WisePDFScraper, RemitlyPDFScraper, WesternUnionPDFScraper,
        AlAnsariPDFScraper, UAEExchangePDFScraper, LuluExchangePDFScraper,
        # Tier 4: Insurance
        OmanInsurancePDFScraper, OrientInsurancePDFScraper, AXAGulfPDFScraper,
        DamanHealthPDFScraper, SukoonInsurancePDFScraper, RSAInsurancePDFScraper,
    ]

    results = []
    for scraper_cls in scrapers:
        name = scraper_cls.PROVIDER_NAME
        start = time.time()
        try:
            async with scraper_cls() as scraper:
                products = await scraper.scrape_pdfs()
                elapsed = time.time() - start
                results.append({
                    "provider": name,
                    "products": products,
                    "count": len(products),
                    "time": round(elapsed, 2),
                    "status": "success" if products else "no_data",
                })
        except Exception as e:
            elapsed = time.time() - start
            results.append({
                "provider": name,
                "products": [],
                "count": 0,
                "time": round(elapsed, 2),
                "status": "error",
                "error": str(e),
            })
    return results


def print_product_summary(product: ScrapedProduct) -> str:
    """Format a product for display."""
    features_count = len(product.key_features) if product.key_features else 0
    features_preview = dict(list(product.key_features.items())[:5]) if product.key_features else {}
    return (
        f"    - {product.name_en} [{product.category}]\n"
        f"      Data source: {product.data_source} | Features: {features_count}\n"
        f"      Key features: {json.dumps(features_preview, default=str)}"
    )


async def main():
    print("=" * 80)
    print("SmartMoney UAE — Scraper Test Run")
    print("=" * 80)

    # ── HTML Scrapers ──
    print("\n" + "─" * 80)
    print("PHASE 1: HTML SCRAPERS (16 banks)")
    print("─" * 80)

    html_start = time.time()
    html_results = await run_html_scrapers()
    html_elapsed = time.time() - html_start

    html_total_products = 0
    for r in html_results:
        status_icon = "✓" if r["count"] > 0 else "✗"
        sources = ", ".join(r.get("data_sources", [])) if r.get("data_sources") else r.get("error", "no data")
        print(f"\n  {status_icon} {r['provider']} — {r['count']} products ({r['time']}s) [{sources}]")
        html_total_products += r["count"]
        for p in r["products"]:
            print(print_product_summary(p))

    print(f"\n  HTML TOTAL: {html_total_products} products from {len(html_results)} banks in {round(html_elapsed, 1)}s")

    # ── PDF Scrapers ──
    print("\n" + "─" * 80)
    print("PHASE 2: PDF SCRAPERS (28 providers)")
    print("─" * 80)

    pdf_start = time.time()
    pdf_results = await run_pdf_scrapers()
    pdf_elapsed = time.time() - pdf_start

    pdf_total_products = 0
    pdf_success = 0
    pdf_no_data = 0
    pdf_errors = 0
    for r in pdf_results:
        if r["status"] == "success":
            status_icon = "✓"
            pdf_success += 1
        elif r["status"] == "no_data":
            status_icon = "○"
            pdf_no_data += 1
        else:
            status_icon = "✗"
            pdf_errors += 1

        detail = r.get("error", f"{r['count']} products") if r["status"] == "error" else f"{r['count']} products"
        print(f"\n  {status_icon} {r['provider']} — {detail} ({r['time']}s)")
        pdf_total_products += r["count"]
        for p in r["products"]:
            print(print_product_summary(p))

    print(f"\n  PDF TOTAL: {pdf_total_products} products from {len(pdf_results)} providers in {round(pdf_elapsed, 1)}s")
    print(f"  PDF Status: {pdf_success} success, {pdf_no_data} no data (URLs may need updating), {pdf_errors} errors")

    # ── Upsert to Database ──
    print("\n" + "─" * 80)
    print("PHASE 3: DATABASE UPSERT")
    print("─" * 80)

    all_scraped_products = []
    for r in html_results + pdf_results:
        all_scraped_products.extend(r["products"])

    if all_scraped_products:
        try:
            from app.features.scrapers.runner import upsert_product
            from app.db.connection import create_pool, close_pool

            pool = await create_pool()
            upsert_success = 0
            upsert_errors = 0
            for product in all_scraped_products:
                try:
                    await upsert_product(pool, product)
                    upsert_success += 1
                except Exception as e:
                    upsert_errors += 1
                    print(f"  Upsert error for {product.name_en}: {e}")

            # Get final counts
            row = await pool.fetchrow("SELECT COUNT(*) as cnt FROM products WHERE active = true")
            total_in_db = row["cnt"] if row else 0

            row2 = await pool.fetchrow(
                "SELECT data_source, COUNT(*) as cnt FROM products WHERE active = true GROUP BY data_source ORDER BY cnt DESC"
            )

            sources = await pool.fetch(
                "SELECT data_source, COUNT(*) as cnt FROM products WHERE active = true GROUP BY data_source ORDER BY cnt DESC"
            )

            print(f"\n  Upserted: {upsert_success} products ({upsert_errors} errors)")
            print(f"  Total products in DB: {total_in_db}")
            print(f"  By data source:")
            for s in sources:
                print(f"    {s['data_source'] or 'null'}: {s['cnt']}")

            await close_pool()
        except Exception as e:
            print(f"  Database error: {e}")

    # ── Grand Summary ──
    print("\n" + "=" * 80)
    print("GRAND SUMMARY")
    print("=" * 80)
    print(f"  HTML scrapers: {html_total_products} products from {len(html_results)} banks")
    print(f"  PDF scrapers:  {pdf_total_products} products from {len(pdf_results)} providers")
    print(f"  Total:         {html_total_products + pdf_total_products} products")
    print(f"  Total time:    {round(html_elapsed + pdf_elapsed, 1)}s")

    # Categories breakdown
    all_products = []
    for r in html_results + pdf_results:
        all_products.extend(r["products"])

    categories = {}
    for p in all_products:
        categories[p.category] = categories.get(p.category, 0) + 1

    print(f"\n  By category:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"    {cat}: {count}")

    # Provider coverage
    providers_with_data = set()
    for r in html_results + pdf_results:
        if r["count"] > 0:
            providers_with_data.add(r["provider"])

    print(f"\n  Providers with data: {len(providers_with_data)}/{len(html_results) + len(pdf_results) - len(set(r['provider'] for r in html_results) & set(r['provider'] for r in pdf_results))}")

    # Feature richness
    if all_products:
        avg_features = sum(len(p.key_features) for p in all_products) / len(all_products)
        max_features = max(len(p.key_features) for p in all_products)
        print(f"  Avg features per product: {avg_features:.1f}")
        print(f"  Max features in a product: {max_features}")


if __name__ == "__main__":
    asyncio.run(main())
