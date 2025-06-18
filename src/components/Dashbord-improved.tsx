
// import { useState, useEffect } from "react"
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Card,
//   CardContent,
//   Alert,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   IconButton,
//   Paper,
//   Grid,
//   Avatar,
//   Chip,
//   Fade,
//   Zoom,
//   CardHeader,
//   CardActions,
//   Divider,
//   Stack,
// } from "@mui/material"
// import {
//   Delete as DeleteIcon,
//   Visibility as VisibilityIcon,
//   Dashboard as DashboardIcon,
//   Description,
//   FolderOpen,
//   Search,
//   FilterList,
//   CalendarToday,
//   TrendingUp,
//   InsertDriveFile,
//   Category as CategoryIcon,
// } from "@mui/icons-material"

// import apiClient from "../services/apiClient"

// interface Document {
//   id: number
//   title: string
//   contentType: string
//   uploadedAt: string
//   filePath: string
//   categoryId: number
//   categoryName: string
// }

// interface Category {
//   id: number
//   name: string
// }

// const DashboardImproved = () => {
//   const [categories, setCategories] = useState<Category[]>([])
//   const [documents, setDocuments] = useState<Document[]>([])
//   const [error, setError] = useState<string | null>(null)
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [loading, setLoading] = useState<boolean>(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           setError("אין טוקן אימות. אנא התחבר מחדש.")
//           setLoading(false)
//           return
//         }

//         const categoriesResponse = await apiClient.get("/api/category", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         setCategories(categoriesResponse.data)

//         const allDocuments: Document[] = []
//         for (const category of categoriesResponse.data) {
//           try {
//             const docsResponse = await apiClient.get(`/api/documents/by-category/${category.id}`, {
//               headers: { Authorization: `Bearer ${token}` },
//             })

//             const docsWithCategory = docsResponse.data.map((doc: any) => ({
//               ...doc,
//               categoryId: category.id,
//               categoryName: category.name,
//             }))

//             allDocuments.push(...docsWithCategory)
//           } catch (docError) {
//             console.warn(`Could not load documents for category ${category.name}:`, docError)
//           }
//         }

//         setDocuments(allDocuments)
//       } catch (err: any) {
//         console.error("Error loading data:", err)
//         setError(`שגיאה בטעינת נתונים: ${err.message || "נסה שוב מאוחר יותר."}`)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const deleteDocument = async (documentId: number) => {
//     if (!window.confirm("האם אתה בטוח שברצונך למחוק מסמך זה?")) {
//       return
//     }
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         setError("אין טוקן אימות. אנא התחבר מחדש.")
//         return
//       }

//       const response = await apiClient.delete(`/api/documents/${documentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (response.status === 200 || response.status === 204) {
//         setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId))
//         setError(null)
//       } else {
//         setError("שגיאה במחיקת המסמך.")
//       }
//     } catch (err) {
//       console.error("Error deleting document:", err)
//       setError("שגיאה במחיקת המסמך.")
//     }
//   }

//   const filteredDocuments = documents.filter((doc) => {
//     const matchesCategory = selectedCategoryId === "all" || doc.categoryId === selectedCategoryId
//     const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesCategory && matchesSearch
//   })

//   const getFileIcon = (contentType: string) => {
//     if (contentType.includes("pdf")) return "📄"
//     if (contentType.includes("image")) return "🖼️"
//     if (contentType.includes("word")) return "📝"
//     if (contentType.includes("excel")) return "📊"
//     return "📁"
//   }

//   const getFileColor = (contentType: string) => {
//     if (contentType.includes("pdf")) return "#f44336"
//     if (contentType.includes("image")) return "#ff9800"
//     if (contentType.includes("word")) return "#2196f3"
//     if (contentType.includes("excel")) return "#4caf50"
//     return "#9e9e9e"
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         py: 4,
//         px: 2,
//       }}
//     >
//       <Container maxWidth="xl">
//         <Fade in timeout={800}>
//           <Box>
//             {/* Header */}
//             <Paper
//               elevation={0}
//               sx={{
//                 background: "rgba(255, 255, 255, 0.95)",
//                 backdropFilter: "blur(20px)",
//                 borderRadius: 4,
//                 p: 4,
//                 mb: 4,
//                 textAlign: "center",
//                 border: "1px solid rgba(255, 255, 255, 0.2)",
//               }}
//             >
//               <Avatar
//                 sx={{
//                   width: 80,
//                   height: 80,
//                   mx: "auto",
//                   mb: 2,
//                   background: "linear-gradient(45deg, #00796b, #004d40)",
//                 }}
//               >
//                 <DashboardIcon sx={{ fontSize: 40 }} />
//               </Avatar>
//               <Typography
//                 variant="h3"
//                 sx={{
//                   fontWeight: 800,
//                   background: "linear-gradient(45deg, #00796b, #004d40)",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   mb: 1,
//                 }}
//               >
//                 לוח מחוונים
//               </Typography>
//               <Typography variant="h6" color="text.secondary">
//                 ניהול וצפייה במסמכים שלך במקום אחד
//               </Typography>
//             </Paper>

//             {/* Stats Cards */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               <Grid item xs={12} md={4}>
//                 <Zoom in timeout={600}>
//                   <Card
//                     elevation={0}
//                     sx={{
//                       background: "linear-gradient(45deg, #2196f3, #1976d2)",
//                       color: "white",
//                       borderRadius: 3,
//                       height: "100%",
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 4 }}>
//                       <Avatar
//                         sx={{
//                           width: 60,
//                           height: 60,
//                           mx: "auto",
//                           mb: 2,
//                           bgcolor: "rgba(255, 255, 255, 0.2)",
//                         }}
//                       >
//                         <InsertDriveFile sx={{ fontSize: 30 }} />
//                       </Avatar>
//                       <Typography variant="h3" fontWeight={700}>
//                         {documents.length}
//                       </Typography>
//                       <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                         סך המסמכים
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Zoom>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <Zoom in timeout={800}>
//                   <Card
//                     elevation={0}
//                     sx={{
//                       background: "linear-gradient(45deg, #4caf50, #388e3c)",
//                       color: "white",
//                       borderRadius: 3,
//                       height: "100%",
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 4 }}>
//                       <Avatar
//                         sx={{
//                           width: 60,
//                           height: 60,
//                           mx: "auto",
//                           mb: 2,
//                           bgcolor: "rgba(255, 255, 255, 0.2)",
//                         }}
//                       >
//                         <CategoryIcon sx={{ fontSize: 30 }} />
//                       </Avatar>
//                       <Typography variant="h3" fontWeight={700}>
//                         {categories.length}
//                       </Typography>
//                       <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                         קטגוריות
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Zoom>
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <Zoom in timeout={1000}>
//                   <Card
//                     elevation={0}
//                     sx={{
//                       background: "linear-gradient(45deg, #ff9800, #f57c00)",
//                       color: "white",
//                       borderRadius: 3,
//                       height: "100%",
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 4 }}>
//                       <Avatar
//                         sx={{
//                           width: 60,
//                           height: 60,
//                           mx: "auto",
//                           mb: 2,
//                           bgcolor: "rgba(255, 255, 255, 0.2)",
//                         }}
//                       >
//                         <TrendingUp sx={{ fontSize: 30 }} />
//                       </Avatar>
//                       <Typography variant="h3" fontWeight={700}>
//                         {filteredDocuments.length}
//                       </Typography>
//                       <Typography variant="h6" sx={{ opacity: 0.9 }}>
//                         מסמכים מסוננים
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Zoom>
//               </Grid>
//             </Grid>

