import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Avatar, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import MainLayout from '../components/MainLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getCurrentUser } from '../services/userService';
import type { User } from '../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError("Erreur lors du chargement des données utilisateur");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <MainLayout title="Informations Personnelles">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Mes Informations Personnelles
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : user ? (
          <>
            {/* User Info Card */}
            <Card sx={{ mb: 4, p: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                  <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: '#e8f5e9', mr: 2 }}>
                      {user.first_name[0]}{user.last_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {user.profession || 'Non spécifié'}
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
                    <Typography variant="body1">{user.npi}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{user.email || 'Non spécifié'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Numéro de Téléphone</Typography>
                    <Typography variant="body1">{user.phone_number || 'Non spécifié'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date de Naissance</Typography>
                    <Typography variant="body1">{new Date(user.date_of_birth).toLocaleDateString('fr-FR')}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Sexe</Typography>
                    <Typography variant="body1">{user.sex === 'M' ? 'Masculin' : 'Féminin'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Profession</Typography>
                    <Typography variant="body1">{user.profession || 'Non spécifié'}</Typography>
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
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Adresse Complète</Typography>
                    <Typography variant="body1">{user.address || 'Non spécifiée'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        ) : (
          <Alert severity="info">Aucune donnée utilisateur disponible</Alert>
        )}
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;