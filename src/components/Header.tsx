import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart,
  FileText,
  Upload,
  Search,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  Home,
  FolderOpen,
  User,
  ChevronRight,
} from "lucide-react"

interface HeaderProps {
  drawerWidth: number
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  userName: string | null
  userEmail: string | null
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, isAuthenticated, setIsAuthenticated, userName, userEmail }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    setIsAuthenticated(false)
    navigate("/")
    setIsOpen(false)
  }

  const menuItems = isAuthenticated
    ? [
        { icon: BarChart, label: "לוח מחוונים", href: "/dashboard", active: true },
        { icon: FileText, label: "המסמכים שלי", href: "/my-documents" },
        { icon: Upload, label: "העלאת מסמך", href: "/upload" },
        { icon: FolderOpen, label: "קטגוריות", href: "/categories" },
        { icon: Search, label: "חיפוש", href: "/search" },
        { icon: Settings, label: "הגדרות", href: "/settings" },
      ]
    : [
        { icon: Home, label: "עמוד הבית", href: "/" },
        { icon: LogIn, label: "התחברות", href: "/login" },
        { icon: UserPlus, label: "הרשמה", href: "/signup" },
      ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-gradient-to-r from-teal-600/20 to-blue-600/20 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FileFlow</h1>
            <p className="text-xs text-slate-300">ניהול מסמכים חכם</p>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-teal-400/50 shadow-lg">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName || "אורח"}</p>
              <p className="text-xs text-slate-300 truncate">{userEmail || "אין מייל"}</p>
              <Badge variant="secondary" className="mt-1 bg-teal-500/20 text-teal-300 border-teal-500/30">
                <User className="h-3 w-3 ml-1" />
                משתמש פעיל
              </Badge>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.href} onClick={() => setIsOpen(false)}>
              <div
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-blue-500/20 hover:shadow-lg ${item.active ? "bg-gradient-to-r from-teal-500/30 to-blue-500/30 text-white shadow-lg border border-teal-500/30" : "text-slate-300 hover:text-white"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${item.active ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md" : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white"}`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${item.active ? "text-teal-300" : "text-slate-500 group-hover:text-slate-300"}`}
                />
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {isAuthenticated && (
        <div className="border-t border-slate-700/50 p-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 hover:from-red-500/30 hover:to-red-600/30 hover:text-white transition-all duration-200"
          >
            <LogOut className="h-4 w-4 ml-2" />
            התנתקות
          </Button>
        </div>
      )}

      <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 p-4">
        <div className="text-center">
          <p className="text-xs text-slate-400">FileFlow</p>
          <p className="text-xs text-slate-500">© 2025 כל הזכויות שמורות</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-blue-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">FileFlow</h1>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700/50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 border-slate-700">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden lg:block fixed right-0 top-0 h-screen z-40 shadow-2xl" style={{ width: `${drawerWidth}px` }}>
        <SidebarContent />
      </div>

      <div className="lg:hidden h-16" />
    </>
  )
}

export default Header
