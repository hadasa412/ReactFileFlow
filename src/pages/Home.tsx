


import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {  Upload, Search, Shield, Zap, ArrowRight, CheckCircle, Star, FolderOpen } from "lucide-react"

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsAuthenticated(true)
  }, [])

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "העלאה מהירה",
      description: "העלה מסמכים בקלות עם תמיכה בפורמטים מרובים",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "חיפוש חכם",
      description: "מצא את המסמכים שלך במהירות עם חיפוש מתקדם",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "אבטחה מלאה",
      description: "המסמכים שלך מוגנים ברמת אבטחה גבוהה",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "סיווג אוטומטי",
      description: "בינה מלאכותית מסווגת את המסמכים שלך אוטומטית",
    },
  ]

  const benefits = [
    "ניהול מסמכים מרכזי ומאורגן",
    "גיבוי אוטומטי בענן",
    "שיתוף מסמכים בקלות",
    "גישה מכל מקום ובכל זמן",
    "ממשק בעברית וידידותי למשתמש",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-6">
        <div className="text-center space-y-8 mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl shadow-lg">
              <FolderOpen className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                FileFlow
              </h1>
              <Badge variant="secondary" className="mt-2">
                מערכת ניהול מסמכים מתקדמת
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              ניהול מסמכים חכם,
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                פשוט ובטוח
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              תן למערכת לדאוג למיון הקבצים שלך באופן אוטומטי עם בינה מלאכותית מתקדמת.
              <br />
              הירשם והתחל להשתמש במערכת המתקדמת שלנו עוד היום.
            </p>
          </div>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <a href="/signup" className="flex items-center">
                  התחל עכשיו - חינם
                  <ArrowRight className="h-5 w-5 mr-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-bold rounded-xl"
              >
                <a href="/login">התחברות</a>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group"
            >
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-teal-600 dark:text-teal-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
  <div className="space-y-6">
  <Badge
    variant="secondary"
    className="mb-4 text-lg px-4 py-2 rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 w-fit shadow-md"
  >
    למה לבחור ב־FileFlow?
  </Badge>
    <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
      הפתרון המושלם לניהול המסמכים שלך
    </h3>
    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
      FileFlow מציעה חוויית ניהול מתקדמת בשילוב טכנולוגיות חדשניות,
      כדי שתוכל להתמקד בעיקר – ולא בניירת.
    </p>

    <div className="space-y-3">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="flex items-center gap-3 text-lg text-slate-700 dark:text-slate-300"
        >
          <CheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  </div>

  <div className="hidden lg:flex justify-center">
    <div className="p-10 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-3xl shadow-xl w-full max-w-md text-center">
      <Star className="h-12 w-12 text-teal-600 dark:text-teal-300 mx-auto mb-6" />
      <p className="text-lg text-slate-700 dark:text-slate-200 font-semibold">
      הצטרף כבר היום למהפכת ניהול המסמכים
      </p>
      <Button
          asChild
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-xl font-bold shadow"
        >
          <a href="/signup">התחל עכשיו</a>
        </Button>
    </div>
  </div>
</div>


      </div>
    </div>
  )
}

export default Home

