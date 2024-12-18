// theme.ts
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'dark' | 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#646cff', // Vite's primary blue
      },
      secondary: {
        main: '#535bf2', // Hover effect blue
      },
      background: {
        default: '#242424', // Dark background
        paper: '#1a1a1a', // Slightly darker for paper components
      },
      text: {
        primary: 'rgba(255, 255, 255, 0.87)', // Light text
        secondary: '#a0a0a0', // Muted text
      },
    },
    typography: {
      fontFamily: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
      h1: {
        fontSize: '3.2rem',
        fontWeight: 700,
        lineHeight: 1.1,
      },
      body1: {
        fontSize: '1.2rem',
        lineHeight: 1.5,
        color: 'rgba(255, 255, 255, 0.87)',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '0.6em 1.2em',
            fontSize: '1em',
            fontWeight: 500,
            backgroundColor: '#1a1a1a',
            color: 'rgba(255, 255, 255, 0.87)',
            border: '1px solid transparent',
            transition: 'border-color 0.25s, transform 0.2s',
            '&:hover': {
              borderColor: '#646cff',
              backgroundColor: '#1a1a1a',
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#242424',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            textShadow: '0px 1px 3px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
  });
