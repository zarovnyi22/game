-- Створення бази даних (якщо не існує)
CREATE DATABASE IF NOT EXISTS ai_tourism_companion
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ai_tourism_companion;

-- ========================================================
-- МОДУЛЬ 1: КОРИСТУВАЧІ ТА РОЛІ (Identity & Access)
-- ========================================================

-- 1. Таблиця Ролей
CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE, -- 'User', 'Admin', 'Analyst', 'Support'
    permissions JSON NULL, -- Зберігає права доступу у форматі JSON: {"can_ban": true}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ;

-- 2. Таблиця Користувачів
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL, -- NULL для користувачів, що зайшли через Google/FB
    role_id INT NOT NULL,
    auth_provider ENUM('local', 'google', 'apple', 'facebook') DEFAULT 'local',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
);

-- 3. Таблиця Профілів (Розширена інфо)
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE, -- Зв'язок 1:1
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    avatar_url VARCHAR(500),
    cultural_preferences JSON, -- Наприклад: ["history", "art", "nightlife"]
    language_pref VARCHAR(10) DEFAULT 'uk', -- Код мови: 'uk', 'en'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ;

-- 4. Таблиця Біометрії (Дані з годинників)
CREATE TABLE IF NOT EXISTS biometric_data (
    bio_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    heart_rate INT,
    stress_level INT COMMENT 'Оцінка від 1 до 100',
    device_source VARCHAR(100), -- 'Apple Watch Series 8', 'Garmin'
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ;

-- ========================================================
-- МОДУЛЬ 2: ТУРИЗМ, ЛОКАЦІЇ ТА AR (Core Content)
-- ========================================================

-- 5. Таблиця Безпеки Районів (AI Safety Advisor)
CREATE TABLE IF NOT EXISTS safety_ratings (
    safety_id INT AUTO_INCREMENT PRIMARY KEY,
    district_name VARCHAR(150) NOT NULL,
    geo_polygon JSON, -- Масив координат, що окреслює район: [[lat,lng], [lat,lng]...]
    safety_score INT DEFAULT 100 COMMENT '0 - небезпечно, 100 - безпечно',
    threat_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ;

-- 6. Таблиця Локацій (POI - Points of Interest)
CREATE TABLE IF NOT EXISTS locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,  -- Точність координат
    longitude DECIMAL(11, 8) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Museum', 'Park', 'Restaurant'
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    is_safe BOOLEAN DEFAULT TRUE,
    safety_zone_id INT NULL, -- До якого району безпеки відноситься
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (safety_zone_id) REFERENCES safety_ratings(safety_id) ON DELETE SET NULL,
    INDEX idx_geo (latitude, longitude) -- Індекс для швидкого пошуку по карті
) ;

-- 7. Таблиця Подій (Events)
CREATE TABLE IF NOT EXISTS events (
    event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_id BIGINT NULL, -- Може бути NULL, якщо подія на вулиці без прив'язки до закладу
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'UAH',
    category VARCHAR(50), -- 'Concert', 'Exhibition'
    source_url VARCHAR(500), -- Звідки AI взяв інфо
    
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
) ;

-- 8. Таблиця AR Контенту (ChronoTourism)
CREATE TABLE IF NOT EXISTS ar_content (
    ar_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_id BIGINT NOT NULL,
    era_name VARCHAR(100) NOT NULL, -- 'Kyiv Rus 11th Century'
    model_url VARCHAR(500) NOT NULL, -- Посилання на файл .glb/.usdz
    trigger_marker JSON, -- Дані для розпізнавання (зображення або координати)
    description_historical TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

USE ai_tourism_companion;

-- ========================================================
-- МОДУЛЬ 3: МАРШРУТИ ТА НАВІГАЦІЯ (AI Adaptive Route Builder)
-- ========================================================

-- 9. Таблиця Маршрутів
-- Зберігає загальну інформацію про заплановану подорож
CREATE TABLE IF NOT EXISTS routes (
    route_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) DEFAULT 'Мій маршрут',
    status ENUM('planned', 'active', 'completed', 'cancelled') DEFAULT 'planned',
    total_distance_km DECIMAL(6, 2) COMMENT 'Загальна дистанція у км',
    estimated_duration_min INT COMMENT 'Орієнтовний час у хвилинах',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ;

-- 10. Таблиця Точок Маршруту (Waypoints)
-- Деталізація маршруту: куди саме заходимо і в якому порядку
CREATE TABLE IF NOT EXISTS route_waypoints (
    waypoint_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    location_id BIGINT NULL, -- Може бути локація
    event_id BIGINT NULL,    -- Або подія
    sequence_order INT NOT NULL COMMENT 'Порядок відвідування: 1, 2, 3...',
    arrival_time_est DATETIME COMMENT 'Очікуваний час прибуття',
    stay_duration_min INT DEFAULT 30 COMMENT 'Планований час перебування',
    
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL
) ;

-- 11. Таблиця Історії Навігації
-- Використовується Аналітиком для покращення рекомендацій
CREATE TABLE IF NOT EXISTS user_navigation_history (
    history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    visit_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visit_end TIMESTAMP NULL,
    rating_given INT NULL COMMENT 'Оцінка користувача після візиту (1-5)',
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
) ;

-- ========================================================
-- МОДУЛЬ 4: КОМЕРЦІЯ ТА БРОНЮВАННЯ (Finance)
-- ========================================================

-- 12. Таблиця Бронювань
-- Замовлення квитків на події або в локації
CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NULL,
    location_id BIGINT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UAH',
    status ENUM('pending', 'confirmed', 'cancelled', 'refunded') DEFAULT 'pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qr_code_data TEXT COMMENT 'Дані для генерації QR-квитка',
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
) ;

-- 13. Таблиця Платежів
-- Фіксація транзакцій (успішних та неуспішних)
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'google_pay', 'apple_pay', 'paypal') NOT NULL,
    transaction_ref VARCHAR(255) COMMENT 'ID транзакції від платіжного шлюзу (Stripe/LiqPay)',
    transaction_status ENUM('success', 'failed', 'processing') DEFAULT 'processing',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_transaction (transaction_ref) -- Для швидкого пошуку при розбірках з банком
) ;

