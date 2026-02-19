"use client"

import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, LogIn, UserPlus, Sparkles, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReactNode } from "react"

interface AuthGateProps {
    children: ReactNode
    /** 'block' = completely blocks access, 'blur' = shows blurred content behind */
    mode?: 'block' | 'blur'
    /** Custom title for the gate message */
    title?: string
    /** Custom description */
    description?: string
    /** Custom icon */
    icon?: ReactNode
}

export default function AuthGate({
    children,
    mode = 'block',
    title = 'سجّل دخولك للمتابعة',
    description = 'هذه الميزة متاحة فقط للمستخدمين المسجلين. سجّل دخولك أو أنشئ حساباً جديداً للاستمتاع بجميع المزايا.',
    icon
}: AuthGateProps) {
    const { user, loading } = useAuth()

    // While loading, show nothing
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // If user is logged in, show content normally
    if (user) {
        return <>{children}</>
    }

    // If mode is 'block', show overlay without any content behind
    if (mode === 'block') {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse-slower" />
                </div>

                <AuthOverlayCard title={title} description={description} icon={icon} />
            </div>
        )
    }

    // If mode is 'blur', show content blurred with overlay on top
    return (
        <div className="relative min-h-screen">
            {/* Blurred Content */}
            <div className="blur-[8px] pointer-events-none select-none opacity-60" aria-hidden="true">
                {children}
            </div>

            {/* Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <AuthOverlayCard title={title} description={description} icon={icon} />
            </div>
        </div>
    )
}

function AuthOverlayCard({
    title,
    description,
    icon
}: {
    title: string
    description: string
    icon?: ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg mx-4"
        >
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow" />

                {/* Card */}
                <div className="relative bg-[#0b101b]/95 border border-white/10 rounded-3xl p-10 backdrop-blur-2xl shadow-2xl overflow-hidden" dir="rtl">
                    {/* Top Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -30, 0],
                                    x: [0, Math.random() * 20 - 10, 0],
                                    opacity: [0.2, 0.6, 0.2]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                                className="absolute w-1 h-1 bg-primary/50 rounded-full"
                                style={{
                                    left: `${15 + i * 15}%`,
                                    top: `${60 + Math.random() * 20}%`
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        {/* Icon */}
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 3, -3, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-2xl">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30">
                                    {icon || <Lock className="w-8 h-8 text-white" />}
                                </div>
                            </div>
                            {/* Pulse Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full border-2 border-primary/30"
                            />
                        </motion.div>

                        {/* Title */}
                        <div className="space-y-3">
                            <h2 className="text-2xl md:text-3xl font-black text-white">
                                {title}
                            </h2>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                                {description}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap justify-center gap-3 py-2">
                            {[
                                { icon: Sparkles, text: 'أدوات ذكية' },
                                { icon: ShieldCheck, text: 'محتوى حصري' },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"
                                >
                                    <feature.icon className="w-3.5 h-3.5 text-primary" />
                                    {feature.text}
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                            <Link href="/auth/login" className="flex-1">
                                <Button
                                    className="w-full h-13 text-base bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold rounded-xl gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    تسجيل الدخول
                                </Button>
                            </Link>
                            <Link href="/auth/signup" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full h-13 text-base border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-bold rounded-xl gap-2"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    إنشاء حساب
                                </Button>
                            </Link>
                        </div>

                        {/* Bottom text */}
                        <p className="text-xs text-slate-500 pt-2">
                            التسجيل مجاني ولا يستغرق أكثر من دقيقة واحدة 🚀
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
