import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/visit-history`);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Завантаження...</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Історія відвіданих місць
      </Typography>
      {history.length === 0 ? (
        <Typography color="text.secondary">Історія порожня</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Назва</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Дата відвідування</TableCell>
                <TableCell>Рейтинг</TableCell>
                <TableCell>Оцінка</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.history_id}>
                  <TableCell>{item.location_name}</TableCell>
                  <TableCell>
                    <Chip label={item.type} size="small" />
                  </TableCell>
                  <TableCell>
                    {new Date(item.visit_start).toLocaleDateString('uk-UA')}
                  </TableCell>
                  <TableCell>{item.average_rating || 'N/A'}</TableCell>
                  <TableCell>
                    {item.rating_given ? (
                      <Chip label={`${item.rating_given}/5`} color="primary" size="small" />
                    ) : (
                      'Не оцінено'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default UserHistory;

