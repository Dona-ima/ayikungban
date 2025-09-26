import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, InputAdornment, IconButton, AppBar, Toolbar, Paper, Card, CardContent, Button, Avatar, Badge } from '@mui/material';
import { Search, Add, Chat, History, Send, ArrowForward, ArrowBack, MoreVert } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const typing = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

const cardHover = keyframes`
  from { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  to { transform: scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.15); background-color: #A5D6A7; }
`;

const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F1F8E9' }}>
      {/* Left Sidebar */}
      <Box sx={{ width: 280, borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
        <Toolbar sx={{ p: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}><ArrowBack /></IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GeoPlateforme</Typography>
        </Toolbar>
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2, mb: 1, backgroundColor: '#e8f5e9', '&:hover': { backgroundColor: '#dcedc8' } }}>
                <ListItemIcon sx={{ minWidth: 40, color: '#2E7D32' }}><Chat /></ListItemIcon>
                <ListItemText primary="Discussion" primaryTypographyProps={{ fontWeight: 'medium' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: 2, '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}><History /></ListItemIcon>
                <ListItemText primary="Historique" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2, '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}>
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" sx={{ '& .MuiBadge-dot': { backgroundColor: '#2E7D32', border: '2px solid white' } }}>
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

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Discussion</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <TextField
              variant="outlined"
              size="small"
              placeholder="Rechercher..."
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                sx: { borderRadius: 2, backgroundColor: '#f7f8fa', '& fieldset': { border: 'none' } }
              }}
            />
          </Toolbar>
        </AppBar>
        <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
          {/* Main Chat Area */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #e0e0e0' }}>
            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* AI Message */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper sx={{ p: 1.5, borderRadius: '20px 20px 20px 5px', backgroundColor: '#e0e0e0', maxWidth: '70%', boxShadow: 'none' }}>
                  <Typography variant="body1">Bonjour! Je suis FoncierBot, votre assistant pour toutes vos questions foncières. Comment puis-je vous aider aujourd'hui ?</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: '#616161', mt: 1 }}>10:00</Typography>
                </Paper>
              </Box>
              {/* User Message */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Paper sx={{ p: 1.5, borderRadius: '20px 20px 5px 20px', backgroundColor: '#81C784', color: 'white', maxWidth: '70%', boxShadow: 'none' }}>
                  <Typography variant="body1">Quelles sont les démarches pour obtenir un permis de construire sur ma parcelle ?</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: '#eeeeee', mt: 1 }}>10:05</Typography>
                </Paper>
              </Box>
              {/* Typing Indicator */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper sx={{ p: 1.5, borderRadius: '20px 20px 20px 5px', backgroundColor: '#e0e0e0', maxWidth: 'fit-content', boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#BDBDBD', animation: `${typing} 1.2s infinite ease-in-out` }} />
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#BDBDBD', animation: `${typing} 1.2s infinite ease-in-out 0.3s` }} />
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#BDBDBD', animation: `${typing} 1.2s infinite ease-in-out 0.6s` }} />
                  </Box>
                </Paper>
              </Box>
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)' }}>
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                <Grid item><Button variant="outlined" size="small" sx={{ borderRadius: 20, borderColor: '#81C784', color: '#2E7D32', '&:hover': { backgroundColor: '#E8F5E9' } }}>Informations cadastrales</Button></Grid>
                <Grid item><Button variant="outlined" size="small" sx={{ borderRadius: 20, borderColor: '#81C784', color: '#2E7D32', '&:hover': { backgroundColor: '#E8F5E9' } }}>Réglementation</Button></Grid>
                <Grid item><Button variant="outlined" size="small" sx={{ borderRadius: 20, borderColor: '#81C784', color: '#2E7D32', '&:hover': { backgroundColor: '#E8F5E9' } }}>Valeur vénale</Button></Grid>
                <Grid item><Button variant="outlined" size="small" sx={{ borderRadius: 20, borderColor: '#81C784', color: '#2E7D32', '&:hover': { backgroundColor: '#E8F5E9' } }}>Bornage</Button></Grid>
              </Grid>
              <TextField
                fullWidth
                placeholder="Écrivez votre message ici..."
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'white' } }}
                InputProps={{
                  startAdornment: <IconButton><Add /></IconButton>,
                  endAdornment: <IconButton color="primary"><Send /></IconButton>,
                }}
              />
            </Box>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4} sx={{ p: 2, backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Historique récent</Typography>
              <IconButton size="small"><ArrowForward /></IconButton>
            </Box>
            <Card sx={{ mb: 2, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { animation: `${cardHover} 0.3s ease forwards`, cursor: 'pointer' } }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Terrain agricole - Achat</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>Comment puis-je vérifier la...</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">Hier, 14:30</Typography>
                  <Button size="small" sx={{ color: '#2E7D32' }}>Reprendre</Button>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ mb: 2, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { animation: `${cardHover} 0.3s ease forwards`, cursor: 'pointer' } }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Permis de construire</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>Votre dossier est-il complet ?</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">Avant-hier, 09:00</Typography>
                  <Button size="small" sx={{ color: '#2E7D32' }}>Reprendre</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ChatbotPage;
