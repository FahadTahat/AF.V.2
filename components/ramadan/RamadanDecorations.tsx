"use client"

import { motion } from "framer-motion"

export function RamadanDecorations() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Islamic Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            {/* Ambient Colors */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-900/10 rounded-full blur-[150px]" />

            {/* Hanging Lanterns - Top Left */}
            <motion.div
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 left-[10%] w-24 h-64 origin-top hidden md:block"
            >
                <div className="w-[1px] h-20 bg-amber-500/30 mx-auto" />
                <LanternSVGLarge />
            </motion.div>

            {/* Hanging Lanterns - Top Right (Smaller) */}
            <motion.div
                animate={{ rotate: [0, -3, 0, 3, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-16 right-[15%] w-16 h-48 origin-top hidden lg:block"
            >
                <div className="w-[1px] h-24 bg-amber-500/20 mx-auto" />
                <LanternSVGSmall />
            </motion.div>

            {/* Hanging Lanterns - Center Left (Medium) */}
            <motion.div
                animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -top-5 left-[5%] w-12 h-40 origin-top hidden md:block"
            >
                <div className="w-[1px] h-12 bg-amber-500/20 mx-auto" />
                <LanternSVGSmall />
            </motion.div>
        </div>
    )
}

function LanternSVGLarge() {
    return (
        <svg viewBox="0 0 100 160" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <path d="M50 0 L50 20" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
            {/* Top Cap */}
            <path d="M35 20 L65 20 L75 40 L25 40 Z" fill="url(#goldGradient)" />
            {/* Glass Body */}
            <path d="M25 40 L20 100 L80 100 L75 40 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
            {/* Inner Light */}
            <circle cx="50" cy="70" r="10" fill="#fbbf24" fillOpacity="0.8" filter="url(#glow)" className="animate-pulse" />
            {/* Bottom Base */}
            <path d="M30 100 L25 120 L75 120 L70 100 Z" fill="url(#goldGradient)" />
            <path d="M25 120 L50 145 L75 120 Z" fill="url(#goldGradient)" />

            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    )
}

function LanternSVGSmall() {
    return (
        <svg viewBox="0 0 80 120" className="w-full h-full drop-shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <path d="M40 0 L40 15" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
            <path d="M30 15 L50 15 L55 30 L25 30 Z" fill="url(#goldGradientSmall)" />
            <path d="M25 30 L20 80 L60 80 L55 30 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.5" />
            <circle cx="40" cy="55" r="6" fill="#fbbf24" fillOpacity="0.6" filter="url(#glowSmall)" className="animate-pulse" />
            <path d="M25 80 L20 95 L60 95 L55 80 Z" fill="url(#goldGradientSmall)" />

            <defs>
                <linearGradient id="goldGradientSmall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="glowSmall">
                    <feGaussianBlur stdDeviation="2" />
                </filter>
            </defs>
        </svg>
    )
}
