-- Add category and doc_type to file_assets table
ALTER TABLE file_assets
ADD COLUMN category VARCHAR(50),
ADD COLUMN doc_type VARCHAR(50);

-- Create indexes for better query performance
CREATE INDEX idx_file_assets_category ON file_assets(category);
CREATE INDEX idx_file_assets_doc_type ON file_assets(doc_type);
CREATE INDEX idx_file_assets_uploaded_by_category ON file_assets(uploaded_by, category);
