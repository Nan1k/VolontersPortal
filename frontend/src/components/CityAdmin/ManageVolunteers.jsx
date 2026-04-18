import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Fade,
  TablePagination,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const ManageVolunteers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const palette = {
    pageBg: '#f5f7fa',
    cardBg: '#ffffff',
    border: '#e8edf2',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentDark: '#e85d2c',
    accentSoft: '#fff5f0',
    error: '#dc3545',
    errorSoft: '#fef2f2',
    warning: '#ffc107',
    warningSoft: '#fff3e0',
    success: '#28a745',
    info: '#17a2b8',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBaseUrl}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVolunteers(response.data);
      setFilteredVolunteers(response.data);
    } catch (error) {
      console.error('Ошибка при получении волонтеров:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Ошибка при загрузке волонтеров', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    const filtered = volunteers.filter(volunteer =>
      `${volunteer.user_name} ${volunteer.user_surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVolunteers(filtered);
    setPage(0);
  }, [searchTerm, volunteers]);

  const handleBlock = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBaseUrl}/users/block/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.user_metadata_id === id
            ? { ...volunteer, status: false }
            : volunteer
        )
      );
      setSnackbar({ open: true, message: 'Волонтер заблокирован', severity: 'success' });
    } catch (error) {
      console.error('Ошибка при блокировке волонтера:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Ошибка при блокировке', severity: 'error' });
    } finally {
      setOpenBlockDialog(false);
      setSelectedVolunteer(null);
    }
  };

  const handleUnblock = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBaseUrl}/users/unblock/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVolunteers((prev) =>
        prev.map((volunteer) =>
          volunteer.user_metadata_id === id
            ? { ...volunteer, status: true }
            : volunteer
        )
      );
      setSnackbar({ open: true, message: 'Волонтер разблокирован', severity: 'success' });
    } catch (error) {
      console.error('Ошибка при разблокировке волонтера:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Ошибка при разблокировке', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/users/${selectedVolunteer.user_metadata_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVolunteers((prev) => prev.filter((volunteer) => volunteer.user_metadata_id !== selectedVolunteer.user_metadata_id));
      setSnackbar({ open: true, message: 'Волонтер удален', severity: 'success' });
    } catch (error) {
      console.error('Ошибка при удалении волонтера:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Ошибка при удалении', severity: 'error' });
    } finally {
      setOpenDeleteDialog(false);
      setSelectedVolunteer(null);
    }
  };

  const handleOpenDeleteDialog = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenDeleteDialog(true);
  };

  const handleOpenBlockDialog = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenBlockDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    if (!status) {
      return <Chip
        label="Заблокирован"
        size="small"
        sx={{
          backgroundColor: palette.errorSoft,
          color: palette.error,
          fontWeight: 500,
        }}
        icon={<BlockIcon sx={{ fontSize: 16 }} />}
      />;
    } else {
      return <Chip
        label="Активный"
        size="small"
        sx={{
          backgroundColor: '#e8f5e9',
          color: palette.success,
          fontWeight: 500,
        }}
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
      />;
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
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
          Управление волонтёрами
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Управляйте профилями волонтёров и их статусами
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
        {/* Статистика */}
        <Fade in={true} timeout={500}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>Всего волонтеров</Typography>
                  <Typography variant="h4" sx={{ color: palette.textPrimary, fontWeight: 800 }}>
                    {volunteers.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>Активные</Typography>
                  <Typography variant="h4" sx={{ color: palette.success, fontWeight: 800 }}>
                    {volunteers.filter(v => v.status).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>Заблокированные</Typography>
                  <Typography variant="h4" sx={{ color: palette.error, fontWeight: 800 }}>
                    {volunteers.filter(v => !v.status).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Поиск */}
        <TextField
          fullWidth
          placeholder="Поиск по имени, фамилии или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#fff',
              '& fieldset': { borderColor: palette.border },
              '&:hover fieldset': { borderColor: palette.accent },
              '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: palette.textSecondary }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Таблица */}
        {!isMobile ? (
          <TableContainer sx={{ borderRadius: 2, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: palette.accentSoft }}>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Волонтер</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }} align="center">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVolunteers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((volunteer, index) => (
                    <TableRow
                      key={volunteer.user_metadata_id}
                      sx={{
                        '&:hover': { backgroundColor: palette.accentSoft },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: palette.accent,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {getInitials(volunteer.user_name, volunteer.user_surname)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                              {volunteer.user_name} {volunteer.user_surname}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ color: palette.textSecondary, fontSize: 16 }} />
                          <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                            {volunteer.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(volunteer.status)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {volunteer.status ? (
                            <Tooltip title="Заблокировать">
                              <Button
                                variant="outlined"
                                onClick={() => handleOpenBlockDialog(volunteer)}
                                sx={{
                                  borderColor: palette.warning,
                                  color: palette.warning,
                                  '&:hover': { borderColor: palette.warning, backgroundColor: palette.warningSoft },
                                  textTransform: 'none',
                                }}
                              >
                                Заблокировать
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Разблокировать">
                              <Button
                                variant="outlined"
                                onClick={() => handleUnblock(volunteer.user_metadata_id)}
                                sx={{
                                  borderColor: palette.success,
                                  color: palette.success,
                                  '&:hover': { borderColor: palette.success, backgroundColor: '#e8f5e9' },
                                  textTransform: 'none',
                                }}
                              >
                                Разблокировать
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title="Удалить">
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(volunteer)}
                              sx={{
                                borderColor: palette.error,
                                '&:hover': { backgroundColor: palette.errorSoft },
                                textTransform: 'none',
                              }}
                            >
                              Удалить
                            </Button>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredVolunteers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          // Мобильная версия - карточки
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredVolunteers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((volunteer) => (
                <Paper
                  key={volunteer.user_metadata_id}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    border: `1px solid ${palette.border}`,
                    '&:hover': { borderColor: palette.accent },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: palette.accent }}>
                      {getInitials(volunteer.user_name, volunteer.user_surname)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                        {volunteer.user_name} {volunteer.user_surname}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon sx={{ color: palette.textSecondary, fontSize: 14 }} />
                        <Typography variant="caption" sx={{ color: palette.textSecondary }}>
                          {volunteer.email}
                        </Typography>
                      </Box>
                    </Box>
                    {getStatusChip(volunteer.status)}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {volunteer.status ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenBlockDialog(volunteer)}
                        sx={{ borderColor: palette.warning, color: palette.warning, textTransform: 'none' }}
                      >
                        Заблокировать
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUnblock(volunteer.user_metadata_id)}
                        sx={{ borderColor: palette.success, color: palette.success, textTransform: 'none' }}
                      >
                        Разблокировать
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(volunteer)}
                      sx={{ textTransform: 'none' }}
                    >
                      Удалить
                    </Button>
                  </Box>
                </Paper>
              ))}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredVolunteers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}

        {filteredVolunteers.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
              borderRadius: '16px',
              backgroundColor: palette.accentSoft,
            }}
          >
            <PersonIcon sx={{ fontSize: 48, color: palette.textSecondary, mb: 2 }} />
            <Typography variant="body1" sx={{ color: palette.textSecondary }}>
              Волонтеры не найдены
            </Typography>
            <Typography variant="body2" sx={{ color: palette.textSecondary, mt: 1 }}>
              Попробуйте изменить параметры поиска
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Диалог подтверждения блокировки */}
      <Dialog
        open={openBlockDialog}
        onClose={() => setOpenBlockDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: 'none',
            backgroundColor: palette.cardBg,
          },
        }}
      >
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 700 }}>
          Подтверждение блокировки
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: palette.textSecondary }}>
            Вы уверены, что хотите заблокировать волонтера{' '}
            <strong>{selectedVolunteer?.user_name} {selectedVolunteer?.user_surname}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)} sx={{ color: palette.textPrimary }}>
            Отмена
          </Button>
          <Button onClick={() => handleBlock(selectedVolunteer?.user_metadata_id)} sx={{ color: palette.warning }}>
            Заблокировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: 'none',
            backgroundColor: palette.cardBg,
          },
        }}
      >
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 700 }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: palette.textSecondary }}>
            Вы уверены, что хотите удалить волонтера{' '}
            <strong>{selectedVolunteer?.user_name} {selectedVolunteer?.user_surname}</strong>? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: palette.textPrimary }}>
            Отмена
          </Button>
          <Button onClick={handleDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для уведомлений */}
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

export default ManageVolunteers;