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
  Button,
} from '@mui/material';
import { Security, Warning } from '@mui/icons-material';

const AdminSafety = () => {
  const [safetyRatings, setSafetyRatings] = useState([
    {
      id: 1,
      district: 'Центральний район',
      score: 85,
      threat_level: 'low',
      last_updated: '2024-01-10',
    },
    {
      id: 2,
      district: 'Печерськ',
      score: 92,
      threat_level: 'low',
      last_updated: '2024-01-10',
    },
    {
      id: 3,
      district: 'Поділ',
      score: 65,
      threat_level: 'medium',
      last_updated: '2024-01-09',
    },
  ]);

  const getThreatColor = (level) => {
    switch (level) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleGetRating = (districtId) => {
    alert(`Отримання оцінки безпеки для району ${districtId} через AI Safety Advisor`);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Security sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">AI Safety Advisor - Оцінка безпеки районів</Typography>
      </Box>

      <Grid container spacing={2}>
        {safetyRatings.map((rating) => (
          <Grid item xs={12} md={4} key={rating.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {rating.district}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Рівень безпеки</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {rating.score}/100
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={rating.score}
                    color={rating.score >= 80 ? 'success' : rating.score >= 60 ? 'warning' : 'error'}
                  />
                </Box>
                <Chip
                  label={rating.threat_level}
                  color={getThreatColor(rating.threat_level)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  Оновлено: {rating.last_updated}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleGetRating(rating.id)}
                >
                  Отримати оцінку (AI)
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default AdminSafety;

