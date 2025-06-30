#!/bin/bash

# Start script for BizIntelTZ
echo "Starting BizIntelTZ - Tanzania Business Intelligence Engine"
echo "=============================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 to run the backend."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run the frontend."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies."
    exit 1
fi

# Install Node.js dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Node.js dependencies."
        exit 1
    fi
fi

echo "🚀 Starting both frontend and backend servers..."
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:5173"
echo "=============================================="

# Start both servers using npm script
npm run dev:full