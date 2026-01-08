import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { LocationOn, Security } from '@mui/icons-material';

const AdminMonitoring = () => {
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [locations, setLocations] = useState([
    { id: 1, name: 'Центральний район', monitoring: true },
    { id: 2, name: 'Печерськ', monitoring: true },
    { id: 3, name: 'Поділ', monitoring: false },
  ]);

  const handleToggleMonitoring = (locationId) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId ? { ...loc, monitoring: !loc.monitoring } : loc
      )
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1, fontSize: 40 }} color="primary" />
          <Typography variant="h5">Моніторинг локацій</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={monitoringEnabled}
              onChange={(e) => setMonitoringEnabled(e.target.checked)}
            />
          }
          label="Глобальний моніторинг"
        />
      </Box>

      <Grid container spacing={2}>
        {locations.map((location) => (
          <Grid item xs={12} md={4} key={location.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {location.name}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={location.monitoring}
                      onChange={() => handleToggleMonitoring(location.id)}
                    />
                  }
                  label="Моніторинг увімкнено"
                />
                <Button size="small" sx={{ mt: 1 }} fullWidth>
                  Деталі
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default AdminMonitoring;

