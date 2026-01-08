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
  Support,
  Cloud,
  BugReport,
  Storage,
  Settings,
  Monitor,
  ExitToApp,
  List as ListIcon,
  Update,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import SupportTickets from '../components/support/SupportTickets';
import SupportLogs from '../components/support/SupportLogs';
import SupportBackups from '../components/support/SupportBackups';
import SupportMonitoring from '../components/support/SupportMonitoring';
import SupportErrors from '../components/support/SupportErrors';
import SupportUpdates from '../components/support/SupportUpdates';
import SupportAPI from '../components/support/SupportAPI';
import SupportCloudFire from '../components/support/SupportCloudFire';

const drawerWidth = 240;

const SupportDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Тікети підтримки', icon: <Support />, path: '/support/tickets' },
    { text: 'Логи системи', icon: <ListIcon />, path: '/support/logs' },
    { text: 'Моніторинг серверів', icon: <Monitor />, path: '/support/monitoring' },
    { text: 'Управління помилками', icon: <BugReport />, path: '/support/errors' },
    { text: 'Бекапи', icon: <Storage />, path: '/support/backups' },
    { text: 'Оновлення ПЗ', icon: <Update />, path: '/support/updates' },
    { text: 'Підтримка API', icon: <Settings />, path: '/support/api' },
    { text: 'CloudFire', icon: <Cloud />, path: '/support/cloudfire' },
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
            AI Tourism Companion - Технічна підтримка
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
            <Route path="tickets" element={<SupportTickets />} />
            <Route path="logs" element={<SupportLogs />} />
            <Route path="monitoring" element={<SupportMonitoring />} />
            <Route path="errors" element={<SupportErrors />} />
            <Route path="backups" element={<SupportBackups />} />
            <Route path="updates" element={<SupportUpdates />} />
            <Route path="api" element={<SupportAPI />} />
            <Route path="cloudfire" element={<SupportCloudFire />} />
            <Route path="*" element={<SupportTickets />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default SupportDashboard;

