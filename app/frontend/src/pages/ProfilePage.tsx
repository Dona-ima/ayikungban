import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Avatar, Card, CardContent, Button } from '@mui/material';
import MainLayout from '../components/MainLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <MainLayout title="Informations Personnelles">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Mes Informations Personnelles
        </Typography>

        {/* User Info Card */}
        <Card sx={{ mb: 4, p: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#e8f5e9', mr: 2 }}>
                  {/* Replace with actual user image if available */}
                  <img src="/path/to/user/image.jpg" alt="User" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    Jean Dupont
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Géomètre Expert
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBackIosNewIcon />} 
                  onClick={handleGoBack}
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': {
                      borderColor: '#388e3c',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    }
                  }}
                >
                  Retour au Tableau de Bord
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Détails du Compte Card */}
        <Card sx={{ mb: 4, p: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Détails du Compte
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">NPI</Typography>
                <Typography variant="body1">NPI-12345678</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">jean.dupont@geoplateforme.com</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Numéro de Téléphone</Typography>
                <Typography variant="body1">+33 6 12 34 56 78</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Informations sur l'Adresse Card */}
        <Card sx={{ mb: 4, p: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Informations sur l'Adresse
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Adresse</Typography>
                <Typography variant="body1">123 Avenue des Champs</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Ville</Typography>
                <Typography variant="body1">Paris</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Code Postal</Typography>
                <Typography variant="body1">75008</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Pays</Typography>
                <Typography variant="body1">France</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;