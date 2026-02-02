import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PreregistrationDialog } from '../components/PreregistrationDialog';
import { ContactDialog } from '../components/ContactDialog';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  isBestValue?: boolean;
  cta: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export const Pricing: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const [preregistrationOpen, setPreregistrationOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: 'plus' | 'pro'; price: string } | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Detect user currency based on locale
  const getCurrency = (): { symbol: string; code: string; plusPrice: number; proPrice: number } => {
    const locale = navigator.language || 'en-US';
    
    // US users get USD
    if (locale.startsWith('en-US') || locale.startsWith('en-CA')) {
      return { symbol: '$', code: 'USD', plusPrice: 4.99, proPrice: 9.99 };
    }
    
    // UK users get GBP
    if (locale.startsWith('en-GB')) {
      return { symbol: '£', code: 'GBP', plusPrice: 3.99, proPrice: 7.99 };
    }
    
    // Default to EUR for Europe and rest of world
    return { symbol: '€', code: 'EUR', plusPrice: 4.99, proPrice: 9.99 };
  };

  const currency = getCurrency();

  const tiers: PricingTier[] = [
    {
      name: 'Free',
      price: `0${currency.symbol}`,
      description: 'Try it out',
      features: [
        '5 generations per day',
        'All styles available',
        'Short & medium lengths',
        'Tasteful intensity only',
        'Basic customization',
      ],
      cta: 'Start Free',
    },
    {
      name: 'Plus',
      price: `${currency.plusPrice}${currency.symbol}`,
      description: 'Per month',
      features: [
        'Unlimited generations',
        'All styles & lengths',
        'All intensity levels',
        'Advanced customization',
        'Priority generation',
        'Export to PDF/ePub',
      ],
      isBestValue: true,
      cta: 'Choose Plus',
    },
    {
      name: 'Pro',
      price: `${currency.proPrice}${currency.symbol}`,
      description: 'Per month',
      features: [
        'Everything in Plus',
        'Custom style training',
        'Longer chapter mode',
        'Character consistency',
        'Multi-chapter stories',
        'API access',
      ],
      cta: 'Choose Pro',
    },
  ];

  const faqs: FAQ[] = [
    {
      question: 'How does the free tier work?',
      answer: 'The free tier gives you 5 story generations per day. You can use all available styles, but only short and medium lengths with tasteful intensity. Perfect for trying out the platform.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, absolutely. You can cancel your subscription at any time from your account settings. You\'ll retain access until the end of your billing period.',
    },
    {
      question: 'Is my content private?',
      answer: 'Yes. Nothing is stored on our servers unless you explicitly save it to your library. Your saved stories are encrypted and only accessible by you. You can delete everything at any time.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and various local payment methods depending on your region. All payments are processed securely.',
    },
  ];

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  };

  const handlePlanClick = (tierName: string, tierPrice: string) => {
    if (tierName === 'Free') {
      // Free plan - do nothing or redirect to signup
      return;
    }
    // Open preregistration dialog for paid plans
    setSelectedPlan({ 
      plan: tierName.toLowerCase() as 'plus' | 'pro', 
      price: tierPrice 
    });
    setPreregistrationOpen(true);
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
      {/* Gradient Orb */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '40%',
          height: '60%',
          background: `radial-gradient(circle, rgba(139, 92, 246, ${isDark ? '0.15' : '0.08'}) 0%, transparent 70%)`,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Choose your plan
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 650, 
              mx: 'auto',
              fontSize: '1.25rem',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              lineHeight: 1.7,
              fontWeight: 400,
              mb: 3,
            }}
          >
            Start free and upgrade when you're ready for more. All plans include content preferences and
            privacy controls.
          </Typography>
          <Button
            variant="text"
            onClick={() => setContactDialogOpen(true)}
            sx={{
              textTransform: 'none',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.875rem',
              textDecoration: 'underline',
              '&:hover': {
                color: '#8b5cf6',
                backgroundColor: 'transparent',
              },
            }}
          >
            Need other payment options? Contact us
          </Button>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} sx={{ mb: 16 }}>
          {tiers.map((tier) => (
            <Grid item xs={12} md={4} key={tier.name}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: tier.isBestValue 
                    ? '2px solid rgba(139, 92, 246, 0.5)' 
                    : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: tier.isBestValue 
                      ? 'rgba(139, 92, 246, 0.7)' 
                      : 'rgba(139, 92, 246, 0.4)',
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&::before': tier.isBestValue ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                  } : {},
                }}
              >
                {tier.isBestValue && (
                  <Chip
                    label="Best Value"
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                      color: '#ffffff',
                      border: 'none',
                    }}
                  />
                )}

                <CardContent sx={{ flex: 1, p: 5 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {tier.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {tier.price}
                    </Typography>
                    {tier.price !== '0€' && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 1,
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        /month
                      </Typography>
                    )}
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 4,
                      color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {tier.description}
                  </Typography>

                  <List sx={{ mb: 3 }}>
                    {tier.features.map((feature, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: '#8b5cf6', fontSize: 22 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontSize: '0.9375rem',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                <Box sx={{ p: 4, pt: 0 }}>
                  <Button
                    variant={tier.isBestValue ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    onClick={() => handlePlanClick(tier.name, tier.price)}
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      ...(tier.isBestValue ? {
                        background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                        '&:hover': {
                          boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                      } : {
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        color: isDark ? '#ffffff' : '#1a1a1a',
                        '&:hover': {
                          borderColor: '#8b5cf6',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        },
                      }),
                    }}
                  >
                    {tier.cta}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 8, 
              fontWeight: 700, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '3rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFAQ === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              elevation={0}
              sx={{
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 3,
                mb: 2,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                },
                '&:hover': {
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{ py: 2.5, px: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* Preregistration Dialog */}
      {selectedPlan && (
        <PreregistrationDialog
          open={preregistrationOpen}
          onClose={() => {
            setPreregistrationOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan.plan}
          price={selectedPlan.price}
        />
      )}

      {/* Contact Dialog */}
      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        subject="Payment Options Inquiry"
      />
    </Box>
  );
};
