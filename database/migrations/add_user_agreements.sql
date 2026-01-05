-- Migration: Add User Agreements Table
-- Purpose: Track legal disclaimer acceptance for compliance
-- Date: January 5, 2026

-- Create user_agreements table to track disclaimer acceptance
CREATE TABLE IF NOT EXISTS user_agreements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    disclaimer_type VARCHAR(50) NOT NULL, -- 'diagnostic', 'terms_of_service', 'privacy_policy'
    version VARCHAR(20) NOT NULL, -- '1.0.0'
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET, -- User's IP address at time of acceptance
    user_agent TEXT, -- Browser/device information
    UNIQUE(user_id, disclaimer_type, version)
);

-- Create index for faster lookups
CREATE INDEX idx_user_agreements_user_id ON user_agreements(user_id);
CREATE INDEX idx_user_agreements_type ON user_agreements(disclaimer_type);
CREATE INDEX idx_user_agreements_accepted_at ON user_agreements(accepted_at);

-- Add comments for documentation
COMMENT ON TABLE user_agreements IS 'Tracks user acceptance of legal disclaimers and terms';
COMMENT ON COLUMN user_agreements.disclaimer_type IS 'Type of agreement: diagnostic, terms_of_service, privacy_policy';
COMMENT ON COLUMN user_agreements.version IS 'Version of the disclaimer that was accepted (semver format)';
COMMENT ON COLUMN user_agreements.ip_address IS 'IP address of user when accepting (for audit trail)';
COMMENT ON COLUMN user_agreements.user_agent IS 'Browser/device user agent string (for audit trail)';

-- Grant permissions (adjust based on your database user)
-- GRANT SELECT, INSERT ON user_agreements TO ridewire_user;
-- GRANT USAGE, SELECT ON SEQUENCE user_agreements_id_seq TO ridewire_user;
