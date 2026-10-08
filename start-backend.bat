@echo off
title BUSE TP - Backend Server
echo ============================================
echo   BUSE TP Platform - Backend Server
echo ============================================
echo.
echo Starting Node.js backend on http://localhost:5000
echo Make sure PostgreSQL is running first!
echo.
cd /d "%~dp0backend"
npm run dev
pause
