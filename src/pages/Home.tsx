


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
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-6">
        <div className="text-center space-y-8 mb-16">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl shadow-lg">
              {/* <FileText className="h-12 w-12 text-white" /> */}
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

          {/* Main Headline */}
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

          {/* CTA Buttons */}
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

        {/* Features Grid */}
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
  {/* טקסט ושכנוע */}
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

    {/* רשימת יתרונות */}
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

  {/* רקע עם אייקון או תמונה בעתיד */}
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


// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { LogoNeonHero } from "../components/logo-neon-style"
// import { Upload, Search, Shield, Zap, ArrowRight, CheckCircle, Star } from "lucide-react"

// const Home = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) setIsAuthenticated(true)
//   }, [])

//   const features = [
//     {
//       icon: <Upload className="h-8 w-8" />,
//       title: "העלאה מהירה",
//       description: "העלה מסמכים בקלות עם תמיכה בפורמטים מרובים",
//     },
//     {
//       icon: <Search className="h-8 w-8" />,
//       title: "חיפוש חכם",
//       description: "מצא את המסמכים שלך במהירות עם חיפוש מתקדם",
//     },
//     {
//       icon: <Shield className="h-8 w-8" />,
//       title: "אבטחה מלאה",
//       description: "המסמכים שלך מוגנים ברמת אבטחה גבוהה",
//     },
//     {
//       icon: <Zap className="h-8 w-8" />,
//       title: "סיווג אוטומטי",
//       description: "בינה מלאכותית מסווגת את המסמכים שלך אוטומטית",
//     },
//   ]

//   const benefits = [
//     "ניהול מסמכים מרכזי ומאורגן",
//     "גיבוי אוטומטי בענן",
//     "שיתוף מסמכים בקלות",
//     "גישה מכל מקום ובכל זמן",
//     "ממשק בעברית וידידותי למשתמש",
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       {/* Hero Section */}
//       <div className="container mx-auto px-6 py-16">
//         <div className="text-center space-y-8 mb-16">
//           {/* Neon Logo */}
//           <LogoNeonHero />

//           {/* Main Headline */}
//           <div className="space-y-4 mt-12">
//             <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
//               ניהול מסמכים חכם,
//               <br />
//               <span
//                 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
//                 style={{
//                   textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
//                 }}
//               >
//                 פשוט ובטוח
//               </span>
//             </h2>
//             <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
//               תן למערכת לדאוג למיון הקבצים שלך באופן אוטומטי עם בינה מלאכותית מתקדמת.
//               <br />
//               הירשם והתחל להשתמש במערכת המתקדמת שלנו עוד היום.
//             </p>
//           </div>

//           {/* CTA Buttons */}
//           {!isAuthenticated && (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Button
//                 asChild
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
//                 style={{
//                   boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
//                 }}
//               >
//                 <Link to="/signup">
//                   🚀 התחל עכשיו - חינם
//                   <ArrowRight className="h-5 w-5 mr-2" />
//                 </Link>
//               </Button>
//               <Button
//                 asChild
//                 variant="outline"
//                 size="lg"
//                 className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg font-bold rounded-xl"
//               >
//                 <Link to="/login">התחברות</Link>
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//           {features.map((feature, index) => (
//             <Card
//               key={index}
//               className="border-0 shadow-lg bg-slate-800/50 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group border border-slate-700"
//             >
//               <CardContent className="p-6 text-center">
//                 <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
//                   <div className="text-blue-400">{feature.icon}</div>
//                 </div>
//                 <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
//                 <p className="text-slate-400">{feature.description}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Benefits Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
//           <div className="space-y-6">
//             <div>
//               <Badge variant="secondary" className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
//                 למה לבחור ב-FileFlow?
//               </Badge>
//               <h3 className="text-3xl font-bold text-white mb-4">הפתרון המושלם לניהול המסמכים שלך</h3>
//               <p className="text-lg text-slate-400">FileFlow מציעה חוויית ניהול מסמכים מתקדמת עם טכנולוגיות חדישות</p>
//             </div>
//             <div className="space-y-3">
//               {benefits.map((benefit, index) => (
//                 <div key={index} className="flex items-center gap-3">
//                   <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
//                   <span className="text-slate-300">{benefit}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Card className="border-0 shadow-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700">
//             <CardContent className="p-8">
//               <div className="text-center space-y-6">
//                 <div className="flex justify-center gap-1 mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
//                   ))}
//                 </div>
//                 <blockquote className="text-lg italic text-slate-400">
//                   "FileFlow שינתה לחלוטין את הדרך שבה אני מנהל את המסמכים שלי. הסיווג האוטומטי חוסך לי שעות של עבודה!"
//                 </blockquote>
//                 <div className="flex items-center justify-center gap-3">
//                   <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
//                     ד
//                   </div>
//                   <div>
//                     <p className="font-semibold text-white">דני כהן</p>
//                     <p className="text-sm text-slate-500">מנהל פרויקטים</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//           <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white text-center border border-blue-500/30">
//             <CardContent className="p-8">
//               <div className="text-4xl font-bold mb-2">10,000+</div>
//               <div className="text-blue-300">מסמכים מנוהלים</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/20 to-green-600/20 text-white text-center border border-green-500/30">
//             <CardContent className="p-8">
//               <div className="text-4xl font-bold mb-2">500+</div>
//               <div className="text-green-300">משתמשים פעילים</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-white text-center border border-purple-500/30">
//             <CardContent className="p-8">
//               <div className="text-4xl font-bold mb-2">99.9%</div>
//               <div className="text-purple-300">זמינות המערכת</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Final CTA */}
//         {!isAuthenticated && (
//           <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30">
//             <CardContent className="p-12 text-center">
//               <h3 className="text-3xl font-bold mb-4">מוכן להתחיל?</h3>
//               <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
//                 הצטרף לאלפי משתמשים שכבר מנהלים את המסמכים שלהם בצורה חכמה ויעילה
//               </p>
//               <Button
//                 asChild
//                 size="lg"
//                 className="bg-white text-blue-600 hover:bg-slate-50 px-12 py-6 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
//               >
//                 <Link to="/signup">🎯 הירשם עכשיו - ללא עלות</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Home

