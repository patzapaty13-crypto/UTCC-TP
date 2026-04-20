-- สร้าง Company และ User สำหรับทดสอบ
-- รันใน Supabase SQL Editor

-- 1. สร้าง Company
INSERT INTO companies (id, name, industry, location, status, contact_name, contact_email, created_at)
VALUES (
  gen_random_uuid(),
  'Global Tech Solutions',
  'Software Development',
  'Bangkok, Thailand',
  'ACTIVE',
  'HR Department',
  'hr@globaltech.com',
  NOW()
)
RETURNING id;

-- 2. คัดลอก UUID ที่ได้จากข้อ 1 แล้วแทนที่ใน <COMPANY_ID_HERE>

-- 3. สร้าง User สำหรับ Company (ถ้ายังไม่มี)
-- Password: pass123 (hashed with BCrypt)
INSERT INTO users (id, username, password_hash, display_name, email, active, email_verified, created_at, company_id)
VALUES (
  gen_random_uuid(),
  'company1',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- pass123
  'Global Tech HR',
  'company@globaltech.com',
  true,
  true,
  NOW(),
  '<COMPANY_ID_HERE>' -- แทนที่ด้วย UUID จากข้อ 1
);

-- 4. เพิ่ม Role COMPANY ให้ user
INSERT INTO user_roles (user_id, role)
SELECT id, 'COMPANY'
FROM users
WHERE username = 'company1';

-- 5. ตรวจสอบ
SELECT u.username, u.display_name, u.company_id, c.name as company_name
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
WHERE u.username = 'company1';
