import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Skeleton,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useStories } from '../context/StoriesContext';
import { useAuth } from '../context/AuthContext';
import { generateStory } from '../lib/openrouter';
import { UpgradeDialog } from '../components/UpgradeDialog';

export const Generator: React.FC = () => {
  const location = useLocation();
  const { selectedStory, selectStory } = useStories();
  const { currentUser, userProfile, trackGeneration, canGenerate, getRemainingGenerations } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [prompt, setPrompt] = useState('');
  const [useExample, setUseExample] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const [matchedExample, setMatchedExample] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [usageStats, setUsageStats] = useState<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  } | null>(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  // Load prompt from navigation state
  useEffect(() => {
    if (location.state && (location.state as any).prompt) {
      setPrompt((location.state as any).prompt);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedStory) {
      setGeneratedTitle(selectedStory.title);
      setGeneratedContent(selectedStory.content);
      setHasGenerated(true);
      selectStory(null); // Clear selection after loading
    }
  }, [selectedStory, selectStory]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    // Check generation limits (for both authenticated and guest users)
    if (!canGenerate()) {
      setUpgradeDialogOpen(true);
      return;
    }

    setIsGenerating(true);
    setHasGenerated(false);
    setError(null);

    try {
      const result = await generateStory({ prompt: prompt.trim(), useExample });
      setGeneratedTitle(result.title);
      setGeneratedContent(result.content);
      setWordCount(result.wordCount);
      setExtractedTags(result.extractedTags || []);
      setMatchedExample(result.matchedExample || null);
      setSystemPrompt(result.systemPrompt || '');
      setUserPrompt(result.userPrompt || '');
      setHasGenerated(true);
      if (result.usage) {
        setUsageStats({
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
          cost: result.usage.cost || 0,
        });
      }

      // Track generation (both authenticated and guest users)
      try {
        await trackGeneration(
          prompt.trim(),
          result.title,
          result.content,
          result.wordCount,
          result.extractedTags
        );
        if (window.location.hostname === 'localhost') console.log(`✅ Generation tracked. Remaining: ${getRemainingGenerations()}`);
      } catch (trackError) {
        if (window.location.hostname === 'localhost') console.warn('Could not track generation:', trackError);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = async () => {
    if (!generatedContent) return;

    // Check generation limits
    if (!canGenerate()) {
      setUpgradeDialogOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Create continuation prompt with existing story
      const continuePrompt = `Continue this story naturally. Pick up where it left off and write the next scene:\n\n${generatedContent}\n\n[Continue the story from here with the same characters, style, and tone. Write the next 1000-1500 words.]`;
      
      const result = await generateStory({ prompt: continuePrompt, useExample: false });
      
      // Append continuation to existing content
      setGeneratedContent(generatedContent + '\n\n' + result.content);
      setWordCount(wordCount + result.wordCount);
      
      if (result.usage) {
        setUsageStats(prev => prev ? {
          promptTokens: prev.promptTokens + (result.usage?.promptTokens || 0),
          completionTokens: prev.completionTokens + (result.usage?.completionTokens || 0),
          totalTokens: prev.totalTokens + (result.usage?.totalTokens || 0),
          cost: prev.cost + (result.usage?.cost || 0),
        } : {
          promptTokens: result.usage?.promptTokens || 0,
          completionTokens: result.usage?.completionTokens || 0,
          totalTokens: result.usage?.totalTokens || 0,
          cost: result.usage?.cost || 0,
        });
      }

      // Track continuation as a generation
      try {
        await trackGeneration(
          'Continuation',
          generatedTitle,
          generatedContent + '\n\n' + result.content,
          wordCount + result.wordCount,
          extractedTags
        );
        if (window.location.hostname === 'localhost') console.log(`✅ Continuation tracked. Remaining: ${getRemainingGenerations()}`);
      } catch (trackError) {
        if (window.location.hostname === 'localhost') console.warn('Could not track continuation:', trackError);
      }
    } catch (err) {
      console.error('Continuation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to continue story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedTitle || !generatedContent) return;

    // Stories are automatically saved to Firebase when generated
    // This just shows a confirmation to the user
    if (currentUser) {
      alert('✅ Story saved to your Library!\n\nYou can view all your stories in the Library tab.');
    } else {
      alert('ℹ️ Guest Mode\n\nSign in to save stories to your Library permanently.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copied to clipboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark ? '#1a1a1a' : '#ffffff',
        color: isDark ? '#ffffff' : '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
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

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
        {/* Controls Column */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              position: { lg: 'sticky' }, 
              top: 140,
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 3,
            }}
          >
            {extractedTags.length > 0 && (
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: isDark ? '#9ca3af' : '#6b7280', mb: 1, fontSize: '0.875rem' }}>
                  🏷️ Extracted Tags:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {extractedTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#8b5cf6',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    />
                  ))}
                </Box>
                {matchedExample && (
                  <Typography variant="caption" sx={{ color: '#8b5cf6', mt: 1, display: 'block' }}>
                    ✨ Using example: "{matchedExample}"
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Show stats in localhost only */}
            {window.location.hostname === 'localhost' && usageStats && (
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: 'rgba(167, 139, 250, 0.05)',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: isDark ? '#9ca3af' : '#6b7280', display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <span>📝 Words: <strong style={{ color: '#a78bfa' }}>{wordCount.toLocaleString()}</strong></span>
                  <span>🔤 Tokens: <strong style={{ color: '#a78bfa' }}>{usageStats.totalTokens.toLocaleString()}</strong></span>
                  <span>💰 Cost: <strong style={{ color: '#a78bfa' }}>${usageStats.cost.toFixed(4)}</strong></span>
                  <span style={{ fontSize: '0.85em', opacity: 0.7 }}>({usageStats.promptTokens} prompt + {usageStats.completionTokens} completion)</span>
                </Typography>
              </Box>
            )}

            {window.location.hostname === 'localhost' && systemPrompt && (
              <Box 
                sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box 
                  onClick={() => setShowPrompt(!showPrompt)}
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: 500 }}>
                    🔍 Debug: View Complete Prompt
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#60a5fa' }}>
                    {showPrompt ? '▼' : '▶'}
                  </Typography>
                </Box>
                
                {showPrompt && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Typography variant="caption" sx={{ color: '#60a5fa', display: 'block', mb: 1, fontWeight: 600 }}>
                      SYSTEM PROMPT:
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 2, 
                        backgroundColor: isDark ? '#0f1419' : '#f9fafb', 
                        borderRadius: 1.5,
                        maxHeight: 300,
                        overflowY: 'auto',
                        mb: 2,
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                        color: isDark ? '#e5e7eb' : '#1f2937',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {systemPrompt}
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: '#60a5fa', display: 'block', mb: 1, fontWeight: 600 }}>
                      USER PROMPT:
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 2, 
                        backgroundColor: isDark ? '#0f1419' : '#f9fafb', 
                        borderRadius: 1.5,
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                        color: isDark ? '#e5e7eb' : '#1f2937',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {userPrompt}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Create Your Story
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', lineHeight: 1.6 }}>
              Describe your fantasy and let AI craft your perfect tale
            </Typography>

            {/* Generation Limit Display */}
            <Box 
              sx={{ 
                mb: 3, 
                p: 2.5, 
                backgroundColor: (currentUser && userProfile?.subscription !== 'free')
                  ? 'rgba(139, 92, 246, 0.05)' 
                  : 'rgba(236, 72, 153, 0.05)',
                border: `1px solid ${(currentUser && userProfile?.subscription !== 'free')
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(236, 72, 153, 0.2)'}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
                {currentUser && userProfile ? `${userProfile.subscription.toUpperCase()} Plan` : 'FREE (Guest)'}
              </Typography>
              {(!currentUser || userProfile?.subscription === 'free') ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ec4899' }}>
                      {getRemainingGenerations()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
                      / 2 stories today
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 6, 
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      mb: 1,
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: `${(getRemainingGenerations() / 2) * 100}%`, 
                        height: '100%',
                        background: 'linear-gradient(90deg, #ec4899, #f472b6)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
                    Resets daily at midnight {!currentUser && '· Sign in for history'}
                  </Typography>
                  {getRemainingGenerations() === 0 && (
                    <Button
                      size="small"
                      href="/pricing"
                      sx={{ 
                        mt: 1.5,
                        textTransform: 'none',
                        color: '#ec4899',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        },
                      }}
                    >
                      {currentUser ? 'Upgrade for unlimited →' : 'Sign in or upgrade →'}
                    </Button>
                  )}
                </>
              ) : (
                <Typography variant="body2" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.5rem' }}>∞</span> Unlimited generations
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Prompt */}
              <TextField
                label="Create your story"
                multiline
                rows={12}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Two colleagues working late at the office, the tension between them finally reaching a breaking point..."
                fullWidth
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 2,
                    fontSize: '1rem',
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#8b5cf6',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    opacity: 0.7,
                  },
                }}
              />

              {/* Use Example Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={useExample}
                    onChange={(e) => setUseExample(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#a78bfa',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#a78bfa',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Use style examples
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', display: 'block', lineHeight: 1.3 }}>
                      Match writing style from example library
                    </Typography>
                  </Box>
                }
                sx={{ m: 0 }}
              />

              {/* Generate Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                startIcon={<PlayArrowIcon />}
                fullWidth
                sx={{ 
                  py: 1.75,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                  boxShadow: '0 10px 28px rgba(139, 92, 246, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 14px 36px rgba(139, 92, 246, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'rgba(139, 92, 246, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Story'}
              </Button>

              <Typography variant="caption" sx={{ textAlign: 'center', mt: -1, color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', fontSize: '0.8125rem' }}>
                Powered by OpenRouter • MythoMax-L2-13B
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Output Column */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              minHeight: 600,
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 3,
            }}
          >
            {error && (
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#f43f5e',
                  '& .MuiAlert-icon': {
                    color: '#f43f5e',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {isGenerating && (
              <Box>
                <LinearProgress 
                  sx={{ 
                    mb: 4, 
                    borderRadius: 4,
                    height: 6,
                    backgroundColor: 'rgba(167, 139, 250, 0.15)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#a78bfa',
                      borderRadius: 4,
                    },
                  }} 
                />
                <Skeleton 
                  variant="text" 
                  height={40} 
                  width="60%" 
                  sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.05)' }} 
                />
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                  <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                  <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                </Box>
                <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                <Skeleton variant="text" height={20} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                <Skeleton variant="text" height={20} width="90%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
              </Box>
            )}

            {!isGenerating && !hasGenerated && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 500,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    fontSize: '2.5rem',
                    mb: 1,
                  }}
                >
                  ✨
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Ready to create
                </Typography>
                <Typography variant="body1" sx={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', textAlign: 'center', maxWidth: 400 }}>
                  Configure your preferences and click Generate to create your story
                </Typography>
              </Box>
            )}

            {!isGenerating && hasGenerated && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      lineHeight: 1.3,
                      flex: 1,
                    }}
                  >
                    {generatedTitle}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 1.5,
                      ml: 3,
                      flexShrink: 0,
                    }}
                  >
                    <Box 
                      sx={{ 
                        px: 2,
                        py: 1.25,
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)'}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', 
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Reading
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '1.125rem',
                        }}
                      >
                        {Math.ceil(wordCount / 200)}<Typography component="span" sx={{ fontSize: '0.8125rem', color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', ml: 0.3 }}>min</Typography>
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        px: 2,
                        py: 1.25,
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)'}`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', 
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Words
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '1.125rem',
                        }}
                      >
                        {wordCount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    maxHeight: 600,
                    overflowY: 'auto',
                    mb: 4,
                    pr: 3,
                    pl: 1,
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                    borderRadius: 3,
                    p: 4,
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: isDark ? 'inset 0 2px 8px rgba(0, 0, 0, 0.2)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
                    '&::-webkit-scrollbar': {
                      width: '12px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      border: `3px solid ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)'}`,
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.5)',
                      },
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.85,
                      fontSize: '1.125rem',
                      fontFamily: '"Charter", "Iowan Old Style", "Georgia", "Palatino", "Times New Roman", serif',
                      fontWeight: 400,
                      letterSpacing: '0.005em',
                      textRendering: 'optimizeLegibility',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }}
                  >
                    {generatedContent}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrowIcon />} 
                    onClick={handleContinue}
                    disabled={isGenerating}
                    sx={{
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.25,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 18px rgba(139, 92, 246, 0.4)',
                      },
                    }}
                  >
                    Continue
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />} 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    sx={{
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: '#8b5cf6',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.25,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                      },
                    }}
                  >
                    Rewrite
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ 
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.25,
                      borderRadius: 2,
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: 'none',
                      '&:hover': {
                        background: 'rgba(16, 185, 129, 0.25)',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
                      },
                    }}
                  >
                    Save
                  </Button>
                  <IconButton 
                    onClick={handleCopy} 
                    sx={{ 
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`, 
                      borderRadius: 2,
                      color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        color: '#8b5cf6',
                      },
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        isAuthenticated={!!currentUser}
      />
      </Container>
    </Box>
  );
};
