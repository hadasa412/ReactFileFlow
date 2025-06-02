import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Alert,
  Box,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface Category {
  id: number;
  name: string;
}

const UploadDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [tags, setTags] = useState([]);
  const [autoTag, setAutoTag] = useState(true);
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("שגיאה בשליפת קטגוריות:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };const handleUpload = async () => {
    if (!file) {
      setMessage("בחר קובץ להעלאה.");
      return;
    }
  
    const formData = new FormData();
    formData.append("File", file);
    if (categoryId !== null) {
      formData.append("CategoryId", categoryId.toString());
    }
    formData.append("UseAutoTagging", autoTag.toString()); // ← הוספה חשובה

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("עליך להתחבר לפני העלאת קובץ.");
      return;
    }
  
    try {
      setIsUploading(true);
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const uploadedDocId = response.data?.documentId;
      setMessage("הקובץ הועלה בהצלחה!");
      setFile(null);
      setCategoryId(null);
  
  
      if (autoTag && uploadedDocId) {
        const aiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ai/tag-document`,
          { documentId: uploadedDocId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (aiResponse.data?.tags) {
          setTags(aiResponse.data.tags);
        }
      }
    } catch (error: any) {
      console.error("שגיאה מהשרת:", error);
  
      if (error.response) {
        if (error.response.status === 401) {
          setMessage("אין הרשאה – התחברות נדרשת או הטוקן אינו תקף.");
        } else {
          setMessage(error.response.data?.message || "שגיאה בשרת.");
        }
      } else {
        setMessage("שגיאה בלתי צפויה: " + error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setMessage("אנא הזן שם קטגוריה תקין.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("עליך להתחבר כדי להוסיף קטגוריה.");
        return;
      }

      setIsAddingCategory(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/category`,
        { name: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prev) => [...prev, response.data]);
      setCategoryId(response.data.id);
      setNewCategoryName("");
      setMessage("קטגוריה נוספה בהצלחה!");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "שגיאה בהוספת הקטגוריה.");
      console.error(error);
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" color="#00796b" gutterBottom>
        העלאת מסמך
      </Typography>
      <FormControlLabel
  control={
    <Checkbox
      checked={autoTag}
      onChange={(e) => setAutoTag(e.target.checked)}
    />
  }
  label="הפעל תיוג אוטומטי למסמך"
/>
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button
            variant="outlined"
            component="span"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              color: "#00796b",
              borderColor: "#00796b",
              "&:hover": {
                backgroundColor: "#e0f2f1",
                borderColor: "#004d40",
              },
            }}
          >
            בחר קובץ
          </Button>
        </label>
        {file && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            קובץ שנבחר: {file.name}
          </Typography>
        )}
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel
          id="category-select-label"
          sx={{ color: "#00796b", "&.Mui-focused": { color: "#004d40" } }}
        >
          בחר קטגוריה
        </InputLabel>
        <Select
          labelId="category-select-label"
          value={categoryId !== null ? categoryId : ""}
          onChange={(e) =>
            setCategoryId(e.target.value === "" ? null : Number(e.target.value))
          }
          label="בחר קטגוריה"
          sx={{
            backgroundColor: "#f5f5f5",
            color: "#00796b",
            "& .MuiSelect-icon": { color: "#00796b" },
            "& fieldset": { borderColor: "#00796b" },
            "&:hover fieldset": { borderColor: "#004d40" },
            "&.Mui-focused fieldset": { borderColor: "#004d40" },
          }}
        >
          <MenuItem value="">
            <em>ללא קטגוריה</em>
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText sx={{ color: "#00796b" }}>
          בחר קטגוריה (אופציונלי)
        </FormHelperText>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="הוסף קטגוריה חדשה"
            variant="outlined"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{
              "& label.Mui-focused": { color: "#004d40" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00796b" },
                "&:hover fieldset": { borderColor: "#004d40" },
                "&.Mui-focused fieldset": { borderColor: "#004d40" },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddCategory}
            disabled={isAddingCategory}
            sx={{
              backgroundColor: "#00796b",
              "&:hover": { backgroundColor: "#004d40" },
              fontWeight: 600,
              py: 1.5,
              minWidth: 120,
            }}
          >
            {isAddingCategory ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "הוסף"
            )}
          </Button>
        </Stack>
      </Box>

      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isUploading}
        sx={{
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          backgroundColor: "#00796b",
          "&:hover": { backgroundColor: "#004d40" },
        }}
      >
        {isUploading ? (
          <CircularProgress size={24} sx={{ color: "white", mr: 2 }} />
        ) : (
          "העלה קובץ"
        )}
      </Button>

      {message && (
        <Alert
          severity={
            message.includes("שגיאה") ||
            message.includes("בחר קובץ") ||
            message.includes("התחבר")
              ? "error"
              : "success"
          }
          sx={{ mt: 3 }}
        >
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default UploadDocument;
