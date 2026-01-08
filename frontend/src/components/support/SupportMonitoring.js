import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Monitor } from '@mui/icons-material';

const SupportMonitoring = () => {
  const [servers, setServers] = useState([
    {
      id: 1,
      name: 'API Server',
      status: 'online',
      cpu: 45,
      memory: 62,
      uptime: '99.9%',
    },
    {
      id: 2,
      name: 'Database Server',
      status: 'online',
      cpu: 30,
      memory: 48,
      uptime: '99.8%',
    },
    {
      id: 3,
      name: 'AR Processing Server',
      status: 'online',
      cpu: 70,
      memory: 55,
      uptime: '99.5%',
    },
  ]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Monitor sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Моніторинг серверів та мережі</Typography>
      </Box>

      <Grid container spacing={2}>
        {servers.map((server) => (
          <Grid item xs={12} md={4} key={server.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{server.name}</Typography>
                  <Chip
                    label={server.status}
                    color={server.status === 'online' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    CPU: {server.cpu}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={server.cpu}
                    color={server.cpu > 80 ? 'error' : server.cpu > 60 ? 'warning' : 'primary'}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Memory: {server.memory}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={server.memory}
                    color={server.memory > 80 ? 'error' : server.memory > 60 ? 'warning' : 'primary'}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Uptime: {server.uptime}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SupportMonitoring;

