#!/bin/bash

# This script manages the BizIntelTZ crawler service
# Usage: ./crawler_service.sh [start|stop|restart|status]

# Configuration
APP_DIR="/var/www/BizIntelTZ"
VENV_DIR="$APP_DIR/venv"
LOG_DIR="/var/log/bizinteltz"
PID_FILE="/var/run/bizinteltz_crawler.pid"
USER="www-data"

# Ensure log directory exists
mkdir -p $LOG_DIR

# Function to start the crawler
start() {
    echo "Starting BizIntelTZ Crawler Service..."
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat $PID_FILE)
        if ps -p $PID > /dev/null; then
            echo "Crawler is already running with PID: $PID"
            return 1
        else
            # PID file exists but process is not running
            rm $PID_FILE
        fi
    fi
    
    # Activate virtual environment and start the crawler
    cd $APP_DIR
    source $VENV_DIR/bin/activate
    
    # Start the crawler in the background
    nohup python -c "from crawler_engine import start_crawler_service; start_crawler_service(); import time; 
    while True: time.sleep(60)" > $LOG_DIR/crawler.log 2>&1 &
    
    # Save the PID
    echo $! > $PID_FILE
    
    echo "Crawler started with PID: $(cat $PID_FILE)"
    echo "Logs available at: $LOG_DIR/crawler.log"
}

# Function to stop the crawler
stop() {
    echo "Stopping BizIntelTZ Crawler Service..."
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat $PID_FILE)
        if ps -p $PID > /dev/null; then
            # Stop the process
            kill $PID
            
            # Wait for it to stop
            for i in {1..10}; do
                if ! ps -p $PID > /dev/null; then
                    break
                fi
                echo "Waiting for crawler to stop..."
                sleep 1
            done
            
            # Force kill if still running
            if ps -p $PID > /dev/null; then
                echo "Crawler did not stop gracefully, forcing..."
                kill -9 $PID
            fi
            
            rm $PID_FILE
            echo "Crawler stopped"
        else
            echo "Crawler is not running, but PID file exists. Cleaning up."
            rm $PID_FILE
        fi
    else
        echo "Crawler is not running (no PID file)"
    fi
}

# Function to restart the crawler
restart() {
    stop
    sleep 2
    start
}

# Function to check the status
status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat $PID_FILE)
        if ps -p $PID > /dev/null; then
            echo "Crawler is running with PID: $PID"
            
            # Show recent log entries
            echo "Recent log entries:"
            tail -n 10 $LOG_DIR/crawler.log
            
            return 0
        else
            echo "Crawler is not running, but PID file exists"
            return 1
        fi
    else
        echo "Crawler is not running (no PID file)"
        return 3
    fi
}

# Main script logic
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac

exit 0