import { createTheme } from '@mui/material/styles';

// Définition d'une palette de couleurs plus douce et moderne
const softGreen = '#66BB6A'; // Un vert plus doux
const darkGreen = '#388E3C'; // Un vert plus foncé pour les accents
const lightGray = '#F5F5F5'; // Un gris très clair pour les fonds

const theme = createTheme({
  palette: {
    primary: {
      main: softGreen,
      dark: darkGreen,
    },
    secondary: {
      main: '#FFD54F', // Jaune plus doux
    },
    error: {
      main: '#EF5350', // Rouge standard
    },
    warning: {
      main: '#FFCA28', // Orange standard
    },
    info: {
      main: '#42A5F5', // Bleu standard
    },
    success: {
      main: darkGreen, // Utilise le vert foncé pour le succès
    },
    background: {
      default: lightGray, // Fond général très clair
      paper: '#FFFFFF',   // Fond des composants surélevés (cartes, etc.)
    },
    text: {
      primary: '#212121', // Texte principal presque noir
      secondary: '#757575', // Texte secondaire gris
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.8rem',
      fontWeight: 700,
      color: '#212121',
    },
    h2: {
      fontSize: '2.2rem',
      fontWeight: 600,
      color: '#212121',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 600,
      color: '#212121',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#212121',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#212121',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#212121',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Boutons avec texte normal, pas tout en majuscules
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rayons de bordure plus prononcés pour les cartes
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Ombre plus douce
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rayons de bordure pour les boutons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)', // Ombre subtile pour l'AppBar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Ombre subtile pour le tiroir
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rayons de bordure pour les chips
        },
      },
    },
  },
});

export default theme;