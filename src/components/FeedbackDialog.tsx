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
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { currentUser, userProfile } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const feedbackData = {
        userId: currentUser?.uid || 'anonymous',
        email: userProfile?.email || 'anonymous',
        displayName: userProfile?.displayName || 'Anonymous User',
        subscription: userProfile?.subscription || 'guest',
        message: feedback.trim(),
        createdAt: new Date().toISOString(),
        status: 'new',
      };

      await addDoc(collection(db, 'feedback'), feedbackData);
      
      setSuccess(true);
      setFeedback('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFeedback('');
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
            Give Feedback
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
            Help us improve Smut.me
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Thank you! Your feedback has been submitted.
          </Alert>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              multiline
              rows={6}
              fullWidth
              placeholder="Share your thoughts, suggestions, bugs, or feature requests..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
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
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!feedback.trim() || submitting || success}
          startIcon={<SendIcon />}
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
          {submitting ? 'Sending...' : 'Send Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
