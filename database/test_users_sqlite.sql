-- Тестові користувачі для SQLite
-- Пароль для всіх: Test123456
-- Хеш: $2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO

-- Тестовий користувач (User)
INSERT OR IGNORE INTO users (email, password_hash, role_id, auth_provider, is_active) VALUES
('user@test.com', '$2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO', 
 (SELECT role_id FROM roles WHERE role_name = 'User'), 'local', 1);

-- Отримуємо user_id для створення профілю
INSERT OR IGNORE INTO user_profiles (user_id, first_name, last_name, language_pref) 
SELECT user_id, 'Test', 'User', 'uk' FROM users WHERE email = 'user@test.com';

-- Тестовий адмін
INSERT OR IGNORE INTO users (email, password_hash, role_id, auth_provider, is_active) VALUES
('admin@test.com', '$2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO', 
 (SELECT role_id FROM roles WHERE role_name = 'Admin'), 'local', 1);

INSERT OR IGNORE INTO user_profiles (user_id, first_name, last_name, language_pref) 
SELECT user_id, 'Admin', 'User', 'uk' FROM users WHERE email = 'admin@test.com';

-- Тестовий Support
INSERT OR IGNORE INTO users (email, password_hash, role_id, auth_provider, is_active) VALUES
('support@test.com', '$2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO', 
 (SELECT role_id FROM roles WHERE role_name = 'Support'), 'local', 1);

INSERT OR IGNORE INTO user_profiles (user_id, first_name, last_name, language_pref) 
SELECT user_id, 'Support', 'User', 'uk' FROM users WHERE email = 'support@test.com';

