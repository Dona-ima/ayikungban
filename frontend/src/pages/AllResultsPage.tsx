import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material';
import MainLayout from '../components/MainLayout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { resultService, type ProcessingResult } from '../services/resultService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ResultItemProps {
  result: ProcessingResult;
  onViewDetails: (imageId: string) => void;
}

const ResultItem: React.FC<ResultItemProps> = ({ result, onViewDetails }) => {
  const getStatusChip = (status: string) => {
    let color: "success" | "warning" | "error" | "default";
    let icon: React.ReactNode;
    let label: string;

    switch (status) {
      case 'completed':
        color = 'success';
        icon = <CheckCircleOutlineIcon />;
        label = 'Terminé';
        break;
      case 'processing':
        color = 'warning';
        icon = <HourglassEmptyIcon />;
        label = 'En cours';
        break;
      case 'failed':
        color = 'error';
        icon = <CancelOutlinedIcon />;
        label = 'Échec';
        break;
      default:
        color = 'default';
        icon = null;
        label = 'Inconnu';
    }

    return <Chip label={label} color={color} icon={icon} size="small" sx={{ height: 20 }} />;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)' }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {result.filename}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ID: {result.image_id}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDistanceToNow(new Date(result.created_at), { addSuffix: true, locale: fr })}
          </Typography>
        </Box>
        {result.zones_result && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DescriptionIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Résultats disponibles
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Statut :
          </Typography>
          {getStatusChip(result.status)}
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="text" 
          onClick={() => onViewDetails(result.image_id)}
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
  );
};

const AllResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Veuillez vous connecter pour voir les résultats');
        navigate('/login');
        return;
      }
      const response = await resultService.getAllResults();
      setResults(response.results);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        navigate('/login');
      } else {
        setError('Erreur lors du chargement des résultats. Veuillez réessayer.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Tous les Résultats">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Tous les Résultats">
        <Box sx={{ p: 3 }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button variant="contained" onClick={loadResults}>
            Réessayer
          </Button>
        </Box>
      </MainLayout>
    );
  }

  const completedResults = results.filter(r => r.status === 'completed');
  const processingResults = results.filter(r => r.status === 'processing');
  const failedResults = results.filter(r => r.status === 'failed');

  return (
    <MainLayout title="Tous les Résultats">
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Tous les Résultats
        </Typography>

        {results.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Aucun résultat disponible
          </Typography>
        ) : (
          <>
            {/* Résultats en cours */}
            {processingResults.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mb: 2, color: 'warning.main' }}>
                  En cours de traitement ({processingResults.length})
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {processingResults.map((result) => (
                    <Grid item xs={12} sm={6} md={4} key={result.image_id}>
                      <ResultItem result={result} onViewDetails={(id) => navigate(`/results/${id}`)} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Résultats terminés */}
            {completedResults.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
                  Terminés ({completedResults.length})
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {completedResults.map((result) => (
                    <Grid item xs={12} sm={6} md={4} key={result.image_id}>
                      <ResultItem result={result} onViewDetails={(id) => navigate(`/results/${id}`)} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* Résultats échoués */}
            {failedResults.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mb: 2, color: 'error.main' }}>
                  Échoués ({failedResults.length})
                </Typography>
                <Grid container spacing={3}>
                  {failedResults.map((result) => (
                    <Grid item xs={12} sm={6} md={4} key={result.image_id}>
                      <ResultItem result={result} onViewDetails={(id) => navigate(`/results/${id}`)} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </MainLayout>
  );
};

export default AllResultsPage;