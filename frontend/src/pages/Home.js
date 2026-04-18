import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventFilters from '../components/Filters/EventFilters';
import EventMap from '../components/Map/EventMap';
import EventCard from '../components/EventCards/EventCard';
import { Box, Grid, CircularProgress, useMediaQuery, useTheme, Stack, Button, Typography } from '@mui/material';
import { API_BASE_URL } from '../config';


const FEATURED_FILTER_CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Иркутск',
];

const emptyFilters = {
  country: [],
  city: [],
  category: [],
  fromDate: '',
  toDate: '',
};

function GuestPage() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filterOptions = useMemo(() => {
    const countries = [...new Set(events.map((e) => e.country).filter(Boolean))].sort();
    const fromEvents = [...new Set(events.map((e) => e.city).filter(Boolean))];
    const otherCities = fromEvents
      .filter((c) => !FEATURED_FILTER_CITIES.includes(c))
      .sort((a, b) => a.localeCompare(b, 'ru'));
    const cities = [...FEATURED_FILTER_CITIES, ...otherCities];
    const categories = [...new Set(events.map((e) => e.category).filter(Boolean))].sort();
    return { country: countries, city: cities, category: categories };
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
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
  }, [events, filters]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events/`);
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
        setEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении событий:', error);
        setLoading(false);
      }
    };

    fetchEvents();
    const onEventsChanged = () => fetchEvents();
    window.addEventListener('volonters-events-changed', onEventsChanged);
    return () => window.removeEventListener('volonters-events-changed', onEventsChanged);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '64px', paddingLeft: 0, paddingRight: 0 }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Временный переход без авторизации
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Button size="small" variant="outlined" component={Link} to="/demo/volunteer">
            Волонтер
          </Button>
          <Button size="small" variant="outlined" component={Link} to="/demo/cityadmin">
            Админ города
          </Button>
          <Button size="small" variant="outlined" component={Link} to="/demo/regionadmin">
            Админ региона
          </Button>
          <Button size="small" variant="outlined" component={Link} to="/demo/superuser">
            Супер-админ
          </Button>
          <Button size="small" variant="outlined" component={Link} to="/chatpage">
            Чат
          </Button>
        </Stack>
      </Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          sx={{
            paddingLeft: isMobile ? 0 : '16px',
            paddingRight: isMobile ? 0 : '16px',
          }}
        >
          <Box
            sx={{
              position: isMobile ? 'relative' : 'sticky',
              top: isMobile ? '0' : '80px',
              padding: '16px 0',
            }}
          >
            <EventFilters
              options={filterOptions}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} md={9} sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box sx={{ mb: 2 }}>
            <EventMap events={filteredEvents} focusCityNames={filters.city} />
          </Box>
          <Grid container spacing={isMobile ? 1 : 2}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GuestPage;
