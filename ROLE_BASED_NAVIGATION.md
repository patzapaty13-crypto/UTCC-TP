# Role-Based Navigation System

## Overview
Navigation menu is now dynamically displayed based on user role to ensure proper access control and better user experience.

## Navigation by Role

### 👨‍🎓 STUDENT
Students can access:
- ✅ ภาพรวม (Dashboard)
- ✅ ค้นหาตำแหน่งงาน (Browse Internships)
- ✅ ใบสมัครของฉัน (My Applications)
- ✅ นัดสัมภาษณ์ (Interviews)
- ✅ ข้อเสนองาน (Job Offers)
- ✅ รายงาน (Reports)
- ✅ โปรไฟล์ (Profile)

**Cannot access:**
- ❌ Analytics (System-level data)
- ❌ ATS/Recruitment (Company feature)
- ❌ Admin settings
- ❌ Staff functions

### 🏢 COMPANY
Companies can access:
- ✅ ภาพรวม (Dashboard)
- ✅ ตำแหน่งงาน (Manage Positions)
- ✅ ผู้สมัคร (Applicants)
- ✅ จัดการผู้สมัคร (ATS/Recruitment)
- ✅ นัดสัมภาษณ์ (Interviews)
- ✅ ข้อเสนองาน (Job Offers)
- ✅ นักศึกษาฝึกงาน (Current Interns)
- ✅ โปรไฟล์บริษัท (Company Profile)

**Cannot access:**
- ❌ Analytics (System-level data)
- ❌ Admin settings
- ❌ Staff functions

### 👨‍🏫 ADVISOR
Advisors can access:
- ✅ ภาพรวม (Dashboard)
- ✅ นักศึกษา (My Students)
- ✅ รายงาน (Student Reports)
- ✅ ตำแหน่งงาน (Browse Internships)
- ✅ วิเคราะห์ข้อมูล (Analytics)

**Cannot access:**
- ❌ Admin settings
- ❌ User management

### 👔 STAFF
Staff can access:
- ✅ ภาพรวม (Dashboard)
- ✅ บริษัท (Manage Companies)
- ✅ มอบหมายอาจารย์ (Assign Advisors)
- ✅ เอกสาร (Documents)
- ✅ ตำแหน่งงาน (Browse Internships)
- ✅ วิเคราะห์ข้อมูล (Analytics)

**Cannot access:**
- ❌ Full admin settings
- ❌ User management (limited)

### 👑 ADMIN
Admins can access everything:
- ✅ ภาพรวม (Dashboard)
- ✅ จัดการผู้ใช้ (User Management)
- ✅ จัดการบริษัท (Company Management)
- ✅ ตรวจสอบระบบ (Audit Logs)
- ✅ วิเคราะห์ข้อมูล (Analytics)
- ✅ ตั้งค่าระบบ (System Settings)

## Implementation

### Frontend (layout.js)
```javascript
const NAV_BY_ROLE = {
  STUDENT: [...],
  COMPANY: [...],
  ADVISOR: [...],
  STAFF: [...],
  ADMIN: [...]
};

const getNavForUser = (user) => {
  // Priority: ADMIN > STAFF > ADVISOR > COMPANY > STUDENT
  if (user.roles.includes("ADMIN")) return NAV_BY_ROLE.ADMIN;
  if (user.roles.includes("STAFF")) return NAV_BY_ROLE.STAFF;
  if (user.roles.includes("ADVISOR")) return NAV_BY_ROLE.ADVISOR;
  if (user.roles.includes("COMPANY")) return NAV_BY_ROLE.COMPANY;
  return NAV_BY_ROLE.STUDENT;
};
```

### Backend (Controllers)
All controllers use `@PreAuthorize` annotations:
```java
@PreAuthorize("hasRole('STUDENT')")
@PreAuthorize("hasRole('COMPANY')")
@PreAuthorize("hasRole('ADVISOR') or hasRole('STAFF') or hasRole('ADMIN')")
@PreAuthorize("hasRole('ADMIN')")
```

## Role Priority

When a user has multiple roles, the system uses this priority:
1. **ADMIN** - Highest priority, sees admin menu
2. **STAFF** - Second priority, sees staff menu
3. **ADVISOR** - Third priority, sees advisor menu
4. **COMPANY** - Fourth priority, sees company menu
5. **STUDENT** - Default, sees student menu

## Security Notes

### Frontend Protection
- Navigation menu is hidden based on role
- Users cannot see links they don't have access to
- Improves UX by showing only relevant features

### Backend Protection
- All API endpoints protected with `@PreAuthorize`
- Frontend hiding is NOT security - backend enforces access
- Even if user manually navigates to URL, backend will deny access

### Example Flow
1. Student logs in
2. Frontend shows only student menu items
3. Student tries to access `/analytics` manually
4. Backend returns 403 Forbidden
5. Frontend redirects to dashboard or shows error

## Testing

### Test Each Role
```bash
# Login as each role and verify menu items
1. Login as STUDENT - should NOT see Analytics
2. Login as COMPANY - should see ATS but NOT Analytics
3. Login as ADVISOR - should see Analytics
4. Login as STAFF - should see Analytics
5. Login as ADMIN - should see everything
```

### Test Manual Navigation
```bash
# Try accessing restricted pages directly
1. Login as STUDENT
2. Navigate to /analytics manually
3. Should be denied (403) or redirected
```

## Benefits

### For Users
- ✅ Cleaner interface - only see relevant features
- ✅ Less confusion - no irrelevant menu items
- ✅ Better UX - focused on their tasks

### For System
- ✅ Better security - defense in depth
- ✅ Easier maintenance - clear role separation
- ✅ Scalable - easy to add new roles

## Common Routes by Role

### Student Routes
- `/dashboard` - Student dashboard
- `/internships` - Browse positions
- `/student/applications` - My applications
- `/student/interviews` - My interviews
- `/student/offers` - My offers
- `/student/reports` - My reports
- `/profile` - My profile

### Company Routes
- `/dashboard` - Company dashboard
- `/company/internships` - Manage positions
- `/company/applicants` - View applicants
- `/recruitment` - ATS system
- `/company/interviews` - Manage interviews
- `/company/offers` - Manage offers
- `/company/interns` - Current interns
- `/company/profile` - Company profile

### Advisor Routes
- `/dashboard` - Advisor dashboard
- `/advisor/students` - My students
- `/advisor/reports` - Student reports
- `/internships` - Browse positions
- `/analytics` - System analytics

### Staff Routes
- `/dashboard` - Staff dashboard
- `/staff/companies` - Manage companies
- `/staff/assign-advisor` - Assign advisors
- `/staff/documents` - Manage documents
- `/internships` - Browse positions
- `/analytics` - System analytics

### Admin Routes
- `/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/companies` - Company management
- `/admin/audit` - Audit logs
- `/analytics` - System analytics
- `/admin/settings` - System settings

## Future Enhancements

### Possible Additions
1. **Permission-based access** - More granular than roles
2. **Custom role creation** - Allow creating custom roles
3. **Role inheritance** - Roles can inherit from others
4. **Temporary access** - Time-limited role assignments
5. **Role switching** - Users with multiple roles can switch

### Menu Customization
1. **User preferences** - Hide/show menu items
2. **Favorites** - Pin frequently used items
3. **Recent pages** - Quick access to recent pages
4. **Search** - Search menu items
