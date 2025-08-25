import React, { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Card } from '@mui/material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await register(email, password);
    if (res && res.message) {
      setMsg(res.message);
      setTimeout(() => nav('/login'), 1500);
    } else setMsg('Register failed');
  };

  return (
    <Card sx={{ maxWidth: 480, margin: '20px auto', padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Register (Hotel)</Typography>
      <Box component="form" onSubmit={submit}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
        {msg && <Typography variant="body2" sx={{ marginTop: 2 }}>{msg}</Typography>}
      </Box>
    </Card>
  );
}