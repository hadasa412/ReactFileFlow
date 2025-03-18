import React from 'react';
import LoginForm from './components/Auth/LoginForm';

const App = (): React.JSX.Element => {
  const handleLogin = (data: { email: string; password: string }) => {
    // טיפול בהתחברות
    console.log(data);
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default App;
