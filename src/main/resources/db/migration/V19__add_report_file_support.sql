-- Add file upload support to reports table
ALTER TABLE reports ADD COLUMN file_name VARCHAR(255);
ALTER TABLE reports ADD COLUMN file_path VARCHAR(500);
ALTER TABLE reports ADD COLUMN file_size BIGINT;
ALTER TABLE reports ADD COLUMN file_type VARCHAR(100);
ALTER TABLE reports ADD COLUMN uploaded_at TIMESTAMP;

-- Create index for file queries
CREATE INDEX idx_reports_file_name ON reports(file_name);
