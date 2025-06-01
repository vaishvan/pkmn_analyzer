@echo off
echo ==========================================
echo Pokemon Analyzer - Deployment Test Script
echo ==========================================
echo.

echo [1/5] Testing Frontend Build...
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed
    exit /b 1
)
echo Frontend build successful

echo.
echo [2/5] Testing Backend Dependencies...
cd backend
call npm ci
if %errorlevel% neq 0 (
    echo Backend dependency installation failed
    cd ..
    exit /b 1
)
echo Backend dependencies installed

echo.
echo [3/5] Testing Backend Startup...
timeout /t 2 /nobreak > nul
start /b npm start
timeout /t 10 /nobreak > nul
echo Backend started (running in background)

echo.
echo [4/5] Testing Health Endpoint...
curl -f http://localhost:3001/health > nul 2>&1
if %errorlevel% neq 0 (
    echo Health check failed
    echo Make sure backend is running and port 3001 is available
    cd ..
    exit /b 1
)
echo Health check passed

echo.
echo [5/5] Testing API Endpoint...
curl -X POST -H "Content-Type: application/json" -d "{\"yourTeam\":[{\"name\":\"Pikachu\",\"types\":[\"Electric\"]}],\"opponentTeam\":[{\"name\":\"Charizard\",\"types\":[\"Fire\",\"Flying\"]}]}" http://localhost:3001/api/analyze > test_response.json 2>&1
if %errorlevel% neq 0 (
    echo API test failed
    echo Check if GOOGLE_GEMINI_API_KEY is set in .env file
    cd ..
    exit /b 1
)
echo API test passed

echo.
echo All tests passed! Your deployment is ready.
echo.
echo Next Steps:
echo 1. Set GOOGLE_GEMINI_API_KEY in Render dashboard
echo 2. Deploy backend to Render
echo 3. Update VITE_BACKEND_URL in frontend
echo 4. Deploy frontend to GitHub Pages
echo.
echo Useful URLs:
echo - Render Dashboard: https://dashboard.render.com
echo - GitHub Pages Settings: https://github.com/your-username/pkmn_analyzer/settings/pages
echo.

cd ..
pause
