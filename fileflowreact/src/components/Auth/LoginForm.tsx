import React from 'react';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps): React.JSX.Element => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ email: '', password: '' }); }}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
