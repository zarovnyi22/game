import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    cultural_preferences: [],
    language_pref: 'uk',
    translation_style: 'casual',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileRes, settingsRes] = await Promise.all([
        axios.get(`${API_URL}/profile`),
        axios.get(`${API_URL}/translation-settings`),
      ]);

      const profileData = profileRes.data.profile || {};
      const settingsData = settingsRes.data.settings || {};

      setProfile(profileData);
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        birth_date: profileData.birth_date || '',
        gender: profileData.gender || '',
        cultural_preferences: profileData.cultural_preferences
          ? JSON.parse(profileData.cultural_preferences)
          : [],
        language_pref: profileData.language_pref || 'uk',
        translation_style: settingsData.translation_style || 'casual',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await axios.put(`${API_URL}/profile`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        cultural_preferences: formData.cultural_preferences,
        language_pref: formData.language_pref,
        translation_style: formData.translation_style,
      });

      setMessage('Профіль успішно оновлено!');
      fetchProfile();
    } catch (error) {
      setMessage('Помилка при оновленні профілю');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Завантаження...</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Редагування профілю
      </Typography>
      {message && (
        <Alert severity={message.includes('успішно') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ім'я"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Прізвище"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Дата народження"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Стать</InputLabel>
              <Select
                value={formData.gender}
                label="Стать"
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value="male">Чоловіча</MenuItem>
                <MenuItem value="female">Жіноча</MenuItem>
                <MenuItem value="other">Інша</MenuItem>
                <MenuItem value="prefer_not_to_say">Не вказувати</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Мова</InputLabel>
              <Select
                value={formData.language_pref}
                label="Мова"
                onChange={(e) => setFormData({ ...formData, language_pref: e.target.value })}
              >
                <MenuItem value="uk">Українська</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ru">Русский</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Стиль перекладу</InputLabel>
              <Select
                value={formData.translation_style}
                label="Стиль перекладу"
                onChange={(e) => setFormData({ ...formData, translation_style: e.target.value })}
              >
                <MenuItem value="formal">Формальний</MenuItem>
                <MenuItem value="casual">Неформальний</MenuItem>
                <MenuItem value="historical">Історичний</MenuItem>
                <MenuItem value="humorous">Жартівливий</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" disabled={saving}>
                Зберегти
              </Button>
              <Button variant="outlined" onClick={fetchProfile}>
                Скасувати
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UserProfile;

