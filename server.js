const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data stores
let businesses = {};
let reviews = {};
let claims = [];
let analytics = { views: 1250, clicks: 892 };
let leads = [];

// Fake users database
const fake_users_db = {
  "admin": {
    "username": "admin",
    "password": "admin"
  }
};

// Helper function to generate BI ID
function generateBIID() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `BIZ-TZ-${date}-${random}`;
}

// Authentication endpoint - Fixed to handle both JSON and form data
app.post('/token', (req, res) => {
  console.log('Login attempt:', req.body);
  let username, password;
  
  // Handle both form-urlencoded and JSON
  if (req.body.username && req.body.password) {
    username = req.body.username;
    password = req.body.password;
  } else if (req.body.get) {
    // Handle URLSearchParams
    username = req.body.get('username');
    password = req.body.get('password');
  }
  
  const user = fake_users_db[username];
  if (user && user.password === password) {
    console.log('Login successful for user:', username);
    res.json({
      access_token: username,
      token_type: "bearer"
    });
  } else {
    console.log('Login failed for user:', username);
    res.status(400).json({ detail: "Invalid credentials" });
  }
});

// Business endpoints
app.get('/search', (req, res) => {
  const { q, region, sector, min_score, premium, bi_id, verified } = req.query;
  
  let results = Object.values(businesses);
  
  // Apply filters
  if (q) {
    results = results.filter(biz => 
      biz.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  
  if (region) {
    results = results.filter(biz => biz.region === region);
  }
  
  if (sector) {
    results = results.filter(biz => biz.sector === sector);
  }
  
  if (min_score) {
    results = results.filter(biz => (biz.digital_score || 0) >= parseInt(min_score));
  }
  
  if (premium === 'true') {
    results = results.filter(biz => biz.premium === true);
  }
  
  if (bi_id) {
    results = results.filter(biz => biz.bi_id === bi_id);
  }
  
  if (verified === 'true') {
    results = results.filter(biz => biz.verified === true);
  }
  
  // Sort premium first, then verified
  results.sort((a, b) => {
    if (a.premium !== b.premium) return b.premium - a.premium;
    if (a.verified !== b.verified) return b.verified - a.verified;
    return 0;
  });
  
  res.json(results);
});

app.post('/business', (req, res) => {
  const bizId = uuidv4();
  const biId = generateBIID();
  
  const newBiz = {
    id: bizId,
    bi_id: biId,
    verified: false,
    claimed: false,
    ...req.body
  };
  
  businesses[bizId] = newBiz;
  res.json(newBiz);
});

app.get('/profile/:id', (req, res) => {
  const business = businesses[req.params.id];
  if (!business) {
    return res.status(404).json({ detail: "Business not found" });
  }
  res.json(business);
});

app.put('/business/:id', (req, res) => {
  const existing = businesses[req.params.id];
  if (!existing) {
    return res.status(404).json({ detail: "Business not found" });
  }
  
  const updatedBiz = { ...existing, ...req.body };
  businesses[req.params.id] = updatedBiz;
  res.json(updatedBiz);
});

app.delete('/business/:id', (req, res) => {
  if (businesses[req.params.id]) {
    delete businesses[req.params.id];
    res.json({ status: "deleted" });
  } else {
    res.status(404).json({ detail: "Business not found" });
  }
});

// BI ID Verification
app.get('/verify-bi/:bi_id', (req, res) => {
  const biId = req.params.bi_id;
  
  for (const biz of Object.values(businesses)) {
    if (biz.bi_id === biId) {
      return res.json({
        valid: true,
        business: biz,
        verification_date: new Date().toISOString(),
        status: biz.verified ? "verified" : "registered"
      });
    }
  }
  
  res.json({
    valid: false,
    message: "BI ID not found",
    verification_date: new Date().toISOString()
  });
});

app.post('/request-verification', (req, res) => {
  const { bi_id } = req.body;
  
  for (const biz of Object.values(businesses)) {
    if (biz.bi_id === bi_id) {
      return res.json({
        status: "verification_request_logged",
        bi_id: bi_id,
        business_name: biz.name,
        verified: biz.verified,
        claimed: biz.claimed,
        request_id: uuidv4(),
        timestamp: new Date().toISOString()
      });
    }
  }
  
  res.status(404).json({ detail: "BI ID not found" });
});

// Reviews
app.post('/review', (req, res) => {
  if (!reviews[req.body.business_id]) {
    reviews[req.body.business_id] = [];
  }
  reviews[req.body.business_id].push(req.body);
  res.json({ status: "Review added" });
});

app.get('/reviews/:biz_id', (req, res) => {
  res.json(reviews[req.params.biz_id] || []);
});

// Claims
app.post('/claim', (req, res) => {
  claims.push(req.body);
  
  // Mark business as claimed
  const biz = businesses[req.body.business_id];
  if (biz) {
    biz.claimed = true;
    businesses[req.body.business_id] = biz;
  }
  
  res.json({ status: "Claim submitted" });
});

app.get('/claims', (req, res) => {
  res.json(claims);
});

app.post('/claims/approve/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= claims.length) {
    return res.status(404).json({ detail: "Claim not found" });
  }
  
  const claim = claims[index];
  claim.approved = true;
  
  // Mark business as verified when claim is approved
  const biz = businesses[claim.business_id];
  if (biz) {
    biz.verified = true;
    biz.claimed = true;
    businesses[claim.business_id] = biz;
  }
  
  res.json({ status: "approved" });
});

