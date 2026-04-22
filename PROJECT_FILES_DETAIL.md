# 📖 คำอธิบายไฟล์และโฟลเดอร์แบบละเอียด (Full Project Manifest)

เอกสารฉบับนี้อธิบายหน้าที่และการทำงานของไฟล์ทุกไฟล์ในโปรเจกต์ UTCC-TP เพื่อความเข้าใจในการพัฒนาต่อยอด

---

## ⚙️ ระบบหลังบ้าน (Backend - Java Spring Boot)

### 📦 แพ็กเกจ: `org.example.utcctp`

#### 1. คอนโทรลเลอร์ (api/) - จุดรับส่งข้อมูล REST API
- **`AdminController.java`**: จัดการงานระบบ เช่น การดู Audit Logs (ประวัติการใช้งาน)
- **`AnalyticsController.java`**: คำนวณสถิติเพื่อนำไปแสดงผลใน Dashboard (เช่น อัตราการได้งาน)
- **`ApplicationController.java`**: จัดการการสมัครงานของนักศึกษา (ยื่นใบสมัคร, เปลี่ยนสถานะ)
- **`AuthController.java`**: ระบบ Login, Signup และการขอรหัส OTP
- **`BookmarkController.java`**: ระบบบันทึกงานที่สนใจ (Save Jobs)
- **`CompanyController.java`**: จัดการข้อมูลบริษัทและประกาศรับสมัครงาน
- **`FileController.java`**: จัดการการอัปโหลดและดาวน์โหลดไฟล์ (Resume, Transcript)
- **`InternshipController.java`**: ค้นหาตำแหน่งงานฝึกงานและรายละเอียดงาน
- **`InterviewController.java`**: ระบบนัดสัมภาษณ์และแจ้งเตือนผ่าน n8n
- **`NotificationController.java`**: ระบบแจ้งเตือนแบบ Real-time (SSE)
- **`ReportController.java`**: จัดการการส่งรายงานประจำสัปดาห์และการตรวจรายงาน
- **`UserController.java`**: จัดการโปรไฟล์ผู้ใช้และข้อมูลส่วนตัว

#### 2. ระบบยืนยันตัวตน (auth/)
- **`AuthService.java`**: ตรวจสอบรหัสผ่านและสร้าง JWT Token
- **`JwtService.java`**: สร้างและถอดรหัส Token สำหรับความปลอดภัย
- **`OtpCodeService.java`**: สร้างและตรวจสอบรหัส OTP 6 หลัก
- **`PasswordResetService.java`**: จัดการการลืมรหัสผ่าน
- **`SignupService.java`**: จัดการการลงทะเบียนผู้ใช้ใหม่ตาม Role

#### 3. โมเดลข้อมูล (model/) - โครงสร้างฐานข้อมูล
- **`User.java`**: ตารางผู้ใช้ (รองรับ STUDENT, ADVISOR, COMPANY, ADMIN)
- **`InternshipPosition.java`**: ตารางประกาศรับสมัครงาน
- **`Application.java`**: ตารางใบสมัครงานและข้อมูลประกอบ
- **`ApplicationStatusLog.java`**: ตารางประวัติการเปลี่ยนสถานะใบสมัคร (Audit Trail)
- **`AuditLog.java`**: ตารางบันทึกการกระทำสำคัญในระบบ
- **`ChatMessage.java`**: ตารางเก็บประวัติการคุยกับ AI และผู้ใช้
- **`Interview.java`**: ตารางนัดหมายสัมภาษณ์
- **`Report.java`**: ตารางส่งงานและรายงานประจำสัปดาห์

#### 4. ส่วนเชื่อมต่อฐานข้อมูล (repository/)
- ทำหน้าที่เป็น Interface สำหรับดึงข้อมูลจาก PostgreSQL โดยตรง (เช่น `UserRepository`, `ApplicationRepository`)

#### 5. บริการทางธุรกิจ (service/) - หัวใจหลัก
- **`ApplicationService.java`**: ควบคุม Workflow การสมัครงานทั้งหมด
- **`ReportService.java`**: จัดการการส่งและตรวจรายงานฝึกงาน
- **`OfferService.java`**: จัดการการส่งข้อเสนอเข้าทำงาน (Job Offer)
- **`TripService.java`**: ระบบจัดการการเดินทางเพื่อนิเทศงาน

#### 6. ระบบอัตโนมัติและแจ้งเตือน (notification/)
- **`WebhookService.java`**: ส่งข้อมูลไปยัง n8n (OTP, แจ้งเตือนสถานะ, นัดสัมภาษณ์)
- **`EmailService.java`**: จัดการการส่งอีเมลผ่าน Resend
- **`NotificationService.java`**: ระบบแจ้งเตือนภายในหน้าเว็บ

#### 7. ระบบจัดเก็บไฟล์ (storage/)
- **`FileService.java`**: ตัวกลางจัดการไฟล์
- **`CloudinaryStorageProvider.java`**: เชื่อมต่อกับ Cloudinary (Production)
- **`LocalStorageProvider.java`**: เก็บไฟล์ในเครื่อง (Development)

---

## 💻 ระบบหน้าบ้าน (Frontend - Next.js)

### 📦 โครงสร้างหลักใน `app/`

- **`(app)/student/`**: หน้า Dashboards และเมนูสำหรับนักศึกษา
- **`(app)/company/`**: หน้าจัดการประกาศงานและคัดเลือกคนสำหรับบริษัท
- **`(app)/advisor/`**: หน้าติดตามเด็กฝึกงานและตรวจรายงานสำหรับอาจารย์
- **`auth/login/`**: หน้าเข้าสู่ระบบ (ออกแบบด้วย Glassmorphism)
- **`signup/verify/`**: หน้ากรอกรหัส OTP หลังจากสมัครสมาชิก
- **`api/chat/route.js`**: จุดเชื่อมต่อระหว่างหน้าเว็บกับระบบ AI

### 📦 ส่วนประกอบ (components/)
- **`ApplicationForm.js`**: แบบฟอร์มสมัครงานที่ซับซ้อนที่สุด (มีการจัดการ State หลายขั้นตอน)
- **`NexusChat.js`**: กล่องแชท AI ที่รองรับการถามตอบแบบ Real-time
- **`RoleDashboardShell.js`**: ตัวคุม Layout หลักที่เปลี่ยน Sidebar ตามสิทธิ์ผู้ใช้
- **`ApplicationTimeline.js`**: แสดงประวัติสถานะการสมัครงาน (Timeline)

### 📦 ไลบรารี (lib/)
- **`api.js`**: ตั้งค่า Axios ให้ส่ง Token อัตโนมัติและดักจับ Error 401 (Unauthorized)
- **`statusConfig.js`**: กำหนดธีมสีของสถานะต่างๆ เพื่อให้หน้าเว็บดูเป็นไปในทิศทางเดียวกัน

---

## 🛠️ ไฟล์ตั้งค่าระบบ (Core Config)
- **`pom.xml`**: จัดการ Dependencies ของ Java (Spring Boot, JWT, Flyway)
- **`application.properties`**: ตั้งค่าพอร์ต, ฐานข้อมูล, และ URL ของ n8n
- **`render.yaml`**: ไฟล์สำหรับสั่ง Deploy ขึ้น Render Cloud อัตโนมัติ
- **`vercel.json`**: ไฟล์ตั้งค่าการ Deploy Frontend ขึ้น Vercel
- **`Dockerfile`**: คำสั่งสร้าง Container สำหรับระบบหลังบ้าน
