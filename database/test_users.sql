-- Тестові користувачі для AI Tourism Companion
-- Паролі захешовані через bcrypt: Test123456

USE ai_tourism_companion;

-- Тестовий користувач (User)
INSERT INTO users (email, password_hash, role_id, auth_provider, is_active) VALUES
('user@test.com', '$2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO', 
 (SELECT role_id FROM roles WHERE role_name = 'User'), 'local', TRUE)
ON DUPLICATE KEY UPDATE email=email;

-- Отримуємо user_id для створення профілю
SET @user_id = (SELECT user_id FROM users WHERE email = 'user@test.com');

-- Створюємо профіль
INSERT INTO user_profiles (user_id, first_name, last_name, language_pref) VALUES
(@user_id, 'Test', 'User', 'uk')
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Тестовий адмін
INSERT INTO users (email, password_hash, role_id, auth_provider, is_active) VALUES
('admin@test.com', '$2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO', 
 (SELECT role_id FROM roles WHERE role_name = 'Admin'), 'local', TRUE)
ON DUPLICATE KEY UPDATE email=email;

SET @admin_id = (SELECT user_id FROM users WHERE email = 'admin@test.com');

INSERT INTO user_profiles (user_id, first_name, last_name, language_pref) VALUES
(@admin_id, 'Admin', 'User', 'uk')
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Тестовий Support
INSERT INTO users (email, password_hash, role_id, auth_provider, is_active) VALUES
('support@test.com', '$2a$10$BaWiG3a2iVCofVp7xiZ1YOrR4wZDMHV64ejsQljNwOGJ.aWG6rbLO', 
 (SELECT role_id FROM roles WHERE role_name = 'Support'), 'local', TRUE)
ON DUPLICATE KEY UPDATE email=email;

SET @support_id = (SELECT user_id FROM users WHERE email = 'support@test.com');

INSERT INTO user_profiles (user_id, first_name, last_name, language_pref) VALUES
(@support_id, 'Support', 'User', 'uk')
ON DUPLICATE KEY UPDATE user_id=user_id;

