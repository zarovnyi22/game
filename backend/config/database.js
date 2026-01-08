const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

// Створюємо підключення до SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  }
});

// Увімкнути foreign keys
db.run('PRAGMA foreign_keys = ON');

// Обгортаємо методи в проміси для зручності
db.prepareAsync = (sql) => {
  const stmt = db.prepare(sql);
  return {
    get: promisify((...args) => {
      return new Promise((resolve, reject) => {
        stmt.get(...args, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }),
    all: promisify((...args) => {
      return new Promise((resolve, reject) => {
        stmt.all(...args, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }),
    run: promisify((...args) => {
      return new Promise((resolve, reject) => {
        stmt.run(...args, function(err) {
          if (err) reject(err);
          else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
        });
      });
    }),
    finalize: promisify((callback) => stmt.finalize(callback))
  };
};

// Додаємо методи для зручності
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));
db.runAsync = promisify((sql, ...args) => {
  return new Promise((resolve, reject) => {
    db.run(sql, ...args, function(err) {
      if (err) reject(err);
      else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
    });
  });
});

module.exports = db;
