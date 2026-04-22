@echo off
echo ========================================
echo Testing PDF Upload System
echo ========================================
echo.

echo Step 1: Checking backend compilation...
cd /d "%~dp0"
call mvnw clean compile
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend compilation failed!
    pause
    exit /b 1
)
echo Backend compiled successfully!
echo.

echo Step 2: Starting backend server...
echo Please wait for the server to start...
echo Look for "Started UtcctpApplication" message
echo.
start "Backend Server" cmd /k "mvnw spring-boot:run"
echo.

echo Step 3: Waiting for backend to start (30 seconds)...
timeout /t 30 /nobreak
echo.

echo Step 4: Starting frontend...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
echo.

echo ========================================
echo Test Instructions:
echo ========================================
echo 1. Wait for both servers to start
echo 2. Open http://localhost:3000 in your browser
echo 3. Login as a STUDENT user
echo 4. Navigate to /student/reports/submit
echo 5. Fill in the report form
echo 6. Click "เลือกไฟล์ PDF" to upload a PDF file
echo 7. Submit the report
echo 8. Navigate to /student/reports to see your reports
echo 9. Login as ADVISOR to see download button
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue...
pause
