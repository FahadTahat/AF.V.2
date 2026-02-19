"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Unit } from "@/lib/schedule-data";
import TaskCircle from "./TaskCircle";
import { ArrowLeft, Laptop, Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface TimelineNodeProps {
    unit: Unit;
    index: number;
    color: string;
    isLast: boolean;
    gradeId: string;
}

export default function TimelineNode({ unit, index, color, isLast, gradeId }: TimelineNodeProps) {
    const isRight = index % 2 === 0;
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const handleTaskClick = (taskId: number) => {
        setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
    };

    const selectedTask = unit.tasks.find(t => t.id === selectedTaskId);

    return (
        <div className="relative flex items-stretch gap-0 py-2 group/node">
            {/* Right side content */}
            <div className="flex-1 flex justify-end items-center" style={{ marginRight: "-2.5rem", zIndex: 10 }}>
                {isRight ? (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative flex items-center w-full max-w-sm transition-all duration-300"
                    >
                        {/* Connector line - Map Style (Uneven Zigzag) */}
                        <svg className="absolute right-full mr-4 top-1/2 -translate-y-1/2 overflow-visible" width="60" height="30">
                            <path
                                d="M0 15 C 20 -5, 35 35, 60 15"
                                stroke={color}
                                strokeWidth="2"
                                fill="none"
                                strokeOpacity="0.4"
                                strokeDasharray="6 4"
                                strokeLinecap="round"
                            />
                            <circle cx="0" cy="15" r="3" fill={color} className="animate-pulse" />
                            <circle cx="60" cy="15" r="3" fill={color} className="animate-pulse" />
                            <circle r="3" fill={color}>
                                <animateMotion dur="3s" repeatCount="indefinite" path="M0 15 C 20 -5, 35 35, 60 15" />
                            </circle>
                            <circle r="5" fill={color} opacity="0.2">
                                <animateMotion dur="3s" repeatCount="indefinite" path="M0 15 C 20 -5, 35 35, 60 15" />
                            </circle>
                        </svg>

                        <div
                            className={`w-full rounded-2xl p-5 transition-all duration-500 relative backdrop-blur-xl border hover:scale-[1.02] group/card`}
                            style={{
                                background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                                borderColor: `${color}20`,
                                boxShadow: `0 10px 40px -10px ${color}15`
                            }}
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: `radial-gradient(400px circle at 50% 50%, ${color}15, transparent 40%)`
                                }}
                            />

                            <div className="relative flex items-center justify-between mb-4">
                                <h4 className="text-white font-bold text-lg leading-tight flex-1 tracking-tight drop-shadow-sm">
                                    {unit.name}
                                </h4>
                                <span
                                    className="mr-3 px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg shadow-black/20"
                                    style={{ background: `linear-gradient(45deg, ${color}, ${color}dd)` }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    U{unit.unitNumber}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap mb-3 p-2 rounded-xl bg-black/20 border border-white/5">
                                {unit.tasks.map((task) => (
                                    <TaskCircle
                                        key={task.id}
                                        task={task}
                                        color={color}
                                        unitName={unit.name}
                                        isSelected={selectedTaskId === task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {selectedTask && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-8 rounded-full" style={{ background: color }} />
                                                <div>
                                                    <h5 className="text-white font-bold text-sm">{selectedTask.name}</h5>
                                                    <p className="text-[10px] text-white/50">تفاصيل المهمة والمواعيد</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="rounded-xl p-3 bg-blue-500/10 border border-blue-500/20">
                                                    <div className="flex items-center gap-1.5 mb-1 text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                                                        <Calendar className="w-3 h-3" />
                                                        توزيع
                                                    </div>
                                                    <p className="text-white font-mono text-xs">{selectedTask.distributionDate}</p>
                                                </div>

                                                <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/20">
                                                    <div className="flex items-center gap-1.5 mb-1 text-red-400 text-[10px] uppercase font-bold tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        تسليم
                                                    </div>
                                                    <p className="text-white font-mono text-xs">{selectedTask.submissionDate}</p>
                                                </div>
                                            </div>

                                            <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/10 flex gap-3 mb-4">
                                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-amber-200/80 text-[11px] leading-relaxed">
                                                    يرجى الالتزام بالموعد النهائي لتجنب خصم الدرجات أو إعادة التقديم.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                                {unit.guideId && (
                                    <>
                                        <Link
                                            href={`/guide?tab=subjects&grade=${gradeId}&subject=${unit.guideId}`}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[11px] text-emerald-400 font-bold transition-all border border-emerald-500/20 hover:border-emerald-500/40"
                                        >
                                            <Laptop className="w-3.5 h-3.5" />
                                            <span>البرامج المطلوبة</span>
                                        </Link>

                                        <Link
                                            href={`/guide?tab=subjects&grade=${gradeId}&subject=${unit.guideId}`}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/90 hover:text-white transition-all border border-white/10 hover:border-white/30 group/link"
                                        >
                                            <span>تعرف على المزيد</span>
                                            <ArrowLeft className="w-3.5 h-3.5 group-hover/link:-translate-x-0.5 transition-transform" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : <div className="w-full max-w-sm" />}
            </div>

            {/* Center Node (Circuit Junction) */}
            <div className="relative flex flex-col items-center z-20 mx-6 h-full">
                <div className="relative flex-shrink-0 z-20">
                    <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="w-14 h-14 rounded-full flex items-center justify-center border-4 relative"
                        style={{
                            borderColor: `${color}40`,
                            background: "#0f172a",
                            boxShadow: `0 0 30px ${color}40`
                        }}
                    >
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: color }} />
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                            <span className="text-white font-bold text-sm tracking-tighter drop-shadow-md">{unit.unitNumber}</span>
                        </div>
                    </motion.div>

                    {/* Vertical Connecting Line - Map Style Wave */}
                    {!isLast && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-48 w-12 overflow-visible flex justify-center pointer-events-none">
                            <svg className="overflow-visible w-full h-full" viewBox="0 0 20 160" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id={`grad-${gradeId}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                                        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>
                                {/* Glow Path */}
                                <path
                                    d="M 10 0 C 25 40, -5 80, 10 160"
                                    stroke={color}
                                    strokeWidth="4"
                                    fill="none"
                                    strokeOpacity="0.15"
                                    className="blur-[2px]"
                                />
                                {/* Main Path */}
                                <path
                                    d="M 10 0 C 25 40, -5 80, 10 160"
                                    stroke={`url(#grad-${gradeId}-${index})`}
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray="4 6"
                                    strokeLinecap="round"
                                />
                                {/* Animated Particles */}
                                <circle r="3" fill={color} className="animate-pulse">
                                    <animateMotion dur="4s" repeatCount="indefinite" path="M 10 0 C 25 40, -5 80, 10 160" />
                                </circle>
                                <circle r="2" fill="white" opacity="0.5">
                                    <animateMotion dur="4s" repeatCount="indefinite" begin="2s" path="M 10 0 C 25 40, -5 80, 10 160" />
                                </circle>
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Left side content */}
            <div className="flex-1 flex justify-start items-center" style={{ marginLeft: "-2.5rem", zIndex: 10 }}>
                {!isRight ? (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative flex items-center w-full max-w-sm transition-all duration-300"
                    >
                        {/* Connector line - Map Style (Uneven Zigzag) */}
                        <svg className="absolute left-full ml-4 top-1/2 -translate-y-1/2 overflow-visible" width="60" height="30">
                            <path
                                d="M60 15 C 40 35, 25 -5, 0 15"
                                stroke={color}
                                strokeWidth="2"
                                fill="none"
                                strokeOpacity="0.4"
                                strokeDasharray="6 4"
                                strokeLinecap="round"
                            />
                            <circle cx="60" cy="15" r="3" fill={color} className="animate-pulse" />
                            <circle cx="0" cy="15" r="3" fill={color} className="animate-pulse" />
                            <circle r="3" fill={color}>
                                <animateMotion dur="3s" repeatCount="indefinite" path="M60 15 C 40 35, 25 -5, 0 15" />
                            </circle>
                            <circle r="5" fill={color} opacity="0.2">
                                <animateMotion dur="3s" repeatCount="indefinite" path="M60 15 C 40 35, 25 -5, 0 15" />
                            </circle>
                        </svg>

                        <div
                            className={`w-full rounded-2xl p-5 transition-all duration-500 relative backdrop-blur-xl border hover:scale-[1.02] group/card`}
                            style={{
                                background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                                borderColor: `${color}20`,
                                boxShadow: `0 10px 40px -10px ${color}15`
                            }}
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: `radial-gradient(400px circle at 50% 50%, ${color}15, transparent 40%)`
                                }}
                            />

                            <div className="relative flex items-center justify-between mb-4">
                                <span
                                    className="ml-3 px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg shadow-black/20"
                                    style={{ background: `linear-gradient(45deg, ${color}, ${color}dd)` }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    U{unit.unitNumber}
                                </span>
                                <h4 className="text-white font-bold text-lg leading-tight flex-1 tracking-tight drop-shadow-sm text-left">
                                    {unit.name}
                                </h4>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap mb-3 p-2 rounded-xl bg-black/20 border border-white/5">
                                {unit.tasks.map((task) => (
                                    <TaskCircle
                                        key={task.id}
                                        task={task}
                                        color={color}
                                        unitName={unit.name}
                                        isSelected={selectedTaskId === task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {selectedTask && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-8 rounded-full" style={{ background: color }} />
                                                <div>
                                                    <h5 className="text-white font-bold text-sm">{selectedTask.name}</h5>
                                                    <p className="text-[10px] text-white/50">تفاصيل المهمة والمواعيد</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="rounded-xl p-3 bg-blue-500/10 border border-blue-500/20">
                                                    <div className="flex items-center gap-1.5 mb-1 text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                                                        <Calendar className="w-3 h-3" />
                                                        توزيع
                                                    </div>
                                                    <p className="text-white font-mono text-xs">{selectedTask.distributionDate}</p>
                                                </div>

                                                <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/20">
                                                    <div className="flex items-center gap-1.5 mb-1 text-red-400 text-[10px] uppercase font-bold tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        تسليم
                                                    </div>
                                                    <p className="text-white font-mono text-xs">{selectedTask.submissionDate}</p>
                                                </div>
                                            </div>

                                            <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/10 flex gap-3 mb-4">
                                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-amber-200/80 text-[11px] leading-relaxed">
                                                    يرجى الالتزام بالموعد النهائي لتجنب خصم الدرجات أو إعادة التقديم.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                                {unit.guideId && (
                                    <>
                                        <Link
                                            href={`/guide?tab=subjects&grade=${gradeId}&subject=${unit.guideId}`}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[11px] text-emerald-400 font-bold transition-all border border-emerald-500/20 hover:border-emerald-500/40"
                                        >
                                            <Laptop className="w-3.5 h-3.5" />
                                            <span>البرامج المطلوبة</span>
                                        </Link>

                                        <Link
                                            href={`/guide?tab=subjects&grade=${gradeId}&subject=${unit.guideId}`}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/90 hover:text-white transition-all border border-white/10 hover:border-white/30 group/link"
                                        >
                                            <span>تعرف على المزيد</span>
                                            <ArrowLeft className="w-3.5 h-3.5 group-hover/link:-translate-x-0.5 transition-transform" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : <div className="w-full max-w-sm" />}
            </div>
        </div>
    );
}
