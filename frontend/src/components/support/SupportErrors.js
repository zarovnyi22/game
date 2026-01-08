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
} from '@mui/material';
import { BugReport, Report } from '@mui/icons-material';

const SupportErrors = () => {
  const [errors, setErrors] = useState([
    {
      id: 1,
      component: 'PaymentGateway',
      error: 'Payment timeout',
      count: 15,
      last_occurred: '2024-01-10 14:30:00',
      requires_fix: true,
    },
    {
      id: 2,
      component: 'ARModule',
      error: 'Model loading failed',
      count: 8,
      last_occurred: '2024-01-10 13:15:00',
      requires_fix: true,
    },
  ]);
  const [selectedError, setSelectedError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleReportBug = (error) => {
    setSelectedError(error);
    setOpenDialog(true);
  };

  const handleSubmitReport = () => {
    alert('Повідомлення про помилку відправлено для баг-фіксів!');
    setOpenDialog(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BugReport sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Управління помилками</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Компонент</TableCell>
              <TableCell>Помилка</TableCell>
              <TableCell>Кількість</TableCell>
              <TableCell>Останнє виникнення</TableCell>
              <TableCell>Потребує виправлення</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map((error) => (
              <TableRow key={error.id}>
                <TableCell>{error.component}</TableCell>
                <TableCell>{error.error}</TableCell>
                <TableCell>
                  <Chip label={error.count} color="error" size="small" />
                </TableCell>
                <TableCell>{error.last_occurred}</TableCell>
                <TableCell>
                  <Chip
                    label={error.requires_fix ? 'Так' : 'Ні'}
                    color={error.requires_fix ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<Report />}
                    onClick={() => handleReportBug(error)}
                  >
                    Прозвітувати
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Прозвітувати про помилку: {selectedError?.component}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Помилка: {selectedError?.error}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ця помилка вимагає баг-фіксів. Повідомлення буде відправлено команді розробки.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Скасувати</Button>
          <Button variant="contained" onClick={handleSubmitReport}>
            Прозвітувати
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SupportErrors;

