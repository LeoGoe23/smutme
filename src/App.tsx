import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { StoriesProvider } from './context/StoriesContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Generator } from './pages/Generator';
import { Library } from './pages/Library';
import { Pricing } from './pages/Pricing';
import { Examples } from './pages/Examples';
import { useSessionTracking } from './hooks/useSessionTracking';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function AppContent() {
  useSessionTracking(); // Track user sessions
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Generator />} />
        <Route path="/library" element={<Library />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/examples" element={<Examples />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#a78bfa' : '#8b5cf6',
            light: mode === 'dark' ? '#c4b5fd' : '#a78bfa',
            dark: '#6d28d9',
          },
          secondary: {
            main: '#ec4899',
            light: '#f9a8d4',
            dark: '#db2777',
          },
          background: {
            default: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            paper: mode === 'dark' ? '#111827' : '#f9fafb',
          },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#1a1a1a',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
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
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <StoriesProvider>
            <Router>
              <AppContent />
            </Router>
          </StoriesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
