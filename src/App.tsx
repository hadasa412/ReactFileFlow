
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadPage from "./pages/UploadPage";
import Categories from "./components/Categories";
import DocumentDetails from "./pages/DocumentDetails";
import Dashboard from "./components/Dashboard"; 
import Header from "./components/Header"; 
import Settings from "./components/Settings";
import LogoNeonStyle from "./components/logo-neon-style";

const drawerWidth = 240; 

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null); 
  const [userEmail, setUserEmail] = useState<string | null>(null); 

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName"); 
    const storedUserEmail = localStorage.getItem("userEmail"); 

    if (token) {
      setIsAuthenticated(true);
      setUserName(storedUserName); 
      setUserEmail(storedUserEmail); 
    } else {
      setIsAuthenticated(false);
      setUserName(null);
      setUserEmail(null);
    }
  }, []); 

  useEffect(() => {
    if (isAuthenticated) {
      setUserName(localStorage.getItem("userName"));
      setUserEmail(localStorage.getItem("userEmail"));
    } else {
      setUserName(null);
      setUserEmail(null);
    }
  }, [isAuthenticated]); 

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: '#00796b',
      },
      secondary: {
        main: '#dc3545',
      },
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
    },
    direction: 'rtl', 
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
{/* <LogoNeonStyle/> */}

        <Box sx={{ display: 'flex' }} dir="rtl">
          <Header
            drawerWidth={drawerWidth}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            userName={userName} 
            userEmail={userEmail} 
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1, 
              p: 3, 
              width: `calc(100% - ${drawerWidth}px)`, 
              mr: `${drawerWidth}px`,
              backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5', 
              minHeight: '100vh', 
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/documents/:id" element={<DocumentDetails />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/my-documents" element={<Dashboard />} /> 
              <Route
                path="/settings"
                element={
                  <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;