
import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
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
  Paper,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Chip,
  Divider,
  Avatar,
  Fade,
  Zoom,
} from "@mui/material"
import { CloudUpload, FolderOpen, SmartToy, CheckCircle, Error, Description, Add, Tag } from "@mui/icons-material"

interface Category {
  id: number
  name: string
}

const UploadDocumentImproved: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [message, setMessage] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [newCategoryName, setNewCategoryName] = useState<string>("")
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false)
  const [tags, setTags] = useState([])
  const [autoTag, setAutoTag] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories(response.data)
    } catch (error) {
      console.error("שגיאה בשליפת קטגוריות:", error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
      setMessage("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("בחר קובץ להעלאה.")
      return
    }

    const formData = new FormData()
    formData.append("File", file)
    if (categoryId !== null) {
      formData.append("CategoryId", categoryId.toString())
    }
    formData.append("UseAutoTagging", autoTag.toString())

    const token = localStorage.getItem("token")
    if (!token) {
      setMessage("עליך להתחבר לפני העלאת קובץ.")
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
          setUploadProgress(percentCompleted)
        },
      })

      const uploadedDocId = response.data?.documentId
      setMessage("הקובץ הועלה בהצלחה!")
      setFile(null)
      setCategoryId(null)
      setUploadProgress(100)

      if (autoTag && uploadedDocId) {
        const aiResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ai/tag-document`,
          { documentId: uploadedDocId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (aiResponse.data?.tags) {
          setTags(aiResponse.data.tags)
        }
      }
    } catch (error: any) {
      console.error("שגיאה מהשרת:", error)

      if (error.response) {
        if (error.response.status === 401) {
          setMessage("אין הרשאה – התחברות נדרשת או הטוקן אינו תקף.")
        } else {
          setMessage(error.response.data?.message || "שגיאה בשרת.")
        }
      } else {
        setMessage("שגיאה בלתי צפויה: " + error.message)
      }
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setMessage("אנא הזן שם קטגוריה תקין.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setMessage("עליך להתחבר כדי להוסיף קטגוריה.")
        return
      }

      setIsAddingCategory(true)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/category`,
        { name: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setCategories((prev) => [...prev, response.data])
      setCategoryId(response.data.id)
      setNewCategoryName("")
      setMessage("קטגוריה נוספה בהצלחה!")
    } catch (error: any) {
      setMessage(error.response?.data?.message || "שגיאה בהוספת הקטגוריה.")
      console.error(error)
    } finally {
      setIsAddingCategory(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return "📄"
    if (file.type.includes("image")) return "🖼️"
    if (file.type.includes("word")) return "📝"
    if (file.type.includes("excel")) return "📊"
    return "📁"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Paper
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                p: 4,
                mb: 3,
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  background: "linear-gradient(45deg, #00796b, #004d40)",
                }}
              >
                <CloudUpload sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(45deg, #00796b, #004d40)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                העלאת מסמך
              </Typography>
              <Typography variant="h6" color="text.secondary">
                העלה מסמכים חדשים למערכת בקלות ובמהירות
              </Typography>
            </Paper>

            <Stack spacing={3}>
              {/* File Upload Section */}
              <Zoom in timeout={600}>
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <Description />
                      </Avatar>
                    }
                    title="בחירת קובץ"
                    subheader="בחר את הקובץ שברצונך להעלות למערכת"
                    sx={{ pb: 1 }}
                  />
                  <CardContent>
                    <Box
                      sx={{
                        border: "2px dashed #00796b",
                        borderRadius: 2,
                        p: 4,
                        textAlign: "center",
                        bgcolor: "rgba(0, 121, 107, 0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(0, 121, 107, 0.1)",
                          borderColor: "#004d40",
                        },
                      }}
                    >
                      <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="file-input" />
                      <label htmlFor="file-input">
                        <Button
                          variant="contained"
                          component="span"
                          size="large"
                          startIcon={<CloudUpload />}
                          sx={{
                            background: "linear-gradient(45deg, #00796b, #004d40)",
                            borderRadius: 3,
                            px: 4,
                            py: 2,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            boxShadow: "0 8px 32px rgba(0, 121, 107, 0.3)",
                            "&:hover": {
                              background: "linear-gradient(45deg, #004d40, #00251a)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 40px rgba(0, 121, 107, 0.4)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          בחר קובץ להעלאה
                        </Button>
                      </label>
                      {file && (
                        <Fade in>
                          <Paper
                            elevation={2}
                            sx={{
                              mt: 3,
                              p: 3,
                              background: "linear-gradient(45deg, #e8f5e8, #f1f8e9)",
                              borderRadius: 2,
                              border: "1px solid #4caf50",
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="h4">{getFileIcon(file)}</Typography>
                              <Box flex={1}>
                                <Typography variant="h6" fontWeight={600} color="#2e7d32">
                                  {file.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  גודל: {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                              <CheckCircle sx={{ color: "#4caf50", fontSize: 30 }} />
                            </Box>
                          </Paper>
                        </Fade>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>

              {/* Category Selection */}
              <Zoom in timeout={800}>
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#ff9800" }}>
                        <FolderOpen />
                      </Avatar>
                    }
                    title="ניהול קטגוריות"
                    subheader="בחר קטגוריה קיימת או צור חדשה"
                    sx={{ pb: 1 }}
                  />
                  <CardContent>
                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <InputLabel
                          sx={{
                            color: "#00796b",
                            "&.Mui-focused": { color: "#004d40" },
                            fontSize: "1.1rem",
                          }}
                        >
                          בחר קטגוריה
                        </InputLabel>
                        <Select
                          value={categoryId !== null ? categoryId : ""}
                          onChange={(e) => setCategoryId(e.target.value === "" ? null : Number(e.target.value))}
                          label="בחר קטגוריה"
                          sx={{
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#00796b", borderWidth: 2 },
                              "&:hover fieldset": { borderColor: "#004d40" },
                              "&.Mui-focused fieldset": { borderColor: "#004d40" },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>ללא קטגוריה</em>
                          </MenuItem>
                          {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <FolderOpen sx={{ fontSize: 20, color: "#ff9800" }} />
                                {cat.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: "#00796b", fontSize: "0.9rem" }}>
                          בחר קטגוריה קיימת (אופציונלי)
                        </FormHelperText>
                      </FormControl>

                      <Divider sx={{ my: 2 }}>
                        <Chip label="או" sx={{ bgcolor: "#f5f5f5", fontWeight: 600 }} />
                      </Divider>

                      <Box>
                        <Typography variant="h6" gutterBottom fontWeight={600} color="#00796b">
                          הוסף קטגוריה חדשה
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="end">
                          <TextField
                            label="שם קטגוריה חדשה"
                            variant="outlined"
                            fullWidth
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{
                              "& label.Mui-focused": { color: "#004d40" },
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "& fieldset": { borderColor: "#00796b", borderWidth: 2 },
                                "&:hover fieldset": { borderColor: "#004d40" },
                                "&.Mui-focused fieldset": { borderColor: "#004d40" },
                              },
                            }}
                          />
                          <Button
                            variant="contained"
                            onClick={handleAddCategory}
                            disabled={isAddingCategory}
                            startIcon={isAddingCategory ? <CircularProgress size={20} color="inherit" /> : <Add />}
                            sx={{
                              background: "linear-gradient(45deg, #ff9800, #f57c00)",
                              borderRadius: 2,
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              minWidth: 120,
                              "&:hover": {
                                background: "linear-gradient(45deg, #f57c00, #ef6c00)",
                              },
                            }}
                          >
                            הוסף
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>

              {/* AI Tagging */}
              <Zoom in timeout={1000}>
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#9c27b0" }}>
                        <SmartToy />
                      </Avatar>
                    }
                    title="תיוג אוטומטי בבינה מלאכותית"
                    subheader="השתמש בטכנולוגיה מתקדמת לתיוג אוטומטי של המסמך"
                    sx={{ pb: 1 }}
                  />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={autoTag}
                          onChange={(e) => setAutoTag(e.target.checked)}
                          sx={{
                            color: "#9c27b0",
                            "&.Mui-checked": { color: "#7b1fa2" },
                            transform: "scale(1.2)",
                          }}
                        />
                      }
                      label={
                        <Typography variant="body1" fontWeight={500}>
                          הפעל תיוג אוטומטי למסמך
                        </Typography>
                      }
                      sx={{ ml: 0 }}
                    />
                  </CardContent>
                </Card>
              </Zoom>

              {/* Upload Progress */}
              {isUploading && (
                <Fade in>
                  <Card
                    elevation={0}
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 3,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <CircularProgress size={24} sx={{ color: "#00796b" }} />
                        <Typography variant="h6" fontWeight={600}>
                          מעלה קובץ...
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {uploadProgress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "rgba(0, 121, 107, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(45deg, #00796b, #004d40)",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Fade>
              )}

              {/* Upload Button */}
              <Zoom in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    background: "linear-gradient(45deg, #00796b, #004d40)",
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                    variant="contained"
                    size="large"
                    startIcon={isUploading ? <CircularProgress size={24} color="inherit" /> : <CloudUpload />}
                    sx={{
                      bgcolor: "white",
                      color: "#00796b",
                      borderRadius: 3,
                      px: 6,
                      py: 2,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      boxShadow: "0 8px 32px rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 40px rgba(255, 255, 255, 0.4)",
                      },
                      "&:disabled": {
                        bgcolor: "rgba(255, 255, 255, 0.7)",
                        color: "rgba(0, 121, 107, 0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isUploading ? "מעלה קובץ..." : "🚀 העלה קובץ"}
                  </Button>
                </Paper>
              </Zoom>

              {/* Tags Display */}
              {tags.length > 0 && (
                <Fade in>
                  <Card
                    elevation={0}
                    sx={{
                      background: "linear-gradient(45deg, #e8f5e8, #f1f8e9)",
                      borderRadius: 3,
                      border: "2px solid #4caf50",
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "#4caf50" }}>
                          <Tag />
                        </Avatar>
                      }
                      title="תגיות שנוצרו אוטומטית"
                      subheader="הבינה המלאכותית זיהתה את התגיות הבאות"
                    />
                    <CardContent>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            sx={{
                              bgcolor: "#4caf50",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              "&:hover": {
                                bgcolor: "#388e3c",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              )}

              {/* Message Alert */}
              {message && (
                <Fade in>
                  <Alert
                    severity={
                      message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר")
                        ? "error"
                        : "success"
                    }
                    icon={
                      message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר") ? (
                        <Error />
                      ) : (
                        <CheckCircle />
                      )
                    }
                    sx={{
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      "& .MuiAlert-icon": {
                        fontSize: "1.5rem",
                      },
                    }}
                  >
                    {message}
                  </Alert>
                </Fade>
              )}
            </Stack>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}

export default UploadDocumentImproved
