import React from 'react';
import { Typography, Box, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, useTheme } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

const Groups = ({ groups }) => {
  const theme = useTheme();

  const palette = {
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentSoft: '#fff5f0',
    border: '#e8edf2',
  };

  const defaultGroups = [
    { id: 1, name: 'Эко-волонтёры', members: 45, category: 'Экология' },
    { id: 2, name: 'Спортивные события', members: 78, category: 'Спорт' },
    { id: 3, name: 'Культурный дозор', members: 32, category: 'Культура' },
  ];

  const groupsList = groups || defaultGroups;

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
        <GroupIcon sx={{ color: palette.accent }} />
        Мои группы ({groupsList.length})
      </Typography>
      <Divider sx={{ mb: 2, borderColor: palette.border }} />
      <List>
        {groupsList.map((group, index) => (
          <React.Fragment key={group.id}>
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: palette.accentSoft, color: palette.accent }}>
                  {group.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={group.name}
                secondary={`${group.members} участников • ${group.category}`}
                primaryTypographyProps={{ fontWeight: 600, color: palette.textPrimary }}
                secondaryTypographyProps={{ color: palette.textSecondary }}
              />
            </ListItem>
            {index < groupsList.length - 1 && <Divider sx={{ borderColor: palette.border }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Groups;