// Analytics
app.post('/track', (req, res) => {
  const { action } = req.body;
  if (action === 'view') {
    analytics.views++;
  } else if (action === 'click') {
    analytics.clicks++;
  }
  res.json({ status: "Event logged" });
});

app.get('/analytics', (req, res) => {
  res.json(analytics);
});

// Leads
app.post('/lead', (req, res) => {
  leads.push(req.body);
  res.json({ status: "Lead stored" });
});

app.get('/leads', (req, res) => {
  res.json(leads);
});

// Media uploads (mock)
app.post('/upload-media', (req, res) => {
  res.json({ status: "File uploaded", filename: "mock-file.jpg" });
});

app.get('/media/:biz_id', (req, res) => {
  res.json(["sample-image.jpg", "business-logo.png"]);
});

// Scraping (mock)
app.post('/scrape', (req, res) => {
  const { source, region } = req.body;
  
  // Generate mock businesses
  for (let i = 0; i < 3; i++) {
    const bizId = uuidv4();
    const biId = generateBIID();
    const name = `${source} Business ${Math.floor(Math.random() * 1000)}`;
    
    const newBiz = {
      id: bizId,
      name: name,
      bi_id: biId,
      region: region || "Dar es Salaam",
      sector: "Services",
      digital_score: Math.floor(Math.random() * 50) + 50,
      verified: false,
      claimed: false,
      premium: false
    };
    
    businesses[bizId] = newBiz;
  }
  
  res.json({ status: "Scraped", added: 3 });
});

// Export (mock)
app.get('/export', (req, res) => {
  const csvContent = "id,name,bi_id,region,sector\n" + 
    Object.values(businesses).map(biz => 
      `${biz.id},${biz.name},${biz.bi_id},${biz.region || ''},${biz.sector || ''}`
    ).join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=businesses.csv');
  res.send(csvContent);
});

// Admin endpoints
app.get('/admin', (req, res) => {
  const pendingClaims = claims.filter(c => !c.approved).length;
  const verifiedBusinesses = Object.values(businesses).filter(b => b.verified).length;
  
  res.json({
    status: "Admin dashboard",
    total_claims: claims.length,
    pending_claims: pendingClaims,
    leads: leads.length,
    verified_businesses: verifiedBusinesses,
    total_businesses: Object.keys(businesses).length
  });
});

