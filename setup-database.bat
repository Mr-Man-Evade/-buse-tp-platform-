@echo off
title BUSE TP - Database Setup
echo ============================================
echo   BUSE TP Platform - Database Setup
echo ============================================
echo.
echo This will create the buse_tp database in PostgreSQL.
echo Make sure PostgreSQL is running!
echo.
cd /d "%~dp0backend"
node scripts/setup-db.js
echo.
pause
