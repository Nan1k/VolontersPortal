import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography, Grid, Alert, Snackbar, useMediaQuery, useTheme, Fade } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';

const CreateCategories = () => {
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

  const [category, setCategory] = useState({ name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreate = () => {
    if (!category.name) {
      setSnackbar({ open: true, message: 'Введите название категории', severity: 'error' });
      return;
    }
    console.log('Category created:', category);
    setSnackbar({ open: true, message: 'Категория успешно создана!', severity: 'success' });
    setCategory({ name: '' });
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
          Создание категорий
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Создавайте новые категории для мероприятий
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
                <CategoryIcon sx={{ color: palette.accent }} />
                Новая категория
              </Typography>

              <Box component="form">
                <TextField
                  fullWidth
                  label="Название категории"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  placeholder="Например: Спорт, Культура, Образование"
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
                  InputProps={{
                    startAdornment: <LabelIcon sx={{ color: palette.textSecondary, mr: 1 }} />,
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
                  Создать категорию
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
                <CategoryIcon sx={{ color: palette.accent }} />
                Информация о категориях
              </Typography>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Категории помогают структурировать мероприятия
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: palette.textSecondary, mb: 1 }}>Рекомендации:</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Используйте понятные названия категорий</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Не создавайте дублирующиеся категории</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Категории помогут волонтёрам в поиске</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary }}>• Группируйте похожие мероприятия</Typography>
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
                  "Правильно организованные категории упрощают навигацию и поиск мероприятий."
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

export default CreateCategories;