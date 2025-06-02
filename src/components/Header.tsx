
import React, { JSX } from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom"; 
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar, 
} from "@mui/material";
import {
  Dashboard, 
  Description, 
  CloudUpload, 
  Search, 
  Settings,
  Logout, 
  Login, 
  PersonAdd, 
  Work,
} from "@mui/icons-material";

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string | null; 
  userEmail: string | null; 
}

const drawerWidth = 240;

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated, userName, userEmail }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("התנתקות!");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail"); 
    setIsAuthenticated(false);
    
    navigate("/");
  };

  const mainColor = "#00796b"; 
  const sidebarBgColor = "#263238";
  const activeItemBgColor = "#004d40"; 

  return (
    <Drawer
      variant="permanent"
      anchor="right" 
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: sidebarBgColor,
          color: "#fff",
          borderLeft: `1px solid ${mainColor}`,
          boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.3)', 
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.3rem",
            color: mainColor, 
            display: "flex",
            alignItems: "center",
            flexGrow: 1, 
          }}
        >
          FileFlow
        </Typography>
        <Work sx={{ ml: 1, fontSize: "2rem", color: '#fff' }} /> 
      </Box>

      <Box sx={{ p: 2, pb: 1, textAlign: 'center', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <Avatar
          sx={{ width: 60, height: 60, bgcolor: mainColor, mx: 'auto', mb: 1.5, border: '2px solid #fff' }}
        >
          {userName ? userName.charAt(0).toUpperCase() : ''} 
        </Avatar>
        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
          {userName || 'אורח'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {userEmail || 'אין מייל'} 
        </Typography>
      </Box>

      <List sx={{ mt: 2 }}>
        {isAuthenticated ? (
          <>
            
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to="/dashboard" 
                sx={{
                  backgroundColor: activeItemBgColor, 
                  borderRadius: "8px",
                  mx: 2,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: activeItemBgColor, 
                    opacity: 0.9,
                  },
                }}
              >
                <ListItemIcon>
                  <Dashboard sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="לוח מחוונים" sx={{ '& .MuiTypography-root': { fontWeight: 600, color: '#fff' } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/my-documents" 
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ListItemIcon>
                  <Description sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="המסמכים שלי" sx={{ '& .MuiTypography-root': { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/upload"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ListItemIcon>
                  <CloudUpload sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="העלאת מסמך" sx={{ '& .MuiTypography-root': { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />

            <ListItem disablePadding>
              <ListItemButton sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                <ListItemIcon>
                  <Search sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="חיפוש" sx={{ '& .MuiTypography-root': { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/settings"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ListItemIcon>
                  <Settings sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="הגדרות" sx={{ '& .MuiTypography-root': { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ListItemIcon>
                  <Login sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="התחברות" sx={{ '& .MuiTypography-root': { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/signup"
                sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <ListItemIcon>
                  <PersonAdd sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="הרשמה" sx={{ '& .MuiTypography-root': { color: '#fff' } }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {isAuthenticated && (
        <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid rgba(255,255,255,0.1)` }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                backgroundColor: 'rgba(220, 53, 69, 0.15)', 
                borderRadius: "8px",
                '&:hover': {
                  backgroundColor: 'rgba(220, 53, 69, 0.25)',
                },
              }}
            >
              <ListItemIcon>
                <Logout sx={{ color: '#dc3545' }} /> 
              </ListItemIcon>
              <ListItemText primary="התנתקות" sx={{ '& .MuiTypography-root': { fontWeight: 600, color: '#dc3545' } }} />
            </ListItemButton>
          </ListItem>
        </Box>
      )}
    </Drawer>
  );
};

export default Header;