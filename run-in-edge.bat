@echo off
title BUSE TP Platform Launcher
color 0B
echo.
echo  =============================================
echo    BUSE TP Platform ^| Launching in Edge
echo  =============================================
echo.

REM Store project root
set "ROOT=%~dp0"

echo  [1/3] Starting Backend Server (port 5000)...
start "BUSE-TP Backend" cmd /k "cd /d "%ROOT%backend" && npm run dev"

echo  Waiting for backend to initialize (5s)...
timeout /t 5 /nobreak > nul

echo  [2/3] Starting React/Vite Frontend (port 3000)...
start "BUSE-TP Frontend" cmd /k "cd /d "%ROOT%frontend" && "%ROOT%node_modules\.bin\vite.cmd" --port 3000 --host"

echo  Waiting for Vite to start (6s)...
timeout /t 6 /nobreak > nul

echo  [3/3] Opening Microsoft Edge...
start msedge "http://localhost:3000"

echo.
echo  =============================================
echo    App is running!
echo    Frontend : http://localhost:3000
echo    Backend  : http://localhost:5000
echo    Login    : admin@buse.edu.zw (password configured in backend/.env)
echo  =============================================
echo.
pause
