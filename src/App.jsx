import React, { useState, useEffect } from 'react';
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Link, Box, IconButton, Tab, Tabs } from '@mui/material';
import { Home, Login as LoginIcon, PersonAdd, ExitToApp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PinHistory from './components/PinHistory';
import { getAuto } from './api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUserName = localStorage.getItem('user_name');
    setToken(storedToken);
    setUserName(storedUserName || '');

    const interval = setInterval(async () => {
      try {
        const response = await getAuto()
        const data = response;
        // toast.success('Auto sync triggered successfully!');
        if(data.count>=1){
          data.processed.map((item)=>{
            toast.success(`Booking - ${item.booking} integrated with HHSLock just ago.`);
          })
        }
        // toast.success('Auto sync triggered successfully!');
        // console.log('Auto sync response:', data);
      } catch (error) {
        // toast.error('Failed to trigger auto sync.');
        console.error('Auto sync error:', error);
      }
    }, 120000); // 2 minutes in milliseconds6
    

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // Empty dependency array to run once on mount


  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) navigate("/");
    else navigate("/pin_history");
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    // navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    setToken(null);
    setUserName('');
    navigate('/login');
  };

  return (
    <Box className="app" sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <AppBar position="static" component={motion.div} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home" component={RouterLink} to="/">
            <Home />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hotel Management
          </Typography>
          <center>
            <Tabs value={selectedTab} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary" style={{ marginRight: '50px' }}>
              <Tab label="Dashboard" />
              <Tab label="Pin History" />
            </Tabs>
          </center>
          <nav>
            {!token ? (
              <>
                <Link component={RouterLink} to="/login" color="inherit" sx={{ marginRight: 2, display: 'flex', alignItems: 'center' }}>
                  <LoginIcon sx={{ marginRight: 0.5 }} />
                  Login
                </Link>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={logout} startIcon={<ExitToApp />}>
                  Logout
                </Button>
              </>
            )}
          </nav>
        </Toolbar>
      </AppBar>

      <Box component="main" className="container" sx={{ padding: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pin_history" element={<PinHistory />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Box>
      <ToastContainer position="top-right" autoClose={false} />
    </Box>
  );
}

export default App;