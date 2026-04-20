@echo off
echo ========================================
echo Starting UTCC-TP Frontend (Next.js)
echo ========================================
echo.
echo Frontend will run on: http://localhost:3000
echo Backend API: http://localhost:8080/api/v1
echo.
echo Make sure Backend is running first!
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd frontend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Next.js development server...
call npm run dev

pause
