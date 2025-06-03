import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';

interface DecodedToken {
  exp: number; 
  iss: string; 
  aud: string; 
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string; 
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; 
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string; 
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
}

const Signup = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: username,
          Email: email,
          Password: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'הרשמה נכשלה.');
      }
      const data = await response.json();
      const token = data.token;

      console.log("Received Token:", token);
      const decodedToken = jwtDecode<DecodedToken>(token);
      console.log("Decoded Token:", decodedToken);

      const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email; 

      if (!userName) {
        console.error("שם משתמש (ClaimTypes.Name) לא נמצא בטוקן המפוענח לאחר ההרשמה.");
        setError("שם משתמש לא נמצא בפרטי ההרשמה.");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName); 
      localStorage.setItem('userEmail', userEmail); 

      setIsAuthenticated(true);
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(`הרשמה נכשלה: ${err.message || 'נסה שוב.'}`);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 1 }}>
      <Paper elevation={3} sx={{ p: 4, direction: 'rtl', borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom color="#00796b">
          הרשמה למערכת
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignup}>
          <TextField
            label="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="אימייל"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="סיסמה"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="אימות סיסמה"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
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
            הירשם
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;