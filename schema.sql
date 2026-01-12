CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  stripe_account_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  ciphertext BYTEA NOT NULL,
  nonce BYTEA NOT NULL,
  salt BYTEA NOT NULL,
  hash BYTEA NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_messages_user_session ON messages(user_id, session_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Game states table
CREATE TABLE game_states (
  user_id VARCHAR(50) PRIMARY KEY,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  statistics JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diagnostic events table
CREATE TABLE diagnostic_events (
  event_id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  query JSONB NOT NULL,
  vehicle JSONB NOT NULL,
  agents JSONB NOT NULL,
  consensus JSONB NOT NULL,
  decision JSONB NOT NULL,
  safety_flags JSONB DEFAULT '[]',
  xp_earned INT DEFAULT 0,
  achievements_unlocked JSONB DEFAULT '[]',
  user_feedback JSONB
);

CREATE INDEX idx_diagnostic_events_user_id ON diagnostic_events(user_id);
CREATE INDEX idx_diagnostic_events_timestamp ON diagnostic_events(timestamp DESC);

-- Marketplace listings table
CREATE TABLE marketplace_listings (
  product_id VARCHAR(100) PRIMARY KEY,
  seller_id VARCHAR(50),
  diagram_id VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  tags JSONB DEFAULT '[]',
  sales_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_price ON marketplace_listings(price);

-- Revenue events table
CREATE TABLE revenue_events (
  event_id VARCHAR(100) PRIMARY KEY,
  user_id VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  net_amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,
  subscription JSONB,
  marketplace JSONB,
  payment_method JSONB,
  stripe JSONB,
  metadata JSONB
);

CREATE INDEX idx_revenue_events_user_id ON revenue_events(user_id);
CREATE INDEX idx_revenue_events_timestamp ON revenue_events(timestamp DESC);
CREATE INDEX idx_revenue_events_type ON revenue_events(event_type);

-- Payout queue table
CREATE TABLE payout_queue (
  id SERIAL PRIMARY KEY,
  seller_id VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  revenue_event_id VARCHAR(100),
  scheduled_date DATE NOT NULL,
  processed_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_transfer_id VARCHAR(255),
  error_message TEXT,
  UNIQUE(seller_id, scheduled_date)
);

CREATE INDEX idx_payout_queue_seller ON payout_queue(seller_id);
CREATE INDEX idx_payout_queue_status ON payout_queue(status);
CREATE INDEX idx_payout_queue_scheduled ON payout_queue(scheduled_date);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending'
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
