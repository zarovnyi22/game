import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Button,
} from '@mui/material';
import {
  Person,
  Route as RouteIcon,
  History,
  Settings,
  Chat,
  Navigation,
  BookOnline,
  ExitToApp,
  Translate,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/user/UserProfile';
import UserRoutes from '../components/user/UserRoutes';
import UserHistory from '../components/user/UserHistory';
import UserSettings from '../components/user/UserSettings';
import UserChatBot from '../components/user/UserChatBot';
import UserNavigation from '../components/user/UserNavigation';
import UserBookings from '../components/user/UserBookings';
import UserTranslation from '../components/user/UserTranslation';
import UserAR from '../components/user/UserAR';

const drawerWidth = 240;

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Профіль', icon: <Person />, path: '/user/profile' },
    { text: 'Маршрути', icon: <RouteIcon />, path: '/user/routes' },
    { text: 'Історія відвіданих місць', icon: <History />, path: '/user/history' },
    { text: 'Налаштування', icon: <Settings />, path: '/user/settings' },
    { text: 'AI Чат-бот', icon: <Chat />, path: '/user/chat' },
    { text: 'Навігація', icon: <Navigation />, path: '/user/navigation' },
    { text: 'Бронювання', icon: <BookOnline />, path: '/user/bookings' },
    { text: 'Перекладач', icon: <Translate />, path: '/user/translation' },
    { text: 'AR-реконструкція', icon: <Visibility />, path: '/user/ar' },
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
            AI Tourism Companion - Користувач
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
            <Route path="profile" element={<UserProfile />} />
            <Route path="routes" element={<UserRoutes />} />
            <Route path="history" element={<UserHistory />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="chat" element={<UserChatBot />} />
            <Route path="navigation" element={<UserNavigation />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="translation" element={<UserTranslation />} />
            <Route path="ar" element={<UserAR />} />
            <Route path="*" element={<UserProfile />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default UserDashboard;

