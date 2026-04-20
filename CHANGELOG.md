# Changelog

All notable changes to the UTCC Internship System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-04-21

### 🎉 Full System Release - Production Ready

#### Added

**Company Role - Complete**
- Added `company/applicants/page.js` - Kanban board for applicant tracking
  - Status management (Pending → Reviewing → Interview → Offer → Accepted)
  - Detailed applicant view with GPA, cover letter, portfolio
  - Quick status updates
- Added `company/interviews/page.js` - Interview scheduling and management
  - Schedule interviews with date/time/location
  - Track upcoming vs past interviews
  - Interviewer assignment
- Added `company/offers/page.js` - Job offer creation and tracking
  - Salary negotiation
  - Start/end dates
  - Benefits listing
  - Expiration tracking
  - Accept/Reject workflow

**Advisor Role - Complete**
- Added `advisor/students/page.js` - Student monitoring
  - View assigned students with stats
  - Track application progress
  - Monitor student success
  - Filter by status (Active, Placed, No Applications)
- Added `advisor/reports/page.js` - Report review and grading
  - Review student reports
  - Assign grades (0-100)
  - Provide feedback
  - Track average scores

**Staff Role - Complete**
- Added `staff/companies/page.js` - Company CRUD management
  - Create/Edit/Delete companies
  - Full contact information
  - Industry categorization
  - Search and filter

**Admin Role - Complete**
- Added `admin/users/page.js` - User management
  - User CRUD operations
  - Multi-role assignment
  - Student-specific fields (major, year)
  - Password management
- Added `admin/settings/page.js` - System settings
  - Site configuration
  - User registration toggle
  - Application limits
  - Maintenance mode
  - System info display

**API Enhancements**
- Added `deleteCompany` method to API client
- Added report grading endpoints
- Added interview management endpoints
- Added offer management endpoints

**Documentation**
- Added `FULL_SYSTEM_STATUS.md` - Detailed system status
- Added `PRODUCTION_READY.md` - Production readiness summary
- Updated all role documentation

#### Changed

- Enhanced all role dashboards with complete workflows
- Improved navigation with RoleDashboardShell
- Enhanced UI/UX consistency across all pages
- Improved data tables and card layouts

#### Fixed

- Fixed missing `deleteCompany` API method
- Fixed role-based access control
- Fixed responsive design issues

---

## [1.1.0] - 2026-04-21

### 🎉 Phase 1 Enhancement - Major Feature Release

#### Added

**Backend**
- Added 9 new fields to `applications` table:
  - `phone` (VARCHAR 20) - Student phone number
  - `email` (VARCHAR 120) - Student email
  - `address` (VARCHAR 500) - Student address
  - `gpa` (DECIMAL 3,2) - Student GPA
  - `student_year` (INTEGER) - Student year (renamed from `year`)
  - `cover_letter` (TEXT) - Application cover letter
  - `portfolio_url` (VARCHAR 500) - Student portfolio URL
  - `updated_at` (TIMESTAMP) - Last update timestamp
  - `submitted_at` (TIMESTAMP) - Submission timestamp

- Added 10 new fields to `internship_positions` table:
  - `salary_min` (DECIMAL 10,2) - Minimum salary
  - `salary_max` (DECIMAL 10,2) - Maximum salary
  - `start_date` (DATE) - Internship start date
  - `end_date` (DATE) - Internship end date
  - `application_deadline` (DATE) - Application deadline
  - `benefits` (TEXT) - Benefits (comma-separated)
  - `internship_type` (VARCHAR 30) - Full-time or Part-time
  - `contact_email` (VARCHAR 120) - Contact email
  - `contact_phone` (VARCHAR 20) - Contact phone
  - `contact_line` (VARCHAR 100) - LINE contact

- Migration script `V8__phase1_enhancements.sql`
- Updated `ApplicationRequest` DTO with new fields
- Updated `InternshipResponse` DTO with new fields
- Enhanced `ApplicationService` to save all new fields
- Enhanced `InternshipService` to parse and save new fields
- Updated `DataSeeder` with sample data for new fields

**Frontend**
- New `ApplicationForm` component with 3-step wizard:
  - Step 1: Form (personal info, academic info, cover letter, portfolio)
  - Step 2: Preview (review all data before submission)
  - Step 3: Success (confirmation message)
