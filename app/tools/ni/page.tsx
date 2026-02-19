"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Brain, Star, CheckCircle, ArrowRight, ArrowLeft, ArrowUp, Activity, BookOpen,
    Dumbbell, Coffee, Sun, Moon, Utensils, Zap, Database, Share2, Layers,
    ChevronDown, ChevronUp, Eye, ShieldCheck, Sparkles, User, Calendar, Clock,
    Monitor, Grid, Laptop, GraduationCap, Target, Timer, Smile, Briefcase, Terminal,
    FolderGit2, BedDouble, HandHeart, Gamepad2, School, Book, Download, Printer, Save, Undo, AlertTriangle, Scale,
    Palette, Cloud
} from "lucide-react"
import { SmartFutureDashboard } from "@/components/smart-future-dashboard"
import { SmartRecommendations } from "@/components/smart-recommendations"
import { ScheduleBuilder } from "@/components/schedule-builder"
import { useLanguage } from "@/contexts/LanguageContext"
import AuthGate from "@/components/auth-gate"

// --- Components ---

const StatCard = ({ icon: Icon, value, label, delay }: { icon: any, value: string, label: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
    >
        <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            <Icon size={24} />
        </div>
        <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
            {value}
        </div>
        <div className="text-slate-400 text-sm font-medium">{label}</div>
    </motion.div>
)

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </motion.div>
)

const FaqItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-white/10 last:border-0">
        <button
            onClick={onClick}
            className="w-full py-4 flex items-center justify-between text-right text-white hover:text-blue-400 transition-colors"
        >
            <span className="font-medium text-lg">{question}</span>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <p className="pb-4 text-slate-400 leading-relaxed text-sm">
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

// --- Enhanced Types & Data ---

type InternalLanguage = 'ar' | 'en'
type Step = 'intro' | 'language' | 'name' | 'agreement' | 'questionnaire' | 'processing' | 'results'

interface Question {
    id: string
    text: Record<InternalLanguage, string>
    subtext?: Record<InternalLanguage, string> // Optional helper text
    type: 'select' | 'number' | 'range' | 'text'
    options?: { label: Record<InternalLanguage, string>, icon?: any, value: string }[]
    min?: number
    max?: number
    step?: number
    unit?: Record<InternalLanguage, string>
    category?: 'general' | 'tawjihi'
}

interface UserAnswers {
    [key: string]: string | number
}

interface ScheduleSlot {
    id: number
    time: string
    activity: string
    icon: any
    type: string
    color: string
}

const motivationalQuotes = {
    ar: [
        "كل يوم هو فرصة جديدة لتحقيق أحلامك!",
        "النجاح هو مجموع جهود صغير تتكرر يوميًا.",
        "لا تتوقف عن السعي، فالقمة تنتظرك!",
        "ابدأ، وثابر، وستصل."
    ],
    en: [
        "Every day is a new opportunity to achieve your dreams!",
        "Success is the sum of small efforts repeated daily.",
        "Keep pushing forward, the top awaits you!",
        "Start, persevere, and you will arrive."
    ]
}

