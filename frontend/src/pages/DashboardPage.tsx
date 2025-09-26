import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { PersonOutline, UploadFileOutlined, AssessmentOutlined, NotificationsNoneOutlined } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import MainLayout from '../components/MainLayout';

const cardHover = keyframes`
  from { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  to { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.15); background-color: #A5D6A7; }
`;

const quickAccessItems = [
  {
    title: 'Informations Personnelles',
    path: '/profile',
    icon: <PersonOutline sx={{ fontSize: 40 }} />,
    description: 'Gérez et mettez à jour votre profil et vos coordonnées.',
  },
  {
    title: 'Uploader un Levé',
    path: '/upload',
    icon: <UploadFileOutlined sx={{ fontSize: 40 }} />,
    description: 'Soumettez de nouvelles données topographiques pour traitement.',
  },
  {
    title: 'Mes Résultats',
    path: '/results',
    icon: <AssessmentOutlined sx={{ fontSize: 40 }} />,
    description: 'Consultez l\'historique et les détails de vos levés traités.',
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: <NotificationsNoneOutlined sx={{ fontSize: 40 }} />,
    description: 'Recevez des mises à jour sur l\'état de vos levés et annonces.',
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
        <Box sx={{ backgroundColor: '#2E7D32', color: 'white', p: 4, borderRadius: '20px', mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Bonjour, M. Dupont !
          </Typography>
          <Typography variant="body1">
            Bienvenue sur GeoPlateforme. Explorez vos projets.
          </Typography>
          <Typography variant="caption" display="block" mt={2}>
            {formattedDate}
          </Typography>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Accès Rapide
        </Typography>
        <Grid container spacing={4} sx={{ mb: 4 }} alignItems="stretch">
          {quickAccessItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card 
                sx={{
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderRadius: '20px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    animation: `${cardHover} 0.3s ease forwards`,
                    cursor: 'pointer',
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Avatar sx={{ backgroundColor: '#81C784', width: 60, height: 60, margin: 'auto', mb: 2 }}>
                    {item.icon}
                  </Avatar>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Activité Récente
        </Typography>
        {/* Recent Activity Section would go here */}
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;
