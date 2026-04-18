import React from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider, Avatar, useMediaQuery, useTheme } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const VolunteerMessages = ({ messages }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentSoft: '#fff5f0',
    border: '#e8edf2',
  };

  const defaultMessages = [
    { id: 1, sender: 'Администратор', content: 'Добро пожаловать на платформу!', time: '2024-01-15T10:00:00', read: false },
    { id: 2, sender: 'Организатор', content: 'Напоминание о завтрашнем мероприятии', time: '2024-01-14T15:30:00', read: true },
    { id: 3, sender: 'Система', content: 'Вы получили новую награду!', time: '2024-01-13T09:15:00', read: true },
  ];

  const messagesList = messages || defaultMessages;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: '20px',
        border: `1px solid ${palette.border}`,
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: palette.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
        <MessageIcon sx={{ color: palette.accent }} />
        Сообщения ({messagesList.length})
      </Typography>
      <Divider sx={{ mb: 2, borderColor: palette.border }} />
      <List>
        {messagesList.map((message, index) => (
          <React.Fragment key={message.id}>
            <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
              <Avatar sx={{ bgcolor: message.read ? palette.border : palette.accent, mr: 2, width: 40, height: 40 }}>
                {message.sender.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                    {message.sender}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 12, color: palette.textSecondary }} />
                    <Typography variant="caption" sx={{ color: palette.textSecondary }}>
                      {formatDate(message.time)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: message.read ? palette.textSecondary : palette.textPrimary }}>
                  {message.content}
                </Typography>
              </Box>
            </ListItem>
            {index < messagesList.length - 1 && <Divider sx={{ borderColor: palette.border }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default VolunteerMessages;