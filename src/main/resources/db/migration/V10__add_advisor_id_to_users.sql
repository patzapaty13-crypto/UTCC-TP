-- V10: Add advisor_id to users table
-- This allows students to be assigned to specific advisors

ALTER TABLE users ADD COLUMN advisor_id UUID;

-- Add foreign key constraint (optional, but recommended)
-- ALTER TABLE users ADD CONSTRAINT fk_users_advisor FOREIGN KEY (advisor_id) REFERENCES users(id);

-- Sample data: Assign some students to advisor1 (if exists)
-- UPDATE users SET advisor_id = (SELECT id FROM users WHERE username = 'advisor1' LIMIT 1) 
-- WHERE id IN (SELECT id FROM users WHERE roles @> '["STUDENT"]' LIMIT 3);