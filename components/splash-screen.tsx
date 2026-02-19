"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function SplashScreen() {
    const [isMounted, setIsMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        setIsMounted(true)
        // Check if splash screen has already been shown in this session
        const hasShownSplash = sessionStorage.getItem("hasShownSplash")

        if (hasShownSplash) {
            setIsVisible(false)
            return
        }

        // Set timeout to hide splash screen after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false)
            sessionStorage.setItem("hasShownSplash", "true")
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }} // Changed from 0 to 1 for INSTANT appearance
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
                >
                    {/* Cinematic Background Effects */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-80" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[80px] animate-pulse-slower delay-75" />

                        {/* Particles */}
                        <div className="absolute inset-0 opacity-30">
                            {/* We can use CSS based particles or a simple SVG overlay here for performance */}
                            <div className="particle w-1 h-1 bg-white absolute top-1/4 left-1/4 rounded-full animate-float-particle" style={{ animationDelay: '0.1s' }}></div>
                            <div className="particle w-1.5 h-1.5 bg-blue-400 absolute top-3/4 left-1/3 rounded-full animate-float-particle" style={{ animationDelay: '0.5s' }}></div>
                            <div className="particle w-1 h-1 bg-pink-400 absolute top-1/3 left-3/4 rounded-full animate-float-particle" style={{ animationDelay: '0.8s' }}></div>
                            <div className="particle w-2 h-2 bg-white absolute top-2/3 left-2/3 rounded-full animate-float-particle" style={{ animationDelay: '1.2s' }}></div>
                            <div className="particle w-1 h-1 bg-blue-300 absolute top-1/2 left-1/2 rounded-full animate-float-particle" style={{ animationDelay: '1.5s' }}></div>
                        </div>
                    </div>

                    {/* Lens Flare / Light Flash Effect */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 2],
                            rotate: [-45, 0, 45]
                        }}
                        transition={{ duration: 2.5, times: [0, 0.5, 1], ease: "easeInOut" }}
                        className="absolute z-10 w-[200%] h-[20px] bg-white blur-[50px] pointer-events-none"
                    />

                    {/* Ramadan Decorations for Splash Screen */}
                    <div className="absolute inset-0 z-30 pointer-events-none">
                        {/* Top Right Lanterns */}
                        <motion.div
                            initial={{ y: -150 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            className="absolute top-0 right-10 flex gap-4"
                        >
                            <svg width="60" height="120" viewBox="0 0 60 120" className="drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                                <rect x="29" width="2" height="40" fill="#F59E0B" />
                                <path d="M15 50L30 40L45 50H15Z" fill="#D97706" />
                                <path d="M20 60H40L45 100H15L20 60Z" fill="url(#lantern-grad-splash)" stroke="#D97706" />
                                <path d="M15 100H45L40 110H20L15 100Z" fill="#B45309" />
                                <defs>
                                    <linearGradient id="lantern-grad-splash" x1="30" y1="60" x2="30" y2="100" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FDE68A" stopOpacity="0.8" />
                                        <stop offset="1" stopColor="#D97706" stopOpacity="0.8" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>

                        {/* Top Left Crescent */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="absolute top-10 left-10 w-24 h-24 opacity-80"
                        >
                            <svg viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                                <path
                                    d="M70 50C70 69.33 54.33 85 35 85C45 75 50 60 50 50C50 40 45 25 35 15C54.33 15 70 30.67 70 50Z"
                                    fill="#FDE68A"
                                />
                            </svg>
                        </motion.div>

                        {/* Decorative Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
                        >
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-lg font-tajawal">
                                رمضان كريم
                            </span>
                        </motion.div>
                    </div>

                    {/* Logo Container */}
                    <div className="relative z-20 flex flex-col items-center justify-center p-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
                        >
                            {/* High Voltage Lightning Container - Jitters with electricity */}
                            <div className="absolute inset-0 z-0 pointer-events-none overflow-visible animate-electric-jitter">
                                <svg className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150" viewBox="0 0 200 200">
                                    <path className="lightning-bolt" d="M100,20 L95,40 L105,50 L90,70 L110,80 L100,100" style={{ animationDelay: '0.1s', stroke: '#d946ef' }} />
                                    <path className="lightning-bolt" d="M100,180 L105,160 L95,150 L110,130 L90,120 L100,100" style={{ animationDelay: '0.5s', stroke: '#a855f7' }} />
                                    <path className="lightning-bolt" d="M20,100 L40,105 L50,95 L70,110 L80,90 L100,100" style={{ animationDelay: '1.2s', stroke: '#ec4899' }} />
                                    <path className="lightning-bolt" d="M180,100 L160,95 L150,105 L130,90 L120,110 L100,100" style={{ animationDelay: '0.8s', stroke: '#8b5cf6' }} />

                                    <path className="lightning-bolt" d="M100,100 L70,40 L60,60 L30,20" style={{ animationDelay: '1.5s', stroke: '#d946ef', opacity: 0.7 }} />
                                    <path className="lightning-bolt" d="M100,100 L130,160 L140,140 L170,180" style={{ animationDelay: '0.3s', stroke: '#a855f7', opacity: 0.7 }} />
                                </svg>
                            </div>

                            {/* Sharp Sparks - Jitters with electricity */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-electric-jitter">
                                {isMounted && [...Array(30)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="spark"
                                        style={{
                                            "--x": `${(Math.random() - 0.5) * 600}px`,
                                            "--y": `${(Math.random() - 0.5) * 600}px`,
                                            "--s": `${Math.random() * 1.5 + 0.5}`,
                                            "--d": `${Math.random() * 0.3 + 0.2}s`, // Faster sparks
                                            "--r": `${Math.random() * 360}deg`, // Rotation for jagged look
                                            animationDelay: `${Math.random() * 2}s`,
                                            backgroundColor: i % 3 === 0 ? "#fff" : i % 2 === 0 ? "#d946ef" : "#a855f7",
                                        } as any}
                                    />
                                ))}
                            </div>

                            {/* Central Glow and Logo - STABLE (No Jitter) */}
                            <div className="relative z-10">
                                <div className="absolute inset-0 bg-purple-600/40 blur-[50px] rounded-full scale-125 animate-pulse-faster" />
                                <div className="relative w-64 h-64 md:w-96 md:h-96 animate-electric-flash">
                                    <Image
                                        src="/logo-full.png"
                                        alt="AF BTEC Logo"
                                        fill
                                        className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                                        priority
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Owner Name */}
                        <div className="text-center space-y-2 mt-4 overflow-hidden">
                            {/* AF BTEC text removed as it is in the logo */}

                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.8, ease: "easeInOut" }}
                                className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto my-4"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="flex items-center justify-center gap-2"
                            >
                                <span className="text-slate-400 text-sm md:text-base font-light tracking-widest uppercase">Owner</span>
                                <span className="text-white text-lg md:text-2xl font-bold drop-shadow-md font-tajawal">أحمد الفقية</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
