import React, { useState } from 'react';
import { Box, Drawer, List, ListItemText, Typography, IconButton, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme, ListItemButton, ListItemIcon, Container, TextField, InputAdornment } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import RegionAdminProfile from '../components/RegionAdmin/RegionAdminProfile';
import ManageVolunteers from '../components/RegionAdmin/ManageVolunteers';
import ManageEvents from '../components/RegionAdmin/ManageEvents';
import MessageDispatch from '../components/RegionAdmin/MessageDispatch';
import RegionalStatistics from '../components/RegionAdmin/RegionalStatistics';

const drawerWidth = 280;

// Кастомный компонент поля ввода
const CustomInputField = ({ label, value, onChange, name, icon: Icon, disabled, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const palette = {
    accent: '#6e47c2',
    accentLight: '#8b5cf6',
    accentSoft: '#f3e8ff',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e2e8f0',
    error: '#ef4444',
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: palette.textSecondary,
          mb: 0.75,
          ml: 0.5,
          fontSize: '0.8rem',
          letterSpacing: '0.3px',
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: `1.5px solid ${
            isFocused ? palette.accent : (isHovered ? palette.accentLight : palette.border)
          }`,
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          backgroundColor: disabled ? '#f8f9fa' : '#ffffff',
          '&:hover': {
            borderColor: palette.accentLight,
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {Icon && (
          <Box sx={{ pl: 1.5, display: 'flex', alignItems: 'center' }}>
            <Icon sx={{ color: isFocused ? palette.accent : palette.textSecondary, fontSize: 20 }} />
          </Box>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            color: palette.textPrimary,
            backgroundColor: 'transparent',
            borderRadius: '12px',
            transition: 'all 0.2s',
          }}
          placeholder={`Введите ${label.toLowerCase()}`}
        />
      </Box>
    </Box>
  );
};

const RegionAdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    accent: '#6e47c2',
    accentDark: '#5a36a0',
    accentLight: '#8b5cf6',
    accentSoft: '#f3e8ff',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e2e8f0',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
  };

  const [profile, setProfile] = useState({
    firstName: 'Анна',
    lastName: 'Иванова',
    phoneNumber: '+7 950 942 49 11',
    email: 'anna.ivanova@mail.ru',
    city: 'Иркутск',
    country: 'Россия',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return (
          <Box>
            {/* Hero секция */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                borderRadius: '20px',
                p: isMobile ? 3 : 4,
                mb: 4,
                color: 'white',
              }}
            >
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 800, mb: 1 }}>
                Профиль администратора региона
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Управляйте вашим профилем и достижениями
              </Typography>
            </Box>

            {/* Основной контент профиля */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
              {/* Левая панель - аватар и статистика */}
              <Box
                sx={{
                  width: isMobile ? '100%' : 280,
                  p: 3,
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 100 : 120,
                    height: isMobile ? 100 : 120,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                    margin: '0 auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h2" sx={{ color: 'white', fontWeight: 700 }}>
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary }}>
                  {`${profile.firstName} ${profile.lastName}`}
                </Typography>
                <Typography variant="body2" sx={{ color: palette.accent, fontWeight: 500, mt: 0.5 }}>
                  Администратор региона
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Достижений</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: palette.accent }}>8</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Баллов</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: palette.accent }}>3,280</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Правая панель - форма с кастомными полями */}
              <Box
                sx={{
                  flex: 1,
                  p: isMobile ? 3 : 4,
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 3 }}>
                  Личная информация
                </Typography>

                <CustomInputField
                  label="Имя"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  icon={PersonIcon}
                  disabled={!isEditing}
                />

                <CustomInputField
                  label="Фамилия"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  icon={PersonIcon}
                  disabled={!isEditing}
                />

                <CustomInputField
                  label="Номер телефона"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  icon={PhoneIcon}
                  disabled={!isEditing}
                  type="tel"
                />

                <CustomInputField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  icon={EmailIcon}
                  disabled={!isEditing}
                  type="email"
                />

                <CustomInputField
                  label="Город"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  icon={LocationCityIcon}
                  disabled={!isEditing}
                />

                <CustomInputField
                  label="Страна"
                  name="country"
                  value={profile.country}
                  onChange={handleInputChange}
                  icon={PublicIcon}
                  disabled={!isEditing}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleEditClick}
                        style={{
                          flex: 1,
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(110, 71, 194, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Редактировать профиль
                      </button>
                      <button
                        onClick={() => {}}
                        style={{
                          flex: 1,
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: `1.5px solid ${palette.error}`,
                          backgroundColor: 'transparent',
                          color: palette.error,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Удалить аккаунт
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        style={{
                          flex: 1,
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                        }}
                      >
                        Сохранить изменения
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{
                          flex: 1,
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: `1.5px solid ${palette.border}`,
                          backgroundColor: 'transparent',
                          color: palette.textPrimary,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                        }}
                      >
                        Отмена
                      </button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      case 'volunteers':
        return <ManageVolunteers />;
      case 'events':
        return <ManageEvents />;
      case 'messages':
        return <MessageDispatch />;
      case 'statistics':
        return <RegionalStatistics />;
      default:
        return <RegionAdminProfile />;
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
    { id: 'volunteers', label: 'Управление волонтёрами', icon: <GroupIcon /> },
    { id: 'events', label: 'Управление мероприятиями', icon: <EventIcon /> },
    { id: 'messages', label: 'Рассылка сообщений', icon: <MessageIcon /> },
    { id: 'statistics', label: 'Статистика по региону', icon: <BarChartIcon /> },
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
              }}
            >
              Администратор региона
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
      <Box component="main" sx={{ p: 2 }}>
        {renderContent()}
      </Box>

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
          boxShadow: '0 4px 12px rgba(110, 71, 194, 0.3)',
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
          <BottomNavigationAction label="Профиль" value="profile" icon={<AccountCircleIcon />} />
          <BottomNavigationAction label="Волонтёры" value="volunteers" icon={<GroupIcon />} />
          <BottomNavigationAction label="Мероприятия" value="events" icon={<EventIcon />} />
          <BottomNavigationAction label="Сообщения" value="messages" icon={<MessageIcon />} />
          <BottomNavigationAction label="Статистика" value="statistics" icon={<BarChartIcon />} />
        </BottomNavigation>
      </Drawer>
    </Box>
  );
};

export default RegionAdminPage;