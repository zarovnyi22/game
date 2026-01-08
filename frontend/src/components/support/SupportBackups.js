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
import { Storage, Add, Archive, Restore } from '@mui/icons-material';

const SupportBackups = () => {
  const [backups, setBackups] = useState([
    {
      id: 1,
      file_name: 'backup_2024-01-10.sql',
      location: 's3://backups/daily/',
      size: 1024000000,
      status: 'success',
      created_at: '2024-01-10 00:00:00',
    },
    {
      id: 2,
      file_name: 'backup_2024-01-09.sql',
      location: 's3://backups/daily/',
      size: 1015000000,
      status: 'success',
      created_at: '2024-01-09 00:00:00',
    },
  ]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  const formatSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const handleCreateBackup = () => {
    alert('Створення бекапу...');
    setOpenCreateDialog(false);
  };

  const handleArchiveBackup = (backup) => {
    alert(`Переміщення бекапу ${backup.file_name} в архів на інший сервер...`);
  };

  const handleRestoreBackup = (backup) => {
    setSelectedBackup(backup);
    setOpenRestoreDialog(true);
  };

  const handleConfirmRestore = () => {
    alert(`Відновлення з бекапу ${selectedBackup?.file_name}...`);
    setOpenRestoreDialog(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Storage sx={{ mr: 1, fontSize: 40 }} color="primary" />
          <Typography variant="h5">Контроль бекапів</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
        >
          Створити бекап
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Файл</TableCell>
              <TableCell>Розташування</TableCell>
              <TableCell>Розмір</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата створення</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backups.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell>{backup.file_name}</TableCell>
                <TableCell>{backup.location}</TableCell>
                <TableCell>{formatSize(backup.size)}</TableCell>
                <TableCell>
                  <Chip
                    label={backup.status}
                    color={backup.status === 'success' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{backup.created_at}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Archive />}
                      onClick={() => handleArchiveBackup(backup)}
                    >
                      Архів
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Restore />}
                      onClick={() => handleRestoreBackup(backup)}
                    >
                      Відновити
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Створити бекап</DialogTitle>
        <DialogContent>
          <Typography>
            Створити новий бекап бази даних? Це може зайняти деякий час.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Скасувати</Button>
          <Button variant="contained" onClick={handleCreateBackup}>
            Створити
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRestoreDialog} onClose={() => setOpenRestoreDialog(false)}>
        <DialogTitle>Відновлення з бекапу</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Файл: {selectedBackup?.file_name}
          </Typography>
          <Typography color="error">
            Увага! Відновлення з бекапу перезапише поточні дані. Продовжити?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestoreDialog(false)}>Скасувати</Button>
          <Button variant="contained" color="error" onClick={handleConfirmRestore}>
            Відновити
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SupportBackups;

