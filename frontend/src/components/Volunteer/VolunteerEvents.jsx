import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import EventFilters from '../Filters/EventFilters';
import EventMap from '../Map/EventMap';
import EventCard from '../EventCards/EventCard';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/my-events/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const eventData = response.data.map(event => ({
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
        setVolunteerEvents(eventData || []);
        setFilteredEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (filters) => {
    console.log('Filter change:', filters);
    const filtered = volunteerEvents.filter((event) => {
      const matchCountry = filters.country?.length ? filters.country.includes(event.country) : true;
      const matchCity = filters.city?.length ? filters.city.includes(event.city) : true;
      const matchCategory = filters.category?.length ? filters.category.includes(event.category) : true;
      const matchFromDate = filters.fromDate ? new Date(event.startDate) >= new Date(filters.fromDate) : true;
      const matchToDate = filters.toDate ? new Date(event.endDate) <= new Date(filters.toDate) : true;
      return matchCountry && matchCity && matchCategory && matchFromDate && matchToDate;
    });
    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: palette.accent }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
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
          Мои мероприятия
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          События, в которых вы участвуете
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <EventFilters onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <EventMap events={filteredEvents} />
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