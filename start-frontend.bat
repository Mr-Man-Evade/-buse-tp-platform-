@echo off
title BUSE TP - Frontend (React)
echo ============================================
echo   BUSE TP Platform - Frontend (React)
echo ============================================
echo.
echo Starting React app on http://localhost:3000
echo Backend must be running on http://localhost:5000
echo.
cd /d "%~dp0frontend"
npm start
pause
