"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar, CheckCircle, Clock, Plus, Trash2,
    Book, FileText, Upload, MoreHorizontal, ArrowRight,
    LayoutGrid, List, Filter, Search, PieChart,
    AlertCircle, CheckSquare, Layers, FolderGit2,
    Trophy, Zap, Siren, Sparkles, ChevronRight, X,
    MousePointerClick, Star, GraduationCap, BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import AuthGate from "@/components/auth-gate"

// --- Types ---

interface Criterion {
    id: string
    type: 'P' | 'M' | 'D'
    text: string
    completed: boolean
}

interface Assignment {
    id: string
    title: string
    unit: string
    dueDate: string
    status: 'pending' | 'in-progress' | 'completed' | 'review'
    priority: 'low' | 'medium' | 'high'
    criteria: Criterion[]
    notes?: string
    progress: number
}

// --- Mock Data ---
const initialAssignments: Assignment[] = [
    {
        id: "1",
        title: "Database Design Project",
        unit: "Unit 3: Data Modelling",
        dueDate: "2026-03-15",
        status: "in-progress",
        priority: "high",
        progress: 50,
        criteria: [
            { id: "p1", type: "P", text: "Explain data normalization", completed: true },
            { id: "p2", type: "P", text: "Create ERD diagram", completed: true },
            { id: "m1", type: "M", text: "Justify data types used", completed: false },
            { id: "d1", type: "D", text: "Evaluate database optimization", completed: false }
        ]
    },
    {
        id: "2",
        title: "Network Security Audit",
        unit: "Unit 7: Cyber Security",
        dueDate: "2026-04-01",
        status: "pending",
        priority: "medium",
        progress: 0,
        criteria: [
            { id: "p3", type: "P", text: "Identify security threats", completed: false },
            { id: "m2", type: "M", text: "Analyze impact of threats", completed: false }
        ]
    },
    {
        id: "3",
        title: "Website Development",
        unit: "Unit 6: Web Dev",
        dueDate: "2026-02-28",
        status: "completed",
        priority: "high",
        progress: 100,
        criteria: [
            { id: "p4", type: "P", text: "Build HTML structure", completed: true },
            { id: "m3", type: "M", text: "Style with CSS", completed: true }
        ]
    }
]

// ── Onboarding Tour Steps ──
const TOUR_STEPS = [
    {
        icon: FolderGit2,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10",
        title: "مرحباً بك في مدير المشاريع! 🎉",
        description: "أداتك الذكية لإدارة جميع واجباتك ومشاريعك الدراسية في مكان واحد. سنأخذك في جولة سريعة لتتعرف على كل شيء.",
        highlight: null,
        tip: null
    },
    {
        icon: BarChart3,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10",
        title: "لوحة الإحصائيات",
        description: "في أعلى الصفحة ستجد بطاقات تعرض لك ملخصاً فورياً: عدد المشاريع الكلي، المكتملة، قيد التنفيذ، والعاجلة.",
        highlight: "stats",
        tip: "💡 الأرقام تتحدث تلقائياً كلما أضفت أو أنجزت مشروعاً"
    },
    {
        icon: Plus,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10",
        title: "إضافة مشروع جديد",
        description: "اضغط على زر \"مشروع جديد\" لإضافة واجبك. ستتمكن من تحديد اسم المشروع، المادة، تاريخ التسليم، الأولوية، ومعايير التقييم P/M/D.",
        highlight: "add-btn",
        tip: "💡 معايير P/M/D تساعدك على تتبع متطلبات BTEC بدقة"
    },
    {
        icon: CheckSquare,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10",
        title: "تتبع التقدم",
        description: "كل بطاقة مشروع تحتوي على قائمة مهام تفاعلية. اضغط على أي معيار لتحديده كمنجز، وسيتحدث شريط التقدم تلقائياً!",
        highlight: "cards",
        tip: "💡 عند إنجاز كل المعايير، يتحول المشروع تلقائياً إلى \"مكتمل\""
    },
    {
        icon: Search,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10",
        title: "البحث والفلترة",
        description: "استخدم شريط البحث للعثور على أي مشروع بسرعة، أو فلتر المشاريع حسب حالتها. يمكنك أيضاً التبديل بين عرض الشبكة والقائمة.",
        highlight: "filter",
        tip: "💡 شريط الأدوات مثبت في الأعلى دائماً لسهولة الوصول"
    },
]

