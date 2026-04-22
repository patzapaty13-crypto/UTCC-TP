@echo off
echo ========================================
echo Merging Friend's Code + PDF Upload
echo ========================================
echo.

echo Step 1: Using friend's version for conflict files...
git checkout --theirs frontend/app/(app)/company/applicants/page.js
git checkout --theirs frontend/app/(app)/student/applications/page.js
git checkout --theirs src/main/java/org/example/utcctp/interview/InterviewService.java
git checkout --theirs src/main/java/org/example/utcctp/model/ApplicationStatus.java
git checkout --theirs src/main/java/org/example/utcctp/notification/NotificationService.java
git checkout --theirs src/main/java/org/example/utcctp/offer/OfferService.java
echo Done!
echo.

echo Step 2: Removing files deleted by friend...
git rm frontend/components/NextStepGuidance.js
git rm src/main/java/org/example/utcctp/api/InternController.java
git rm src/main/java/org/example/utcctp/intern/InternService.java
echo Done!
echo.

echo Step 3: Adding all changes...
git add .
echo Done!
echo.

echo Step 4: Committing merged changes...
git commit -m "feat: merge friend's code (resend OTP) + PDF upload system"
echo Done!
echo.

echo ========================================
echo Merge Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Close any running Java processes
echo 2. Run: mvnw spring-boot:run
echo.
pause