// expanded question set with better UI hints
const questions: Question[] = [
    {
        id: 'studentType',
        text: { ar: 'ما هو مسارك الحالي؟', en: 'What is your current path?' },
        subtext: { ar: 'يساعدنا هذا في تخصيص النصائح الدراسية.', en: 'This helps us tailor academic advice.' },
        type: 'select',
        options: [
            { label: { ar: 'طالب توجيهي', en: 'Tawjihi Student' }, icon: GraduationCap, value: 'Tawjihi' },
            { label: { ar: 'طالب جامعي', en: 'University Student' }, icon: School, value: 'University' },
            { label: { ar: 'نمط حياة عام', en: 'General Lifestyle' }, icon: Coffee, value: 'General' }
        ]
    },
    {
        id: 'gender',
        text: { ar: 'الجنس (لتخصيص الثيم):', en: 'Gender (for customization):' },
        type: 'select',
        options: [
            { label: { ar: 'ذكر', en: 'Male' }, icon: User, value: 'Male' },
            { label: { ar: 'أنثى', en: 'Female' }, icon: User, value: 'Female' }
        ]
    },
    {
        id: 'age',
        text: { ar: 'كم عمرك؟', en: 'How old are you?' },
        type: 'number',
        min: 10, max: 80,
        unit: { ar: 'سنة', en: 'years' }
    },
    {
        id: 'height',
        text: { ar: 'كم طولك؟', en: 'What is your height?' },
        type: 'number',
        min: 50, max: 250,
        unit: { ar: 'سم', en: 'cm' }
    },
    {
        id: 'weight',
        text: { ar: 'كم وزنك؟', en: 'What is your weight?' },
        type: 'number',
        min: 20, max: 300,
        unit: { ar: 'كغ', en: 'kg' }
    },
    {
        id: 'sleepQuality',
        text: { ar: 'كيف تصف جودة نومك؟', en: 'How is your sleep quality?' },
        type: 'select',
        options: [
            { label: { ar: 'ممتاز (عميق ومريح)', en: 'Excellent (Deep & Restful)' }, icon: Star, value: 'Excellent' },
            { label: { ar: 'جيد (عادي)', en: 'Good (Average)' }, icon: CheckCircle, value: 'Good' },
            { label: { ar: 'سيئ (متقطع)', en: 'Poor (Interrupted)' }, icon: AlertTriangle, value: 'Poor' }
        ]
    },
    {
        id: 'activityLevel',
        text: { ar: 'ما هو مستوى نشاطك البدني؟', en: 'Physical Activity Level?' },
        type: 'select',
        options: [
            { label: { ar: 'كسول (أجلس معظم الوقت)', en: 'Sedentary' }, icon: Coffee, value: 'Sedentary' },
            { label: { ar: 'نشط قليلاً (مشي خفيف)', en: 'Lightly Active' }, icon: ArrowUp, value: 'Light' },
            { label: { ar: 'نشط جداً (رياضة يومية)', en: 'Very Active' }, icon: Dumbbell, value: 'Active' }
        ]
    },
    {
        id: 'bodyGoal',
        text: { ar: 'ما هو هدفك البدني الرئيسي؟', en: 'Main Fitness Goal?' },
        type: 'select',
        options: [
            { label: { ar: 'تضخيم وبناء عضلات', en: 'Bulking & Muscle Gain' }, icon: Dumbbell, value: 'Bulking' },
            { label: { ar: 'تنشيف وخسارة دهون', en: 'Cutting & Fat Loss' }, icon: Target, value: 'Cutting' },
            { label: { ar: 'حافظ على وزني', en: 'Maintenance' }, icon: Scale, value: 'Maintain' }
        ]
    },
    {
        id: 'sleepHours',
        text: { ar: 'كم ساعة تنام يوميًا (تقريباً)؟', en: 'Avg. Daily Sleep Hours?' },
        type: 'range',
        min: 3, max: 12, step: 0.5,
        unit: { ar: 'ساعات', en: 'hrs' }
    },
    {
        id: 'studyHours',
        text: { ar: 'كم ساعة تخصص للدراسة/العمل يومياً؟', en: 'Daily Study/Work Hours?' },
        type: 'range',
        min: 0, max: 16, step: 0.5,
        unit: { ar: 'ساعات', en: 'hrs' }
    },
    {
        id: 'morningPerson',
        text: { ar: 'هل تفضل الصباح أم المساء للإنتاجية؟', en: 'Morning or Night Person?' },
        type: 'select',
        options: [
            { label: { ar: 'شخص صباحي (Early Bird)', en: 'Morning Person' }, icon: Sun, value: 'Morning' },
            { label: { ar: 'شخص مسائي (Night Owl)', en: 'Night Person' }, icon: Moon, value: 'Night' }
        ]
    },
]

// --- Enhanced Components ---

