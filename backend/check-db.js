// Скрипт для перевірки підключення до бази даних
require('dotenv').config();
const pool = require('./config/database');

async function checkDatabase() {
  console.log('🔍 Checking database connection...');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log(`  Database: ${process.env.DB_NAME || 'ai_tourism_companion'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log('');

  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    
    // Перевірка чи існує база даних
    try {
      const [dbs] = await pool.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME || 'ai_tourism_companion']);
      if (dbs.length > 0) {
        console.log(`✅ Database '${process.env.DB_NAME || 'ai_tourism_companion'}' exists`);
        
        // Перевірка таблиць
        const [tables] = await pool.execute('SHOW TABLES');
        console.log(`✅ Found ${tables.length} tables in database`);
        
        // Перевірка ролей
        const [roles] = await pool.execute('SELECT * FROM roles');
        console.log(`✅ Found ${roles.length} roles: ${roles.map(r => r.role_name).join(', ')}`);
      } else {
        console.log(`❌ Database '${process.env.DB_NAME || 'ai_tourism_companion'}' does not exist`);
        console.log('💡 Run: mysql -u root -p < database/init.sql');
      }
    } catch (err) {
      console.log('⚠️  Could not check database details:', err.message);
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running or not accessible');
      console.error('   Start MySQL server or check connection settings');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist');
      console.error('   Run: mysql -u root -p < database/init.sql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied');
      console.error('   Check DB_USER and DB_PASSWORD in backend/.env file');
    } else {
      console.error('\n💡 Check your database configuration in backend/.env');
    }
    
    await pool.end();
    process.exit(1);
  }
}

checkDatabase();

