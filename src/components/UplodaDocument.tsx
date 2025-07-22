
import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, FolderPlus, Bot, CheckCircle, AlertCircle, Loader2, Tag } from "lucide-react"

interface Category {
  id: number
  name: string
}

const UploadDocument: React.FC = () => {
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">העלאת מסמך</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">העלה מסמכים חדשים למערכת בקלות</p>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              בחירת קובץ
            </CardTitle>
            <CardDescription>בחר את הקובץ שברצונך להעלות למערכת</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">קובץ להעלאה</Label>
              <div className="relative">
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {file && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file)}</span>
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">{file.name}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              קטגוריה
            </CardTitle>
            <CardDescription>בחר קטגוריה קיימת או צור חדשה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>בחר קטגוריה</Label>
              <Select
                value={categoryId?.toString() || ""}
                onValueChange={(value) => setCategoryId(value ? Number(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה (אופציונלי)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">ללא קטגוריה</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>הוסף קטגוריה חדשה</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="שם קטגוריה חדשה"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddCategory} disabled={isAddingCategory} variant="outline">
                  {isAddingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              תיוג אוטומטי
            </CardTitle>
            <CardDescription>השתמש בבינה מלאכותית לתיוג אוטומטי של המסמך</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
            <Checkbox id="auto-tag" checked={autoTag} onCheckedChange={(checked) => setAutoTag(Boolean(checked))}/>
              <Label
                htmlFor="auto-tag"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                הפעל תיוג אוטומטי למסמך
              </Label>
            </div>
          </CardContent>
        </Card>

        {isUploading && (
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">מעלה קובץ...</span>
                  <span className="text-sm text-slate-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <Button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="w-full bg-white text-blue-600 hover:bg-slate-50 font-bold text-lg py-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin ml-2" />
                  מעלה קובץ...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 ml-2" />
                  העלה קובץ
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {tags.length > 0 && (
          <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Tag className="h-5 w-5" />
                תגיות שנוצרו אוטומטית
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {message && (
          <Alert
            className={`border-0 shadow-lg ${
              message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר")
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            }`}
          >
            {message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר") ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription
              className={
                message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר")
                  ? "text-red-800 dark:text-red-200"
                  : "text-green-800 dark:text-green-200"
              }
            >
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default UploadDocument
