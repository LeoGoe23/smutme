import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { FeedbackDialog } from './FeedbackDialog';

export const Footer: React.FC = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        mt: 8,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Smut.me
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              Adult fiction generator. For consenting adults only.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              18+ only. All content is fictional.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="#" color="text.secondary" underline="hover">
                Privacy Policy
              </MuiLink>
              <MuiLink component={Link} to="#" color="text.secondary" underline="hover">
                Terms of Service
              </MuiLink>
              <MuiLink component={Link} to="#" color="text.secondary" underline="hover">
                Content Guidelines
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink 
                onClick={() => setFeedbackOpen(true)}
                sx={{ cursor: 'pointer' }} 
                color="text.secondary" 
                underline="hover"
              >
                Give Feedback
              </MuiLink>
              <MuiLink component={Link} to="#" color="text.secondary" underline="hover">
                Contact
              </MuiLink>
              <MuiLink component={Link} to="#" color="text.secondary" underline="hover">
                FAQ
              </MuiLink>
            </Box>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
          {new Date().getFullYear()} Smut.me. All rights reserved.
        </Typography>
      </Container>

      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </Box>
  );
};
