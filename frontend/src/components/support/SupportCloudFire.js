import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import { Cloud } from '@mui/icons-material';

const SupportCloudFire = () => {
  const [config, setConfig] = useState({
    enabled: true,
    api_key: '***hidden***',
    project_id: 'ai-tourism-companion',
    region: 'us-central1',
  });

  const handleSave = () => {
    alert('Налаштування CloudFire збережено!');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Cloud sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Налаштування CloudFire</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Конфігурація
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enabled}
                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  />
                }
                label="Увімкнути CloudFire"
                sx={{ mb: 2, display: 'block' }}
              />
              <TextField
                fullWidth
                label="Project ID"
                value={config.project_id}
                onChange={(e) => setConfig({ ...config, project_id: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Region"
                value={config.region}
                onChange={(e) => setConfig({ ...config, region: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="API Key"
                type="password"
                value={config.api_key}
                onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                margin="normal"
              />
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                Зберегти налаштування
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статус
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                CloudFire використовується для реалізації функцій у реальному часі та
                синхронізації даних між клієнтами.
              </Typography>
              <Chip
                label={config.enabled ? 'Активний' : 'Неактивний'}
                color={config.enabled ? 'success' : 'default'}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SupportCloudFire;

