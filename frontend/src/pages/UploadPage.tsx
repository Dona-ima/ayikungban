import React, { useState, useRef } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Card, CardContent, LinearProgress, Alert, Paper, IconButton, Grid } from '@mui/material';
import MainLayout from '../components/MainLayout';
import { CloudUpload as CloudUploadIcon, PictureAsPdf as PdfIcon, Delete as DeleteIcon, CheckCircleOutline as CheckIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const UploadPage: React.FC = () => {
  interface UploadStatus {
    fileName: string;
    progress: number;
    status: 'waiting' | 'uploading' | 'processing' | 'completed' | 'error';
    message?: string;
    resultId?: string;
  }

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (pdfFiles.length !== files.length) {
        setError("Seuls les fichiers PDF sont acceptés");
        return;
      }
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
      setUploadStatuses(prev => [
        ...prev,
        ...pdfFiles.map(file => ({
          fileName: file.name,
          progress: 0,
          status: 'waiting' as const
        }))
      ]);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length === 0) {
      setError("Seuls les fichiers PDF sont acceptés");
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    setUploadStatuses(prev => [
      ...prev,
      ...files.map(file => ({
        fileName: file.name,
        progress: 0,
        status: 'waiting' as const
      }))
    ]);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadStatuses(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatuses(prev => prev.map((status, i) => 
        i === index 
          ? { ...status, status: 'uploading', progress: 0 }
          : status
      ));

      const response = await apiClient.post('/images/upload-pdf', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadStatuses(prev => prev.map((status, i) => 
              i === index ? { ...status, progress } : status
            ));
          }
        },
      });

      setUploadStatuses(prev => prev.map((status, i) => 
        i === index 
          ? { 
              ...status, 
              status: 'processing',
              resultId: response.data.images[0].image_id 
            }
          : status
      ));

      // Commencer à vérifier l'état du traitement
      checkProcessingStatus(response.data.images[0].image_id, index);

    } catch (error: any) {
      setUploadStatuses(prev => prev.map((status, i) => 
        i === index 
          ? { ...status, status: 'error', message: error.response?.data?.detail || "Erreur lors de l'upload" }
          : status
      ));
    }
  };

  const checkProcessingStatus = async (imageId: string, index: number) => {
    try {
      const response = await apiClient.get(`/images/processing-status/${imageId}`);
      
      if (response.data.status === 'completed') {
        setUploadStatuses(prev => prev.map((status, i) => 
          i === index 
            ? { ...status, status: 'completed' }
            : status
        ));
      } else if (response.data.status === 'failed') {
        setUploadStatuses(prev => prev.map((status, i) => 
          i === index 
            ? { ...status, status: 'error', message: response.data.error || "Erreur de traitement" }
            : status
        ));
      } else {
        // Continuer à vérifier toutes les 5 secondes
        setTimeout(() => checkProcessingStatus(imageId, index), 5000);
      }
    } catch (error) {
      setUploadStatuses(prev => prev.map((status, i) => 
        i === index 
          ? { ...status, status: 'error', message: "Erreur lors de la vérification du statut" }
          : status
      ));
    }
  };

  const handleUpload = () => {
    selectedFiles.forEach((file, index) => {
      if (uploadStatuses[index].status === 'waiting') {
        uploadFile(file, index);
      }
    });
  };

  const getStatusIcon = (status: UploadStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <PdfIcon color="primary" />;
    }
  };

  return (
    <MainLayout title="Upload de Levés">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Upload de Levés Topographiques
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Instructions de téléchargement :
        </Typography>
        <List sx={{ mb: 4 }}>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Veuillez préparer vos levés topographiques au format PDF uniquement." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Assurez-vous que les documents sont clairs, lisibles et ne dépassent pas 10 Mo chacun." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Vous pouvez uploader plusieurs fichiers à la fois par glisser-déposer ou en les sélectionnant." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Une fois les fichiers uploadés, ils seront automatiquement traités et vous pourrez suivre leur progression." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Vous recevrez une notification par e-mail une fois le traitement de chaque fichier terminé." />
          </ListItem>
        </List>

        {/* Zone de drop */}
        <Paper
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: '#f5f5f5',
            border: '2px dashed #9e9e9e',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#eeeeee',
              borderColor: '#4caf50'
            }
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
            accept=".pdf"
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Glissez-déposez vos fichiers PDF ici
          </Typography>
          <Typography color="textSecondary">
            ou cliquez pour sélectionner des fichiers
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Liste des fichiers */}
        {selectedFiles.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fichiers sélectionnés
              </Typography>
              <List>
                {uploadStatuses.map((status, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      status.status === 'waiting' && (
                        <IconButton edge="end" onClick={() => removeFile(index)}>
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon>
                      {getStatusIcon(status.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={status.fileName}
                      secondary={
                        <>
                          {status.status === 'uploading' && (
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={status.progress} />
                            </Box>
                          )}
                          {status.status === 'processing' && 'Traitement en cours...'}
                          {status.status === 'completed' && 'Traitement terminé'}
                          {status.status === 'error' && status.message}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Boutons d'action */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFiles.length || !uploadStatuses.some(s => s.status === 'waiting')}
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#388e3c' }
              }}
            >
              Lancer l'upload
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => navigate('/results')}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                '&:hover': {
                  borderColor: '#388e3c',
                  backgroundColor: 'rgba(76, 175, 80, 0.04)'
                }
              }}
            >
              Voir tous les résultats
            </Button>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default UploadPage;