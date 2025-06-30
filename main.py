from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
import csv
import io
import random
import datetime

app = FastAPI(title="BizIntelTZ")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory data stores for the demo
businesses = {}
reviews = {}
claims = []
media_store = {}
analytics = []
leads = []

class Business(BaseModel):
    id: str
    name: str
    bi_id: str  # Business Intelligence ID for verification
    region: Optional[str] = None
    sector: Optional[str] = None
    digital_score: Optional[int] = None
    formality: Optional[str] = None
    premium: bool = False
    verified: bool = False  # Whether the business is verified through claims
    claimed: bool = False   # Whether the business has been claimed

class BusinessCreate(BaseModel):
    name: str
    region: Optional[str] = None
    sector: Optional[str] = None
    digital_score: Optional[int] = None
    formality: Optional[str] = None
    premium: bool = False

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    sector: Optional[str] = None
    digital_score: Optional[int] = None
    formality: Optional[str] = None
    premium: Optional[bool] = None

class Review(BaseModel):
    business_id: str
    rating: int
    comment: Optional[str] = None

class Claim(BaseModel):
    business_id: str
    owner_name: str
    contact: str
    approved: bool = False

class AnalyticsEvent(BaseModel):
    business_id: str
    action: str  # view or click

class Lead(BaseModel):
    business_id: str
    name: str
    message: str

class BIVerificationRequest(BaseModel):
    bi_id: str
    requester_name: str
    requester_contact: str
    purpose: str

# Authentication stubs
fake_users_db = {
    "admin": {
        "username": "admin",
        "password": "admin",
    }
}

def authenticate_user(username: str, password: str):
    print(f"Authenticating user: {username} with password: {password}")  # Debug log
    user = fake_users_db.get(username)
    if user and user["password"] == password:
        print(f"Authentication successful for user: {username}")  # Debug log
        return user
    print(f"Authentication failed for user: {username}")  # Debug log
    return None

def generate_bi_id():
    """Generate a unique Business Intelligence ID"""
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    random_suffix = f"{random.randint(1000, 9999)}"
    return f"BIZ-TZ-{date_str}-{random_suffix}"

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Login attempt - Username: {form_data.username}")  # Debug log
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        print("Login failed - Invalid credentials")  # Debug log
        raise HTTPException(status_code=400, detail="Invalid credentials")
    print("Login successful")  # Debug log
    return {"access_token": user["username"], "token_type": "bearer"}

# Business Endpoints
@app.get("/search", response_model=List[Business])
async def search(q: Optional[str] = None, region: Optional[str] = None,
                 sector: Optional[str] = None, min_score: Optional[int] = None,
                 premium: Optional[bool] = None, bi_id: Optional[str] = None,
                 verified: Optional[bool] = None):
    results = []
    for biz in businesses.values():
        if q and q.lower() not in biz.name.lower():
            continue
        if region and biz.region != region:
            continue
        if sector and biz.sector != sector:
            continue
        if min_score and (biz.digital_score or 0) < min_score:
            continue
        if premium is not None and biz.premium != premium:
            continue
        if bi_id and biz.bi_id != bi_id:
            continue
        if verified is not None and biz.verified != verified:
            continue
        results.append(biz)
    # sort premium first, then verified
    results.sort(key=lambda b: (b.premium, b.verified), reverse=True)
    return results

@app.get("/verify-bi/{bi_id}")
async def verify_bi_id(bi_id: str):
    """Verify a Business Intelligence ID and return business information"""
    for biz in businesses.values():
        if biz.bi_id == bi_id:
            return {
                "valid": True,
                "business": biz,
                "verification_date": datetime.datetime.now().isoformat(),
                "status": "verified" if biz.verified else "registered"
            }
    return {
        "valid": False,
        "message": "BI ID not found",
        "verification_date": datetime.datetime.now().isoformat()
    }

@app.post("/request-verification")
async def request_bi_verification(request: BIVerificationRequest):
    """Request verification details for a BI ID (for banks/institutions)"""
    for biz in businesses.values():
        if biz.bi_id == request.bi_id:
            # In a real system, this would log the request and potentially notify the business
            return {
                "status": "verification_request_logged",
                "bi_id": request.bi_id,
                "business_name": biz.name,
                "verified": biz.verified,
                "claimed": biz.claimed,
                "request_id": str(uuid4()),
                "timestamp": datetime.datetime.now().isoformat()
            }
    raise HTTPException(status_code=404, detail="BI ID not found")

