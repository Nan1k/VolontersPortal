import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import './Register.css';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { API_BASE_URL } from '../../config';

// Кастомный компонент поля ввода
const CustomInput = ({ label, type, value, onChange, name, icon: Icon, error, placeholder, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="custom-input-wrapper">
      <label className="custom-input-label">
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div className={`custom-input-field ${isFocused ? 'focused' : ''}`}>
        {Icon && (
          <div className="custom-input-icon">
            <Icon sx={{ fontSize: 20 }} />
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="custom-input"
          placeholder={placeholder || `Введите ${label.toLowerCase()}`}
        />
        {isPassword && (
          <div 
            className="custom-input-icon" 
            style={{ cursor: 'pointer', paddingRight: '14px' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
          </div>
        )}
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

function Register() {
  const [formData, setFormData] = useState({
    username: '', // email
    hashed_password: '',
    user_surname: '',
    user_name: '',
    user_patronymic: '',
    age: '',
    country: '',
    city: '',
  });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  useEffect(() => {
    setCountriesLoading(true);
    fetch(`${API_BASE_URL}/countries/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка HTTP ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        const rows = Array.isArray(data)
          ? data.map((c) => ({ id: c.country_id, name: c.country_name }))
          : [];
        setCountries(rows);
      })
      .catch(error => {
        console.error('Ошибка при загрузке стран:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage(
          `Не удалось загрузить страны (${API_BASE_URL}). Запущен ли бэкенд?`
        );
        setOpenSnackbar(true);
      })
      .finally(() => setCountriesLoading(false));
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData(prev => ({ ...prev, country: selectedCountry, city: '' }));
    if (!selectedCountry) {
      setCities([]);
      return;
    }

    fetch(`${API_BASE_URL}/cities/${selectedCountry}`)
      .then(response => {
        if (!response.ok) throw new Error('Ошибка HTTP ' + response.status);
        return response.json();
      })
      .then(data => setCities(data.map(c => ({ id: c.city_id, name: c.city_name }))))
      .catch(error => {
        console.error('Ошибка при загрузке городов:', error);
        setCities([]);
        setSnackbarSeverity('error');
        setSnackbarMessage('Не удалось загрузить города для выбранной страны.');
        setOpenSnackbar(true);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку поля при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      newErrors.username = 'Введите корректный email';
    }
    
    if (!formData.hashed_password) {
      newErrors.hashed_password = 'Введите пароль';
    } else if (formData.hashed_password.length < 8) {
      newErrors.hashed_password = 'Пароль должен содержать минимум 8 символов';
    }
    
    if (!formData.user_surname) newErrors.user_surname = 'Введите фамилию';
    if (!formData.user_name) newErrors.user_name = 'Введите имя';
    if (!formData.user_patronymic) newErrors.user_patronymic = 'Введите отчество';
    
    if (!formData.age) {
      newErrors.age = 'Введите возраст';
    } else if (formData.age < 14 || formData.age > 120) {
      newErrors.age = 'Возраст должен быть от 14 до 120 лет';
    }
    
    if (!formData.country) newErrors.country = 'Выберите страну';
    if (!formData.city) newErrors.city = 'Выберите город';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          hashed_password: formData.hashed_password,
          user_surname: formData.user_surname,
          user_name: formData.user_name,
          user_patronymic: formData.user_patronymic,
          age: Number(formData.age),
          country: Number(formData.country),
          city: Number(formData.city),
        }),
      });

      setLoading(false);
      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Регистрация прошла успешно. Сейчас можно войти в систему.');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        const backendValidation = Array.isArray(errorData?.detail)
          ? errorData.detail.map((item) => item?.msg).filter(Boolean).join('; ')
          : null;
        setSnackbarSeverity('error');
        setSnackbarMessage(backendValidation || errorData.detail || 'Ошибка при регистрации!');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setLoading(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Произошла ошибка. Попробуйте позже.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="register-container">
      <div className="card-container">
        <div className="register-card">
          <div className="register-icon">
            <VolunteerActivismIcon sx={{ fontSize: 48, color: '#6e47c2' }} />
          </div>
          <h1 className="register-title">Регистрация</h1>
          <p className="register-subtitle">Создайте аккаунт, чтобы присоединиться к сообществу волонтёров</p>

          <form onSubmit={handleSubmit}>
            <CustomInput
              label="Электронная почта"
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              icon={EmailIcon}
              placeholder="example@mail.ru"
              error={errors.username}
              required
            />

            <CustomInput
              label="Пароль"
              type="password"
              name="hashed_password"
              value={formData.hashed_password}
              onChange={handleChange}
              icon={LockIcon}
              placeholder="Минимум 8 символов"
              error={errors.hashed_password}
              required
            />

            <CustomInput
              label="Фамилия"
              type="text"
              name="user_surname"
              value={formData.user_surname}
              onChange={handleChange}
              icon={PersonIcon}
              placeholder="Введите фамилию"
              error={errors.user_surname}
              required
            />

            <CustomInput
              label="Имя"
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              icon={PersonIcon}
              placeholder="Введите имя"
              error={errors.user_name}
              required
            />

            <CustomInput
              label="Отчество"
              type="text"
              name="user_patronymic"
              value={formData.user_patronymic}
              onChange={handleChange}
              icon={PersonIcon}
              placeholder="Введите отчество"
              error={errors.user_patronymic}
              required
            />

            <CustomInput
              label="Возраст"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              icon={CalendarTodayIcon}
              placeholder="От 14 до 120 лет"
              error={errors.age}
              required
            />

            <FormControl fullWidth error={!!errors.country} sx={{ mb: 2.5 }}>
              <InputLabel id="register-country-label">Страна</InputLabel>
              <Select
                labelId="register-country-label"
                label="Страна"
                value={formData.country}
                onChange={handleCountryChange}
                disabled={countriesLoading}
              >
                <MenuItem value="">
                  <em>{countriesLoading ? 'Загрузка…' : 'Выберите страну'}</em>
                </MenuItem>
                {countries.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.country ? <FormHelperText>{errors.country}</FormHelperText> : null}
            </FormControl>

            <FormControl fullWidth error={!!errors.city} sx={{ mb: 2.5 }}>
              <InputLabel id="register-city-label">Город</InputLabel>
              <Select
                labelId="register-city-label"
                label="Город"
                value={formData.city}
                onChange={(e) =>
                  handleChange({ target: { name: 'city', value: e.target.value } })
                }
                disabled={!formData.country}
              >
                <MenuItem value="">
                  <em>{formData.country ? 'Выберите город' : 'Сначала выберите страну'}</em>
                </MenuItem>
                {cities.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.city ? <FormHelperText>{errors.city}</FormHelperText> : null}
            </FormControl>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="divider">или</div>

          <div className="auth-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ borderRadius: 2 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Register;