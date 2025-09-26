import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Badge } from '@mui/material';
import { CheckCircleOutline, InfoOutlined, ErrorOutline, EventNote, CancelOutlined } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import MainLayout from '../components/MainLayout';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const cardHover = keyframes`
  from { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  to { transform: scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.15); background-color: #A5D6A7; }
`;

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  isUnread?: boolean;
  link?: string;
  statusColor?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ icon, title, description, timestamp, isUnread, link, statusColor }) => {
  const navigate = useNavigate();
  return (
    <Card 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: '20px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          animation: `${cardHover} 0.3s ease forwards`,
          cursor: 'pointer',
        }
      }}
      onClick={() => link && navigate(link)}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        {isUnread && (
          <Badge color="primary" variant="dot" sx={{ mr: 2, animation: `${pulse} 1.5s infinite` }} />
        )}
        <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: statusColor || '#f0f0f0', mr: 2 }}>
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">{description}</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">{timestamp}</Typography>
      </CardContent>
    </Card>
  );
};

const NotificationsPage: React.FC = () => {

  const notifications = {
    nouvelles: [
      {
        icon: <CheckCircleOutline sx={{ color: 'white' }} />,
        title: 'Traitement terminé',
        description: 'Votre levé "Projet Montagne" a été traité avec succès. Les résultats sont disponibles.',
        timestamp: 'Il y a 5 min',
        isUnread: true,
        link: '/results/1',
        statusColor: '#2E7D32',
      },
      {
        icon: <InfoOutlined sx={{ color: 'white' }} />,
        title: 'Nouveau message de support',
        description: 'L\'équipe de support a répondu à votre demande concernant le "Projet Urbain V2".',
        timestamp: 'Il y a 20 min',
        isUnread: true,
        statusColor: '#29B6F6',
      },
      {
        icon: <ErrorOutline sx={{ color: 'white' }} />,
        title: 'Mise à jour du système',
        description: 'Une nouvelle version de GeoPlateforme est disponible. Veuillez recharger la page pour en profiter.',
        timestamp: 'Il y a 1 heure',
        isUnread: true,
        statusColor: '#FFB300',
      },
    ],
    cetteSemaine: [
      {
        icon: <CancelOutlined sx={{ color: 'white' }} />,
        title: 'Erreur de téléchargement',
        description: 'Le téléchargement de votre fichier "Levé_XYZ.tiff" a échoué. Veuillez réessayer.',
        timestamp: 'Il y a 2 heures',
        statusColor: '#E53935',
      },
      {
        icon: <CheckCircleOutline sx={{ color: 'white' }} />,
        title: 'Traitement terminé',
        description: 'Le levé "Domaine Agricole Sud" est prêt. Accédez aux cartes interactives.',
        timestamp: 'Il y a 1 jour',
        link: '/results/2',
        statusColor: '#2E7D32',
      },
      {
        icon: <EventNote sx={{ color: 'white' }} />,
        title: 'Réunion planifiée',
        description: 'Une réunion pour discuter des "Résultats Trimestriels" a été planifiée pour le 25 octobre.',
        timestamp: 'Il y a 2 jours',
        statusColor: '#29B6F6',
      },
    ],
    plusAnciennes: [
      {
        icon: <InfoOutlined sx={{ color: 'white' }} />,
        title: 'Rappel de soumission',
        description: 'Il vous reste 3 jours pour soumettre votre levé pour le concours de "Innovation Géospatiale".',
        timestamp: 'Il y a 3 jours',
        statusColor: '#29B6F6',
      },
      {
        icon: <CheckCircleOutline sx={{ color: 'white' }} />,
        title: 'Traitement terminé',
        description: 'Le rapport "Cartographie_Forêt_Nord" est maintenant finalisé.',
        timestamp: 'Il y a 4 jours',
        link: '/results/3',
        statusColor: '#2E7D32',
      },
    ],
  };

  return (
    <MainLayout title="Notifications">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Nouvelles
        </Typography>
        <Box sx={{ mb: 4 }}>
          {notifications.nouvelles.map((notif, index) => (
            <NotificationItem key={index} {...notif} />
          ))}
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Cette semaine
        </Typography>
        <Box sx={{ mb: 4 }}>
          {notifications.cetteSemaine.map((notif, index) => (
            <NotificationItem key={index} {...notif} />
          ))}
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
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
