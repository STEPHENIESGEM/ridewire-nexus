CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
