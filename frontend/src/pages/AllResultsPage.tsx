import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import MainLayout from '../components/MainLayout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface ResultItem {
  id: string;
  title: string;
  ref: string;
  dateTraitement: string;
  zoneCouverture: string;
  statut: 'Terminé' | 'En cours' | 'Échec';
}

const mockResults: ResultItem[] = [
  {
    id: '1',
    title: 'Levé Topographique Centre-Ville',
    ref: 'LEV001-2023-01-15',
    dateTraitement: '15/01/2023',
    zoneCouverture: '1.2 km²',
    statut: 'Terminé',
  },
  {
    id: '2',
    title: 'Analyse Terrain Industriel',
    ref: 'LEV002-2023-03-20',
    dateTraitement: '20/03/2023',
    zoneCouverture: '0.8 km²',
    statut: 'En cours',
  },
  {
    id: '3',
    title: 'Cartographie Zone Rurale',
    ref: 'LEV003-2023-05-10',
    dateTraitement: '10/05/2023',
    zoneCouverture: '5.5 km²',
    statut: 'Terminé',
  },
  {
    id: '4',
    title: 'Vérification Périmètre Agricole',
    ref: 'LEV004-2023-07-22',
    dateTraitement: '22/07/2023',
    zoneCouverture: '3.1 km²',
    statut: 'Terminé',
  },
  {
    id: '5',
    title: 'Projet Extension Urbaine',
    ref: 'LEV005-2023-09-01',
    dateTraitement: '01/09/2023',
    zoneCouverture: '2.0 km²',
    statut: 'Échec',
  },
  {
    id: '6',
    title: 'Suivi Glissement de Terrain',
    ref: 'LEV006-2023-11-12',
    dateTraitement: '12/11/2023',
    zoneCouverture: '0.3 km²',
    statut: 'Terminé',
  },
  {
    id: '7',
    title: 'Analyse de Sol Forestier',
    ref: 'LEV007-2024-01-20',
    dateTraitement: '20/01/2024',
    zoneCouverture: '7.0 km²',
    statut: 'Terminé',
  },
  {
    id: '8',
    title: 'Modélisation Urbaine 3D',
    ref: 'LEV008-2024-02-10',
    dateTraitement: '10/02/2024',
    zoneCouverture: '0.5 km²',
    statut: 'En cours',
  },
  {
    id: '9',
    title: 'Cartographie Littorale',
    ref: 'LEV009-2024-03-05',
    dateTraitement: '05/03/2024',
    zoneCouverture: '10.0 km²',
    statut: 'Échec',
  },
];

const AllResultsPage: React.FC = () => {
  const navigate = useNavigate();

  const getStatusChip = (statut: ResultItem['statut']) => {
    let color: "success" | "warning" | "error" | "default";
    let icon: React.ReactNode;

    switch (statut) {
      case 'Terminé':
        color = 'success';
        icon = <CheckCircleOutlineIcon />;
        break;
      case 'En cours':
        color = 'warning';
        icon = <HourglassEmptyIcon />;
        break;
      case 'Échec':
        color = 'error';
        icon = <CancelOutlinedIcon />;
        break;
      default:
        color = 'default';
        icon = null;
    }

    return <Chip label={statut} color={color} icon={icon} size="small" sx={{ height: 20 }} />;
  };

  return (
    <MainLayout title="Tous les Résultats de Traitement">
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Tous les Résultats de Traitement
        </Typography>

        <Grid container spacing={3} justifyContent="flex-start" sx={{ width: '100%' }}>
          {mockResults.map((result) => (
            <Grid item xs={12} sm={6} md={4} key={result.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)' }}>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {result.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {result.ref}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Date de traitement: {result.dateTraitement}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SquareFootIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Zone couverte: {result.zoneCouverture}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Statut :
                    </Typography>
                    {getStatusChip(result.statut)}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="text" 
                    onClick={() => navigate(`/results/${result.id}`)}
                    sx={{
                      color: '#4caf50',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.04)'
                      }
                    }}
                  >
                    Voir les détails
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default AllResultsPage;