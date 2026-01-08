import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Navigation as NavIcon, LocationOn } from '@mui/icons-material';

const UserNavigation = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Вбудована навігація
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Використовуйте вбудовану навігацію для знаходження найкращих маршрутів до точок інтересу в місті.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NavIcon sx={{ mr: 1, fontSize: 40 }} color="primary" />
                <Typography variant="h6">Поточний маршрут</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Відстань: 2.5 км
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Час у дорозі: ~15 хвилин
              </Typography>
              <Button variant="contained" fullWidth>
                Почати навігацію
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, fontSize: 40 }} color="secondary" />
                <Typography variant="h6">Ближчі локації</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Тут буде відображено карту з ближчими локаціями та можливістю побудови маршруту.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserNavigation;

