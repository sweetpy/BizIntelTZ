"""Simple website crawler for discovering businesses.

This crawler looks for structured data in pages such as JSON-LD or
microdata using the ``LocalBusiness`` schema. Discovered businesses are
stored in the SQLite database via :class:`Database`.
"""

from collections import deque
from types import SimpleNamespace
from urllib.parse import urljoin, urlparse
from uuid import uuid4
import datetime
import json
import random

import requests
from bs4 import BeautifulSoup

from database import Database


def generate_bi_id() -> str:
    """Generate a unique Business Intelligence ID."""
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    random_suffix = f"{random.randint(1000, 9999)}"
    return f"BIZ-TZ-{date_str}-{random_suffix}"


def _parse_businesses(html: str):
    """Extract business info from a page."""
    soup = BeautifulSoup(html, "html.parser")
    businesses = []

    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "{}")
        except json.JSONDecodeError:
            continue
        items = data if isinstance(data, list) else [data]
        for item in items:
            if item.get("@type") in {"LocalBusiness", "Organization"}:
                name = item.get("name")
                if not name:
                    continue
                address = item.get("address", {}) or {}
                businesses.append(
                    {
                        "name": name,
                        "region": address.get("addressLocality"),
                        "sector": item.get("@type"),
                    }
                )

    for tag in soup.select("[data-biz-name]"):
        businesses.append(
            {
                "name": tag.get("data-biz-name") or tag.get_text(strip=True),
                "region": tag.get("data-biz-region"),
                "sector": tag.get("data-biz-sector"),
            }
        )

    return businesses, soup


def crawl_site(start_url: str, db: Database, max_pages: int = 10) -> int:
    """Crawl ``start_url`` and store discovered businesses."""
    visited = set()
    queue = deque([start_url])
    added = 0
    start_time = datetime.datetime.utcnow().isoformat()

    while queue and len(visited) < max_pages:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
        except Exception:
            continue

        businesses, soup = _parse_businesses(resp.text)

        for b in businesses:
            biz = SimpleNamespace(
                id=str(uuid4()),
                name=b["name"],
                bi_id=generate_bi_id(),
                region=b.get("region"),
                sector=b.get("sector"),
                digital_score=None,
                formality=None,
                premium=False,
                verified=False,
                claimed=False,
            )
            db.add_business(biz)
            added += 1

        for link in soup.find_all("a", href=True):
            next_url = urljoin(url, link["href"])
            if urlparse(next_url).netloc == urlparse(start_url).netloc and next_url not in visited:
                queue.append(next_url)

    end_time = datetime.datetime.utcnow().isoformat()
    db.log_crawl(start_time, end_time, len(visited), added)
    return added


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python crawler.py <start_url> [pages]")
        sys.exit(1)

    start_url = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    db = Database()
    count = crawl_site(start_url, db, max_pages=max_pages)
    print(f"Discovered {count} businesses")
