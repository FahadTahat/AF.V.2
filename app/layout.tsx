import type React from "react"
import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import "./globals.css"
import "./accessibility.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { SplashScreen } from "@/components/splash-screen"
import { PageTransition } from "@/components/page-transition"
import { Chatbot } from "@/components/chatbot"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { AchievementProvider } from "@/contexts/AchievementContext"
import { ClientScripts } from "@/components/client-scripts"
import { Toaster } from "sonner"
import { CustomCursor } from "@/components/custom-cursor"
import { PageTour } from "@/components/page-tour"


const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
})

export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming for app-like feel
}

export const metadata: Metadata = {
  title: "AF BTEC",
  description: "موقع تعليمي شامل لطلاب BTEC يتضمن حاسبة المعدل والموارد التعليمية ودليل الطالب",
  generator: "Ahmad AL-faqeih",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AF BTEC",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <head></head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <AchievementProvider>
                <SplashScreen />
                <Navigation />
                <main className="flex-1 relative z-10">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Chatbot />
                <PageTour />
                <div className="relative z-10">
                  <Footer />
                </div>
              </AchievementProvider>
            </AuthProvider>
          </LanguageProvider>
          <Toaster
            position="top-center"
            richColors
            theme="dark"
            dir="rtl"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}
          />
          <CustomCursor />
        </ThemeProvider>

        <ClientScripts />
      </body>
    </html>
  )
}
