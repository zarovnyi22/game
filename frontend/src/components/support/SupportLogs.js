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
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { List as ListIcon } from '@mui/icons-material';

const SupportLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      level: 'error',
      component: 'PaymentGateway',
      message: 'Payment processing failed',
      created_at: '2024-01-10 14:30:00',
    },
    {
      id: 2,
      level: 'warning',
      component: 'ARModule',
      message: 'AR model loading timeout',
      created_at: '2024-01-10 13:15:00',
    },
    {
      id: 3,
      level: 'info',
      component: 'RouteAlgorithm',
      message: 'Route calculated successfully',
      created_at: '2024-01-10 12:00:00',
    },
  ]);
  const [filterLevel, setFilterLevel] = useState('all');

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredLogs =
    filterLevel === 'all'
      ? logs
      : logs.filter((log) => log.level === filterLevel);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListIcon sx={{ mr: 1, fontSize: 40 }} color="primary" />
          <Typography variant="h5">Логи системи</Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Фільтр по рівню</InputLabel>
          <Select
            value={filterLevel}
            label="Фільтр по рівню"
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <MenuItem value="all">Всі</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="info">Info</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Рівень</TableCell>
              <TableCell>Компонент</TableCell>
              <TableCell>Повідомлення</TableCell>
              <TableCell>Дата/Час</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Chip
                    label={log.level}
                    color={getLevelColor(log.level)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.component}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SupportLogs;

