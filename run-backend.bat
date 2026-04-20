@echo off
echo ========================================
echo Starting UTCC-TP Backend (Spring Boot)
echo ========================================
echo.
echo Backend will run on: http://localhost:8080
echo API endpoint: http://localhost:8080/api/v1
echo.
echo Demo Users:
echo - student1 / pass123 (STUDENT)
echo - advisor1 / pass123 (ADVISOR)
echo - staff1   / pass123 (STAFF)
echo - admin1   / pass123 (ADMIN)
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

mvnw.cmd -DskipTests spring-boot:run

pause
