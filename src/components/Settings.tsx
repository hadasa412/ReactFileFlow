import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Button,
} from "@mui/material";

// נוסיף props לקומפוננטה
interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
  const [autoClassify, setAutoClassify] = useState<boolean>(false);

  useEffect(() => {
    const savedAutoClassify = localStorage.getItem("autoClassify") === "true";
    setAutoClassify(savedAutoClassify);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("darkMode", darkMode.toString());
    localStorage.setItem("autoClassify", autoClassify.toString());
    alert("ההגדרות נשמרו בהצלחה!");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" color="#00796b" gutterBottom align="center">
        הגדרות אישיות
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          }
          label="מצב כהה (Dark Mode)"
        />

        <FormControlLabel
          control={
            <Switch
              checked={autoClassify}
              onChange={() => setAutoClassify(!autoClassify)}
              color="primary"
            />
          }
          label="סיווג אוטומטי של מסמכים באמצעות AI"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          sx={{ fontWeight: 600, py: 1.5 }}
        >
          שמור הגדרות
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;
