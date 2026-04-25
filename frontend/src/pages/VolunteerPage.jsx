import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Drawer, List, ListItemText, Typography, IconButton, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme, ListItemButton, ListItemIcon, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import VolunteerProfile from '../components/Volunteer/VolunteerProfile';
import Friends from '../components/Volunteer/Friends';
import Groups from '../components/Volunteer/Groups';
import VolunteerAchievements from '../components/Volunteer/VolunteerAchievements';
import VolunteerEvents from '../components/Volunteer/VolunteerEvents';
import { API_BASE_URL } from '../config';

const drawerWidth = 280;

const friends = [{ id: 1, name: 'Анна Иванова', status: 'online', points: 1250 }];
const groups = [{ id: 1, name: 'Эко-волонтёры', members: 45, category: 'Экология' }];
const rank = 'Эксперт';
const awards = ['Золотой волонтёр', 'Лидер месяца'];
const completedEvents = ['Эко-субботник', 'Помощь приюту'];

const VolunteerPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [volunteerPoints, setVolunteerPoints] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchVolunteerBalance = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setVolunteerPoints(0);
      return;
    }
    try {
      const { data } = await axios.get(`${API_BASE_URL}/volunteer/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteerPoints(typeof data?.balance === 'number' ? data.balance : 0);
    } catch {
      setVolunteerPoints(0);
    }
  }, []);

  useEffect(() => {
    fetchVolunteerBalance();
    const onBal = () => fetchVolunteerBalance();
    window.addEventListener('volunteer-balance-changed', onBal);
    return () => window.removeEventListener('volunteer-balance-changed', onBal);
  }, [fetchVolunteerBalance]);

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
        return <VolunteerProfile />;
      case 'achievements':
        return (
          <VolunteerAchievements rank={rank} points={volunteerPoints} awards={awards} completedEvents={completedEvents} />
        );
      case 'events':
        return <VolunteerEvents />;
      case 'friends':
        return <Friends friends={friends} />;
      case 'groups':
        return <Groups groups={groups} />;
      default:
        return <VolunteerProfile />;
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
    { id: 'achievements', label: 'Достижения', icon: <EmojiEventsIcon /> },
    { id: 'events', label: 'Мероприятия на карте', icon: <EventIcon /> },
    { id: 'friends', label: 'Друзья', icon: <PeopleIcon /> },
    { id: 'groups', label: 'Группы', icon: <GroupIcon /> },
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
                fontWeight: 800,
                background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <VolunteerActivismIcon sx={{ color: palette.accent }} />
              Волонтёр
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

export default VolunteerPage;