-- Create interviews table
-- V16: Interview Management System

CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    position_id UUID NOT NULL REFERENCES internship_positions(id) ON DELETE CASCADE,
    
    -- Interview Details
    interview_type VARCHAR(50) NOT NULL DEFAULT 'IN_PERSON', -- IN_PERSON, VIDEO, PHONE
    interview_date TIMESTAMP,
    interview_duration INTEGER DEFAULT 60, -- minutes
    location TEXT,
    video_link TEXT,
    meeting_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED
    
    -- Interviewer Information
    interviewer_name VARCHAR(255),
    interviewer_email VARCHAR(255),
    interviewer_phone VARCHAR(50),
    
    -- Additional Information
    instructions TEXT,
    preparation_notes TEXT,
    feedback TEXT,
    rating INTEGER, -- 1-5
    
    -- Confirmation
    student_confirmed BOOLEAN DEFAULT FALSE,
    student_confirmed_at TIMESTAMP,
    company_confirmed BOOLEAN DEFAULT FALSE,
    company_confirmed_at TIMESTAMP,
    
    -- Reschedule
    reschedule_reason TEXT,
    reschedule_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES applications(id),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_position FOREIGN KEY (position_id) REFERENCES internship_positions(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_student ON interviews(student_id);
CREATE INDEX idx_interviews_company ON interviews(company_id);
CREATE INDEX idx_interviews_date ON interviews(interview_date);
CREATE INDEX idx_interviews_status ON interviews(status);

-- Add comments
COMMENT ON TABLE interviews IS 'Interview scheduling and management';
COMMENT ON COLUMN interviews.interview_type IS 'Type of interview: IN_PERSON, VIDEO, PHONE';
COMMENT ON COLUMN interviews.status IS 'Interview status: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED';
COMMENT ON COLUMN interviews.interview_duration IS 'Duration in minutes';
COMMENT ON COLUMN interviews.rating IS 'Interview rating from 1-5';
