import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Translate } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserTranslation = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/translation-settings`);
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Failed to fetch translation settings:', error);
    }
  };

  const handleTranslate = () => {
    // Симуляція перекладу
    setTranslatedText(
      `Переклад (${settings?.translation_style || 'casual'}): ${inputText}`
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Translate sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Cultural Context Translator</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Вхідний текст
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Введіть текст для перекладу..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleTranslate}
                sx={{ mt: 2 }}
                fullWidth
              >
                Перекласти
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Переклад
              </Typography>
              <Box
                sx={{
                  minHeight: 200,
                  p: 2,
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  bgcolor: '#f5f5f5',
                }}
              >
                {translatedText || (
                  <Typography color="text.secondary">
                    Переклад з'явиться тут...
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserTranslation;

