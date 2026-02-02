import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { StorySnippet, initializeExamples, STORAGE_KEY } from '../lib/storyExamples';

const AVAILABLE_TAGS = [
  'anal',
  'oral', 
  'blowjob',
  'rough',
  'dominant',
  'submissive',
  'voyeur',
  'exhibitionist',
  'bondage',
  'spanking',
  'threesome',
  'rimming',
  'lesbian',
  'pegging',
  'toys',
  'creampie',
  'group-sex',
];

type TagExamples = Record<string, StorySnippet[]>;

export const Examples: React.FC = () => {
  const [tagExamples, setTagExamples] = useState<TagExamples>({});
  const [selectedTag, setSelectedTag] = useState<string>('anal');
  const [newSnippet, setNewSnippet] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState(false);

  // Initialize localStorage with default examples if empty, then load
  useEffect(() => {
    initializeExamples(); // Add defaults if localStorage is empty
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTagExamples(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load examples:', e);
      }
    }
  }, []);

  // Save to localStorage whenever tagExamples change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tagExamples));
  }, [tagExamples]);

  const handleAddSnippet = () => {
    if (!newSnippet.trim()) return;

    setTagExamples(prev => ({
      ...prev,
      [selectedTag]: [
        ...(prev[selectedTag] || []),
        { text: newSnippet.trim() }
      ]
    }));

    setNewSnippet('');
  };

  const handleDeleteSnippet = (tag: string, index: number) => {
    setTagExamples(prev => ({
      ...prev,
      [tag]: prev[tag].filter((_, i) => i !== index)
    }));
  };

  const handleExportCode = () => {
    let code = `// Generated TAG_EXAMPLES - Copy this into storyExamples.ts\n\n`;
    code += `export const TAG_EXAMPLES: Record<string, StorySnippet[]> = {\n`;
    
    AVAILABLE_TAGS.forEach(tag => {
      const snippets = tagExamples[tag] || [];
      code += `  "${tag}": [\n`;
      
      snippets.forEach((snippet) => {
        const escapedText = snippet.text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        code += `    {\n`;
        code += `      text: \`${escapedText}\`,\n`;
        code += `    },\n`;
      });
      
      code += `  ],\n\n`;
    });
    
    code += `};\n`;

    navigator.clipboard.writeText(code);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const currentTagSnippets = tagExamples[selectedTag] || [];
  const totalSnippets = Object.values(tagExamples).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#e5e7eb' }}>
          Example Snippet Manager
        </Typography>
        <Typography variant="body1" sx={{ color: '#9ca3af', mb: 3 }}>
          Add example snippets for each tag to improve story generation quality. Aim for 15-20 examples per tag.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {AVAILABLE_TAGS.map(tag => {
            const count = tagExamples[tag]?.length || 0;
            return (
              <Chip
                key={tag}
                label={`${tag} (${count})`}
                onClick={() => setSelectedTag(tag)}
                sx={{
                  backgroundColor: selectedTag === tag ? '#8b5cf6' : 'rgba(167, 139, 250, 0.15)',
                  color: selectedTag === tag ? '#fff' : '#a78bfa',
                  border: selectedTag === tag ? '2px solid #a78bfa' : '1px solid rgba(167, 139, 250, 0.3)',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: selectedTag === tag ? '#7c3aed' : 'rgba(167, 139, 250, 0.25)',
                  },
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#e5e7eb' }}>
            Total snippets: {totalSnippets}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleExportCode}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              },
            }}
          >
            Export Code
          </Button>
        </Box>

        {exportSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Code copied to clipboard! Paste it into storyExamples.ts
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Add New Snippet */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#e5e7eb' }}>
              Add Snippet for: {selectedTag}
            </Typography>

            <TextField
              label="Example snippet (300-500 words)"
              multiline
              rows={16}
              value={newSnippet}
              onChange={(e) => setNewSnippet(e.target.value)}
              fullWidth
              placeholder="Write an explicit example showing the writing style for this tag..."
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0b0f14',
                  color: '#e5e7eb',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(167, 139, 250, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#a78bfa',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#9ca3af',
                },
              }}
            />

            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddSnippet}
              disabled={!newSnippet.trim()}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
                },
              }}
            >
              Add Snippet
            </Button>
          </Paper>
        </Grid>

        {/* Existing Snippets */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 3,
              maxHeight: '800px',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#e5e7eb' }}>
              {selectedTag} Snippets ({currentTagSnippets.length})
            </Typography>

            {currentTagSnippets.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                  No snippets yet for this tag. Add your first example!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {currentTagSnippets.map((snippet, index) => (
                  <Card
                    key={index}
                    sx={{
                      backgroundColor: '#0b0f14',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          Snippet #{index + 1} • {snippet.text.split(/\s+/).length} words
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSnippet(selectedTag, index)}
                          sx={{
                            color: '#f87171',
                            '&:hover': {
                              backgroundColor: 'rgba(248, 113, 113, 0.1)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#e5e7eb',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.6,
                        }}
                      >
                        {snippet.text.substring(0, 300)}
                        {snippet.text.length > 300 && '...'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
