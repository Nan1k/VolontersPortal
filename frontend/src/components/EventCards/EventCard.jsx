import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Snackbar, useMediaQuery, useTheme, Button, Chip, Fade, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

function EventCard({ event }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const palette = {
    pageBg: '#f5f7fa',
    cardBg: '#ffffff',
    border: '#e8edf2',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentDark: '#8b5cf6',
    accentSoft: '#fff5f0',
    error: '#dc3545',
    warning: '#ffc107',
    success: '#28a745',
    info: '#17a2b8',
  };

  const handleDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Дата не указана';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Дата не указана';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

  const getEventStatus = () => {
    if (!event.startDate || !event.endDate) return 'pending';
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  const getStatusConfig = () => {
    const status = getEventStatus();
    switch (status) {
      case 'upcoming':
        return { label: 'Предстоит', color: palette.info, bgColor: '#e3f2fd', icon: '📅' };
      case 'ongoing':
        return { label: 'Идёт сейчас', color: palette.success, bgColor: '#e8f5e9', icon: '🔴' };
      case 'completed':
        return { label: 'Завершено', color: palette.textSecondary, bgColor: palette.accentSoft, icon: '✅' };
      default:
        return { label: 'Ожидается', color: palette.warning, bgColor: '#fff3e0', icon: '⏳' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <>
      <Fade in={true} timeout={300}>
        <Card
          sx={{
            width: isMobile ? '100%' : 320,
            mb: 3,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            border: 'none',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            cursor: 'pointer',
            backgroundColor: palette.cardBg,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
            }
          }}
          onClick={handleDetails}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Статус мероприятия */}
          <Chip
            label={statusConfig.label}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              backgroundColor: statusConfig.bgColor,
              color: statusConfig.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              backdropFilter: 'blur(4px)',
            }}
            icon={<span>{statusConfig.icon}</span>}
          />
          <CardMedia
            component="img"
            alt={event.name}
            image={event.imageUrl || '/placeholder-event.jpg'}
            sx={{
              objectFit: 'cover',
              aspectRatio: '4/3',
              transition: 'transform 0.4s ease-in-out',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Оверлей при наведении */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 107, 53, 0.85)',
              color: 'white',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              zIndex: 1,
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <VisibilityIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Подробнее
            </Typography>
          </Box>
          <CardContent sx={{ p: 2 }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: palette.textPrimary,
                fontSize: '1rem',
                mb: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {event.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PlaceIcon sx={{ mr: 1, color: palette.accent, fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                {event.city || 'Город не указан'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarTodayIcon sx={{ mr: 1, color: palette.accent, fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </Typography>
            </Box>
            {event.required_volunteers && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1, color: palette.accent, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                  Участников: {event.required_volunteers}
                </Typography>
              </Box>
            )}
            {event.participation_points && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmojiEventsIcon sx={{ mr: 1, color: palette.accent, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                  Баллов: {event.participation_points}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default EventCard;