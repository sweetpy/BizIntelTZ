from collections import deque
from urllib.parse import urljoin, urlparse
from uuid import uuid4
import datetime
import random
import requests
from bs4 import BeautifulSoup

from database import Database


def generate_bi_id():
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    random_suffix = f"{random.randint(1000, 9999)}"
    return f"BIZ-TZ-{date_str}-{random_suffix}"


def crawl_site(start_url: str, db: Database, max_pages: int = 5) -> int:
    """Basic breadth-first crawler that stores discovered businesses."""
    visited = set()
    queue = deque([start_url])
    added = 0

    while queue and len(visited) < max_pages:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)
        try:
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
        except Exception:
            continue

        soup = BeautifulSoup(resp.text, "html.parser")

        for tag in soup.select("[data-biz-name]"):
            name = tag.get("data-biz-name") or tag.get_text(strip=True)
            biz_id = str(uuid4())
            db.add_business(
                type("Biz", (), {
                    "id": biz_id,
                    "name": name,
                    "bi_id": generate_bi_id(),
                    "region": None,
                    "sector": None,
                    "digital_score": None,
                    "formality": None,
                    "premium": False,
                    "verified": False,
                    "claimed": False,
                })
            )
            added += 1

        for link in soup.find_all("a", href=True):
            next_url = urljoin(url, link["href"])
            if urlparse(next_url).netloc == urlparse(start_url).netloc and next_url not in visited:
                queue.append(next_url)

    return added


if __name__ == "__main__":
    db = Database()
    count = crawl_site("https://example.com", db, max_pages=1)
    print(f"Discovered {count} businesses")
