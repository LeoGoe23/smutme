import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Container, Grid, Card, CardContent, IconButton, Dialog, DialogContent, DialogTitle, CircularProgress, Chip } from '@mui/material';
import { Close as CloseIcon, CalendarToday as CalendarIcon, TextFields as TextFieldsIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface StoredGeneration {
  uid: string;
  userId: string;
  prompt: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: string;
  tags?: string[];
}

export const Library: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { currentUser } = useAuth();
  const [stories, setStories] = useState<StoredGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<StoredGeneration | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Query subcollection: users/{userId}/generations
        const userGenerationsRef = collection(db, 'users', currentUser.uid, 'generations');
        const querySnapshot = await getDocs(userGenerationsRef);
        const loadedStories: StoredGeneration[] = [];
        
        querySnapshot.forEach((doc) => {
          loadedStories.push(doc.data() as StoredGeneration);
        });
        
        // Sort by date in JavaScript
        loadedStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setStories(loadedStories);
      } catch (error) {
        console.error('Failed to load stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [currentUser]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (!currentUser) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: isDark ? '#1a1a1a' : '#ffffff',
          color: isDark ? '#ffffff' : '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '40%',
            height: '50%',
            background: `radial-gradient(circle, rgba(139, 92, 246, ${isDark ? '0.15' : '0.08'}) 0%, transparent 70%)`,
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              fontSize: { xs: '3rem', md: '4rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Sign In Required
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '1.1rem',
            }}
          >
            Please sign in to view your story library
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark ? '#1a1a1a' : '#ffffff',
        color: isDark ? '#ffffff' : '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        pb: 8,
      }}
    >
      {/* Gradient Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '40%',
          height: '50%',
          background: `radial-gradient(circle, rgba(139, 92, 246, ${isDark ? '0.15' : '0.08'}) 0%, transparent 70%)`,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: '35%',
          height: '45%',
          background: `radial-gradient(circle, rgba(236, 72, 153, ${isDark ? '0.1' : '0.05'}) 0%, transparent 70%)`,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2, 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Your Library
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '1.1rem',
              fontWeight: 400,
            }}
          >
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} created
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#8b5cf6' }} />
          </Box>
        ) : stories.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3,
              borderRadius: 3,
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              No stories yet
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
              Create your first story in the Generator to see it here
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {stories.map((story) => (
              <Grid item xs={12} sm={6} md={4} key={story.uid}>
                <Card
                  onClick={() => setSelectedStory(story)}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'rgba(139, 92, 246, 0.4)',
                      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {story.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {story.content.substring(0, 150)}...
                    </Typography>

                    {story.tags && story.tags.length > 0 && (
                      <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {story.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: '20px',
                              backgroundColor: 'rgba(139, 92, 246, 0.15)',
                              color: '#8b5cf6',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem', color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: '1rem' }} />
                        {formatDate(story.createdAt)}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TextFieldsIcon sx={{ fontSize: '1rem' }} />
                        {story.wordCount.toLocaleString()} words
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Story Detail Dialog */}
      <Dialog
        open={selectedStory !== null}
        onClose={() => setSelectedStory(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 3,
          }
        }}
      >
        {selectedStory && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, pr: 2 }}>
                {selectedStory.title}
              </Typography>
              <IconButton onClick={() => setSelectedStory(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', pb: 2, borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.9rem', color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                  <CalendarIcon sx={{ fontSize: '1rem' }} />
                  {formatDate(selectedStory.createdAt)}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.9rem', color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                  <TextFieldsIcon sx={{ fontSize: '1rem' }} />
                  {selectedStory.wordCount.toLocaleString()} words
                </Box>
              </Box>
              {selectedStory.tags && selectedStory.tags.length > 0 && (
                <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedStory.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        color: '#8b5cf6',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              )}
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: '1.05rem',
                }}
              >
                {selectedStory.content}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};
