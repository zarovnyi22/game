import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Settings } from '@mui/icons-material';

const SupportAPI = () => {
  const [apis, setApis] = useState([
    {
      id: 1,
      name: 'Google Maps API',
      status: 'active',
      last_checked: '2024-01-10 14:30:00',
      requests_today: 1250,
    },
    {
      id: 2,
      name: 'OpenAI API',
      status: 'active',
      last_checked: '2024-01-10 14:30:00',
      requests_today: 890,
    },
    {
      id: 3,
      name: 'Weather API',
      status: 'error',
      last_checked: '2024-01-10 13:00:00',
      requests_today: 0,
    },
  ]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Settings sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Підтримка API</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Остання перевірка</TableCell>
              <TableCell>Запитів сьогодні</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apis.map((api) => (
              <TableRow key={api.id}>
                <TableCell>{api.name}</TableCell>
                <TableCell>
                  <Chip
                    label={api.status}
                    color={api.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{api.last_checked}</TableCell>
                <TableCell>{api.requests_today}</TableCell>
                <TableCell>
                  <Button size="small">Налаштувати</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SupportAPI;

