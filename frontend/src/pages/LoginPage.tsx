import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Paper, CircularProgress, Alert } from '@mui/material';

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
      // Simuler un appel API pour la vérification NPI et l'envoi d'OTP
      // Dans une vraie application, vous feriez un fetch/axios ici vers votre backend
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (npi === "12345678" && email === "test@example.com") {
            resolve({ success: true });
          } else if (npi === "99999999") {
            reject({ message: "NPI non reconnu par la plateforme ANIP." });
          } else {
            reject({ message: "Erreur lors de la vérification NPI ou de l'envoi d'OTP." });
          }
        }, 2000);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((response as any).success) {
        navigate('/otp', { state: { npi, email } });
      } else {
        // Ceci ne devrait pas être atteint avec le reject ci-dessus, mais pour la robustesse
        setError("Une erreur inattendue est survenue.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Échec de la connexion. Veuillez réessayer.");
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