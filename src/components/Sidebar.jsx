import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, History } from '@mui/icons-material';

export default function Sidebar({ onSelect }) {
  return (
    <Drawer variant="permanent" anchor="left">
      <Typography variant="h6" sx={{ padding: 2 }}>Navigation</Typography>
      <List>
        <ListItem button onClick={() => onSelect('dashboard')}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => onSelect('pinHistory')}>
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText primary="Pin History" />
        </ListItem>
      </List>
    </Drawer>
  );
}