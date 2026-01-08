// Скрипт для ініціалізації SQLite бази даних
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const sqlPath = path.join(__dirname, '..', '..', 'database', 'init_sqlite.sql');
const testUsersPath = path.join(__dirname, '..', '..', 'database', 'test_users_sqlite.sql');

console.log('🔧 Initializing SQLite database...');
console.log('Database path:', dbPath);

// Видаляємо стару базу якщо існує (опціонально, для чистої ініціалізації)
if (process.argv.includes('--fresh') && fs.existsSync(dbPath)) {
  console.log('🗑️  Removing existing database...');
  fs.unlinkSync(dbPath);
}

// Створюємо підключення
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Увімкнути foreign keys
db.run('PRAGMA foreign_keys = ON');

// Читаємо SQL скрипт
const sql = fs.readFileSync(sqlPath, 'utf8');

// Виконуємо SQL скрипт
console.log('📝 Executing SQL script...');
db.exec(sql, (err) => {
  if (err) {
    console.error('❌ Error executing SQL:', err.message);
    db.close();
    process.exit(1);
  }

  console.log('✅ Database schema created successfully!');

  // Перевірка створених таблиць
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error getting tables:', err);
    } else {
      console.log(`📊 Created ${tables.length} tables:`, tables.map(t => t.name).join(', '));
    }

    // Перевірка ролей
    db.all('SELECT * FROM roles', (err, roles) => {
      if (err) {
        console.error('Error getting roles:', err);
      } else {
        console.log(`👥 Created ${roles.length} roles:`, roles.map(r => r.role_name).join(', '));
      }

      // Створюємо тестових користувачів якщо потрібно
      if (process.argv.includes('--with-users')) {
        console.log('👤 Creating test users...');
        const testUsersSql = fs.readFileSync(testUsersPath, 'utf8');
        db.exec(testUsersSql, (err) => {
          if (err) {
            console.error('Error creating test users:', err);
          } else {
            console.log('✅ Test users created!');
          }
          db.close();
          console.log('✨ Done!');
        });
      } else {
        db.close();
        console.log('✨ Done!');
        console.log('💡 Tip: Run with --with-users flag to create test accounts');
      }
    });
  });
});
