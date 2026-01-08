const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const router = express.Router();

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Перевірка чи користувач існує
    const existingUser = await db.getAsync('SELECT user_id FROM users WHERE email = ?', email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Отримуємо роль User за замовчуванням
    const role = await db.getAsync('SELECT role_id FROM roles WHERE role_name = ?', 'User');

    if (!role) {
      return res.status(500).json({ error: 'Default role not found' });
    }

    const role_id = role.role_id;

    // Хешуємо пароль
    const password_hash = await bcrypt.hash(password, 10);

    // Створюємо користувача
    const result = await db.runAsync(
      'INSERT INTO users (email, password_hash, role_id, auth_provider) VALUES (?, ?, ?, ?)',
      email, password_hash, role_id, 'local'
    );

    const user_id = result.lastInsertRowid;

    // Створюємо профіль
    if (first_name || last_name) {
      await db.runAsync(
        'INSERT INTO user_profiles (user_id, first_name, last_name) VALUES (?, ?, ?)',
        user_id, first_name || null, last_name || null
      );
    } else {
      await db.runAsync('INSERT INTO user_profiles (user_id) VALUES (?)', user_id);
    }

    // Отримуємо роль для токену
    const userRole = await db.getAsync('SELECT role_name FROM roles WHERE role_id = ?', role_id);

    // Генеруємо JWT токен
    const token = jwt.sign(
      { 
        user_id, 
        email, 
        role_id, 
        role_name: userRole.role_name 
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id,
        email,
        role_name: userRole.role_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.message || 'Internal server error';
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Логін
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Знаходимо користувача
    const user = await db.getAsync(
      `SELECT u.user_id, u.email, u.password_hash, u.role_id, u.is_active, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.email = ?`,
      email
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    // Перевіряємо пароль
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генеруємо JWT токен
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        email: user.email, 
        role_id: user.role_id, 
        role_name: user.role_name 
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role_name: user.role_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.message || 'Internal server error';
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Отримати поточного користувача
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');

    const user = await db.getAsync(
      `SELECT u.user_id, u.email, u.role_id, r.role_name, u.is_active, u.created_at
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
      decoded.user_id
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = await db.getAsync('SELECT * FROM user_profiles WHERE user_id = ?', decoded.user_id);

    res.json({
      user,
      profile: profile || null
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
