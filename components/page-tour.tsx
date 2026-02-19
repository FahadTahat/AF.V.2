"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
import {
    X, ChevronRight, CheckCircle, ChevronLeft,
    Bot, Calculator, MessageCircle, BookOpen, Users,
    HelpCircle, Headphones, Briefcase, Shield, Image,
    Sparkles, ClipboardList, Map, Trophy, Heart,
    User, Activity, Search, Plus, CheckSquare,
    BarChart3, FolderGit2, Zap, Star, Lock, GraduationCap,
    Edit3, Settings, Lightbulb
} from "lucide-react"

// ─────────────────────────────────────────────────────────────
// Tour Steps per Route
// ─────────────────────────────────────────────────────────────
interface TourStep {
    icon: any
    iconColor: string
    iconBg: string
    title: string        // Default / Arabic
    titleEn?: string     // English (Optional)
    description: string  // Default / Arabic
    descriptionEn?: string // English (Optional)
    tip?: string         // Default / Arabic
    tipEn?: string       // English (Optional)
}

interface PageTourConfig {
    steps: TourStep[]
}

const PAGE_TOURS: Record<string, PageTourConfig> = {

    // ── AI Chat ──
    "/tools/ai-chat": {
        steps: [
            {
                icon: Bot,
                iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                title: "مرحباً في المساعد الذكي! 🤖",
                titleEn: "Welcome to AI Assistant! 🤖",
                description: "مساعدك الذكي المتخصص في BTEC. يمكنه الإجابة على أسئلتك الدراسية، شرح المفاهيم، ومساعدتك في كتابة التقارير.",
                descriptionEn: "Your BTEC-specialized AI assistant. It can answer study questions, explain concepts, and help with reports.",
            },
            {
                icon: MessageCircle,
                iconColor: "text-purple-400", iconBg: "bg-purple-500/10",
                title: "ابدأ المحادثة",
                titleEn: "Start Chatting",
                description: "اكتب سؤالك في مربع النص في الأسفل واضغط إرسال. يمكنك سؤاله عن أي شيء يتعلق بمواد BTEC.",
                descriptionEn: "Type your question below and hit send. Ask anything related to BTEC subjects.",
                tip: "💡 جرب: 'اشرح لي مفهوم normalization في قواعد البيانات'",
                tipEn: "💡 Try: 'Explain normalization in databases'"
            },
            {
                icon: Image,
                iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10",
                title: "رفع الصور والملفات",
                titleEn: "Upload Images & Files",
                description: "يمكنك رفع صور أو ملفات PDF لتحليلها. مفيد لرفع أسئلة الامتحانات أو الواجبات للحصول على مساعدة.",
                descriptionEn: "Upload images or PDFs for analysis. Great for exam questions or assignment help.",
                tip: "💡 اضغط على أيقونة المرفقات بجانب مربع النص",
                tipEn: "💡 Click the attachment icon next to the text box"
            }
        ]
    },

    // ── Calculator ──
    "/calculator": {
        steps: [
            {
                icon: Calculator,
                iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                title: "حاسبة معدل BTEC 🎓",
                titleEn: "BTEC GPA Calculator 🎓",
                description: "احسب معدلك النهائي بدقة بناءً على درجاتك في كل وحدة. تدعم جميع مستويات BTEC.",
                descriptionEn: "Accurately calculate your final GPA based on unit grades. Supports all BTEC levels."
            },
            {
                icon: BookOpen,
                iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10",
                title: "أدخل درجاتك",
                titleEn: "Enter Your Grades",
                description: "اختر مستواك (Level 2 أو Level 3)، ثم أدخل درجة كل وحدة (Pass, Merit, Distinction).",
                descriptionEn: "Select your level (L2 or L3), then enter grades for each unit (Pass, Merit, Distinction)."
            }
        ]
    },

    // ── Community Chat ──
    "/chat": {
        steps: [
            {
                icon: MessageCircle,
                iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                title: "مجتمع AF BTEC 💬",
                titleEn: "AF BTEC Community 💬",
                description: "تواصل مع زملائك طلاب BTEC، اطرح أسئلتك، شارك خبراتك، وتعاون معهم في المشاريع.",
                descriptionEn: "Connect with BTEC peers, ask questions, share experiences, and collaborate."
            },
            {
                icon: Users,
                iconColor: "text-purple-400", iconBg: "bg-purple-500/10",
                title: "الغرف والمجموعات",
                titleEn: "Rooms & Groups",
                description: "يمكنك الانضمام لغرف نقاش متخصصة حسب المادة أو المستوى الدراسي.",
                descriptionEn: "Join specialized discussion rooms based on subject or level."
            }
        ]
    },

    // ── Profile (UPDATED) ──
    "/profile": {
        steps: [
            {
                icon: User,
                iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                title: "ملفك الشخصي 👤",
                titleEn: "Your Profile 👤",
                description: "هنا تجد كل معلوماتك، إنجازاتك، ونشاطاتك على المنصة.",
                descriptionEn: "Here you'll find all your info, achievements, and platform activity."
            },
            {
                icon: Edit3, // NEW STEP for Edit Profile
                iconColor: "text-pink-400", iconBg: "bg-pink-500/10",
                title: "تعديل البروفايل ✏️",
                titleEn: "Edit Profile ✏️",
                description: "من تبويب 'تعديل البروفايل'، يمكنك تغيير اسمك، النبذة، التخصص، وروابط التواصل.",
                descriptionEn: "Use the 'Edit Profile' tab to update your name, bio, program, and social links.",
                tip: "💡 المعلومات دي بتظهر للناس لما يزوروا بروفايلك",
                tipEn: "💡 This info is visible to others when they visit your profile"
            },
            {
                icon: Trophy,
                iconColor: "text-amber-400", iconBg: "bg-amber-500/10",
                title: "الإنجازات والشارات",
                titleEn: "Achievements & Badges",
                description: "اعرض إنجازاتك المفتوحة وتتبع تقدمك نحو الإنجازات الجديدة.",
                descriptionEn: "View unlocked achievements and track progress towards new ones.",
                tip: "💡 كلما استخدمت المنصة أكثر، فتحت إنجازات أكثر",
                tipEn: "💡 The more you use the platform, the more you unlock"
            }
        ]
    },

    // ── Resources ──
    "/resources": {
        steps: [
            {
                icon: BookOpen,
                iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                title: "مكتبة الموارد التعليمية 📚",
                titleEn: "Resources Library 📚",
                description: "مجموعة شاملة من الملاحظات، الشرائح، والمراجع لجميع وحدات BTEC.",
                descriptionEn: "Comprehensive collection of notes, slides, and references for BTEC units."
            },
            {
                icon: Search,
                iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10",
                title: "البحث والتصفية",
                titleEn: "Search & Filter",
                description: "ابحث عن أي مورد بالاسم أو الوحدة، أو فلتر حسب المستوى والمادة.",
                descriptionEn: "Search for resources by name or unit, or filter by level/subject."
            }
        ]
    },

    // ── Leaderboard ──
    "/leaderboard": {
        steps: [
            {
                icon: Trophy,
                iconColor: "text-amber-400", iconBg: "bg-amber-500/10",
                title: "لوحة المتصدرين 🏆",
                titleEn: "Leaderboard 🏆",
                description: "تنافس مع زملائك وتصدّر قائمة أفضل طلاب AF BTEC.",
                descriptionEn: "Compete with peers to top the AF BTEC student list."
            },
            {
                icon: Star,
                iconColor: "text-blue-400", iconBg: "bg-blue-500/10",
                title: "كيف تكسب النقاط؟",
                titleEn: "How to Earn Points?",
                description: "اكسب نقاطاً بإنجاز الأنشطة، فتح الإنجازات، المشاركة في المجتمع، واستخدام الأدوات.",
                descriptionEn: "Earn points by completing activities, unlocking achievements, and using tools."
            }
        ]
    }
}

