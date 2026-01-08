import React from 'react';
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
  Box,
} from '@mui/material';
import { History } from '@mui/icons-material';

const AdminHistory = () => {
  const history = [
    {
      id: 1,
      user: 'user@example.com',
      location: 'Софійський собор',
      visit_date: '2024-01-10',
      rating: 5,
    },
    {
      id: 2,
      user: 'user2@example.com',
      location: 'Золоті ворота',
      visit_date: '2024-01-09',
      rating: 4,
    },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <History sx={{ mr: 1, fontSize: 40 }} color="primary" />
        <Typography variant="h5">Історія відвіданих місць</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Користувач</TableCell>
              <TableCell>Локація</TableCell>
              <TableCell>Дата відвідування</TableCell>
              <TableCell>Оцінка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.user}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.visit_date}</TableCell>
                <TableCell>
                  <Chip label={`${item.rating}/5`} color="primary" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminHistory;