//             {error && (
//               <Fade in>
//                 <Alert
//                   severity="error"
//                   sx={{
//                     mb: 3,
//                     borderRadius: 3,
//                     fontSize: "1.1rem",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {error}
//                 </Alert>
//               </Fade>
//             )}

//             {/* Filters */}
//             <Zoom in timeout={1200}>
//               <Card
//                 elevation={0}
//                 sx={{
//                   background: "rgba(255, 255, 255, 0.95)",
//                   backdropFilter: "blur(20px)",
//                   borderRadius: 3,
//                   border: "1px solid rgba(255, 255, 255, 0.2)",
//                   mb: 4,
//                 }}
//               >
//                 <CardHeader
//                   avatar={
//                     <Avatar sx={{ bgcolor: "#9c27b0" }}>
//                       <Search />
//                     </Avatar>
//                   }
//                   title="חיפוש וסינון"
//                   subheader="מצא את המסמכים שלך במהירות"
//                 />
//                 <CardContent>
//                   <Grid container spacing={3}>
//                     <Grid item xs={12} md={8}>
//                       <TextField
//                         fullWidth
//                         label="חפש לפי שם מסמך"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         InputProps={{
//                           startAdornment: <Search sx={{ mr: 1, color: "#9c27b0" }} />,
//                         }}
//                         sx={{
//                           "& label.Mui-focused": { color: "#9c27b0" },
//                           "& .MuiOutlinedInput-root": {
//                             borderRadius: 2,
//                             "& fieldset": { borderColor: "#9c27b0", borderWidth: 2 },
//                             "&:hover fieldset": { borderColor: "#7b1fa2" },
//                             "&.Mui-focused fieldset": { borderColor: "#7b1fa2" },
//                           },
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={4}>
//                       <FormControl fullWidth>
//                         <InputLabel
//                           sx={{
//                             color: "#9c27b0",
//                             "&.Mui-focused": { color: "#7b1fa2" },
//                           }}
//                         >
//                           סנן לפי קטגוריה
//                         </InputLabel>
//                         <Select
//                           value={selectedCategoryId.toString()}
//                           onChange={(value) => setSelectedCategoryId(value === "all" ? "all" : Number(value))}
//                           label="סנן לפי קטגוריה"
//                           sx={{
//                             borderRadius: 2,
//                             "& .MuiOutlinedInput-root": {
//                               "& fieldset": { borderColor: "#9c27b0", borderWidth: 2 },
//                               "&:hover fieldset": { borderColor: "#7b1fa2" },
//                               "&.Mui-focused fieldset": { borderColor: "#7b1fa2" },
//                             },
//                           }}
//                         >
//                           <MenuItem value="all">
//                             <Box display="flex" alignItems="center" gap={1}>
//                               <FilterList sx={{ fontSize: 20 }} />
//                               הצג הכל
//                             </Box>
//                           </MenuItem>
//                           {categories.map((category) => (
//                             <MenuItem key={category.id} value={category.id.toString()}>
//                               <Box display="flex" alignItems="center" gap={1}>
//                                 <FolderOpen sx={{ fontSize: 20, color: "#ff9800" }} />
//                                 {category.name}
//                               </Box>
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Zoom>

