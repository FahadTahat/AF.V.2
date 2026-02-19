"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Play, Pause, RotateCcw, Volume2, Volume1, VolumeX, Maximize, Minimize,
    Headphones, CloudRain, Focus, Zap, X, Star, Cloud, Sun, Moon,
    Coffee, Wind, Droplets, Waves, Timer, Radio, Monitor, Leaf, Music, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import AuthGate from "@/components/auth-gate"

// --- Tracks Data ---
// Web Audio API - generates ambient sound in browser as ultimate fallback
function createAmbientSound(type: string, volume: number): AudioContext | null {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const gainNode = ctx.createGain()
        gainNode.gain.value = volume * 0.3
        gainNode.connect(ctx.destination)

        if (type === 'white-noise' || type === 'space' || type === 'cyber') {
            // White noise
            const bufferSize = ctx.sampleRate * 2
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
            const source = ctx.createBufferSource()
            source.buffer = buffer
            source.loop = true
            // Low-pass filter for softness
            const filter = ctx.createBiquadFilter()
            filter.type = 'lowpass'
            filter.frequency.value = type === 'cyber' ? 800 : type === 'space' ? 300 : 2000
            source.connect(filter)
            filter.connect(gainNode)
            source.start()
        } else if (type === 'rain') {
            // Pink noise (rain-like)
            const bufferSize = ctx.sampleRate * 2
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1
                b0 = 0.99886 * b0 + white * 0.0555179
                b1 = 0.99332 * b1 + white * 0.0750759
                b2 = 0.96900 * b2 + white * 0.1538520
                b3 = 0.86650 * b3 + white * 0.3104856
                b4 = 0.55000 * b4 + white * 0.5329522
                b5 = -0.7616 * b5 - white * 0.0168980
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
                b6 = white * 0.115926
            }
            const source = ctx.createBufferSource()
            source.buffer = buffer
            source.loop = true
            source.connect(gainNode)
            source.start()
        } else {
            // Binaural-like tone for lofi/forest/cafe
            const freq = type === 'lofi' ? 40 : type === 'forest' ? 60 : 80
            const osc1 = ctx.createOscillator()
            const osc2 = ctx.createOscillator()
            osc1.frequency.value = 200 + freq
            osc2.frequency.value = 200
            osc1.type = 'sine'
            osc2.type = 'sine'
            const g1 = ctx.createGain(); g1.gain.value = 0.1
            const g2 = ctx.createGain(); g2.gain.value = 0.1
            osc1.connect(g1); g1.connect(gainNode)
            osc2.connect(g2); g2.connect(gainNode)
            osc1.start(); osc2.start()
        }

        return ctx
    } catch (e) {
        console.error('Web Audio API failed:', e)
        return null
    }
}

const AMBIENCE_TRACKS = [
    {
        id: 'rain',
        name: 'مطــر غزير',
        desc: 'صوت المطر الغزير للتركيز العميق',
        color: 'from-blue-900 to-slate-900',
        icon: CloudRain,
        // Multiple fallback URLs
        urls: [
            'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
            'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/zapsplat_nature_rain_light_on_leaves_loop_001_40400.mp3',
        ],
        webAudioType: 'rain',
        theme: 'rain'
    },
    {
        id: 'forest',
        name: 'غابة طبيعية',
        desc: 'أصوات الطبيعة والطيور للاسترخاء',
        color: 'from-emerald-900 to-green-900',
        icon: Leaf,
        urls: [
            'https://assets.mixkit.co/active_storage/sfx/2516/2516-preview.mp3',
        ],
        webAudioType: 'forest',
        theme: 'forest'
    },
    {
        id: 'lofi',
        name: 'Lofi هادئ',
        desc: 'نغمات هادئة للدراسة والعمل',
        color: 'from-indigo-900 to-purple-900',
        icon: Headphones,
        urls: [
            'https://assets.mixkit.co/active_storage/sfx/2517/2517-preview.mp3',
        ],
        webAudioType: 'lofi',
        theme: 'lofi'
    },
    {
        id: 'space',
        name: 'أجواء الفضاء',
        desc: 'ضوضاء بيضاء كونية للعزل التام',
        color: 'from-violet-900 to-fuchsia-900',
        icon: Star,
        urls: [],
        webAudioType: 'space',
        theme: 'space'
    },
    {
        id: 'cafe',
        name: 'مقهى هادئ',
        desc: 'أجواء المقهى للإنتاجية الإبداعية',
        color: 'from-amber-900 to-orange-900',
        icon: Coffee,
        urls: [
            'https://assets.mixkit.co/active_storage/sfx/2518/2518-preview.mp3',
        ],
        webAudioType: 'cafe',
        theme: 'cafe'
    },
    {
        id: 'cyber',
        name: 'سايبر بانك',
        desc: 'أجواء رقمية مستقبلية للبرمجة',
        color: 'from-cyan-900 to-blue-900',
        icon: Monitor,
        urls: [],
        webAudioType: 'cyber',
        theme: 'cyber'
    }
]

