# Інструкція з встановлення та запуску

## Крок 1: Встановлення залежностей

```bash
# Встановити залежності для root проекту
npm install

# Встановити залежності для backend
cd backend
npm install

# Встановити залежності для frontend
cd ../frontend
npm install
```

Або використайте команду:
```bash
npm run install-all
```

## Крок 2: Налаштування бази даних

1. Встановіть MySQL (якщо ще не встановлено)
2. Створіть базу даних:
```sql
mysql -u root -p < database/init.sql
```

Або виконайте SQL скрипт вручну через MySQL Workbench або інший клієнт.

## Крок 3: Налаштування змінних оточення

### Backend (.env файл)

Створіть файл `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_tourism_companion
DB_PORT=3306
```

### Frontend (.env файл) - опціонально

Створіть файл `frontend/.env` якщо потрібно змінити URL API:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Крок 4: Запуск проекту

### Варіант 1: Запуск одночасно (рекомендовано для розробки)

```bash
npm run dev
```

Це запустить:
- Backend на http://localhost:5000
- Frontend на http://localhost:3000

### Варіант 2: Запуск окремо

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Крок 5: Тестування

1. Відкрийте браузер на http://localhost:3000
2. Зареєструйте нового користувача або увійдіть
3. За замовчуванням створюється користувач з роллю "User"
4. Для тестування ролей Admin/Support потрібно вручну змінити роль в базі даних:

```sql
-- Змінити роль користувача на Admin
UPDATE users SET role_id = (SELECT role_id FROM roles WHERE role_name = 'Admin') WHERE email = 'your_email@example.com';

-- Змінити роль користувача на Support
UPDATE users SET role_id = (SELECT role_id FROM roles WHERE role_name = 'Support') WHERE email = 'your_email@example.com';
```

## Структура API

### Авторизація
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід
- `GET /api/auth/me` - Отримати поточного користувача

### Профіль (4 запити до БД)
- `GET /api/profile` - Отримати профіль
- `PUT /api/profile` - Оновити профіль
- `GET /api/translation-settings` - Отримати налаштування перекладу
- `PUT /api/translation-settings` - Оновити налаштування перекладу
- `GET /api/visit-history` - Отримати історію відвіданих місць

## Ролі та доступ

### User (Користувач)
- Доступ до всіх функцій користувача
- Маршрути: `/user/*`

### Admin (Адміністратор)
- Доступ до адмін панелі
- Маршрути: `/admin/*`

### Support (Технічна підтримка)
- Доступ до панелі підтримки
- Маршрути: `/support/*`

## Примітки

- JWT токени зберігаються в localStorage
- Токени дійсні 24 години
- Для production змініть JWT_SECRET на безпечний випадковий рядок
- Деякі функції (AI, AR, реальні платежі) потребують додаткової інтеграції

