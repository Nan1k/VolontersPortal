import React, { useState } from 'react';
import { Box, Drawer, List, ListItemText, Typography, IconButton, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme, ListItemButton, ListItemIcon, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import SuperUserProfile from '../components/SuperUser/SuperUserProfile';
import CreateRanks from '../components/SuperUser/CreateRanks';
import CreateCategories from '../components/SuperUser/CreateCategories';
import CreateAwards from '../components/SuperUser/CreateAwards';
import ManageVolunteers from '../components/CityAdmin/ManageVolunteers';
import ManageEvents from '../components/CityAdmin/ManageEvents';
import MessageBroadcast from '../components/CityAdmin/MessageBroadcast';
import CityStatistics from '../components/CityAdmin/CityStatistics';

const drawerWidth = 280;

const SuperUserPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    accent: '#6e47c2',
    accentDark: '#e85d2c',
    accentSoft: '#fff5f0',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e8edf2',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <SuperUserProfile />;
      case 'ranks':
        return <CreateRanks />;
      case 'categories':
        return <CreateCategories />;
      case 'awards':
        return <CreateAwards />;
      case 'volunteers':
        return <ManageVolunteers />;
      case 'events':
        return <ManageEvents />;
      case 'messages':
        return <MessageBroadcast />;
      case 'statistics':
        return <CityStatistics />;
      default:
        return <SuperUserProfile />;
    }
  };

  const handleSectionChange = (newSection) => {
    setSelectedSection(newSection);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Настройки профиля', icon: <AccountCircleIcon /> },
    { id: 'ranks', label: 'Создание рангов', icon: <StarIcon /> },
    { id: 'categories', label: 'Создание категорий', icon: <CategoryIcon /> },
    { id: 'awards', label: 'Создание наград', icon: <BadgeIcon /> },
    { id: 'volunteers', label: 'Управление волонтёрами', icon: <GroupIcon /> },
    { id: 'events', label: 'Управление мероприятиями', icon: <EventIcon /> },
    { id: 'messages', label: 'Рассылка сообщений', icon: <MessageIcon /> },
    { id: 'statistics', label: 'Глобальная статистика', icon: <BarChartIcon /> },
  ];

  // Для десктопа используем стандартный layout с Drawer
  if (!isMobile) {
    return (
      <Box sx={{ display: 'flex', minHeight: '70vh', backgroundColor: '#f5f7fa' }}>
        {/* Десктопный Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              position: 'static',
              height: '70vh',
              overflowY: 'auto',
            },
          }}
        >
          <Box sx={{ p: 3, borderBottom: `1px solid ${palette.border}`, mt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 795,
                background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SecurityIcon sx={{ color: palette.accent }} />
              Суперпользователь
            </Typography>
          </Box>
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                sx={{
                  mx: 1.5,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: selectedSection === item.id ? palette.accentSoft : 'transparent',
                  '&:hover': {
                    backgroundColor: palette.accentSoft,
                  },
                }}
              >
                <ListItemIcon sx={{ color: selectedSection === item.id ? palette.accent : palette.textSecondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: selectedSection === item.id ? 600 : 400,
                      color: selectedSection === item.id ? palette.textPrimary : palette.textSecondary,
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        {/* Основной контент - без фиксированных отступов */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflowX: 'auto',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
            {renderContent()}
          </Container>
        </Box>
      </Box>
    );
  }

  // Мобильная версия
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa', pb: 8 }}>
      {/* Основной контент для мобильных */}
      <Box component="main" sx={{ p: 2 }}>
        {renderContent()}
      </Box>

      {/* Мобильная навигация */}
      <>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1201,
            backgroundColor: palette.accent,
            color: 'white',
            '&:hover': { backgroundColor: palette.accentDark },
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: '#ffffff',
            },
          }}
        >
          <BottomNavigation
            showLabels
            value={selectedSection}
            onChange={(event, newValue) => handleSectionChange(newValue)}
            sx={{
              py: 1,
              '& .MuiBottomNavigationAction-root': {
                color: palette.textSecondary,
                '&.Mui-selected': {
                  color: palette.accent,
                },
              },
            }}
          >
            {menuItems.map((item) => (
              <BottomNavigationAction
                key={item.id}
                label={item.label}
                value={item.id}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Drawer>
      </>
    </Box>
  );
};

export default SuperUserPage;