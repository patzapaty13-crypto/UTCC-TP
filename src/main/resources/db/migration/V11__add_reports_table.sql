-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    internship_id BIGINT REFERENCES internship_positions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('WEEKLY', 'MONTHLY', 'FINAL')),
    week_number INTEGER,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'GRADED', 'NEEDS_REVISION')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    feedback TEXT,
    achievements TEXT,
    challenges TEXT,
    learnings TEXT,
    next_week_plan TEXT,
    submitted_at TIMESTAMP,
    graded_at TIMESTAMP,
    graded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_reports_student_id ON reports(student_id);
CREATE INDEX idx_reports_internship_id ON reports(internship_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_graded_by ON reports(graded_by);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Add comment
COMMENT ON TABLE reports IS 'Student internship reports (weekly, monthly, final)';
