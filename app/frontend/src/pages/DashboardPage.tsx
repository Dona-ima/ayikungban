import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box, List, ListItem, Avatar, ListItemText, ListItemIcon } from '@mui/material';
import { PersonOutline, UploadFileOutlined, AssessmentOutlined, NotificationsNoneOutlined, LocationOn, SystemUpdateAlt, Description } from '@mui/icons-material';
import MainLayout from '../components/MainLayout';

const quickAccessItems = [
  {
    title: 'Informations Personnelles',
    path: '/profile',
    icon: <PersonOutline sx={{ fontSize: 40, color: '#4caf50' }} />,
    description: 'Gérez et mettez à jour votre profil et vos coordonnées.',
  },
  {
    title: 'Uploader un Levé',
    path: '/upload',
    icon: <UploadFileOutlined sx={{ fontSize: 40, color: '#4caf50' }} />,
    description: 'Soumettez de nouvelles données topographiques pour traitement.',
  },
  {
    title: 'Mes Résultats',
    path: '/results',
    icon: <AssessmentOutlined sx={{ fontSize: 40, color: '#4caf50' }} />,
    description: 'Consultez l\'historique et les détails de vos levés traités.',
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: <NotificationsNoneOutlined sx={{ fontSize: 40, color: '#4caf50' }} />,
    description: 'Recevez des mises à jour sur l\'état de vos levés et annonces.',
  },
];

const recentActivities = [
    {
      icon: <LocationOn />,
      primary: 'Levé "Projet Montagne" terminé. Résultats disponibles.',
      secondary: 'Il y a 2 heures',
    },
    {
      icon: <UploadFileOutlined />,
      primary: 'Nouveau levé "Terrain Urbain" a été téléchargé avec succès.',
      secondary: 'Il y a 1 jour',
    },
    {
      icon: <SystemUpdateAlt />,
      primary: 'Mise à jour du système : Amélioration de la précision des calculs.',
      secondary: 'Il y a 3 jours',
    },
    {
      icon: <Description />,
      primary: 'Rapport détaillé pour "Champ Agricole" généré.',
      secondary: 'Il y a 5 jours',
    },
  ];
  

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', dateOptions);

  return (
    <MainLayout title="Tableau de Bord">
      <Box sx={{ p: 3 }}>
        <Box sx={{ backgroundColor: '#4caf50', color: 'white', p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bonjour, M. Dupont !
          </Typography>
          <Typography variant="subtitle1">
            Bienvenue sur GeoPlateforme. Explorez vos projets.
          </Typography>
          <Typography variant="caption" display="block" mt={2}>
            {formattedDate}
          </Typography>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom>
          Accès Rapide
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }} alignItems="stretch">
          {quickAccessItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar sx={{ backgroundColor: '#e8f5e9', width: 60, height: 60 }}>
                      {item.icon}
                    </Avatar>
                  </Box>
                  <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center', fontWeight: '600' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    {item.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#4caf50', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      borderRadius: '0.5rem',
                      textTransform: 'none',
                      '&:hover': { 
                        backgroundColor: '#388e3c',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                      } 
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    Accéder
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" component="h2" gutterBottom>
          Activité Récente
        </Typography>
        <Card>
          <List>
            {recentActivities.map((activity, index) => (
              <ListItem key={index} divider={index < recentActivities.length - 1}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {activity.icon}
                </ListItemIcon>
                <ListItemText
                  primary={activity.primary}
                  secondary={activity.secondary}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondaryTypographyProps={{ align: 'right' }}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;