import React, { useEffect , useState} from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {getPinHistory} from '../api'
export default function PinHistory() {
    //   const pinHistoryData = [
    //     { id: 1, guestName: 'John Doe', roomNumber: '101', pin: '1234', date: '2023-10-01' },
    //     { id: 2, guestName: 'Jane Smith', roomNumber: '102', pin: '5678', date: '2023-10-02' },
    //     // Add more pin history data as needed
    //   ];
    const [pinHistoryData, setPinHistoryData] = useState([])
    const getpinHistory = async () =>{
        const r = await getPinHistory()
        console.log(r.logs)
        setPinHistoryData(r.logs)
    }
    useEffect(() => {
        getpinHistory()
    }, [])
    return (
        <Box>
            <Card sx={{ padding: 3, marginTop: 3 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Pin History</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hotel Name</TableCell>
                                <TableCell>Booking Number </TableCell>
                                <TableCell>Guest Name</TableCell>
                                <TableCell>Access Start</TableCell>
                                <TableCell>Access End</TableCell>
                                <TableCell>PIN Code</TableCell>
                                <TableCell>HHSLock Payload</TableCell>
                                <TableCell>Method</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pinHistoryData.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.hotel_name}</TableCell>
                                    <TableCell>{entry.booking_number}</TableCell>
                                    <TableCell>{entry.guest_name}</TableCell>
                                    <TableCell>{entry.access_start}</TableCell>
                                    <TableCell>{entry.access_end}</TableCell>
                                    <TableCell>{entry.pin_code}</TableCell>
                                    <TableCell>Lock = {entry.ttlock_payload[0].lock} <br></br> KeyboardPwdId = {entry.ttlock_payload[0].result.keyboardPwdId}</TableCell>
                                    <TableCell>{entry.method}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}