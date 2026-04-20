# 🔍 การวิเคราะห์ความสะดวกในการใช้งาน (Usability Analysis)

## ❌ ปัญหาที่พบ

### 1. **COMPANY Role - ไม่สามารถสร้างตำแหน่งงานได้ทันที**
**ปัญหา**:
- ต้องมี Admin สร้าง Company ก่อน
- ต้องมี Admin link User กับ Company
- ต้องรอหลายขั้นตอนก่อนใช้งานได้

**ผลกระทบ**:
- บริษัทที่สมัครใหม่ใช้งานไม่ได้ทันที
- ต้องรอ Admin approve และ setup
- UX แย่มาก

**แก้ไข**:
✅ ให้ Company สร้าง Company Profile ของตัวเองได้เลย
✅ Auto-link User กับ Company ที่สร้าง
✅ ไม่ต้องรอ Admin

---

### 2. **COMPANY Role - Dropdown เลือก Company สับสน**
**ปัญหา**:
- แสดง dropdown ให้เลือก company ทั้งหมด
- Company ควรเห็นแค่ company ของตัวเอง
- สับสนว่าทำไมต้องเลือก

**แก้ไข**:
✅ ซ่อน dropdown
✅ ใช้ company ของ user ที่ login อัตโนมัติ
✅ แสดงชื่อ company ที่กำลังใช้งาน

---

### 3. **STAFF Role - จัดการ Company ยุ่งยาก**
**ปัญหา**:
- ต้องสร้าง Company แยก
- ต้องไป Admin → Users เพื่อ link user
- ขั้นตอนเยอะ

**แก้ไข**:
✅ เพิ่มปุ่ม "สร้าง User สำหรับ Company" ในหน้า Staff → Companies
✅ สร้าง user พร้อม link company ในคลิกเดียว
✅ แสดง users ที่เชื่อมกับ company แต่ละตัว

---

### 4. **ADVISOR Role - ไม่รู้ว่านักศึกษาไหนอยู่ในความดูแล**
**ปัญหา**:
- แสดงนักศึกษาทั้งหมดในระบบ
- ไม่มีการ assign advisor กับ student
- ไม่มีการกรองว่าใครอยู่ในความดูแล

**แก้ไข**:
✅ เพิ่ม advisorId ใน Student
✅ แสดงเฉพาะนักศึกษาที่ assigned ให้ advisor คนนั้น
✅ เพิ่มหน้า Staff → Assign Advisor

---

### 5. **STUDENT Role - สมัครงานแล้วไม่รู้ว่าต้องทำอะไรต่อ**
**ปัญหา**:
- หลังสมัครงานแล้ว ไม่มี next step ชัดเจน
- ไม่รู้ว่าต้องรอนานแค่ไหน
- ไม่มี notification

**แก้ไข**:
✅ แสดง timeline ของ application
✅ แสดง next step ที่ต้องทำ
✅ เพิ่ม notification เมื่อสถานะเปลี่ยน

---

### 6. **ADMIN Role - จัดการ User ยุ่งยาก**
**ปัญหา**:
- ต้องกรอก companyId เป็น UUID ด้วยตัวเอง
- ไม่มี dropdown เลือก company
- ต้องจำ UUID

**แก้ไข**:
✅ เปลี่ยนจาก text input เป็น dropdown
✅ แสดงชื่อ company แทน UUID
✅ Auto-complete

---

## 🎯 แผนการแก้ไข (Priority Order)

### Priority 1: Critical (ต้องแก้ก่อน)
1. ✅ **Company Self-Registration** - ให้ company สร้าง profile เองได้
2. ✅ **Auto-link Company** - link user กับ company อัตโนมัติ
3. ✅ **Hide Company Dropdown** - ซ่อน dropdown ใน company/internships

### Priority 2: High (แก้ให้เร็ว)
4. ✅ **Admin: Company Dropdown** - เปลี่ยนจาก UUID เป็น dropdown
5. ✅ **Staff: Quick Create Company User** - สร้าง user พร้อม link company
6. ✅ **Advisor: Student Assignment** - assign advisor กับ student

### Priority 3: Medium (แก้ตามได้)
7. ⏳ **Application Timeline** - แสดง timeline และ next step
8. ⏳ **Notifications** - แจ้งเตือนเมื่อสถานะเปลี่ยน
9. ⏳ **Dashboard Improvements** - ปรับปรุง dashboard ให้ชัดเจน

---

## 📝 รายละเอียดการแก้ไข

### 1. Company Self-Registration ✅

**เพิ่มหน้า**: `/company/profile/setup`

