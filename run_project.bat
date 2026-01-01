@echo off
title Deepfake Detection System Launcher

echo ===================================================
echo   STARTING DEEPFAKE DETECTION SYSTEM (ViT-B/16)
echo ===================================================

:: 1. Start Backend in a new window
echo Starting AI Backend...
start "AI Backend Server" cmd /k "cd Backend && python backend.py"

:: Wait 5 seconds for backend to initialize
timeout /t 5 /nobreak >nul

:: 2. Start Frontend in a new window
echo Starting User Interface...
start "Frontend UI" cmd /k "cd Frontend/be_fr-master && npm run dev"

:: Wait 5 seconds for frontend to build
timeout /t 5 /nobreak >nul

:: 3. Open Browser
echo Opening System in Browser...
start http://localhost:3000

echo ===================================================
echo   SYSTEM IS RUNNING!
echo   - Backend Window: Do not close.
echo   - Frontend Window: Do not close.
echo ===================================================
pause
