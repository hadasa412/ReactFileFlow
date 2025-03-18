import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';

const AuthModal: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [open, setOpen] = useState(false);

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleLoginSubmit = (data: { email: string; password: string }) => {
    // כאן תוכל להוסיף את הלוגיקה שלך להתחברות
    console.log('Login data:', data);
    setOpen(false);
  };

  const handleRegisterSubmit = (data: { name: string; email: string; password: string }) => {
    // כאן תוכל להוסיף את הלוגיקה שלך להרשמה
    console.log('Register data:', data);
    setIsLoginMode(true);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Login / Register</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" style={{ marginBottom: '20px', textAlign: 'center' }}>
            {isLoginMode ? 'Login' : 'Register'}
          </Typography>
          {isLoginMode ? (
            <LoginForm onSubmit={handleLoginSubmit} />
          ) : (
            <RegisterForm onSubmit={handleRegisterSubmit} />
          )}
          <Button onClick={() => setIsLoginMode(!isLoginMode)} style={{ marginTop: '10px' }}>
            {isLoginMode ? 'Need an account? Register' : 'Already have an account? Login'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AuthModal;
