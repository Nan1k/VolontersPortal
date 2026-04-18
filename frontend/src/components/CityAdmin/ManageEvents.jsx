import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Fade,
  Grow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import EventMapCreate from '../Map/EventMapCreate.jsx';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const ManageEvents = () => {
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
    accentDark: '#e85d2c',
    accentSoft: '#fff5f0',
    error: '#dc3545',
    errorSoft: '#fef2f2',
    success: '#28a745',
    info: '#17a2b8',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    requiredPeople: '',
    points: '',
    awards: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    category: '',
    image: '',
    latitude: '',
    longitude: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEvents(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
        setSnackbar({ open: true, message: 'Ошибка при загрузке мероприятий', severity: 'error' });
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEvent({ ...newEvent, image: e.target.result });
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBaseUrl}/events/`, {
        event_name: newEvent.name,
        short_description: newEvent.shortDescription,
        full_description: newEvent.fullDescription,
        start_date: newEvent.startDate,
        end_date: newEvent.endDate,
        category_name: newEvent.category,
        required_volunteers: newEvent.requiredPeople,
        participation_points: newEvent.points,
        rewards: newEvent.awards,
        image: newEvent.image,
        latitude: newEvent.latitude,
        longitude: newEvent.longitude
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await axios.get(`${apiBaseUrl}/events/`);
      setEvents(response.data);
      setNewEvent({
        name: '',
        shortDescription: '',
        fullDescription: '',
        requiredPeople: '',
        points: '',
        awards: '',
        image: '',
        startDate: '',
        endDate: '',
        category: '',
        latitude: '',
        longitude: ''
      });
      setImagePreview('');
      setSnackbar({ open: true, message: 'Мероприятие успешно создано!', severity: 'success' });
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Ошибка при создании мероприятия', severity: 'error' });
    }
  };

  const handleCoordinatesChange = (coords) => {
    setNewEvent(prev => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude
    }));
  };

  const handleDeleteClick = (id) => {
    setSelectedEventId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/events/${selectedEventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents((prev) => prev.filter((event) => event.event_id !== selectedEventId));
      setSnackbar({ open: true, message: 'Мероприятие удалено', severity: 'success' });
    } catch (error) {
      console.error('Ошибка при удалении мероприятия:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Ошибка при удалении мероприятия', severity: 'error' });
    } finally {
      setOpenDeleteDialog(false);
      setSelectedEventId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
          Управление мероприятиями
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Создавайте новые события и управляйте существующими
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Колонка для создания мероприятия */}
        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={500}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: '20px',
                border: 'none',
                backgroundColor: palette.cardBg,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: palette.textPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <EventIcon sx={{ color: palette.accent }} />
                Создать новое мероприятие
              </Typography>

              <Box component="form" onSubmit={handleCreateEvent}>
                <TextField
                  fullWidth
                  label="Название мероприятия"
                  name="name"
                  value={newEvent.name}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: palette.border },
                      '&:hover fieldset': { borderColor: palette.accent },
                      '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                  }}
                />

                <TextField
                  fullWidth
                  label="Краткое описание"
                  name="shortDescription"
                  value={newEvent.shortDescription}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: palette.border },
                      '&:hover fieldset': { borderColor: palette.accent },
                      '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                  }}
                />

                <TextField
                  fullWidth
                  label="Полное описание"
                  name="fullDescription"
                  value={newEvent.fullDescription}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: palette.border },
                      '&:hover fieldset': { borderColor: palette.accent },
                      '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Количество участников"
                      name="requiredPeople"
                      type="number"
                      value={newEvent.requiredPeople}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: palette.border },
                          '&:hover fieldset': { borderColor: palette.accent },
                          '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Баллы за участие"
                      name="points"
                      type="number"
                      value={newEvent.points}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: palette.border },
                          '&:hover fieldset': { borderColor: palette.accent },
                          '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Награды"
                  name="awards"
                  value={newEvent.awards}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: palette.border },
                      '&:hover fieldset': { borderColor: palette.accent },
                      '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Дата начала"
                      name="startDate"
                      type="date"
                      value={newEvent.startDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: palette.border },
                          '&:hover fieldset': { borderColor: palette.accent },
                          '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Дата окончания"
                      name="endDate"
                      type="date"
                      value={newEvent.endDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: palette.border },
                          '&:hover fieldset': { borderColor: palette.accent },
                          '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Категория"
                  name="category"
                  value={newEvent.category}
                  onChange={handleChange}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: palette.border },
                      '&:hover fieldset': { borderColor: palette.accent },
                      '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                  }}
                />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: palette.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: palette.accent, fontSize: 20 }} />
                    Выберите местоположение на карте
                  </Typography>
                  <EventMapCreate setCoordinates={handleCoordinatesChange} />
                </Box>

                {imagePreview && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: palette.textPrimary }}>
                      Предварительный просмотр:
                    </Typography>
                    <img
                      src={imagePreview}
                      alt="Предварительный просмотр"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: 12 }}
                    />
                  </Box>
                )}

                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    mb: 2,
                    width: '100%',
                    borderRadius: 2,
                    py: 1.5,
                    backgroundColor: palette.accentSoft,
                    color: palette.accent,
                    '&:hover': { backgroundColor: palette.border },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Загрузить изображение
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                    '&:hover': { background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.gradientStart})` },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Создать мероприятие
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Колонка для списка мероприятий */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Созданные мероприятия
            <Chip label={events.length} size="small" sx={{ backgroundColor: palette.accent, color: 'white', fontWeight: 600 }} />
          </Typography>

          <Grid container spacing={2}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} key={event.event_id}>
                <Grow in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      border: 'none',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={event.image || '/placeholder-event.jpg'}
                      alt={event.event_name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: palette.textPrimary,
                          mb: 1,
                          fontSize: '1rem',
                        }}
                      >
                        {event.event_name || 'Без названия'}
                      </Typography>
                      <Chip
                        label={event.category_name || 'Без категории'}
                        size="small"
                        sx={{
                          mb: 1.5,
                          backgroundColor: palette.accentSoft,
                          color: palette.accent,
                          fontWeight: 500,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: palette.textSecondary, mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {event.short_description || 'Краткое описание отсутствует'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PeopleIcon sx={{ color: palette.accent, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                          Участников: {event.required_volunteers || 'Не указано'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmojiEventsIcon sx={{ color: palette.accent, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                          Баллы: {event.participation_points || 'Не указано'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon sx={{ color: palette.accent, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                          {event.start_date?.split('T')[0] || 'Не указана'}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        onClick={() => handleDeleteClick(event.event_id)}
                        sx={{
                          color: palette.error,
                          '&:hover': { backgroundColor: palette.errorSoft },
                          textTransform: 'none',
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Удалить
                      </Button>
                    </CardActions>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {events.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
                borderRadius: '16px',
                backgroundColor: palette.accentSoft,
              }}
            >
              <Typography variant="body1" sx={{ color: palette.textSecondary }}>
                Нет созданных мероприятий
              </Typography>
              <Typography variant="body2" sx={{ color: palette.textSecondary, mt: 1 }}>
                Создайте первое мероприятие с помощью формы слева
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: 'none',
            backgroundColor: palette.cardBg,
          },
        }}
      >
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 700 }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: palette.textSecondary }}>
            Вы уверены, что хотите удалить это мероприятие? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: palette.textPrimary }}>
            Отмена
          </Button>
          <Button onClick={handleDeleteEvent} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

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

export default ManageEvents;