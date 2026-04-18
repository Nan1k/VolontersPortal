import React, { useState } from 'react';
import { Avatar, Button, Typography, Box, Tab, Tabs, Grid, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme, Paper, IconButton } from '@mui/material';
import vkLogo from '../../images/vk-logo.png';
import avatarImage from '../../images/your-avatar-image.gif';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

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

const RegionAdminProfile = () => {
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
  };

  const [profile, setProfile] = useState({
    photo: avatarImage,
    firstName: 'Анна',
    lastName: 'Иванова',
    phoneNumber: '+7 950 942 49 11',
    email: 'anna.ivanova@mail.ru',
    city: 'Иркутск',
    state: 'WA',
    postcode: '31005',
    country: 'Россия',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
    <Box>
      {/* Hero секция - градиентный блок */}
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

      {/* Основной контент */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        {/* Боковая панель */}
        <Paper
          elevation={0}
          sx={{
            width: isMobile ? '100%' : 280,
            p: 3,
            borderRadius: 3,
            border: 'none',
            backgroundColor: palette.cardBg,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            textAlign: 'center',
          }}
        >
          <Avatar
            src={profile.photo}
            sx={{
              width: isMobile ? 100 : 120,
              height: isMobile ? 100 : 120,
              mb: 2,
              margin: '0 auto',
              border: `3px solid ${palette.accent}`,
            }}
          />
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 700, color: palette.textPrimary }}>
            {`${profile.firstName} ${profile.lastName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: palette.accent, fontWeight: 500, mt: 0.5 }}>
            Администратор региона
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>Достижений</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: palette.accent }}>8</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>Баллов</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: palette.accent }}>3,280</Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box
              component="img"
              src={vkLogo}
              alt="VK"
              sx={{ cursor: 'pointer', width: 32, opacity: 0.7, '&:hover': { opacity: 1 } }}
              onClick={() => handleLogoClick('vk')}
            />
          </Box>
        </Paper>

        {/* Основная секция */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: isMobile ? 2 : 4,
            borderRadius: 3,
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
              '& .MuiTab-root': { color: palette.textSecondary, textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: palette.accent },
            }}
          >
            <Tab label="Профиль" onMouseDown={preventDefaultFocus} />
            <Tab label="Достижения" onMouseDown={preventDefaultFocus} />
            <Tab label="Регионы" onMouseDown={preventDefaultFocus} />
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

              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                {!isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleEditClick}
                      sx={{
                        flex: 1,
                        py: 1.5,
                        borderRadius: 2,
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
                        py: 1.5,
                        borderRadius: 2,
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
                        py: 1.5,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.gradientStart})`,
                        },
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
                        py: 1.5,
                        borderRadius: 2,
                        borderColor: palette.border,
                        color: palette.textPrimary,
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
              <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 2 }}>Мои достижения</Typography>
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: palette.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        🏆
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Достижение {i}</Typography>
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
              <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 2 }}>Управляемые регионы</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Сибирский федеральный округ</Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Иркутская область, Новосибирская область, Красноярский край</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>Дальневосточный федеральный округ</Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>Приморский край, Хабаровский край</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Диалог подтверждения */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle sx={{ fontWeight: 700 }}>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegionAdminProfile;