import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AccountDialog: React.FC<AccountDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { currentUser, userProfile, resetPassword, deleteAccount } = useAuth();
  const [resetEmail, setResetEmail] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    const email = resetEmail || currentUser?.email;
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
      setResetEmail('');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteAccount();
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Delete account error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in, then try again.');
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setResetEmail('');
      setDeleteConfirm('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Account Settings
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
            {currentUser?.email}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Account Info */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Account Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Display Name
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {userProfile?.displayName || 'User'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Subscription
              </Typography>
              <Chip
                label={userProfile?.subscription?.toUpperCase() || 'FREE'}
                size="small"
                sx={{
                  fontWeight: 600,
                  background: userProfile?.subscription === 'free' 
                    ? 'rgba(139, 92, 246, 0.2)' 
                    : 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                  color: userProfile?.subscription === 'free' 
                    ? isDark ? '#ffffff' : '#1a1a1a'
                    : '#ffffff',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total Generations
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {userProfile?.totalGenerations || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Password Reset */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            <LockResetIcon sx={{ fontSize: '1.2rem', verticalAlign: 'middle', mr: 1 }} />
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We'll send a password reset link to your email address.
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="email"
            label="Email Address"
            placeholder={currentUser?.email || ''}
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleResetPassword}
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Send Reset Email
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Delete Account */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#ef4444' }}>
            <DeleteIcon sx={{ fontSize: '1.2rem', verticalAlign: 'middle', mr: 1 }} />
            Delete Account
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action is permanent and cannot be undone. All your stories and data will be deleted.
          </Alert>
          <TextField
            fullWidth
            size="small"
            label="Type DELETE to confirm"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={loading || deleteConfirm !== 'DELETE'}
            startIcon={<DeleteIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Delete My Account
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} disabled={loading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
