import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
  IconButton,
  useTheme,
  Fab,
  Avatar
} from '@mui/material';
import { Dashboard, Person, Upload, Notifications, Assessment, ChatBubbleOutline, MoreVert } from '@mui/icons-material';

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

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => navigate('/login');

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ backgroundColor: theme.palette.primary.main, color: 'white', p: 2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          width="32"
          height="32"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 256 257"
          style={{ marginRight: theme.spacing(1) }}
        >
          <defs>
            <linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
              <stop offset="0%" stopColor="#41D1FF" />
              <stop offset="100%" stopColor="#BD34FE" />
            </linearGradient>
            <linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
              <stop offset="0%" stopColor="#FFEA83" />
              <stop offset="8.333%" stopColor="#FFDD35" />
              <stop offset="100%" stopColor="#FFA800" />
            </linearGradient>
          </defs>
          <path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path>
          <path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path>
        </svg>
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>GeoPlateforme</Typography>
      </Toolbar>

      <List sx={{ flexGrow: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: '12px',
                '&.active': {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
                },
                '&:hover': { backgroundColor: theme.palette.background.default },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: 'medium' }} />
              {item.notificationCount && (
                <Badge
                  badgeContent={item.notificationCount}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { backgroundColor: theme.palette.error.main } }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            borderRadius: 2,
            '&:hover': { backgroundColor: theme.palette.background.default, cursor: 'pointer' },
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{ '& .MuiBadge-dot': { backgroundColor: theme.palette.success.main, border: '2px solid white' } }}
          >
            <Avatar alt="User Name" src="https://via.placeholder.com/40" />
          </Badge>
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>User Name</Typography>
            <Typography variant="caption" color="text.secondary">Premium</Typography>
          </Box>
          <IconButton><MoreVert /></IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ width: '100%', ml: 0, backgroundColor: 'white', color: 'black', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>{title}</Typography>
          <ListItemButton component={NavLink} to="/chatbot" sx={{ color: 'black', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }, borderRadius: 1 }}>
            <IconButton color="inherit" aria-label="Topo AI" title="Topo AI" sx={{ mr: 1 }}><ChatBubbleOutline /></IconButton>
            <Typography variant="h6" color="inherit" noWrap>Topo AI</Typography>
          </ListItemButton>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRadius: '0 20px 20px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', borderRadius: '0 20px 20px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, pt: `calc(64px + ${theme.spacing(3)})`, pl: 3, pr: 3 }}>
        {children}
      </Box>

      <Fab
        color="primary"
        aria-label="chatbot"
        sx={{ position: 'fixed', bottom: 16, right: 16, background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, '&:hover': { transform: 'scale(1.05)' } }}
        onClick={() => navigate('/chatbot')}
      >
        <ChatBubbleOutline />
      </Fab>
    </Box>
  );
};

export default MainLayout;
