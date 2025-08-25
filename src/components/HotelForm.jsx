import React, { useEffect, useState } from 'react';
import { createHotel, updateHotel } from '../api';
import { Box, Typography, Button, TextField, Select, MenuItem, Card, Grid } from '@mui/material';
import { Business, AccessTime, VpnKey, Lock, LockOpen } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function HotelForm({ hotel, onSaved }) {
  const [form, setForm] = useState({
    name: '', address: '', timezone: 'UTC', beds24_prop_key: '', beds24_api_key: '',
    ttlock_client_id: '', ttlock_client_secret: '', ttlock_user_id: '', ttlock_user_password: '', default_checkin_time: '14:00', default_checkout_time: '10:00', pin_length: 4, default_lockid: ''
  });

  useEffect(() => { if (hotel) setForm({ ...form, ...hotel }); }, [hotel]);

  const save = async () => {
    if (hotel && hotel.id) {
      await updateHotel(hotel.id, form);
    } else {
      await createHotel(form);
    }
    onSaved && onSaved();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ padding: 3, marginTop: 3 }} style={{alignItems:'center'}}>
        <div>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>{hotel ? 'Edit Hotel' : 'Add Hotel'}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Business sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Timezone"
                value={form.timezone}
                onChange={e => setForm({ ...form, timezone: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <AccessTime sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="PMS Hotelsoftware propKey"
                value={form.beds24_prop_key}
                onChange={e => setForm({ ...form, beds24_prop_key: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <VpnKey sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="PMS Hotelsoftware API Key"
                value={form.beds24_api_key}
                onChange={e => setForm({ ...form, beds24_api_key: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <VpnKey sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="HHSLock clientId"
                value={form.ttlock_client_id}
                onChange={e => setForm({ ...form, ttlock_client_id: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Lock sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="HHSLock clientSecret"
                value={form.ttlock_client_secret}
                onChange={e => setForm({ ...form, ttlock_client_secret: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <LockOpen sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="HHSLock User ID"
                value={form.ttlock_user_id}
                onChange={e => setForm({ ...form, ttlock_user_id: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Lock sx={{ marginRight: 1 }} />
                }}
              />

          <br></br>
          <br></br>
            
              <TextField
                label="HHSLock User Password"
                value={form.ttlock_user_password}
                onChange={e => setForm({ ...form, ttlock_user_password: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Lock sx={{ marginRight: 1 }} />
                }}
              />

              <br></br>
              <br></br>
              <Typography variant="body1">PIN length</Typography>
              <Select
                value={form.pin_length}
                onChange={e => setForm({ ...form, pin_length: parseInt(e.target.value) })}
                fullWidth
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>

              <br></br>
              <br></br>
              
              <Button variant="contained" color="primary" onClick={save} fullWidth component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {hotel ? 'Save' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Card>
    </motion.div>
  );
}