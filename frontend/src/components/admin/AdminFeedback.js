import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Rating,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    event: '',
  });

  const handleSubmit = () => {
    alert('Відгук збережено!');
    setFeedback({ rating: 0, comment: '', event: '' });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Star sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Залишити відгук про подію/маршрут</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Новий відгук
              </Typography>
              <TextField
                fullWidth
                label="Подія/Маршрут"
                value={feedback.event}
                onChange={(e) => setFeedback({ ...feedback, event: e.target.value })}
                margin="normal"
              />
              <Box sx={{ my: 2 }}>
                <Typography component="legend">Оцінка</Typography>
                <Rating
                  value={feedback.rating}
                  onChange={(event, newValue) => {
                    setFeedback({ ...feedback, rating: newValue });
                  }}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Коментар"
                value={feedback.comment}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                margin="normal"
              />
              <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Залишити відгук
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Останні відгуки
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Тут будуть відображені останні відгуки користувачів про події та маршрути.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminFeedback;

