@echo off
echo ==========================================
echo Pokemon Analyzer - Environment Setup
echo ==========================================
echo.

echo Creating backend .env file...
if not exist "backend\.env" (
    echo # Pokemon Analyzer Backend Environment Variables > backend\.env
    echo # Copy this file and replace with your actual values >> backend\.env
    echo. >> backend\.env
    echo # Required: Your Google Gemini API Key >> backend\.env
    echo GOOGLE_GEMINI_API_KEY=your_api_key_here >> backend\.env
    echo. >> backend\.env
    echo # Optional: Development settings >> backend\.env
    echo NODE_ENV=development >> backend\.env
    echo PORT=3001 >> backend\.env
    echo FRONTEND_URL=http://localhost:5173 >> backend\.env
    echo ENABLE_REQUEST_LOGGING=true >> backend\.env
    
    echo Created backend\.env file
    echo Please edit backend\.env and add your Google Gemini API key
) else (
    echo backend\.env already exists
)

echo.
echo Creating frontend .env file...
if not exist ".env" (
    echo # Pokemon Analyzer Frontend Environment Variables > .env
    echo # Copy this file and replace with your actual values >> .env
    echo. >> .env
    echo # Backend URL for development >> .env
    echo VITE_BACKEND_URL=http://localhost:3001 >> .env
    
    echo Created .env file
) else (
    echo .env already exists
)

echo.
echo Installing dependencies...
echo [1/2] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Frontend dependency installation failed
    exit /b 1
)

echo [2/2] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend dependency installation failed
    cd ..
    exit /b 1
)
cd ..

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Get a Google Gemini API key from: https://ai.google.dev/
echo 2. Edit backend\.env and replace 'your_api_key_here' with your actual API key
echo 3. Run 'test-deployment.bat' to verify everything works
echo 4. Follow DEPLOYMENT.md for production deployment
echo.

pause
