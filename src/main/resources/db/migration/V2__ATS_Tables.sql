CREATE TABLE IF NOT EXISTS application_status_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by UUID REFERENCES users(id),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    match_score INT NOT NULL,
    screening_summary TEXT,
    skills_detected TEXT,
    evaluation_date TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add missing columns to applications if needed (ATS expansion)
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_name VARCHAR(255);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_student_id VARCHAR(50);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_faculty VARCHAR(120);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_major VARCHAR(120);
