import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { Container } from '@mui/material';

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
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email;

      if (!userName) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full">
              <LogIn className="h-6 w-6 text-teal-600 dark:text-teal-300" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">התחברות למערכת</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">נא להזין את פרטי ההתחברות</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="flex gap-2 items-center">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">אימייל</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">סיסמה</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl transition"
            >
              התחבר
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
