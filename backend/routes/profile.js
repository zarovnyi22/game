const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Отримати профіль користувача
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    let profile = await db.getAsync('SELECT * FROM user_profiles WHERE user_id = ?', user_id);

    if (!profile) {
      // Створюємо профіль якщо не існує
      await db.runAsync('INSERT INTO user_profiles (user_id) VALUES (?)', user_id);
      profile = await db.getAsync('SELECT * FROM user_profiles WHERE user_id = ?', user_id);
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Оновити профіль користувача (Endpoint 1)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { first_name, last_name, birth_date, gender, cultural_preferences, language_pref, translation_style } = req.body;

    // Оновлюємо профіль
    const updateFields = [];
    const updateValues = [];

    if (first_name !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(last_name);
    }
    if (birth_date !== undefined) {
      updateFields.push('birth_date = ?');
      updateValues.push(birth_date);
    }
    if (gender !== undefined) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }
    if (cultural_preferences !== undefined) {
      updateFields.push('cultural_preferences = ?');
      updateValues.push(JSON.stringify(cultural_preferences));
    }
    if (language_pref !== undefined) {
      updateFields.push('language_pref = ?');
      updateValues.push(language_pref);
    }

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(user_id);
      await db.runAsync(
        `UPDATE user_profiles SET ${updateFields.join(', ')} WHERE user_id = ?`,
        ...updateValues
      );
    }

    // Оновлюємо налаштування перекладу якщо потрібно
    if (translation_style !== undefined) {
      const existingSettings = await db.getAsync('SELECT setting_id FROM translation_settings WHERE user_id = ?', user_id);

      if (existingSettings) {
        await db.runAsync(
          'UPDATE translation_settings SET translation_style = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
          translation_style, user_id
        );
      } else {
        await db.runAsync(
          'INSERT INTO translation_settings (user_id, translation_style) VALUES (?, ?)',
          user_id, translation_style
        );
      }
    }

    // Повертаємо оновлений профіль
    const profile = await db.getAsync('SELECT * FROM user_profiles WHERE user_id = ?', user_id);

    res.json({ 
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримати налаштування перекладу (Endpoint 2)
router.get('/translation-settings', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    let settings = await db.getAsync('SELECT * FROM translation_settings WHERE user_id = ?', user_id);

    if (!settings) {
      // Створюємо налаштування за замовчуванням
      await db.runAsync('INSERT INTO translation_settings (user_id) VALUES (?)', user_id);
      settings = await db.getAsync('SELECT * FROM translation_settings WHERE user_id = ?', user_id);
    }

    res.json({ settings });
  } catch (error) {
    console.error('Get translation settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Оновити налаштування перекладу (Endpoint 3)
router.put('/translation-settings', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { source_languages, target_language, translation_style, voice_mode } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (source_languages !== undefined) {
      updateFields.push('source_languages = ?');
      updateValues.push(JSON.stringify(source_languages));
    }
    if (target_language !== undefined) {
      updateFields.push('target_language = ?');
      updateValues.push(target_language);
    }
    if (translation_style !== undefined) {
      updateFields.push('translation_style = ?');
      updateValues.push(translation_style);
    }
    if (voice_mode !== undefined) {
      updateFields.push('voice_mode = ?');
      updateValues.push(voice_mode ? 1 : 0);
    }

    const existingSettings = await db.getAsync('SELECT setting_id FROM translation_settings WHERE user_id = ?', user_id);

    if (existingSettings) {
      if (updateFields.length > 0) {
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(user_id);
        await db.runAsync(
          `UPDATE translation_settings SET ${updateFields.join(', ')} WHERE user_id = ?`,
          ...updateValues
        );
      }
    } else {
      await db.runAsync(
        'INSERT INTO translation_settings (user_id, source_languages, target_language, translation_style, voice_mode) VALUES (?, ?, ?, ?, ?)',
        user_id,
        source_languages ? JSON.stringify(source_languages) : null,
        target_language || 'uk',
        translation_style || 'casual',
        voice_mode ? 1 : 0
      );
    }

    const settings = await db.getAsync('SELECT * FROM translation_settings WHERE user_id = ?', user_id);

    res.json({ 
      message: 'Translation settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update translation settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримати історію відвіданих місць (Endpoint 4)
router.get('/visit-history', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const history = await db.allAsync(
      `SELECT h.*, l.name as location_name, l.latitude, l.longitude, l.type, l.average_rating
       FROM user_navigation_history h
       JOIN locations l ON h.location_id = l.location_id
       WHERE h.user_id = ?
       ORDER BY h.visit_start DESC
       LIMIT 100`,
      user_id
    );

    res.json({ history });
  } catch (error) {
    console.error('Get visit history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
