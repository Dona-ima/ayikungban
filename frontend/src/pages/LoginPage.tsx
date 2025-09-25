import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Paper, CircularProgress, Alert } from '@mui/material';
import { requestOtp } from '../services/authservices';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [npi, setNpi] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateNpi = (npiValue: string): boolean => {
    // Exemple de validation NPI : 8 chiffres (à adapter selon le format réel de l'ANIP)
    return /^[0-9]{8}$/.test(npiValue);
  };

  const validateEmail = (emailValue: string): boolean => {
    // Validation basique d'email
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailValue);
  };

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!validateNpi(npi)) {
      setError("Veuillez entrer un NPI valide (ex: 8 chiffres).");
      return;
    }
    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setLoading(true);
    try {
      await requestOtp(npi, email);
      navigate('/otp', { state: { npi, email } });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de la vérification NPI ou de l'envoi d'OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Authentification
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSendOtp}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="npi"
            label="NPI (Numéro Personnel d'Identification)"
            name="npi"
            autoFocus
            value={npi}
            onChange={(e) => setNpi(e.target.value)}
            error={!!error && !validateNpi(npi)}
            helperText={!!error && !validateNpi(npi) ? "NPI invalide" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !validateEmail(email)}
            helperText={!!error && !validateEmail(email) ? "Email invalide" : ""}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Envoyer OTP"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;