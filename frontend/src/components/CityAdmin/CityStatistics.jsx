import React from 'react';
import { Typography, Paper, Grid, Box, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

const CityStatistics = () => {
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
    info: '#17a2b8',
  };

  const statistics = {
    totalVolunteers: 1248,
    totalEvents: 156,
    completedEvents: 98,
    pendingEvents: 58,
    activeVolunteers: 892,
    thisMonthEvents: 24,
  };

  const statCards = [
    {
      title: 'Всего волонтёров',
      value: statistics.totalVolunteers,
      icon: <VolunteerActivismIcon sx={{ fontSize: 40 }} />,
      color: palette.accent,
      bgColor: palette.accentSoft,
      trend: '+12%',
    },
    {
      title: 'Всего мероприятий',
      value: statistics.totalEvents,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: palette.accent,
      bgColor: palette.accentSoft,
      trend: '+8%',
    },
    {
      title: 'Активных волонтёров',
      value: statistics.activeVolunteers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: palette.success,
      bgColor: '#e8f5e9',
      trend: '+5%',
    },
    {
      title: 'Завершённые мероприятия',
      value: statistics.completedEvents,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: palette.success,
      bgColor: '#e8f5e9',
      trend: '+15%',
    },
  ];

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
          Статистика города
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Общая сводка по волонтёрской деятельности в вашем регионе
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 4,
          borderRadius: '20px',
          border: 'none',
          backgroundColor: palette.cardBg,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: palette.cardBg,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.5,
                      borderRadius: '12px',
                      backgroundColor: stat.bgColor,
                      display: 'inline-flex',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant={isMobile ? 'h4' : 'h3'}
                    sx={{
                      fontWeight: 800,
                      color: palette.textPrimary,
                      mb: 0.5,
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: palette.textSecondary,
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 14, color: palette.success }} />
                    <Typography variant="caption" sx={{ color: palette.success, fontWeight: 600 }}>
                      {stat.trend}
                    </Typography>
                    <Typography variant="caption" sx={{ color: palette.textSecondary }}>
                      с прошлого месяца
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Дополнительная статистика */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: palette.textPrimary,
            }}
          >
            Детальная статистика
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: palette.accentSoft }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary, mb: 2 }}>
                  Прогресс мероприятий
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: palette.textPrimary }}>Завершённые мероприятия</Typography>
                    <Typography variant="body2" sx={{ color: palette.success, fontWeight: 600 }}>
                      {Math.round((statistics.completedEvents / statistics.totalEvents) * 100)}%
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: `${(statistics.completedEvents / statistics.totalEvents) * 100}%`,
                        height: '100%',
                        borderRadius: 4,
                        backgroundColor: palette.success,
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: palette.textPrimary }}>Ожидающие мероприятия</Typography>
                    <Typography variant="body2" sx={{ color: palette.accent, fontWeight: 600 }}>
                      {Math.round((statistics.pendingEvents / statistics.totalEvents) * 100)}%
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: `${(statistics.pendingEvents / statistics.totalEvents) * 100}%`,
                        height: '100%',
                        borderRadius: 4,
                        backgroundColor: palette.accent,
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '16px', backgroundColor: palette.accentSoft }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary, mb: 2 }}>
                  Активность волонтёров
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: palette.textSecondary }}>Активные волонтёры</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: palette.success }}>
                    {statistics.activeVolunteers}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: palette.textSecondary }}>Мероприятий в этом месяце</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: palette.accent }}>
                    {statistics.thisMonthEvents}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CityStatistics;