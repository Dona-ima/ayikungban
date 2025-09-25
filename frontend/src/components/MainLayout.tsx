import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Badge, IconButton, useTheme, Fab } from '@mui/material';
import { Dashboard, Person, Upload, Notifications, Assessment, Menu as MenuIcon, ChatBubbleOutline } from '@mui/icons-material';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const drawerWidth = 240;

const menuItems = [
  { name: 'Tableau de Bord', path: '/dashboard', icon: <Dashboard /> },
  { name: 'Informations Personnelles', path: '/profile', icon: <Person /> },
  { name: 'Uploader un Levé', path: '/upload', icon: <Upload /> },
  { name: 'Notifications', path: '/notifications', icon: <Notifications />, notificationCount: 6 },
  { name: 'Tous les Résultats', path: '/results', icon: <Assessment /> },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const drawerContent = (
    <div>
      <Toolbar /> {/* Add Toolbar to push content below AppBar */}
      {/* Removed the green Box that contained GeoPlateforme */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component={NavLink} to={item.path} sx={{
              '&.active': {
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderRight: '3px solid #4caf50',
                color: '#4caf50'
              }
            }}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {item.notificationCount && (
                <Badge badgeContent={item.notificationCount} color="error" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Temporary Drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Permanent Drawer for desktop */}
                  <Drawer
                    variant="permanent"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: 'none' },
                    }}
                    open
                  >
                    {drawerContent}
                  </Drawer>      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#4caf50',
            zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above Drawer
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Logo Placeholder */}
            <Box sx={{ mr: 1, width: 32, height: 32, backgroundColor: 'white', borderRadius: '50%' }} />
            <Typography variant="h6" noWrap component="div" sx={{ mr: 2 }}>
              GeoPlateforme
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" aria-label="Topo AI" title="Topo AI" sx={{ mr: 1 }}>
              <ChatBubbleOutline />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap sx={{ mr: 2 }}>
              Topo AI
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleLogout} 
              sx={{ 
                backgroundColor: '#ffffff',
                color: '#4caf50',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              Déconnexion
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            px: 1, // Reduced horizontal padding
            py: 3, // Keep vertical padding
            boxSizing: 'border-box',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
      <Fab color="primary" aria-label="chatbot" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <ChatBubbleOutline />
      </Fab>
    </Box>
  );
};

export default MainLayout;