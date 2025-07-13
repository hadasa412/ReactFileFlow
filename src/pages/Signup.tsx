import { useState } from "react"
import { useNavigate } from "react-router-dom"
import jwtDecode from "jwt-decode"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, UserPlus } from "lucide-react"

interface DecodedToken {
  exp: number
  iss: string
  aud: string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string
}

const Signup = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות")
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserName: username,
          Email: email,
          Password: password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "הרשמה נכשלה.")
      }
      const data = await response.json()
      const token = data.token

      const decodedToken = jwtDecode<DecodedToken>(token)
      const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      const userEmail = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email

      if (!userName) {
        setError("שם משתמש לא נמצא בפרטי ההרשמה.")
        return
      }

      localStorage.setItem("token", token)
      localStorage.setItem("userName", userName)
      localStorage.setItem("userEmail", userEmail)

      setIsAuthenticated(true)
      navigate("/dashboard")
    } catch (err: any) {
      setError(`הרשמה נכשלה: ${err.message || "נסה שוב."}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full">
              <UserPlus className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            הרשמה למערכת
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            צור חשבון חדש כדי להתחיל להשתמש במערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="username">שם משתמש</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-2 rounded-xl"
            >
              הירשם
            </Button>
          </form>
          {error && (
            <Alert className="mt-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
