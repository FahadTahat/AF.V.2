"use client"

import { useState, useRef, useEffect } from "react"
import AuthGate from "@/components/auth-gate"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, Mic, Image as ImageIcon, Code, Sparkles, Bot, User,
    Loader2, Copy, Check, RefreshCcw, Download, Trash2, Paperclip, X,
    Terminal, ArrowRight, BrainCircuit, Brain, Cpu, Zap, Search, ShieldCheck, Layers, Settings2, FileSearch,
    MessageSquare, Globe, Lock, ChevronDown, ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// --- Components ---

const StatCard = ({ icon: Icon, value, label, delay }: { icon: any, value: string, label: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
    >
        <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
            <Icon size={24} />
        </div>
        <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">
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
        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Icon className="w-6 h-6 text-indigo-400" />
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
            className="w-full py-4 flex items-center justify-between text-right text-white hover:text-indigo-400 transition-colors"
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

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    image?: string;
}

const SUGGESTIONS = [
    {
        icon: Code,
        text: "اكتب لي كود React لعداد (counter)",
        description: "توليد كود نظيف واحترافي",
        category: "code",
        color: "blue"
    },
    {
        icon: Terminal,
        text: "ساعدني في تصحيح هذا الخطأ",
        description: "تحليل وتصحيح المشاكل البرمجية",
        category: "debug",
        color: "orange"
    },
    {
        icon: Sparkles,
        text: "اشرح لي مفهوم Async/Await",
        description: "تبسيط المفاهيم المعقدة",
        category: "explain",
        color: "purple"
    },
    {
        icon: ImageIcon,
        text: "حلل هذه الصورة برمجياً",
        description: "رؤية حاسوبية ذكية",
        category: "image",
        color: "emerald"
    },
]

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)
    const [interimInput, setInterimInput] = useState("")
    const [loadingStep, setLoadingStep] = useState(0)
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const chatRef = useRef<HTMLDivElement>(null)

    const AI_STEPS = [
        { icon: Search, text: "فحص وتحليل السؤال", color: "blue" },
        { icon: FileSearch, text: "البحث في المصادر البرمجية", color: "indigo" },
        { icon: ShieldCheck, text: "التحقق من المنطق والحلول", color: "emerald" },
        { icon: Layers, text: "نمذجة الإجابة النهائية", color: "purple" },
        { icon: Settings2, text: "مراجعة الجودة البرمجية", color: "pink" }
    ]

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const lastAssistantMessageRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const scrollToChat = () => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const scrollToAnswer = () => {
        lastAssistantMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
            const recognitionInstance = new SpeechRecognition()
            recognitionInstance.continuous = true
            recognitionInstance.interimResults = true
            recognitionInstance.lang = 'ar-SA'

            recognitionInstance.onresult = (event: any) => {
                let finalTranscript = ''
                let interimTranscript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript
                    } else {
                        interimTranscript += transcript
                    }
                }

                if (finalTranscript) {
                    setInput(prev => {
                        const base = prev.trim()
                        return base ? `${base} ${finalTranscript.trim()}` : finalTranscript.trim()
                    })
                    setInterimInput("")
                } else {
                    setInterimInput(interimTranscript)
                }
            }


            recognitionInstance.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsRecording(false)
            }

            recognitionInstance.onend = () => {
                setIsRecording(false)
            }

            setRecognition(recognitionInstance)
        }
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            setLoadingStep(0)
            const cinematicInterval = 2000 // Deep thinking pace (2.0s each)
            interval = setInterval(() => {
                setLoadingStep(prev => (prev < AI_STEPS.length - 1 ? prev + 1 : prev))
            }, cinematicInterval)
        }
        return () => clearInterval(interval)
    }, [isLoading])

    const toggleRecording = () => {
        if (!recognition) {
            alert('عذراً، متصفحك لا يدعم التعرف على الصوت.')
            return
        }

        if (isRecording) {
            recognition.stop()
            setIsRecording(false)
        } else {
            recognition.start()
            setIsRecording(true)
        }
    }

    const handleSend = async () => {
        if (!input.trim() && !selectedImage) return

        const userMessage: Message = {
            role: 'user',
            content: input,
            image: imagePreview || undefined
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const formData = new FormData()

            const messagesToSend = [
                {
                    role: 'system',
                    content: 'أنت AF AI v3.0، مساعد برمجيات ذكي وخبير في التطوير. إجاباتك يجب أن تكون دقيقة، احترافية، ومفصلة عند الحاجة. استخدم كتل كود Markdown مع تحديد اللغة. تحدث بالعربية بأسلوب تقني وودود.'
                },
                ...messages,
                { role: 'user', content: input }
            ]

            formData.append('messages', JSON.stringify(messagesToSend))

            if (selectedImage) {
                formData.append('image', selectedImage)
            }

            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response')
            }

            const aiMessage: Message = {
                role: 'assistant',
                content: data.content
            }

            setMessages(prev => [...prev, aiMessage])
            setSelectedImage(null)
            setImagePreview(null)

        } catch (err: any) {
            console.error(err)
            const errorMessage: Message = {
                role: 'assistant',
                content: `خطأ: ${err.message}`
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const renderMessage = (message: Message, index: number) => {
        const isUser = message.role === 'user'
        const parts = message.content.split(/(```[\s\S]*?```)/g)

        return (
            <motion.div
                key={index}
                ref={!isUser && index === messages.length - 1 ? lastAssistantMessageRef : null}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
                    : 'bg-[#1e293b] border border-white/10 shadow-black/20'
                    }`}>
                    {isUser ? <User size={24} className="text-white" /> : <BrainCircuit size={24} className="text-indigo-400" />}
                </div>

                <div className="flex-1 max-w-[85%] space-y-2">
                    {message.image && (
                        <div className="relative group">
                            <img
                                src={message.image}
                                alt="uploaded"
                                className="max-w-md rounded-2xl border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.02]"
                            />
                        </div>
                    )}

                    <div className={`rounded-2xl p-5 backdrop-blur-md shadow-xl ${isUser
                        ? 'bg-indigo-600/10 border border-indigo-500/20'
                        : 'bg-[#1e293b]/60 border border-white/10'
                        }`}>
                        {parts.map((part, i) => {
                            if (part.startsWith('```')) {
                                const codeMatch = part.match(/```(\w+)?\n([\s\S]*?)```/)
                                if (codeMatch) {
                                    const language = codeMatch[1] || 'javascript'
                                    const code = codeMatch[2].trim()

                                    return (
                                        <div key={i} className="relative my-3 rounded-xl overflow-hidden border border-white/10">
                                            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/10">
                                                <Badge variant="outline" className="text-xs">
                                                    {language}
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => copyToClipboard(code)}
                                                    className="h-7 px-2"
                                                >
                                                    {copiedCode === code ?
                                                        <Check size={14} className="text-emerald-400" /> :
                                                        <Copy size={14} />
                                                    }
                                                </Button>
                                            </div>
                                            <SyntaxHighlighter
                                                language={language}
                                                style={vscDarkPlus}
                                                customStyle={{
                                                    margin: 0,
                                                    borderRadius: 0,
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {code}
                                            </SyntaxHighlighter>
                                        </div>
                                    )
                                }
                            }

                            return part && <p key={i} className="text-slate-200 leading-relaxed whitespace-pre-wrap">{part}</p>
                        })}
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام المساعد الذكي" description="المساعد الذكي AF AI متاح فقط للمستخدمين المسجلين. سجّل دخولك للوصول إلى محادثات ذكية، تحليل أكواد، ودعم صوتي بالعربية.">
            <div className="min-h-screen pt-24 pb-20 bg-[#020617] text-white relative overflow-hidden font-sans" dir="rtl">
                {/* --- Animated Backgrounds --- */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 print:hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slower" />
                    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                {/* Listening Aesthetic Glow */}
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-0 pointer-events-none"
                        >
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slower" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="container relative z-10 px-4 md:px-6 mx-auto">

                    {/* --- Hero Section --- */}
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-4 animate-fade-in">
                                <Bot className="w-4 h-4 text-emerald-400" />
                                المحرك الذكي V3.0
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-tight">
                                مساعدك <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-shift">الذكي</span> المتطور
                            </h1>

                            <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
                                شريكك البرمجي المحترف. اسأل، اكتشف، وحلل الأكواد بدقة متناهية مع دعم للعربية والتعرف الصوتي.
                            </p>

                            <div className="pt-8">
                                <Button
                                    size="lg"
                                    onClick={scrollToChat}
                                    className="h-16 px-12 text-xl rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/20 font-bold transition-transform hover:scale-105"
                                >
                                    ابدأ المحادثة <MessageSquare className="mr-2 w-6 h-6 animate-pulse" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Main Chat Interface (Boxed) --- */}
                    <div ref={chatRef} className="max-w-6xl mx-auto mb-24 relative scroll-mt-28">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-40 animate-pulse-slow"></div>

                        <div className="relative z-10 bg-[#0b101b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[800px]">
                            {/* Top Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                            {/* Chat Header inside Box */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0b101b]/80 backdrop-blur-md sticky top-0 z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <BrainCircuit className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">AF AI Assistant</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-xs text-slate-400">متصل الآن</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setMessages([])}
                                    className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 gap-2 border border-white/5 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    <span className="hidden sm:inline">مسح المحادثة</span>
                                </Button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0b101b]">
                                {/* Suggestions (only show when empty) */}
                                {messages.length === 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto h-full content-center">
                                        {SUGGESTIONS.map((suggestion, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                onClick={() => setInput(suggestion.text)}
                                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-right group relative overflow-hidden backdrop-blur-sm"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-xl bg-${suggestion.color}-500/10 text-${suggestion.color}-400 group-hover:scale-110 transition-transform`}>
                                                        <suggestion.icon size={24} />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <h3 className="text-white font-bold group-hover:text-indigo-400 transition-colors">
                                                            {suggestion.text}
                                                        </h3>
                                                        <p className="text-sm text-slate-400">
                                                            {suggestion.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {messages.map((msg, i) => renderMessage(msg, i))}

                                {isLoading && (
                                    <div className="perspective-[2500px] w-full py-8 relative">
                                        {/* Cosmic Nebula Background (Global) */}
                                        <div className="absolute inset-0 -z-10 overflow-hidden rounded-[3rem]">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0],
                                                    filter: ["hue-rotate(0deg)", "hue-rotate(30deg)", "hue-rotate(0deg)"]
                                                }}
                                                transition={{ duration: 15, repeat: Infinity }}
                                                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.2),transparent_70%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.15),transparent_70%)] blur-3xl opacity-50"
                                            />
                                            <div className="absolute inset-0 bg-[#000208]" />
                                        </div>

                                        {/* Global Holographic Scan Line */}
                                        <motion.div
                                            animate={{ top: ["-10%", "110%"] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent blur-[4px] z-50 pointer-events-none"
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, rotateX: 30, scale: 0.8, y: 150 }}
                                            animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
                                            whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
                                            className="bg-[#010413]/98 border-2 border-indigo-500/50 rounded-[3rem] p-10 md:p-14 backdrop-blur-3xl shadow-[0_60px_200px_rgba(79,70,229,0.3)] relative overflow-hidden max-w-5xl mx-auto w-full group transform-gpu transition-all duration-700 ease-out"
                                            style={{ transformStyle: "preserve-3d" }}
                                        >
                                            {/* Omnipresent Background Systems */}
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                {/* Ultra-High-Speed Binary Rain */}
                                                <div className="absolute inset-0 flex justify-around opacity-[0.08] text-[7px] font-mono text-indigo-400/60 select-none">
                                                    {[...Array(30)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ y: ["-100%", "100%"] }}
                                                            transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: "linear" }}
                                                            className="whitespace-pre leading-none"
                                                        >
                                                            {Array(40).fill(0).map(() => Math.floor(Math.random() * 2)).join('\n')}
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Geometric Flux Grid */}
                                                <div className="absolute inset-0 opacity-[0.03]"
                                                    style={{ backgroundImage: "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

                                                {/* Floating Dust Particles */}
                                                {[...Array(30)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            x: [Math.random() * 1000, Math.random() * 1000 + 100],
                                                            y: [Math.random() * 800, Math.random() * 800 - 100],
                                                            opacity: [0, 0.4, 0]
                                                        }}
                                                        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity }}
                                                        className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                                                    />
                                                ))}
                                            </div>


                                            <div className="relative z-10 flex flex-col items-center gap-12">
                                                {/* Sovereign Intelligence Command Center */}
                                                <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-indigo-500/20 pb-10">
                                                    <div className="flex gap-6 items-center group/header">
                                                        <div className="relative">
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                                className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full blur-[15px] opacity-30 group-hover:opacity-60 transition-opacity"
                                                            />
                                                            <div className="w-16 h-16 bg-[#020617] rounded-[1.5rem] flex items-center justify-center border-2 border-indigo-400 p-3 relative z-10 shadow-2xl overflow-hidden">
                                                                <Brain size={32} className="text-white drop-shadow-[0_0_10px_#fff] z-10" />
                                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3">
                                                                <h1 className="text-xl font-black text-white tracking-widest italic flex items-center gap-3">
                                                                    المحرك_الذكي <span className="bg-white/10 px-3 py-1 rounded-xl text-[10px] not-italic border border-indigo-400/30 text-indigo-400 font-mono">V9.3</span>
                                                                </h1>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحليل_مستمر</span>
                                                                </div>
                                                                <div className="h-3 w-px bg-white/10" />
                                                                <span className="text-[8px] font-mono text-indigo-500/80 uppercase">الاتصال_آمن</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Dynamic Pulse Sensor Dashboard */}
                                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                                        <div className="flex justify-between items-center text-[8px] font-black text-indigo-400/80 uppercase tracking-widest">
                                                            <span>سلامة_البيانات</span>
                                                            <span className="bg-indigo-500/10 px-2 py-0.5 rounded text-white border border-indigo-500/20 text-[7px]">آمن_تماماً</span>
                                                        </div>
                                                        <div className="flex gap-1 h-10 items-end p-1.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 relative overflow-hidden">
                                                            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-indigo-500/20 to-transparent" />
                                                            {[...Array(30)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={{ height: [`${30 + Math.random() * 70}%`, `${30 + Math.random() * 70}%`] }}
                                                                    transition={{ duration: 0.2, repeat: Infinity, delay: i * 0.03 }}
                                                                    className="flex-1 bg-gradient-to-t from-indigo-600 via-indigo-400 to-purple-300 rounded-t-[1px] opacity-60"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Spectral Synthesis Flowchart */}
                                                <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 relative w-full py-8">
                                                    {AI_STEPS.map((step, i) => (
                                                        <div key={i} className="flex items-center">
                                                            <div className="relative flex flex-col items-center gap-6 group/step">
                                                                {/* Connection Girders */}
                                                                {i < AI_STEPS.length - 1 && (
                                                                    <div className="absolute top-10 -left-[4rem] w-[4rem] hidden lg:block">
                                                                        <div className="h-[2px] w-full bg-[#1e293b]/50 rounded-full relative overflow-hidden">
                                                                            <motion.div
                                                                                className="absolute h-full bg-indigo-500"
                                                                                initial={{ width: "0%" }}
                                                                                animate={{ width: loadingStep > i ? "100%" : "0%" }}
                                                                                transition={{ duration: 2.5, ease: "circOut" }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Radiant Intelligence Core */}
                                                                <div className="relative isolate">
                                                                    <motion.div
                                                                        animate={loadingStep === i ? {
                                                                            scale: [1, 1.1, 1],
                                                                            boxShadow: [
                                                                                "0 0 20px rgba(99,102,241,0.2)",
                                                                                "0 0 40px rgba(99,102,241,0.6)",
                                                                                "0 0 20px rgba(99,102,241,0.2)"
                                                                            ]
                                                                        } : {}}
                                                                        transition={{ duration: 2, repeat: Infinity }}
                                                                        className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700 relative z-20 ${loadingStep >= i
                                                                            ? `bg-[#010413] border-indigo-400 text-white`
                                                                            : 'bg-white/[0.01] border-white/10 text-slate-900 opacity-20'
                                                                            }`}
                                                                    >
                                                                        <step.icon size={32} className={`${loadingStep === i ? 'scale-110 drop-shadow-[0_0_20px_white] animate-pulse' : ''} transition-all duration-500`} />
                                                                    </motion.div>
                                                                </div>

                                                                <div className="text-center space-y-2">
                                                                    <motion.div
                                                                        animate={{
                                                                            opacity: loadingStep >= i ? 1 : 0.3,
                                                                            y: loadingStep >= i ? 0 : 5
                                                                        }}
                                                                        className="text-xs font-black text-white uppercase tracking-widest italic"
                                                                    >
                                                                        {step.text.split(' ')[0]}
                                                                    </motion.div>
                                                                    <div className={`text-[8px] font-mono px-3 py-1 rounded-lg border transition-all ${loadingStep >= i ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-white/5 text-slate-700'}`}>
                                                                        {step.text.split(' ').slice(1).join('_').toUpperCase()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Distributed Workstation Dashboard */}
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                                                    {/* Main Intelligence Monitor (Terminal) */}
                                                    <div className="lg:col-span-8 bg-[#000208] border border-indigo-500/20 rounded-[1.5rem] p-6 relative overflow-hidden group/monitor">
                                                        <div className="flex items-center justify-between mb-4 border-b border-indigo-500/10 pb-3">
                                                            <div className="flex items-center gap-3">
                                                                <Terminal size={14} className="text-indigo-400" />
                                                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic">تدفق_البيانات</h4>
                                                            </div>
                                                            <div className="flex gap-3 font-mono text-[7px] text-slate-500">
                                                                <span>تأخير الاستجابة: 0.12ms</span>
                                                            </div>
                                                        </div>

                                                        <div className="font-mono text-[9px] space-y-2 h-32 overflow-hidden">
                                                            {AI_STEPS.map((s, idx) => (
                                                                idx <= loadingStep && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        key={idx}
                                                                        className={`flex items-center gap-4 ${idx === loadingStep ? 'text-white' : 'text-slate-700'}`}
                                                                    >
                                                                        <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
                                                                        <span className="text-indigo-400 font-black"> {">"} </span>
                                                                        <span className="tracking-tighter">PROTO::EXEC::0x{idx}_{s.text.toUpperCase().replace(' ', '_')}</span>
                                                                    </motion.div>
                                                                )
                                                            ))}
                                                            {loadingStep < AI_STEPS.length && (
                                                                <div className="text-indigo-500/50 animate-pulse text-[9px] mt-2">
                                                                    CALIBRATING_NEURAL_VECTORS...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status Pillar (Master Stats) */}
                                                    <div className="lg:col-span-4 bg-indigo-600/5 border border-indigo-500/20 rounded-[1.5rem] p-6 flex flex-col justify-between items-center relative overflow-hidden">
                                                        <div className="text-center space-y-2 w-full relative z-10">
                                                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">مزامنة_النظام</span>
                                                            <div className="relative inline-block">
                                                                <span className="text-4xl font-black text-white italic tracking-tighter">
                                                                    {Math.round(((loadingStep + 1) / AI_STEPS.length) * 100)}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="w-full space-y-4">
                                                            <div className="w-full h-1.5 bg-black/80 rounded-full relative overflow-hidden border border-indigo-500/10">
                                                                <motion.div
                                                                    className="absolute inset-y-0 left-0 bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                                                                    animate={{ width: `${((loadingStep + 1) / AI_STEPS.length) * 100}%` }}
                                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                                />
                                                            </div>

                                                            <div className="flex items-center gap-2 bg-[#020617] px-3 py-1.5 rounded-lg border border-indigo-500/30 w-full justify-center">
                                                                <Cpu size={12} className="text-indigo-400 animate-spin-slow" />
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] font-black text-white tracking-widest uppercase">AF_Core</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area (Pinned to bottom of card) */}
                            <div className="p-4 border-t border-white/10 bg-[#0b101b]/80 backdrop-blur-md">
                                <div className="relative">
                                    {/* Recording Glow */}
                                    <AnimatePresence>
                                        {isRecording && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute -inset-4 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl z-0"
                                            />
                                        )}
                                    </AnimatePresence>
                                    <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur ${isRecording ? 'opacity-60 animate-pulse' : 'opacity-20 group-focus-within:opacity-40'} transition-opacity`}></div>

                                    <div className="relative bg-[#0f172a]/90 border border-white/10 rounded-2xl p-3 backdrop-blur-3xl shadow-2xl z-10">
                                        {imagePreview && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mb-3 p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center gap-3 w-fit"
                                            >
                                                <img src={imagePreview} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                                <span className="text-xs text-indigo-300 font-medium">تم إرفاق الصورة</span>
                                                <button onClick={() => { setSelectedImage(null); setImagePreview(null) }} className="hover:bg-white/10 p-1 rounded-full text-slate-400 hover:text-white transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </motion.div>
                                        )}

                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                handleSend()
                                            }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => document.getElementById('file-upload')?.click()}
                                                    className="text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
                                                >
                                                    <Paperclip size={20} />
                                                </Button>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageSelect}
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={toggleRecording}
                                                    className={isRecording ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/10 shrink-0'}
                                                >
                                                    <Mic size={20} />
                                                </Button>
                                            </div>

                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    placeholder={isRecording ? "جاري الاستماع..." : "اكتب رسالتك للمساعد الذكي..."}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-lg h-12"
                                                />
                                                {interimInput && <div className="absolute top-12 right-0 text-xs text-indigo-400">{interimInput}</div>}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isLoading || (!input && !selectedImage)}
                                                className={`rounded-xl h-12 px-6 transition-all duration-300 ${input || selectedImage ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                                            >
                                                {isLoading ?
                                                    <Loader2 className="w-5 h-5 animate-spin" /> :
                                                    <Send className={`w-5 h-5 ${input ? 'translate-x-1' : ''} transition-transform`} />
                                                }
                                            </Button>
                                        </form>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-medium">
                                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> آمن ومحمي 100%</span>
                                    <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> مدعوم بأحدث النماذج</span>
                                    <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /> دعم اللغة العربية</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Features Grid --- */}
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                        <FeatureCard
                            icon={Code}
                            title="تحليل الكود المتقدم"
                            desc="حلل واكتشف الأخطاء في الكود البرمجي الخاص بك مع شرح مفصل وتصحيح فوري."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={BrainCircuit}
                            title="توليد الخوارزميات"
                            desc="اطلب حلولاً خوارزمية معقدة بلغات برمجة متعددة مثل Python, Java, و C++."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={FileSearch}
                            title="شرح المفاهيم"
                            desc="شرح مبسط وعميق لأعقد المفاهيم التقنية والهندسية بأسلوب تفاعلي."
                            delay={0.6}
                        />
                    </div>

                    {/* --- FAQ Section --- */}
                    <div className="max-w-3xl mx-auto mb-20 bg-[#0b101b] border border-white/10 rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-center mb-10 text-white">الأسئلة الشائعة</h2>
                        <div className="space-y-2">
                            <FaqItem
                                question="ما هي قدرات AF AI Assistant؟"
                                answer="هذا المساعد مصمم ليكون شريكك التقني، حيث يمكنه تحليل الأكواد، شرح المفاهيم، حل المشكلات البرمجية، وحتى التعرف على محتويات الصور وتحليلها."
                                isOpen={openFaq === 0}
                                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                            />
                            <FaqItem
                                question="هل يدعم اللغة العربية بالكامل؟"
                                answer="نعم، تم تدريب النموذج وتخصيصه لفهم ومعالجة اللغة العربية واللهجات التقنية بكفاءة عالية."
                                isOpen={openFaq === 1}
                                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                            />
                            <FaqItem
                                question="كيف تعمل ميزة تحليل الصور؟"
                                answer="يمكنك رفع صورة تحتوي على كود برمجي أو مخطط هندسي، وسيقوم المساعد بتحليلها واستخراج المعلومات أو الكود منها وشرحه لك."
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
