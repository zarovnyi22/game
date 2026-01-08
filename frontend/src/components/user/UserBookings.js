import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { BookOnline, Add } from '@mui/icons-material';

const UserBookings = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      event_name: 'Концерт у філармонії',
      date: '2024-01-15',
      quantity: 2,
      total_price: 500,
      status: 'confirmed',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Бронювання</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Нове бронювання
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Подія/Локація</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Кількість</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.event_name}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.quantity}</TableCell>
                <TableCell>{booking.total_price} UAH</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={booking.status === 'confirmed' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Деталі</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Нове бронювання</DialogTitle>
        <DialogContent>
          <Typography>
            Тут буде форма для створення нового бронювання на події або локації.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Скасувати</Button>
          <Button variant="contained">Бронювати</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserBookings;

