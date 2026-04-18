import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  ListItemText,
  Typography,
  IconButton,
  Chip,
  Paper,
  Divider,
  useMediaQuery,
  Fade,
  Slider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTheme } from '@mui/material/styles';

const filterOptions = {
  country: ["Россия", "США", "Канада", "Германия", "Франция", "Китай"],
  region: ["Центральный федеральный округ", "Приволжский федеральный округ", "Северо-Западный федеральный округ", "Уральский федеральный округ", "Южный федеральный округ"],
  city: ["Москва", "Санкт-Петербург", "Нью-Йорк", "Торонто", "Лондон", "Берлин"],
  category: ["Спорт", "Культура", "Наука", "Образование", "Экология", "Медицина"],
};

function EventFilters({ onFilterChange, initialFilters = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    pageBg: '#f5f7fa',
    cardBg: '#ffffff',
    border: '#e8edf2',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentDark: '#8b5cf6',
    accentSoft: '#fff5f0',
    error: '#dc3545',
    warning: '#ffc107',
    success: '#28a745',
  };

  const [filters, setFilters] = useState({
    country: initialFilters.country || [],
    region: initialFilters.region || [],
    city: initialFilters.city || [],
    category: initialFilters.category || [],
  });

  const [open, setOpen] = useState({
    country: false,
    region: false,
    city: false,
    category: false,
  });

  const [dateRange, setDateRange] = useState({
    fromDate: initialFilters.fromDate || '',
    toDate: initialFilters.toDate || ''
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.keys(filters).forEach(key => {
      count += filters[key].length;
    });
    if (dateRange.fromDate) count++;
    if (dateRange.toDate) count++;
    return count;
  };

  const handleFilterChange = () => {
    onFilterChange({
      ...filters,
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
    });
  };

  const handleSelect = (filterType, value) => () => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleDateChange = (e) => {
    setDateRange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClearAll = () => {
    setFilters({
      country: [],
      region: [],
      city: [],
      category: [],
    });
    setDateRange({ fromDate: '', toDate: '' });
  };

  const getFilterIcon = (filterType) => {
    switch(filterType) {
      case 'country':
      case 'region':
      case 'city':
        return <LocationOnIcon sx={{ fontSize: 20, color: palette.accent }} />;
      case 'category':
        return <CategoryIcon sx={{ fontSize: 20, color: palette.accent }} />;
      default:
        return null;
    }
  };

  const getFilterTitle = (filterType) => {
    switch(filterType) {
      case 'country': return 'Страна';
      case 'region': return 'Регион';
      case 'city': return 'Город';
      case 'category': return 'Категория';
      default: return '';
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 3,
          borderRadius: '20px',
          border: 'none',
          backgroundColor: palette.cardBg,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Заголовок */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon sx={{ color: palette.accent }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: palette.textPrimary }}>
              Фильтры
            </Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={getActiveFiltersCount()}
                size="small"
                sx={{
                  backgroundColor: palette.accent,
                  color: 'white',
                  fontWeight: 600,
                  ml: 1,
                }}
              />
            )}
          </Box>
          {getActiveFiltersCount() > 0 && (
            <Button
              startIcon={<ClearAllIcon />}
              onClick={handleClearAll}
              size="small"
              sx={{
                color: palette.textSecondary,
                '&:hover': { color: palette.error },
                textTransform: 'none',
              }}
            >
              Сбросить все
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2, borderColor: palette.border }} />

        {/* Фильтры */}
        {Object.keys(filterOptions).map((filterType) => (
          <Box key={filterType} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: open[filterType] ? palette.accentSoft : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: palette.accentSoft,
                },
              }}
              onClick={() => setOpen((prev) => ({ ...prev, [filterType]: !prev[filterType] }))}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getFilterIcon(filterType)}
                <Typography variant="body1" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                  {getFilterTitle(filterType)}
                </Typography>
                {filters[filterType].length > 0 && (
                  <Chip
                    label={filters[filterType].length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: palette.accent,
                      color: 'white',
                    }}
                  />
                )}
              </Box>
              <IconButton size="small">
                {open[filterType] ?
                  <ExpandLessIcon sx={{ color: palette.accent }} /> :
                  <ExpandMoreIcon sx={{ color: palette.textSecondary }} />
                }
              </IconButton>
            </Box>
            {open[filterType] && (
              <Box sx={{
                maxHeight: 250,
                overflowY: 'auto',
                mt: 1,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: palette.accentSoft,
              }}>
                {filterOptions[filterType].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: 1,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: palette.border,
                      },
                    }}
                    onClick={handleSelect(filterType, item)}
                  >
                    <Checkbox
                      checked={filters[filterType].includes(item)}
                      sx={{
                        color: palette.accent,
                        '&.Mui-checked': {
                          color: palette.accent,
                        },
                      }}
                    />
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        sx: { color: palette.textPrimary, fontSize: '0.9rem' }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}

        <Divider sx={{ my: 2, borderColor: palette.border }} />

        {/* Дата */}
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: palette.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 20, color: palette.accent }} />
          Период проведения
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: isMobile ? 'column' : 'row' }}>
          <TextField
            label="Дата от"
            type="date"
            name="fromDate"
            value={dateRange.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: palette.border },
                '&:hover fieldset': { borderColor: palette.accent },
                '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
            }}
          />
          <TextField
            label="Дата до"
            type="date"
            name="toDate"
            value={dateRange.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: palette.border },
                '&:hover fieldset': { borderColor: palette.accent },
                '&.Mui-focused fieldset': { borderColor: palette.accent, borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: palette.accent },
            }}
          />
        </Box>

        {/* Активные фильтры */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: palette.textSecondary, mb: 1, display: 'block' }}>
              Активные фильтры:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(filters).map(([key, values]) =>
                values.map((value) => (
                  <Chip
                    key={`${key}-${value}`}
                    label={value}
                    size="small"
                    onDelete={() => handleSelect(key, value)()}
                    sx={{
                      backgroundColor: palette.accentSoft,
                      color: palette.accent,
                      '& .MuiChip-deleteIcon': {
                        color: palette.accent,
                      },
                    }}
                  />
                ))
              )}
              {dateRange.fromDate && (
                <Chip
                  label={`От: ${dateRange.fromDate}`}
                  size="small"
                  onDelete={() => setDateRange(prev => ({ ...prev, fromDate: '' }))}
                  sx={{
                    backgroundColor: palette.accentSoft,
                    color: palette.accent,
                  }}
                />
              )}
              {dateRange.toDate && (
                <Chip
                  label={`До: ${dateRange.toDate}`}
                  size="small"
                  onDelete={() => setDateRange(prev => ({ ...prev, toDate: '' }))}
                  sx={{
                    backgroundColor: palette.accentSoft,
                    color: palette.accent,
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Кнопка применения */}
        <Button
          variant="contained"
          onClick={handleFilterChange}
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.5,
            background: `linear-gradient(135deg, ${palette.gradientStart || palette.accent}, ${palette.gradientEnd || palette.accentDark})`,
            '&:hover': { background: `linear-gradient(135deg, ${palette.accentDark}, ${palette.accent})` },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Применить фильтры
        </Button>
      </Paper>
    </Fade>
  );
}

export default EventFilters;