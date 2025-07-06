-- Fix admin password in database
-- Run this in Neon SQL Editor

-- Update admin password (you can change 'newpassword123' to your desired password)
UPDATE admin_users 
SET password_hash = 'newpassword123'  -- For now using plain text, enhance with bcrypt later
WHERE username = 'admin';

-- Verify the update
SELECT username, password_hash, created_at FROM admin_users WHERE username = 'admin';