export default function FocusZonePage() {
    const [isActive, setIsActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [initialTime, setInitialTime] = useState(25 * 60)
    const [mode, setMode] = useState<'focus' | 'break'>('focus')

    // Audio & Theme State
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
    const [activeTheme, setActiveTheme] = useState<string>('default')
    const [volume, setVolume] = useState([50])
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isAudioLoading, setIsAudioLoading] = useState(false)

    // Handle Track Change
    const handleTrackSelect = (trackId: string) => {
        if (currentTrackId === trackId) {
            // Stop audio
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.src = ''
            }
            setCurrentTrackId(null)
            setActiveTheme('default')
        } else {
            setCurrentTrackId(trackId)
            const track = AMBIENCE_TRACKS.find(t => t.id === trackId)
            if (track) setActiveTheme(track.theme)
        }
    }

    // Audio Playback Effect
    useEffect(() => {
        if (!currentTrackId) return

        const track = AMBIENCE_TRACKS.find(t => t.id === currentTrackId)
        if (!track) return

        // Stop previous audio
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ''
        }

        setIsAudioLoading(true)

        // Try each URL in order
        const tryUrls = async () => {
            for (const url of track.urls) {
                try {
                    const audio = new Audio()
                    audio.loop = true
                    audio.volume = isMuted ? 0 : volume[0] / 100
                    audio.src = url
                    await audio.play()
                    audioRef.current = audio
                    setIsAudioLoading(false)
                    return // success
                } catch (e) {
                    console.warn('URL failed:', url, e)
                }
            }

            // All URLs failed — use Web Audio API
            console.log('All URLs failed, using Web Audio API for:', track.webAudioType)
            const ctx = createAmbientSound(track.webAudioType, isMuted ? 0 : volume[0] / 100)
            if (ctx) {
                // Store context reference for cleanup
                ; (audioRef as any).webAudioCtx = ctx
            }
            setIsAudioLoading(false)
        }

        tryUrls()

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.src = ''
            }
            if ((audioRef as any).webAudioCtx) {
                ; (audioRef as any).webAudioCtx.close()
                    ; (audioRef as any).webAudioCtx = null
            }
        }
    }, [currentTrackId])

    // Volume/Mute Effect (separate from track change)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume[0] / 100
        }
    }, [volume, isMuted])

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => { });
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    // Theme Background Generator
    const renderBackground = () => {
        switch (activeTheme) {
            case 'rain':
                return (
                    <div className="absolute inset-0 bg-[#0f1016] overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-black" />
                        {/* CSS Rain Effect */}
                        {[...Array(60)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bg-blue-400/30 w-[1px] h-20 animate-rain"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `-${Math.random() * 20}%`,
                                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                )
            case 'space':
                return (
                    <div className="absolute inset-0 bg-[#050510] overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-black"></div>
                        {[...Array(50)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bg-white rounded-full animate-twinkle"
                                style={{
                                    width: Math.random() * 2 + 'px',
                                    height: Math.random() * 2 + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    animationDelay: Math.random() * 5 + 's',
                                    opacity: Math.random()
                                }}
                            />
                        ))}
                        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slower" />
                    </div>
                )
            case 'forest':
                return (
                    <div className="absolute inset-0 bg-[#051005] overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-green-900/10 to-black" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/forest.png')] opacity-5"></div>
                        {/* Fireflies */}
                        {[...Array(25)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-yellow-400/50 rounded-full blur-[2px] animate-float-particle"
                                style={{
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    animationDuration: 15 + Math.random() * 10 + 's',
                                    animationDelay: Math.random() * 5 + 's'
                                }}
                            />
                        ))}
                    </div>
                )
            case 'lofi':
                return (
                    <div className="absolute inset-0 bg-[#150a15] overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-pink-900/10 to-black" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
                        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[100px] animate-pulse-slow" />
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse-slower" />
                    </div>
                )
            case 'cafe':
                return (
                    <div className="absolute inset-0 bg-[#1a120b] overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/10 to-black" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/80" />
                        {/* Steam particles */}
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-20 h-20 bg-white/5 rounded-full blur-[30px] animate-steam"
                                style={{
                                    left: Math.random() * 100 + '%',
                                    bottom: -20 + '%',
                                    animationDuration: 8 + Math.random() * 5 + 's',
                                    animationDelay: Math.random() * 2 + 's'
                                }}
                            />
                        ))}
                    </div>
                )
            case 'cyber':
                return (
                    <div className="absolute inset-0 bg-[#000510] overflow-hidden transition-all duration-1000">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 background-size-[100%_2px,3px_100%] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-blue-900/10 to-black" />

                        {/* Grid */}
                        <div className="absolute bottom-0 w-full h-[50%] bg-[linear-gradient(to_right,#00bcd4_1px,transparent_1px),linear-gradient(to_bottom,#00bcd4_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] opacity-20 origin-bottom" />

                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" />
                    </div>
                )
            default:
                return (
                    <div className="absolute inset-0 bg-[#0f1016] transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900/10 to-black" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center opacity-10" />
                    </div>
                )
        }
    }

    const toggleTimer = () => setIsActive(!isActive)
    const resetTimer = () => { setIsActive(false); setTimeLeft(initialTime) }
    const setDuration = (mins: number) => {
        setInitialTime(mins * 60); setTimeLeft(mins * 60); setIsActive(false);
        setMode(mins > 15 ? 'focus' : 'break')
    }
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen();
        }
    }

    // Sync isFullscreen state with real browser fullscreen events
    useEffect(() => {
        const onFSChange = () => {
            const isFS = !!document.fullscreenElement
            setIsFullscreen(isFS)
            // Hide/show navbar by toggling body class
            if (isFS) {
                document.body.classList.add('fullscreen-focus-mode')
            } else {
                document.body.classList.remove('fullscreen-focus-mode')
            }
        }
        document.addEventListener('fullscreenchange', onFSChange)
        return () => {
            document.removeEventListener('fullscreenchange', onFSChange)
            document.body.classList.remove('fullscreen-focus-mode')
        }
    }, [])

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام منطقة التركيز" description="منطقة التركيز العميق متاحة فقط للمستخدمين المسجلين. سجّل دخولك للاستمتاع بمؤقت بومودورو والأصوات المحفزة.">
            <div className={`min-h-screen text-white relative overflow-hidden font-sans transition-all duration-700 ${isFullscreen ? 'p-0 flex items-center justify-center' : 'pt-24 pb-12 px-4'}`}>

                <audio ref={audioRef} loop crossOrigin="anonymous" />

                {/* Background Layer */}
                {renderBackground()}

                <div className={`relative z-20 w-full max-w-6xl mx-auto transition-all duration-500 ${isFullscreen ? 'scale-110' : ''}`}>

                    {!isFullscreen && (
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold mb-4 animate-fade-in backdrop-blur-md">
                                <Headphones className="w-4 h-4 text-emerald-400" />
                                منطقة التركيز العميق
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Focus</span> Zone
                            </h1>
                            <p className="text-slate-400 text-xl font-light">انغمس في أقصى درجات الإنتاجية مع المؤثرات الصوتية والبصرية المخصصة.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        {/* Timer Section */}
                        <div className={`lg:col-span-7 flex flex-col items-center justify-center transition-all duration-500 ${isFullscreen ? 'lg:col-span-12' : ''}`}>

                            {/* Fullscreen Timer Layout */}
                            <motion.div layout className="relative group mb-12">
                                {/* Animated Glow Rings */}
                                <div className={`absolute inset-0 rounded-full blur-[100px] opacity-40 transition-colors duration-1000 animate-pulse-slow
                                ${activeTheme === 'rain' ? 'bg-blue-600' :
                                        activeTheme === 'space' ? 'bg-violet-600' :
                                            activeTheme === 'forest' ? 'bg-emerald-600' :
                                                activeTheme === 'cafe' ? 'bg-orange-600' :
                                                    activeTheme === 'cyber' ? 'bg-cyan-600' : 'bg-indigo-600'}
                             `} />

                                {/* Timer Circle */}
                                <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border-8 border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col items-center justify-center shadow-2xl z-10 ring-1 ring-white/10">

                                    {/* Progress Indicator (Simplified Visual) */}
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-2">
                                        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                                        <circle
                                            cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="4"
                                            className={`${isActive ? 'text-white' : 'text-white/30'} transition-all duration-1000`}
                                            strokeDasharray="300%"
                                            strokeDashoffset={`${300 - (timeLeft / initialTime) * 300}%`}
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    <div className="space-y-4 text-center z-20">
                                        <Badge variant="outline" className={`px-4 py-1.5 text-lg border-white/10 uppercase tracking-[0.2em] font-light
                                        ${mode === 'focus' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}
                                    `}>
                                            {mode === 'focus' ? 'جلسة تركيز' : 'استراحة'}
                                        </Badge>

                                        <div className="text-8xl md:text-[10rem] font-mono font-bold tracking-tighter tabular-nums drop-shadow-lg leading-none">
                                            {formatTime(timeLeft)}
                                        </div>

                                        <div className="flex items-center gap-6 justify-center pt-4">
                                            <Button onClick={toggleTimer} size="icon" className="w-20 h-20 rounded-full bg-white text-black hover:bg-slate-200 hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                                {isActive ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
                                            </Button>
                                            <Button onClick={resetTimer} size="icon" variant="outline" className="w-16 h-16 rounded-full border-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-md">
                                                <RotateCcw size={24} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Presets */}
                            <div className={`flex gap-3 flex-wrap justify-center transition-opacity duration-300 ${isFullscreen && isActive ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                    {[25, 45, 60].map(m => (
                                        <Button
                                            key={m}
                                            variant={initialTime === m * 60 ? 'default' : 'ghost'}
                                            onClick={() => setDuration(m)}
                                            className={`rounded-xl px-6 ${initialTime === m * 60 ? 'bg-indigo-600 hover:bg-indigo-500' : 'hover:bg-white/10'}`}
                                        >
                                            {m} دقيقة
                                        </Button>
                                    ))}
                                </div>
                                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                    {[5, 10, 15].map(m => (
                                        <Button
                                            key={m}
                                            variant={initialTime === m * 60 ? 'default' : 'ghost'}
                                            onClick={() => setDuration(m)}
                                            className={`rounded-xl px-4 ${initialTime === m * 60 ? 'bg-emerald-600 hover:bg-emerald-500' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                                        >
                                            {m} راحة
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Controls & Themes Sidebar */}
                        {!isFullscreen && (
                            <div className="lg:col-span-5 space-y-6">

                                {/* Theme Selector */}
                                <div className="bg-[#0b101b]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                    <div className="flex justify-between items-center mb-6 relative z-10">
                                        <div>
                                            <h3 className="font-bold text-xl flex items-center gap-2 mb-1">
                                                <Music size={20} className="text-indigo-400" />
                                                مكتبة الأصوات
                                            </h3>
                                            <p className="text-sm text-slate-400">اختر الخلفية الصوتية المناسبة لتركيزك</p>
                                        </div>
                                        <Button size="icon" variant="outline" onClick={handleFullscreen} className="h-10 w-10 text-white border-white/10 hover:bg-white/10 rounded-xl" title="Full Screen">
                                            <Maximize size={18} />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                                        {AMBIENCE_TRACKS.map(track => {
                                            const isSelected = currentTrackId === track.id;
                                            return (
                                                <button
                                                    key={track.id}
                                                    onClick={() => handleTrackSelect(track.id)}
                                                    className={`
                                                    relative w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 overflow-hidden group/btn text-right border
                                                    ${isSelected ? 'border-white/30 bg-white/10 shadow-lg' : 'border-transparent hover:bg-white/5 hover:border-white/10'}
                                                `}
                                                >
                                                    <div className={`absolute inset-0 bg-gradient-to-r ${track.color} opacity-0 group-hover/btn:opacity-10 transition-opacity`} />

                                                    {/* Icon Box */}
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-white text-black scale-110' : 'bg-white/5 text-slate-400 group-hover/btn:text-white'}`}>
                                                        <track.icon size={22} className={isSelected ? 'animate-pulse' : ''} />
                                                    </div>

                                                    <div className="flex-1 relative z-10 flex flex-col items-start gap-0.5">
                                                        <span className={`font-bold text-base ${isSelected ? 'text-white' : 'text-slate-300'}`}>{track.name}</span>
                                                        <span className="text-[11px] text-slate-500 font-light">{track.desc}</span>
                                                    </div>

                                                    {/* Playing Indicator */}
                                                    {isSelected ? (
                                                        isAudioLoading ? (
                                                            <Loader2 size={18} className="animate-spin text-yellow-400" />
                                                        ) : (
                                                            <div className="flex gap-1 items-end h-5">
                                                                <div className="w-1 bg-emerald-400 animate-music-bar-1 h-3" />
                                                                <div className="w-1 bg-emerald-400 animate-music-bar-2 h-5" />
                                                                <div className="w-1 bg-emerald-400 animate-music-bar-3 h-4" />
                                                                <div className="w-1 bg-emerald-400 animate-music-bar-1 h-3" />
                                                            </div>
                                                        )
                                                    ) : (
                                                        <Play size={16} className="text-slate-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Volume Control */}
                                    <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                                        <div className="flex gap-4 items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                                            <button
                                                onClick={() => setIsMuted(!isMuted)}
                                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                {isMuted ? <VolumeX size={20} className="text-rose-400" /> : <Volume2 size={20} className="text-emerald-400" />}
                                            </button>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between text-xs font-medium text-slate-400">
                                                    <span>مستوى الصوت</span>
                                                    <span>{isMuted ? 'Muted' : `${volume}%`}</span>
                                                </div>
                                                <Slider
                                                    value={isMuted ? [0] : volume}
                                                    max={100}
                                                    step={1}
                                                    onValueChange={setVolume}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Exit Fullscreen Floating Button - always visible above everything */}
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3"
                    >
                        <div className="bg-black/70 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20 text-white/90 font-mono text-sm flex items-center gap-3 shadow-2xl">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span>وضع التركيز الكامل</span>
                            <div className="w-px h-4 bg-white/20" />
                            <button
                                onClick={handleFullscreen}
                                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                            >
                                <Minimize size={16} className="group-hover:scale-110 transition-transform" />
                                <span className="text-xs">خروج</span>
                            </button>
                            <kbd className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded border border-white/10">ESC</kbd>
                        </div>
                    </motion.div>
                )}
            </div>
        </AuthGate>
    )
}
