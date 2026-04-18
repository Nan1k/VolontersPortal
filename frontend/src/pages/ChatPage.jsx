import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TextField, Button, List, ListItem, Badge, Typography, Box, Paper, Avatar, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import './ChatPage.css';

import { API_BASE_URL } from '../config';
const token = localStorage.getItem('token');

const ChatPage = ({ socket }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const palette = {
    accent: '#6e47c2',
    accentDark: '#e85d2c',
    accentSoft: '#fff5f0',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e8edf2',
    success: '#28a745',
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChatPartnerId, setCurrentChatPartnerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        return response.json();
      })
      .then(data => {
        console.log('User token verified:', data);
        setCurrentUser(data);

        socket.on('chat_message', (msg) => {
          console.log('Message received:', msg);
          if (msg.sender_id === currentUser?.user_metadata_id || msg.sender_id === currentChatPartnerId) {
            setMessages(prevMessages => [...prevMessages, msg]);
          }
        });

        socket.on('user_status', (data) => {
          const { user_id, status } = data;
          setOnlineUsers(prevStatus => ({
            ...prevStatus,
            [user_id]: status === 'online'
          }));
          console.log(`User ${user_id} is now ${status}`);
        });

        socket.on('unread_messages_count', (data) => {
          const { user_id, unread_count } = data;
          console.log(`Unread count update: User ${user_id}, Count ${unread_count}`);
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [user_id]: unread_count
          }));
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      })
      .catch(error => {
        console.error('Token verification error:', error);
        navigate('/login');
      });

    return () => {
      socket.off('chat_message');
      socket.off('user_status');
      socket.off('unread_messages_count');
      socket.off('disconnect');
    };
  }, [currentChatPartnerId]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/chat-users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (recipientId) {
      fetch(`${API_BASE_URL}/chat/history/${recipientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          setMessages(Array.isArray(data) ? data : []);
          const selectedUser = users.find(user => user.user_metadata_id === recipientId);
          setRecipientName(`${selectedUser?.user_name || ''} ${selectedUser?.user_surname || ''}`);
          setUnreadCounts(prevCounts => ({
            ...prevCounts,
            [recipientId]: data.count
          }));
          console.log('Chat history and unread counts loaded:', data);
          socket.emit('select_chat_partner', {
            recipient_id: recipientId,
            token
          });
          setCurrentChatPartnerId(recipientId);
        })
        .catch(error => console.error('Error fetching chat history:', error));
    }
  }, [recipientId, users]);

  const handleSend = () => {
    if (message.trim() && recipientId) {
      console.log('Sending message:', message);
      socket.emit('chat_message', {
        message,
        token,
        recipient_id: recipientId
      });
      setMessage('');
    }
  };

  const filteredUsers = users.filter(user => user.user_metadata_id !== currentUser?.user_metadata_id);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f5f7fa',
      }}
    >
      {/* Список контактов */}
      <Box
        sx={{
          width: isMobile ? '100%' : 320,
          backgroundColor: '#ffffff',
          borderRight: `1px solid #e8edf2`,
          display: 'flex',
          flexDirection: 'column',
          ...(recipientId && isMobile && { display: 'none' }),
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid #e8edf2` }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon sx={{ color: '#6e47c2' }} />
            Чаты
          </Typography>
        </Box>
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {filteredUsers.map(user => (
            <ListItem
              key={user.user_metadata_id}
              onClick={() => setRecipientId(user.user_metadata_id)}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                px: 2,
                borderBottom: `1px solid #e8edf2`,
                '&:hover': { backgroundColor: '#fff5f0' },
                ...(recipientId === user.user_metadata_id && { backgroundColor: '#fff5f0' }),
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#6e47c2',
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                {getInitials(user.user_name, user.user_surname)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                  {user.user_name} {user.user_surname}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: onlineUsers[user.user_metadata_id] ? '#28a745' : '#6c757d',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#6c757d' }}>
                    {onlineUsers[user.user_metadata_id] ? 'онлайн' : 'офлайн'}
                  </Typography>
                </Box>
              </Box>
              {unreadCounts[user.user_metadata_id] > 0 && (
                <Badge
                  badgeContent={unreadCounts[user.user_metadata_id]}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#6e47c2',
                      color: 'white',
                    },
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Область чата */}
      {!recipientId ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ChatIcon sx={{ fontSize: 64, color: '#e8edf2' }} />
          <Typography variant="h6" sx={{ color: '#6c757d' }}>
            Выберите собеседника для начала чата
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Header чата */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid #e8edf2`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {isMobile && (
              <IconButton onClick={() => setRecipientId(null)}>
                ←
              </IconButton>
            )}
            <Avatar sx={{ bgcolor: '#6e47c2' }}>
              {recipientName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                {recipientName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6c757d' }}>
                {onlineUsers[recipientId] ? 'онлайн' : 'офлайн'}
              </Typography>
            </Box>
          </Box>

          {/* Сообщения */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender_id === currentUser?.user_metadata_id ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: msg.sender_id === currentUser?.user_metadata_id ? '#6e47c2' : '#f5f7fa',
                    color: msg.sender_id === currentUser?.user_metadata_id ? 'white' : '#1a1a2e',
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                    {format(new Date(msg.time), 'HH:mm', { locale: ru })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Поле ввода */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid #e8edf2`,
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#e8edf2' },
                  '&:hover fieldset': { borderColor: '#6e47c2' },
                  '&.Mui-focused fieldset': { borderColor: '#6e47c2' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6e47c2, #8b5cf6)',
                '&:hover': { background: 'linear-gradient(135deg, #e85d2c, #6e47c2)' },
                minWidth: 'auto',
                px: 3,
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;