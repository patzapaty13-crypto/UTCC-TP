-- Full role-based internship system expansion (production-ready baseline)

-- ------------------------------------------------------------
-- Roles / Permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(120) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(30) NOT NULL,
    permission_code VARCHAR(120) NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_code)
);

-- ------------------------------------------------------------
-- Profile extensions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(30),
    gpa DECIMAL(4,2),
    skills TEXT,
    expected_graduation_date DATE,
    preferred_locations TEXT,
    preferred_work_modes TEXT,
    emergency_contact_name VARCHAR(120),
    emergency_contact_phone VARCHAR(30),
    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_profiles (
    company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
    website_url VARCHAR(255),
    logo_url TEXT,
    company_size VARCHAR(50),
    description TEXT,
    benefits TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_role VARCHAR(40) NOT NULL DEFAULT 'RECRUITER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, user_id)
);

-- ------------------------------------------------------------
-- Internship posting enhancements
-- ------------------------------------------------------------
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS internship_type VARCHAR(30);
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS allowance_amount NUMERIC(12,2);
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS allowance_currency VARCHAR(10) DEFAULT 'THB';
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMP;
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS contact_email VARCHAR(120);
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS recruiter_user_id UUID REFERENCES users(id);
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE internship_positions ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP;

-- ------------------------------------------------------------
-- Applications / workflow enhancements
-- ------------------------------------------------------------
ALTER TABLE applications ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMP;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS last_status_at TIMESTAMP;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS source VARCHAR(40) DEFAULT 'PLATFORM';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS review_note TEXT;

CREATE TABLE IF NOT EXISTS application_status_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by UUID REFERENCES users(id),
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES file_assets(id) ON DELETE CASCADE,
    doc_type VARCHAR(40) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Interviews / Offers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_by UUID REFERENCES users(id),
    interview_type VARCHAR(30) NOT NULL DEFAULT 'ONLINE',
    meeting_url TEXT,
    location TEXT,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id),
    score INT,
    strengths TEXT,
    concerns TEXT,
    recommendation VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    offered_by UUID REFERENCES users(id),
    title VARCHAR(200),
    allowance_amount NUMERIC(12,2),
    allowance_currency VARCHAR(10) DEFAULT 'THB',
    starts_on DATE,
    ends_on DATE,
    terms_text TEXT,
    response_deadline TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    responded_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Reports / supervision
-- ------------------------------------------------------------
ALTER TABLE reports ADD COLUMN IF NOT EXISTS report_type VARCHAR(30) DEFAULT 'WEEKLY';
ALTER TABLE reports ADD COLUMN IF NOT EXISTS week_no INT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS month_no INT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS due_at TIMESTAMP;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS student_advisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    advisor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, advisor_id)
);

-- ------------------------------------------------------------
-- Session / auth hardening
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_exp ON refresh_tokens(expires_at);

-- ------------------------------------------------------------
-- Notification & audit extension
-- ------------------------------------------------------------
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS channel VARCHAR(20) DEFAULT 'IN_APP';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata_json TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'NORMAL';

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    actor_username VARCHAR(120),
    action VARCHAR(60) NOT NULL,
    resource_type VARCHAR(60) NOT NULL,
    resource_id VARCHAR(120),
    metadata_json TEXT,
    ip_address VARCHAR(60),
    user_agent VARCHAR(500),
    severity VARCHAR(20) DEFAULT 'INFO',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);

-- ------------------------------------------------------------
-- Helpful indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_internship_status_deadline ON internship_positions(status, application_deadline);
CREATE INDEX IF NOT EXISTS idx_internship_company ON internship_positions(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_created ON applications(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_position_status ON applications(internship_position_id, status);
CREATE INDEX IF NOT EXISTS idx_status_log_application_created ON application_status_log(application_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_offers_application ON offers(application_id);
CREATE INDEX IF NOT EXISTS idx_reports_student_submitted ON reports(student_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_advisors_advisor ON student_advisors(advisor_id);

-- ------------------------------------------------------------
-- Default permissions seeds (idempotent)
-- ------------------------------------------------------------
INSERT INTO permissions(code, description) VALUES
('internship.read', 'Read internship postings'),
('internship.write', 'Create and manage internship postings'),
('application.submit', 'Submit internship applications'),
('application.review', 'Review and update application statuses'),
('report.submit', 'Submit internship reports'),
('report.review', 'Review and grade internship reports'),
('company.verify', 'Verify company accounts'),
('admin.manage_users', 'Manage users and roles'),
('audit.read', 'Read audit logs')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions(role, permission_code) VALUES
('STUDENT', 'internship.read'),
('STUDENT', 'application.submit'),
('STUDENT', 'report.submit'),
('COMPANY', 'internship.read'),
('COMPANY', 'internship.write'),
('COMPANY', 'application.review'),
('ADVISOR', 'internship.read'),
('ADVISOR', 'report.review'),
('STAFF', 'internship.read'),
('STAFF', 'application.review'),
('STAFF', 'company.verify'),
('ADMIN', 'internship.read'),
('ADMIN', 'internship.write'),
('ADMIN', 'application.review'),
('ADMIN', 'report.review'),
('ADMIN', 'company.verify'),
('ADMIN', 'admin.manage_users'),
('ADMIN', 'audit.read')
ON CONFLICT (role, permission_code) DO NOTHING;
