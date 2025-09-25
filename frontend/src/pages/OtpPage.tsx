import React, { useState } from 'react';
import apiClient from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Paper, CircularProgress, Alert, Link } from '@mui/material';

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { npi, email } = location.state || { npi: '', email: '' }; // Récupérer NPI et email de l'état de la navigation

  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Rediriger si NPI ou email manquant (accès direct à la page OTP)
  React.useEffect(() => {
    if (!npi || !email) {
      navigate('/login');
    }
  }, [npi, email, navigate]);

  const validateOtp = (otpValue: string): boolean => {
    // Exemple de validation OTP : 6 chiffres
    return /^[0-9]{6}$/.test(otpValue);
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResendMessage(null);

    if (!validateOtp(otp)) {
      setError("Veuillez entrer un code OTP valide (ex: 6 chiffres).");
      return;
    }

    setLoading(true);
    try {
      // Appel API backend pour vérifier l'OTP
      const response = await apiClient.post('/auth/verify-otp', {
        npi,
        otp,
      });

      // Si succès, tu peux stocker le token et rediriger
      const { access_token } = response.data;
      localStorage.setItem('auth_token', access_token); // Stocke le token pour les prochaines requêtes

      navigate('/dashboard'); // Redirige vers le dashboard
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        "Échec de la validation OTP. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    setResendMessage(null);
    try {
      // Appel API backend pour renvoyer l'OTP
      await apiClient.post('/auth/request-otp', { npi, email });
      setResendMessage("Un nouveau code OTP a été envoyé à votre adresse email.");
    } catch {
      setError("Échec du renvoi de l'OTP. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!npi || !email) {
    return null; // Ou un indicateur de chargement/redirection
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Vérification OTP
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Un code a été envoyé à l'adresse email <Typography component="span" fontWeight="bold">{email}</Typography>. Veuillez le saisir ci-dessous.
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleVerifyOtp}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="Entrer le code OTP"
            name="otp"
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={!!error && !validateOtp(otp)}
            helperText={!!error && !validateOtp(otp) ? "OTP invalide" : ""}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {resendMessage && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {resendMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Valider"}
          </Button>
          <Link component="button" variant="body2" onClick={handleResendOtp} disabled={loading} sx={{ textTransform: 'none' }}>
            Renvoyer OTP
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default OtpPage;