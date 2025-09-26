import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Snackbar, Alert, IconButton } from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

const UploadPage: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };

  const handleValidate = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setToastOpen(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }, 2000);
  };

  return (
    <MainLayout title="Télécharger un Levé">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <Paper sx={{ p: 4, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', width: 500 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>Télécharger un Levé Topographique</Typography>
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Instructions de téléchargement :</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>• Veuillez préparer votre image de levé au format JPG, PNG ou PDF.</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>• Assurez-vous que l'image est claire, lisible et ne dépasse pas 10 Mo.</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>• Utilisez le bouton ci-dessous pour sélectionner votre fichier et cliquez sur "Valider la demande".</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>• Une fois validé, un message de traitement s'affichera et une notification par e-mail vous sera envoyée.</Typography>
          </Box>
          <Box
            sx={{ border: '2px dashed #BDBDBD', borderRadius: '20px', p: 4, my: 3, backgroundColor: '#f9f9f9' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); }}
          >
            <input
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <label htmlFor="raised-button-file">
              <IconButton component="span" sx={{ animation: `${bounce} 2s infinite` }}><CloudUpload sx={{ fontSize: 60 }} /></IconButton>
              <Typography>Glissez-déposez ou cliquez pour uploader</Typography>
              {fileName && <Typography color="primary" sx={{ mt: 1 }}>{fileName}</Typography>}
            </label>
          </Box>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(to right, #2E7D32, #1B5E20)', '&:hover': { transform: 'scale(1.05)' } }}
            onClick={handleValidate}
            disabled={!fileName || isUploading}
          >
            {isUploading ? <CheckCircle /> : 'Valider'}
          </Button>
        </Paper>
        <Snackbar open={toastOpen} autoHideDuration={6000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
            Upload réussi!
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};


export default UploadPage;
