@echo off
echo ==========================================
echo Pokemon Analyzer - Quick Start (Development)
echo ==========================================
echo.

echo Starting backend in development mode...
cd backend

REM Set development environment
set NODE_ENV=development

REM Kill any existing processes on port 3001
echo Checking for existing processes on port 3001...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :3001') do (
    echo Killing process %%p
    taskkill /F /PID %%p 2>nul
)

echo Starting backend server...
start "Pokemon Backend" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend...
cd ..
start "Pokemon Frontend" cmd /k "npm run dev"

echo.
echo Both services starting!
echo.
echo Backend: http://localhost:3001/health
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
