-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  search_count INTEGER DEFAULT 0
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create search history table
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  query VARCHAR(255) NOT NULL,
  results_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create daily search limits for anonymous users
CREATE TABLE IF NOT EXISTS anonymous_search_limits (
  id SERIAL PRIMARY KEY,
  ip_address INET NOT NULL,
  search_date DATE NOT NULL,
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ip_address, search_date)
);

-- Create user analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  new_users INTEGER DEFAULT 0,
  total_searches INTEGER DEFAULT 0,
  anonymous_searches INTEGER DEFAULT 0,
  registered_searches INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_date ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_anonymous_limits_ip_date ON anonymous_search_limits(ip_address, search_date);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON user_analytics(date);

-- Create function to update user search count
CREATE OR REPLACE FUNCTION update_user_search_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE users 
    SET search_count = search_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user search count
CREATE TRIGGER trigger_update_user_search_count
  AFTER INSERT ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_search_count();
