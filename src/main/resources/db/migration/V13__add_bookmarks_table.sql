-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    internship_id BIGINT NOT NULL REFERENCES internship_positions(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, internship_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_internship_id ON bookmarks(internship_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Add comment
COMMENT ON TABLE bookmarks IS 'User saved/bookmarked internship positions';
