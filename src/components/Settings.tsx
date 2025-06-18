
import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Moon, Sun, Bot } from "lucide-react"

interface SettingsProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const Settings: React.FC<SettingsProps> = ({ darkMode, setDarkMode }) => {
  const [autoClassify, setAutoClassify] = useState<boolean>(false)

  useEffect(() => {
    const savedAutoClassify = localStorage.getItem("autoClassify") === "true"
    setAutoClassify(savedAutoClassify)
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem("darkMode", darkMode.toString())
    localStorage.setItem("autoClassify", autoClassify.toString())
    alert("ההגדרות נשמרו בהצלחה!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full">
              <SettingsIcon className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">הגדרות אישיות</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">התאם את המערכת לצרכים שלך</p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Dark Mode Setting */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
                <CardTitle className="text-right">מצב כהה</CardTitle>
              </div>
              <CardDescription className="text-right">החלף בין מצב בהיר לכהה לחוויית צפייה נוחה יותר</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-teal-600" />
                <Label className="text-sm font-medium">{darkMode ? "מצב כהה פעיל" : "מצב בהיר פעיל"}</Label>
              </div>
            </CardContent>
          </Card>

          {/* Auto Classification Setting */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-right">סיווג אוטומטי</CardTitle>
              </div>
              <CardDescription className="text-right">הפעל בינה מלאכותית לסיווג אוטומטי של המסמכים שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Switch
                  checked={autoClassify}
                  onCheckedChange={setAutoClassify}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label className="text-sm font-medium">{autoClassify ? "סיווג אוטומטי פעיל" : "סיווג ידני"}</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <Button
              onClick={handleSaveSettings}
              className="w-full bg-white text-teal-600 hover:bg-slate-50 font-bold text-lg py-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              💾 שמור הגדרות
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              💡 השינויים יישמרו באופן מקומי ויחולו על כל הפעלות המערכת הבאות
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
