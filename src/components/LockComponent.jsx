import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Grid, Avatar, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, CircularProgress } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getLockData, getRoomData, setLockID } from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LockComponent({ hotel }) {
  const [locks, setLocks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedLocks, setSelectedLocks] = useState({});
  const [loading, setLoading] = useState(true);

  const get_lock_data = async () => {
    try {
      const storedPMS = localStorage.getItem('pms');
      const payload = {"pms":storedPMS}
      const lock_response = await getLockData(hotel.hotel_id,payload);
      setLocks(lock_response.data);
    } catch (error) {
      console.error('Error fetching lock data:', error);
    }
  };

  const get_room_data = async () => {
    try {
      const storedPMS = localStorage.getItem('pms');
      const payload = {"pms":storedPMS}
      const room_response = await getRoomData(hotel.hotel_id, payload);
      setRooms(room_response.data);

      let initialLocks = {};
      room_response.data.forEach(room => {
        if (room.lock_id) {
          initialLocks[room.room_id + "-" + room.unit_id] = room.lock_id;
        }
      });
      setSelectedLocks(initialLocks);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await get_lock_data();
      await get_room_data();
      setLoading(false);
    };

    fetchData();
  }, [hotel.hotel_id]);

  const getBatteryColor = (battery) => {
    if (battery > 75) return 'success';
    if (battery > 50) return 'primary';
    if (battery > 25) return 'warning';
    return 'error';
  };

  const handleLockChange = async (roomId, unitID, lockId) => {
    setSelectedLocks((prev) => ({ ...prev, [roomId + "-" + unitID]: lockId }));
    const payload = {
      'room_id': roomId,
      'unit_id': unitID,
      'lock_id': lockId
    };
    try {
      const response = await setLockID(hotel.hotel_id, payload);
      if (response.message === "success") {
        toast.success('Lock set successfully!');
      } else {
        toast.error('Failed to set lock.');
      }
    } catch (error) {
      toast.error('Error setting lock.');
      console.error('Error setting lock:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ duration: 0.5 }}
      style={{ width: '70%', marginLeft: 'auto' }}
    >
      <Card sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Lock Status</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>Please wait for a minute...</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {locks?.map((lock) => (
                <Grid item xs={12} sm={6} md={4} key={lock.lockId}>
                  <Card sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', marginRight: 2 }}>
                      <LockIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{lock.lockAlias}</Typography>
                      <Typography variant="body2" color="textSecondary">ID: {lock.lockId}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={lock.electricQuantity}
                        color={getBatteryColor(lock.electricQuantity)}
                        sx={{ marginTop: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">{lock.electricQuantity}% Battery</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <br></br>
            <br></br>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room ID</TableCell>
                    <TableCell>Unit ID</TableCell>
                    <TableCell>Lock ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms?.map((room) => (
                    <TableRow key={room.room_id + "-" + room.unit_id}>
                      <TableCell>{room.room_id}</TableCell>
                      <TableCell>{room.unit_id}</TableCell>
                      <TableCell>
                        <Select
                          value={selectedLocks[room.room_id + "-" + room.unit_id]}
                          onChange={(e) => handleLockChange(room.room_id, room.unit_id, e.target.value)}
                          displayEmpty
                          fullWidth
                        >
                          <MenuItem value="" disabled>Select Lock</MenuItem>
                          {locks.map((lock) => (
                            <MenuItem key={lock.lockId} value={lock.lockId}>
                              {lock.lockAlias} (ID: {lock.lockId})
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
}