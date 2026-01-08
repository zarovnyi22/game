# SQLite Налаштування - Готово! ✅

Проект тепер використовує **SQLite** замість MySQL. Це простіше для розробки - не потрібно налаштовувати окремий сервер БД.

## ✅ Що вже зроблено:

1. ✅ База даних створена: `backend/database.sqlite`
2. ✅ Всі таблиці створені (22 таблиці)
3. ✅ Ролі створені (User, Admin, Support, Analyst)
4. ✅ Тестові користувачі створені

## 🔑 Тестові акаунти:

- **User**: `user@test.com` / `Test123456`
- **Admin**: `admin@test.com` / `Test123456`
- **Support**: `support@test.com` / `Test123456`

## 🚀 Запуск:

Просто перезапустіть сервер:

```bash
# Зупиніть поточний процес (Ctrl+C) та запустіть знову
cd backend
npm run dev
```

Або з кореня проекту:
```bash
npm run dev
```

## 📝 Команди для роботи з БД:

### Ініціалізація бази даних (якщо потрібно перестворити):
```bash
cd backend
npm run init-db
```

### Створити базу з тестовими користувачами:
```bash
cd backend
npm run init-db -- --with-users
```

### Створити свіжу базу (видалити стару):
```bash
cd backend
npm run init-db -- --fresh --with-users
```

## 📁 Файли бази даних:

- **База даних**: `backend/database.sqlite`
- **SQL схема**: `database/init_sqlite.sql`
- **Тестові користувачі**: `database/test_users_sqlite.sql`

## 🔍 Перевірка бази даних:

Ви можете відкрити `backend/database.sqlite` в будь-якому SQLite клієнті:
- DB Browser for SQLite (безкоштовний)
- VS Code розширення "SQLite Viewer"
- DBeaver

## ⚙️ Налаштування:

Файл `backend/.env` тепер містить:
```env
PORT=5000
JWT_SECRET=ai_tourism_companion_secret_key_2024_change_in_production
DB_PATH=./database.sqlite
NODE_ENV=development
```

## ✨ Переваги SQLite:

- ✅ Не потрібен окремий сервер БД
- ✅ Файл бази даних легко копіювати/бекапити
- ✅ Швидко працює для розробки
- ✅ Не потрібні додаткові налаштування

## ⚠️ Примітки:

- Для production можна залишити SQLite або перейти на PostgreSQL/MySQL
- База даних - це один файл `database.sqlite`
- Рекомендується додати `database.sqlite` в `.gitignore` (якщо ще не додано)

