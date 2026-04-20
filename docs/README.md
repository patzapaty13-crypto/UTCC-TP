# 📚 UTCC Internship System - Documentation

Welcome to the UTCC Internship System documentation! This folder contains all technical and user documentation for the system.

---

## 📖 Available Documents

### 🎯 Phase 1 Enhancement
- **[PHASE1_ENHANCEMENTS.md](./PHASE1_ENHANCEMENTS.md)** - Technical documentation for Phase 1 features
  - Database schema changes
  - API changes
  - Files modified
  - Testing checklist
  - Security measures

- **[PHASE1_QUICK_START.md](./PHASE1_QUICK_START.md)** - Quick start guide for Phase 1
  - Step-by-step instructions for students
  - Step-by-step instructions for companies
  - Configuration guide
  - Troubleshooting

### 🏗️ System Architecture
- **[01-workflows-roles.md](./01-workflows-roles.md)** - User roles and workflows
- **[02-erd-api.md](./02-erd-api.md)** - Entity Relationship Diagram and API documentation
- **[03-wireframes.md](./03-wireframes.md)** - UI/UX wireframes and mockups

---

## 🚀 Quick Links

### For Students
- [How to apply for internships](./PHASE1_QUICK_START.md#สำหรับนักศึกษา)
- [Application form guide](./PHASE1_QUICK_START.md#ขั้นตอนการสมัครงาน)
- [Track application status](./PHASE1_QUICK_START.md#ติดตามสถานะ)

### For Companies
- [How to post internships](./PHASE1_QUICK_START.md#สำหรับบริษัท)
- [Manage applications](./PHASE1_QUICK_START.md#ดูใบสมัคร)
- [Company dashboard guide](./PHASE1_QUICK_START.md#ขั้นตอนการสร้างตำแหน่งงาน)

### For Developers
- [Database schema](./PHASE1_ENHANCEMENTS.md#database-changes)
- [API documentation](./02-erd-api.md)
- [Files changed](./PHASE1_ENHANCEMENTS.md#files-changed)
- [Testing guide](./PHASE1_ENHANCEMENTS.md#testing)

### For Administrators
- [System workflows](./01-workflows-roles.md)
- [User roles](./01-workflows-roles.md)
- [Configuration](./PHASE1_QUICK_START.md#configuration)

---

## 📋 Document Index

| Document | Purpose | Audience |
|----------|---------|----------|
| PHASE1_ENHANCEMENTS.md | Technical documentation | Developers |
| PHASE1_QUICK_START.md | User guide | Students, Companies |
| 01-workflows-roles.md | System workflows | All users |
| 02-erd-api.md | Database & API | Developers |
| 03-wireframes.md | UI/UX design | Designers, Developers |

---

## 🔍 What's New in Phase 1?

Phase 1 introduces major enhancements to the internship application system:

### 1. Enhanced Application Form
- Multi-step form (Form → Preview → Success)
- Personal information (name, phone, email, address)
- Academic information (GPA, major, year)
- Cover letter (minimum 50 characters)
- Portfolio URL (optional)
- Real-time validation

### 2. Enhanced Job Details
- Salary range display
- Internship duration (start/end dates)
- Application deadline with expiration check
- Benefits display
- Contact information (email, phone, LINE)
- Internship type (Full-time/Part-time)
- Google Maps integration

### 3. Enhanced Internships List
- Salary range in list view
- Deadline indicators
- Internship type badges
- Smart filtering and sorting
- Deadline expiration check

### 4. Enhanced Applications Page
- Display GPA, email, phone
- Portfolio quick links
- Advanced filtering
- Search functionality

### 5. Enhanced Company Management
- Comprehensive form with all Phase 1 fields
- Organized sections
- Enhanced list view
- Status indicators

---

## 🛠️ Technical Stack

### Backend
- **Framework**: Spring Boot 3.3.6
- **Database**: PostgreSQL (Supabase) / H2 (local)
- **ORM**: JPA/Hibernate
- **Migration**: Flyway
- **Security**: Spring Security + JWT

### Frontend
- **Framework**: Next.js 14
- **Language**: JavaScript (React)
- **Styling**: Custom CSS with CSS Variables
- **API Client**: Fetch API

### Database
- **Production**: Supabase (PostgreSQL)
- **Development**: H2 (in-memory)
- **Migration Tool**: Flyway

---

## 📊 Database Schema

### Main Tables
- `users` - User accounts
- `companies` - Company profiles
- `internship_positions` - Job postings
- `applications` - Student applications
- `interviews` - Interview schedules
- `offers` - Job offers

### Phase 1 Enhancements
- **Applications**: +9 fields (phone, email, address, gpa, student_year, cover_letter, portfolio_url, updated_at, submitted_at)
- **Internship Positions**: +10 fields (salary_min, salary_max, start_date, end_date, application_deadline, benefits, internship_type, contact_email, contact_phone, contact_line)

See [PHASE1_ENHANCEMENTS.md](./PHASE1_ENHANCEMENTS.md#database-changes) for detailed schema.

---

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation (frontend + backend)
- SQL injection prevention
- XSS prevention
- CSRF protection

---

## 🧪 Testing

### Manual Testing
- Application form submission
- Form validation
- Job details display
- Internships list filtering
- Applications page display
- Company management

See [PHASE1_ENHANCEMENTS.md](./PHASE1_ENHANCEMENTS.md#testing) for complete checklist.

---

## 📞 Support

### For Users
- Check [PHASE1_QUICK_START.md](./PHASE1_QUICK_START.md) for common issues
- Contact IT Support for technical issues

### For Developers
- Review [PHASE1_ENHANCEMENTS.md](./PHASE1_ENHANCEMENTS.md) for technical details
- Check [02-erd-api.md](./02-erd-api.md) for API documentation

---

## 🔮 Roadmap

### Phase 1 (Completed ✅)
- Enhanced application form
- Enhanced job details
- Google Maps integration

### Phase 2 (Planned)
- Document upload system
- Screening questions
- Email notifications
- In-app messaging
- Interview scheduling
- Resume builder

---

## 📝 Contributing

When adding new documentation:
1. Follow the existing format
2. Use clear headings and sections
3. Include code examples where appropriate
4. Update this README with links to new docs
5. Keep documentation up-to-date with code changes

---

## 📅 Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | April 21, 2026 | Phase 1 Enhancement completed |
| 0.1 | Earlier | Initial system documentation |

---

**Last Updated**: April 21, 2026
