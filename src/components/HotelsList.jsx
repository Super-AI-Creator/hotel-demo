import React, { useState } from 'react';
import HotelForm from './HotelForm';
import DoorsList from './DoorsList';
import SyncTrigger from './SyncTrigger';
import LockComponent from './LockComponent';
import BookingList from './BookingList';
import { Box, Typography, Card, CardMedia, IconButton, Paper, Button, Rating, CircularProgress } from '@mui/material';
import { Edit, DoorFront, Sync, Lock } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export default function HotelsList({ hotels, onChange }) {
  const [selected, setSelected] = useState(null);
  const [visibleComponent, setVisibleComponent] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleComponent = (hotelId, component) => {
    setLoading(true);
    setVisibleComponent((prev) => ({
      ...prev,
      [hotelId]: prev[hotelId] === component ? null : component,
    }));
    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  };

  const bookings = [
    { guestName: 'John Doe', roomNumber: '101', checkInDate: '2023-10-01', checkOutDate: '2023-10-05' },
    { guestName: 'Jane Smith', roomNumber: '102', checkInDate: '2023-10-02', checkOutDate: '2023-10-06' },
    // Add more bookings as needed
  ];

  const animationVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: '0%' },
    exit: { opacity: 0, x: '100%' },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Your Hotels</Typography>
          {hotels.length === 0 && <Card sx={{ padding: 2 }}>No hotels yet. Add one below.</Card>}
          {hotels.map((h, index) => (
            <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140, filter: 'brightness(0.7)' }}
                  image={`/hotel/${index + 1}.png`}
                  alt={`Hotel ${h.name}`}
                />
                <Box component={Paper} elevation={0} sx={{ flex: 1, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6">{h.name}</Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>A luxurious stay with stunning views.</Typography>
                  <Rating name="read-only" value={4} readOnly sx={{ marginBottom: 1 }} />
                  <Typography variant="body2">Timezone: {h.timezone} — Checkin: {h.checkInStart} — Checkout: {h.checkOutEnd}</Typography>
                  <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Button variant="outlined" color="primary" sx={{ marginBottom: 1 }} onClick={() => toggleComponent(h.id, 'booking')}>Booking List</Button>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <IconButton onClick={() => setSelected(h)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => setSelected({ ...h, manageDoors: true })} color="primary" sx={{ marginLeft: 1 }}>
                        <DoorFront />
                      </IconButton>
                      <IconButton onClick={() => toggleComponent(h.id, 'sync')} color="primary" sx={{ marginLeft: 1 }}>
                        <Sync />
                      </IconButton>
                      <IconButton onClick={() => toggleComponent(h.id, 'lock')} color="primary" sx={{ marginLeft: 1 }}>
                        <Lock />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <motion.div whileHover={{ scale: 1.1 }} sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 140, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                    image={`/hotel/${(index + 1) % 8 + 1}.png`} // Use a different image for the right side
                    alt={`Hotel ${h.name} - Right`}
                  />
                </motion.div>
              </Card>
              <AnimatePresence>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginLeft: 2 }}>Please wait for a minute...</Typography>
                  </Box>
                ) : (
                  <>
                    {visibleComponent[h.id] === 'booking' && (
                      <motion.div
                        variants={animationVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                      >
                        <BookingList bookings={bookings} />
                      </motion.div>
                    )}
                    {visibleComponent[h.id] === 'sync' && (
                      <motion.div
                        variants={animationVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                      >
                        <SyncTrigger hotel={h} />
                      </motion.div>
                    )}
                    {visibleComponent[h.id] === 'lock' && (
                      <motion.div
                        variants={animationVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                      >
                        <LockComponent hotel={h} />
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </Box>
        <Box sx={{ width: 420 }}>
          <HotelForm hotel={selected} onSaved={onChange} />
        </Box>
      </Box>
      {selected && selected.manageDoors && <DoorsList hotel={selected} onSaved={onChange} />}
    </Box>
  );
}