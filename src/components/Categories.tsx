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
} from "@mui/material";
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
          הוסף
        </Button>
      </Box>

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
              <a
                href={`https://user-files-fileflow.s3.amazonaws.com/${doc.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "underline",
                  color: "#00796b",
                  fontWeight: "bold",
                  display: "block",
                  marginTop: 8,
                }}
              >
                צפייה / הורדה
              </a>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Categories;
