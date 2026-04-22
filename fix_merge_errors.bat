@echo off
echo ========================================
echo Fixing Merge Errors
echo ========================================
echo.

echo Resetting to friend's code...
git reset --hard origin/main
echo Done!
echo.

echo Adding PDF upload files back...
git checkout stash@{0} -- src/main/resources/db/migration/V11__add_report_file_support.sql
git checkout stash@{0} -- src/main/java/org/example/utcctp/model/Report.java
git checkout stash@{0} -- src/main/java/org/example/utcctp/report/ReportService.java
git checkout stash@{0} -- src/main/java/org/example/utcctp/api/ReportController.java
git checkout stash@{0} -- src/main/java/org/example/utcctp/api/dto/ReportResponse.java
git checkout stash@{0} -- frontend/app/(app)/student/reports/page.js
git checkout stash@{0} -- frontend/app/(app)/student/reports/submit/page.js
git checkout stash@{0} -- frontend/app/(app)/layout.js
git checkout stash@{0} -- frontend/app/(app)/dashboard/page.js
echo Done!
echo.

echo Committing changes...
git add .
git commit -m "feat: add PDF upload system (clean merge)"
echo Done!
echo.

echo ========================================
echo Fix Complete! Now compiling...
echo ========================================
echo.

call mvnw clean compile -DskipTests

echo.
echo ========================================
echo Ready to run!
echo ========================================
pause
