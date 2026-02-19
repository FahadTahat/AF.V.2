"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Mail, Lock, Shield, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { sendEmailVerification, applyActionCode } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function VerifyEmailPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [step, setStep] = useState<"credentials" | "code" | "success">("credentials")
    const [loading, setLoading] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const { login, user, refreshUser } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Cooldown timer for resend button
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown])

    // Auto-detect step based on user auth
    useEffect(() => {
        if (user) {
            if (user.emailVerified) {
                setStep("success")
                setTimeout(() => router.push("/"), 2000)
            } else {
                setStep("code")
                setEmail(user.email || "")
            }
        }
    }, [user, router])

    // Polling for email verification status
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (step === "code" && user && !user.emailVerified) {
            interval = setInterval(async () => {
                await refreshUser()
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [step, user, refreshUser])

    // Step 1: Login and send verification email
    const handleSendVerification = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور")
            return
        }

        try {
            setLoading(true)

            // Login first
            await login(email, password)

            // Send verification email
            if (auth.currentUser && !auth.currentUser.emailVerified) {
                await sendEmailVerification(auth.currentUser, {
                    url: `${window.location.origin}/auth/verify-email?email=${encodeURIComponent(email)}`,
                    handleCodeInApp: true,
                })

                toast.success("تم إرسال رابط التحقق إلى بريدك الإلكتروني!")
                setStep("code")
                setResendCooldown(60)
            } else if (auth.currentUser?.emailVerified) {
                toast.success("بريدك الإلكتروني مفعّل بالفعل!")
                router.push("/")
            }
        } catch (err: any) {
            console.error("Verification send error:", err)

            if (err.code === "auth/user-not-found") {
                toast.error("المستخدم غير موجود")
            } else if (err.code === "auth/wrong-password") {
                toast.error("كلمة المرور غير صحيحة")
            } else if (err.code === "auth/invalid-email") {
                toast.error("البريد الإلكتروني غير صالح")
            } else if (err.code === "auth/too-many-requests") {
                toast.error("تم إرسال عدد كبير من الطلبات. حاول لاحقاً")
            } else {
                toast.error("حدث خطأ. حاول مرة أخرى")
            }
        } finally {
            setLoading(false)
        }
    }

    // Resend verification email
    const handleResendVerification = async () => {
        if (resendCooldown > 0 || !auth.currentUser) return

        try {
            setLoading(true)
            await sendEmailVerification(auth.currentUser, {
                url: `${window.location.origin}/auth/verify-email?email=${encodeURIComponent(email)}`,
                handleCodeInApp: true,
            })

            toast.success("تم إعادة إرسال رابط التحقق!")
            setResendCooldown(60)
        } catch (err: any) {
            console.error("Resend error:", err)
            toast.error("فشل إعادة الإرسال. حاول مرة أخرى")
        } finally {
            setLoading(false)
        }
    }

    // Check verification status manually
    const handleCheckVerification = async () => {
        if (!user) return

        try {
            setLoading(true)
            await refreshUser()

            if (user.emailVerified) { // Note: User object might not update immediately in state, better to re-check `auth.currentUser` directly if needed, but `refreshUser` updates context.
                // Ideally `refreshUser` updates `user` context.
            } else {
                toast.error("لم يتم التحقق بعد. افتح الرابط من بريدك الإلكتروني")
            }
        } catch (err) {
            console.error("Check verification error:", err)
            toast.error("حدث خطأ أثناء التحقق")
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
                        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            {step === "success" ? (
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            ) : (
                                <Shield className="w-10 h-10 text-primary" />
                            )}
                        </div>
                        <CardTitle className="text-3xl font-bold text-white mb-2">
                            {step === "credentials" && "تسجيل الدخول للتحقق"}
                            {step === "code" && "تحقق من بريدك"}
                            {step === "success" && "تم التحقق!"}
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            {step === "credentials" && "أدخل بياناتك لإرسال رابط التحقق"}
                            {step === "code" && "أرسلنا رابط التحقق إلى بريدك الإلكتروني"}
                            {step === "success" && "تم تفعيل حسابك بنجاح"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 pb-8">
                        {/* Step 1: Enter Credentials (Fallback) */}
                        {step === "credentials" && (
                            <form onSubmit={handleSendVerification} className="space-y-5">
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
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300 font-medium">كلمة المرور</Label>
                                    <div className="relative group">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-medium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            إرسال رابط التحقق
                                            <ArrowRight className="w-5 h-5 mr-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Step 2: Verify Email (Waiting Room) */}
                        {step === "code" && (
                            <div className="space-y-6">
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center animate-pulse">
                                    <Mail className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        تم إرسال رابط التحقق إلى
                                        <br />
                                        <span className="text-white font-semibold dir-ltr block mt-1">{email}</span>
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span>جاري التحقق تلقائياً...</span>
                                    </div>

                                    <Button
                                        onClick={handleCheckVerification}
                                        className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all font-medium"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                                جاري التحقق...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 ml-2" />
                                                لقد ضغطت على الرابط
                                            </>
                                        )}
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-slate-900 px-3 text-slate-400">لم يصلك الرابط؟</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleResendVerification}
                                        variant="outline"
                                        className="w-full h-12 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                                        disabled={loading || resendCooldown > 0}
                                    >
                                        {resendCooldown > 0 ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 ml-2" />
                                                إعادة الإرسال ({resendCooldown}ث)
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-5 h-5 ml-2" />
                                                إعادة إرسال الرابط
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-xs text-slate-300 leading-relaxed text-right">
                                            <p className="font-semibold text-amber-400 mb-1">نصائح:</p>
                                            <ul className="space-y-1 list-disc list-inside">
                                                <li>تحقق من صندوق البريد المزعج (Spam)</li>
                                                <li>قد يستغرق وصول البريد بضع دقائق</li>
                                                <li>الرابط صالح لمدة ساعة واحدة</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === "success" && (
                            <div className="space-y-6 text-center py-8">
                                <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
                                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h3>
                                    <p className="text-slate-400">
                                        سيتم توجيهك إلى الصفحة الرئيسية...
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
