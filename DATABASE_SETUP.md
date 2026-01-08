# Налаштування бази даних

## Проблема: "Internal server error" при вході

Якщо ви отримуєте помилку "Internal server error" при спробі увійти, це означає, що база даних не налаштована або не підключена.

## Крок 1: Перевірка MySQL

Перевірте, чи встановлений та запущений MySQL:

```bash
# macOS (якщо встановлений через Homebrew)
brew services list | grep mysql

# Або перевірте процес
ps aux | grep mysql
```

## Крок 2: Налаштування .env файлу

Відредагуйте файл `backend/.env` та вкажіть правильні дані для підключення:

```env
PORT=5000
JWT_SECRET=ai_tourism_companion_secret_key_2024_change_in_production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ваш_пароль_mysql  # <-- ВАЖЛИВО: вкажіть ваш пароль
DB_NAME=ai_tourism_companion
DB_PORT=3306
```

**Якщо у root немає пароля**, залиште поле порожнім:
```env
DB_PASSWORD=
```

## Крок 3: Створення бази даних

### Варіант 1: Через командний рядок

```bash
# Якщо є пароль
mysql -u root -p < database/init.sql

# Якщо немає пароля
mysql -u root < database/init.sql
```

### Варіант 2: Через MySQL Workbench або інший клієнт

1. Відкрийте MySQL Workbench
2. Підключіться до сервера
3. Відкрийте файл `database/init.sql`
4. Виконайте весь скрипт

## Крок 4: Перевірка підключення

Запустіть скрипт перевірки:

```bash
cd backend
node check-db.js
```

Якщо все добре, ви побачите:
```
✅ Database connection successful!
✅ Database 'ai_tourism_companion' exists
✅ Found 21 tables in database
✅ Found 4 roles: User, Admin, Support, Analyst
```

## Крок 5: Створення тестових користувачів

Після успішного створення бази даних, створіть тестових користувачів:

```bash
mysql -u root -p ai_tourism_companion < database/test_users.sql
```

Або без пароля:
```bash
mysql -u root ai_tourism_companion < database/test_users.sql
```

## Крок 6: Перезапуск сервера

Після налаштування БД, перезапустіть backend сервер:

```bash
# Зупиніть поточний процес (Ctrl+C) та запустіть знову
cd backend
npm run dev
```

## Тестові акаунти

Після виконання `test_users.sql`:

- **User**: `user@test.com` / `Test123456`
- **Admin**: `admin@test.com` / `Test123456`
- **Support**: `support@test.com` / `Test123456`

## Усунення проблем

### Помилка: "Access denied"
- Перевірте `DB_USER` та `DB_PASSWORD` в `backend/.env`
- Переконайтеся, що користувач має права доступу до бази даних

### Помилка: "Database does not exist"
- Виконайте `database/init.sql` для створення бази даних

### Помилка: "Connection refused"
- Переконайтеся, що MySQL сервер запущений
- Перевірте `DB_HOST` та `DB_PORT` в `.env`

## Альтернатива: SQLite (для швидкого тестування)

Якщо MySQL складно налаштувати, можна тимчасово використати SQLite. Але для production рекомендується MySQL.

