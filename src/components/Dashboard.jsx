import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelsList from './HotelsList';
import { Box, Typography, Card, CircularProgress } from '@mui/material';
import { Hotel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    const storedPMS = localStorage.getItem('pms');
    const payload = {"pms":storedPMS}
    fetch('https://hhs-hotel-demo-backend-2ysyg.ondigitalocean.app/api/hotels/list_hotels', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        return res.json();
      })
      .then(data => {
        setHotels(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch hotels failed', err);
        setLoading(false);
      });
  }, [token, navigate]);


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card sx={{ padding: 3, marginTop: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Hotel sx={{ marginRight: 1 }} />
          <Typography variant="h4">Dashboard</Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>Please wait for a minute...</Typography>
          </Box>
        ) : (
          <HotelsList hotels={hotels} onChange={() => { window.location.reload(); }} />
        )}
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
}