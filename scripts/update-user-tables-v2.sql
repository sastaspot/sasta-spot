-- Update users table to support email verification and social login
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);

-- Create social accounts table for multiple providers
CREATE TABLE IF NOT EXISTS social_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_email VARCHAR(100),
  provider_name VARCHAR(100),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id)
);

-- Update user analytics to track registration methods
ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS email_registrations INTEGER DEFAULT 0;
ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS google_registrations INTEGER DEFAULT 0;
ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS facebook_registrations INTEGER DEFAULT 0;
ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS verified_users INTEGER DEFAULT 0;
ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS unverified_users INTEGER DEFAULT 0;

-- Create email verification log table
CREATE TABLE IF NOT EXISTS email_verification_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(100) NOT NULL,
  token VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  is_verified BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_provider ON social_accounts(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_log(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_user ON email_verification_log(user_id);

-- Function to clean up expired verification tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET verification_token = NULL, 
      token_expiry = NULL 
  WHERE token_expiry < CURRENT_TIMESTAMP 
    AND verification_token IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired tokens (run daily)
-- Note: This would typically be set up as a cron job or scheduled task
