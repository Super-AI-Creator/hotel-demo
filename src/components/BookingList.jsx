import React from 'react';
import { Box, Typography, Card, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { Person, CalendarToday } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function BookingList({ bookings = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.5 }}
      style={{ width: '70%', marginLeft: 'auto' }}
    >
      <Card sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Booking List</Typography>
        <List>
          {bookings.map((booking, index) => (
            <React.Fragment key={booking.id || index}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={booking.guestName}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Room: {booking.roomNumber || '—'}
                      </Typography>
                      {' — '}
                      <CalendarToday fontSize="small" sx={{ verticalAlign: 'middle', marginRight: 0.5 }} />
                      {booking.checkInDate} to {booking.checkOutDate}
                    </>
                  }
                />
                <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
                  <Typography variant="caption" color="text.secondary">{booking.channel || ''}</Typography>
                </Box>
              </ListItem>
              {index < bookings.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </motion.div>
  );
}
