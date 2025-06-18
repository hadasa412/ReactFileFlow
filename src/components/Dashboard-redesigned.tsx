
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart,
    FileText,
    FolderOpen,
    Search,
    Filter,
    Eye,
    Trash2,
    Calendar,
    AlertCircle,
    Loader2,
} from "lucide-react"
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

const DashboardRedesigned = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [documents, setDocuments] = useState<Document[]>([])
    const [error, setError] = useState<string | null>(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState<boolean>(true)
    const [view, setView] = useState<"grid" | "list">("grid")

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
    const getSignedUrl = async (filePath: string): Promise<string | null> => {
        try {
          const token = localStorage.getItem("token")
          if (!token) {
            setError("אין טוקן התחברות. אנא התחבר מחדש.")
            return null
          }
      
          console.log("Requesting signed URL for:", filePath); // דיבוג
      
          const response = await apiClient.get(`/api/documents/presigned-url`, {
            params: { filePath: filePath }, // שינוי בדרך שליחת הפרמטר
            headers: { Authorization: `Bearer ${token}` },
          })
      
          console.log("Response:", response.data); // דיבוג
          
          // ודא שאתה מחזיר את ה-URL הנכון:
          return response.data.url || response.data
        } catch (err: any) {
          console.error("Failed to get signed URL", err)
          console.error("Error details:", err.response?.data) // דיבוג נוסף
          setError("שגיאה בקבלת הקישור לקובץ")
          return null
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

    const getFileIcon = (contentType: string) => {
        if (contentType.includes("pdf")) return "📄"
        if (contentType.includes("image")) return "🖼️"
        if (contentType.includes("word")) return "📝"
        if (contentType.includes("excel")) return "📊"
        return "📁"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-0 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <BarChart className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">לוח מחוונים</h1>
                            <p className="text-slate-600 dark:text-slate-400">ניהול וצפייה במסמכים שלך</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
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

                        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
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

                        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
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
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Filters */}
                <Card className="mb-6 border-2 border-primary/20">
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
                                    className="w-full"
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

                {/* View Toggle */}
                <div className="mb-6">
                    <Tabs defaultValue="grid" value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
                        <TabsList className="grid w-[200px] grid-cols-2">
                            <TabsTrigger value="grid">תצוגת רשת</TabsTrigger>
                            <TabsTrigger value="list">תצוגת רשימה</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Documents Grid/List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-xl font-medium text-slate-600 dark:text-slate-400">טוען מסמכים...</p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <Card className="text-center py-12 border-2 border-primary/20">
                        <CardContent>
                            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">אין מסמכים להצגה</h3>
                            <p className="text-slate-500 dark:text-slate-500">לא נמצאו מסמכים התואמים לחיפוש או הסינון הנוכחי</p>
                        </CardContent>
                    </Card>
                ) : view === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocuments.map((doc) => (
                            <Card key={doc.id} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                <span>{getFileIcon(doc.contentType)}</span>
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
                                <CardFooter className="pt-0 flex gap-2">
                                    <Button
                                        className="flex-1"
                                        variant="default"
                                        onClick={async () => {
                                            const signedUrl = await getSignedUrl(doc.filePath)
                                            if (signedUrl) {
                                                window.open(signedUrl, "_blank")
                                            }
                                        }}
                                    >
                                        <Eye className="h-4 w-4 ml-2" />
                                        צפייה
                                    </Button>

                                    <Button variant="destructive" size="icon" onClick={() => deleteDocument(doc.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDocuments.map((doc) => (
                            <Card key={doc.id} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl">{getFileIcon(doc.contentType)}</div>
                                        <div>
                                            <h3 className="font-bold">{doc.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <Badge variant="secondary">{doc.categoryName}</Badge>
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(doc.uploadedAt).toLocaleDateString("he-IL")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            variant="default"
                                            onClick={async () => {
                                                const signedUrl = await getSignedUrl(doc.filePath)
                                                if (signedUrl) {
                                                    window.open(signedUrl, "_blank")
                                                }
                                            }}
                                        >
                                            <Eye className="h-4 w-4 ml-2" />
                                            צפייה
                                        </Button>

                                        <Button variant="destructive" size="sm" onClick={() => deleteDocument(doc.id)}>
                                            <Trash2 className="h-4 w-4 ml-1" />
                                            מחק
                                        </Button>
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

export default DashboardRedesigned
