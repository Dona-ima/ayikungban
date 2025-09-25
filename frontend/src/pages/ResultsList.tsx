import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import apiClient from '../services/api';

interface ProcessingResult {
  id: string;
  filename: string;
  processing_status: 'completed' | 'processing' | 'failed';
  zones_result?: {
    air: string;
    air_proteges: string;
    dpl: string;
    dpm: string;
    enregistrement_personnel: string;
    litige: string;
    parcelles: string;
    restriction: string;
    tf_demande: string;
    tf_en_cours: string;
    tf_etat: string;
    titre_reconstitue: string;
    zone_inondable: string;
  };
  result_summary_pdf?: string;
  processed_at?: string;
  error?: string;
}

const ResultsList: React.FC = () => {
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/images/results');
      setResults(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon />;
      case 'processing':
        return <CircularProgress size={20} />;
      case 'failed':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const formatZoneResult = (value: string) => {
    return value === 'OUI' ? (
      <Chip label="OUI" color="error" size="small" />
    ) : (
      <Chip label="NON" color="success" size="small" />
    );
  };

  if (loading) {
    return (
      <MainLayout title="Résultats">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Résultats">
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            Résultats des Analyses
          </Typography>
          <IconButton onClick={fetchResults} title="Rafraîchir">
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {results.map((result) => (
            <Grid item xs={12} md={6} lg={4} key={result.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div" noWrap>
                      {result.filename}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(result.processing_status)}
                      label={result.processing_status}
                      color={getStatusColor(result.processing_status) as any}
                      size="small"
                    />
                  </Box>

                  {result.processing_status === 'completed' && (
                    <Box>
                      <Box display="flex" gap={1} mb={2}>
                        {result.result_summary_pdf && (
                          <Link 
                            href={result.result_summary_pdf} 
                            target="_blank" 
                            style={{ textDecoration: 'none' }}
                          >
                            <Button
                              variant="outlined"
                              startIcon={<PdfIcon />}
                              size="small"
                              sx={{
                                borderColor: '#4caf50',
                                color: '#4caf50',
                                '&:hover': {
                                  borderColor: '#388e3c',
                                  backgroundColor: 'rgba(76, 175, 80, 0.04)'
                                }
                              }}
                            >
                              PDF
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          size="small"
                          onClick={() => navigate(`/results/${result.id}`)}
                          sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                              borderColor: '#1565c0',
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          Détails
                        </Button>
                      </Box>

                      {result.zones_result && (
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableBody>
                              {Object.entries(result.zones_result).slice(0, 5).map(([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell component="th" scope="row" size="small">
                                    {key.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')}
                                  </TableCell>
                                  <TableCell align="right" size="small">
                                    {formatZoneResult(value)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {Object.keys(result.zones_result).length > 5 && (
                            <Box p={1} textAlign="center">
                              <Button
                                size="small"
                                onClick={() => navigate(`/results/${result.id}`)}
                              >
                                Voir plus...
                              </Button>
                            </Box>
                          )}
                        </TableContainer>
                      )}
                    </Box>
                  )}

                  {result.processing_status === 'failed' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {result.error || 'Une erreur est survenue lors du traitement'}
                    </Alert>
                  )}

                  {result.processing_status === 'processing' && (
                    <Box display="flex" justifyContent="center" p={3}>
                      <CircularProgress />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default ResultsList;