import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography, Grid, Alert, Snackbar, useMediaQuery, useTheme, Fade } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

const CreateAwards = () => {
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
  };

  const [award, setAward] = useState({
    name: '',
    points: '',
    description: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAward(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreate = () => {
    if (!award.name) {
      setSnackbar({ open: true, message: 'Введите название награды', severity: 'error' });
      return;
    }
    if (!award.points || award.points <= 0) {
      setSnackbar({ open: true, message: 'Введите корректное количество баллов', severity: 'error' });
      return;
    }
    console.log('Award created:', award);
    setSnackbar({ open: true, message: 'Награда успешно создана!', severity: 'success' });
    setAward({ name: '', points: '', description: '' });
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
          Создание наград
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Создавайте новые награды для волонтёров
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
                Новая награда
              </Typography>

              <Box component="form">
                <TextField
                  fullWidth
                  label="Название награды"
                  name="name"
                  value={award.name}
                  onChange={handleChange}
                  placeholder="Например: Золотой волонтёр"
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
                  value={award.points}
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

                <TextField
                  fullWidth
                  label="Описание награды"
                  name="description"
                  value={award.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Опишите, за что вручается эта награда"
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
                  startIcon={<StarIcon />}
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
                  Создать награду
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
                <StarIcon sx={{ color: palette.accent }} />
                Информация о наградах
              </Typography>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Награды мотивируют волонтёров и отмечают их достижения
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: palette.textSecondary, mb: 1 }}>Рекомендации:</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Давайте награды за конкретные достижения</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Устанавливайте реалистичные требования по баллам</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Добавляйте уникальные названия для наград</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary }}>• Регулярно обновляйте список доступных наград</Typography>
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
                  "Награды помогают волонтёрам видеть свой прогресс и стремиться к новым достижениям."
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

export default CreateAwards;