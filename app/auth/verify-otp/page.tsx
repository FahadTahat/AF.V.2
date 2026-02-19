"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Mail, ArrowRight, Loader2, CheckCircle2, XCircle, RefreshCw, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Link from "next/link"

export default function VerifyOTPPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
    const [remainingAttempts, setRemainingAttempts] = useState(5)

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCooldown])

    // Redirect if no email or userId
    useEffect(() => {
        if (!email || !userId) {
            toast.error("معلومات غير صحيحة. يرجى التسجيل أولاً")
            router.push('/auth/signup')
        }
    }, [email, userId, router])

    // Handle OTP input change
    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto-submit when all 6 digits are entered
        if (index === 5 && value) {
            const completeOtp = [...newOtp.slice(0, 5), value].join('')
            handleVerify(completeOtp)
        }
    }

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp]
                newOtp[index - 1] = ""
                setOtp(newOtp)
                inputRefs.current[index - 1]?.focus()
            } else {
                const newOtp = [...otp]
                newOtp[index] = ""
                setOtp(newOtp)
            }
            setVerificationStatus("idle")
        }
    }

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').trim()

        if (!/^\d{6}$/.test(pastedData)) {
            toast.error("الرجاء لصق رمز مكون من 6 أرقام")
            return
        }

        const digits = pastedData.split('')
        setOtp(digits)
        inputRefs.current[5]?.focus()

        // Auto-submit
        handleVerify(pastedData)
    }

    // Verify OTP
    const handleVerify = async (otpCode?: string) => {
        const code = otpCode || otp.join('')

        if (code.length !== 6) {
            toast.error("الرجاء إدخال جميع الأرقام")
            return
        }

        try {
            setLoading(true)
            setVerificationStatus("idle")

            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otp: code })
            })

            const data = await response.json()

            if (response.ok) {
                setVerificationStatus("success")
                toast.success("تم التحقق من حسابك بنجاح! 🎉")

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    router.push('/')
                }, 2000)
            } else {
                setVerificationStatus("error")
                setRemainingAttempts(data.remainingAttempts || 0)
                toast.error(data.error || "رمز التحقق غير صحيح")

                // Clear OTP inputs on error
                setOtp(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            }
        } catch (error) {
            console.error('Verification error:', error)
            setVerificationStatus("error")
            toast.error("حدث خطأ أثناء التحقق")
        } finally {
            setLoading(false)
        }
    }

    // Resend OTP
    const handleResend = async () => {
        if (resendCooldown > 0) return

        try {
            setResendLoading(true)

            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, userId })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("تم إرسال رمز جديد إلى بريدك الإلكتروني")
                setResendCooldown(60)
                setOtp(["", "", "", "", "", ""])
                setRemainingAttempts(5)
                setVerificationStatus("idle")
                inputRefs.current[0]?.focus()

                // Show OTP in development
                if (data.devOTP) {
                    console.log('🔑 Development OTP:', data.devOTP)
                    toast.info(`رمز التطوير: ${data.devOTP}`, { duration: 10000 })
                }
            } else {
                toast.error(data.error || "فشل إرسال الرمز")
            }
        } catch (error) {
            console.error('Resend error:', error)
            toast.error("حدث خطأ أثناء إعادة الإرسال")
        } finally {
            setResendLoading(false)
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
                            <Shield className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-white mb-2">
                            تحقق من بريدك الإلكتروني
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            أدخل الرمز المكون من 6 أرقام المُرسل إلى
                            <br />
                            <span className="text-primary font-semibold">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 pb-8">
                        <AnimatePresence mode="wait">
                            {verificationStatus === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center py-8"
                                >
                                    <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
                                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h3>
                                    <p className="text-slate-400">سيتم توجيهك إلى الصفحة الرئيسية...</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    {/* OTP Input */}
                                    <div className="space-y-4">
                                        <div className="flex gap-2 justify-center" dir="ltr">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => { inputRefs.current[index] = el }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    onPaste={index === 0 ? handlePaste : undefined}
                                                    disabled={loading}
                                                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 bg-white/5 text-white transition-all duration-200
                                                        ${verificationStatus === "error"
                                                            ? "border-red-500/50"
                                                            : digit
                                                                ? "border-primary/50"
                                                                : "border-white/10"
                                                        }
                                                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                                                        disabled:opacity-50 disabled:cursor-not-allowed
                                                    `}
                                                />
                                            ))}
                                        </div>

                                        {/* Status Messages */}
                                        {verificationStatus === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-center gap-2 text-red-400 text-sm"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>رمز غير صحيح • {remainingAttempts} محاولات متبقية</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Verify Button */}
                                    <Button
                                        onClick={() => handleVerify()}
                                        className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-medium"
                                        disabled={loading || otp.join('').length !== 6}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                                جاري التحقق...
                                            </>
                                        ) : (
                                            <>
                                                تأكيد الرمز
                                                <ArrowRight className="w-5 h-5 mr-2" />
                                            </>
                                        )}
                                    </Button>

                                    {/* Resend Section */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-white/10"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="bg-slate-900 px-3 text-slate-400">لم يصلك الرمز؟</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleResend}
                                            variant="outline"
                                            className="w-full h-12 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                                            disabled={resendLoading || resendCooldown > 0}
                                        >
                                            {resendCooldown > 0 ? (
                                                <>
                                                    <RefreshCw className="w-5 h-5 ml-2" />
                                                    إعادة الإرسال ({resendCooldown}ث)
                                                </>
                                            ) : resendLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                                    جاري الإرسال...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-5 h-5 ml-2" />
                                                    إرسال رمز جديد
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Tips */}
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                            <div className="text-xs text-slate-300 leading-relaxed">
                                                <p className="font-semibold text-blue-400 mb-1">نصائح:</p>
                                                <ul className="space-y-1 list-disc list-inside">
                                                    <li>تحقق من صندوق البريد الوارد والبريد المزعج</li>
                                                    <li>الرمز صالح لمدة 10 دقائق</li>
                                                    <li>لديك 5 محاولات فقط</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {verificationStatus !== "success" && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={async () => {
                                        const { signOut } = await import('firebase/auth')
                                        const { auth } = await import('@/lib/firebase')
                                        await signOut(auth)
                                        router.push('/auth/login')
                                    }}
                                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    تسجيل خروج
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-500 mt-6">
                    التحقق من البريد الإلكتروني يساعد في حماية حسابك
                </p>
            </motion.div>
        </div>
    )
}