**Flow**:
```
1. User สมัครด้วย role COMPANY
2. Login ครั้งแรก → redirect ไป /company/profile/setup
3. กรอกข้อมูล company (name, industry, location, etc.)
4. กด "สร้าง Company" → auto-link user.companyId
5. Redirect ไป /company/internships
```

**Benefits**:
- ไม่ต้องรอ Admin
- ใช้งานได้ทันที
- UX ดีขึ้นมาก

---

### 2. Hide Company Dropdown ✅

**แก้ไข**: `company/internships/page.js`

**เปลี่ยนจาก**:
```jsx
<select value={form.companyId}>
  {companies.map(c => <option>{c.name}</option>)}
</select>
```

**เป็น**:
```jsx
{currentUser?.companyId ? (
  <div className="info-box">
    <label>บริษัท</label>
    <p>{currentCompany?.name}</p>
  </div>
) : (
  <div className="alert alert-warning">
    กรุณาสร้าง Company Profile ก่อน
    <button onClick={() => router.push('/company/profile/setup')}>
      สร้าง Profile
    </button>
  </div>
)}
```

---

### 3. Admin: Company Dropdown ✅

**แก้ไข**: `admin/users/page.js`

**เปลี่ยนจาก**:
```jsx
<input 
  type="text" 
  placeholder="Company UUID"
  value={form.companyId}
/>
```

**เป็น**:
```jsx
<select value={form.companyId}>
  <option value="">-- ไม่มี Company --</option>
  {companies.map(c => (
    <option key={c.id} value={c.id}>{c.name}</option>
  ))}
</select>
```

---

### 4. Staff: Quick Create Company User ✅

**แก้ไข**: `staff/companies/page.js`

**เพิ่ม**:
```jsx
<button onClick={() => createCompanyUser(company.id)}>
  <i className="fas fa-user-plus"></i>
  สร้าง User สำหรับ Company นี้
</button>
```

**Function**:
```javascript
const createCompanyUser = async (companyId) => {
  const username = prompt("Username:");
  const password = prompt("Password:");
  
  await api.createUser({
    username,
    password,
    displayName: company.name + " User",
    roles: ["COMPANY"],
    companyId: companyId
  });
  
  alert("สร้าง User สำเร็จ!");
};
```

---

### 5. Advisor: Student Assignment ✅

**เพิ่ม**: `advisorId` ใน User model

**เพิ่มหน้า**: `staff/assign-advisor`

**Flow**:
```
1. Staff เลือก Student
2. เลือก Advisor
3. กด "Assign" → update student.advisorId
4. Advisor จะเห็นเฉพาะ students ที่ assigned
```

---

## 🚀 Implementation Plan

### Phase 1: Critical Fixes (วันนี้)
- [x] เพิ่ม COMPANY role ใน RoleType
- [x] เพิ่ม companyId ใน User model
- [x] สร้าง migration V9
- [ ] สร้างหน้า Company Profile Setup
- [ ] ซ่อน Company Dropdown
- [ ] เปลี่ยน Admin User Form เป็น Dropdown

### Phase 2: High Priority (พรุ่งนี้)
- [ ] เพิ่ม Quick Create Company User
- [ ] เพิ่ม advisorId ใน User model
- [ ] สร้างหน้า Assign Advisor
- [ ] Filter students by advisor

### Phase 3: Medium Priority (สัปดาห์หน้า)
- [ ] Application Timeline
- [ ] Notifications
- [ ] Dashboard Improvements

---

## 📊 Expected Results

### Before (ปัจจุบัน)
- Company ใช้งานไม่ได้ทันที ❌
- ต้องรอ Admin setup ❌
- Dropdown สับสน ❌
- ต้องจำ UUID ❌
- Advisor เห็นนักศึกษาทั้งหมด ❌

### After (หลังแก้)
- Company ใช้งานได้ทันที ✅
- ไม่ต้องรอ Admin ✅
- UI ชัดเจน ✅
- Dropdown ง่าย ✅
- Advisor เห็นเฉพาะนักศึกษาของตัวเอง ✅

---

## 💡 Key Principles

1. **Self-Service** - ให้ user ทำเองได้มากที่สุด
2. **No Cross-Role Dependencies** - แต่ละ role ทำงานได้เอง
3. **Clear UI** - ไม่สับสน ไม่ต้องเดา
4. **Minimal Steps** - ลดขั้นตอนให้น้อยที่สุด
5. **Instant Feedback** - แสดงผลทันที มี loading states

---

**สรุป**: ปัญหาหลักคือ **Dependencies ระหว่าง Roles** และ **UI ที่สับสน** แก้โดยให้แต่ละ Role **ทำงานได้เอง** และ **UI ชัดเจน**