//             {/* Documents Grid */}
//             {loading ? (
//               <Grid container spacing={3}>
//                 {[...Array(6)].map((_, i) => (
//                   <Grid item xs={12} sm={6} lg={4} key={i}>
//                     <Card
//                       elevation={0}
//                       sx={{
//                         background: "rgba(255, 255, 255, 0.95)",
//                         backdropFilter: "blur(20px)",
//                         borderRadius: 3,
//                         border: "1px solid rgba(255, 255, 255, 0.2)",
//                         height: 200,
//                       }}
//                     >
//                       <CardContent sx={{ textAlign: "center", py: 4 }}>
//                         <CircularProgress sx={{ color: "#00796b" }} />
//                         <Typography variant="h6" sx={{ mt: 2 }}>
//                           טוען מסמכים...
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : filteredDocuments.length === 0 ? (
//               <Fade in>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     background: "rgba(255, 255, 255, 0.95)",
//                     backdropFilter: "blur(20px)",
//                     borderRadius: 3,
//                     border: "1px solid rgba(255, 255, 255, 0.2)",
//                     textAlign: "center",
//                     py: 8,
//                   }}
//                 >
//                   <CardContent>
//                     <Description sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
//                     <Typography variant="h4" fontWeight={600} color="text.secondary" gutterBottom>
//                       אין מסמכים להצגה
//                     </Typography>
//                     <Typography variant="h6" color="text.secondary">
//                       לא נמצאו מסמכים התואמים לחיפוש או הסינון הנוכחי
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Fade>
//             ) : (
//               <Grid container spacing={3}>
//                 {filteredDocuments.map((doc, index) => (
//                   <Grid item xs={12} sm={6} lg={4} key={doc.id}>
//                     <Zoom in timeout={600 + index * 100}>
//                       <Card
//                         elevation={0}
//                         sx={{
//                           background: "rgba(255, 255, 255, 0.95)",
//                           backdropFilter: "blur(20px)",
//                           borderRadius: 3,
//                           border: "1px solid rgba(255, 255, 255, 0.2)",
//                           height: "100%",
//                           display: "flex",
//                           flexDirection: "column",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-8px)",
//                             boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
//                           },
//                         }}
//                       >
//                         <CardHeader
//                           avatar={
//                             <Avatar sx={{ bgcolor: getFileColor(doc.contentType) }}>
//                               <Typography variant="h6">{getFileIcon(doc.contentType)}</Typography>
//                             </Avatar>
//                           }
//                           title={
//                             <Typography variant="h6" fontWeight={600} noWrap>
//                               {doc.title}
//                             </Typography>
//                           }
//                           subheader={
//                             <Stack spacing={1} sx={{ mt: 1 }}>
//                               <Chip
//                                 label={doc.categoryName}
//                                 size="small"
//                                 sx={{
//                                   bgcolor: "#e3f2fd",
//                                   color: "#1976d2",
//                                   fontWeight: 600,
//                                   width: "fit-content",
//                                 }}
//                               />
//                               <Box display="flex" alignItems="center" gap={1}>
//                                 <CalendarToday sx={{ fontSize: 16, color: "#666" }} />
//                                 <Typography variant="body2" color="text.secondary">
//                                   {new Date(doc.uploadedAt).toLocaleDateString("he-IL")}
//                                 </Typography>
//                               </Box>
//                             </Stack>
//                           }
//                         />
//                         <Divider />
//                         <CardActions sx={{ mt: "auto", p: 2, gap: 1 }}>
//                           <Button
//                             variant="contained"
//                             startIcon={<VisibilityIcon />}
//                             href={`https://user-files-fileflow.s3.amazonaws.com/${doc.filePath}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             sx={{
//                               flex: 1,
//                               background: "linear-gradient(45deg, #00796b, #004d40)",
//                               borderRadius: 2,
//                               fontWeight: 600,
//                               "&:hover": {
//                                 background: "linear-gradient(45deg, #004d40, #00251a)",
//                               },
//                             }}
//                           >
//                             צפייה
//                           </Button>
//                           <IconButton
//                             color="error"
//                             onClick={() => deleteDocument(doc.id)}
//                             sx={{
//                               bgcolor: "#ffebee",
//                               "&:hover": { bgcolor: "#ffcdd2" },
//                             }}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </CardActions>
//                       </Card>
//                     </Zoom>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}
//           </Box>
//         </Fade>
//       </Container>
//     </Box>
//   )
// }

// export default DashboardImproved
