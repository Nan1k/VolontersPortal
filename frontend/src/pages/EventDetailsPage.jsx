import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { Box, Typography, Button, CircularProgress, Card, CardMedia, Snackbar, Chip, Grid, Paper, Divider, useMediaQuery, useTheme } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventCard from '../components/EventCards/EventCard';
import EventMap from '../components/Map/EventMap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { API_BASE_URL } from '../config';

function EventDetails() {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const palette = {
    accent: '#6e47c2',
    accentDark: '#e85d2c',
    accentSoft: '#fff5f0',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e8edf2',
    success: '#28a745',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const [event, setEvent] = useState(null);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events/${id}/`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных события:', error);
        setLoading(false);
      }
    };

    const fetchRecommendedEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events/`);
        const eventData = response.data.map(event => ({
          id: event.event_id,
          name: event.event_name,
          description: event.full_description,
          shortDescription: event.short_description,
          requiredPeople: event.required_volunteers,
          registeredPeople: event.registered_volunteers,
          points: event.participation_points,
          awards: event.rewards,
          startDate: event.start_date,
          endDate: event.end_date,
          country: event.country_name,
          city: event.city_name,
          category: event.category_name,
          imageUrl: event.image,
          latitude: event.latitude,
          longitude: event.longitude,
        }));
        setRecommendedEvents(eventData);
      } catch (error) {
        console.error('Ошибка при загрузке рекомендованных событий:', error);
      }
    };

    fetchEventDetails();
    fetchRecommendedEvents();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_BASE_URL}/event-register/`, {
        event_id: event.event_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.message === "Вы уже записаны на это мероприятие") {
        setSnackbarMessage('Вы уже записаны на это мероприятие');
      } else {
        setSnackbarMessage('Вы успешно записаны на мероприятие!');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Ошибка при записи на мероприятие:', error);
      setSnackbarMessage('Ошибка при записи на мероприятие');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const settings = {
    dots: true,
    infinite: recommendedEvents.length > 3,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    arrows: true,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: palette.accent }} />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Мероприятие не найдено</Typography>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: isMobile ? 2 : 4 }}>
        {/* Кнопка назад */}
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: palette.textSecondary, '&:hover': { color: palette.accent } }}
        >
          Назад к мероприятиям
        </Button>

        {/* Основная информация */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <Grid container>
            {/* Левая колонка - изображение */}
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 0, height: '100%' }}>
                <CardMedia
                  component="img"
                  image={event.image || 'https://via.placeholder.com/500'}
                  alt={event.event_name}
                  sx={{ height: '100%', minHeight: 300, objectFit: 'cover' }}
                />
              </Card>
            </Grid>

            {/* Правая колонка - информация */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: isMobile ? 3 : 4 }}>
                <Chip
                  label={event.category_name || 'Без категории'}
                  sx={{
                    backgroundColor: palette.accentSoft,
                    color: palette.accent,
                    fontWeight: 600,
                    mb: 2,
                  }}
                />
                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 800, color: palette.textPrimary, mb: 2 }}>
                  {event.event_name}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlaceIcon sx={{ color: palette.accent }} />
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                      {event.country_name}, {event.city_name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: palette.accent }} />
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ color: palette.accent }} />
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                      Участников: {event.registered_volunteers || 0} / {event.required_volunteers}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: palette.accent }} />
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                      Баллов: {event.participation_points}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary, mb: 1 }}>
                  Краткое описание
                </Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 3 }}>
                  {event.short_description}
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleRegister}
                  fullWidth={isMobile}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                    '&:hover': { background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.gradientStart})` },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Записаться на мероприятие
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Карта */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
            p: isMobile ? 2 : 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 2 }}>
            Местоположение
          </Typography>
          <EventMap events={[{
            id: event.event_id,
            name: event.event_name,
            description: event.full_description,
            latitude: event.latitude,
            longitude: event.longitude,
          }]} />
        </Paper>

        {/* Полное описание */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: isMobile ? 3 : 4,
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 2 }}>
            Полное описание
          </Typography>
          <Typography variant="body1" sx={{ color: palette.textSecondary, lineHeight: 1.6 }}>
            {event.full_description}
          </Typography>
          {event.rewards && (
            <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: palette.accentSoft }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: palette.accent, mb: 1 }}>
                🎁 Награды
              </Typography>
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                {event.rewards}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Рекомендованные мероприятия */}
        {recommendedEvents.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 3 }}>
              Похожие мероприятия
            </Typography>
            <Slider {...settings}>
              {recommendedEvents.filter(e => e.id !== event.event_id).slice(0, 6).map(recEvent => (
                <Box key={recEvent.id} sx={{ px: 1 }}>
                  <EventCard event={recEvent} />
                </Box>
              ))}
            </Slider>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accent, color: 'white' }}>
          {snackbarMessage}
        </Paper>
      </Snackbar>
    </Box>
  );
}

export default EventDetails;