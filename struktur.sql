-- ENUM Types
CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'closed');

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ticket Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

-- Ticket Priorities
CREATE TABLE priorities (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20) UNIQUE
);

-- Tickets
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  status ticket_status DEFAULT 'open',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  priority_id INTEGER REFERENCES priorities(id),
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reference_code VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ticket Replies / Discussion Logs
CREATE TABLE ticket_replies (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attachments (Optional)
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ticket_status ON tickets(status);
CREATE INDEX idx_ticket_user ON tickets(user_id);
CREATE INDEX idx_ticket_assigned_to ON tickets(assigned_to);