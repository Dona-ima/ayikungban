import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MainLayout from '../components/MainLayout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFileName(event.dataTransfer.files[0].name);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleValidateRequest = () => {
    // Logic to handle file upload and validation
    console.log("File validated:", fileName);
    // In a real application, you would send the file to a server
    // and then navigate or show a success message.
  };

  return (
    <MainLayout title="Télécharger un Levé Topographique">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Télécharger un Levé Topographique
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Instructions de téléchargement :
        </Typography>
        <List sx={{ mb: 4 }}>
          <ListItem disablePadding>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Veuillez préparer votre image de levé au format JPG, PNG ou PDF." />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Assurez-vous que l'image est claire, lisible et ne dépasse pas 10 Mo." />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary='Utilisez le bouton ci-dessous pour sélectionner votre fichier et cliquez sur "Valider la demande".' />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Une fois validé, un message de traitement s'affichera et une notification par e-mail vous sera envoyée." />
          </ListItem>
        </List>

        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: '2px dashed #9e9e9e',
            borderRadius: '8px',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            mb: 4,
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#eeeeee' },
          }}
        >
          <input
            type="file"
            hidden
            id="file-upload"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,application/pdf"
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
            <CloudUploadIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Déposer votre fichier ici
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Glissez & déposez votre fichier ici, ou cliquez pour sélectionner.
            </Typography>
            {fileName && (
              <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                Fichier sélectionné : <strong>{fileName}</strong>
              </Typography>
            )}
          </label>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#66bb6a',
              '&:hover': { backgroundColor: '#4caf50' },
              textTransform: 'none',
            }}
            onClick={handleValidateRequest}
            disabled={!fileName}
          >
            Valider la demande
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#4caf50',
              color: '#4caf50',
              '&:hover': {
                borderColor: '#388e3c',
                backgroundColor: 'rgba(76, 175, 80, 0.04)'
              },
              textTransform: 'none',
            }}
            onClick={() => navigate('/dashboard')}
          >
            Retour au Tableau de Bord
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default UploadPage;