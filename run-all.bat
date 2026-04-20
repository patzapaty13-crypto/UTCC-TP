@echo off
echo ========================================
echo Starting UTCC-TP Full Stack Application
echo ========================================
echo.
echo This will open 2 windows:
echo 1. Backend (Spring Boot) - http://localhost:8080
echo 2. Frontend (Next.js) - http://localhost:3000
echo.
echo Press any key to continue...
pause >nul

echo.
echo Starting Backend...
start "UTCC-TP Backend" cmd /k "run-backend.bat"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo Starting Frontend...
start "UTCC-TP Frontend" cmd /k "run-frontend.bat"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Demo Users:
echo - student1 / pass123 (STUDENT)
echo - admin1   / pass123 (ADMIN)
echo.
echo Close this window or press any key to exit
pause >nul
