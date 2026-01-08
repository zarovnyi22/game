import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Route as RouteIcon, Add } from '@mui/icons-material';

const UserRoutes = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      title: 'Історичний центр Києва',
      status: 'planned',
      distance: 5.2,
      duration: 120,
      waypoints: 4,
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    interests: [],
    duration: '',
  });

  const handleCreateRoute = () => {
    // Тут буде інтеграція з AI для генерації персоналізованого маршруту
    alert('Функція створення персоналізованого маршруту буде реалізована з AI');
    setShowCreateForm(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Маршрути</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          Створити маршрут
        </Button>
      </Box>

      {showCreateForm && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Отримати персоналізований маршрут
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Бюджет (UAH)"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Тривалість (хв)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Інтереси</InputLabel>
                <Select
                  multiple
                  value={formData.interests}
                  label="Інтереси"
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                >
                  <MenuItem value="history">Історія</MenuItem>
                  <MenuItem value="art">Мистецтво</MenuItem>
                  <MenuItem value="nightlife">Нічне життя</MenuItem>
                  <MenuItem value="food">Їжа</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCreateRoute}>
                Створити маршрут
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      <Grid container spacing={2}>
        {routes.map((route) => (
          <Grid item xs={12} sm={6} md={4} key={route.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <RouteIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{route.title}</Typography>
                </Box>
                <Chip
                  label={route.status}
                  size="small"
                  color={route.status === 'completed' ? 'success' : 'primary'}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Відстань: {route.distance} км
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Тривалість: {route.duration} хв
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Точок: {route.waypoints}
                </Typography>
                <Button size="small" sx={{ mt: 1 }}>
                  Переглянути
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default UserRoutes;

