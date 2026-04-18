import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { API_BASE_URL } from '../../config';

// Кастомный компонент поля ввода
const CustomInput = ({ label, type, value, onChange, name, icon: Icon, error, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="custom-input-wrapper">
      <label className="custom-input-label">{label}</label>
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
    </div>
  );
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError('Email и пароль обязательны для заполнения');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(username)) {
      setError('Введите корректный email адрес');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        login(data.access_token);
        navigate('/');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Ошибка аутентификации. Проверьте email и пароль.');
      }
    } catch (error) {
      setLoading(false);
      setError('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="login-container">
      <div className="card-container">
        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <VolunteerActivismIcon sx={{ fontSize: 48, color: '#6e47c2' }} />
          </div>
          <h1 className="login-title">Добро пожаловать!</h1>
          <p className="login-subtitle">Войдите в свой аккаунт, чтобы продолжить</p>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <CustomInput
              label="Электронная почта"
              type="email"
              name="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={EmailIcon}
              placeholder="example@mail.ru"
            />

            <CustomInput
              label="Пароль"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={LockIcon}
              placeholder="Введите пароль"
            />

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Link to="/reset-password" className="forgot-password-link">
                Забыли пароль?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>

            <div className="divider">или</div>

            <div className="auth-link">
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;