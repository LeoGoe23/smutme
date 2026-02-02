import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from 'react-router-dom';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({ open, onClose, isAuthenticated }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: isDark
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <RocketLaunchIcon
            sx={{
              fontSize: 32,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Daily Limit Reached
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
          {isAuthenticated
            ? 'You\'ve used your 2 free stories for today.'
            : 'You\'ve used your 2 free guest stories for today.'}
        </Typography>

        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            background: isDark
              ? 'rgba(139, 92, 246, 0.1)'
              : 'rgba(139, 92, 246, 0.05)',
            border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
            Upgrade to Plus or Pro
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              ✨ <strong>Unlimited Story Generations</strong>
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              💾 All Stories Saved in Your Library
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
              📖 Unlimited Story Continuations
            </Typography>
            <Typography component="li" variant="body2">
              🎯 No More Daily Restrictions
            </Typography>
          </Box>
        </Box>

        {!isAuthenticated && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
          >
            💡 Tip: Sign in to save your stories permanently and unlock premium features.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            color: 'text.primary',
            '&:hover': {
              borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
          }}
        >
          Later
        </Button>
        <Button
          onClick={handleUpgrade}
          variant="contained"
          startIcon={<RocketLaunchIcon />}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
            },
          }}
        >
          Upgrade Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};
