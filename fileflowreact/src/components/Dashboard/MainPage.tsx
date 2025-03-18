// src/components/Dashboard/MainPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>ברוך הבא!</h1>
      <button onClick={() => navigate('/login')}>התחבר</button>
      <button onClick={() => navigate('/register')}>הרשמה</button>
    </div>
  );
};

export default MainPage;