USE ai_tourism_companion;

-- ========================================================
-- МОДУЛЬ 5: AI, ПЕРЕКЛАД ТА КОНФІГУРАЦІЯ (AI & Config)
-- ========================================================

-- 14. Таблиця Налаштувань Перекладу
-- Персоналізація для "Cultural Context Translator"
CREATE TABLE IF NOT EXISTS translation_settings (
    setting_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE, -- Один користувач = одні налаштування
    source_languages JSON COMMENT 'Список мов, які треба перекладати ["en", "de"]',
    target_language VARCHAR(10) DEFAULT 'uk',
    translation_style ENUM('formal', 'casual', 'historical', 'humorous') DEFAULT 'casual',
    voice_mode BOOLEAN DEFAULT FALSE COMMENT 'Чи озвучувати переклад у навушники',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ;

-- 15. Таблиця Конфігурації AI Промптів
-- Адміністратор налаштовує поведінку LLM тут
CREATE TABLE IF NOT EXISTS ai_prompts_config (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(50) NOT NULL, -- 'RouteBuilder', 'SafetyAdvisor', 'ChatBot'
    prompt_template TEXT NOT NULL COMMENT 'Системний промпт для LLM',
    model_version VARCHAR(50) DEFAULT 'gpt-4o',
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT NULL, -- ID адміна, що змінив промпт
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ;

-- 16. Таблиця Історії Чату (Chat Logs)
-- Зберігання діалогів для контексту та аналізу
CREATE TABLE IF NOT EXISTS chat_logs (
    message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(64) NOT NULL COMMENT 'UUID сесії розмови',
    role ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    tokens_used INT DEFAULT 0 COMMENT 'Для підрахунку витрат на API',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_session (session_id) -- Для швидкого завантаження історії чату
) ;

-- 17. Таблиця Інтеграцій (API Keys)
-- Керування ключами зовнішніх сервісів
CREATE TABLE IF NOT EXISTS integrations (
    integration_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(50) UNIQUE NOT NULL, -- 'GoogleMaps', 'OpenAI', 'WeatherAPI'
    api_key_encrypted VARCHAR(500) NOT NULL COMMENT 'Зашифрований ключ',
    status ENUM('active', 'disabled', 'error') DEFAULT 'active',
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT NULL
) ;

-- ========================================================
-- МОДУЛЬ 6: СИСТЕМНА ПІДТРИМКА ТА ЛОГИ (System & Support)
-- ========================================================

-- 18. Таблиця Тікетів Підтримки
-- Зворотній зв'язок від користувачів
CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL, -- Може бути NULL, якщо юзер видалився, але тікет залишився
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('bug', 'payment', 'account', 'content_error', 'other') NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ;

-- 19. Таблиця Системних Логів
-- Технічні логи для розробників
CREATE TABLE IF NOT EXISTS system_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('info', 'warning', 'error', 'critical') NOT NULL,
    component VARCHAR(100) NOT NULL, -- 'PaymentGateway', 'ARModule', 'RouteAlgorithm'
    message TEXT NOT NULL,
    stack_trace JSON NULL COMMENT 'Деталі помилки в JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_level_time (level, created_at) -- Для швидкого пошуку критичних помилок
) ;

-- 20. Таблиця Бекапів
-- Облік резервних копій (Use Case техпідтримки)
CREATE TABLE IF NOT EXISTS backups (
    backup_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    location_path VARCHAR(500) NOT NULL COMMENT 'S3 bucket або локальний шлях',
    size_bytes BIGINT NOT NULL,
    status ENUM('success', 'failed', 'in_progress') DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ;

-- 21. Таблиця Аналітичних Звітів
-- Готові звіти для бізнес-аналітика
CREATE TABLE IF NOT EXISTS analytics_reports (
    report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    report_type ENUM('revenue', 'user_behavior', 'route_popularity', 'system_health') NOT NULL,
    data_json JSON NOT NULL COMMENT 'Тіло звіту з графіками/числами',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ;

-- ========================================================
-- ПОЧАТКОВІ ДАНІ
-- ========================================================

-- Додаємо ролі
INSERT INTO roles (role_name, permissions) VALUES
('User', '{"can_book": true, "can_view_routes": true}'),
('Admin', '{"can_manage_all": true, "can_view_analytics": true}'),
('Support', '{"can_manage_tickets": true, "can_view_logs": true, "can_manage_backups": true}'),
('Analyst', '{"can_view_analytics": true, "can_export_data": true}')
ON DUPLICATE KEY UPDATE role_name=role_name;

