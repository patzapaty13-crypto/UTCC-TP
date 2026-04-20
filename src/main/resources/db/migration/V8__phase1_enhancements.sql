-- Phase 1 Enhancements: Add new fields to applications table
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(120),
ADD COLUMN IF NOT EXISTS address VARCHAR(500),
ADD COLUMN IF NOT EXISTS gpa DECIMAL(3, 2),
ADD COLUMN IF NOT EXISTS student_year INTEGER,
ADD COLUMN IF NOT EXISTS cover_letter TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

-- Add indexes for common queries on applications
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_position_id ON applications(internship_position_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

-- Phase 1 Enhancements: Add new fields to internship_positions table
ALTER TABLE internship_positions
ADD COLUMN IF NOT EXISTS salary_min DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS salary_max DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS application_deadline DATE,
ADD COLUMN IF NOT EXISTS benefits TEXT,
ADD COLUMN IF NOT EXISTS internship_type VARCHAR(30),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(120),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS contact_line VARCHAR(100);

-- Add indexes for internship_positions
CREATE INDEX IF NOT EXISTS idx_internship_positions_application_deadline ON internship_positions(application_deadline);
CREATE INDEX IF NOT EXISTS idx_internship_positions_start_date ON internship_positions(start_date);
CREATE INDEX IF NOT EXISTS idx_internship_positions_status ON internship_positions(status);
