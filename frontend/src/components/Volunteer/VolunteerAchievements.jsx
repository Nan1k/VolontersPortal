import React from 'react';
import { Typography, Chip, Box, Paper, Grid, Divider, useTheme } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VolunteerAchievements = ({ rank, points, awards, completedEvents }) => {
  const theme = useTheme();

  const palette = {
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentSoft: '#fff5f0',
    success: '#28a745',
    warning: '#ff9800',
    border: '#e8edf2',
  };

  const defaultAwards = ['Золотой волонтёр', 'Лидер месяца', '100 мероприятий'];
  const defaultEvents = ['Эко-субботник', 'Помощь приюту', 'Городской праздник'];

  const awardsList = awards || defaultAwards;
  const eventsList = completedEvents || defaultEvents;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '20px',
        border: `1px solid ${palette.border}`,
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: palette.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmojiEventsIcon sx={{ color: palette.accent }} />
        Мои достижения
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft, textAlign: 'center' }}>
            <StarIcon sx={{ fontSize: 40, color: palette.warning, mb: 1 }} />
            <Typography variant="body2" sx={{ color: palette.textSecondary }}>Ранг</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: palette.textPrimary }}>{rank || 'Эксперт'}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, borderRadius: 2, backgroundColor: palette.accentSoft, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: palette.success, mb: 1 }} />
            <Typography variant="body2" sx={{ color: palette.textSecondary }}>Всего баллов</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: palette.textPrimary }}>
              {typeof points === 'number' ? points : '—'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary, mb: 1.5 }}>
          Полученные награды:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {awardsList.map((award, index) => (
            <Chip
              key={index}
              label={award}
              icon={<EmojiEventsIcon />}
              sx={{
                backgroundColor: palette.accentSoft,
                color: palette.accent,
                fontWeight: 500,
              }}
            />
          ))}
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary, mb: 1.5 }}>
          Пройденные мероприятия:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {eventsList.map((event, index) => (
            <Chip
              key={index}
              label={event}
              variant="outlined"
              sx={{
                borderColor: palette.success,
                color: palette.success,
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default VolunteerAchievements;