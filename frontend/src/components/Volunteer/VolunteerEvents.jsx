import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Container, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import EventFilters from '../Filters/EventFilters';
import EventMap from '../Map/EventMap';
import EventCard from '../EventCards/EventCard';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';

import { API_BASE_URL } from '../../config';

const emptyFilters = {
  country: [],
  city: [],
  category: [],
  fromDate: '',
  toDate: '',
};

const VolunteerEvents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const palette = {
    pageBg: '#f5f7fa',
    textPrimary: '#1a1a2e',
    textSecondary: '#6c757d',
    accent: '#6e47c2',
    gradientStart: '#6e47c2',
    gradientEnd: '#8b5cf6',
  };

  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);

  const filterOptions = useMemo(() => {
    const countries = [...new Set(volunteerEvents.map((e) => e.country).filter(Boolean))].sort();
    const cities = [...new Set(volunteerEvents.map((e) => e.city).filter(Boolean))].sort();
    const categories = [...new Set(volunteerEvents.map((e) => e.category).filter(Boolean))].sort();
    return { country: countries, city: cities, category: categories };
  }, [volunteerEvents]);

  const filteredEvents = useMemo(() => {
    return volunteerEvents.filter((event) => {
      const matchCountry = filters.country.length
        ? filters.country.includes(event.country)
        : true;
      const matchCity = filters.city.length ? filters.city.includes(event.city) : true;
      const matchCategory = filters.category.length
        ? filters.category.includes(event.category)
        : true;
      const matchFromDate = filters.fromDate
        ? new Date(event.startDate) >= new Date(filters.fromDate)
        : true;
      const matchToDate = filters.toDate
        ? new Date(event.endDate) <= new Date(`${filters.toDate}T23:59:59`)
        : true;
      return matchCountry && matchCity && matchCategory && matchFromDate && matchToDate;
    });
  }, [volunteerEvents, filters]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/my-events/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const eventData = (response.data || []).map((event) => ({
          id: event.event_id,
          name: event.event_name,
          description: event.full_description,
          shortDescription: event.short_description,
          requiredPeople: event.required_volunteers,
          registeredPeople: event.registered_volunteers,
          points: event.participation_points,
          awards: event.rewards,
          startDate: event.start_date,
          endDate: event.end_date,
          country: event.country_name,
          city: event.city_name,
          category: event.category_name,
          imageUrl: event.image,
          latitude: event.latitude,
          longitude: event.longitude,
        }));
        setVolunteerEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: palette.accent }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
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
          Мои мероприятия
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          События, в которых вы участвуете
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <EventFilters
            options={filterOptions}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <EventMap events={filteredEvents} focusCityNames={filters.city} />
          </Box>
          {filteredEvents.length > 0 ? (
            <Grid container spacing={2}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} lg={4} key={event.id}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
                borderRadius: '16px',
                backgroundColor: '#fff5f0',
              }}
            >
              <EventIcon sx={{ fontSize: 48, color: palette.textSecondary, mb: 2 }} />
              <Typography variant="body1" sx={{ color: palette.textSecondary }}>
                У вас пока нет мероприятий
              </Typography>
              <Typography variant="body2" sx={{ color: palette.textSecondary, mt: 1 }}>
                Запишитесь на мероприятия, чтобы они появились здесь
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default VolunteerEvents;
