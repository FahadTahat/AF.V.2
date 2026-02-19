"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Mail, Lock, User, Chrome, ArrowRight, Loader2, Eye, EyeOff, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signup, loginWithGoogle, loginWithApple } = useAuth()

    // Password strength indicator
    const getPasswordStrength = () => {
        if (password.length === 0) return { text: "", color: "", width: "0%" }
        if (password.length < 6) return { text: "ضعيفة", color: "bg-red-500", width: "33%" }
        if (password.length < 10) return { text: "متوسطة", color: "bg-yellow-500", width: "66%" }
        return { text: "قوية", color: "bg-green-500", width: "100%" }
    }

    const passwordStrength = getPasswordStrength()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!displayName || !email || !password) {
            toast.error("الرجاء ملء جميع الحقول")
            return
        }

        if (displayName.length < 3) {
            toast.error("الاسم يجب أن يكون 3 أحرف على الأقل")
            return
        }

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("الرجاء إدخال بريد إلكتروني صحيح")
            return
        }

        if (password.length < 6) {
            toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
            return
        }

        try {
            setLoading(true)

            // Create account
            await signup(email, password, displayName)

            // Note: signup calls router.push('/profile'), but AuthContext might redirect to '/auth/verify-email'
            // because email is not verified yet. 
            // We can explicitly send the verification email here if signup doesn't handle it automatically.

            const { auth } = await import('@/lib/firebase')
            const { sendEmailVerification } = await import('firebase/auth')

            if (auth.currentUser && !auth.currentUser.emailVerified) {
                await sendEmailVerification(auth.currentUser, {
                    url: `${window.location.origin}/auth/verify-email?email=${encodeURIComponent(email)}`,
                    handleCodeInApp: true,
                })
                toast.success("تم إنشاء حسابك! تم إرسال رابط التحقق إلى بريدك الإلكتروني 📧")
                router.push('/auth/verify-email')
            }

        } catch (err: any) {
            console.error("Signup error:", err)

            // رسائل خطأ محسّنة
            if (err.code === "auth/email-already-in-use") {
                toast.error("البريد الإلكتروني مستخدم بالفعل. جرب تسجيل الدخول")
            } else if (err.code === "auth/weak-password") {
                toast.error("كلمة المرور ضعيفة جداً. استخدم كلمة أقوى")
            } else if (err.code === "auth/invalid-email") {
                toast.error("البريد الإلكتروني غير صالح")
            } else if (err.code === "auth/network-request-failed") {
                toast.error("تحقق من اتصالك بالإنترنت")
            } else {
                toast.error("حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        try {
            setLoading(true)
            await loginWithGoogle()
            toast.success("تم إنشاء حسابك بنجاح! 🎉")
        } catch (err: any) {
            console.error("Google signup error:", err)
            if (err.code === "auth/popup-closed-by-user") {
                toast.error("تم إلغاء التسجيل")
            } else {
                toast.error("فشل التسجيل بجوجل")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAppleSignup = async () => {
        try {
            setLoading(true)
            await loginWithApple()
            toast.success("تم إنشاء حسابك بنجاح! 🎉")
        } catch (err: any) {
            console.error("Apple signup error:", err)
            if (err.code === "auth/popup-closed-by-user") {
                toast.error("تم إلغاء التسجيل")
            } else if (err.code === "auth/cancelled-popup-request") {
                toast.error("تم إلغاء النافذة")
            } else {
                toast.error("فشل التسجيل بـ Apple")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slower"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    {/* Top Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>

                    <CardHeader className="text-center pb-8 pt-10">
                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 p-2">
                            <Image
                                src="/icon.png"
                                alt="AF BTEC Logo"
                                width={64}
                                height={64}
                                className="object-contain"
                            />
                        </div>
                        <CardTitle className="text-3xl font-bold text-white mb-2">
                            انضم إلينا الآن
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            أنشئ حسابك واستمتع بجميع المزايا
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300 font-medium">الاسم الكامل</Label>
                                <div className="relative group">
                                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="أدخل اسمك الكامل"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        disabled={loading}
                                    />
                                    {displayName.length >= 3 && (
                                        <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 font-medium">البريد الإلكتروني</Label>
                                <div className="relative group">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 font-medium">كلمة المرور</Label>
                                <div className="relative group">
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-11 pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {password.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: passwordStrength.width }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-slate-400">قوة كلمة المرور: <span className={cn(
                                            passwordStrength.color.replace('bg-', 'text-'),
                                            "font-medium"
                                        )}>{passwordStrength.text}</span></p>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-medium"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                        جاري إنشاء الحساب...
                                    </>
                                ) : (
                                    <>
                                        إنشاء حساب
                                        <ArrowRight className="w-5 h-5 mr-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-slate-900 px-3 text-slate-400">أو استمر باستخدام</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full h-12 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                                onClick={handleGoogleSignup}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-12 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                                onClick={handleAppleSignup}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                )}
                                Apple
                            </Button>
                        </div>

                        <div className="text-center pt-4 space-y-2">
                            <p className="text-sm text-slate-400">
                                لديك حساب بالفعل؟{" "}
                                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline">
                                    تسجيل الدخول
                                </Link>
                            </p>
                            <p className="text-sm text-slate-400">
                                تريد تفعيل حسابك؟{" "}
                                <Link href="/auth/verify-email" className="text-purple-400 hover:text-purple-300 font-medium transition-colors underline-offset-4 hover:underline">
                                    التحقق من البريد الإلكتروني
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-500 mt-6">
                    بإنشاء حساب، أنت توافق على شروط الخدمة وسياسة الخصوصية
                </p>
            </motion.div>
        </div>
    )
}

// Helper function for className merging
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
