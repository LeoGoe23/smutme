import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#8b5cf6',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#0b0f14',
      paper: '#111827',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
    error: {
      main: '#f43f5e',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
    '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
    '0 2px 6px 0 rgba(0, 0, 0, 0.4)',
    '0 4px 8px 0 rgba(0, 0, 0, 0.4)',
    '0 6px 12px 0 rgba(0, 0, 0, 0.4)',
    '0 8px 16px 0 rgba(0, 0, 0, 0.4)',
    '0 10px 20px 0 rgba(0, 0, 0, 0.4)',
    '0 12px 24px 0 rgba(0, 0, 0, 0.4)',
    '0 14px 28px 0 rgba(0, 0, 0, 0.4)',
    '0 16px 32px 0 rgba(0, 0, 0, 0.4)',
    '0 18px 36px 0 rgba(0, 0, 0, 0.4)',
    '0 20px 40px 0 rgba(0, 0, 0, 0.4)',
    '0 22px 44px 0 rgba(0, 0, 0, 0.4)',
    '0 24px 48px 0 rgba(0, 0, 0, 0.4)',
    '0 26px 52px 0 rgba(0, 0, 0, 0.4)',
    '0 28px 56px 0 rgba(0, 0, 0, 0.4)',
    '0 30px 60px 0 rgba(0, 0, 0, 0.4)',
    '0 32px 64px 0 rgba(0, 0, 0, 0.4)',
    '0 34px 68px 0 rgba(0, 0, 0, 0.4)',
    '0 36px 72px 0 rgba(0, 0, 0, 0.4)',
    '0 38px 76px 0 rgba(0, 0, 0, 0.4)',
    '0 40px 80px 0 rgba(0, 0, 0, 0.4)',
    '0 42px 84px 0 rgba(0, 0, 0, 0.4)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '11px 26px',
          fontSize: '0.9375rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: '0 0 20px rgba(139, 127, 168, 0.3)',
          '&:hover': {
            boxShadow: '0 0 24px rgba(139, 127, 168, 0.45)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(139, 127, 168, 0.16)',
            borderColor: 'rgba(139, 127, 168, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(139, 127, 168, 0.24)',
            },
          },
        },
      },
    },
  },
});
