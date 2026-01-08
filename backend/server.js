const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Тест підключення до БД при старті
async function testDatabaseConnection() {
  try {
    const test = await db.getAsync('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Перевірка чи існують таблиці
    const tables = await db.allAsync("SELECT name FROM sqlite_master WHERE type='table'");
    if (tables.length === 0) {
      console.warn('⚠️  Warning: Database is empty. Run: npm run init-db');
    } else {
      console.log(`📊 Found ${tables.length} tables in database`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Tip: Run: npm run init-db to initialize database');
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Tourism Companion API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Запуск сервера з перевіркою БД
async function startServer() {
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.warn('⚠️  Warning: Database connection failed, but server will start anyway.');
    console.warn('⚠️  Some features may not work until database is configured.');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
}

startServer();

