import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Divider,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserIdFromToken } from "../tokenUtils";
import apiClient from "../services/apiClient";

interface Category {
  id: number;
  name: string;
  documents: Document[];
}

interface Document {
  id: number;
  title: string;
  contentType: string;
  uploadedAt: string;
  filePath: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await apiClient.get("/api/category", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categoriesWithDocuments = await Promise.all(
          response.data.map(async (category: Category) => {
            try {
              const documentsResponse = await apiClient.get(`/api/documents/by-category/${category.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              return { ...category, documents: documentsResponse.data };
            } catch {
              return { ...category, documents: [] };
            }
          })
        );

        setCategories(categoriesWithDocuments);
      } catch (error) {
        console.error("Error loading categories:", error);
        setError("שגיאה בטעינת קטגוריות");
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const confirmMessage = category.documents?.length
      ? "הקטגוריה מכילה מסמכים. למחוק הכל?"
      : "האם למחוק את הקטגוריה?";
    if (!window.confirm(confirmMessage)) return;

    try {
      await apiClient.delete(`/api/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      setError(null);
    } catch {
      setError("שגיאה במחיקת הקטגוריה.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("אנא הזן שם קטגוריה.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token!);
      if (!userId) return;

      const response = await apiClient.post(
        "/api/category",
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCategories([...categories, { ...response.data, documents: [] }]);
      setNewCategoryName("");
      setError(null);
    } catch {
      setError("שגיאה בהוספת קטגוריה.");
    }
  };

  // 🔧 פונקציה מתוקנת לטיפול ב-Signed URLs
  const handleViewDocument = async (doc: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("אין טוקן התחברות. אנא התחבר מחדש.");
        return;
      }
  
      console.log("🔧 Requesting download URL for filePath:", doc.filePath);
  
      // 🔧 שימוש ב-query parameter במקום path parameter
      const response = await apiClient.get(`/api/documents/download-url?fileName=${encodeURIComponent(doc.filePath)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("🔧 Response:", response.data);
  
      const downloadUrl = response.data.downloadUrl;
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        setError("לא התקבל קישור תקין לקובץ");
      }
    } catch (err: any) {
      console.error("🔧 Error getting download URL:", err);
      console.error("🔧 Error details:", err.response?.data);
      setError("שגיאה בקבלת הקישור לקובץ");
    }
  };

  const allDocuments = categories.flatMap((category) =>
    category.documents.map((doc) => ({
      ...doc,
      categoryName: category.name,
      categoryId: category.id,
    }))
  );

  const filteredDocuments = allDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategoryId === null || doc.categoryId === selectedCategoryId)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" align="center">
        ניהול קטגוריות
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: "1rem" }}>
          {error}
        </Alert>
      )}

      {/* הוספת קטגוריה חדשה */}
      <Box display="flex" gap={2} alignItems="center" mb={4}>
        <TextField
          label="שם קטגוריה חדשה"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          הוסף קטגוריה
        </Button>
      </Box>

      {/* ניהול קטגוריות קיימות */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom color="primary">
          קטגוריות קיימות
        </Typography>
        
        {categories.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ fontSize: "1.1rem", py: 2 }}>
            אין קטגוריות במערכת
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {categories.map((category) => (
              <Card key={category.id} sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.documents?.length || 0} מסמכים
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteCategory(category.id)}
                      startIcon={<DeleteIcon />}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#ffebee',
                        }
                      }}
                    >
                      מחק קטגוריה
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* צפייה במסמכים */}
      <Typography variant="h5" gutterBottom color="primary">
        צפייה במסמכים
      </Typography>

      <Box mb={2}>
        <TextField
          label="חפש מסמך"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          variant="outlined"
        />
      </Box>

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <Button
          variant={selectedCategoryId === null ? "contained" : "outlined"}
          onClick={() => setSelectedCategoryId(null)}
        >
          כל המסמכים
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategoryId === cat.id ? "contained" : "outlined"}
            onClick={() => setSelectedCategoryId(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </Box>

      {filteredDocuments.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ fontSize: "1.2rem" }}>
          לא נמצאו מסמכים התואמים לחיפוש / סינון.
        </Typography>
      ) : (
        filteredDocuments.map((doc) => (
          <Card key={doc.id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {doc.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                קטגוריה: {doc.categoryName} | סוג: {doc.contentType} | הועלה:{" "}
                {new Date(doc.uploadedAt).toLocaleString()}
              </Typography>

              {/* 🔧 כפתור מתוקן עם filePath */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleViewDocument(doc)}
                sx={{
                  backgroundColor: "#00796b",
                  "&:hover": {
                    backgroundColor: "#004d40",
                  },
                  mt: 1
                }}
              >
                צפייה / הורדה
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Categories;
