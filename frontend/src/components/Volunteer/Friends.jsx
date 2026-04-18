import React from 'react';
import { Typography, Box, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Friends = ({ friends }) => {
  const theme = useTheme();

  const palette = {
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentSoft: '#fff5f0',
    border: '#e8edf2',
  };

  const defaultFriends = [
    { id: 1, name: 'Анна Иванова', status: 'online', points: 1250 },
    { id: 2, name: 'Петр Сидоров', status: 'offline', points: 890 },
    { id: 3, name: 'Елена Смирнова', status: 'online', points: 2340 },
  ];

  const friendsList = friends || defaultFriends;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '20px',
        border: `1px solid ${palette.border}`,
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: palette.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon sx={{ color: palette.accent }} />
        Друзья ({friendsList.length})
      </Typography>
      <Divider sx={{ mb: 2, borderColor: palette.border }} />
      <List>
        {friendsList.map((friend, index) => (
          <React.Fragment key={friend.id}>
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: palette.accent }}>
                  {friend.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={friend.name}
                secondary={`${friend.points} баллов`}
                primaryTypographyProps={{ fontWeight: 600, color: palette.textPrimary }}
                secondaryTypographyProps={{ color: palette.textSecondary }}
              />
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: friend.status === 'online' ? '#28a745' : '#6c757d',
                }}
              />
            </ListItem>
            {index < friendsList.length - 1 && <Divider sx={{ borderColor: palette.border }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Friends;