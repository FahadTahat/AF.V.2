"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
    ClipboardList, Quote, Headphones, Briefcase,
    Shield, Image, Sparkles, BookOpen, Calculator, ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AuthGate from "@/components/auth-gate"

const tools = [
    {
        title: "مدير المشاريع",
        description: "نظم واجباتك ومشاريعك الدراسية وتتبع تقدمك بدقة",
        icon: ClipboardList,
        href: "/tools/assignments",
        color: "from-indigo-500 to-cyan-500",
    },

    {
        title: "منطقة التركيز",
        description: "زيادة الإنتاجية وتقنية Pomodoro مع أصوات محفزة",
        icon: Headphones,
        href: "/tools/focus",
        color: "from-violet-500 to-fuchsia-500",
    },
    {
        title: "محاكي المقابلات",
        description: "تدرب على مقابلات العمل مع مدرب ذكاء اصطناعي",
        icon: Briefcase,
        href: "/tools/interview",
        color: "from-blue-600 to-sky-500",
    },
    {
        title: "كشف الذكاء الاصطناعي",
        description: "أداة ذكية للكشف عن المحتوى المكتوب بالذكاء الاصطناعي",
        icon: Shield,
        href: "/tools/ai-checker",
        color: "from-red-500 to-rose-500",
    },
    {
        title: "موقع الصور",
        description: "إدارة ومشاركة الصور وتوليد الصور بالذكاء الاصطناعي",
        icon: Image,
        href: "/tools/image-platform",
        color: "from-cyan-500 to-blue-500",
    },
    {
        title: "مستقبلي ذكي",
        description: "موقع التعلم التفاعلي لبناء مستقبلك المهني",
        icon: Sparkles,
        href: "/tools/ni",
        color: "from-yellow-500 to-orange-500",
    },
    {
        title: "دليل جمل الأمر",
        description: "قاعدة بيانات شاملة لكل أفعال الأمر (67) مع الأمثلة",
        icon: BookOpen,
        href: "/tools/btec-verbs",
        color: "from-indigo-500 to-purple-500",
    },
    {
        title: "حاسبة المعدل",
        description: "احسب معدلك التراكمي لجميع التخصصات بدقة",
        icon: Calculator,
        href: "/calculator",
        color: "from-blue-500 to-cyan-500",
    },
]

export default function ToolsIndexPage() {
    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام الأدوات" description="مركز الأدوات الذكية متاح فقط للمستخدمين المسجلين. سجّل دخولك للوصول إلى جميع الأدوات الرقمية المصممة لتعزيز رحلتك التعليمية.">
            <div className="min-h-screen bg-[#0f1016] text-white pt-32 pb-20 px-4 relative overflow-hidden font-sans">
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slower"></div>
                </div>

                <div className="container max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 px-4 py-2 bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors">
                            <Sparkles className="w-4 h-4 ml-2 text-amber-400" />
                            أدوات الطالب الذكي
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            مركز <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">الأدوات</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                            مجموعة متكاملة من الأدوات الرقمية المصممة لتعزيز رحلتك التعليمية وتطوير مهاراتك بشكل احترافي.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={tool.href}>
                                    <Card className="h-full border border-white/10 shadow-lg bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-1">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                        <CardHeader className="relative">
                                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                                <tool.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                            </div>
                                            <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription className="text-slate-400 leading-relaxed font-light">
                                                {tool.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                                                <span>ابدأ الاستخدام</span>
                                                <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthGate>
    )
}