// ─────────────────────────────────────────────────────────────
// Helper: match route
// ─────────────────────────────────────────────────────────────
function matchRoute(pathname: string): PageTourConfig | null {
    if (PAGE_TOURS[pathname]) return PAGE_TOURS[pathname]
    for (const route of Object.keys(PAGE_TOURS)) {
        if (pathname.startsWith(route + "/")) return PAGE_TOURS[route]
    }
    return null
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export function PageTour() {
    const pathname = usePathname()
    const { language } = useLanguage()
    const [showTour, setShowTour] = useState(false)
    const [tourStep, setTourStep] = useState(0)
    const [config, setConfig] = useState<PageTourConfig | null>(null)

    const isRTL = language === 'ar'

    useEffect(() => {
        if (pathname === "/") return

        const matched = matchRoute(pathname)
        if (!matched) return

        // Use a versioned key to ensure users see updated tours (like the new Profile one)
        // Adding 'v2' to the key for /profile specifically, or generally if we want a reset
        const version = pathname.includes('/profile') ? '-v2' : ''
        const storageKey = `af-btec-tour-${pathname.replace(/\//g, "-")}${version}`

        const seen = localStorage.getItem(storageKey)

        if (!seen) {
            setConfig(matched)
            setTourStep(0)
            const t = setTimeout(() => setShowTour(true), 1000) // Slightly longer delay to let page load
            return () => clearTimeout(t)
        }
    }, [pathname])

    const closeTour = () => {
        if (!pathname) return
        const version = pathname.includes('/profile') ? '-v2' : ''
        const storageKey = `af-btec-tour-${pathname.replace(/\//g, "-")}${version}`
        localStorage.setItem(storageKey, "true")
        setShowTour(false)
        setTourStep(0)
    }

    const nextStep = () => {
        if (!config) return
        if (tourStep < config.steps.length - 1) {
            setTourStep(p => p + 1)
        } else {
            closeTour()
        }
    }

    const prevStep = () => {
        if (tourStep > 0) {
            setTourStep(p => p - 1)
        }
    }

    if (!showTour || !config) return null

    const step = config.steps[tourStep]
    const StepIcon = step.icon
    const isLast = tourStep === config.steps.length - 1

    // Bilingual text resolution
    const title = (language === 'en' && step.titleEn) ? step.titleEn : step.title
    const description = (language === 'en' && step.descriptionEn) ? step.descriptionEn : step.description
    const tip = (language === 'en' && step.tipEn) ? step.tipEn : step.tip

    return (
        <AnimatePresence>
            <motion.div
                key="page-tour-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                    onClick={closeTour}
                />

                {/* Card */}
                <motion.div
                    key={tourStep}
                    initial={{ opacity: 0, scale: 0.88, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -12 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-35" />

                    <div className="relative bg-[#080e1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Rainbow top bar */}
                        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        {/* Header row: dots + close */}
                        <div className="flex items-center justify-between px-6 pt-5">
                            <div className="flex gap-2 items-center">
                                {config.steps.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setTourStep(i)}
                                        className={cn(
                                            "rounded-full transition-all duration-300",
                                            i === tourStep
                                                ? "w-6 h-2 bg-blue-500"
                                                : i < tourStep
                                                    ? "w-2 h-2 bg-blue-500/50"
                                                    : "w-2 h-2 bg-white/10"
                                        )}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={closeTour}
                                className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-7 pt-5">
                            {/* Icon */}
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-white/5", step.iconBg)}>
                                <StepIcon size={28} className={step.iconColor} />
                            </div>

                            {/* Counter */}
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between">
                                <span>{isRTL ? 'الخطوة' : 'STEP'} {tourStep + 1} / {config.steps.length}</span>
                            </p>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-white mb-2.5 leading-snug">
                                {title}
                            </h2>

                            {/* Description */}
                            <p className="text-slate-300 text-sm leading-relaxed mb-5">
                                {description}
                            </p>

                            {/* Tip */}
                            {tip && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-5">
                                    <p className="text-blue-300 text-xs leading-relaxed">{tip}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={closeTour}
                                    className="text-slate-500 hover:text-white text-xs transition-colors px-2"
                                >
                                    {isRTL ? 'تخطي' : 'Skip'}
                                </button>

                                <div className="flex gap-2">
                                    {tourStep > 0 && (
                                        <Button
                                            variant="ghost"
                                            onClick={prevStep}
                                            size="sm"
                                            className="text-slate-400 hover:text-white hover:bg-white/5"
                                        >
                                            {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                                        </Button>
                                    )}
                                    <Button
                                        onClick={nextStep}
                                        size="sm"
                                        className={cn(
                                            "px-6 font-bold shadow-lg",
                                            isLast
                                                ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-500/20"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20"
                                        )}
                                    >
                                        {isLast
                                            ? <>{isRTL ? 'ابدأ!' : 'Start'} <CheckCircle size={15} className={isRTL ? "mr-1.5" : "ml-1.5"} /></>
                                            : <>{isRTL ? 'التالي' : 'Next'} {isRTL ? <ChevronLeft size={15} className="mr-1.5" /> : <ChevronRight size={15} className="ml-1.5" />}</>
                                        }
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
