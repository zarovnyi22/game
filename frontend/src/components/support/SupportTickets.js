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
import { Support, Add, Reply } from '@mui/icons-material';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      user: 'user@example.com',
      subject: 'Проблема з бронюванням',
      category: 'payment',
      status: 'open',
      priority: 'high',
      created_at: '2024-01-10',
    },
    {
      id: 2,
      user: 'user2@example.com',
      subject: 'Помилка в навігації',
      category: 'bug',
      status: 'in_progress',
      priority: 'medium',
      created_at: '2024-01-09',
    },
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleReply = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Support sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Тікети підтримки (Части скарг)</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Користувач</TableCell>
              <TableCell>Тема</TableCell>
              <TableCell>Категорія</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Пріоритет</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.user}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <Chip label={ticket.category} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status}
                    color={getStatusColor(ticket.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    color={ticket.priority === 'high' ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ticket.created_at}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<Reply />}
                    onClick={() => handleReply(ticket)}
                  >
                    Відповісти
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Відповідь на тікет #{selectedTicket?.id}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Тема: {selectedTicket?.subject}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Відповідь"
            margin="normal"
            placeholder="Введіть відповідь користувачу..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Скасувати</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Надати допомогу
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SupportTickets;

