@echo off
REM Start script for BizIntelTZ on Windows
echo Starting BizIntelTZ - Tanzania Business Intelligence Engine
echo ==============================================

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python to run the backend.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js to run the frontend.
    pause
    exit /b 1
)

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install Python dependencies.
    pause
    exit /b 1
)

REM Install Node.js dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
    
    if errorlevel 1 (
        echo ❌ Failed to install Node.js dependencies.
        pause
        exit /b 1
    )
)

echo 🚀 Starting both frontend and backend servers...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo ==============================================

REM Start both servers using npm script
npm run dev:full
