import React, { useState, useEffect } from 'react';
import { Avatar, Button, Typography, Box, Tab, Tabs, Grid, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme, IconButton } from '@mui/material';
import vkLogo from '../../images/vk-logo.png';
import avatarImage from '../../images/your-avatar-image.gif';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../pages/globalStyless.css';

import { API_BASE_URL } from '../../config';

// Кастомный компонент поля ввода
const CustomInputField = ({ label, value, onChange, name, icon: Icon, disabled, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const palette = {
    accent: '#6e47c2',
    accentLight: '#8b5cf6',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e2e8f0',
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

const SuperUserProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    pageBg: '#f5f7fa',
    cardBg: '#ffffff',
    border: '#e8edf2',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentDark: '#5a36a0',
    accentLight: '#8b5cf6',
    accentSoft: '#f3e8ff',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
    error: '#ef4444',
    errorSoft: '#fee2e2',
    success: '#28a745',
  };

  const [profile, setProfile] = useState({
    photo: avatarImage,
    firstName: 'Алексей',
    lastName: 'Смирнов',
    phoneNumber: '+7 999 123 45 67',
    email: 'superuser@volunteer.ru',
    city: 'Москва',
    state: 'WA',
    postcode: '31005',
    country: 'Россия',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setProfile({
          photo: data.avatar_image || avatarImage,
          firstName: data.user_name || 'Алексей',
          lastName: data.user_surname || 'Смирнов',
          email: data.email || 'superuser@volunteer.ru',
          city: data.city_name || 'Москва',
          country: data.country_name || 'Россия',
        });
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenDialog(false);
    console.log('Account deleted');
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const preventDefaultFocus = (e) => e.preventDefault();

  const handleLogoClick = (platform) => {
    switch (platform) {
      case 'vk':
        window.open('https://vk.com', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: palette.pageBg,
        minHeight: '100vh',
        p: isMobile ? 2 : 4,
      }}
    >
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
          Профиль суперпользователя
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Полный доступ ко всем функциям платформы
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        {/* Боковая панель */}
        <Box
          sx={{
            width: isMobile ? '100%' : '280px',
            p: 3,
            borderRadius: '20px',
            border: 'none',
            backgroundColor: palette.cardBg,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            textAlign: 'center',
          }}
        >
          <Avatar
            src={profile.photo}
            sx={{
              width: isMobile ? 100 : 140,
              height: isMobile ? 100 : 140,
              mb: 2,
              margin: '0 auto',
              border: `4px solid ${palette.accent}`,
              boxShadow: `0 4px 20px ${palette.accent}40`,
              '& img': { objectFit: 'cover' },
            }}
          />
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: palette.textPrimary, fontWeight: 700 }}>
            {`${profile.firstName} ${profile.lastName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: palette.accent, fontWeight: 500, mt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 16 }} /> Суперпользователь
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>Достижений</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: palette.accent }}>25</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>Баллов</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: palette.accent }}>15,890</Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box
              component="img"
              src={vkLogo}
              alt="VK"
              sx={{ cursor: 'pointer', width: isMobile ? 32 : 40, opacity: 0.7, '&:hover': { opacity: 1 } }}
              onClick={() => handleLogoClick('vk')}
            />
          </Box>
        </Box>

        {/* Основная секция */}
        <Box
          sx={{
            width: isMobile ? '100%' : 'calc(100% - 300px)',
            p: isMobile ? 2 : 4,
            borderRadius: '20px',
            border: 'none',
            backgroundColor: palette.cardBg,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': { backgroundColor: palette.accent, height: 3, borderRadius: 2 },
              '& .MuiTab-root': { color: palette.textSecondary, textTransform: 'none', fontWeight: 600, fontSize: '1rem' },
              '& .Mui-selected': { color: palette.accent },
            }}
            variant={isMobile ? 'scrollable' : 'standard'}
          >
            <Tab label="Профиль" onMouseDown={preventDefaultFocus} />
            <Tab label="Достижения" onMouseDown={preventDefaultFocus} />
            <Tab label="Системные настройки" onMouseDown={preventDefaultFocus} />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary }}>
                  Личная информация
                </Typography>
                {!isEditing && (
                  <IconButton
                    onClick={handleEditClick}
                    sx={{
                      backgroundColor: palette.accentSoft,
                      color: palette.accent,
                      '&:hover': { backgroundColor: palette.accentLight, color: 'white' },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomInputField
                    label="Имя"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    icon={PersonIcon}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInputField
                    label="Фамилия"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    icon={PersonIcon}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInputField
                    label="Номер телефона"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                    icon={PhoneIcon}
                    disabled={!isEditing}
                    type="tel"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInputField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    icon={EmailIcon}
                    disabled={!isEditing}
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInputField
                    label="Город"
                    name="city"
                    value={profile.city}
                    onChange={handleInputChange}
                    icon={LocationCityIcon}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInputField
                    label="Страна"
                    name="country"
                    value={profile.country}
                    onChange={handleInputChange}
                    icon={PublicIcon}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                {!isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleEditClick}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.gradientStart})`,
                          transform: 'translateY(-2px)',
                        },
                        textTransform: 'none',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      Редактировать профиль
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleDeleteAccount}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: palette.error,
                        color: palette.error,
                        '&:hover': {
                          borderColor: palette.error,
                          backgroundColor: palette.errorSoft,
                        },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                      startIcon={<DeleteIcon />}
                    >
                      Удалить аккаунт
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                        '&:hover': { background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.gradientStart})` },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                      startIcon={<SaveIcon />}
                    >
                      Сохранить изменения
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1.5,
                        color: palette.textPrimary,
                        borderColor: palette.border,
                        '&:hover': { borderColor: palette.accent, backgroundColor: palette.accentSoft },
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                      startIcon={<CloseIcon />}
                    >
                      Отмена
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ color: palette.textPrimary, fontWeight: 700, mb: 2 }}>Мои достижения</Typography>
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                      <Box sx={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: palette.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        🏆
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Супер-достижение {i}</Typography>
                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>Описание достижения</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ color: palette.textPrimary, fontWeight: 700, mb: 2 }}>Системные настройки</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Управление платформой</Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Настройки глобальных параметров системы</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Управление пользователями</Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Блокировка, разблокировка, назначение ролей</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Системные логи</Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Просмотр логов действий пользователей</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      {/* Диалоговое окно подтверждения удаления аккаунта */}
      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: 'none',
            backgroundColor: palette.cardBg,
          },
        }}
      >
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 700 }}>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: palette.textSecondary }}>Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: palette.textPrimary }}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperUserProfile;