import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from './logo192.png';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Fade,
  Avatar,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ChatIcon from '@mui/icons-material/Chat';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppTheme } from './ThemeContext';
import { useAuth } from '../Auth/AuthContext';
import './Navbar.css';
import './themes.css';
import '../../pages/globalStyless.css';

const Navbar = ({ socket }) => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useAppTheme();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  
  const themeIcon = theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />;
  const themeIconTitle = theme === 'light' ? 'Тёмная тема' : 'Светлая тема';
  const themeObject = useTheme();
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const palette = {
    light: {
      navbarBg: 'linear-gradient(135deg, #6e47c2 0%, #8b5cf6 100%)',
      navbarBgHover: 'rgba(255, 255, 255, 0.2)',
      text: '#ffffff',
      accent: '#6f00ff',
    },
    dark: {
      navbarBg: 'linear-gradient(135deg, #1a3a15 0%, #2a5a20 100%)',
      navbarBgHover: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      accent: '#6f00ff',
    }
  };

  const currentPalette = theme === 'light' ? palette.light : palette.dark;

  useEffect(() => {
    if (!socket) return;
    socket.on('unread_messages_count', (data) => {
      console.log(`Получено количество непрочитанных сообщений: ${data.count}`);
      setUnreadMessagesCount(data.count);
    });
    return () => {
      socket.off('unread_messages_count');
    };
  }, [socket]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (socket) socket.disconnect();
    navigate('/login');
    handleCloseMenu();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const getInitials = () => {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      className="nav-wrapper"
      sx={{
        background: currentPalette.navbarBg,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: 'none',
        py: 0.5,
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
        {/* Логотип и бренд */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Link to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoImage}
              alt="Logo"
              className="logo-image"
              style={{ height: 44, width: 'auto' }}
            />
          </Link>
          <Typography
            variant="h6"
            className="brand-name"
            sx={{
              fontWeight: 800,
              color: currentPalette.text,
              letterSpacing: '0.5px',
              display: { xs: 'none', sm: 'block' },
              fontSize: '1.3rem',
            }}
          >
            Волонтёрский портал
          </Typography>
        </Box>

        {/* Центральная часть - пустое пространство теперь заполнено */}
        <Box sx={{ flex: 1 }} />

        {/* Десктопные кнопки */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Баланс - с подписью */}
            <Tooltip title="Ваш баланс баллов">
              <Button
                color="inherit"
                aria-label="balance"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: currentPalette.navbarBgHover,
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.2s',
                  textTransform: 'none',
                  fontWeight: 600,
                  gap: 1,
                }}
                startIcon={
                  <Badge
                    badgeContent={1500}
                    color="secondary"
                    max={10000}
                    showZero
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#bebebe',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 18,
                        minWidth: 18,
                      }
                    }}
                  >
                    <AttachMoneyIcon sx={{ fontSize: 24 }} />
                  </Badge>
                }
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Баланс
                </Typography>
              </Button>
            </Tooltip>

            {/* Чат - с подписью */}
            <Tooltip title="Сообщения">
              <Button
                color="inherit"
                aria-label="chat"
                component={Link}
                to="/chatpage"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: currentPalette.navbarBgHover,
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.2s',
                  textTransform: 'none',
                  fontWeight: 600,
                  gap: 1,
                }}
                startIcon={
                  <Badge
                    badgeContent={unreadMessagesCount > 0 ? unreadMessagesCount : null}
                    color="error"
                    max={99}
                    showZero
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#bebebe',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 18,
                        minWidth: 18,
                      }
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 24 }} />
                  </Badge>
                }
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Чат
                </Typography>
              </Button>
            </Tooltip>

            {/* Тема - с подписью */}
            <Tooltip title={themeIconTitle}>
              <Button
                color="inherit"
                onClick={toggleTheme}
                className="theme-switcher"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: currentPalette.navbarBgHover,
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.2s',
                  textTransform: 'none',
                  fontWeight: 600,
                  gap: 1,
                }}
                startIcon={themeIcon}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
                </Typography>
              </Button>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'rgba(255,255,255,0.3)', mx: 0.5, height: 40 }} />

            {/* Кнопки авторизации - увеличены */}
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/profile"
                  sx={{
                    py: 1.2,
                    px: 3,
                    borderRadius: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      backgroundColor: currentPalette.navbarBgHover,
                      transform: 'scale(1.02)',
                    },
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    gap: 1,
                  }}
                  startIcon={<AccountCircleIcon />}
                >
                  Профиль
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    py: 1.2,
                    px: 3,
                    borderRadius: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(220, 53, 69, 0.3)',
                      transform: 'scale(1.02)',
                    },
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    gap: 1,
                  }}
                  startIcon={<LogoutIcon />}
                >
                  Выйти
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    py: 1.2,
                    px: 3.5,
                    borderRadius: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      backgroundColor: currentPalette.navbarBgHover,
                      transform: 'scale(1.02)',
                    },
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    gap: 1,
                  }}
                  startIcon={<LoginIcon />}
                >
                  Войти
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{
                    py: 1.2,
                    px: 3.5,
                    borderRadius: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      transform: 'scale(1.02)',
                    },
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    gap: 1,
                  }}
                  startIcon={<AppRegistrationIcon />}
                >
                  Регистрация
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Мобильное меню */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={themeIconTitle}>
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{
                  '&:hover': {
                    backgroundColor: currentPalette.navbarBgHover,
                  },
                }}
              >
                {themeIcon}
              </IconButton>
            </Tooltip>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{
                '&:hover': {
                  backgroundColor: currentPalette.navbarBgHover,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              TransitionComponent={Fade}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 220,
                  background: theme === 'light' ? '#fff' : '#2c2c3e',
                  color: theme === 'light' ? '#1a1a2e' : '#fff',
                }
              }}
            >
              <MenuItem component={Link} to="/profile" onClick={handleMobileMenuClose}>
                <AccountCircleIcon sx={{ mr: 1, color: '#bebebe' }} /> Профиль
              </MenuItem>
              <MenuItem component={Link} to="/chatpage" onClick={handleMobileMenuClose}>
                <Badge
                  badgeContent={unreadMessagesCount > 0 ? unreadMessagesCount : null}
                  color="error"
                  sx={{ mr: 1 }}
                >
                  <ChatIcon sx={{ color: '#bebebe' }} />
                </Badge>
                Чат
              </MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>
                <AttachMoneyIcon sx={{ mr: 1, color: '#bebebe' }} /> Баланс: 1500
              </MenuItem>
              <Divider sx={{ backgroundColor: theme === 'light' ? '#e8edf2' : 'rgba(255,255,255,0.1)' }} />
              {isLoggedIn ? (
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1, color: '#bebebe' }} /> Выйти
                </MenuItem>
              ) : (
                <>
                  <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                    <LoginIcon sx={{ mr: 1, color: '#bebebe' }} /> Войти
                  </MenuItem>
                  <MenuItem component={Link} to="/register" onClick={handleMobileMenuClose}>
                    <AppRegistrationIcon sx={{ mr: 1, color: '#bebebe' }} /> Регистрация
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;