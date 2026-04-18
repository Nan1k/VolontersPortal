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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTheme } from '@mui/material/styles';

const SECTIONS = [
  { key: 'country', title: 'Страна' },
  { key: 'city', title: 'Город' },
  { key: 'category', title: 'Категория' },
];

const defaultOptions = { country: [], city: [], category: [] };

function EventFilters({ options = defaultOptions, filters, onFiltersChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const merged = {
    country: options.country || [],
    city: options.city || [],
    category: options.category || [],
  };

  const palette = {
    cardBg: '#ffffff',
    border: '#e8edf2',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    accentDark: '#8b5cf6',
    accentSoft: '#fff5f0',
    error: '#dc3545',
  };

  const [open, setOpen] = useState({
    country: false,
    city: false,
    category: false,
  });

  const getActiveFiltersCount = () => {
    let count =
      (filters.country?.length || 0) +
      (filters.city?.length || 0) +
      (filters.category?.length || 0);
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    return count;
  };

  const handleSelect = (filterKey, value) => () => {
    const prev = filters[filterKey] || [];
    const nextVals = prev.includes(value)
      ? prev.filter((item) => item !== value)
      : [...prev, value];
    onFiltersChange({
      ...filters,
      [filterKey]: nextVals,
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    onFiltersChange({
      ...filters,
      [name]: value,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      country: [],
      city: [],
      category: [],
      fromDate: '',
      toDate: '',
    });
  };

  const getFilterIcon = (filterKey) => {
    if (filterKey === 'category') {
      return <CategoryIcon sx={{ fontSize: 20, color: palette.accent }} />;
    }
    return <LocationOnIcon sx={{ fontSize: 20, color: palette.accent }} />;
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

        {SECTIONS.map(({ key, title }) => {
          const items = merged[key] || [];
          return (
            <Box key={key} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: open[key] ? palette.accentSoft : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: palette.accentSoft },
                }}
                onClick={() => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getFilterIcon(key)}
                  <Typography variant="body1" sx={{ fontWeight: 600, color: palette.textPrimary }}>
                    {title}
                  </Typography>
                  {(filters[key] || []).length > 0 && (
                    <Chip
                      label={(filters[key] || []).length}
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
                  {open[key] ? (
                    <ExpandLessIcon sx={{ color: palette.accent }} />
                  ) : (
                    <ExpandMoreIcon sx={{ color: palette.textSecondary }} />
                  )}
                </IconButton>
              </Box>
              {open[key] && (
                <Box
                  sx={{
                    maxHeight: 250,
                    overflowY: 'auto',
                    mt: 1,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: palette.accentSoft,
                  }}
                >
                  {items.length === 0 ? (
                    <Typography variant="body2" sx={{ color: palette.textSecondary, px: 1 }}>
                      Нет значений — появятся после загрузки мероприятий с этим полем
                    </Typography>
                  ) : (
                    items.map((item) => (
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
                          '&:hover': { backgroundColor: palette.border },
                        }}
                        onClick={handleSelect(key, item)}
                      >
                        <Checkbox
                          checked={(filters[key] || []).includes(item)}
                          sx={{
                            color: palette.accent,
                            '&.Mui-checked': { color: palette.accent },
                          }}
                        />
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            sx: { color: palette.textPrimary, fontSize: '0.9rem' },
                          }}
                        />
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </Box>
          );
        })}

        <Divider sx={{ my: 2, borderColor: palette.border }} />

        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            color: palette.textPrimary,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 20, color: palette.accent }} />
          Период проведения
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: isMobile ? 'column' : 'row' }}>
          <TextField
            label="Дата от"
            type="date"
            name="fromDate"
            value={filters.fromDate || ''}
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
            value={filters.toDate || ''}
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

        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: palette.textSecondary, mb: 1, display: 'block' }}>
              Активные фильтры (применяются сразу):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['country', 'city', 'category'].map((key) =>
                (filters[key] || []).map((value) => (
                  <Chip
                    key={`${key}-${value}`}
                    label={value}
                    size="small"
                    onDelete={() =>
                      onFiltersChange({
                        ...filters,
                        [key]: (filters[key] || []).filter((v) => v !== value),
                      })
                    }
                    sx={{
                      backgroundColor: palette.accentSoft,
                      color: palette.accent,
                      '& .MuiChip-deleteIcon': { color: palette.accent },
                    }}
                  />
                ))
              )}
              {filters.fromDate && (
                <Chip
                  label={`От: ${filters.fromDate}`}
                  size="small"
                  onDelete={() => onFiltersChange({ ...filters, fromDate: '' })}
                  sx={{ backgroundColor: palette.accentSoft, color: palette.accent }}
                />
              )}
              {filters.toDate && (
                <Chip
                  label={`До: ${filters.toDate}`}
                  size="small"
                  onDelete={() => onFiltersChange({ ...filters, toDate: '' })}
                  sx={{ backgroundColor: palette.accentSoft, color: palette.accent }}
                />
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Fade>
  );
}

export default EventFilters;
