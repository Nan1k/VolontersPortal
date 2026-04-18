import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography, Grid, Alert, Snackbar, useMediaQuery, useTheme, Fade } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const CreateRanks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    pageBg: '#f5f7fa',
    cardBg: '#ffffff',
    border: '#e8edf2',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentDark: '#e85d2c',
    accentSoft: '#fff5f0',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
    success: '#28a745',
    warning: '#ff9800',
  };

  const [rank, setRank] = useState({ name: '', points: '', description: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRank(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreate = () => {
    if (!rank.name) {
      setSnackbar({ open: true, message: 'Введите название ранга', severity: 'error' });
      return;
    }
    if (!rank.points || rank.points <= 0) {
      setSnackbar({ open: true, message: 'Введите корректное количество баллов', severity: 'error' });
      return;
    }
    console.log('Rank created:', rank);
    setSnackbar({ open: true, message: 'Ранг успешно создан!', severity: 'success' });
    setRank({ name: '', points: '', description: '' });
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
          Создание рангов
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Создавайте новые ранги для волонтёров
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Fade in={true} timeout={500}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 3 : 4,
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
                <EmojiEventsIcon sx={{ color: palette.accent }} />
                Новый ранг
              </Typography>

              <Box component="form">
                <TextField
                  fullWidth
                  label="Название ранга"
                  name="name"
                  value={rank.name}
                  onChange={handleChange}
                  placeholder="Например: Новичок, Эксперт, Мастер"
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
                  label="Количество баллов"
                  name="points"
                  type="number"
                  value={rank.points}
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
                  InputProps={{
                    startAdornment: <StarIcon sx={{ color: palette.warning, mr: 1 }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Описание ранга"
                  name="description"
                  value={rank.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Опишите, какие привилегии даёт этот ранг"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: palette.border },
                      '&:hover fieldset': { borderColor: palette.accent },
                      '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleCreate}
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
                  Создать ранг
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={500}>
            <Paper
              elevation={0}
              sx={{
                p: isMobile ? 3 : 4,
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
                <TrendingUpIcon sx={{ color: palette.accent }} />
                Информация о рангах
              </Typography>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Ранги мотивируют волонтёров и показывают их прогресс
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: palette.textSecondary, mb: 1 }}>Рекомендации:</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Создавайте 5-7 рангов для мотивации</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Увеличивайте требования постепенно</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Добавляйте уникальные названия для рангов</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary }}>• Предусмотрите привилегии для каждого ранга</Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: palette.accentSoft,
                  mt: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: palette.textSecondary, fontStyle: 'italic' }}>
                  "Ранги помогают волонтёрам видеть свой прогресс и стремиться к новым достижениям."
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

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

export default CreateRanks;