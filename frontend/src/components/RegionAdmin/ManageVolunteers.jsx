import React, { useState } from 'react';
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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const ManageVolunteers = () => {
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
    error: '#dc3545',
    errorSoft: '#fef2f2',
    warning: '#ff9800',
    warningSoft: '#fff3e0',
    success: '#28a745',
    info: '#17a2b8',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const [volunteers, setVolunteers] = useState([
    { id: 1, name: 'Анна Иванова', email: 'anna@example.com', status: 'active', city: 'Москва', points: 1250 },
    { id: 2, name: 'Петр Сидоров', email: 'petr@example.com', status: 'blocked', city: 'Санкт-Петербург', points: 890 },
    { id: 3, name: 'Елена Смирнова', email: 'elena@example.com', status: 'active', city: 'Иркутск', points: 2340 },
    { id: 4, name: 'Михаил Козлов', email: 'mikhail@example.com', status: 'active', city: 'Новосибирск', points: 560 },
    { id: 5, name: 'Ольга Новикова', email: 'olga@example.com', status: 'blocked', city: 'Екатеринбург', points: 1780 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlock = (id) => {
    setVolunteers((prev) =>
      prev.map((volunteer) =>
        volunteer.id === id
          ? { ...volunteer, status: 'blocked' }
          : volunteer
      )
    );
    setSnackbar({ open: true, message: 'Волонтер заблокирован', severity: 'success' });
    setOpenBlockDialog(false);
    setSelectedVolunteer(null);
  };

  const handleUnblock = (id) => {
    setVolunteers((prev) =>
      prev.map((volunteer) =>
        volunteer.id === id
          ? { ...volunteer, status: 'active' }
          : volunteer
      )
    );
    setSnackbar({ open: true, message: 'Волонтер разблокирован', severity: 'success' });
  };

  const handleDeleteClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenDeleteDialog(true);
  };

  const handleBlockClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenBlockDialog(true);
  };

  const handleDelete = () => {
    setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== selectedVolunteer?.id));
    setOpenDeleteDialog(false);
    setSelectedVolunteer(null);
    setSnackbar({ open: true, message: 'Волонтер удален', severity: 'success' });
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
    if (status === 'blocked') {
      return (
        <Chip
          label="Заблокирован"
          size="small"
          sx={{
            backgroundColor: palette.errorSoft,
            color: palette.error,
            fontWeight: 500,
          }}
          icon={<BlockIcon sx={{ fontSize: 16 }} />}
        />
      );
    } else {
      return (
        <Chip
          label="Активный"
          size="small"
          sx={{
            backgroundColor: '#e8f5e9',
            color: palette.success,
            fontWeight: 500,
          }}
          icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        />
      );
    }
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const stats = {
    total: volunteers.length,
    active: volunteers.filter(v => v.status === 'active').length,
    blocked: volunteers.filter(v => v.status === 'blocked').length,
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
                    {stats.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>Активные</Typography>
                  <Typography variant="h4" sx={{ color: palette.success, fontWeight: 800 }}>
                    {stats.active}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1 }}>Заблокированные</Typography>
                  <Typography variant="h4" sx={{ color: palette.error, fontWeight: 800 }}>
                    {stats.blocked}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Поиск */}
        <TextField
          fullWidth
          placeholder="Поиск по имени или email..."
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
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: palette.accentSoft }}>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Волонтер</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Город</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Баллы</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }}>Статус</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: palette.textPrimary }} align="center">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVolunteers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((volunteer) => (
                    <TableRow
                      key={volunteer.id}
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
                            {getInitials(volunteer.name)}
                          </Avatar>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                            {volunteer.name}
                          </Typography>
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
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationCityIcon sx={{ color: palette.textSecondary, fontSize: 16 }} />
                          <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                            {volunteer.city}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${volunteer.points} баллов`}
                          size="small"
                          sx={{
                            backgroundColor: palette.accentSoft,
                            color: palette.accent,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>{getStatusChip(volunteer.status)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {volunteer.status === 'active' ? (
                            <Tooltip title="Заблокировать">
                              <Button
                                variant="outlined"
                                onClick={() => handleBlockClick(volunteer)}
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
                                onClick={() => handleUnblock(volunteer.id)}
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
                              onClick={() => handleDeleteClick(volunteer)}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredVolunteers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((volunteer) => (
                <Paper
                  key={volunteer.id}
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    border: `1px solid ${palette.border}`,
                    '&:hover': { borderColor: palette.accent },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: palette.accent }}>
                      {getInitials(volunteer.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                        {volunteer.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: palette.textSecondary }}>
                        {volunteer.email}
                      </Typography>
                    </Box>
                    {getStatusChip(volunteer.status)}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                      Город: {volunteer.city}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                      Баллы: {volunteer.points}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {volunteer.status === 'active' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleBlockClick(volunteer)}
                        sx={{ borderColor: palette.warning, color: palette.warning, textTransform: 'none' }}
                      >
                        Заблокировать
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUnblock(volunteer.id)}
                        sx={{ borderColor: palette.success, color: palette.success, textTransform: 'none' }}
                      >
                        Разблокировать
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(volunteer)}
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

      {/* Диалоги и Snackbar */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)} PaperProps={{ sx: { borderRadius: 3, border: 'none', backgroundColor: palette.cardBg } }}>
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 700 }}>Подтверждение блокировки</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: palette.textSecondary }}>
            Вы уверены, что хотите заблокировать волонтера{' '}
            <strong>{selectedVolunteer?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)} sx={{ color: palette.textPrimary }}>Отмена</Button>
          <Button onClick={() => handleBlock(selectedVolunteer?.id)} sx={{ color: palette.warning }}>Заблокировать</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 3, border: 'none', backgroundColor: palette.cardBg } }}>
        <DialogTitle sx={{ color: palette.textPrimary, fontWeight: 700 }}>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: palette.textSecondary }}>
            Вы уверены, что хотите удалить волонтера{' '}
            <strong>{selectedVolunteer?.name}</strong>? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: palette.textPrimary }}>Отмена</Button>
          <Button onClick={handleDelete} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageVolunteers;