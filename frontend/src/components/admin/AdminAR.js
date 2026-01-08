import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { Visibility, Add } from '@mui/icons-material';

const AdminAR = () => {
  const arContent = [
    {
      id: 1,
      location: 'Софійський собор',
      era: 'Київська Русь 11 століття',
      status: 'active',
    },
    {
      id: 2,
      location: 'Золоті ворота',
      era: 'Київська Русь 11 століття',
      status: 'active',
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Visibility sx={{ mr: 1, fontSize: 40 }} color="primary" />
          <Typography variant="h5">AR-реконструкція</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Додати AR контент
        </Button>
      </Box>

      <Grid container spacing={2}>
        {arContent.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Епоха: {item.era}
                </Typography>
                <Button variant="outlined" fullWidth>
                  Зануритися у AR-реконструкцію
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default AdminAR;

