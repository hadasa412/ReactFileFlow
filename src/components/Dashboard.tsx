
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import apiClient from "../services/apiClient";
import { useTheme } from "@mui/material/styles";

interface Document {
  id: number;
  title: string;
  contentType: string;
  uploadedAt: string;
  filePath: string;
  categoryId: number;
  categoryName: string;
}

interface Category {
  id: number;
  name: string;
}

const drawerWidth = 240;

const Dashboard = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("אין טוקן אימות. אנא התחבר מחדש.");
          setLoading(false);
          return;
        }

        const categoriesResponse = await apiClient.get("/api/category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoriesResponse.data);

        const allDocuments: Document[] = [];
        for (const category of categoriesResponse.data) {
          try {
            const docsResponse = await apiClient.get(`/api/documents/by-category/${category.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const docsWithCategory = docsResponse.data.map((doc: any) => ({
              ...doc,
              categoryId: category.id,
              categoryName: category.name,
            }));

            allDocuments.push(...docsWithCategory);
          } catch (docError) {
            console.warn(`Could not load documents for category ${category.name}:`, docError);
          }
        }

        setDocuments(allDocuments);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(`שגיאה בטעינת נתונים: ${err.message || 'נסה שוב מאוחר יותר.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteDocument = async (documentId: number) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק מסמך זה?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("אין טוקן אימות. אנא התחבר מחדש.");
        return;
      }

      const response = await apiClient.delete(`/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
        setError(null);
      } else {
        setError("שגיאה במחיקת המסמך.");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      setError("שגיאה במחיקת המסמך.");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategoryId === "all" || doc.categoryId === selectedCategoryId;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: { xs: 2, sm: 4 },
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.mode === 'dark' ? '#1a2027' : '#f0f2f5',
        borderRadius: 3,
        boxShadow: theme.palette.mode === 'dark' ? '0px 0px 15px rgba(0,0,0,0.5)' : '0px 4px 20px rgba(0, 0, 0, 0.08)',
        direction: 'rtl',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          textAlign: 'center',
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
        }}
      >
        לוח מחוונים
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.dark,
            borderRadius: 1,
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        display="flex"
        gap={{ xs: 1.5, sm: 2 }}
        mb={{ xs: 2, sm: 4 }}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          '& .MuiFormControl-root, & .MuiTextField-root': {
            flexGrow: 1,
            width: { xs: '100%', sm: 'auto' },
          }
        }}
      >
        <FormControl
          fullWidth={false}
          sx={{
            minWidth: { xs: '100%', sm: 150 },
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            '& .MuiInputLabel-root': {
              color: theme.palette.text.secondary,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.primary.light },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            },
          }}
        >
          <InputLabel id="category-select-label">קטגוריה</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value as number | "all")}
            label="קטגוריה"
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[3],
                  borderRadius: 1,
                },
              },
            }}
          >
            <MenuItem value="all">הצג הכל</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="חיפוש לפי שם"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            '& label.Mui-focused': { color: theme.palette.primary.main },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.primary.light },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            },
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '200px', flexDirection: 'column' }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            טוען מסמכים...
          </Typography>
        </Box>
      ) : filteredDocuments.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, mt: 4 }}>
          אין מסמכים להצגה עבור החיפוש/סינון הנוכחי.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 1.5, sm: 2 },
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(300px, 1fr))',
              md: 'repeat(auto-fill, minmax(320px, 1fr))',
            },
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              sx={{
                mb: 0,
                boxShadow: theme.shadows[3],
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: { xs: '160px', sm: '180px' },
                '&:hover': {
                  boxShadow: theme.shadows[6],
                }
              }}
            >
              <CardContent sx={{ pb: '8px !important', pt: '12px !important' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                  }}
                >
                  {doc.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, mb: 0.2 }}>
                  **קטגוריה:** {doc.categoryName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, mb: 0.2 }}>
                  **סוג:** {doc.contentType}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  **הועלה:** {new Date(doc.uploadedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} sx={{ p: '0 16px 12px' }}>
                <Button
                  href={`https://user-files-fileflow.s3.amazonaws.com/${doc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    borderRadius: 1,
                    py: 0.6,
                    px: 1.2,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    whiteSpace: 'nowrap',
                    '& .MuiButton-startIcon': {
                      marginRight: '6px',
                      marginLeft: '-2px',
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  צפייה
                </Button>
                {theme.breakpoints.down('sm') ? (
                  <IconButton
                    color="error"
                    onClick={() => deleteDocument(doc.id)}
                    aria-label="מחק מסמך"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteDocument(doc.id)}
                    startIcon={<DeleteIcon />}
                    sx={{
                      fontWeight: 'bold',
                      borderRadius: 1,
                      py: 0.6,
                      px: 1.2,
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      whiteSpace: 'nowrap',
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      '& .MuiButton-startIcon': {
                        marginRight: '6px',
                        marginLeft: '-2px',
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.error.light,
                        borderColor: theme.palette.error.dark,
                      },
                    }}
                  >
                    מחק
                  </Button>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;