import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Chip, AppBar, Toolbar, IconButton, TextField, InputAdornment } from '@mui/material';
import { ArrowBack, Search, CalendarToday, SquareFoot } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const cardHover = keyframes`
  from { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  to { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.15); background-color: #A5D6A7; }
`;

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = mockResults.filter(result => 
    result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statut: ResultItem['statut']) => {
    switch (statut) {
      case 'Terminé': return '#2E7D32';
      case 'En cours': return '#FFB300';
      case 'Échec': return '#E53935';
      default: return '#616161';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#F1F8E9', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/dashboard')}><ArrowBack /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 2 }}>Tous les Résultats</Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Rechercher..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              sx: { borderRadius: 2, backgroundColor: '#f7f8fa', '& fieldset': { border: 'none' } }
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {filteredResults.map((result) => (
            <Grid item xs={12} sm={6} md={4} key={result.id}>
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
                onClick={() => navigate(`/results/${result.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{result.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{result.dateTraitement}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SquareFoot sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{result.zoneCouverture}</Typography>
                  </Box>
                  <Chip 
                    label={result.statut} 
                    sx={{
                      backgroundColor: getStatusColor(result.statut),
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AllResultsPage;
