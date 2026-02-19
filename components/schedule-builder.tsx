"use client"

import { useState, useEffect } from "react"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import {
    Clock, GripVertical, Plus, Trash2, Moon, Sun, Coffee,
    BookOpen, Dumbbell, Briefcase, Gamepad2, Users, BedDouble,
    Laptop, Activity, Utensils, HandHeart, Brain
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// --- Types ---

export interface TaskNode {
    id: string
    title: Record<string, string>
    icon: any
    color: string
}

export interface ScheduleItem {
    id: string
    hour: number // 0-23
    task: TaskNode | null
}

// --- Data ---

const AVAILABLE_TASKS: TaskNode[] = [
    { id: 'focus', title: { ar: 'جلسة تركيز (دراسة/عمل)', en: 'Deep Focus (Study/Work)' }, icon: Brain, color: 'bg-blue-600' },
    { id: 'gym', title: { ar: 'تمرين رياضي/جيم', en: 'Workout (Gym)' }, icon: Dumbbell, color: 'bg-red-500' },
    { id: 'walk', title: { ar: 'مشي / نشاط خفيف', en: 'Light Walk / Activity' }, icon: Activity, color: 'bg-emerald-500' },
    { id: 'meal', title: { ar: 'وجبة / غداء', en: 'Meal / Lunch' }, icon: Utensils, color: 'bg-orange-500' },
    { id: 'sleep', title: { ar: 'نوم', en: 'Sleep' }, icon: Moon, color: 'bg-indigo-900' },
    { id: 'morning', title: { ar: 'روتين صباحي', en: 'Morning Routine' }, icon: Sun, color: 'bg-amber-500' },
    { id: 'evening', title: { ar: 'روتين مسائي', en: 'Evening Routine' }, icon: BedDouble, color: 'bg-slate-500' },
    { id: 'break', title: { ar: 'استراحة', en: 'Break' }, icon: Coffee, color: 'bg-yellow-600' },
    { id: 'read', title: { ar: 'قراءة / مراجعة', en: 'Reading / Review' }, icon: BookOpen, color: 'bg-teal-600' },
    { id: 'project', title: { ar: 'مشروع جانبي', en: 'Side Project' }, icon: Laptop, color: 'bg-purple-600' },
    { id: 'family', title: { ar: 'وقت العائلة', en: 'Family Time' }, icon: HandHeart, color: 'bg-rose-500' },
    { id: 'social', title: { ar: 'وقت اجتماعي', en: 'Social' }, icon: Users, color: 'bg-pink-500' },
]

export function ScheduleBuilder({ lang = 'ar', initialSlots = [] }: { lang: 'ar' | 'en', initialSlots?: any[] }) {

    // Initialize Schedule
    const [schedule, setSchedule] = useState<ScheduleItem[]>([])

    // Parse Initial Slots on Mount
    useEffect(() => {
        // Basic 24h grid starting at 6 AM
        const baseSchedule = Array.from({ length: 24 }).map((_, i) => {
            const hour = (i + 6) % 24
            return { id: `slot-${hour}`, hour, task: null }
        }) as ScheduleItem[]

        // If we have AI suggestions, try to map them
        if (initialSlots.length > 0) {
            initialSlots.forEach(slot => {
                // Parse time string "7:00 AM" -> 7
                const timeParts = slot.time.split(/[: ]/) // ["7", "00", "AM"]
                let h = parseInt(timeParts[0])
                const ampm = timeParts[2]
                if (ampm === 'PM' && h !== 12) h += 12
                if (ampm === 'AM' && h === 12) h = 0

                // Find matching slot
                const targetSlotIndex = baseSchedule.findIndex(s => s.hour === h)
                if (targetSlotIndex !== -1) {
                    // Create a task object from the AI slot
                    const matchedTask = AVAILABLE_TASKS.find(t => t.title.ar === slot.activity || t.title.en === slot.activity)
                        || {
                        id: `custom-${slot.id}`,
                        title: { ar: slot.activity, en: slot.activity }, // fallback
                        icon: slot.icon,
                        color: slot.color
                    }

                    baseSchedule[targetSlotIndex].task = matchedTask
                }
            })
        }

        setSchedule(baseSchedule)
    }, [initialSlots])

    // Drag & Drop Handlers
    const handleDragStart = (e: React.DragEvent, task: TaskNode) => {
        e.dataTransfer.setData("taskId", task.id)
        e.dataTransfer.effectAllowed = "copy"
    }

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData("taskId")
        const task = AVAILABLE_TASKS.find(t => t.id === taskId)

        if (task) {
            const newSchedule = [...schedule]
            newSchedule[index] = { ...newSchedule[index], task }
            setSchedule(newSchedule)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
    }

    const clearSlot = (index: number) => {
        const newSchedule = [...schedule]
        newSchedule[index] = { ...newSchedule[index], task: null }
        setSchedule(newSchedule)
    }

    const formatTime = (h: number) => {
        const ampm = h >= 12 && h < 24 ? 'PM' : 'AM'
        const displayH = h % 12 || 12
        return `${displayH}:00 ${ampm}`
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 min-h-[800px] animate-in fade-in duration-700">

            {/* 🟢 SIDEBAR: NODES (Draggable Tasks) */}
            <Card className="w-full xl:w-96 bg-slate-950/50 border-white/10 p-6 flex flex-col gap-6 h-fit xl:sticky xl:top-24">
                <div className="text-center pb-4 border-b border-white/10">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-3">
                        <GripVertical className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {lang === 'ar' ? 'بنك المهام' : 'Task Nodes'}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                        {lang === 'ar'
                            ? 'اسحب المربعات (Nodes) وأفلتها في جدولك الزمني لترتيب يومك.'
                            : 'Drag these Nodes and drop them into your schedule to build your day.'}
                    </p>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                    <div className="grid grid-cols-2 gap-4 pb-4">
                        {AVAILABLE_TASKS.map((task) => (
                            <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                className={`
                  relative p-4 rounded-2xl cursor-grab active:cursor-grabbing
                  flex flex-col items-center justify-center gap-3 text-center
                  bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/50
                  transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group
                `}
                            >
                                <div className={`
                  p-3 rounded-full ${task.color.replace('bg-', 'bg-')}/20 
                  text-white group-hover:scale-110 transition-transform duration-300
                `}>
                                    <task.icon size={24} className={task.color.replace('bg-', 'text-').replace('500', '400').replace('600', '400')} />
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white">
                                    {task.title[lang]}
                                </span>

                                {/* Drag Handle Indicator */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50">
                                    <GripVertical size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* 🔵 MAIN AREA: SCHEDULE TABLE */}
            <Card className="flex-1 bg-slate-950/50 border-white/10 overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-slate-900/80 backdrop-blur z-10 flex flex-wrap gap-4 justify-between items-center sticky top-0">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Clock className="text-blue-400" size={28} />
                            {lang === 'ar' ? 'الجدول الزمني التفاعلي' : 'Interactive Schedule'}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            {lang === 'ar' ? 'قم ببناء يومك المثالي بالسحب والإفلات' : 'Build your perfect day with drag & drop'}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSchedule(schedule.map(s => ({ ...s, task: null })))}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                            <Trash2 size={16} className="mr-2" />
                            {lang === 'ar' ? 'تفريغ الجدول' : 'Clear All'}
                        </Button>
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                            onClick={() => window.print()}
                        >
                            {lang === 'ar' ? 'حفظ / طباعة' : 'Save / Print'}
                        </Button>
                    </div>
                </div>

                {/* The Grid */}
                <div className="flex-1 overflow-auto bg-[#0b101b]">
                    <div className="min-w-[500px]"> {/* Ensure min width for mobile scrolling */}
                        {schedule.map((slot, index) => (
                            <div
                                key={slot.id}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`
                  group flex items-stretch border-b border-white/5 transition-all duration-200
                  ${slot.task ? 'bg-blue-500/[0.02]' : 'hover:bg-white/[0.02]'}
                `}
                            >
                                {/* Time Column */}
                                <div className="w-24 md:w-32 py-4 px-4 border-r border-white/5 flex flex-col justify-center items-end bg-slate-950/30">
                                    <span className={`text-lg font-mono font-bold ${slot.task ? 'text-blue-400' : 'text-slate-500'}`}>
                                        {formatTime(slot.hour)}
                                    </span>
                                    <span className="text-xs text-slate-600 font-medium">
                                        {slot.hour >= 6 && slot.hour < 12 ? (lang === 'ar' ? 'صباحاً' : 'Morning') :
                                            slot.hour >= 12 && slot.hour < 18 ? (lang === 'ar' ? 'ظهراً' : 'Afternoon') :
                                                (lang === 'ar' ? 'مساءً' : 'Evening')}
                                    </span>
                                </div>

                                {/* Task Slot */}
                                <div className="flex-1 p-2 relative">
                                    {slot.task ? (
                                        <motion.div
                                            layoutId={`task-${slot.id}`}
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className={`
                        h-full flex items-center justify-between p-4 rounded-xl shadow-lg
                        bg-gradient-to-r ${slot.task.color.replace('bg-', 'from-').replace('500', '600').replace('600', '700')} to-slate-900/50
                        border-l-4 ${slot.task.color.replace('bg-', 'border-')}
                        group/task relative overflow-hidden
                      `}
                                        >
                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay"></div>

                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                                    <slot.task.icon size={20} className="text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-none mb-1">
                                                        {slot.task.title[lang]}
                                                    </h4>
                                                    <p className="text-xs text-white/60 font-medium">
                                                        {lang === 'ar' ? 'مهمة مجدولة' : 'Scheduled Task'}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => clearSlot(index)}
                                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/20 rounded-full transition-colors relative z-10"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full min-h-[80px] border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-slate-600/50 group-hover:border-blue-500/30 group-hover:text-blue-500/50 group-hover:bg-blue-500/5 transition-all duration-300">
                                            <span className="flex items-center gap-2 text-sm font-medium">
                                                <Plus size={16} />
                                                {lang === 'ar' ? 'أفلت المهمة هنا' : 'Drop Node Here'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

        </div>
    )
}
