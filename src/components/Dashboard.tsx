import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Search, Filter, Eye, Trash2,Download, Calendar, FolderOpen, AlertCircle, BarChart3 } from "lucide-react"
import apiClient from "../services/apiClient"

interface Document {
  id: number
  title: string
  contentType: string
  uploadedAt: string
  filePath: string
  categoryId: number
  categoryName: string
}

interface Category {
  id: number
  name: string
}

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("אין טוקן אימות. אנא התחבר מחדש.")
          setLoading(false)
          return
        }

        const categoriesResponse = await apiClient.get("/api/category", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCategories(categoriesResponse.data)

        const allDocuments: Document[] = []
        for (const category of categoriesResponse.data) {
          try {
            const docsResponse = await apiClient.get(`/api/documents/by-category/${category.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            const docsWithCategory = docsResponse.data.map((doc: any) => ({
              ...doc,
              categoryId: category.id,
              categoryName: category.name,
            }))

            allDocuments.push(...docsWithCategory)
          } catch (docError) {
            console.warn(`Could not load documents for category ${category.name}:`, docError)
          }
        }

        setDocuments(allDocuments)
      } catch (err: any) {
        console.error("Error loading data:", err)
        setError(`שגיאה בטעינת נתונים: ${err.message || "נסה שוב מאוחר יותר."}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🔧 פונקציה לקבלת קישור הורדה - מתוקנת
const getDownloadUrl = async (filePath: string): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("אין טוקן אימות. אנא התחבר מחדש.")
      return null
    }

    console.log("🔧 Requesting download URL for filePath:", filePath);

    // 🔧 שימוש ב-path parameter במקום query parameter
// const response = await apiClient.get(`/api/documents/download-url/${encodeURIComponent(filePath)}`, {
//   headers: { Authorization: `Bearer ${token}` },
// })
const response = await apiClient.get(`/api/documents/download-url?fileName=${encodeURIComponent(filePath)}`, {
  headers: { Authorization: `Bearer ${token}` },
})

  
    
    console.log("🔧 Response:", response.data);
    return response.data.downloadUrl
  } catch (err: any) {
    console.error("🔧 Failed to get download URL", err)
    console.error("🔧 Error details:", err.response?.data);
    setError("שגיאה בקבלת הקישור לקובץ")
    return null
  }
}
const handleDownloadDocument = async (doc: Document) => {
  try {
    // השתמש באותה פונקציה כמו צפייה
    const downloadUrl = await getDownloadUrl(doc.filePath)
    if (downloadUrl) {
      // השתמש ב-fetch להורדה
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      
      // יצור URL זמני לblob
      const blobUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = doc.title
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // נקה את ה-URL הזמני
      URL.revokeObjectURL(blobUrl)
    }
  } catch (error) {
    console.error('Error downloading file:', error)
    setError('שגיאה בהורדת הקובץ')
  }
}
  // 🔧 פונקציה לטיפול בצפייה במסמך - מתוקנת
  const handleViewDocument = async (doc: Document) => {
    const downloadUrl = await getDownloadUrl(doc.filePath) // שימוש ב-filePath במקום title
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
    }
  }

  const deleteDocument = async (documentId: number) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק מסמך זה?")) {
      return
    }
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("אין טוקן אימות. אנא התחבר מחדש.")
        return
      }

      const response = await apiClient.delete(`/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200 || response.status === 204) {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId))
        setError(null)
      } else {
        setError("שגיאה במחיקת המסמך.")
      }
    } catch (err) {
      console.error("Error deleting document:", err)
      setError("שגיאה במחיקת המסמך.")
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategoryId === "all" || doc.categoryId === selectedCategoryId
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getFileTypeIcon = (contentType: string) => {
    if (contentType.includes("pdf")) return "📄"
    if (contentType.includes("image")) return "🖼️"
    if (contentType.includes("word")) return "📝"
    if (contentType.includes("excel")) return "📊"
    return "📁"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-0 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full">
              <BarChart3 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">לוח מחוונים</h1>
              <p className="text-slate-600 dark:text-slate-400">ניהול וצפייה במסמכים שלך</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">סך המסמכים</p>
                    <p className="text-3xl font-bold">{documents.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">קטגוריות</p>
                    <p className="text-3xl font-bold">{categories.length}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">מסמכים מסוננים</p>
                    <p className="text-3xl font-bold">{filteredDocuments.length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              חיפוש וסינון
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="חפש לפי שם מסמך..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-right"
                />
              </div>
              <div className="md:w-64">
                <Select
                  value={selectedCategoryId.toString()}
                  onValueChange={(value) => setSelectedCategoryId(value === "all" ? "all" : Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הצג הכל</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">אין מסמכים להצגה</h3>
              <p className="text-slate-500 dark:text-slate-500">לא נמצאו מסמכים התואמים לחיפוש או הסינון הנוכחי</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 transition-colors">
                        <span className="ml-2">{getFileTypeIcon(doc.contentType)}</span>
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        <Badge variant="secondary" className="mb-2">
                          {doc.categoryName}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(doc.uploadedAt).toLocaleDateString("he-IL")}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
<CardContent className="pt-0">
  <div className="space-y-2">
    <Button 
      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
      onClick={() => handleViewDocument(doc)}
    >
      <Eye className="h-4 w-4 ml-2" />
      צפייה במסמך
    </Button>
    <Button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      onClick={() => handleDownloadDocument(doc)}
    >
      <Download className="h-4 w-4 ml-2" />
      הורד מסמך
    </Button>
    <button 
      onClick={() => deleteDocument(doc.id)}
      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      מחק מסמך
    </button>
  </div>
</CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
