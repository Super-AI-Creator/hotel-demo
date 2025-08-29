import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Card, Grid, Link } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res && res.access_token) {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('pms', res.pms_token);
        onLogin(res.access_token, res.pms_token);
        navigate('/');
      } else {
        toast.error(res?.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Error during login');
      console.error('Login error:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ maxWidth: 480, margin: '20px auto', padding: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Login</Typography>
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Login
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Don't have an account?{' '}
          <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
            Register
          </Link>
        </Typography>
        <ToastContainer position="top-right" autoClose={3000} />
      </Card>
    </motion.div>
  );
}
