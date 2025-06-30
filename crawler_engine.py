import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Set
from dataclasses import dataclass
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import json
import time
import random
from concurrent.futures import ThreadPoolExecutor
import sqlite3
from contextlib import asynccontextmanager
import threading

from database import Database


@dataclass
class CrawlTarget:
    """Configuration for a crawl target"""
    name: str
    start_urls: List[str]
    allowed_domains: List[str]
    max_depth: int = 3
    max_pages: int = 100
    delay_range: tuple = (1, 3)  # Random delay between requests
    business_selectors: List[str] = None
    active: bool = True
    last_crawl: Optional[datetime] = None
    next_crawl: Optional[datetime] = None
    crawl_interval_hours: int = 24


@dataclass
class CrawlResult:
    """Result of a crawl operation"""
    target_name: str
    start_time: datetime
    end_time: datetime
    pages_crawled: int
    businesses_found: int
    errors: List[str]
    success: bool


class EnhancedCrawler:
    """Enhanced web crawler with multiple extraction strategies"""
    
    def __init__(self, database: Database):
        self.db = database
        self.session = None
        self.logger = logging.getLogger(__name__)
        self.running = False
        self.stats = {
            'total_crawls': 0,
            'total_businesses': 0,
            'total_pages': 0,
            'last_crawl': None,
            'errors': []
        }
        
        # Default business extraction selectors
        self.default_selectors = [
            "[data-biz-name]",
            ".business-name",
            ".company-name", 
            ".business-title",
            "h1.business",
            "h2.business",
            ".listing-title",
            ".business-listing h3",
            ".directory-entry .name"
        ]
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={
                'User-Agent': 'BizIntelTZ-Crawler/1.0 (+https://bizinteltz.com/crawler)'
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def generate_bi_id(self) -> str:
        """Generate unique Business Intelligence ID"""
        date_str = datetime.now().strftime("%Y%m%d")
        random_suffix = f"{random.randint(1000, 9999)}"
        return f"BIZ-TZ-{date_str}-{random_suffix}"
    
    async def extract_businesses_from_page(self, url: str, html: str, selectors: List[str]) -> List[Dict]:
        """Extract business information from a web page"""
        businesses = []
        
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            for selector in selectors:
                elements = soup.select(selector)
                
                for element in elements:
                    # Try different methods to extract business name
                    name = (
                        element.get('data-biz-name') or
                        element.get_text(strip=True) or
                        element.get('title') or
                        element.get('alt')
                    )
                    
                    if name and len(name.strip()) > 2:
                        # Extract additional information if available
                        business_data = {
                            'name': name.strip(),
                            'source_url': url,
                            'extraction_method': selector
                        }
                        
                        # Try to find region/location
                        location_element = element.find_parent().find(class_=['location', 'address', 'region'])
                        if location_element:
                            business_data['region'] = location_element.get_text(strip=True)
                        
                        # Try to find sector/category
                        category_element = element.find_parent().find(class_=['category', 'sector', 'type'])
                        if category_element:
                            business_data['sector'] = category_element.get_text(strip=True)
                        
                        # Try to find contact information
                        contact_element = element.find_parent().find(class_=['phone', 'email', 'contact'])
                        if contact_element:
                            business_data['contact'] = contact_element.get_text(strip=True)
                        
                        businesses.append(business_data)
            
            # Also try structured data extraction (JSON-LD, microdata)
            structured_businesses = await self.extract_structured_data(soup)
            businesses.extend(structured_businesses)
            
        except Exception as e:
            self.logger.error(f"Error extracting businesses from {url}: {str(e)}")
        
        return businesses
    
    async def extract_structured_data(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract business data from structured data (JSON-LD, microdata)"""
        businesses = []
        
        try:
            # JSON-LD extraction
            json_scripts = soup.find_all('script', type='application/ld+json')
            for script in json_scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, dict):
                        if data.get('@type') in ['LocalBusiness', 'Organization', 'Corporation']:
                            business = {
                                'name': data.get('name', ''),
                                'region': data.get('address', {}).get('addressLocality', ''),
                                'sector': data.get('description', ''),
                                'extraction_method': 'json-ld'
                            }
                            if business['name']:
                                businesses.append(business)
                except json.JSONDecodeError:
                    continue
            
            # Microdata extraction
            microdata_items = soup.find_all(attrs={'itemtype': True})
            for item in microdata_items:
                itemtype = item.get('itemtype', '')
                if 'LocalBusiness' in itemtype or 'Organization' in itemtype:
                    name_elem = item.find(attrs={'itemprop': 'name'})
                    if name_elem:
                        business = {
                            'name': name_elem.get_text(strip=True),
                            'extraction_method': 'microdata'
                        }
                        
                        address_elem = item.find(attrs={'itemprop': 'address'})
                        if address_elem:
                            business['region'] = address_elem.get_text(strip=True)
                        
                        businesses.append(business)
        
        except Exception as e:
            self.logger.error(f"Error extracting structured data: {str(e)}")
        
        return businesses
    
    async def crawl_page(self, url: str) -> tuple[str, List[str]]:
        """Crawl a single page and return content and links"""
        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    html = await response.text()
                    
                    # Extract links for further crawling
                    soup = BeautifulSoup(html, 'html.parser')
                    links = []
                    for link in soup.find_all('a', href=True):
                        absolute_url = urljoin(url, link['href'])
                        links.append(absolute_url)
                    
                    return html, links
                else:
                    self.logger.warning(f"HTTP {response.status} for {url}")
                    return "", []
        
        except Exception as e:
            self.logger.error(f"Error crawling {url}: {str(e)}")
            return "", []
    
    async def crawl_target(self, target: CrawlTarget) -> CrawlResult:
        """Crawl a specific target configuration"""
        start_time = datetime.now()
        visited_urls = set()
        pages_crawled = 0
        businesses_found = 0
        errors = []
        
        self.logger.info(f"Starting crawl for target: {target.name}")
        
        try:
            # BFS crawling
            url_queue = target.start_urls.copy()
            depth_map = {url: 0 for url in target.start_urls}
            
            while url_queue and pages_crawled < target.max_pages:
                url = url_queue.pop(0)
                current_depth = depth_map.get(url, 0)
                
                if url in visited_urls or current_depth > target.max_depth:
                    continue
                
                # Check if URL is allowed
                parsed_url = urlparse(url)
                if not any(domain in parsed_url.netloc for domain in target.allowed_domains):
                    continue
                
                visited_urls.add(url)
                
                # Add random delay to be polite
                delay = random.uniform(*target.delay_range)
                await asyncio.sleep(delay)
                
                # Crawl the page
                html, links = await self.crawl_page(url)
                if html:
                    pages_crawled += 1
                    
                    # Extract businesses
                    selectors = target.business_selectors or self.default_selectors
                    businesses = await self.extract_businesses_from_page(url, html, selectors)
                    
                    # Store businesses in database
                    for business_data in businesses:
                        try:
                            business = type('Business', (), {
                                'id': str(random.randint(100000, 999999)),
                                'name': business_data['name'],
                                'bi_id': self.generate_bi_id(),
                                'region': business_data.get('region'),
                                'sector': business_data.get('sector'),
                                'digital_score': random.randint(40, 85),
                                'formality': random.choice(['Formal', 'Informal', 'Semi-formal']),
                                'premium': False,
                                'verified': False,
                                'claimed': False,
                            })
                            
                            self.db.add_business(business)
                            businesses_found += 1
                            
                        except Exception as e:
                            error_msg = f"Error storing business {business_data['name']}: {str(e)}"
                            errors.append(error_msg)
                            self.logger.error(error_msg)
                    
                    # Add new links to queue for next depth level
                    if current_depth < target.max_depth:
                        for link in links:
                            if link not in visited_urls:
                                depth_map[link] = current_depth + 1
                                url_queue.append(link)
                
                # Progress logging
                if pages_crawled % 10 == 0:
                    self.logger.info(f"Crawled {pages_crawled} pages, found {businesses_found} businesses")
        
        except Exception as e:
            error_msg = f"Critical error during crawl: {str(e)}"
            errors.append(error_msg)
            self.logger.error(error_msg)
        
        end_time = datetime.now()
        
        result = CrawlResult(
            target_name=target.name,
            start_time=start_time,
            end_time=end_time,
            pages_crawled=pages_crawled,
            businesses_found=businesses_found,
            errors=errors,
            success=len(errors) == 0
        )
        
        # Update statistics
        self.stats['total_crawls'] += 1
        self.stats['total_businesses'] += businesses_found
        self.stats['total_pages'] += pages_crawled
        self.stats['last_crawl'] = end_time
        if errors:
            self.stats['errors'].extend(errors[-5:])  # Keep last 5 errors
        
        self.logger.info(f"Crawl completed: {businesses_found} businesses from {pages_crawled} pages")
        
        return result


class CrawlerScheduler:
    """Scheduler for managing crawler runs"""
    
    def __init__(self, database: Database):
        self.db = database
        self.crawler = None
        self.targets: List[CrawlTarget] = []
        self.running = False
        self.scheduler_thread = None
        self.logger = logging.getLogger(__name__)
        
        # Load default targets
        self.load_default_targets()
    
    def load_default_targets(self):
        """Load default crawl targets"""
        self.targets = [
            CrawlTarget(
                name="Tanzania Business Directory",
                start_urls=[
                    "https://www.yellow.co.tz/",
                    "https://businesslist.co.tz/"
                ],
                allowed_domains=["yellow.co.tz", "businesslist.co.tz"],
                max_depth=3,
                max_pages=50,
                business_selectors=[
                    ".business-name",
                    ".listing-title", 
                    "h3.business",
                    ".company-name"
                ],
                crawl_interval_hours=24
            ),
            CrawlTarget(
                name="Local Business Directories",
                start_urls=[
                    "https://www.hotfrog.co.tz/",
                    "https://www.cybo.com/TZ/"
                ],
                allowed_domains=["hotfrog.co.tz", "cybo.com"],
                max_depth=2,
                max_pages=30,
                crawl_interval_hours=48
            ),
            CrawlTarget(
                name="Government Business Registry",
                start_urls=[
                    "https://onrs.go.tz/",
                    "https://www.brela.go.tz/"
                ],
                allowed_domains=["onrs.go.tz", "brela.go.tz"],
                max_depth=2,
                max_pages=20,
                crawl_interval_hours=72
            )
        ]
    
    def add_target(self, target: CrawlTarget):
        """Add a new crawl target"""
        self.targets.append(target)
        self.logger.info(f"Added crawl target: {target.name}")
    
    def remove_target(self, target_name: str):
        """Remove a crawl target"""
        self.targets = [t for t in self.targets if t.name != target_name]
        self.logger.info(f"Removed crawl target: {target_name}")
    
    def get_targets(self) -> List[CrawlTarget]:
        """Get all crawl targets"""
        return self.targets.copy()
    
    def get_target(self, name: str) -> Optional[CrawlTarget]:
        """Get a specific target by name"""
        for target in self.targets:
            if target.name == name:
                return target
        return None
    
    async def run_single_crawl(self, target_name: str) -> CrawlResult:
        """Run a single crawl for a specific target"""
        target = self.get_target(target_name)
        if not target:
            raise ValueError(f"Target {target_name} not found")
        
        async with EnhancedCrawler(self.db) as crawler:
            result = await crawler.crawl_target(target)
            
            # Update target's last crawl time
            target.last_crawl = result.end_time
            target.next_crawl = result.end_time + timedelta(hours=target.crawl_interval_hours)
            
            return result
    
    def get_due_targets(self) -> List[CrawlTarget]:
        """Get targets that are due for crawling"""
        now = datetime.now()
        due_targets = []
        
        for target in self.targets:
            if not target.active:
                continue
            
            if target.next_crawl is None or now >= target.next_crawl:
                due_targets.append(target)
        
        return due_targets
    
    async def scheduler_loop(self):
        """Main scheduler loop"""
        self.logger.info("Crawler scheduler started")
        
        while self.running:
            try:
                due_targets = self.get_due_targets()
                
                if due_targets:
                    self.logger.info(f"Found {len(due_targets)} targets due for crawling")
                    
                    for target in due_targets:
                        if not self.running:
                            break
                        
                        try:
                            result = await self.run_single_crawl(target.name)
                            self.logger.info(
                                f"Completed crawl for {target.name}: "
                                f"{result.businesses_found} businesses from {result.pages_crawled} pages"
                            )
                        except Exception as e:
                            self.logger.error(f"Error crawling {target.name}: {str(e)}")
                
                # Sleep for 1 hour before checking again
                for _ in range(3600):  # 1 hour = 3600 seconds
                    if not self.running:
                        break
                    await asyncio.sleep(1)
                
            except Exception as e:
                self.logger.error(f"Error in scheduler loop: {str(e)}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    def start(self):
        """Start the scheduler"""
        if self.running:
            return
        
        self.running = True
        self.scheduler_thread = threading.Thread(
            target=lambda: asyncio.run(self.scheduler_loop()),
            daemon=True
        )
        self.scheduler_thread.start()
        self.logger.info("Crawler scheduler thread started")
    
    def stop(self):
        """Stop the scheduler"""
        self.running = False
        if self.scheduler_thread:
            self.scheduler_thread.join(timeout=5)
        self.logger.info("Crawler scheduler stopped")
    
    def get_status(self) -> Dict:
        """Get scheduler status"""
        due_targets = self.get_due_targets()
        
        return {
            'running': self.running,
            'total_targets': len(self.targets),
            'active_targets': len([t for t in self.targets if t.active]),
            'due_targets': len(due_targets),
            'due_target_names': [t.name for t in due_targets],
            'next_crawl_times': {
                t.name: t.next_crawl.isoformat() if t.next_crawl else None 
                for t in self.targets
            }
        }


# Global scheduler instance
crawler_scheduler = None

def get_crawler_scheduler() -> CrawlerScheduler:
    """Get or create the global crawler scheduler"""
    global crawler_scheduler
    if crawler_scheduler is None:
        db = Database()
        crawler_scheduler = CrawlerScheduler(db)
    return crawler_scheduler

def start_crawler_service():
    """Start the crawler service"""
    scheduler = get_crawler_scheduler()
    scheduler.start()
    return scheduler

def stop_crawler_service():
    """Stop the crawler service"""
    global crawler_scheduler
    if crawler_scheduler:
        crawler_scheduler.stop()

if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Start the scheduler
    scheduler = start_crawler_service()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(60)
            status = scheduler.get_status()
            print(f"Scheduler status: {status}")
    except KeyboardInterrupt:
        print("Stopping crawler service...")
        stop_crawler_service()