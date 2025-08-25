import React, { useEffect, useState } from 'react';
import { listDoors, addDoor } from '../api';
import { Box, Typography, Button, TextField, Select, MenuItem, Card, Grid, IconButton } from '@mui/material';
import { DoorFront, Label, Numbers } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function DoorsList({ hotel, onSaved }) {
  const [doors, setDoors] = useState([]);
  const [form, setForm] = useState({ type: 'FRONT', label: '', number: '', range_start: '', range_end: '' });

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await listDoors(hotel.id);
      setDoors(res || []);
    })();
  }, [hotel]);

  const save = async () => {
    const payload = { ...form };
    if (!payload.label) return alert('label required');
    if (payload.type !== 'ROOM') { delete payload.number; }
    await addDoor(hotel.id, payload);
    setForm({ type: 'FRONT', label: '', number: '', range_start: '', range_end: '' });
    onSaved && onSaved();
    const res = await listDoors(hotel.id);
    setDoors(res);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ marginTop: 3, padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Doors for {hotel.name}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              fullWidth
              startAdornment={<DoorFront sx={{ marginRight: 1 }} />}
            >
              <MenuItem value="FRONT">FRONT</MenuItem>
              <MenuItem value="HALLWAY">HALLWAY</MenuItem>
              <MenuItem value="ROOM">ROOM</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Lock ID (label)"
              value={form.label}
              onChange={e => setForm({ ...form, label: e.target.value })}
              fullWidth
              InputProps={{
                startAdornment: <Label sx={{ marginRight: 1 }} />
              }}
            />
          </Grid>
          {form.type === 'ROOM' ? (
            <Grid item xs={12}>
              <TextField
                label="Room number"
                value={form.number}
                onChange={e => setForm({ ...form, number: e.target.value })}
                fullWidth
                InputProps={{
                  startAdornment: <Numbers sx={{ marginRight: 1 }} />
                }}
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Range start"
                  value={form.range_start}
                  onChange={e => setForm({ ...form, range_start: e.target.value })}
                  fullWidth
                  InputProps={{
                    startAdornment: <Numbers sx={{ marginRight: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Range end"
                  value={form.range_end}
                  onChange={e => setForm({ ...form, range_end: e.target.value })}
                  fullWidth
                  InputProps={{
                    startAdornment: <Range sx={{ marginRight: 1 }} />
                  }}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={save} fullWidth component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Add Door
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ marginTop: 3 }}>Existing doors</Typography>
        {doors.map(d => (
          <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card sx={{ marginBottom: 2, padding: 2 }}>
              <Typography variant="body2"><strong>{d.type}</strong> — {d.label}</Typography>
              <Typography variant="caption">number: {d.number} range: {d.range_start}-{d.range_end}</Typography>
            </Card>
          </motion.div>
        ))}
      </Card>
    </motion.div>
  );
}