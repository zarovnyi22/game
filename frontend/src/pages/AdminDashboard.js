import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Button,
} from '@mui/material';
import {
  Security,
  Route as RouteIcon,
  History,
  Visibility,
  ExitToApp,
  LocationOn,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AdminSafety from '../components/admin/AdminSafety';
import AdminRoutes from '../components/admin/AdminRoutes';
import AdminHistory from '../components/admin/AdminHistory';
import AdminAR from '../components/admin/AdminAR';
import AdminMonitoring from '../components/admin/AdminMonitoring';
import AdminFeedback from '../components/admin/AdminFeedback';

const drawerWidth = 240;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Моніторинг локацій', icon: <LocationOn />, path: '/admin/monitoring' },
    { text: 'Оцінка безпеки району', icon: <Security />, path: '/admin/safety' },
    { text: 'Маршрути', icon: <RouteIcon />, path: '/admin/routes' },
    { text: 'AR-реконструкція', icon: <Visibility />, path: '/admin/ar' },
    { text: 'Історія відвіданих місць', icon: <History />, path: '/admin/history' },
    { text: 'Відгуки', icon: <Star />, path: '/admin/feedback' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AI Tourism Companion - Адміністратор
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>
            Вийти
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Routes>
            <Route path="monitoring" element={<AdminMonitoring />} />
            <Route path="safety" element={<AdminSafety />} />
            <Route path="routes" element={<AdminRoutes />} />
            <Route path="ar" element={<AdminAR />} />
            <Route path="history" element={<AdminHistory />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="*" element={<AdminMonitoring />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

