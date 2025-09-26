import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
import { ArrowBack, GetApp } from '@mui/icons-material';
import MapDisplay from '../components/MapDisplay';
import React from 'react';

// Données fictives pour un résultat spécifique
const mockResultDetails = {
  '1': {
    nomProjet: 'Levé Topographique Centre-Ville',
    dateTraitement: '15 Jan 2023',
    superficieAnalysee: '1.2 km²',
    nombreDePoints: '850',
    precisionMoyenne: '±5 cm',
    typeDeTerrain: 'Urbain, Dense',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+1',
    pdfFileName: 'Rapport_CentreVille_#1.pdf',
    pdfFileSize: '1.5 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.8566, 2.3522] as [number, number], // Paris coordinates
      zoom: 10,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '2': {
    nomProjet: 'Analyse Terrain Industriel',
    dateTraitement: '20 Mar 2023',
    superficieAnalysee: '0.8 km²',
    nombreDePoints: '1200',
    precisionMoyenne: '±3 cm',
    typeDeTerrain: 'Industriel, Plat',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+2',
    pdfFileName: 'Rapport_Industriel_#2.pdf',
    pdfFileSize: '2.0 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.8666, 2.3622] as [number, number], 
      zoom: 11,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '3': {
    nomProjet: 'Cartographie Zone Rurale',
    dateTraitement: '10 Mai 2023',
    superficieAnalysee: '5.5 km²',
    nombreDePoints: '500',
    precisionMoyenne: '±10 cm',
    typeDeTerrain: 'Rural, Vallonné',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+3',
    pdfFileName: 'Rapport_Rural_#3.pdf',
    pdfFileSize: '3.0 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.8766, 2.3722] as [number, number], 
      zoom: 9,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '4': {
    nomProjet: 'Vérification Périmètre Agricole',
    dateTraitement: '22 Juil 2023',
    superficieAnalysee: '3.1 km²',
    nombreDePoints: '700',
    precisionMoyenne: '±7 cm',
    typeDeTerrain: 'Agricole, Plat',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+4',
    pdfFileName: 'Rapport_Agricole_#4.pdf',
    pdfFileSize: '2.2 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.8866, 2.3822] as [number, number], 
      zoom: 10,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '5': {
    nomProjet: 'Projet Extension Urbaine',
    dateTraitement: '01 Sep 2023',
    superficieAnalysee: '2.0 km²',
    nombreDePoints: '1500',
    precisionMoyenne: '±2 cm',
    typeDeTerrain: 'Urbain, En développement',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+5',
    pdfFileName: 'Rapport_Urbain_#5.pdf',
    pdfFileSize: '2.8 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.8966, 2.3922] as [number, number], 
      zoom: 12,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '6': {
    nomProjet: 'Suivi Glissement de Terrain',
    dateTraitement: '12 Nov 2023',
    superficieAnalysee: '0.3 km²',
    nombreDePoints: '200',
    precisionMoyenne: '±1 cm',
    typeDeTerrain: 'Montagneux, Instable',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+6',
    pdfFileName: 'Rapport_Glissement_#6.pdf',
    pdfFileSize: '1.0 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.9066, 2.4022] as [number, number], 
      zoom: 13,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '7': {
    nomProjet: 'Analyse de Sol Forestier',
    dateTraitement: '20 Jan 2024',
    superficieAnalysee: '7.0 km²',
    nombreDePoints: '600',
    precisionMoyenne: '±8 cm',
    typeDeTerrain: 'Forestier, Dense',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+7',
    pdfFileName: 'Rapport_Forestier_#7.pdf',
    pdfFileSize: '3.5 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.9166, 2.4122] as [number, number], 
      zoom: 9,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '8': {
    nomProjet: 'Modélisation Urbaine 3D',
    dateTraitement: '10 Fév 2024',
    superficieAnalysee: '0.5 km²',
    nombreDePoints: '2000',
    precisionMoyenne: '±1 cm',
    typeDeTerrain: 'Urbain, Modélisation',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+8',
    pdfFileName: 'Rapport_Urbaine3D_#8.pdf',
    pdfFileSize: '4.0 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.9266, 2.4222] as [number, number], 
      zoom: 14,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
  '9': {
    nomProjet: 'Cartographie Littorale',
    dateTraitement: '05 Mar 2024',
    superficieAnalysee: '10.0 km²',
    nombreDePoints: '300',
    precisionMoyenne: '±15 cm',
    typeDeTerrain: 'Littoral, Sableux',
    uploadedImageUrl: 'https://via.placeholder.com/300x200?text=Image+Leve+9',
    pdfFileName: 'Rapport_Littoral_#9.pdf',
    pdfFileSize: '2.7 Mo',
    pdfDownloadUrl: 'https://www.africau.edu/images/default/sample.pdf',
    mapData: {
      center: [48.9366, 2.4322] as [number, number], 
      zoom: 8,
      markers: [],
      legend: [
        { color: '#EF5350', label: 'Litigieuse' },
        { color: '#2E7D32', label: 'État' },
        { color: '#FFB300', label: 'Protégée' },
        { color: '#29B6F6', label: 'Maritime' },
      ],
    },
  },
};

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const result = id ? mockResultDetails[id as keyof typeof mockResultDetails] : undefined;

  if (!result) {
    return (
      <Box sx={{ flexGrow: 1, backgroundColor: '#F1F8E9', minHeight: '100vh' }}>
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <IconButton onClick={() => navigate('/results')}><ArrowBack /></IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 2 }}>Résultat Introuvable</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Le résultat avec l'ID "{id}" n'a pas été trouvé.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/results')}>Retour aux Résultats</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#F1F8E9', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/results')}><ArrowBack /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 2 }}>Détails du Résultat</Typography>
        </Toolbar>
      </AppBar>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4} sx={{ p: 2, backgroundColor: '#C8E6C9', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Image Téléversée</Typography>
              <Box sx={{ width: '100%', height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', overflow: 'hidden' }}>
                <img src={result.uploadedImageUrl} alt="Image Téléversée" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Fichier PDF Traité</Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>{result.pdfFileName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{result.pdfFileSize}</Typography>
              <Button 
                variant="contained" 
                startIcon={<GetApp />} 
                fullWidth 
                href={result.pdfDownloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ background: 'linear-gradient(to right, #2E7D32, #1B5E20)', '&:hover': { transform: 'scale(1.05)' } }}
              >
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Caractéristiques du Domaine</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Nom du Projet :</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" textAlign="right">{result.nomProjet}</Typography></Grid>

                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Date de Traitement :</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" textAlign="right">{result.dateTraitement}</Typography></Grid>

                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Superficie Analysée :</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" textAlign="right">{result.superficieAnalysee}</Typography></Grid>

                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Nombre de Points :</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" textAlign="right">{result.nombreDePoints}</Typography></Grid>

                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Précision Moyenne :</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" textAlign="right">{result.precisionMoyenne}</Typography></Grid>

                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Type de Terrain :</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" textAlign="right">{result.typeDeTerrain}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column (Map) */}
        <Grid item xs={12} md={8} sx={{ position: 'relative' }}>
          <MapDisplay center={result.mapData.center} zoom={result.mapData.zoom} markers={[]} height="100%" />
          <Box sx={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: 'white', p: 1, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {result.mapData.legend.map((item, index) => (
              <Tooltip title={item.label} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, '&:last-child': { mb: 0 } }}>
                  <Box sx={{ width: 20, height: 20, bgcolor: item.color, mr: 1, borderRadius: '4px' }} />
                  <Typography variant="body2">{item.label}</Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultsPage;