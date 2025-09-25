import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, Grid, Chip, Link } from '@mui/material';
import MainLayout from '../components/MainLayout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  status?: { label: string; color: "success" | "info" | "warning" | "error" };
  link?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ icon, title, description, timestamp, status, link }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)' }}>
      <Grid container wrap="nowrap" spacing={2} alignItems="center">
        <Grid item>
          <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
            {icon}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">{description}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>{timestamp}</Typography>
            {status && <Chip label={status.label} color={status.color} size="small" sx={{ height: 20 }} />}
          </Box>
        </Grid>
        {link && (
          <Grid item>
            <Link component="button" variant="body2" onClick={() => navigate(link)} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#4caf50' }}>
              Voir les résultats <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </Link>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

interface Notification {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  status?: { label: string; color: "success" | "info" | "warning" | "error" };
  link?: string;
}

interface Notifications {
  nouvelles: Notification[];
  cetteSemaine: Notification[];
  plusAnciennes: Notification[];
}

const NotificationsPage: React.FC = () => {

  const notifications: Notifications = {
    nouvelles: [
      {
        icon: <CheckCircleOutlineIcon color="success" />,
        title: 'Traitement terminé',
        description: 'Votre levé "Projet Montagne" a été traité avec succès. Les résultats sont disponibles.',
        timestamp: 'Il y a 5 min',
        status: { label: 'Terminé', color: 'success' },
        link: '/results/montagne',
      },
      {
        icon: <InfoOutlinedIcon color="info" />,
        title: 'Nouveau message de support',
        description: 'L\'équipe de support a répondu à votre demande concernant le "Projet Urbain V2".',
        timestamp: 'Il y a 20 min',
        status: { label: 'Info', color: 'info' },
      },
      {
        icon: <ErrorOutlineIcon color="warning" />,
        title: 'Mise à jour du système',
        description: 'Une nouvelle version de GeoPlateforme est disponible. Veuillez recharger la page pour en profiter.',
        timestamp: 'Il y a 1 heure',
        status: { label: 'Avertissement', color: 'warning' },
      },
    ],
    cetteSemaine: [
      {
        icon: <CancelOutlinedIcon color="error" />,
        title: 'Erreur de téléchargement',
        description: 'Le téléchargement de votre fichier "Levé_XYZ.tiff" a échoué. Veuillez réessayer.',
        timestamp: 'Il y a 2 heures',
        status: { label: 'Erreur', color: 'error' },
      },
      {
        icon: <CheckCircleOutlineIcon color="success" />,
        title: 'Traitement terminé',
        description: 'Le levé "Domaine Agricole Sud" est prêt. Accédez aux cartes interactives.',
        timestamp: 'Il y a 1 jour',
        status: { label: 'Terminé', color: 'success' },
        link: '/results/agricole',
      },
      {
        icon: <EventNoteIcon color="info" />,
        title: 'Réunion planifiée',
        description: 'Une réunion pour discuter des "Résultats Trimestriels" a été planifiée pour le 25 octobre.',
        timestamp: 'Il y a 2 jours',
        status: { label: 'Info', color: 'info' },
      },
    ],
    plusAnciennes: [
      {
        icon: <InfoOutlinedIcon color="info" />,
        title: 'Rappel de soumission',
        description: 'Il vous reste 3 jours pour soumettre votre levé pour le concours de "Innovation Géospatiale".',
        timestamp: 'Il y a 3 jours',
        status: { label: 'Info', color: 'info' },
      },
      {
        icon: <CheckCircleOutlineIcon color="success" />,
        title: 'Traitement terminé',
        description: 'Le rapport "Cartographie_Forêt_Nord" est maintenant finalisé.',
        timestamp: 'Il y a 4 jours',
        status: { label: 'Terminé', color: 'success' },
        link: '/results/foret',
      },
    ],
  };

  return (
    <MainLayout title="Notifications">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Notifications
        </Typography>

        {/* Nouvelles Notifications */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          Nouvelles
        </Typography>
        <Box sx={{ mb: 4 }}>
          {notifications.nouvelles.map((notif, index) => (
            <NotificationItem key={index} {...notif} />
          ))}
        </Box>

        {/* Cette Semaine */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          Cette semaine
        </Typography>
        <Box sx={{ mb: 4 }}>
          {notifications.cetteSemaine.map((notif, index) => (
            <NotificationItem key={index} {...notif} />
          ))}
        </Box>

        {/* Plus Anciennes */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          Plus anciennes
        </Typography>
        <Box sx={{ mb: 4 }}>
          {notifications.plusAnciennes.map((notif, index) => (
            <NotificationItem key={index} {...notif} />
          ))}
        </Box>
      </Box>
    </MainLayout>
  );
};

export default NotificationsPage;