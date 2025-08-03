@echo off
echo Starting MarketHub API Server...
echo.

REM Set environment variables
set PORT=3002
set NODE_ENV=development

REM Check if MongoDB is running
echo Checking MongoDB connection...
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/markethub').then(() => { console.log('✅ MongoDB connected'); process.exit(0); }).catch(err => { console.log('❌ MongoDB connection failed:', err.message); process.exit(1); });"

if %errorlevel% neq 0 (
    echo.
    echo ❌ MongoDB is not running or not accessible
    echo Please start MongoDB first:
    echo   - If using MongoDB Compass, start it
    echo   - If using MongoDB service: net start MongoDB
    echo   - If using local installation: mongod
    echo.
    pause
    exit /b 1
)

echo.
echo Starting server on port %PORT%...
node server.js

pause
