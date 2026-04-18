import React from 'react';
import { Typography, Paper, Box, Avatar, useMediaQuery, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Balance = ({ coins }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    accent: '#6e47c2',
    accentSoft: '#fff5f0',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: '20px',
        border: 'none',
        background: `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`,
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
        <MonetizationOnIcon sx={{ fontSize: 32 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Мой баланс
        </Typography>
      </Box>
      <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
        {coins}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        волонтёрских баллов
      </Typography>
    </Paper>
  );
};

export default Balance;