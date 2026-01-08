import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { Route as RouteIcon, Visibility } from '@mui/icons-material';

const AdminRoutes = () => {
  const routes = [
    {
      id: 1,
      title: 'Історичний центр',
      user: 'user@example.com',
      status: 'active',
      waypoints: 5,
    },
    {
      id: 2,
      title: 'Музейний маршрут',
      user: 'user2@example.com',
      status: 'completed',
      waypoints: 3,
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <RouteIcon sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Перегляд маршрутів</Typography>
      </Box>

      <Grid container spacing={2}>
        {routes.map((route) => (
          <Grid item xs={12} md={6} key={route.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {route.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Користувач: {route.user}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={route.status} size="small" />
                  <Chip label={`${route.waypoints} точок`} size="small" variant="outlined" />
                </Box>
                <Button variant="outlined" fullWidth startIcon={<Visibility />}>
                  Переглянути деталі
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default AdminRoutes;

