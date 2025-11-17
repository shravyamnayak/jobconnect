-- Database initialization script (optional - Spring Boot will create tables automatically)
-- This file runs automatically when PostgreSQL container starts for the first time

-- Create database if not exists (this is handled by docker-compose)
-- CREATE DATABASE IF NOT EXISTS jobconnect;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert default roles
INSERT INTO roles (name) VALUES ('ADMIN'), ('RECRUITER'), ('SEEKER')
ON CONFLICT (name) DO NOTHING;

-- Insert a default admin user (password: admin123)
-- Password is bcrypt encoded version of 'admin123'
INSERT INTO users (email, password, full_name, enabled, created_at, updated_at)
VALUES ('admin@jobconnect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@jobconnect.com' AND r.name = 'ADMIN'
ON CONFLICT DO NOTHING;