"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export function RamadanDecorations() {
    const { language } = useLanguage()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
            {/* Top Right Lantern group */}
            <div className={`absolute top-0 ${language === 'ar' ? 'left-4' : 'right-4'} flex gap-4 md:gap-8`}>
                <Lantern delay={0} duration={3} scale={1} height={120} />
                <Lantern delay={1.5} duration={4} scale={0.8} height={90} />
                <Lantern delay={0.5} duration={3.5} scale={0.6} height={70} />
            </div>

            {/* Top Left Lantern group - smaller */}
            <div className={`absolute top-0 ${language === 'ar' ? 'right-4' : 'left-4'} flex gap-4 md:gap-8`}>
                <Lantern delay={1} duration={3.2} scale={0.7} height={80} />
                <Lantern delay={2} duration={4.5} scale={0.9} height={110} />
            </div>

            {/* Crescent Moon - Top Corner */}
            <motion.div
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`absolute top-8 ${language === 'ar' ? 'right-12' : 'left-12'} md:top-12 md:${language === 'ar' ? 'right-24' : 'left-24'}`}
            >
                <div className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        {/* Standard Crescent Shape */}
                        <path
                            d="M75 50c0 19.33-15.67 35-35 35 15-5 25-20 25-35s-10-30-25-35c19.33 0 35 15.67 35 35z"
                            fill="url(#moon-gradient)"
                            stroke="none"
                        />
                        <path
                            d="M40 15 C 65 15, 85 35, 85 60 C 85 70, 80 80, 75 85 C 85 75, 90 60, 90 50 C 90 25, 70 5, 45 5 C 40 5, 35 6, 30 8 C 35 10, 38 12, 40 15 Z"
                            fill="url(#moon-gradient)"
                            className="hidden" // Hiding this experimental path, using the one below
                        />
                        {/* High quality clean crescent */}
                        <path
                            d="M70 50C70 69.33 54.33 85 35 85C45 75 50 60 50 50C50 40 45 25 35 15C54.33 15 70 30.67 70 50Z"
                            fill="url(#moon-gradient)"
                        />
                        <defs>
                            <linearGradient id="moon-gradient" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FDE68A" />
                                <stop offset="1" stopColor="#D97706" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Stars around moon */}
                    <Star delay={0.2} x={-10} y={10} size={12} />
                    <Star delay={0.5} x={80} y={0} size={16} />
                    <Star delay={0.8} x={60} y={80} size={10} />
                </div>
            </motion.div>

            {/* Side Patterns/Decorations - Subtle Overlay */}
            <div className="absolute top-0 left-0 w-32 h-full opacity-30 pointer-events-none hidden md:block"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='none' stroke='%23F59E0B' stroke-opacity='0.1'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23F59E0B' fill-opacity='0.05'/%3E%3C/svg%3E\")" }}
            />
            <div className="absolute top-0 right-0 w-32 h-full opacity-30 pointer-events-none hidden md:block"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='none' stroke='%23F59E0B' stroke-opacity='0.1'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23F59E0B' fill-opacity='0.05'/%3E%3C/svg%3E\")" }}
            />
        </div>
    )
}

function Lantern({ delay, duration, scale, height }: { delay: number, duration: number, scale: number, height: number }) {
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: delay, ease: "easeOut" }}
            className="relative flex flex-col items-center origin-top transform-gpu"
        >
            {/* String */}
            <div className="w-[2px] bg-gradient-to-b from-amber-200/50 to-amber-500/80 h-full absolute top-0 left-1/2 -translate-x-1/2 z-0" style={{ height: height }} />

            {/* Lantern Body Container - Swings */}
            <motion.div
                animate={{ rotate: [2, -2, 2] }}
                transition={{ duration: duration, repeat: Infinity, ease: "easeInOut" }}
                style={{ marginTop: height }}
                className="relative z-10"
            >
                {/* Glow behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-500/20 blur-xl rounded-full animate-pulse-slow" />

                {/* Lantern SVG */}
                <svg
                    width="60"
                    height="100"
                    viewBox="0 0 60 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: `scale(${scale})` }}
                    className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                >
                    {/* Top Ring */}
                    <path d="M25 5H35V10H25V5Z" fill="#F59E0B" />

                    {/* Top Cap */}
                    <path d="M15 10L30 0L45 10H15Z" fill="#D97706" />
                    <path d="M15 10H45L40 20H20L15 10Z" fill="#B45309" />

                    {/* Glass Body */}
                    <path d="M20 20H40L45 60H15L20 20Z" fill="url(#glass-gradient)" stroke="#D97706" strokeWidth="1" />

                    {/* Inner Light */}
                    <circle cx="30" cy="40" r="8" fill="#FEF3C7" className="animate-pulse" />

                    {/* Bottom Base */}
                    <path d="M15 60H45L40 70H20L15 60Z" fill="#B45309" />
                    <path d="M25 70H35V80C35 82.76 32.76 85 30 85C27.24 85 25 82.76 25 80V70Z" fill="#D97706" />

                    <defs>
                        <linearGradient id="glass-gradient" x1="30" y1="20" x2="30" y2="60" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FDE68A" stopOpacity="0.4" />
                            <stop offset="0.5" stopColor="#FDE68A" stopOpacity="0.1" />
                            <stop offset="1" stopColor="#FDE68A" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>
        </motion.div>
    )
}

function Star({ delay, x, y, size }: { delay: number, x: number, y: number, size: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8], rotate: [0, 45, 0] }}
            transition={{ duration: 2, delay: delay, repeat: Infinity }}
            className="absolute text-amber-300"
            style={{ top: y, left: x }}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
        </motion.div>
    )
}
