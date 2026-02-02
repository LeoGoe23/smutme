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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PreregistrationDialogProps {
  open: boolean;
  onClose: () => void;
  plan: 'plus' | 'pro';
  price: string;
}

export const PreregistrationDialog: React.FC<PreregistrationDialogProps> = ({ 
  open, 
  onClose, 
  plan, 
  price 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const preregistrationData = {
        email: email.trim().toLowerCase(),
        plan: plan,
        originalPrice: price,
        earlyBirdDiscount: '20%',
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      await addDoc(collection(db, 'preregistrations'), preregistrationData);
      
      setSuccess(true);
      setEmail('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Failed to submit preregistration:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setEmail('');
      setError('');
      setSuccess(false);
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
            Coming Soon! 🎉
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
            {plan.toUpperCase()} Plan - {price}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              You're on the list!
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              We'll notify you when {plan.toUpperCase()} launches with your exclusive 20% discount.
            </Typography>
          </Box>
        ) : (
          <>
            <Box 
              sx={{ 
                mb: 3, 
                p: 2.5,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#8b5cf6' }}>
                🎁 Early Bird Offer
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Register now and get <strong>20% OFF</strong> when we launch!
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                We're finalizing payment integration. Be the first to know!
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              autoFocus
              fullWidth
              type="email"
              label="Your Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }}
            >
              We'll only use this to notify you about the launch. No spam, ever.
            </Typography>
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 2.5, pt: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!email.trim() || submitting}
            sx={{
              background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
              },
            }}
          >
            {submitting ? 'Registering...' : 'Get Early Access'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
