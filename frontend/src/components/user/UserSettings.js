import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Button,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserSettings = () => {
  const [settings, setSettings] = useState({
    voice_mode: false,
    ocometry_enabled: false,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/translation-settings`);
      const data = response.data.settings || {};
      setSettings({
        voice_mode: data.voice_mode || false,
        ocometry_enabled: false, // Це буде окрема налаштування
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/translation-settings`, {
        voice_mode: settings.voice_mode,
      });
      setMessage('Налаштування збережено!');
    } catch (error) {
      setMessage('Помилка при збереженні налаштувань');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Налаштування
      </Typography>
      {message && (
        <Alert severity={message.includes('збережено') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.voice_mode}
              onChange={(e) => setSettings({ ...settings, voice_mode: e.target.checked })}
            />
          }
          label="Озвучування перекладу у навушники"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.ocometry_enabled}
              onChange={(e) => setSettings({ ...settings, ocometry_enabled: e.target.checked })}
            />
          }
          label="Окометрія для рекомендацій"
        />
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
          Зберегти налаштування
        </Button>
      </Box>
    </Paper>
  );
};

export default UserSettings;

