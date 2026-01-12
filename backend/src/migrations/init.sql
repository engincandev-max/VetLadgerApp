-- Veritabanı tabloları
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  invite_code VARCHAR(6) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS animals (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ear_tag VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  age INTEGER,
  gender VARCHAR(10),
  is_pregnant BOOLEAN DEFAULT FALSE,
  pregnancy_status VARCHAR(20),
  last_insemination_date DATE,
  expected_birth_date DATE,
  semen_info VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler (Performance)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_animals_owner_id ON animals(owner_id);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);
CREATE INDEX IF NOT EXISTS idx_animals_pregnant ON animals(is_pregnant);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_animal_id ON transactions(animal_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Varsayılan veteriner hesabı (Şifre: admin123)
INSERT INTO users (name, role, status, password_hash) 
VALUES (
  'Veteriner Admin', 
  'vet', 
  'active', 
  '$2a$10$YourHashedPasswordHere'
) ON CONFLICT DO NOTHING;

-- Test müşteri verileri (Opsiyonel)
-- INSERT INTO users (name, phone, address, role, status) 
-- VALUES ('Test Müşteri', '05551234567', 'Test Köy', 'customer', 'active');

COMMENT ON TABLE users IS 'Kullanıcı ve müşteri bilgileri';
COMMENT ON TABLE animals IS 'Hayvan kayıtları ve gebelik takibi';
COMMENT ON TABLE transactions IS 'Finansal işlem kayıtları';