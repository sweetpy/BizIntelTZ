from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from crawler_engine import get_crawler_scheduler, start_crawler_service, stop_crawler_service, CrawlTarget
from database import Database

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/crawler", tags=["crawler"])

# Initialize the crawler service on startup
@router.on_event("startup")
def startup_event():
    try:
        start_crawler_service()
        logger.info("Crawler service started on API startup")
    except Exception as e:
        logger.error(f"Failed to start crawler service: {str(e)}")

# Shutdown the crawler service on shutdown
@router.on_event("shutdown")
def shutdown_event():
    try:
        stop_crawler_service()
        logger.info("Crawler service stopped on API shutdown")
    except Exception as e:
        logger.error(f"Failed to stop crawler service: {str(e)}")

@router.get("/status")
async def get_crawler_status():
    """Get the current status of the crawler service"""
    try:
        scheduler = get_crawler_scheduler()
        return scheduler.get_status()
    except Exception as e:
        logger.error(f"Error getting crawler status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get crawler status: {str(e)}")

@router.get("/targets")
async def get_crawl_targets():
    """Get all crawl targets"""
    try:
        scheduler = get_crawler_scheduler()
        targets = scheduler.get_targets()
        
        # Convert to serializable format
        serialized_targets = []
        for target in targets:
            serialized_targets.append({
                "name": target.name,
                "start_urls": target.start_urls,
                "allowed_domains": target.allowed_domains,
                "max_depth": target.max_depth,
                "max_pages": target.max_pages,
                "delay_range": target.delay_range,
                "business_selectors": target.business_selectors,
                "active": target.active,
                "last_crawl": target.last_crawl.isoformat() if target.last_crawl else None,
                "next_crawl": target.next_crawl.isoformat() if target.next_crawl else None,
                "crawl_interval_hours": target.crawl_interval_hours
            })
        
        return serialized_targets
    except Exception as e:
        logger.error(f"Error getting crawl targets: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get crawl targets: {str(e)}")

@router.post("/targets")
async def add_crawl_target(target: Dict[str, Any]):
    """Add a new crawl target"""
    try:
        scheduler = get_crawler_scheduler()
        
        # Create CrawlTarget object
        new_target = CrawlTarget(
            name=target["name"],
            start_urls=target["start_urls"],
            allowed_domains=target["allowed_domains"],
            max_depth=target["max_depth"],
            max_pages=target["max_pages"],
            delay_range=tuple(target["delay_range"]),
            business_selectors=target["business_selectors"],
            active=target["active"],
            crawl_interval_hours=target["crawl_interval_hours"]
        )
        
        # Add to scheduler
        scheduler.add_target(new_target)
        
        return {"status": "success", "message": f"Added crawl target: {target['name']}"}
    except Exception as e:
        logger.error(f"Error adding crawl target: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add crawl target: {str(e)}")

@router.delete("/targets/{target_name}")
async def delete_crawl_target(target_name: str):
    """Delete a crawl target"""
    try:
        scheduler = get_crawler_scheduler()
        
        # Check if target exists
        target = scheduler.get_target(target_name)
        if not target:
            raise HTTPException(status_code=404, detail=f"Crawl target '{target_name}' not found")
        
        # Remove from scheduler
        scheduler.remove_target(target_name)
        
        return {"status": "success", "message": f"Deleted crawl target: {target_name}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting crawl target: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete crawl target: {str(e)}")

@router.post("/run/{target_name}")
async def run_crawl(target_name: str):
    """Run a crawl for a specific target"""
    try:
        scheduler = get_crawler_scheduler()
        
        # Check if target exists
        target = scheduler.get_target(target_name)
        if not target:
            raise HTTPException(status_code=404, detail=f"Crawl target '{target_name}' not found")
        
        # Run the crawl
        result = await scheduler.run_single_crawl(target_name)
        
        # Convert to serializable format
        serialized_result = {
            "target_name": result.target_name,
            "start_time": result.start_time.isoformat(),
            "end_time": result.end_time.isoformat(),
            "pages_crawled": result.pages_crawled,
            "businesses_found": result.businesses_found,
            "errors": result.errors,
            "success": result.success
        }
        
        return serialized_result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error running crawl: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to run crawl: {str(e)}")

@router.post("/start")
async def start_crawler():
    """Start the crawler service"""
    try:
        scheduler = get_crawler_scheduler()
        
        if scheduler.running:
            return {"status": "success", "message": "Crawler service is already running"}
        
        scheduler.start()
        return {"status": "success", "message": "Crawler service started"}
    except Exception as e:
        logger.error(f"Error starting crawler service: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start crawler service: {str(e)}")

@router.post("/stop")
async def stop_crawler():
    """Stop the crawler service"""
    try:
        scheduler = get_crawler_scheduler()
        
        if not scheduler.running:
            return {"status": "success", "message": "Crawler service is already stopped"}
        
        scheduler.stop()
        return {"status": "success", "message": "Crawler service stopped"}
    except Exception as e:
        logger.error(f"Error stopping crawler service: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to stop crawler service: {str(e)}")