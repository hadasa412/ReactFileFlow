import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UploadPage from "../pages/UploadPage";
import Categories from "../components/Categories";
import DocumentDetails from "../pages/DocumentDetails";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import Settings from "../components/Settings";

interface AppRoutesProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ darkMode, setDarkMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName"); 
    const storedUserEmail = localStorage.getItem("userEmail");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
<Header
  isAuthenticated={isAuthenticated}
  setIsAuthenticated={setIsAuthenticated}
  userName={userName || ""}
  userEmail={userEmail || ""}
/>      <div className="pt-24 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/documents/:id" element={<DocumentDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
