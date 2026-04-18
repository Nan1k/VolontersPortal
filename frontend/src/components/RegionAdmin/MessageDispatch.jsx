import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Chip,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Fade,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GroupsIcon from '@mui/icons-material/Groups';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EmailIcon from '@mui/icons-material/Email';

const MessageDispatch = () => {
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
    success: '#28a745',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleSend = () => {
    if (!message.trim()) {
      setSnackbar({ open: true, message: 'Введите текст сообщения', severity: 'error' });
      return;
    }
    console.log('Message sent:', { subject, message });
    setSnackbar({ open: true, message: 'Сообщение успешно отправлено всем волонтёрам!', severity: 'success' });
    setMessage('');
    setSubject('');
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
          Рассылка сообщений
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Отправляйте важные уведомления всем волонтёрам
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
                <AnnouncementIcon sx={{ color: palette.accent }} />
                Новое сообщение
              </Typography>

              <TextField
                fullWidth
                label="Тема сообщения"
                value={subject}
                onChange={handleSubjectChange}
                placeholder="Например: Важное объявление о мероприятии"
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

              <TextField
                fullWidth
                label="Текст сообщения"
                value={message}
                onChange={handleChange}
                multiline
                rows={8}
                placeholder="Введите текст сообщения для волонтёров..."
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Chip
                  icon={<GroupsIcon />}
                  label="Отправка всем волонтёрам"
                  sx={{ backgroundColor: palette.accentSoft, color: palette.accent }}
                />
                <Button
                  variant="contained"
                  onClick={handleSend}
                  startIcon={<SendIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 4,
                    background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
                    '&:hover': { background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.gradientStart})` },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Отправить всем
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
                <EmailIcon sx={{ color: palette.accent }} />
                Информация о рассылке
              </Typography>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Сообщение будет отправлено всем зарегистрированным волонтёрам
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: palette.textSecondary, mb: 1 }}>Рекомендации:</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Будьте краткими и информативными</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Указывайте важные даты и deadlines</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>• Используйте дружелюбный тон</Typography>
                <Typography variant="body2" sx={{ color: palette.textSecondary }}>• Проверяйте текст перед отправкой</Typography>
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
                  "Ваше сообщение поможет волонтёрам быть в курсе всех событий и не пропустить важные мероприятия."
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

export default MessageDispatch;