@echo off
title Screen Designer Launcher (Windows Native)
cd /d "%~dp0"

echo ========================================================
echo   Screen Designer - Cross-Agent UI Storyboard Canvas
echo ========================================================
echo.

if not exist "node_modules" (
    echo [*] Installing dependencies on Windows...
    call npm install
)

echo [*] Starting Screen Designer MCP Server in background...
start "Screen Designer MCP" /min cmd /c "npm run dev:mcp"

echo [*] Launching Screen Designer Canvas App...
call npm run dev:app

pause
