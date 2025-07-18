import sqlite3
from typing import Optional
from contextlib import contextmanager

class Database:
    def __init__(self, path: str = "bizinteltz.db"):
        self.path = path
        self._init_db()

    @contextmanager
    def connection(self):
        conn = sqlite3.connect(self.path)
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self):
        with self.connection() as conn:
            c = conn.cursor()
            c.execute(
                """CREATE TABLE IF NOT EXISTS businesses (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    bi_id TEXT UNIQUE,
                    region TEXT,
                    sector TEXT,
                    digital_score INTEGER,
                    formality TEXT,
                    premium INTEGER,
                    verified INTEGER,
                    claimed INTEGER
                )"""
            )
            c.execute(
                """CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    business_id TEXT,
                    rating INTEGER,
                    comment TEXT
                )"""
            )
            c.execute(
                """CREATE TABLE IF NOT EXISTS claims (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    business_id TEXT,
                    owner_name TEXT,
                    contact TEXT,
                    approved INTEGER
                )"""
            )
            c.execute(
                """CREATE TABLE IF NOT EXISTS analytics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    business_id TEXT,
                    action TEXT
                )"""
            )
            c.execute(
                """CREATE TABLE IF NOT EXISTS leads (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    business_id TEXT,
                    name TEXT,
                    message TEXT
                )"""
            )
            c.execute(
                """CREATE TABLE IF NOT EXISTS media (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    business_id TEXT,
                    filename TEXT
                )"""
            )
            conn.commit()

    def add_business(self, biz):
        with self.connection() as conn:
            conn.execute(
                """INSERT OR REPLACE INTO businesses(
                    id, name, bi_id, region, sector, digital_score, formality,
                    premium, verified, claimed
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    biz.id,
                    biz.name,
                    biz.bi_id,
                    biz.region,
                    biz.sector,
                    biz.digital_score,
                    biz.formality,
                    int(biz.premium),
                    int(biz.verified),
                    int(biz.claimed),
                ),
            )
            conn.commit()

    def delete_business(self, biz_id: str):
        with self.connection() as conn:
            conn.execute("DELETE FROM businesses WHERE id=?", (biz_id,))
            conn.commit()

    def add_review(self, review):
        with self.connection() as conn:
            conn.execute(
                "INSERT INTO reviews(business_id, rating, comment) VALUES (?, ?, ?)",
                (review.business_id, review.rating, review.comment),
            )
            conn.commit()

    def add_claim(self, claim):
        with self.connection() as conn:
            conn.execute(
                "INSERT INTO claims(business_id, owner_name, contact, approved) VALUES (?, ?, ?, ?)",
                (claim.business_id, claim.owner_name, claim.contact, int(claim.approved)),
            )
            conn.commit()

    def approve_claim(self, claim):
        with self.connection() as conn:
            conn.execute(
                "UPDATE claims SET approved=1 WHERE business_id=? AND owner_name=? AND contact=?",
                (claim.business_id, claim.owner_name, claim.contact),
            )
            conn.commit()

    def add_event(self, event):
        with self.connection() as conn:
            conn.execute(
                "INSERT INTO analytics(business_id, action) VALUES (?, ?)",
                (event.business_id, event.action),
            )
            conn.commit()

    def add_lead(self, lead):
        with self.connection() as conn:
            conn.execute(
                "INSERT INTO leads(business_id, name, message) VALUES (?, ?, ?)",
                (lead.business_id, lead.name, lead.message),
            )
            conn.commit()

    def add_media(self, biz_id: str, filename: str):
        with self.connection() as conn:
            conn.execute(
                "INSERT INTO media(business_id, filename) VALUES (?, ?)",
                (biz_id, filename),
            )
            conn.commit()