// Rankings/Leaderboard endpoint with rich mock data
app.get('/rankings/leaderboard', (req, res) => {
  let businessList = Object.values(businesses);
  
  if (businessList.length === 0) {
    // Create comprehensive sample businesses for demo
    const sampleBusinesses = [
      {
        id: "sample-1",
        name: "TechHub Dar es Salaam",
        bi_id: generateBIID(),
        region: "Dar es Salaam",
        sector: "Technology",
        digital_score: 92,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "sample-2",
        name: "Kilimanjaro Coffee Co",
        bi_id: generateBIID(),
        region: "Arusha",
        sector: "Agriculture",
        digital_score: 88,
        premium: true,
        verified: true,
        claimed: true
      },
      {
        id: "sample-3",
        name: "Zanzibar Tours & Travel",
        bi_id: generateBIID(),
        region: "Zanzibar",
        sector: "Tourism",
        digital_score: 85,
        premium: false,
        verified: true,
        claimed: true
      },
      {
        id: "sample-4",
        name: "Serengeti Safari Lodge",
        bi_id: generateBIID(),
        region: "Arusha",
        sector: "Tourism",
        digital_score: 82,
        premium: true,
        verified: false,
        claimed: true
      },
      {
        id: "sample-5",
        name: "Mwanza Fish Market",
        bi_id: generateBIID(),
        region: "Mwanza",
        sector: "Trade",
        digital_score: 78,
        premium: false,
        verified: true,
        claimed: false
      }
    ];
    
    sampleBusinesses.forEach(biz => {
      businesses[biz.id] = biz;
    });
    businessList = sampleBusinesses;
  }
  
  // Mock ranking data with comprehensive details
  const rankedBusinesses = businessList.slice(0, 10).map((biz, i) => ({
    id: biz.id,
    name: biz.name,
    bi_id: biz.bi_id,
    region: biz.region || "Unknown",
    sector: biz.sector || "General",
    digital_score: biz.digital_score || Math.floor(Math.random() * 40) + 60,
    rank: i + 1,
    previous_rank: Math.max(1, i + Math.floor(Math.random() * 3) - 1),
    rank_change: Math.floor(Math.random() * 11) - 5,
    views_count: Math.floor(Math.random() * 5000) + 100,
    reviews_count: Math.floor(Math.random() * 50) + 5,
    average_rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    badges: [],
    buzz_score: Math.floor(Math.random() * 35) + 65,
    market_share_percentage: parseFloat((Math.random() * 13 + 2).toFixed(1)),
    sentiment_score: Math.floor(Math.random() * 25) + 75,
    growth_rate: parseFloat((Math.random() * 30 - 5).toFixed(1)),
    premium: biz.premium || false,
    verified: biz.verified || false,
    claimed: biz.claimed || false
  }));
  
  res.json({
    overall_leaders: rankedBusinesses,
    regional_leaders: [],
    sector_leaders: [],
    trending_businesses: rankedBusinesses.slice(0, 3),
    fastest_growing: rankedBusinesses.slice(0, 3),
    most_viewed: rankedBusinesses.slice(0, 3),
    top_rated: rankedBusinesses.slice(0, 3),
    recent_badge_winners: [
      {
        business_id: "sample-1",
        business_name: "TechHub Dar es Salaam",
        badge: {
          id: "innovation-leader",
          name: "Innovation Leader",
          icon: "star",
          color: "#f59e0b",
          description: "Leading innovation in technology sector",
          earned_date: new Date().toISOString(),
          category: "achievement"
        },
        earned_date: new Date().toISOString(),
        region: "Dar es Salaam",
        sector: "Technology"
      },
      {
        business_id: "sample-2",
        business_name: "Kilimanjaro Coffee Co",
        badge: {
          id: "quality-excellence",
          name: "Quality Excellence",
          icon: "award",
          color: "#10b981",
          description: "Exceptional product quality standards",
          earned_date: new Date().toISOString(),
          category: "quality"
        },
        earned_date: new Date().toISOString(),
        region: "Arusha",
        sector: "Agriculture"
      }
    ]
  });
});

// Featured business endpoint for premium listings
app.post('/admin/feature', (req, res) => {
  const { biz_id } = req.query;
  const biz = businesses[biz_id];
  if (!biz) {
    return res.status(404).json({ detail: "Business not found" });
  }
  biz.premium = true;
  businesses[biz_id] = biz;
  res.json({ status: "Business featured" });
});

// Seed with sample business if none exist
if (Object.keys(businesses).length === 0) {
  const sampleId = uuidv4();
  const sampleBIID = generateBIID();
  
  businesses[sampleId] = {
    id: sampleId,
    name: "Sample Restaurant & Cafe",
    bi_id: sampleBIID,
    region: "Dar es Salaam",
    sector: "Services",
    digital_score: 75,
    formality: "Formal",
    premium: true,
    verified: true,
    claimed: true
  };
}

app.listen(PORT, () => {
  console.log(`🚀 BizIntelTZ API Server running on http://localhost:${PORT}`);
  console.log(`📊 Sample business available with BI ID: ${Object.values(businesses)[0]?.bi_id}`);
  console.log(`🔐 Login credentials: admin / admin`);
});