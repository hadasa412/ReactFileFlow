
import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CloudUpload, FolderPlus, Bot, FileText, Plus, Tag, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface Category {
  id: number
  name: string
}

const UploadDocumentRedesigned = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">העלאת מס!מך</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">העלה מסמכים חדשים למערכת בקלות</p>
        </div>

        {/* File Upload Card */}
        <Card className="border-2 border-primary/20">
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
              <div className="border-2 border-dashed border-primary/40 rounded-lg p-8 text-center hover:bg-primary/5 transition-colors cursor-pointer">
                <Input id="file-input" type="file" onChange={handleFileChange} className="hidden" />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <CloudUpload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800 dark:text-slate-200">גרור קובץ לכאן או לחץ לבחירה</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">תומך בכל סוגי הקבצים עד 10MB</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {file && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-200">{file.name}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{formatFileSize(file.size)}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              קטגוריה
            </CardTitle>
            <CardDescription>בחר קטגוריה קיימת או צור חדשה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>בחר קטגוריה</Label>
              <Select
                value={categoryId?.toString() || ""}
                onValueChange={(value) => setCategoryId(value ? Number(value) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר קטגוריה (אופציונלי)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ללא קטגוריה</SelectItem>
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
                  {isAddingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Tagging */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              תיוג אוטומטי
            </CardTitle>
            <CardDescription>השתמש בבינה מלאכותית לתיוג אוטומטי של המסמך</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox id="auto-tag" checked={autoTag} onCheckedChange={(checked) => setAutoTag(!!checked)} />
              <Label htmlFor="auto-tag">הפעל תיוג אוטומטי למסמך</Label>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isUploading && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    מעלה קובץ...
                  </span>
                  <span className="text-sm text-slate-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        <Button onClick={handleUpload} disabled={isUploading || !file} className="w-full py-6 text-lg font-bold">
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin ml-2" />
              מעלה קובץ...
            </>
          ) : (
            <>
              <CloudUpload className="h-5 w-5 ml-2" />
              העלה קובץ
            </>
          )}
        </Button>

        {/* Tags Display */}
        {tags.length > 0 && (
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
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

        {/* Message Alert */}
        {message && (
          <Alert
            variant={
              message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר")
                ? "destructive"
                : "default"
            }
            className={
              message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר")
                ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
            }
          >
            {message.includes("שגיאה") || message.includes("בחר קובץ") || message.includes("התחבר") ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default UploadDocumentRedesigned