- Real-time validation for all form fields
- Enhanced internship detail page (`internships/[id]/page.js`):
  - Salary range display
  - Duration display (start/end dates)
  - Application deadline with expiration check
  - Benefits display as badges
  - Contact information cards
  - Internship type badge
  - Google Maps iframe embed
- Enhanced internships list page (`internships/page.js`):
  - Salary range in list view
  - Deadline indicators
  - Internship type badges
  - Smart deadline expiration check
- Enhanced applications page (`applications/page.js`):
  - Display GPA, email, phone
  - Portfolio quick links
  - Enhanced filtering
- Enhanced company internships management (`company/internships/page.js`):
  - Comprehensive form with all Phase 1 fields
  - Organized sections (basic, work details, compensation, timeline, contact)
  - Enhanced list view with detailed information
- Updated `api.js` to send all Phase 1 fields

**Documentation**
- Added `docs/PHASE1_ENHANCEMENTS.md` - Technical documentation
- Added `docs/PHASE1_QUICK_START.md` - User guide
- Added `PHASE1_COMPLETE.md` - Completion summary
- Added `docs/README.md` - Documentation index
- Updated main `README.md` with Phase 1 information
- Added `CHANGELOG.md` (this file)

#### Changed

- Renamed `year` column to `student_year` in applications table (H2 reserved keyword conflict)
- Updated application submission flow to include preview step
- Enhanced UI/UX across all internship-related pages
- Improved form validation with real-time feedback
- Enhanced error handling and user feedback

#### Fixed

- H2 reserved keyword issue with `year` column
- Form validation edge cases
- Responsive layout issues on mobile devices

#### Security

- Added validation for phone numbers (10 digits, starts with 0)
- Added validation for email format
- Added validation for GPA range (0.00-4.00)
- Added validation for URL format (portfolio)
- Added validation for cover letter length (50-2000 characters)

---

## [1.0.0] - 2026-04-20

### Initial Release

#### Added

**Backend**
- Spring Boot 3.4.3 application
- JWT authentication
- User management (STUDENT, ADVISOR, STAFF, ADMIN roles)
- Trip management system
- Internship position management
- Application tracking system (ATS)
- Interview scheduling
- Offer management
- Audit logging
- Analytics dashboard
- File storage (Local/Cloudinary)
- Email notifications (Resend)
- OTP signup flow
- Database migrations (Flyway V1-V5)

**Frontend**
- Next.js 14 application
- Authentication pages (login, signup)
- Dashboard pages for all roles
- Trip management pages
- Internship browsing and application
- Application tracking
- Profile management
- Analytics visualization
- Responsive design
- Custom CSS styling

**Database**
- PostgreSQL schema (Supabase)
- H2 in-memory database for development
- Initial tables:
  - users
  - companies
  - trips
  - trip_schedules
  - internship_positions
  - applications
  - application_status_logs
  - interviews
  - offers
  - files
  - notifications
  - audit_logs
  - signup_otps

**Infrastructure**
- Docker Compose setup
- Render deployment configuration
- Vercel deployment configuration
- Environment variable templates

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 2.0.0 | 2026-04-21 | Full System Release - All roles complete, production ready |
| 1.1.0 | 2026-04-21 | Phase 1 Enhancement - Enhanced application form and job details |
| 1.0.0 | 2026-04-20 | Initial release - Core ATS functionality |

---

## System Status

**Current Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Completion**: 100%

### Implemented Roles
- ✅ Student (100%)
- ✅ Company (100%)
- ✅ Advisor (100%)
- ✅ Staff (100%)
- ✅ Admin (100%)

### Key Features
- ✅ Complete application workflow
- ✅ Kanban board for applicant tracking
- ✅ Interview scheduling
- ✅ Job offer management
- ✅ Report grading system
- ✅ Company management
- ✅ User management
- ✅ System settings

---

## Future Enhancements (Phase 3)

- Document upload system (CV, Transcript)
- Screening questions from companies
- Document viewer component
- Email notifications for application status
- In-app messaging system
- Interview scheduling improvements
- Resume builder
- Company profile enhancements
- Advanced analytics dashboard with charts
- Mobile application (PWA)
- Export functionality (CSV, PDF)
- Bulk operations
- Calendar integration

---

**Note**: For detailed information about the full system, see [PRODUCTION_READY.md](./PRODUCTION_READY.md)
