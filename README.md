# BizIntelTZ – Tanzania Business Intelligence Engine

## Description
BizIntelTZ is a FastAPI-based platform that aggregates Tanzanian business data.
The application now persists data in a local SQLite database which is
automatically created on first run. In-memory stores are still used for quick
access during development.

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
- SQLite persistence
- Website crawling endpoint
- Basic OAuth2 authentication
- Create, update & delete businesses

Key endpoints include:
- `POST /business` to create businesses
- `POST /scrape` to generate sample data
- `POST /crawl` to crawl external websites
- `GET /export` to download a CSV of all businesses
- `GET /reviews/{biz_id}` to list reviews
- `POST /claims/approve/{index}` for claim moderation

## Usage
Install dependencies and run the application:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### Running the crawler
To populate the database from an external site use the `/crawl` endpoint or run
the helper script:

```bash
python crawler.py https://example.com
```

## Running 24/7
For production deployments, run Uvicorn without `--reload` and use a process
manager such as `systemd`, `supervisor`, or `docker` to keep the server running
continuously:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Deploying on a DigitalOcean Droplet

To run BizIntelTZ on a fresh Ubuntu Droplet:

1. Install system packages:
   ```bash
   sudo apt update && sudo apt install -y python3-pip nodejs npm
   ```
2. Clone this repository to the Droplet.
3. Install dependencies and build the frontend:
   ```bash
   pip3 install -r requirements.txt
   npm install
   npm run build
   ```
4. Start the API server:
   ```bash
   python3 main.py
   ```
5. Serve the generated `dist/` directory using a web server such as Nginx.

For reliability you can use `pm2` or `systemd` to keep the server running.