const TimelineSlot = ({ slot, isLast }: { slot: ScheduleSlot, isLast: boolean }) => (
    <div className="flex gap-4 group">
        {/* Time Column */}
        <div className="w-24 shrink-0 text-right pt-2">
            <span className="font-mono text-blue-400 font-bold text-lg block">{slot.time}</span>
        </div>

        {/* Timeline Graphic */}
        <div className="relative flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full border-4 border-[#0b101b] z-10 ${slot.color.replace('bg-', 'bg-') === slot.color ? slot.color : 'bg-slate-500'}`}></div>
            {!isLast && <div className="w-0.5 h-full bg-white/10 absolute top-4 group-hover:bg-blue-500/30 transition-colors"></div>}
        </div>

        {/* Content Card */}
        <div className="flex-grow pb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group-hover:translate-x-1 duration-300">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${slot.color.replace('bg-', 'bg-').replace('500', '500/10').replace('600', '600/10')} text-white`}>
                        <slot.icon size={18} />
                    </div>
                    <span className="font-medium text-lg text-slate-100">{slot.activity}</span>
                </div>
            </div>
        </div>
    </div>
)

export default function SmartFuturePage() {
    // State
    const [currentStep, setCurrentStep] = useState<Step>('language')
    const { language, setLanguage } = useLanguage()
    // Cast to internal language type to satisfy Record type safety
    const lang = language as InternalLanguage

    const [userName, setUserName] = useState('')
    const [answers, setAnswers] = useState<UserAnswers>({})
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [results, setResults] = useState<any>(null)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    // Printing Ref
    const printRef = useRef<HTMLDivElement>(null)
    const toolRef = useRef<HTMLDivElement>(null)

    // Helper functions
    const handleAnswer = (value: string | number) => {
        setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: value }))
    }

    const calculateResults = () => {
        const _sleep = Number(answers.sleepHours) || 8
        const _study = Number(answers.studyHours) || 4
        const _act = String(answers.activityLevel)
        const _goal = String(answers.bodyGoal)
        const _morning = String(answers.morningPerson) === 'Morning'

        // Determine Archetype
        let archetype = { title: { ar: 'المتوازن', en: 'The Balanced' }, desc: { ar: 'لديك توازن جيد بين العمل والحياة.', en: 'You have a good work-life balance.' }, icon: Scale }

        if (_study > 6) {
            archetype = { title: { ar: 'المجتهد الطموح', en: 'The Ambitious Scholar' }, desc: { ar: 'تركيزك العالي على الدراسة سيقودك للنجاح.', en: 'Your high focus on study will lead to success.' }, icon: Brain }
        } else if (_act === 'Active' && _goal !== 'Maintain') {
            archetype = { title: { ar: 'الرياضي المثابر', en: 'The Diligent Athlete' }, desc: { ar: 'صحتك الجسدية هي أولويتك.', en: 'Physical health is your priority.' }, icon: Dumbbell }
        } else if (!_morning) {
            archetype = { title: { ar: 'مبدع الليل', en: 'The Night Owl Creative' }, desc: { ar: 'طاقتك تظهر عندما ينام العالم.', en: 'Your energy peaks when the world sleeps.' }, icon: Moon }
        }

        // Smart Schedule Generation
        let wakeTime = _morning ? 6 : 9 // 6 AM or 9 AM
        const slots: ScheduleSlot[] = []

        // Basic routine builder
        const addSlot = (hour: number, activityAr: string, activityEn: string, icon: any, color: string) => {
            const h = hour > 24 ? hour - 24 : hour;
            const displayH = h > 12 ? h - 12 : h;
            const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
            // Adjust 24h wrap for display
            const finalH = h === 24 || h === 0 ? 12 : displayH;

            slots.push({
                id: slots.length,
                time: `${finalH}:00 ${ampm}`,
                activity: lang === 'ar' ? activityAr : activityEn,
                icon,
                color,
                type: 'auto'
            })
        }

        let currentHour = wakeTime;
        addSlot(currentHour, 'استيقاظ + فطور صحي', 'Wake up + Healthy Breakfast', Sun, 'bg-amber-500');
        currentHour += 1;

        // Morning Block
        if (_morning) {
            addSlot(currentHour, 'جلسة تركيز عميق (دراسة/عمل)', 'Deep Focus Session (Study/Work)', Brain, 'bg-blue-600');
            currentHour += 3;
        } else {
            addSlot(currentHour, 'نشاط خفيف / مشي', 'Light Activity / Walk', Activity, 'bg-emerald-500');
            currentHour += 2;
        }

        // Midday
        addSlot(currentHour, 'استراحة + غداء', 'Break + Lunch', Utensils, 'bg-orange-500');
        currentHour += 1;

        // Afternoon Block
        if (_act === 'Active') {
            addSlot(currentHour, 'تمرين رياضي (Gym)', 'Workout (Gym)', Dumbbell, 'bg-red-500');
            currentHour += 2;
        } else {
            addSlot(currentHour, 'مشروع جانبي / تعلم مهارة', 'Side Project / Skill Learning', Laptop, 'bg-purple-500');
            currentHour += 2;
        }

        // Evening
        if (!_morning) {
            addSlot(currentHour, 'جلسة تركيز مسائية (الأكثر إنتاجية)', 'Evening Focus (Peak Productivity)', Moon, 'bg-indigo-600');
            currentHour += 4;
        } else {
            addSlot(currentHour, 'مراجعة / قراءة', 'Review / Reading', BookOpen, 'bg-teal-600');
            currentHour += 2;
            addSlot(currentHour, 'وقت العائلة / استرخاء', 'Family / Relax', HandHeart, 'bg-rose-500');
            currentHour += 2;
        }

        // Pre-sleep
        addSlot(currentHour, 'روتين ما قبل النوم', 'Pre-sleep Routine', BedDouble, 'bg-slate-500');

        // Scoring
        const score = Math.min(100, Math.round((_sleep >= 7 ? 40 : 20) + (_study >= 4 ? 30 : 10) + (_act === 'Active' ? 30 : 10)));

        // Insights Generation
        const smartInsights: any[] = []
        if (_sleep < 7) smartInsights.push({ id: 'sleep', category: 'sleep', title: { ar: 'انتبه لنومك', en: 'Watch your sleep' }, status: 'warning', message: { ar: 'النوم الكافي أساس الإنتاجية.', en: 'Enough sleep is key to productivity.' }, actionPlan: { ar: 'حاول النوم 7 ساعات على الأقل.', en: 'Try for 7+ hours.' } })
        else smartInsights.push({ id: 'sleep', category: 'sleep', title: { ar: 'نوم ممتاز', en: 'Great Sleep' }, status: 'success', message: { ar: 'عادات نومك صحية جداً.', en: 'Your sleep habits are very healthy.' }, actionPlan: { ar: 'استمر على هذا المنوال.', en: 'Keep it up.' } })

        setResults({ archetype, slots, score, smartInsights })
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            setCurrentStep('processing')
            setTimeout(() => {
                calculateResults()
                setCurrentStep('results')
            }, 2500)
        }
    }

    const handlePrint = () => {
        window.print();
    }

    const scrollToTool = () => {
        toolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام مستقبلي ذكي" description="أداة مستقبلي الذكي متاحة فقط للمستخدمين المسجلين. سجّل دخولك لبناء خطة حياتك المخصصة.">
            <div className="min-h-screen pt-24 pb-20 bg-[#020617] text-white relative overflow-hidden font-sans print:bg-white print:text-black print:p-0" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

                {/* ══════════════════════════════════════════
                COMING SOON OVERLAY — Full Screen Lock
            ══════════════════════════════════════════ */}
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617]/95 backdrop-blur-2xl">

                    {/* Animated Background Glows */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                        {/* Subtle grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
                    >
                        {/* Lock Icon with Glow */}
                        <div className="relative mb-10">
                            {/* Outer glow ring */}
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-150 animate-pulse" />
                            {/* Middle ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 scale-125 animate-ping" style={{ animationDuration: '3s' }} />
                            {/* Icon container */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl shadow-blue-500/10"
                            >
                                {/* Lock SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="url(#lockGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <defs>
                                        <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#60a5fa" />
                                            <stop offset="100%" stopColor="#a78bfa" />
                                        </linearGradient>
                                    </defs>
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    <circle cx="12" cy="16" r="1" fill="url(#lockGrad)" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* "Coming Soon" Text */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-6xl md:text-8xl font-black tracking-tight mb-4"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Coming
                            </span>
                            <br />
                            <span className="text-white">Soon</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-slate-400 text-xl font-light mb-10 leading-relaxed"
                        >
                            We're crafting something extraordinary.<br />
                            <span className="text-slate-500 text-base">Stay tuned for the ultimate Smart Future experience.</span>
                        </motion.p>

                        {/* Animated Dots */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-2"
                        >
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                    className="w-2.5 h-2.5 rounded-full bg-blue-400"
                                />
                            ))}
                        </motion.div>

                        {/* AF BTEC Badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-12 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-medium flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-blue-400" />
                            AF BTEC — Smart Future v1.0
                        </motion.div>
                    </motion.div>
                </div>

                {/* --- Animated Backgrounds (Hidden on Print) --- */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[128px] animate-pulse-slower" />
                    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container relative z-10 px-4 md:px-6 mx-auto">

                    {/* --- Hero Section (Always Visible) --- */}
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 max-w-4xl mx-auto mb-16 print:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold mb-4 animate-fade-in">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                {lang === 'ar' ? 'الإصدار المطور v1.0' : 'Enhanced v1.0'}
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-tight">
                                {lang === 'ar' ? 'مستقبلي' : 'Smart'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-gradient-shift">{lang === 'ar' ? 'الذكي' : 'Future'}</span>
                            </h1>

                            <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
                                {lang === 'ar'
                                    ? 'ليس مجرد جدول، بل نظام حياة متكامل مصمم خصيصاً لك بالذكاء الاصطناعي.'
                                    : 'Not just a schedule, but a complete lifestyle system designed just for you by AI.'}
                            </p>

                            <div className="pt-8">
                                <Button
                                    size="lg"
                                    onClick={scrollToTool}
                                    className="h-16 px-12 text-xl rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-500/20 font-bold transition-transform hover:scale-105"
                                >
                                    {lang === 'ar' ? 'ابدأ الآن' : 'Start Now'} <ArrowDown className="mr-2 w-6 h-6 animate-bounce" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Main Tool Interface (Wizard) --- */}
                    <div ref={toolRef} className="max-w-4xl mx-auto mb-24 relative scroll-mt-28">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-3xl blur-lg opacity-40 animate-pulse-slow"></div>

                        <Card className="bg-[#0b101b] border-white/10 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center relative z-10 w-full">
                            {/* Top Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>

                            <CardContent className="p-8 md:p-12">
                                <AnimatePresence mode="wait">

                                    {/* 1. LANGUAGE SELECT */}
                                    {currentStep === 'language' && (
                                        <motion.div key="lang" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                                            <h2 className="text-3xl font-bold">Select Language / اختر اللغة</h2>
                                            <div className="grid grid-cols-2 gap-6">
                                                <button onClick={() => setLanguage('ar')} className={`p-8 rounded-2xl border-2 transition-all hover:bg-white/5 flex flex-col items-center gap-4 ${lang === 'ar' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'}`}>
                                                    <span className="text-4xl">🇦🇪</span>
                                                    <span className="text-xl font-bold">العربية</span>
                                                </button>
                                                <button onClick={() => setLanguage('en')} className={`p-8 rounded-2xl border-2 transition-all hover:bg-white/5 flex flex-col items-center gap-4 ${lang === 'en' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'}`}>
                                                    <span className="text-4xl">🇺🇸</span>
                                                    <span className="text-xl font-bold">English</span>
                                                </button>
                                            </div>
                                            <Button size="lg" className="w-full mt-4 bg-blue-600 hover:bg-blue-500" onClick={() => setCurrentStep('name')}>
                                                {lang === 'ar' ? 'التالي' : 'Next'}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* 2. NAME INPUT */}
                                    {currentStep === 'name' && (
                                        <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                                            <h2 className="text-3xl font-bold">{lang === 'ar' ? 'كيف تحب أن نناديك؟' : 'What is your name?'}</h2>
                                            <Input
                                                value={userName}
                                                onChange={e => setUserName(e.target.value)}
                                                className="h-20 text-3xl text-center bg-transparent border-b-2 border-white/20 rounded-none focus-visible:ring-0 focus-visible:border-blue-500 px-0 placeholder:text-white/20"
                                                placeholder={lang === 'ar' ? 'اكتب اسمك هنا...' : 'Type your name here...'}
                                            />
                                            <Button size="lg" disabled={!userName} className="w-full mt-4 bg-blue-600 hover:bg-blue-500" onClick={() => setCurrentStep('agreement')}>
                                                {lang === 'ar' ? 'التالي' : 'Next'}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* 3. AGREEMENT */}
                                    {currentStep === 'agreement' && (
                                        <motion.div key="agree" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
                                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle size={40} />
                                            </div>
                                            <h2 className="text-3xl font-bold">{lang === 'ar' ? 'التزام شخصي' : 'Personal Commitment'}</h2>
                                            <p className="text-xl text-slate-300 leading-relaxed">
                                                {lang === 'ar'
                                                    ? `أنا ${userName || 'المستخدم'}، أتعهد بالالتزام بالخطة التي سيتم إنشاؤها لتحقيق أفضل نسخة من نفسي.`
                                                    : `I, ${userName || 'User'}, commit to following the plan generated to achieve the best version of myself.`}
                                            </p>
                                            <Button size="lg" className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 h-14 text-lg" onClick={() => setCurrentStep('questionnaire')}>
                                                {lang === 'ar' ? 'أوافق وألتزم' : 'I Agree & Commit'}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* 4. ACTIVE QUESTION */}
                                    {currentStep === 'questionnaire' && questions[currentQuestionIndex] && (
                                        <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">

                                            {/* Progress Bar Inside Card */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs font-mono text-blue-400 mb-2">
                                                    <span>{lang === 'ar' ? 'سؤال' : 'Question'} {currentQuestionIndex + 1}</span>
                                                    <span>{questions.length}</span>
                                                </div>
                                                <Progress value={((currentQuestionIndex) / questions.length) * 100} className="h-1 bg-white/10" />
                                            </div>

                                            <div className="text-center space-y-2">
                                                <h2 className="text-2xl md:text-4xl font-bold leading-tight">{questions[currentQuestionIndex].text[lang]}</h2>
                                                {questions[currentQuestionIndex].subtext && (
                                                    <p className="text-slate-400 text-lg">{questions[currentQuestionIndex].subtext?.[lang]}</p>
                                                )}
                                            </div>

                                            <div className="pt-8">
                                                {/* SELECT OPTIONS */}
                                                {questions[currentQuestionIndex].type === 'select' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {questions[currentQuestionIndex].options?.map((opt, idx) => {
                                                            const Icon = opt.icon || ArrowRight
                                                            const isSelected = answers[questions[currentQuestionIndex].id] === opt.value
                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => {
                                                                        handleAnswer(opt.value)
                                                                        setTimeout(handleNext, 300)
                                                                    }}
                                                                    className={`p-6 rounded-2xl border transition-all flex items-center gap-4 text-left group
                                                                ${isSelected
                                                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50 hover:scale-[1.01]'}`}
                                                                >
                                                                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white/5 group-hover:bg-blue-500/20 transition-colors'}`}>
                                                                        <Icon size={24} className={isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} />
                                                                    </div>
                                                                    <span className="text-lg font-semibold">{opt.label[lang]}</span>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                                {/* NUMBER INPUT */}
                                                {questions[currentQuestionIndex].type === 'number' && (
                                                    <div className="max-w-xs mx-auto space-y-8">
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                min={questions[currentQuestionIndex].min}
                                                                max={questions[currentQuestionIndex].max}
                                                                value={answers[questions[currentQuestionIndex].id] || ''}
                                                                onChange={(e) => handleAnswer(e.target.value)}
                                                                className="h-24 text-5xl text-center bg-white/5 border-2 border-white/20 focus:border-blue-500 rounded-2xl"
                                                                autoFocus
                                                            />
                                                            <span className="absolute right-4 bottom-4 text-slate-500 text-lg">{questions[currentQuestionIndex].unit?.[lang]}</span>
                                                        </div>
                                                        <Button size="lg" disabled={!answers[questions[currentQuestionIndex].id]} onClick={handleNext} className="w-full bg-blue-600 h-14 text-lg">
                                                            {lang === 'ar' ? 'متابعة' : 'Continue'}
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* RANGE SLIDER */}
                                                {questions[currentQuestionIndex].type === 'range' && (
                                                    <div className="space-y-12 px-4 py-8">
                                                        <div className="text-center space-y-2">
                                                            <span className="text-6xl font-black text-blue-400 block">
                                                                {Number(answers[questions[currentQuestionIndex].id] || (questions[currentQuestionIndex].max || 10) / 2)}
                                                            </span>
                                                            <span className="text-slate-400 text-xl">{questions[currentQuestionIndex].unit?.[lang]}</span>
                                                        </div>
                                                        <Slider
                                                            defaultValue={[(questions[currentQuestionIndex].max || 10) / 2]}
                                                            max={questions[currentQuestionIndex].max}
                                                            min={questions[currentQuestionIndex].min}
                                                            step={questions[currentQuestionIndex].step || 1}
                                                            value={[Number(answers[questions[currentQuestionIndex].id] || (questions[currentQuestionIndex].max || 10) / 2)]}
                                                            onValueChange={(val) => handleAnswer(val[0])}
                                                            className="py-4 cursor-pointer"
                                                        />
                                                        <Button size="lg" onClick={handleNext} className="w-full bg-blue-600 h-14 text-lg">
                                                            {lang === 'ar' ? 'متابعة' : 'Continue'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors" disabled={currentQuestionIndex === 0}>
                                                <Undo size={20} />
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* 5. PROCESSING */}
                                    {currentStep === 'processing' && (
                                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[400px] space-y-12">
                                            <div className="relative w-32 h-32">
                                                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                                                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Brain className="w-10 h-10 text-blue-400 animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="text-center space-y-4">
                                                <h2 className="text-2xl font-bold animate-pulse">{lang === 'ar' ? 'جاري بناء خطتك الشخصية...' : 'Building Your Lifestyle Plan...'}</h2>
                                                <p className="text-slate-400 max-w-md mx-auto">
                                                    {lang === 'ar' ? 'يقوم الذكاء الاصطناعي الآن بتحليل إجاباتك ومقارنتها بأفضل الممارسات العالمية.' : 'AI is analyzing your answers against global best practices.'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* 6. RESULTS */}
                                    {currentStep === 'results' && results && (
                                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">

                                            {/* Result Header */}
                                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 print:hidden">
                                                <div className="text-center md:text-right space-y-2">
                                                    <h1 className="text-4xl font-bold text-white mb-2">{lang === 'ar' ? 'خطتك الذكية جاهزة!' : 'Your Smart Plan is Ready!'}</h1>
                                                    <p className="text-slate-400 text-lg">
                                                        {lang === 'ar' ? `تم تصميم هذه الخطة، لـ ${userName}` : `Designed specially for ${userName}`}
                                                    </p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2" onClick={() => setCurrentStep('language')}>
                                                        <Undo size={16} /> {lang === 'ar' ? 'إعادة' : 'Restart'}
                                                    </Button>
                                                    <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-500 gap-2 shadow-lg shadow-emerald-500/20">
                                                        <Printer size={18} /> {lang === 'ar' ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div ref={printRef} className="space-y-12 print:space-y-8">

                                                {/* Archetype Card */}
                                                <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden shadow-2xl print:bg-white print:text-black print:border print:border-black">
                                                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                                        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm print:bg-slate-200 print:text-black">
                                                            <results.archetype.icon size={48} className="text-white print:text-black" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-2 print:bg-slate-200 print:text-black">
                                                                {lang === 'ar' ? 'شخصيتك الإنتاجية' : 'Your Productivity Archetype'}
                                                            </Badge>
                                                            <h2 className="text-4xl font-black">{results.archetype.title[lang]}</h2>
                                                            <p className="text-indigo-100 text-lg max-w-xl font-medium print:text-slate-600">{results.archetype.desc[lang]}</p>
                                                        </div>
                                                        <div className="md:ml-auto flex flex-col items-center">
                                                            <div className="text-5xl font-black mb-1">{results.score}%</div>
                                                            <div className="text-sm opacity-80 uppercase tracking-widest">{lang === 'ar' ? 'درجة الجودة' : 'Quality Score'}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Timeline & Insights */}
                                                <div className="grid grid-cols-1 gap-8 print:block">
                                                    <div className="space-y-6">
                                                        <ScheduleBuilder lang={lang} initialSlots={results.slots} />
                                                    </div>

                                                    <div className="space-y-6 print:mt-8">
                                                        <div className="space-y-4">
                                                            <SmartFutureDashboard answers={answers} lang={lang} />
                                                            <SmartRecommendations insights={results.smartInsights} lang={lang} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Stats Section (Always Visible) --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-24 print:hidden">
                        <StatCard icon={CheckCircle} value="+50K" label={lang === 'ar' ? 'خطة تم إنشاؤها' : 'Plans Generated'} delay={0.1} />
                        <StatCard icon={User} value="+95%" label={lang === 'ar' ? 'نسبة الرضا' : 'Satisfaction Rate'} delay={0.2} />
                        <StatCard icon={Clock} value="24/7" label={lang === 'ar' ? 'توفر الخدمة' : 'Availability'} delay={0.3} />
                        <StatCard icon={Brain} value="100%" label={lang === 'ar' ? 'تحليل ذكي' : 'AI Analysis'} delay={0.4} />
                    </div>

                    {/* --- Features Section (Always Visible) --- */}
                    <div className="mb-24 print:hidden">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'لماذا تختار مستقبلي الذكي؟' : 'Why Choose Smart Future?'}</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={Calendar}
                                title={lang === 'ar' ? 'جدولة ذكية' : 'Smart Scheduling'}
                                desc={lang === 'ar' ? 'توزيع مثالي لأوقات الدراسة والراحة بناءً على ساعتك البيولوجية.' : 'Optimal distribution of study and rest times based on your biological clock.'}
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={Activity}
                                title={lang === 'ar' ? 'توازن صحي' : 'Health Balance'}
                                desc={lang === 'ar' ? 'نأخذ بعين الاعتبار نشاطك البدني، جودة نومك، ونظامك الغذائي.' : 'We consider your physical activity, sleep quality, and diet.'}
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={GraduationCap}
                                title={lang === 'ar' ? 'تركيز أكاديمي' : 'Academic Focus'}
                                desc={lang === 'ar' ? 'خطط مخصصة لطلاب التوجيهي والجامعات لضمان أعلى درجات التحصيل.' : 'Custom plans for Tawjihi and Uni students to ensure peak performance.'}
                                delay={0.3}
                            />
                            <FeatureCard
                                icon={Printer}
                                title={lang === 'ar' ? 'تقارير قابلة للطباعة' : 'Printable Reports'}
                                desc={lang === 'ar' ? 'احصل على نسختك بصيغة PDF عالية الجودة جاهزة للطباعة والتعليق.' : 'Get your high-quality PDF version ready for printing and pinning.'}
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={Brain}
                                title={lang === 'ar' ? 'رؤى تحليلية' : 'Analytical Insights'}
                                desc={lang === 'ar' ? 'تعرف على نقاط قوتك وضعفك من خلال تحليل شامل لنمط حياتك.' : 'Discover strengths and weaknesses through comprehensive lifestyle analysis.'}
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={Smile}
                                title={lang === 'ar' ? 'تحفيز مستمر' : 'Continuous Motivation'}
                                desc={lang === 'ar' ? 'نظام يرافقك باقتباسات ونصائح يومية للحفاظ على شغفك مشتعلاً.' : 'A system that accompanies you with daily quotes and tips to keep your passion alive.'}
                                delay={0.6}
                            />
                        </div>
                    </div>

                    {/* --- FAQ Section (Always Visible) --- */}
                    <div className="max-w-3xl mx-auto mb-24 print:hidden">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">{lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <FaqItem
                                question={lang === 'ar' ? 'هل هذه الخدمة مجانية؟' : 'Is this service free?'}
                                answer={lang === 'ar' ? 'نعم، الأداة مجانية بالكامل وتهدف لمساعدة الطلاب والشباب.' : 'Yes, the tool is completely free and aims to help students and youth.'}
                                isOpen={openFaq === 0}
                                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                            />
                            <FaqItem
                                question={lang === 'ar' ? 'هل يتم حفظ بياناتي؟' : 'is my data saved?'}
                                answer={lang === 'ar' ? 'لا، خصوصيتك أولويتنا. يتم معالجة البيانات محلياً ولا يتم تخزينها على سيرفراتنا بشكل دائم.' : 'No, your privacy is our priority. Data is processed locally and not permanently stored on our servers.'}
                                isOpen={openFaq === 1}
                                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                            />
                            <FaqItem
                                question={lang === 'ar' ? 'هل الجدول مناسب لطلاب الجامعات؟' : 'Is it suitable for uni students?'}
                                answer={lang === 'ar' ? 'بكل تأكيد! عند اختيار "طالب جامعي" سيتم تكييف الخطة لتناسب المحاضرات والدراسة الذاتية.' : 'Absolutely! Selecting "University Student" adapts the plan for lectures and self-study.'}
                                isOpen={openFaq === 2}
                                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AuthGate>
    )
}

function ArrowDown({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
    )
}
