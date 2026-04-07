"""PDF parsing utilities using pdfplumber.

Provides table extraction, text extraction, and table search helpers.
"""

import io
import logging
from typing import Optional

import pdfplumber

logger = logging.getLogger("scrapers.pdf.parser")


def extract_tables(pdf_bytes: bytes) -> list[list[list[str]]]:
    """Extract all tables from a PDF.

    Returns a list of tables, where each table is a list of rows,
    and each row is a list of cell strings.
    """
    tables = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_tables = page.extract_tables()
                if page_tables:
                    for table in page_tables:
                        # Clean cell values
                        cleaned = []
                        for row in table:
                            cleaned_row = [
                                (cell.strip() if isinstance(cell, str) else "")
                                for cell in row
                            ]
                            cleaned.append(cleaned_row)
                        tables.append(cleaned)
    except Exception as e:
        logger.error(f"Table extraction failed: {e}")
    return tables


def extract_text(pdf_bytes: bytes) -> str:
    """Extract full text from all pages of a PDF.

    Pages are separated by '--- Page N ---' markers.
    """
    parts = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for i, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                if text:
                    parts.append(f"--- Page {i} ---\n{text}")
    except Exception as e:
        logger.error(f"Text extraction failed: {e}")
    return "\n\n".join(parts)


def extract_page_text(pdf_bytes: bytes, page_num: int) -> str:
    """Extract text from a specific page (1-indexed)."""
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            if 1 <= page_num <= len(pdf.pages):
                return pdf.pages[page_num - 1].extract_text() or ""
    except Exception as e:
        logger.error(f"Page text extraction failed for page {page_num}: {e}")
    return ""


def find_table_by_header(
    tables: list[list[list[str]]],
    header_keywords: list[str],
    case_sensitive: bool = False,
) -> Optional[list[list[str]]]:
    """Find the first table whose header row contains all specified keywords.

    Args:
        tables: List of tables from extract_tables().
        header_keywords: Words to look for in the first row.
        case_sensitive: Whether matching is case-sensitive.

    Returns:
        The matching table or None.
    """
    for table in tables:
        if not table:
            continue
        header = " ".join(table[0])
        if not case_sensitive:
            header = header.lower()
            keywords = [kw.lower() for kw in header_keywords]
        else:
            keywords = header_keywords
        if all(kw in header for kw in keywords):
            return table
    return None


def find_tables_by_keyword(
    tables: list[list[list[str]]],
    keyword: str,
    case_sensitive: bool = False,
) -> list[list[list[str]]]:
    """Find all tables containing a keyword anywhere in their cells."""
    matches = []
    for table in tables:
        for row in table:
            row_text = " ".join(row)
            if not case_sensitive:
                row_text = row_text.lower()
                keyword = keyword.lower()
            if keyword in row_text:
                matches.append(table)
                break
    return matches


def table_to_dict(table: list[list[str]]) -> list[dict[str, str]]:
    """Convert a table with header row into a list of dicts.

    First row is used as keys. Subsequent rows become dicts.
    """
    if len(table) < 2:
        return []
    headers = [h.strip() for h in table[0]]
    rows = []
    for row in table[1:]:
        row_dict = {}
        for i, cell in enumerate(row):
            if i < len(headers) and headers[i]:
                row_dict[headers[i]] = cell.strip() if isinstance(cell, str) else ""
        rows.append(row_dict)
    return rows
