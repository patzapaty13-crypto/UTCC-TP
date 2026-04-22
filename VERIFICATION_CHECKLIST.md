# PDF Upload System - Verification Checklist

## Pre-Flight Checks

### Backend
- [x] Backend compiles successfully (BUILD SUCCESS)
- [x] V17 migration file created
- [x] Report model has file fields
- [x] ReportService has uploadReportFile method
- [x] ReportService has downloadReportFile method
- [x] ReportService has getReportFileName method
- [x] ReportController has POST /{id}/upload endpoint
- [x] ReportController has GET /{id}/download endpoint
- [x] ReportController has GET /{id} endpoint
- [x] All @PreAuthorize annotations correct
- [x] Friend's InterviewService integrated
- [x] Friend's InterviewController integrated
- [x] OfferService fixed (no Intern references)
- [x] NotificationService fixed

### Frontend
- [x] api.js has uploadReportFile function
- [x] api.js has downloadReportFile function
- [x] student/reports/submit/page.js has PDF upload UI
- [x] advisor/reports/page.js has download button
- [x] Old /reports page removed
- [x] Navigation updated to /student/reports

### Database
- [x] V17 migration created with file fields:
  - file_name VARCHAR(255)
  - file_path VARCHAR(500)
  - file_size BIGINT
  - file_type VARCHAR(100)
  - uploaded_at TIMESTAMP
- [x] Index created for file_name

## Runtime Tests (To Do)

### 1. Backend Startup
- [ ] Run: `mvnw spring-boot:run`
- [ ] Check for "Started UtcctpApplication" message
- [ ] Verify no errors in console
- [ ] Check V17 migration runs successfully

### 2. Frontend Startup
- [ ] Run: `cd frontend && npm run dev`
- [ ] Check for "Ready on http://localhost:3000"
- [ ] Verify no errors in console

### 3. Student Upload Flow
- [ ] Login as STUDENT user
- [ ] Navigate to `/student/reports/submit`
- [ ] Verify PDF upload button appears
- [ ] Fill in report form:
  - Title
  - Content
  - Type (WEEKLY/MONTHLY/FINAL)
  - Week Number (if weekly)
- [ ] Click "เลือกไฟล์ PDF" button
- [ ] Select a PDF file (< 10MB)
- [ ] Verify file name appears
- [ ] Click submit
- [ ] Verify success message
- [ ] Check file uploaded to `uploads/reports/{reportId}/`

### 4. Student View Reports
- [ ] Navigate to `/student/reports`
- [ ] Verify report appears in list
- [ ] Verify file icon/indicator shows
- [ ] Verify can click to view details

### 5. Advisor Download Flow
- [ ] Login as ADVISOR user
- [ ] Navigate to `/advisor/reports`
- [ ] Find report with PDF attachment
- [ ] Verify download button appears
- [ ] Click download button
- [ ] Verify PDF downloads correctly
- [ ] Open PDF and verify content

### 6. API Testing (Optional)
- [ ] Test POST /api/v1/reports/{id}/upload with curl/Postman
- [ ] Test GET /api/v1/reports/{id}/download with curl/Postman
- [ ] Test GET /api/v1/reports/{id} returns file info
- [ ] Verify proper error handling for:
  - Non-PDF files
  - Files too large
  - Missing file
  - Unauthorized access

### 7. Security Testing
- [ ] Verify only STUDENT can upload
- [ ] Verify ADVISOR can download
- [ ] Verify STAFF can download
- [ ] Verify ADMIN can download
- [ ] Verify COMPANY can download
- [ ] Verify unauthorized users cannot access

### 8. Error Handling
- [ ] Try uploading non-PDF file (should reject)
- [ ] Try uploading file > 10MB (should reject)
- [ ] Try downloading non-existent report (should 404)
- [ ] Try uploading without authentication (should 401)

## Quick Test Commands

### Start Backend
```bash
cd UTCC-TP
mvnw spring-boot:run
```

### Start Frontend
```bash
cd UTCC-TP/frontend
npm run dev
```

### Run Full Test
```bash
cd UTCC-TP
test_pdf_upload.bat
```

## Expected Results

### Upload Success Response
```json
{
  "id": "uuid",
  "title": "Week 1 Report",
  "type": "WEEKLY",
  "weekNumber": 1,
  "status": "SUBMITTED",
  "fileName": "report.pdf",
  "fileSize": 123456,
  "fileType": "application/pdf",
  "uploadedAt": "2026-04-22T20:00:00",
  ...
}
```

### Download Response
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="report.pdf"
- Body: PDF file binary data

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use
- Run: `netstat -ano | findstr :8080`
- Kill process if needed

### Frontend won't start
- Check if port 3000 is already in use
- Run: `netstat -ano | findstr :3000`
- Kill process if needed

### Migration fails
- Check database connection
- Verify V1-V16 migrations ran successfully
- Check Flyway schema_version table

### Upload fails
- Check uploads directory exists and is writable
- Verify file size < 10MB
- Verify file type is PDF
- Check backend logs for errors

### Download fails
- Verify file exists in uploads directory
- Check file path in database
- Verify user has permission
- Check backend logs for errors

## Success Criteria

All checkboxes in "Runtime Tests" section should be checked ✓

## Notes

- PDF files stored in: `uploads/reports/{reportId}/{filename}`
- Max file size: 10MB (frontend validation)
- Allowed file type: PDF only
- File validation on both frontend and backend
- Proper error messages for all failure cases
