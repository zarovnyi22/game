import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Update, CheckCircle, Warning } from '@mui/icons-material';

const SupportUpdates = () => {
  const [updates, setUpdates] = useState([
    {
      id: 1,
      name: 'React 18.2.0',
      current: '18.2.0',
      latest: '18.2.0',
      status: 'up_to_date',
    },
    {
      id: 2,
      name: 'Express 4.18.2',
      current: '4.18.1',
      latest: '4.18.2',
      status: 'update_available',
    },
    {
      id: 3,
      name: 'MySQL2 3.6.5',
      current: '3.6.4',
      latest: '3.6.5',
      status: 'update_available',
    },
  ]);

  const handleUpdate = (updateId) => {
    alert(`Оновлення ${updates.find((u) => u.id === updateId)?.name}...`);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Update sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Оновлення ПЗ та бібліотек</Typography>
      </Box>

      <Grid container spacing={2}>
        {updates.map((update) => (
          <Grid item xs={12} md={6} key={update.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{update.name}</Typography>
                  <Chip
                    label={update.status === 'up_to_date' ? 'Актуально' : 'Оновлення доступне'}
                    color={update.status === 'up_to_date' ? 'success' : 'warning'}
                    size="small"
                    icon={update.status === 'up_to_date' ? <CheckCircle /> : <Warning />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Поточна версія: {update.current}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Остання версія: {update.latest}
                </Typography>
                {update.status === 'update_available' && (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleUpdate(update.id)}
                  >
                    Оновити
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SupportUpdates;

