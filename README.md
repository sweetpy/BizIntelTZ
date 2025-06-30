# BizIntelTZ – Tanzania Business Intelligence Engine

## Description
BizIntelTZ is a FastAPI-based platform that aggregates Tanzanian business data.
This repository contains a minimal demo implementation with in-memory storage
for development and testing purposes.

## Features
- Advanced search & filtering
- Region-wide scraping trigger
- CSV data export
- Public business profiles
- Reviews & ratings
- Premium listings management
- Business claiming
- Analytics tracking
- Media uploads
- Lead generation
- Basic OAuth2 authentication
- Create, update & delete businesses

Key endpoints include:
- `POST /business` to create businesses
- `POST /scrape` to generate sample data
- `GET /export` to download a CSV of all businesses
- `GET /reviews/{biz_id}` to list reviews
- `POST /claims/approve/{index}` for claim moderation

## Usage
Install dependencies and run the application:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Running 24/7
For production deployments, run Uvicorn without `--reload` and use a process
manager such as `systemd`, `supervisor`, or `docker` to keep the server running
continuously:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## KYC in Tanzania

In Tanzania, **Know Your Customer (KYC)** forms are mandatory for **individuals** and **business entities** engaging with banks, telecoms, government agencies, and regulated service providers. The forms are standardized by the **Bank of Tanzania (BoT)** and **FIA (Financial Intelligence Unit)** in compliance with AML/CFT laws.

---

## ✅ **KYC Requirements for Individuals**

### 1. **Personal Details**

* Full name (as per ID)
* Date of birth
* Gender
* Nationality
* Marital status

### 2. **Identification**

* Valid National ID (NIDA) or Voter ID / Passport / Driving License
* NIDA number or ID number
* TIN (Taxpayer Identification Number) – if available

### 3. **Contact Information**

* Mobile number
* Email (optional but often requested)
* Residential address (with ward, street, plot number)

### 4. **Occupation & Income**

* Employer / Business name
* Position
* Monthly income bracket
* Source of income

### 5. **Proof of Address**

* Utility bill (water/electricity)
* Lease agreement
* Letter from local government (for informal sector)

### 6. **Photograph & Signature**

* Passport-size photo
* Signature (digital or physical)

---

## ✅ **KYC Requirements for Business Entities**

### 1. **Business Information**

* Registered business name
* TIN & VAT registration
* BRELA Certificate (Certificate of Incorporation / Business Name Registration)
* Business license
* Type of entity (Sole prop, Partnership, Company, NGO, etc.)
* Sector/Industry
* Physical address & postal address

### 2. **Contact Info**

* Company phone number
* Company email
* Website (if available)

### 3. **Shareholding & Management**

* List of directors / beneficial owners with:

  * Full names
  * National IDs
  * Nationality
  * % shareholding
* Board resolution (for banks or major accounts)

### 4. **Tax & Legal**

* Tax clearance certificate (for some banks)
* Memorandum and Articles of Association (for Ltd/Gte companies)
* Recent financial statements (sometimes)

### 5. **Account Purpose**

* Why the account is being opened
* Expected transaction volume and frequency

---

## 📎 Commonly Requested Attachments

| Document                     | Individual | Business          |
| ---------------------------- | ---------- | ----------------- |
| National ID/NIDA             | ✅          | ✅ (for directors) |
| Passport Photo               | ✅          | ✅ (directors)     |
| Utility Bill / Address Proof | ✅          | ✅                 |
| BRELA Registration           | ❌          | ✅                 |
| TIN Certificate              | Optional   | ✅                 |
| Business License             | ❌          | ✅                 |
| Resolution Letter            | ❌          | ✅ (if company)    |

---

## 🧾 Forms Example

Banks (e.g., CRDB, NMB, NBC), Mobile Money platforms (M-Pesa Biz, TigoPesa Wakala), and platforms like TRA, BRELA, and BoT all follow the same KYC principles.

Let me know if you want a ready-made **KYC form template (PDF or DOCX)** for individuals or businesses.

