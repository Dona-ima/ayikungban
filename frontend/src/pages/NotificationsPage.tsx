import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, Grid, Chip, Link, CircularProgress } from '@mui/material';
import MainLayout from '../components/MainLayout';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { notificationService, type Notification } from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead}) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon color="success" />;
      case 'error':
        return <ErrorOutlineIcon color="error" />;
      default:
        return <InfoOutlinedIcon color="info" />;
    }
  };

  const getStatusColor = (type: string): "success" | "info" | "warning" | "error" => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  const handleClick = async () => {
    if (notification.result_id) {
      await onMarkAsRead(notification.id);
      if (notification.pdf_url) {
        window.open(notification.pdf_url, '_blank');
      } else {
        navigate(`/results/${notification.result_id}`);
      }
    }
  };

  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)', opacity: notification.read ? 0.7 : 1 }}>
      <Grid container wrap="nowrap" spacing={2} alignItems="center">
        <Grid item>
          <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
            {getIcon(notification.type)}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{notification.title}</Typography>
          <Typography variant="body2" color="text.secondary">{notification.message}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
            </Typography>
            <Chip 
              label={notification.read ? 'Lu' : 'Non lu'} 
              color={getStatusColor(notification.type)} 
              size="small" 
              sx={{ height: 20 }} 
            />
          </Box>
        </Grid>
        {(notification.result_id || notification.pdf_url) && (
          <Grid item>
            <Link 
              component="button" 
              variant="body2" 
              onClick={handleClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: '#4caf50' 
              }}
            >
              Voir les résultats <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
            </Link>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const groupNotifications = (notifications: Notification[]) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    return {
      nouvelles: notifications.filter(n => 
        new Date(n.created_at).getTime() > now.getTime() - oneDay
      ),
      cetteSemaine: notifications.filter(n => {
        const date = new Date(n.created_at).getTime();
        return date <= now.getTime() - oneDay && date > now.getTime() - oneWeek;
      }),
      plusAnciennes: notifications.filter(n => 
        new Date(n.created_at).getTime() <= now.getTime() - oneWeek
      ),
    };
  };

  if (loading) {
    return (
      <MainLayout title="Notifications">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Notifications">
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </MainLayout>
    );
  }

  const groupedNotifications = groupNotifications(notifications);

  return (
    <MainLayout title="Notifications">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Notifications
        </Typography>

        {/* Nouvelles Notifications */}
        {groupedNotifications.nouvelles.length > 0 && (
          <>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
              Nouvelles
            </Typography>
            <Box sx={{ mb: 4 }}>
              {groupedNotifications.nouvelles.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          </>
        )}

        {/* Cette Semaine */}
        {groupedNotifications.cetteSemaine.length > 0 && (
          <>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
              Cette semaine
            </Typography>
            <Box sx={{ mb: 4 }}>
              {groupedNotifications.cetteSemaine.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          </>
        )}

        {/* Plus Anciennes */}
        {groupedNotifications.plusAnciennes.length > 0 && (
          <>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
              Plus anciennes
            </Typography>
            <Box sx={{ mb: 4 }}>
              {groupedNotifications.plusAnciennes.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          </>
        )}

        {notifications.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Aucune notification
          </Typography>
        )}
      </Box>
    </MainLayout>
  );
};

export default NotificationsPage;