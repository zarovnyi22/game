import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from '@mui/material';
import { Visibility, CameraAlt } from '@mui/icons-material';

const UserAR = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Visibility sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">AR-реконструкція (ChronoTourism)</Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" paragraph>
        Зануртеся у минулі епохи за допомогою AR-технологій. Наведіть камеру на історичні локації,
        щоб побачити реконструкцію минулого.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                bgcolor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CameraAlt sx={{ fontSize: 60 }} color="disabled" />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AR Камера
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Натисніть кнопку нижче, щоб активувати AR-режим
              </Typography>
              <Button variant="contained" fullWidth startIcon={<CameraAlt />}>
                Запустити AR
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Доступні епохи
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" fullWidth>
                  Київська Русь (11 століття)
                </Button>
                <Button variant="outlined" fullWidth>
                  Середньовіччя (14-15 століття)
                </Button>
                <Button variant="outlined" fullWidth>
                  Козацька доба (17-18 століття)
                </Button>
                <Button variant="outlined" fullWidth>
                  Модерн (19-20 століття)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserAR;

