import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        textAlign: 'center',
        direction: 'rtl',
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <DescriptionIcon sx={{ fontSize: 50, color: '#00796b' }} />
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: '#00796b',
            fontFamily: 'Segoe UI, sans-serif',
          }}
        >
          FileFlow
        </Typography>
      </Box>

      <Typography variant="h5" fontWeight="medium" gutterBottom>
        ניהול מסמכים חכם, פשוט ובטוח.
      </Typography>

      <Typography variant="body1" sx={{ mt: 3, mb: 5, fontSize: '1.2rem' }}>
        תן למערכת לדאוג למיון הקבצים שלך באופן אוטומטי. <br />
        הירשם והתחל להשתמש במערכת המתקדמת שלנו.
      </Typography>

      {!isAuthenticated && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{
              backgroundColor: '#43a047',
              '&:hover': { backgroundColor: '#2e7d32' },
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: 2,
            }}
          >
            הרשמה
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              backgroundColor: '#0288d1',
              '&:hover': { backgroundColor: '#01579b' },
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: 2,
            }}
          >
            התחברות
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Home;
