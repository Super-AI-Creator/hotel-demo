import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Typography, Button, TextField, Card, Grid, CircularProgress } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function Login({onLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); // ensure form submit works
    // alert("Form submitted!"); // test alert
    setLoading(true);
    try {
      const res = await login(email, password);

      if (res && res.access_token) {
        onLogin(res.access_token)
        nav('/');
      } else {
        toast.error(res?.message || 'Login failed');
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ maxWidth: 480, margin: '20px auto', padding: 3, backgroundColor: '#fff' }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Login</Typography>
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item>
              <Email />
            </Grid>
            <Grid item xs>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="flex-end" sx={{ marginTop: 2 }}>
            <Grid item>
              <Lock />
            </Grid>
            <Grid item xs>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3, position: 'relative' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
            </Button>
          </motion.div>
        </Box>
        <ToastContainer position="top-right" autoClose={3000} />
      </Card>
    </motion.div>
  );
}