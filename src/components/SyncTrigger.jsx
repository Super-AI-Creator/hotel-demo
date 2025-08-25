import React, { useState } from 'react';
import { triggerSync, listBookings } from '../api';
import { Box, Typography, Button, TextField, Card, Grid, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { DateRange, Sync, List as ListIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import BookingList from './BookingList';

export default function SyncTrigger({ hotel }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startFilter, setStartFilter] = useState('arrivalFrom');
  const [endFilter, setEndFilter] = useState('arrivalTo');
  const [syncRes, setSyncRes] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState({ booking: false, sync: false });

  const runSync = async () => {
    setLoading((prev) => ({ ...prev, sync: true }));
    const payload = { hotelId: hotel.hotel_id };

    if (start) payload[startFilter] = start;
    if (end) payload[endFilter] = end;

    console.log('🔄 Sending sync payload:', payload);

    const r = await triggerSync(hotel.id, payload);
    setSyncRes(r);
    setLoading((prev) => ({ ...prev, sync: false }));
  };

  const fetchBookings = async () => {
    setLoading((prev) => ({ ...prev, booking: true }));
    try {
      const payload = { hotelId: hotel.hotel_id };
      if (start) payload[startFilter] = start;
      if (end) payload[endFilter] = end;

      console.log('📋 Fetching bookings with payload:', payload);

      const r = await listBookings(hotel.id, payload);
      console.log('📋 Bookings response:', r);

      // Force update even if same array
      setBookings([...(r.bookings || [])]);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
    setLoading((prev) => ({ ...prev, booking: false }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ marginTop: 3, padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Sync & Booking Preview for {hotel.name}
        </Typography>
        <Grid container spacing={2}>
          {/* Start Date + Filter */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start date (YYYY-MM-DD)"
              value={start}
              onChange={e => setStart(e.target.value)}
              fullWidth
              InputProps={{ startAdornment: <DateRange sx={{ marginRight: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Start Filter</InputLabel>
              <Select value={startFilter} onChange={e => setStartFilter(e.target.value)}>
                <MenuItem value="arrivalFrom">Arrival From</MenuItem>
                <MenuItem value="departureFrom">Departure From</MenuItem>
                <MenuItem value="bookingTimeFrom">Booking Time From</MenuItem>
                <MenuItem value="modifiedFrom">Modified From</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* End Date + Filter */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="End date (YYYY-MM-DD)"
              value={end}
              onChange={e => setEnd(e.target.value)}
              fullWidth
              InputProps={{ startAdornment: <DateRange sx={{ marginRight: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>End Filter</InputLabel>
              <Select value={endFilter} onChange={e => setEndFilter(e.target.value)}>
                <MenuItem value="arrivalTo">Arrival To</MenuItem>
                <MenuItem value="departureTo">Departure To</MenuItem>
                <MenuItem value="bookingTimeTo">Booking Time To</MenuItem>
                <MenuItem value="modifiedTo">Modified To</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action buttons */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchBookings}
              fullWidth
              startIcon={loading.booking ? <CircularProgress size={24} /> : <ListIcon />}
              disabled={loading.booking}
            >
              {loading.booking ? 'Loading...' : 'Booking List'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              onClick={runSync}
              fullWidth
              startIcon={loading.sync ? <CircularProgress size={24} /> : <Sync />}
              disabled={loading.sync}
            >
              {loading.sync ? 'Loading...' : 'Run Sync'}
            </Button>
          </Grid>
        </Grid>

        {bookings && <BookingList bookings={bookings} />}
        {syncRes && (
          <pre style={{ marginTop: 12, maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(syncRes, null, 2)}
          </pre>
        )}
      </Card>
    </motion.div>
  );
}