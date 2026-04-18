import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, IconButton, TextField, Snackbar, Alert, useMediaQuery, useTheme, Divider } from '@mui/material';
import { Telegram } from '@mui/icons-material';
import { FaVk } from 'react-icons/fa';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmailIcon from '@mui/icons-material/Email';
import CopyrightIcon from '@mui/icons-material/Copyright';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const palette = {
    footerBg: '#1a1a2e',
    footerText: '#ffffff',
    footerTextSecondary: '#b0bec5',
    accent: '#6e47c2',
    accentDark: '#e85d2c',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const handleSubscribe = () => {
    if (!email) {
      setSnackbar({ open: true, message: 'Введите email для подписки', severity: 'warning' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbar({ open: true, message: 'Введите корректный email адрес', severity: 'error' });
      return;
    }
    console.log('Subscribed email:', email);
    setSnackbar({ open: true, message: 'Вы успешно подписались на рассылку!', severity: 'success' });
    setEmail('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: palette.footerBg,
        padding: isMobile ? '40px 20px 20px' : '60px 40px 30px',
        marginTop: 'auto',
        borderTop: `3px solid ${palette.accent}`,
      }}
    >
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Logo и описание */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
            <VolunteerActivismIcon sx={{ fontSize: 40, color: palette.accent }} />
            <Typography
              variant="h4"
              sx={{
                color: palette.footerText,
                fontWeight: 800,
                letterSpacing: '2px',
                background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Волонтёрский портал
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: palette.footerTextSecondary,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Объединяем волонтёров и организаторов для создания лучшего мира.
            Вместе мы сила!
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

        {/* Основной контент */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: isMobile ? 4 : 6,
            mb: 4,
          }}
        >
          {/* Подписка на рассылку */}
          <Box sx={{ flex: 2 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: palette.footerText,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <EmailIcon sx={{ color: palette.accent }} />
              Подписка на новости
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 2.5,
                color: palette.footerTextSecondary,
                lineHeight: 1.5,
              }}
            >
              Подпишитесь на нашу рассылку и узнавайте о новостях и новых мероприятиях первыми
            </Typography>
            <Box sx={{ position: 'relative', maxWidth: '400px' }}>
              <TextField
                variant="outlined"
                placeholder="Ваш email адрес"
                size="medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: palette.accent,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: palette.accent,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: palette.footerText,
                    py: 1.5,
                    '&::placeholder': {
                      color: palette.footerTextSecondary,
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSubscribe}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: palette.accent,
                  '&:hover': {
                    color: palette.accentDark,
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Ссылки - О нас */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: palette.footerText,
                fontWeight: 700,
              }}
            >
              О нас
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                component={Link}
                to="/about"
                sx={{
                  color: palette.footerTextSecondary,
                  justifyContent: 'flex-start',
                  padding: 0,
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    color: palette.accent,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                О платформе
              </Button>
              <Button
                component={Link}
                to="/events"
                sx={{
                  color: palette.footerTextSecondary,
                  justifyContent: 'flex-start',
                  padding: 0,
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    color: palette.accent,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Мероприятия
              </Button>
              <Button
                component={Link}
                to="/contact"
                sx={{
                  color: palette.footerTextSecondary,
                  justifyContent: 'flex-start',
                  padding: 0,
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    color: palette.accent,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Контакты
              </Button>
            </Box>
          </Box>

          {/* Ссылки - Правовая информация */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: palette.footerText,
                fontWeight: 700,
              }}
            >
              Правовая информация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                component={Link}
                to="/terms"
                sx={{
                  color: palette.footerTextSecondary,
                  justifyContent: 'flex-start',
                  padding: 0,
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    color: palette.accent,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Пользовательское соглашение
              </Button>
              <Button
                component={Link}
                to="/privacy"
                sx={{
                  color: palette.footerTextSecondary,
                  justifyContent: 'flex-start',
                  padding: 0,
                  textTransform: 'none',
                  fontWeight: 400,
                  '&:hover': {
                    color: palette.accent,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Политика конфиденциальности
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        {/* Социальные сети и копирайт */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              component="a"
              href="https://vk.com"
              target="_blank"
              sx={{
                color: palette.footerTextSecondary,
                '&:hover': {
                  color: palette.accent,
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.2s',
              }}
            >
              <FaVk size={24} />
            </IconButton>
            <IconButton
              component="a"
              href="https://t.me"
              target="_blank"
              sx={{
                color: palette.footerTextSecondary,
                '&:hover': {
                  color: palette.accent,
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.2s',
              }}
            >
              <Telegram />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              sx={{
                color: palette.footerTextSecondary,
                '&:hover': {
                  color: palette.accent,
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.2s',
              }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://youtube.com"
              target="_blank"
              sx={{
                color: palette.footerTextSecondary,
                '&:hover': {
                  color: palette.accent,
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.2s',
              }}
            >
              <YouTubeIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: palette.footerTextSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <CopyrightIcon sx={{ fontSize: 14 }} />
            {currentYear} Волонтёрский портал. Все права защищены.
          </Typography>
        </Box>
      </Box>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;