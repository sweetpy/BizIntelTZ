import csv
from pathlib import Path
from types import SimpleNamespace
from uuid import uuid4
import datetime
from database import Database

UPLOAD_DIR = Path("uploaded_docs")
UPLOAD_DIR.mkdir(exist_ok=True)

def process_documents(db: Database, upload_dir: Path = UPLOAD_DIR) -> dict:
    """Process uploaded documents and extract businesses from CSV files."""
    docs = db.get_unprocessed_documents()
    total_added = 0
    processed = 0
    for doc in docs:
        file_path = upload_dir / doc["filename"]
        if not file_path.exists():
            db.mark_document_processed(doc["id"])
            processed += 1
            continue
        added = 0
        if file_path.suffix.lower() == ".csv":
            with file_path.open("r", newline="") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if not row.get("name"):
                        continue
                    biz = SimpleNamespace(
                        id=str(uuid4()),
                        name=row["name"],
                        bi_id=db.generate_bi_id(),
                        region=row.get("region"),
                        sector=row.get("sector"),
                        digital_score=None,
                        formality=None,
                        premium=False,
                        verified=False,
                        claimed=False,
                    )
                    db.add_business(biz)
                    added += 1
        # Mark as processed regardless of type
        db.mark_document_processed(doc["id"])
        processed += 1
        total_added += added
    return {"processed": processed, "businesses_added": total_added}

if __name__ == "__main__":
    db = Database()
    summary = process_documents(db)
    print(summary)

