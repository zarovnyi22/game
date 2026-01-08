import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    switch (user?.role_name) {
      case 'Admin':
        return '/admin';
      case 'Support':
        return '/support';
      default:
        return '/user';
    }
  };

  React.useEffect(() => {
    if (user) {
      navigate(getDashboardRoute(), { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Tourism Companion
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />}>
            Вийти
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;

