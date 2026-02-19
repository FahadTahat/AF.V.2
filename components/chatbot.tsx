"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Calculator, BookOpen, Map, HelpCircle, ChevronRight, Zap, ImagePlus, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Message {
    role: "user" | "assistant"
    content: string
    timestamp: Date
    image?: string // Base64 encoded image
    imageUrl?: string // For display purposes
}

const QUICK_ACTIONS = [
    { label: "حساب المعدل", value: "كيف أحسب معدلي؟", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "الموارد التعليمية", value: "أين أجد المواد الدراسية؟", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "خارطة الطريق", value: "ما هي خارطة الطريق؟", icon: Map, color: "text-pink-400", bg: "bg-pink-500/10" },
    { label: "دليل الطالب", value: "أحتاج مساعدة في فهم النظام", icon: HelpCircle, color: "text-green-400", bg: "bg-green-500/10" },
]

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "أهلاً بك في **AF BTEC**! 👋\nأنا مساعدك الذكي المتطور.\n\nيمكنك الآن إرسال الصور لي! 📸\n\nكيف يمكنني خدمتك اليوم؟",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImages, setSelectedImages] = useState<Array<{ file: File, preview: string }>>([])
    const [isDragging, setIsDragging] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Handle image selection from file input
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const preview = e.target?.result as string
                        setSelectedImages(prev => [...prev, { file, preview }])
                    }
                    reader.readAsDataURL(file)
                }
            })
        }
    }

    // Handle paste event for images
    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile()
                if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const preview = e.target?.result as string
                        setSelectedImages(prev => [...prev, { file, preview }])
                    }
                    reader.readAsDataURL(file)
                }
            }
        }
    }

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const preview = e.target?.result as string
                        setSelectedImages(prev => [...prev, { file, preview }])
                    }
                    reader.readAsDataURL(file)
                }
            })
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSend = async (text: string = input) => {
        if ((!text.trim() && selectedImages.length === 0) || isLoading) return

        // Prepare user message with optional images
        const userMessage: Message = {
            role: "user",
            content: text || "📷 صورة",
            timestamp: new Date(),
            imageUrl: selectedImages.length > 0 ? selectedImages[0].preview : undefined,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Prepare images as base64
            const images = selectedImages.map(img => img.preview)

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text || "ما الذي تراه في هذه الصورة؟",
                    images: images, // إرسال الصور
                    history: messages // إرسال السجل القديم
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch response")
            }

            const assistantMessage: Message = {
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, assistantMessage])
            setSelectedImages([]) // Clear images after sending
        } catch (error) {
            console.error("Error:", error)
            const errorMessage: Message = {
                role: "assistant",
                content: error instanceof Error ? `عذراً، حدث خطأ: ${error.message}` : "حدث خطأ غير متوقع.",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Markdown-like renderer
    const renderContent = (content: string) => {
        return content.split('\n').map((line, i) => {
            // Bold
            const parts = line.split(/(\*\*.*?\*\*)/g)
            return (
                <div key={i} className="min-h-[1.2em]">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>
                        }
                        return <span key={j}>{part}</span>
                    })}
                </div>
            )
        })
    }

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, x: -20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: -20 }}
                        whileHover={{ y: -5 }}
                        className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-2 print:hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl text-xs text-white font-medium shadow-xl mb-1 flex items-center gap-2"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            كيف أساعدك اليوم؟
                        </motion.div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-100 animate-pulse duration-1000"></div>
                            <Button
                                onClick={() => setIsOpen(true)}
                                size="lg"
                                className="h-16 w-16 rounded-full bg-slate-900 border border-white/20 shadow-2xl group relative overflow-hidden p-0"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/20 to-slate-900/50 opacity-100 transition-opacity" />
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <Bot className="h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 left-6 z-50 w-[420px] max-w-[calc(100vw-2rem)]"
                    >
                        <Card className="h-[650px] max-h-[85vh] flex flex-col bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/5">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-primary/10 to-purple-600/10">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-transparent to-pink-500 opacity-50 animate-spin-slow"></div>
                                            <Bot className="h-6 w-6 text-white relative z-10" />
                                        </div>
                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-slate-950 rounded-full"></span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-sm">المساعد الذكي</h3>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/20">PRO</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                            مدعوم بـ GPT-4 & Gemini Flash
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {message.role === "assistant" && (
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Zap className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] rounded-2xl p-1 relative group ${message.role === "user"
                                                ? "bg-primary text-white shadow-lg shadow-primary/20 rounded-br-none"
                                                : "bg-slate-900 border border-white/5 text-slate-200 rounded-bl-none"
                                                }`}
                                        >
                                            {/* Image in Message */}
                                            {message.imageUrl && (
                                                <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                                                    <img src={message.imageUrl} alt="Uploaded content" className="max-w-full h-auto max-h-60 object-cover" />
                                                </div>
                                            )}

                                            <div className="px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                                {renderContent(message.content)}
                                            </div>
                                            <p className={`text-[9px] px-3 pb-1 opacity-50 font-medium ${message.role === "user" ? "text-primary-100" : "text-slate-500"}`}>
                                                {message.timestamp.toLocaleTimeString("ar-JO", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        {message.role === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3 justify-start"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Zap className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="bg-slate-900 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-xs text-slate-400">جاري الكتابة...</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Footer */}
                            <div
                                className={`p-4 bg-slate-950 border-t border-white/5 space-y-3 transition-colors ${isDragging ? "bg-primary/10 border-primary/50" : ""}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {/* Quick Actions */}
                                {messages.length < 3 && !isLoading && selectedImages.length === 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade disabled-scroll-control">
                                        {QUICK_ACTIONS.map((action, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleSend(action.value)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 text-xs font-medium whitespace-nowrap transition-colors ${action.bg} hover:border-white/10`}
                                            >
                                                <action.icon className={`h-3.5 w-3.5 ${action.color}`} />
                                                <span className="text-slate-200">{action.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* Image Previews */}
                                <AnimatePresence>
                                    {selectedImages.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="flex gap-2 overflow-x-auto pb-2"
                                        >
                                            {selectedImages.map((img, idx) => (
                                                <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                                                    <img src={img.preview} alt="Upload" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                    >
                                                        <XCircle className="w-5 h-5 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Drag Overlay Text */}
                                {isDragging && (
                                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-b-xl border-t border-primary/50 text-primary font-bold">
                                        افلت الصورة هنا للإرسال 📂
                                    </div>
                                )}

                                <div className="relative flex gap-2 items-end">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />

                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        onPaste={handlePaste}
                                        placeholder={selectedImages.length > 0 ? "أضف تعليقاً..." : "اكتب سؤالك أو الصق صورة..."}
                                        className="bg-slate-900 border-white/5 text-white placeholder:text-slate-500 min-h-[44px] py-3 pr-4 pl-12 rounded-xl focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none"
                                        disabled={isLoading}
                                    />

                                    {/* Upload Button */}
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-10 top-1 bottom-1 h-auto aspect-square rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                                        disabled={isLoading}
                                    >
                                        <ImagePlus className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        onClick={() => handleSend()}
                                        disabled={(!input.trim() && selectedImages.length === 0) || isLoading}
                                        className={`absolute left-1 top-1 bottom-1 h-auto aspect-square rounded-lg transition-all ${input.trim() || selectedImages.length > 0 ? "bg-primary text-white shadow-lg shadow-primary/25" : "bg-white/5 text-slate-500"}`}
                                        size="icon"
                                    >
                                        <Send className={`h-4 w-4 ${input.trim() || selectedImages.length > 0 ? "translate-x-0.5" : ""} transition-transform`} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
