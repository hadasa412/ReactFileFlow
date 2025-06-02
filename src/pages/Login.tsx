import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { useState } from 'react';

interface DecodedToken {
  exp: number; 
  iss: string; 
  aud: string; 
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string; 
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; 
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string; 
}

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'התחברות נכשלה.');
      }

      const data = await response.json();
      const token = data.token;

      console.log("Received Token:", token);
      const decodedToken = jwtDecode<DecodedToken>(token);
      console.log("Decoded Token:", decodedToken);

      const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email; // השתמש במייל מהטוקן, אם לא קיים אז מהשדה שהוזן

      if (!userName) {
        console.error("שם משתמש (ClaimTypes.Name) לא נמצא בטוקן המפוענח.");
        setError("שם משתמש לא נמצא בפרטי התחברות.");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName); 
      localStorage.setItem('userEmail', userEmail); 

      setIsAuthenticated(true);
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(`התחברות נכשלה: ${err.message || 'אירעה שגיאה לא ידועה'}`);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, direction: 'rtl', borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom color="#00796b">
          התחברות למערכת
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            type="email"
            label="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 2,
              '& label.Mui-focused': { color: '#00796b' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00796b' },
                '&:hover fieldset': { borderColor: '#004d40' },
                '&.Mui-focused fieldset': { borderColor: '#004d40' },
              },
            }}
          />
          <TextField
            type="password"
            label="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 3,
              '& label.Mui-focused': { color: '#00796b' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#00796b' },
                '&:hover fieldset': { borderColor: '#004d40' },
                '&.Mui-focused fieldset': { borderColor: '#004d40' },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#00796b',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#004d40' },
            }}
          >
            התחבר
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;