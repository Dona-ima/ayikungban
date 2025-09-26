import React, { useState } from 'react';
import { Box, Typography, Grid, Card, Avatar } from '@mui/material';
import MainLayout from '../components/MainLayout';
import EditableField from '../components/EditableField';

const ProfilePage: React.FC = () => {
  const [userName, setUserName] = useState('Jean Dupont');
  const [userEmail, setUserEmail] = useState('jean.dupont@geoplateforme.com');
  const [userNpi, setUserNpi] = useState('NPI-12345678');

  return (
    <MainLayout title="Informations Personnelles">
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', p: 3 }}>
              <Avatar sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }} src="https://via.placeholder.com/100" />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{userName}</Typography>
              <Typography color="text.secondary">Géomètre Expert</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <EditableField label="Nom Complet" value={userName} onSave={setUserName} />
            <EditableField label="Email" value={userEmail} onSave={setUserEmail} />
            <EditableField label="NPI" value={userNpi} onSave={setUserNpi} />
            <EditableField label="Numéro de Téléphone" value="+33 6 12 34 56 78" onSave={() => {}} />
            <EditableField label="Adresse" value="123 Avenue des Champs" onSave={() => {}} />
            <EditableField label="Ville" value="Paris" onSave={() => {}} />
            <EditableField label="Code Postal" value="75008" onSave={() => {}} />
            <EditableField label="Pays" value="France" onSave={() => {}} />
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default ProfilePage;