export default function AssignmentTrackerPage() {
    const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // ── Onboarding Tour State ──
    const [showTour, setShowTour] = useState(false)
    const [tourStep, setTourStep] = useState(0)

    useEffect(() => {
        const seen = localStorage.getItem('af-btec-assignments-tour-done')
        if (!seen) {
            // Small delay so page renders first
            const t = setTimeout(() => setShowTour(true), 600)
            return () => clearTimeout(t)
        }
    }, [])

    const closeTour = () => {
        setShowTour(false)
        setTourStep(0)
        localStorage.setItem('af-btec-assignments-tour-done', 'true')
    }

    const nextTourStep = () => {
        if (tourStep < TOUR_STEPS.length - 1) {
            setTourStep(prev => prev + 1)
        } else {
            closeTour()
        }
    }

    // New Assignment State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
        title: "", unit: "", status: "pending", priority: "medium", criteria: []
    })
    const [newCriteriaText, setNewCriteriaText] = useState("")
    const [newCriteriaType, setNewCriteriaType] = useState<'P' | 'M' | 'D'>('P')

    // --- Stats Calculation ---
    const stats = useMemo(() => {
        const total = assignments.length
        const completed = assignments.filter(a => a.status === 'completed').length
        const inProgress = assignments.filter(a => a.status === 'in-progress').length
        const pending = assignments.filter(a => a.status === 'pending').length
        const highPriority = assignments.filter(a => a.priority === 'high' && a.status !== 'completed').length
        return { total, completed, inProgress, pending, highPriority }
    }, [assignments])

    // --- Helpers ---
    const getStatusColor = (status: Assignment['status']) => {
        switch (status) {
            case 'pending': return "text-slate-400 bg-slate-500/10 border-slate-500/20"
            case 'in-progress': return "text-blue-400 bg-blue-500/10 border-blue-500/20"
            case 'review': return "text-purple-400 bg-purple-500/10 border-purple-500/20"
            case 'completed': return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        }
    }

    const getPriorityColor = (priority: Assignment['priority']) => {
        switch (priority) {
            case 'low': return "bg-slate-500/20 text-slate-300"
            case 'medium': return "bg-orange-500/20 text-orange-300"
            case 'high': return "bg-red-500/20 text-red-300 animate-pulse-slow"
        }
    }

    const calculateProgress = (criteria: Criterion[]) => {
        if (!criteria || criteria.length === 0) return 0
        const completed = criteria.filter(c => c.completed).length
        return Math.round((completed / criteria.length) * 100)
    }

    const getDaysRemaining = (dateString: string) => {
        const due = new Date(dateString)
        const today = new Date()
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (diff < 0) return { text: `${Math.abs(diff)} أيام متأخرة`, color: "text-red-500 font-bold" }
        if (diff === 0) return { text: "اليوم!", color: "text-red-500 font-bold animate-pulse" }
        if (diff <= 3) return { text: `${diff} أيام متبقية`, color: "text-orange-400 font-bold" }
        return { text: `${diff} يوم متبقي`, color: "text-slate-400" }
    }

    // --- Actions ---
    const handleAddAssignment = () => {
        if (!newAssignment.title || !newAssignment.unit) {
            toast.error("يرجى تعبئة الحقول الأساسية")
            return
        }

        const assignment: Assignment = {
            id: Date.now().toString(),
            title: newAssignment.title!,
            unit: newAssignment.unit!,
            dueDate: newAssignment.dueDate || new Date().toISOString().split('T')[0],
            status: newAssignment.status as any || 'pending',
            priority: newAssignment.priority as any || 'medium',
            criteria: newAssignment.criteria || [],
            notes: newAssignment.notes,
            progress: calculateProgress(newAssignment.criteria || [])
        }

        setAssignments([assignment, ...assignments])
        setNewAssignment({ title: "", unit: "", status: "pending", priority: "medium", criteria: [] })
        setIsDialogOpen(false)
        toast.success("تم إضافة المشروع بنجاح")
    }

    const addCriteriaToNew = () => {
        if (!newCriteriaText) return
        const criteria: Criterion = {
            id: Date.now().toString(),
            type: newCriteriaType,
            text: newCriteriaText,
            completed: false
        }
        setNewAssignment(prev => ({
            ...prev,
            criteria: [...(prev.criteria || []), criteria]
        }))
        setNewCriteriaText("")
    }

    const toggleCriteria = (assignmentId: string, criteriaId: string) => {
        setAssignments(prev => prev.map(a => {
            if (a.id === assignmentId) {
                const updatedCriteria = a.criteria.map(c =>
                    c.id === criteriaId ? { ...c, completed: !c.completed } : c
                )
                const newProgress = calculateProgress(updatedCriteria)
                const newStatus = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'pending'

                if (newProgress === 100 && a.status !== 'completed') {
                    toast.success("🎉 أحسنت! اكتمل المشروع")
                }

                return { ...a, criteria: updatedCriteria, progress: newProgress, status: newStatus }
            }
            return a
        }))
    }

    const deleteAssignment = (id: string) => {
        setAssignments(prev => prev.filter(a => a.id !== id))
        toast.success("تم حذف المشروع")
    }

    // --- Filtered Data ---
    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.unit.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || a.status === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام مدير المشاريع" description="مدير المشاريع متاح فقط للمستخدمين المسجلين. سجّل دخولك لتنظيم واجباتك ومشاريعك الدراسية.">
            <div className="min-h-screen bg-[#020617] text-white pt-24 pb-12 px-4 md:px-8 font-sans relative overflow-hidden" dir="rtl">

                {/* Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* ══════════════════════════════════════════
                        ONBOARDING TOUR OVERLAY
                    ══════════════════════════════════════════ */}
                    <AnimatePresence>
                        {showTour && (() => {
                            const step = TOUR_STEPS[tourStep]
                            const StepIcon = step.icon
                            const isLast = tourStep === TOUR_STEPS.length - 1
                            return (
                                <motion.div
                                    key="tour-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                                >
                                    {/* Backdrop */}
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeTour} />

                                    {/* Tour Card */}
                                    <motion.div
                                        key={tourStep}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="relative z-10 w-full max-w-lg"
                                    >
                                        {/* Glow behind card */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-lg opacity-40" />

                                        <div className="relative bg-[#0b101b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                            {/* Top gradient bar */}
                                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                            {/* Progress dots */}
                                            <div className="flex items-center justify-between px-6 pt-5 pb-0">
                                                <div className="flex gap-2">
                                                    {TOUR_STEPS.map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setTourStep(i)}
                                                            className={cn(
                                                                "transition-all duration-300 rounded-full",
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
                                                    className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 pt-6">
                                                {/* Icon */}
                                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5", step.iconBg)}>
                                                    <StepIcon size={32} className={step.iconColor} />
                                                </div>

                                                {/* Step counter */}
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                    الخطوة {tourStep + 1} من {TOUR_STEPS.length}
                                                </div>

                                                {/* Title */}
                                                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
                                                    {step.title}
                                                </h2>

                                                {/* Description */}
                                                <p className="text-slate-300 text-base leading-relaxed mb-6">
                                                    {step.description}
                                                </p>

                                                {/* Tip box */}
                                                {step.tip && (
                                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                                                        <p className="text-blue-300 text-sm">{step.tip}</p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center justify-between gap-4">
                                                    <button
                                                        onClick={closeTour}
                                                        className="text-slate-500 hover:text-white text-sm transition-colors"
                                                    >
                                                        تخطي الجولة
                                                    </button>
                                                    <Button
                                                        onClick={nextTourStep}
                                                        size="lg"
                                                        className={cn(
                                                            "px-8 font-bold shadow-lg transition-all",
                                                            isLast
                                                                ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-500/20"
                                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20"
                                                        )}
                                                    >
                                                        {isLast ? (
                                                            <><CheckCircle size={18} className="ml-2" /> ابدأ الآن!</>
                                                        ) : (
                                                            <>التالي <ChevronRight size={18} className="mr-2" /></>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )
                        })()}
                    </AnimatePresence>

                    {/* ── Header ── */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                                    <FolderGit2 className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">مدير المشاريع</h1>
                            </div>
                            <p className="text-slate-400 max-w-lg">لوحة تحكم متكاملة لإدارة واجباتك ومشاريعك الدراسية وتتبع تقدمك.</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 border-0 h-12 text-md">
                                        <Plus className="ml-2 w-5 h-5" /> مشروع جديد
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#0f172a] border-white/10 text-white sm:max-w-[650px] p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                            <FolderGit2 className="text-blue-500" /> إضافة مشروع جديد
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-400">
                                            أضف تفاصيل مشروعك ومعايير التقييم لتتبع تقدمك بدقة.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-6 py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">اسم المشروع <span className="text-red-400">*</span></Label>
                                                <Input
                                                    value={newAssignment.title}
                                                    onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                                    className="bg-black/20 border-white/10 h-10 focus:border-blue-500"
                                                    placeholder="مثال: تصميم قاعدة بيانات"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">المادة / الوحدة <span className="text-red-400">*</span></Label>
                                                <Input
                                                    value={newAssignment.unit}
                                                    onChange={e => setNewAssignment({ ...newAssignment, unit: e.target.value })}
                                                    className="bg-black/20 border-white/10 h-10 focus:border-blue-500"
                                                    placeholder="مثال: الوحدة 3"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">تاريخ التسليم</Label>
                                                <Input
                                                    type="date"
                                                    value={newAssignment.dueDate}
                                                    onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                                    className="bg-black/20 border-white/10 h-10 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">الأولوية</Label>
                                                <Select onValueChange={(v) => setNewAssignment({ ...newAssignment, priority: v as any })}>
                                                    <SelectTrigger className="bg-black/20 border-white/10 h-10"><SelectValue placeholder="اختر الأولوية" /></SelectTrigger>
                                                    <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                                        <SelectItem value="low">🟡 عادي</SelectItem>
                                                        <SelectItem value="medium">🟠 متوسط</SelectItem>
                                                        <SelectItem value="high">🔴 عاجل</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <Label className="text-blue-300 font-semibold flex items-center gap-2">
                                                <List size={16} /> معايير التقييم (Criteria)
                                            </Label>
                                            <div className="flex gap-2">
                                                <Select value={newCriteriaType} onValueChange={(v: any) => setNewCriteriaType(v)}>
                                                    <SelectTrigger className="w-[80px] bg-black/40 border-white/10"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                                        <SelectItem value="P" className="text-green-400">P</SelectItem>
                                                        <SelectItem value="M" className="text-blue-400">M</SelectItem>
                                                        <SelectItem value="D" className="text-purple-400">D</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    value={newCriteriaText}
                                                    onChange={e => setNewCriteriaText(e.target.value)}
                                                    placeholder="نص المعيار..."
                                                    className="bg-black/40 border-white/10 flex-1"
                                                    onKeyDown={e => e.key === 'Enter' && addCriteriaToNew()}
                                                />
                                                <Button onClick={addCriteriaToNew} size="icon" className="bg-blue-600 hover:bg-blue-500"><Plus size={18} /></Button>
                                            </div>

                                            <ScrollArea className="h-[120px] w-full rounded-md border border-white/5 bg-black/20 p-2">
                                                {newAssignment.criteria?.length === 0 && (
                                                    <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
                                                        لم يتم إضافة معايير بعد
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    {newAssignment.criteria?.map(c => (
                                                        <div key={c.id} className="flex items-center gap-2 p-2 bg-[#1e293b] rounded-lg border border-white/5 animate-in slide-in-from-right-3">
                                                            <Badge variant="outline" className={`w-8 h-8 flex items-center justify-center rounded-full ${c.type === 'P' ? 'border-green-500 text-green-400 bg-green-500/10' : c.type === 'M' ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-purple-500 text-purple-400 bg-purple-500/10'}`}>
                                                                {c.type}
                                                            </Badge>
                                                            <span className="text-sm text-slate-200 flex-1">{c.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-white/5 hover:text-white">إلغاء</Button>
                                        <Button onClick={handleAddAssignment} className="bg-blue-600 hover:bg-blue-500 text-white px-8">حفظ</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* ── Stats Dashboard ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'إجمالي المشاريع', value: stats.total, icon: FolderGit2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'مكتملة', value: stats.completed, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'قيد التنفيذ', value: stats.inProgress, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                            { label: 'عالية الأولوية', value: stats.highPriority, icon: Siren, color: 'text-red-400', bg: 'bg-red-500/10 text-red-400 font-bold animate-pulse' },
                        ].map((stat, i) => (
                            <Card key={i} className="bg-[#0f172a]/60 border-white/5 backdrop-blur-md hover:bg-white/5 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium mb-1">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* ── Filter & Search Bar ── */}
                    <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-md sticky top-24 z-30 shadow-2xl">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <Input
                                placeholder="ابحث عن مشروع أو مادة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/20 border-white/10 rounded-xl pr-10 focus:bg-white/5 transition-all text-sm h-10"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><LayoutGrid size={16} /></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}><List size={16} /></button>
                            </div>
                            <div className="h-6 w-[1px] bg-white/10 mx-1" />
                            {[
                                { id: 'all', label: 'الكل' },
                                { id: 'pending', label: 'قيد الانتظار' },
                                { id: 'in-progress', label: 'جاري العمل' },
                                { id: 'completed', label: 'مكتمل' },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilterStatus(f.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterStatus === f.id ? 'bg-white/10 text-white border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Content Grid ── */}
                    <AnimatePresence mode="popLayout">
                        {filteredAssignments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                    <Sparkles size={40} className="text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">لا توجد مشاريع مطابقة</h3>
                                <p className="text-slate-400">جرب تغيير معايير البحث أو أضف مشروعاً جديداً.</p>
                            </motion.div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {filteredAssignments.map((assignment, index) => {
                                    const daysLeft = getDaysRemaining(assignment.dueDate)
                                    return (
                                        <motion.div
                                            key={assignment.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Card className={`
                                            group relative overflow-hidden bg-[#0f172a]/80 backdrop-blur-md border-white/10 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col
                                            ${viewMode === 'list' && 'flex-row items-stretch'}
                                        `}>
                                                {/* Top Status Bar */}
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${assignment.status === 'completed' ? 'from-emerald-500 to-green-400' : assignment.status === 'in-progress' ? 'from-blue-500 to-indigo-500' : 'from-slate-700 to-slate-600'}`} />

                                                <CardHeader className={`${viewMode === 'list' ? 'w-1/3 border-l border-white/5' : ''}`}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <Badge variant="outline" className={`rounded-lg px-2 py-1 text-[10px] ${getStatusColor(assignment.status)}`}>
                                                            {assignment.status === 'pending' ? 'Todo' : assignment.status === 'in-progress' ? 'In Progress' : 'Done'}
                                                        </Badge>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityColor(assignment.priority)}`}>
                                                                {assignment.priority} Priority
                                                            </span>
                                                            <button
                                                                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                                onClick={() => deleteAssignment(assignment.id)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-xl leading-tight mb-1 line-clamp-2">{assignment.title}</CardTitle>
                                                    <CardDescription className="text-slate-400 flex items-center gap-1.5 text-xs">
                                                        <Layers size={12} /> {assignment.unit}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className="flex-1 flex flex-col pt-0 md:pt-2">
                                                    {/* Date Info */}
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 bg-white/5 p-2 rounded-lg border border-white/5">
                                                        <Clock size={14} className={daysLeft.color.includes('red') ? 'text-red-400' : 'text-slate-400'} />
                                                        <span className={daysLeft.color}>{daysLeft.text}</span>
                                                        <span className="text-slate-600 mx-1">|</span>
                                                        <span className="text-xs font-mono">{new Date(assignment.dueDate).toLocaleDateString('en-GB')}</span>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex justify-between text-xs text-slate-300 font-medium">
                                                            <span>الإنجاز</span>
                                                            <span>{assignment.progress}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${assignment.progress}%` }}
                                                                className={`h-full rounded-full ${assignment.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Criteria List */}
                                                    <div className="mt-auto space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1 relative">
                                                        {assignment.criteria.length === 0 ? (
                                                            <p className="text-xs text-slate-500 italic text-center py-4">No criteria added</p>
                                                        ) : (
                                                            assignment.criteria.map(crit => (
                                                                <button
                                                                    key={crit.id}
                                                                    onClick={() => toggleCriteria(assignment.id, crit.id)}
                                                                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-right transition-all group/item border border-transparent
                                                                    ${crit.completed ? 'bg-emerald-500/5 text-slate-500 hover:bg-emerald-500/10' : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/10'}
                                                                `}
                                                                >
                                                                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all 
                                                                    ${crit.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600 bg-transparent group-hover/item:border-blue-400'}
                                                                `}>
                                                                        {crit.completed && <CheckCircle size={12} strokeWidth={3} />}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <Badge variant="outline" className={`h-4 min-w-[1.5rem] flex items-center justify-center p-0 text-[9px] ${crit.type === 'P' ? 'text-green-400 border-green-500/30' : crit.type === 'M' ? 'text-blue-400 border-blue-500/30' : 'text-purple-400 border-purple-500/30'}`}>
                                                                            {crit.type}
                                                                        </Badge>
                                                                        <span className={`text-xs truncate ${crit.completed && 'line-through opacity-60'}`}>{crit.text}</span>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </CardContent>

                                                {assignment.progress === 100 && (
                                                    <div className="absolute top-2 right-2 z-10">
                                                        <Trophy size={16} className="text-yellow-400 animate-bounce" />
                                                    </div>
                                                )}
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </AuthGate>
    )
}
