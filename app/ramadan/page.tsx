"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Star, Flame, Trophy, Calendar, Sparkles, Check, Crown, Zap, Gift, BookOpen, Clock, Lock, ArrowRight, Play, X, Send, ChevronRight, AlertCircle, Quote, Save, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ramadanBadges, dailyChallenges, lastTenDaysEvents } from "@/lib/ramadan-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAchievements } from "@/contexts/AchievementContext"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { doc, setDoc, arrayUnion, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { RamadanDecorations } from "@/components/ramadan/RamadanDecorations"

// ==================== TYPES ====================
interface QuizQuestion {
    q: string;
    options: string[];
    answer: number;
}

interface ChallengeData {
    day: number;
    title: string;
    task: string;
    type: string;
    points: number;
    action: string;
    link?: string;
    inputLabel?: string;
    inputPlaceholder?: string;
    confirmMessage?: string;
    quiz?: QuizQuestion[];
}

// ==================== ANIMATIONS ====================
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

// ==================== MAIN COMPONENT ====================
export default function RamadanPage() {
    const router = useRouter()
    const { addXP } = useAchievements()
    const { user } = useAuth()

    // ==================== REAL RAMADAN 2026 DATES ====================
    const RAMADAN_START = new Date('2026-02-19T00:00:00+03:00')
    const RAMADAN_END = new Date('2026-03-21T00:00:00+03:00')

    const [currentRamadanDay, setCurrentRamadanDay] = useState(0)
    const [ramadanStatus, setRamadanStatus] = useState<'before' | 'during' | 'after'>('before')
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [completedChallenges, setCompletedChallenges] = useState<number[]>([])

    // Modal States
    const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(null)
    const [modalType, setModalType] = useState<"input" | "quiz" | "confirm" | null>(null)

    // Input Modal State
    const [inputText, setInputText] = useState("")

    // Quiz Modal State
    const [quizAnswers, setQuizAnswers] = useState<number[]>([])
    const [quizStep, setQuizStep] = useState(0) // Track current question index
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)

    // ==================== REAL COUNTDOWN & DAY CALCULATION ====================
    useEffect(() => {
        const calculateRamadanState = () => {
            const now = new Date()

            if (now < RAMADAN_START) {
                setRamadanStatus('before')
                setCurrentRamadanDay(0)
                const diff = RAMADAN_START.getTime() - now.getTime()
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                })
            } else if (now >= RAMADAN_START && now < RAMADAN_END) {
                setRamadanStatus('during')
                const diffDays = Math.floor((now.getTime() - RAMADAN_START.getTime()) / (1000 * 60 * 60 * 24))
                const day = diffDays + 1
                setCurrentRamadanDay(Math.min(day, 30))
                const diffEnd = RAMADAN_END.getTime() - now.getTime()
                setTimeLeft({
                    days: Math.floor(diffEnd / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diffEnd / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diffEnd / (1000 * 60)) % 60),
                    seconds: Math.floor((diffEnd / 1000) % 60),
                })
            } else {
                setRamadanStatus('after')
                setCurrentRamadanDay(30)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateRamadanState()
        const timer = setInterval(calculateRamadanState, 1000)
        return () => clearInterval(timer)
    }, [])

    const getRamadanDayDate = (day: number): string => {
        const date = new Date(RAMADAN_START)
        date.setDate(date.getDate() + day - 1)
        return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
    }

    // ==================== LOAD COMPLETED ====================
    useEffect(() => {
        if (user) {
            const userRef = doc(db, 'users', user.uid)
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    if (data.ramadanChallenges && Array.isArray(data.ramadanChallenges)) {
                        setCompletedChallenges(data.ramadanChallenges)
                    }
                }
            }, (error) => console.error("Firestore error:", error))
            return () => unsubscribe()
        } else {
            setCompletedChallenges([])
        }
    }, [user])

    // ==================== ACTIONS ====================
    const handleChallengeClick = (challenge: ChallengeData) => {
        if (completedChallenges.includes(challenge.day)) return

        switch (challenge.type) {
            case "navigate":
                markChallengeComplete(challenge.day, challenge.points)
                router.push(challenge.link || "/")
                break
            case "input":
                setActiveChallenge(challenge)
                setModalType("input")
                setInputText("")
                break
            case "quiz":
                setActiveChallenge(challenge)
                setModalType("quiz")
                setQuizAnswers(new Array(challenge.quiz?.length || 0).fill(-1))
                setQuizStep(0)
                setQuizSubmitted(false)
                setQuizScore(0)
                break
            case "confirm":
                setActiveChallenge(challenge)
                setModalType("confirm")
                break
            default:
                markChallengeComplete(challenge.day, challenge.points)
        }
    }

    const markChallengeComplete = async (day: number, points: number) => {
        if (completedChallenges.includes(day)) return
        const finalPoints = day >= 21 ? points * 2 : points
        addXP(finalPoints)

        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid)
                await setDoc(userRef, { ramadanChallenges: arrayUnion(day) }, { merge: true })
            } catch (error) { console.error("Error saving challenge:", error) }
        } else {
            const newCompleted = [...completedChallenges, day]
            setCompletedChallenges(newCompleted)
            toast.info('سجّل دخولك لحفظ تقدمك بشكل دائم! 🔑', {
                action: { label: 'تسجيل الدخول', onClick: () => router.push('/auth/login') },
                style: { background: '#1e1b4b', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
            })
        }

        toast.success(`تم إنجاز تحدي اليوم ${day}! 🎉`, {
            description: day >= 21 ? `🔥 نقاط مضاعفة! +${finalPoints} XP` : `+${finalPoints} XP`,
            style: { background: '#1e1b4b', color: '#fbbf24', border: '1px solid #fbbf24' }
        })
    }

    const handleInputSubmit = async () => {
        if (!activeChallenge || inputText.trim().length < 5) {
            toast.error("اكتب إجابة أطول قليلاً")
            return
        }
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid)
                await setDoc(userRef, {
                    [`ramadanAnswers_day${activeChallenge.day}`]: { text: inputText, submittedAt: new Date().toISOString() }
                }, { merge: true })
            } catch (error) { console.error("Error saving input:", error) }
        }
        markChallengeComplete(activeChallenge.day, activeChallenge.points)
        closeModal()
    }

    // New Quiz Logic
    const handleQuizOptionSelect = (optionIndex: number) => {
        if (!activeChallenge?.quiz) return

        const newAnswers = [...quizAnswers]
        newAnswers[quizStep] = optionIndex
        setQuizAnswers(newAnswers)

        // Show feedback delay then move next
        setTimeout(() => {
            if (quizStep < (activeChallenge.quiz!.length - 1)) {
                setQuizStep(prev => prev + 1)
            } else {
                finishQuiz(newAnswers)
            }
        }, 500)
    }

    const finishQuiz = (finalAnswers: number[]) => {
        if (!activeChallenge?.quiz) return
        let correct = 0
        activeChallenge.quiz.forEach((q, i) => { if (finalAnswers[i] === q.answer) correct++ })
        setQuizScore(correct)
        setQuizSubmitted(true)
        const passingScore = Math.ceil(activeChallenge.quiz.length * 0.6)

        if (correct >= passingScore) {
            markChallengeComplete(activeChallenge.day, activeChallenge.points)
        }
    }

    const handleConfirm = () => {
        if (!activeChallenge) return
        markChallengeComplete(activeChallenge.day, activeChallenge.points)
        closeModal()
    }

    const closeModal = () => {
        setActiveChallenge(null)
        setModalType(null)
        setInputText("")
        setQuizAnswers([])
        setQuizSubmitted(false)
        setQuizStep(0)
    }

    // ==================== RENDER ====================
    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 relative overflow-hidden font-sans selection:bg-amber-500/30" dir="rtl">

            {/* Premium Background Effects & Decorations */}
            <RamadanDecorations />

            {/* Auto-Save Notification Banner */}
            <motion.div
                initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none"
            >
                <div className="bg-emerald-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg text-sm font-medium">
                    <Save className="w-4 h-4" />
                    يتم حفظ جميع إجاباتك وتقدمك تلقائياً في حسابك
                </div>
            </motion.div>

            <div className="container px-4 mx-auto relative z-10">
                {/* HERO SECTION */}
                <motion.div
                    initial="hidden" animate="visible" variants={fadeInUp}
                    className="relative text-center mb-20 mt-10"
                >
                    <Badge className="mb-6 px-4 py-1.5 text-sm bg-amber-500/10 text-amber-300 border-amber-500/20 backdrop-blur-md shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]">
                        <Moon className="w-3.5 h-3.5 mr-2 fill-current" />
                        خيمة BTEC الرمضانية
                    </Badge>

                    <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight py-2 bg-clip-text text-transparent bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 drop-shadow-sm select-none">
                        {ramadanStatus === 'before' ? 'أهلاً رمضان' :
                            ramadanStatus === 'after' ? 'عيدكم مبارك' :
                                'رمضان كريم'}
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-10">
                        {ramadanStatus === 'during' ?
                            <>رحلة الإنجاز مستمرة. أنت في اليوم <span className="text-amber-400 font-bold">{currentRamadanDay}</span> من 30.</> :
                            <>استعد لأقوى نسخة منك في شهر الخير. نافس، تعلم، وارتقِ.</>
                        }
                    </p>

                    {/* Countdown/Status Display */}
                    <div className="flex justify-center">
                        <div className="grid grid-flow-col gap-4 text-center auto-cols-max bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/10 ring-1 ring-white/5 shadow-2xl">
                            {ramadanStatus === 'before' ?
                                <CountdownDisplay timeLeft={timeLeft} /> :
                                ramadanStatus === 'during' ? (
                                    <div className="flex items-center gap-8 px-8">
                                        <div className="text-right">
                                            <div className="text-sm text-amber-400/80 font-bold uppercase tracking-wider mb-1">اليوم الحالي</div>
                                            <div className="text-5xl font-black text-white">{currentRamadanDay}</div>
                                        </div>
                                        <div className="h-12 w-px bg-white/10" />
                                        <div className="text-right">
                                            <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">المتبقي</div>
                                            <div className="text-xl text-white font-mono">{timeLeft.days} يوم</div>
                                        </div>
                                    </div>
                                ) : <div className="text-2xl font-bold text-amber-400 px-8">كل عام وأنتم بخير! 🎉</div>
                            }
                        </div>
                    </div>
                </motion.div>

                {/* PROGRESS BAR */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto mb-16 relative"
                >
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                        <span>البداية</span>
                        <span className="text-amber-400">{Math.round((completedChallenges.length / 30) * 100)}% مكتمل</span>
                        <span>النهاية</span>
                    </div>
                    <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedChallenges.length / 30) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.6)] relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* CHALLENGES GRID */}
                <div className="mb-32">
                    <motion.div
                        variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="flex items-center gap-4 mb-10"
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-white flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-amber-400" />
                            خارطة الطريق الرمضانية
                            <Sparkles className="w-6 h-6 text-amber-400" />
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                    </motion.div>



                    <motion.div
                        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
                    >
                        {(dailyChallenges as ChallengeData[]).map((challenge) => {
                            // Production Mode: Lock future challenges
                            const isLocked = challenge.day > currentRamadanDay
                            const isToday = challenge.day === currentRamadanDay
                            const isPast = challenge.day < currentRamadanDay && !completedChallenges.includes(challenge.day)
                            const isCompleted = completedChallenges.includes(challenge.day)

                            return (
                                <motion.div variants={fadeInUp} key={challenge.day}>
                                    <div
                                        onClick={() => !isLocked && !isCompleted && handleChallengeClick(challenge)}
                                        className={`
                                            relative h-full min-h-[200px] rounded-2xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden group
                                            flex flex-col backdrop-blur-sm
                                            ${isToday ? 'bg-amber-900/20 border-amber-500/60 shadow-[0_0_40px_-5px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/30' :
                                                isCompleted ? 'bg-green-900/10 border-green-500/30 grayscale-[0.3]' :
                                                    isLocked ? 'bg-slate-900/40 border-white/5 opacity-60 grayscale' :
                                                        isPast ? 'bg-red-900/5 border-red-500/20' : 'bg-slate-800/30 border-white/10 hover:bg-slate-800/50 hover:border-amber-500/40 hover:scale-[1.02] hover:shadow-2xl'}
                                        `}
                                    >
                                        {/* Background Effects */}
                                        {isToday && <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />}
                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />

                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className={`
                                                w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border
                                                ${isToday ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30' :
                                                    isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-slate-400 border-white/5'}
                                            `}>
                                                {challenge.day}
                                            </div>
                                            <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border
                                                ${challenge.day >= 21 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/5 text-amber-300/90 border-amber-500/10'}
                                            `}>
                                                {challenge.day >= 21 && <Flame className="w-3 h-3 fill-current" />}
                                                {challenge.day >= 21 ? challenge.points * 2 : challenge.points} XP
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 relative z-10 space-y-2">
                                            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase opacity-80">
                                                {getRamadanDayDate(challenge.day)}
                                            </p>

                                            <h3 className={`font-bold text-base leading-snug 
                                                ${isCompleted ? 'line-through text-slate-500' : 'text-white group-hover:text-amber-200 transition-colors'}
                                            `}>
                                                {isLocked ? '??? (مغلق)' : challenge.title}
                                            </h3>

                                            {!isLocked && (
                                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                                                    {challenge.task}
                                                </p>
                                            )}
                                        </div>

                                        {/* Footer / Status */}
                                        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                                            {isCompleted ? (
                                                <span className="text-xs font-bold text-green-400 flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1.5 rounded-lg border border-green-500/10">
                                                    <Check className="w-3.5 h-3.5" /> منجز
                                                </span>
                                            ) : isLocked ? (
                                                <span className="text-xs text-slate-600 flex items-center gap-1.5">
                                                    <Lock className="w-3.5 h-3.5" /> مقفل
                                                </span>
                                            ) : isPast ? (
                                                <span className="text-xs font-bold text-red-300 flex items-center gap-1.5 animate-pulse bg-red-500/10 px-2 py-1 rounded-lg">
                                                    <Clock className="w-3.5 h-3.5" /> متأخر
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-amber-300 flex items-center gap-2 group-hover:gap-3 transition-all bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500">
                                                    ابدأ <ArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>

            </div>

            {/* MODAL */}
            <AnimatePresence>
                {activeChallenge && modalType && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl bg-[#0f111a] border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Modal Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
                                                يوم {activeChallenge.day}
                                            </Badge>
                                            <Badge variant="outline" className="border-white/10 text-slate-400">
                                                {activeChallenge.points} XP
                                            </Badge>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{activeChallenge.title}</h2>
                                        <p className="text-slate-400 text-sm flex items-center gap-2">
                                            <HelpCircle className="w-3.5 h-3.5" /> {modalType === 'quiz' ? 'إجب عن الأسئلة التالية' : activeChallenge.task}
                                        </p>
                                    </div>
                                    <button onClick={closeModal} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* DYNAMIC CONTENT BASED ON TYPE */}

                                {modalType === 'input' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5 mb-4">
                                            <p className="text-slate-300 leading-relaxed text-sm">
                                                {activeChallenge.task}
                                            </p>
                                        </div>
                                        <label className="text-sm font-bold text-slate-400">{activeChallenge.inputLabel}</label>
                                        <textarea
                                            value={inputText} onChange={(e) => setInputText(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all outline-none min-h-[120px]"
                                            placeholder={activeChallenge.inputPlaceholder}
                                        />
                                        <Button onClick={handleInputSubmit} disabled={inputText.length < 5} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12">
                                            إرسال الإجابة
                                        </Button>
                                    </div>
                                )}

                                {modalType === 'quiz' && activeChallenge.quiz && (
                                    <div className="min-h-[300px] flex flex-col justify-between">
                                        {!quizSubmitted ? (
                                            <>
                                                {/* Progress Bar */}
                                                <div className="flex items-center gap-3 mb-6">
                                                    <span className="text-xs font-bold text-amber-500">السؤال {quizStep + 1}</span>
                                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${((quizStep + 1) / activeChallenge.quiz.length) * 100}%` }}
                                                            className="h-full bg-amber-500"
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-500">{activeChallenge.quiz.length}</span>
                                                </div>

                                                {/* Question Card */}
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={quizStep}
                                                        initial={{ x: 20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        exit={{ x: -20, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <h3 className="text-xl font-bold mb-6 leading-relaxed">
                                                            {activeChallenge.quiz[quizStep].q}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {activeChallenge.quiz[quizStep].options.map((opt, optIdx) => (
                                                                <button
                                                                    key={optIdx}
                                                                    onClick={() => handleQuizOptionSelect(optIdx)}
                                                                    disabled={quizAnswers[quizStep] !== undefined} // Disable after selection
                                                                    className={`w-full text-right p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${quizAnswers[quizStep] === optIdx
                                                                        ? optIdx === activeChallenge.quiz![quizStep].answer
                                                                            ? 'bg-green-500/20 border-green-500 text-green-300' // Correct
                                                                            : 'bg-red-500/20 border-red-500 text-red-300' // Wrong
                                                                        : 'bg-slate-800/40 border-white/5 hover:bg-slate-800 hover:border-amber-500/50'
                                                                        }`}
                                                                >
                                                                    <span className="font-medium">{opt}</span>
                                                                    {quizAnswers[quizStep] === optIdx && (
                                                                        optIdx === activeChallenge.quiz![quizStep].answer
                                                                            ? <Check className="w-5 h-5" />
                                                                            : <X className="w-5 h-5" />
                                                                    )}
                                                                    {quizAnswers[quizStep] === undefined && <div className="w-3 h-3 rounded-full border border-slate-600 group-hover:border-amber-500" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                className="text-center py-8"
                                            >
                                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${quizScore >= Math.ceil(activeChallenge.quiz.length * 0.6) ? 'bg-green-500/10' : 'bg-red-500/10'
                                                    }`}>
                                                    {quizScore >= Math.ceil(activeChallenge.quiz.length * 0.6) ?
                                                        <Trophy className="w-12 h-12 text-green-500" /> :
                                                        <AlertCircle className="w-12 h-12 text-red-500" />
                                                    }
                                                </div>

                                                <h3 className="text-2xl font-bold mb-2">
                                                    {quizScore >= Math.ceil(activeChallenge.quiz.length * 0.6) ? 'أحسنت يا بطل! 🎉' : 'حاول مرة أخرى! 💪'}
                                                </h3>
                                                <p className="text-slate-400 mb-8">
                                                    لقد أجبت بشكل صحيح على <span className="text-amber-400 font-bold">{quizScore}</span> من أصل {activeChallenge.quiz.length}
                                                </p>

                                                {quizScore < Math.ceil(activeChallenge.quiz.length * 0.6) ? (
                                                    <Button onClick={() => {
                                                        setQuizSubmitted(false); setQuizStep(0); setQuizAnswers(new Array(activeChallenge.quiz!.length).fill(-1)); setQuizScore(0)
                                                    }} variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                                                        <ChevronRight className="w-4 h-4 ml-2" /> إعادة المحاولة
                                                    </Button>
                                                ) : (
                                                    <Button onClick={closeModal} className="w-full bg-green-500 hover:bg-green-600 text-black font-bold">
                                                        استلام الجائزة (+{activeChallenge.points} XP)
                                                    </Button>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {modalType === 'confirm' && (
                                    <div className="text-center py-6">
                                        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check className="w-10 h-10 text-amber-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{activeChallenge.confirmMessage}</h3>
                                        <p className="text-slate-400 mb-8">هل أنت متأكد من إتمامك لهذه المهمة؟ سيتم إضافة النقاط لرصيدك.</p>
                                        <div className="flex gap-4">
                                            <Button onClick={closeModal} variant="ghost" className="flex-1 hover:bg-white/5">إلغاء</Button>
                                            <Button onClick={handleConfirm} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold">تأكيد الإنجاز</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function CountdownDisplay({ timeLeft }: { timeLeft: any }) {
    return (
        <div className="flex gap-4 md:gap-8 px-4 md:px-8 py-2">
            {[
                { l: 'يوم', v: timeLeft.days },
                { l: 'ساعة', v: timeLeft.hours },
                { l: 'دقيقة', v: timeLeft.minutes },
                { l: 'ثانية', v: timeLeft.seconds }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-3xl md:text-5xl font-black font-mono text-white tabular-nums drop-shadow-lg">
                        {String(item.v).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold text-amber-500/80 uppercase tracking-widest">{item.l}</span>
                </div>
            ))}
        </div>
    )
}
