import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Card, Grid, Link, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { register } from '../api';

export default function Register() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { userId, password, token });

    // Validate fields
    if (!userId || !password || !token) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await register(userId, password, token);
      if (response.success) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        if(response.message=="success"){
          toast.success('Registration successful!');
          navigate('/login');
        }
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('The invite code is invalid');
      } else {
        toast.error('Error during registration');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ maxWidth: 480, margin: '20px auto', padding: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Register</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="User ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
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
              <TextField
                label="Invite Code"
                value={token}
                onChange={e => setToken(e.target.value)}
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
                  disabled={loading} // Disable button while loading
                >
                  {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Already have an account?{' '}
          <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>
            Login
          </Link>
        </Typography>
        <ToastContainer position="top-right" autoClose={3000} />
      </Card>
    </motion.div>
  );
}