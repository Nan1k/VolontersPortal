import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HistoryIcon from '@mui/icons-material/History';
import { API_BASE_URL } from '../config';
import Balance from '../components/Volunteer/Balance';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

function BalancePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [catalog, setCatalog] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderingId, setOrderingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const loadData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [balRes, catRes, ordRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/volunteer/balance`, { headers: authHeaders() }),
        axios.get(`${API_BASE_URL}/merch/catalog`),
        axios.get(`${API_BASE_URL}/merch/my-redemptions`, { headers: authHeaders() }),
      ]);
      setBalance(balRes.data?.balance ?? 0);
      setCatalog(Array.isArray(catRes.data) ? catRes.data : []);
      setOrders(Array.isArray(ordRes.data) ? ordRes.data : []);
    } catch (e) {
      const msg =
        e.response?.status === 401
          ? 'Сессия истекла. Перезайдите в аккаунт.'
          : e.response?.data?.detail || 'Не удалось загрузить данные';
      setSnackbar({ open: true, message: msg, severity: 'error' });
      if (e.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRedeem = async (item) => {
    if (!token) {
      navigate('/login');
      return;
    }
    setOrderingId(item.id);
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/merch/redeem`,
        { item_id: item.id },
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
      );
      setBalance(data.new_balance ?? 0);
      setSnackbar({ open: true, message: data.message || 'Готово', severity: 'success' });
      window.dispatchEvent(new Event('volunteer-balance-changed'));
      const ordRes = await axios.get(`${API_BASE_URL}/merch/my-redemptions`, { headers: authHeaders() });
      setOrders(Array.isArray(ordRes.data) ? ordRes.data : []);
    } catch (e) {
      const detail = e.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : 'Не удалось оформить заявку';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setOrderingId(null);
    }
  };

  const palette = {
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e8edf2',
    accent: '#6e47c2',
    pageBg: '#f5f7fa',
  };

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: palette.textPrimary }}>
          Баланс и мерч
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: palette.textSecondary }}>
          Чтобы заказывать мерч, войдите в аккаунт.
        </Typography>
        <Button variant="contained" component={Link} to="/login" sx={{ textTransform: 'none', mr: 1 }}>
          Войти
        </Button>
        <Button variant="outlined" component={Link} to="/register" sx={{ textTransform: 'none' }}>
          Регистрация
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: palette.pageBg, minHeight: '70vh', py: 3, mt: 0 }}>
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, color: palette.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorefrontIcon sx={{ color: palette.accent }} />
          Баланс и мерч
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: palette.textSecondary }}>
          Баллы списываются при оформлении заявки. Доставку и размеры уточнят отдельно.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: palette.accent }} />
          </Box>
        ) : (
          <>
            <Box sx={{ maxWidth: 480, mx: 'auto', mb: 3 }}>
              <Balance coins={balance} />
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: palette.textPrimary }}>
              Каталог
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
                mb: 4,
              }}
            >
              {catalog.map((item) => (
                <Card
                  key={item.id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${palette.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary, mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.textSecondary, mb: 1.5 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: palette.accent }}>
                      {item.price_points} баллов
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={balance < item.price_points || orderingId === item.id}
                      onClick={() => handleRedeem(item)}
                      sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                      {orderingId === item.id ? 'Отправка…' : 'Заказать за баллы'}
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: palette.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon sx={{ color: palette.accent, fontSize: 22 }} />
              Мои заявки
            </Typography>
            {orders.length === 0 ? (
              <Typography variant="body2" sx={{ color: palette.textSecondary }}>
                Пока нет заказов мерча.
              </Typography>
            ) : (
              <List dense sx={{ bgcolor: '#fff', borderRadius: 2, border: `1px solid ${palette.border}` }}>
                {orders.map((o) => (
                  <ListItem key={o.redemption_id} divider>
                    <ListItemText
                      primary={o.item_title}
                      secondary={`−${o.points_cost} баллов · ${o.created_at ? new Date(o.created_at).toLocaleString('ru-RU') : ''}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default BalancePage;
