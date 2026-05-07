@echo off
title ALCHEMY FLOW - Local Server
echo ========================================
echo   ALCHEMY FLOW - LOCAL SETUP
echo ========================================

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install it from https://nodejs.org/
    pause
    exit /b
)

echo [1/2] Installing/Updating dependencies...
call npm install --no-fund --no-audit

echo [2/2] Starting Server...
echo The app will open in your browser shortly...

:: Wait 3 seconds then open browser
start "" "http://localhost:3000"

:: Start the app
npm run dev

pause
