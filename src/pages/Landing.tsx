import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, TextField, Grid, Paper, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
          top: '-15%',
          right: '-8%',
          width: '50%',
          height: '70%',
          background: `radial-gradient(circle, rgba(139, 92, 246, ${isDark ? '0.25' : '0.15'}) 0%, rgba(236, 72, 153, ${isDark ? '0.15' : '0.08'}) 40%, transparent 70%)`,
          filter: 'blur(120px)',
          pointerEvents: 'none',
          animation: 'pulse 8s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
            '50%': { opacity: 1, transform: 'scale(1.1)' },
          },
        }}
      />
      
      {/* Hidden Logo Background */}
      <Box
        component="img"
        src="/image.png"
        alt=""
        sx={{
          position: 'absolute',
          right: '-5%',
          top: '8%',
          width: '500px',
          height: 'auto',
          opacity: isDark ? 0.03 : 0.02,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '30%',
          height: '40%',
          background: `radial-gradient(circle, rgba(236, 72, 153, ${isDark ? '0.2' : '0.1'}) 0%, transparent 60%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          animation: 'float 10s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-30px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '35%',
          height: '45%',
          background: `radial-gradient(circle, rgba(168, 85, 247, ${isDark ? '0.18' : '0.1'}) 0%, transparent 65%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
          animation: 'drift 12s ease-in-out infinite',
          '@keyframes drift': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '33%': { transform: 'translate(20px, -20px)' },
            '66%': { transform: 'translate(-15px, 15px)' },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            pt: { xs: 8, md: 12 },
            pb: { xs: 4, md: 6 },
          }}
        >
          {/* Main Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem', lg: '7.5rem' },
              fontWeight: 700,
              lineHeight: 0.95,
              mb: 4,
              letterSpacing: '-0.04em',
              maxWidth: 1100,
            }}
          >
            Your fantasies,
            <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              perfectly told
            </Box>
          </Typography>

          {/* Subheadline */}
          <Typography
            sx={{
              fontSize: { xs: '1.125rem', md: '1.5rem' },
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              mb: 8,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            AI-powered erotica that knows exactly what you want.
            Completely private. Infinitely customizable. Ready in seconds.
          </Typography>

          {/* CTA Section */}
          <Box sx={{ maxWidth: 700 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your perfect scene..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 2,
                    fontSize: '1.125rem',
                    '& fieldset': {
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                    '& input': {
                      color: isDark ? '#ffffff' : '#1a1a1a',
                      padding: '16px 20px',
                      '&::placeholder': {
                        color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/app', { state: { prompt } })}
                sx={{
                  px: 4,
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 50px rgba(139, 92, 246, 0.4)',
                  },
                }}
              >
                Start
              </Button>
            </Box>

            <Typography
              sx={{
                fontSize: '0.875rem',
                color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              }}
            >
              Free to try • No signup required • Completely anonymous
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 12, md: 16 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            How it works
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: '1.25rem',
              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              mb: 10,
            }}
          >
            From imagination to indulgence in seconds
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <CreateIcon sx={{ fontSize: 48 }} />,
                step: '01',
                title: 'Describe your desire',
                description: 'Share your fantasy in your own words. Be as detailed or as brief as you like – the AI adapts to your style.',
              },
              {
                icon: <AutoFixHighIcon sx={{ fontSize: 48 }} />,
                step: '02',
                title: 'AI works its magic',
                description: 'Advanced AI crafts a unique, steamy story tailored to your exact preferences. Every detail matters.',
              },
              {
                icon: <CheckCircleIcon sx={{ fontSize: 48 }} />,
                step: '03',
                title: 'Lose yourself',
                description: 'Immerse yourself in your personalized story. Love it? Generate endless variations with a single click.',
              },
            ].map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    height: '100%',
                    background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                      borderColor: 'rgba(139, 92, 246, 0.4)',
                      transform: 'translateY(-8px)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '4rem',
                      fontWeight: 700,
                      color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      lineHeight: 1,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Box
                    sx={{
                      color: '#8b5cf6',
                      mb: 3,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                      lineHeight: 1.7,
                      fontSize: '1rem',
                    }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 12, md: 16 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            What our users say
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: '1.25rem',
              color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              mb: 10,
            }}
          >
            Thousands of satisfied readers worldwide
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                name: 'Sarah M.',
                rating: 5,
                text: 'I was skeptical about AI-generated content, but this blew me away. The stories are sophisticated, sensual, and surprisingly emotional. Finally, content that matches my taste perfectly.',
              },
              {
                name: 'Marcus K.',
                rating: 5,
                text: 'The privacy aspect is what sold me, but the quality kept me coming back. No judgment, no awkward browsing history – just incredible stories tailored to exactly what I want.',
              },
              {
                name: 'Jennifer L.',
                rating: 5,
                text: 'As someone who\'s read a LOT of erotica, I can say this AI understands pacing, tension, and chemistry better than most human writers. Each story feels handcrafted.',
              },
              {
                name: 'Alex R.',
                rating: 5,
                text: 'The variety is insane. I\'ve generated dozens of stories and each one feels fresh and unique. It\'s like having a personal author who knows exactly what you\'re into.',
              },
              {
                name: 'Diana S.',
                rating: 5,
                text: 'I love how specific I can get with my prompts. The AI picks up on subtle details and weaves them into something that feels real and immersive. This is the future.',
              },
              {
                name: 'Chris B.',
                rating: 5,
                text: 'Finally, something that caters to my very specific tastes without any shame or limits. The stories are literary quality, not just cheap thrills. Absolutely worth it.',
              },
            ].map((testimonial, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                      borderColor: 'rgba(236, 72, 153, 0.4)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <FormatQuoteIcon
                    sx={{
                      fontSize: 48,
                      color: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)',
                      mb: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                      lineHeight: 1.7,
                      fontSize: '0.9375rem',
                      mb: 3,
                      flex: 1,
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#ec4899',
                        fontSize: '1.125rem',
                      }}
                    >
                      {'★'.repeat(testimonial.rating)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: { xs: 12, md: 16 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 6, md: 10 },
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: `radial-gradient(circle at top right, rgba(139, 92, 246, ${isDark ? '0.1' : '0.05'}) 0%, transparent 60%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 3,
                letterSpacing: '-0.02em',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Your perfect story awaits
            </Typography>
            <Typography
              sx={{
                fontSize: '1.25rem',
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                mb: 5,
                position: 'relative',
                zIndex: 1,
              }}
            >
              No signup. No strings attached. Just incredible stories in seconds.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/app')}
              sx={{
                px: 8,
                py: 2.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.25rem',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.3s',
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)',
                },
              }}
            >
              Generate My Story
            </Button>
            <Typography
              sx={{
                mt: 4,
                fontSize: '0.875rem',
                color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Adults only (18+)
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
