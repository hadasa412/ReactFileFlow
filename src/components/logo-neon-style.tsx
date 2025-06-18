
import { FileText } from "lucide-react"

interface LogoNeonStyleProps {
  size?: "sm" | "md" | "lg"
  showSubtitle?: boolean
}

export const LogoNeonStyle = ({ size = "md", showSubtitle = true }: LogoNeonStyleProps) => {
  const sizes = {
    sm: {
      container: "gap-2",
      icon: "h-6 w-6",
      title: "text-lg",
      subtitle: "text-xs",
      iconContainer: "h-8 w-8",
    },
    md: {
      container: "gap-3",
      icon: "h-8 w-8",
      title: "text-2xl",
      subtitle: "text-sm",
      iconContainer: "h-12 w-12",
    },
    lg: {
      container: "gap-4",
      icon: "h-12 w-12",
      title: "text-4xl",
      subtitle: "text-base",
      iconContainer: "h-16 w-16",
    },
  }

  return (
    <div className={`flex items-center ${sizes[size].container}`}>
      {/* Icon with Neon Effect */}
      <div className={`${sizes[size].iconContainer} relative flex items-center justify-center`}>
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-md animate-pulse"></div>
        {/* Inner Glow */}
        <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-sm"></div>
        {/* Icon Container */}
        <div className="relative bg-slate-900 rounded-lg border border-blue-400/50 flex items-center justify-center w-full h-full">
          <FileText
            className={`${sizes[size].icon} text-blue-400`}
            style={{
              filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 16px rgba(147, 51, 234, 0.4))",
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        {/* Main Title with Neon Effect */}
        <h1
          className={`${sizes[size].title} font-bold text-white tracking-wide`}
          style={{
            textShadow: `
              0 0 5px rgba(59, 130, 246, 0.8),
              0 0 10px rgba(59, 130, 246, 0.6),
              0 0 15px rgba(59, 130, 246, 0.4),
              0 0 20px rgba(147, 51, 234, 0.3)
            `,
          }}
        >
          FileFlow
        </h1>

        {/* Subtitle */}
        {showSubtitle && (
          <p
            className={`${sizes[size].subtitle} text-slate-300 tracking-wider`}
            style={{
              textShadow: "0 0 3px rgba(59, 130, 246, 0.5)",
            }}
          >
            ניהול מסמכים חכם
          </p>
        )}
      </div>
    </div>
  )
}

// לוגו עם רקע כהה מלא (לשימוש בדפים בהירים)
export const LogoNeonWithBackground = ({ size = "md", showSubtitle = true }: LogoNeonStyleProps) => {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
      <LogoNeonStyle size={size} showSubtitle={showSubtitle} />
    </div>
  )
}

// לוגו מרכזי לדפי נחיתה
export const LogoNeonHero = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-2xl scale-110"></div>

          {/* Logo Container */}
          <div className="relative bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl border border-blue-400/30">
            <div className="flex items-center gap-6">
              {/* Large Icon */}
              <div className="h-20 w-20 relative flex items-center justify-center">
                {/* Multiple Glow Layers */}
                <div className="absolute inset-0 bg-blue-500/40 rounded-xl blur-lg animate-pulse"></div>
                <div className="absolute inset-0 bg-purple-500/30 rounded-xl blur-md"></div>
                <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-sm"></div>

                {/* Icon Container */}
                <div className="relative bg-slate-900 rounded-xl border-2 border-blue-400/60 flex items-center justify-center w-full h-full">
                  <FileText
                    className="h-10 w-10 text-blue-400"
                    style={{
                      filter: `
                        drop-shadow(0 0 8px rgba(59, 130, 246, 1))
                        drop-shadow(0 0 16px rgba(147, 51, 234, 0.6))
                        drop-shadow(0 0 24px rgba(6, 182, 212, 0.4))
                      `,
                    }}
                  />
                </div>
              </div>

              {/* Large Text */}
              <div className="flex flex-col">
                <h1
                  className="text-5xl font-bold text-white tracking-wide"
                  style={{
                    textShadow: `
                      0 0 10px rgba(59, 130, 246, 1),
                      0 0 20px rgba(59, 130, 246, 0.8),
                      0 0 30px rgba(59, 130, 246, 0.6),
                      0 0 40px rgba(147, 51, 234, 0.4),
                      0 0 50px rgba(6, 182, 212, 0.3)
                    `,
                  }}
                >
                  FileFlow
                </h1>

                <p
                  className="text-lg text-slate-300 tracking-wider mt-2"
                  style={{
                    textShadow: "0 0 5px rgba(59, 130, 246, 0.7)",
                  }}
                >
                  ניהול מסמכים חכם
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoNeonStyle
