-- SQLite версія бази даних для AI Tourism Companion
-- Використовується better-sqlite3

-- ========================================================
-- МОДУЛЬ 1: КОРИСТУВАЧІ ТА РОЛІ (Identity & Access)
-- ========================================================

-- 1. Таблиця Ролей
CREATE TABLE IF NOT EXISTS roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE,
    permissions TEXT, -- JSON як текст
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблиця Користувачів
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    role_id INTEGER NOT NULL,
    auth_provider TEXT DEFAULT 'local' CHECK(auth_provider IN ('local', 'google', 'apple', 'facebook')),
    is_active INTEGER DEFAULT 1, -- BOOLEAN як INTEGER (0/1)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
);

-- 3. Таблиця Профілів
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    gender TEXT CHECK(gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    avatar_url TEXT,
    cultural_preferences TEXT, -- JSON як текст
    language_pref TEXT DEFAULT 'uk',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Таблиця Біометрії
CREATE TABLE IF NOT EXISTS biometric_data (
    bio_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    heart_rate INTEGER,
    stress_level INTEGER,
    device_source TEXT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ========================================================
-- МОДУЛЬ 2: ТУРИЗМ, ЛОКАЦІЇ ТА AR (Core Content)
-- ========================================================

-- 5. Таблиця Безпеки Районів
CREATE TABLE IF NOT EXISTS safety_ratings (
    safety_id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_name TEXT NOT NULL,
    geo_polygon TEXT, -- JSON як текст
    safety_score INTEGER DEFAULT 100,
    threat_level TEXT DEFAULT 'low' CHECK(threat_level IN ('low', 'medium', 'high', 'critical')),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Таблиця Локацій
CREATE TABLE IF NOT EXISTS locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    type TEXT NOT NULL,
    average_rating REAL DEFAULT 0.00,
    is_safe INTEGER DEFAULT 1,
    safety_zone_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (safety_zone_id) REFERENCES safety_ratings(safety_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_geo ON locations(latitude, longitude);

-- 7. Таблиця Подій
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    price REAL DEFAULT 0.00,
    currency TEXT DEFAULT 'UAH',
    category TEXT,
    source_url TEXT,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
);

-- 8. Таблиця AR Контенту
CREATE TABLE IF NOT EXISTS ar_content (
    ar_id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER NOT NULL,
    era_name TEXT NOT NULL,
    model_url TEXT NOT NULL,
    trigger_marker TEXT, -- JSON як текст
    description_historical TEXT,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

-- ========================================================
-- МОДУЛЬ 3: МАРШРУТИ ТА НАВІГАЦІЯ
-- ========================================================

-- 9. Таблиця Маршрутів
CREATE TABLE IF NOT EXISTS routes (
    route_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT DEFAULT 'Мій маршрут',
    status TEXT DEFAULT 'planned' CHECK(status IN ('planned', 'active', 'completed', 'cancelled')),
    total_distance_km REAL,
    estimated_duration_min INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 10. Таблиця Точок Маршруту
CREATE TABLE IF NOT EXISTS route_waypoints (
    waypoint_id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id INTEGER NOT NULL,
    location_id INTEGER,
    event_id INTEGER,
    sequence_order INTEGER NOT NULL,
    arrival_time_est DATETIME,
    stay_duration_min INTEGER DEFAULT 30,
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL
);

-- 11. Таблиця Історії Навігації
CREATE TABLE IF NOT EXISTS user_navigation_history (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    visit_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    visit_end DATETIME,
    rating_given INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

-- ========================================================
-- МОДУЛЬ 4: КОМЕРЦІЯ ТА БРОНЮВАННЯ
-- ========================================================

-- 12. Таблиця Бронювань
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER,
    location_id INTEGER,
    quantity INTEGER DEFAULT 1,
    total_price REAL NOT NULL,
    currency TEXT DEFAULT 'UAH',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    qr_code_data TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
);

-- 13. Таблиця Платежів
CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('credit_card', 'google_pay', 'apple_pay', 'paypal')),
    transaction_ref TEXT,
    transaction_status TEXT DEFAULT 'processing' CHECK(transaction_status IN ('success', 'failed', 'processing')),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_transaction ON payments(transaction_ref);

-- ========================================================
-- МОДУЛЬ 5: AI, ПЕРЕКЛАД ТА КОНФІГУРАЦІЯ
-- ========================================================

-- 14. Таблиця Налаштувань Перекладу
CREATE TABLE IF NOT EXISTS translation_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    source_languages TEXT, -- JSON як текст
    target_language TEXT DEFAULT 'uk',
    translation_style TEXT DEFAULT 'casual' CHECK(translation_style IN ('formal', 'casual', 'historical', 'humorous')),
    voice_mode INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 15. Таблиця Конфігурації AI Промптів
CREATE TABLE IF NOT EXISTS ai_prompts_config (
    config_id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_name TEXT NOT NULL,
    prompt_template TEXT NOT NULL,
    model_version TEXT DEFAULT 'gpt-4o',
    is_active INTEGER DEFAULT 1,
    created_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 16. Таблиця Історії Чату
CREATE TABLE IF NOT EXISTS chat_logs (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session ON chat_logs(session_id);

-- 17. Таблиця Інтеграцій
CREATE TABLE IF NOT EXISTS integrations (
    integration_id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name TEXT UNIQUE NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'disabled', 'error')),
    last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT
);

-- ========================================================
-- МОДУЛЬ 6: СИСТЕМНА ПІДТРИМКА ТА ЛОГИ
-- ========================================================

-- 18. Таблиця Тікетів Підтримки
CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('bug', 'payment', 'account', 'content_error', 'other')),
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 19. Таблиця Системних Логів
CREATE TABLE IF NOT EXISTS system_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT NOT NULL CHECK(level IN ('info', 'warning', 'error', 'critical')),
    component TEXT NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT, -- JSON як текст
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_level_time ON system_logs(level, created_at);

-- 20. Таблиця Бекапів
CREATE TABLE IF NOT EXISTS backups (
    backup_id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL,
    location_path TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK(status IN ('success', 'failed', 'in_progress')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 21. Таблиця Аналітичних Звітів
CREATE TABLE IF NOT EXISTS analytics_reports (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK(report_type IN ('revenue', 'user_behavior', 'route_popularity', 'system_health')),
    data_json TEXT NOT NULL, -- JSON як текст
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- ПОЧАТКОВІ ДАНІ
-- ========================================================

INSERT OR IGNORE INTO roles (role_name, permissions) VALUES
('User', '{"can_book": true, "can_view_routes": true}'),
('Admin', '{"can_manage_all": true, "can_view_analytics": true}'),
('Support', '{"can_manage_tickets": true, "can_view_logs": true, "can_manage_backups": true}'),
('Analyst', '{"can_view_analytics": true, "can_export_data": true}');

