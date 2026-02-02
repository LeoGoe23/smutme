import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Button, 
  Box, 
  Typography, 
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../App';
import { useAuth } from '../context/AuthContext';
import { AuthDialog } from './AuthDialog';
import { AccountDialog } from './AccountDialog';

export const Header: React.FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { currentUser, userProfile, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? 'background.default' : '#fafafa',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Box
                component="img"
                src="/src/public/image.png"
                alt="Smut.me"
                sx={{
                  height: { xs: 32, sm: 40 },
                  width: 'auto',
                  display: 'block',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: theme.palette.mode === 'dark' ? 'text.primary' : '#1a1a1a',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Smut.me
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Button 
                component={Link} 
                to="/app" 
                sx={{ 
                  px: 2,
                  color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                }}
              >
                App
              </Button>
              <Button 
                component={Link} 
                to="/library" 
                sx={{ 
                  px: 2,
                  color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                }}
              >
                Library
              </Button>
              <Button 
                component={Link} 
                to="/pricing" 
                sx={{ 
                  px: 2,
                  color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                }}
              >
                Pricing
              </Button>
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                sx={{ 
                  ml: 1,
                  color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              {currentUser ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        background: theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {userProfile?.displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userProfile?.email}
                      </Typography>
                      {userProfile?.subscription && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            mt: 0.5,
                            color: '#8b5cf6',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {userProfile.subscription} Plan
                        </Typography>
                      )}
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleMenuClose} component={Link} to="/library">
                      <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      My Library
                    </MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); setAccountDialogOpen(true); }}>
                      <SettingsIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Account Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setAuthDialogOpen(true)}
                  sx={{ 
                    ml: 1,
                    color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    },
                  }}
                >
                  Sign in
                </Button>
              )}
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5, alignItems: 'center' }}>
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              {currentUser && (
                <IconButton
                  onClick={handleMenuOpen}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              )}
              
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            background: theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ py: 2 }}>
          <List>
            <ListItem 
              component={Link} 
              to="/app" 
              onClick={handleMobileMenuClose}
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                },
              }}
            >
              <ListItemIcon>
                <AppsIcon sx={{ color: '#8b5cf6' }} />
              </ListItemIcon>
              <ListItemText primary="App" />
            </ListItem>
            
            <ListItem 
              component={Link} 
              to="/library" 
              onClick={handleMobileMenuClose}
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                },
              }}
            >
              <ListItemIcon>
                <LibraryBooksIcon sx={{ color: '#8b5cf6' }} />
              </ListItemIcon>
              <ListItemText primary="Library" />
            </ListItem>
            
            <ListItem 
              component={Link} 
              to="/pricing" 
              onClick={handleMobileMenuClose}
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                },
              }}
            >
              <ListItemIcon>
                <AttachMoneyIcon sx={{ color: '#8b5cf6' }} />
              </ListItemIcon>
              <ListItemText primary="Pricing" />
            </ListItem>
          </List>
          
          {!currentUser && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    handleMobileMenuClose();
                    setAuthDialogOpen(true);
                  }}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? 'inherit' : '#1a1a1a',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    },
                  }}
                >
                  Sign in
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      <AccountDialog open={accountDialogOpen} onClose={() => setAccountDialogOpen(false)} />
    </>
  );
};