@app.post("/business", response_model=Business)
async def create_business(biz: BusinessCreate):
    biz_id = str(uuid4())
    bi_id = generate_bi_id()
    # Ensure BI ID is unique
    while any(b.bi_id == bi_id for b in businesses.values()):
        bi_id = generate_bi_id()
    
    new_biz = Business(
        id=biz_id, 
        bi_id=bi_id,
        verified=False,
        claimed=False,
        **biz.dict()
    )
    businesses[biz_id] = new_biz
    return new_biz

@app.put("/business/{biz_id}", response_model=Business)
async def update_business(biz_id: str, biz: BusinessUpdate):
    existing = businesses.get(biz_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Business not found")
    update_data = biz.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(existing, k, v)
    businesses[biz_id] = existing
    return existing

@app.delete("/business/{biz_id}")
async def delete_business(biz_id: str):
    if biz_id in businesses:
        del businesses[biz_id]
        return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Business not found")

@app.post("/scrape")
async def scrape(source: str = Form(...), region: Optional[str] = Form(None)):
    # Simulated scraping that generates a few fake businesses
    generated = []
    for _ in range(3):
        biz_id = str(uuid4())
        bi_id = generate_bi_id()
        # Ensure BI ID is unique
        while any(b.bi_id == bi_id for b in businesses.values()):
            bi_id = generate_bi_id()
            
        name = f"{source.title()} Biz {random.randint(1, 1000)}"
        new_biz = Business(
            id=biz_id, 
            name=name, 
            bi_id=bi_id,
            region=region,
            verified=False,
            claimed=False
        )
        businesses[biz_id] = new_biz
        generated.append(new_biz)
    return {"status": "Scraped", "added": len(generated)}

@app.get("/export")
async def export_data():
    csv_file = io.StringIO()
    writer = csv.writer(csv_file)
    writer.writerow(["id", "name", "bi_id", "region", "sector", "digital_score", "formality", "premium", "verified", "claimed"])
    for biz in businesses.values():
        writer.writerow([
            biz.id,
            biz.name,
            biz.bi_id,
            biz.region or "",
            biz.sector or "",
            biz.digital_score or "",
            biz.formality or "",
            biz.premium,
            biz.verified,
            biz.claimed,
        ])
    csv_file.seek(0)
    headers = {"Content-Disposition": "attachment; filename=businesses.csv"}
    return StreamingResponse(csv_file, media_type="text/csv", headers=headers)

@app.get("/profile/{biz_id}", response_model=Business)
async def get_profile(biz_id: str):
    biz = businesses.get(biz_id)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    return biz

@app.post("/review")
async def post_review(review: Review):
    reviews.setdefault(review.business_id, []).append(review)
    return {"status": "Review added"}

@app.get("/reviews/{biz_id}", response_model=List[Review])
async def list_reviews(biz_id: str):
    return reviews.get(biz_id, [])

@app.post("/admin/feature")
async def feature_business(biz_id: str, token: str = Depends(oauth2_scheme)):
    biz = businesses.get(biz_id)
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")
    biz.premium = True
    businesses[biz_id] = biz
    return {"status": "Business featured"}

@app.post("/claim")
async def claim_business(claim: Claim):
    claims.append(claim)
    # Mark business as claimed but not verified until approved
    biz = businesses.get(claim.business_id)
    if biz:
        biz.claimed = True
        businesses[claim.business_id] = biz
    return {"status": "Claim submitted"}

@app.get("/claims", response_model=List[Claim])
async def list_claims(token: str = Depends(oauth2_scheme)):
    return claims

@app.post("/claims/approve/{index}")
async def approve_claim(index: int, token: str = Depends(oauth2_scheme)):
    if index < 0 or index >= len(claims):
        raise HTTPException(status_code=404, detail="Claim not found")
    
    claim = claims[index]
    claim.approved = True
    
    # Mark business as verified when claim is approved
    biz = businesses.get(claim.business_id)
    if biz:
        biz.verified = True
        biz.claimed = True
        businesses[claim.business_id] = biz
    
    return {"status": "approved"}

@app.post("/track")
async def track(event: AnalyticsEvent):
    analytics.append(event)
    return {"status": "Event logged"}

@app.get("/analytics")
async def get_analytics():
    views = sum(1 for e in analytics if e.action == "view")
    clicks = sum(1 for e in analytics if e.action == "click")
    return {"views": views, "clicks": clicks}

@app.post("/upload-media")
async def upload_media(biz_id: str = Form(...), file: UploadFile = File(...)):
    media_store.setdefault(biz_id, []).append(file.filename)
    return {"status": "File uploaded", "filename": file.filename}

@app.post("/lead")
async def create_lead(lead: Lead):
    leads.append(lead)
    return {"status": "Lead stored"}

@app.get("/leads", response_model=List[Lead])
async def list_leads(token: str = Depends(oauth2_scheme)):
    return leads

@app.get("/media/{biz_id}")
async def list_media(biz_id: str):
    return media_store.get(biz_id, [])

@app.get("/admin")
async def admin_dashboard(token: str = Depends(oauth2_scheme)):
    pending = len([c for c in claims if not c.approved])
    verified_businesses = len([b for b in businesses.values() if b.verified])
    return {
        "status": "Admin dashboard",
        "total_claims": len(claims),
        "pending_claims": pending,
        "leads": len(leads),
        "verified_businesses": verified_businesses,
        "total_businesses": len(businesses)
    }

# Mock endpoints for rankings and leaderboard data
@app.get("/rankings/leaderboard")
async def get_leaderboard(region: Optional[str] = None, sector: Optional[str] = None):
    # Generate mock leaderboard data
    business_list = list(businesses.values())
    if not business_list:
        business_list = [
            Business(
                id="sample-1",
                name="Sample Restaurant",
                bi_id="BIZ-TZ-20241201-1001",
                region="Dar es Salaam",
                sector="Services",
                digital_score=85,
                premium=True,
                verified=True,
                claimed=True
            ),
            Business(
                id="sample-2", 
                name="Tech Solutions Ltd",
                bi_id="BIZ-TZ-20241201-1002",
                region="Arusha",
                sector="Technology",
                digital_score=78,
                premium=False,
                verified=False,
                claimed=True
            )
        ]
    
    # Mock ranking data
    ranked_businesses = []
    for i, biz in enumerate(business_list[:10]):
        ranked_businesses.append({
            "id": biz.id,
            "name": biz.name,
            "bi_id": biz.bi_id,
            "region": biz.region or "Unknown",
            "sector": biz.sector or "General",
            "digital_score": biz.digital_score or random.randint(40, 95),
            "rank": i + 1,
            "previous_rank": max(1, i + random.randint(-2, 3)),
            "rank_change": random.randint(-5, 5),
            "views_count": random.randint(100, 5000),
            "reviews_count": random.randint(5, 50),
            "average_rating": round(random.uniform(3.5, 5.0), 1),
            "badges": [],
            "buzz_score": random.randint(60, 95),
            "market_share_percentage": round(random.uniform(2, 15), 1),
            "sentiment_score": random.randint(70, 95),
            "growth_rate": round(random.uniform(-5, 25), 1),
            "premium": biz.premium,
            "verified": biz.verified,
            "claimed": biz.claimed
        })
    
    return {
        "overall_leaders": ranked_businesses,
        "regional_leaders": [],
        "sector_leaders": [],
        "trending_businesses": ranked_businesses[:3],
        "fastest_growing": ranked_businesses[:3],
        "most_viewed": ranked_businesses[:3],
        "top_rated": ranked_businesses[:3],
        "recent_badge_winners": [
            {
                "business_id": "sample-1",
                "business_name": "Sample Restaurant",
                "badge": {
                    "id": "top-rated",
                    "name": "Top Rated",
                    "icon": "star",
                    "color": "#f59e0b",
                    "description": "Highest customer satisfaction",
                    "earned_date": datetime.datetime.now().isoformat(),
                    "category": "quality"
                },
                "earned_date": datetime.datetime.now().isoformat(),
                "region": "Dar es Salaam",
                "sector": "Services"
            }
        ]
    }

# Seed with sample business
if not businesses:
    biz_id = str(uuid4())
    bi_id = generate_bi_id()
    businesses[biz_id] = Business(
        id=biz_id, 
        name="Sample Business",
        bi_id=bi_id,
        region="Dar es Salaam",
        sector="Services",
        digital_score=75,
        formality="Formal",
        premium=True,
        verified=True,
        claimed=True
    )