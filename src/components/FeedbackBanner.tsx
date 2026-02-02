import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useTheme } from '@mui/material/styles';
import { FeedbackDialog } from './FeedbackDialog';

export const FeedbackBanner: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('feedbackBannerDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('feedbackBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      <Box
        sx={{
          background: isDark 
            ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)'
            : 'linear-gradient(90deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          borderBottom: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`,
          py: 2,
          width: '100%',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <FeedbackIcon sx={{ color: '#8b5cf6', fontSize: '1.25rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Help us improve! Share your feedback and ideas.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                size="small"
                onClick={() => setDialogOpen(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#8b5cf6',
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  },
                }}
              >
                Give Feedback
              </Button>
              <IconButton
                size="small"
                onClick={handleDismiss}
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      <FeedbackDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};
