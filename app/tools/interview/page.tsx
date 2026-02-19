"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Mic, Send, User, Bot, Pause, ChevronRight, Loader2, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card" // Fixed import
import AuthGate from "@/components/auth-gate"

const SPECIALTIES = [
    { id: 'it', name: 'تكنولوجيا المعلومات (IT)', icon: '💻', prompt: "You are an expert IT interviewer conducting a technical interview for a Junior Developer role. Focus on coding skills, problem-solving, and web technologies." },
    { id: 'business', name: 'إدارة الأعمال (Business)', icon: '💼', prompt: "You are a senior Business Manager interviewing a candidate for a Business Analyst position. Focus on strategy, market analysis, and soft skills." },
    { id: 'engineering', name: 'الهندسة (Engineering)', icon: '⚙️', prompt: "You are a Lead Engineer conducting a technical interview. Focus on engineering principles, project management, and technical problem solving." },
    { id: 'creative', name: 'الإعلام الرقمي (Creative)', icon: '🎨', prompt: "You are a Creative Director interviewing a designer. Focus on portfolio, creative process, and design thinking." },
    { id: 'soft_skills', name: 'مقابلة عامة (General)', icon: '🗣️', prompt: "You are an HR Manager conducting a general behavioral interview. Focus on communication, teamwork, and career goals." },
]

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function InterviewPrepPage() {
    const [step, setStep] = useState<'select' | 'interview' | 'feedback'>('select')
    const [specialty, setSpecialty] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<string>('')
    const [userAnswer, setUserAnswer] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [questionCount, setQuestionCount] = useState(0)
    const [error, setError] = useState<string | null>(null)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, feedback])

    const startInterview = async (specId: string) => {
        const spec = SPECIALTIES.find(s => s.id === specId)
        if (!spec) return

        setSpecialty(specId)
        setStep('interview')
        setQuestionCount(0)
        setMessages([])
        setCurrentQuestion('')
        setFeedback(null)
        setUserAnswer('')
        setError(null)
        setIsLoading(true)

        try {
            const initialMessages: Message[] = [
                { role: 'system', content: `${spec.prompt} Start by briefly introducing yourself and asking the first interview question. Keep your responses concise. Do NOT number the questions.` }
            ]

            const response = await fetch('/api/chat-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: initialMessages })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to start interview')
            }

            const aiMessage = data.content
            setMessages([...initialMessages, { role: 'assistant', content: aiMessage }])
            setCurrentQuestion(aiMessage)
            setQuestionCount(1)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim()) return

        const newMessages = [
            ...messages,
            { role: 'user', content: userAnswer } as Message
        ]

        setMessages(newMessages)
        setUserAnswer('')
        setIsLoading(true)
        setFeedback(null) // Hide previous feedback while loading next

        try {
            // Determine prompt based on progress
            const isFinal = questionCount >= 5
            const systemInstruction = isFinal
                ? "This was the last answer. Provide a comprehensive evaluation of the candidate's performance based on all their answers. Highlight strengths and areas for improvement. Do not ask any more questions. End freely."
                : "Evaluate the candidate's answer briefly (positive/constructive feedback), then ask the next relevant interview question. Do not number the questions."

            const response = await fetch('/api/chat-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        ...newMessages,
                        { role: 'system', content: systemInstruction }
                    ]
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response')
            }

            const aiResponse = data.content
            const updatedMessages = [...newMessages, { role: 'assistant', content: aiResponse } as Message]
            setMessages(updatedMessages)

            // Basic parsing to separate Feedback and Question if possible, 
            // or just display the whole thing.
            // For now, let's treat the whole response as the "Next Step"

            if (isFinal) {
                setFeedback(aiResponse)
                setStep('feedback')
            } else {
                // Split feedback and question if AI follows pattern, otherwise show all
                // Simulating "Feedback" state for valid UI
                setFeedback("استجابة المساعد الذكي...")
                setCurrentQuestion(aiResponse)
                setQuestionCount(prev => prev + 1)
                setFeedback(null) // Clear explicit feedback UI since it's in the text now
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRecordToggle = () => {
        setIsRecording(!isRecording)
        // Check for browser recognition support
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.lang = 'ar-SA'; // Default to Arabic or English based on preference?
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setIsRecording(true);

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserAnswer(prev => prev + " " + transcript);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
            };

            recognition.onend = () => setIsRecording(false);

            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
        } else {
            alert("Your browser does not support speech recognition.");
            setIsRecording(false)
        }
    }

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام محاكي المقابلات" description="محاكي المقابلات الذكي متاح فقط للمستخدمين المسجلين. سجّل دخولك لخوض تجربة مقابلة عمل حقيقية.">
            <div className="min-h-screen bg-[#0f1016] text-white pt-24 pb-12 px-4 relative overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <AnimatePresence mode="wait">
                        {step === 'select' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center space-y-12"
                            >
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
                                        محاكي المقابلات الذكي
                                    </h1>
                                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                        مدعوم بـ Google Gemini AI. خض تجربة مقابلة عمل حقيقية واحصل على تقييم فوري.
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl max-w-lg mx-auto">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {SPECIALTIES.map((spec) => (
                                        <motion.button
                                            key={spec.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => startInterview(spec.id)}
                                            className="bg-[#1e293b]/50 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/50 rounded-2xl p-8 backdrop-blur-sm transition-all group text-left relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left relative z-10">{spec.icon}</div>
                                            <h3 className="text-xl font-bold mb-2 text-slate-200 group-hover:text-white relative z-10">{spec.name}</h3>
                                            <p className="text-sm text-slate-500 group-hover:text-slate-300 relative z-10">ابدأ المقابلة &rarr;</p>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'interview' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-3xl mx-auto space-y-6"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <Button variant="ghost" onClick={() => setStep('select')} className="text-slate-400 hover:text-white">
                                        &larr; إنهاء المقابلة
                                    </Button>
                                    <Badge variant="outline" className="px-4 py-1 border-blue-500/30 text-blue-300 bg-blue-500/10">
                                        سؤال {questionCount} / 5
                                    </Badge>
                                </div>

                                {/* Chat Area */}
                                <div className="space-y-6 min-h-[400px]" ref={scrollRef}>
                                    {/* Show Chat History */}
                                    {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                                        <motion.div key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                                {msg.role === 'assistant' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
                                            </div>
                                            <div className="flex-1 max-w-[80%]">
                                                <div className={`p-6 rounded-2xl shadow-xl border relative whitespace-pre-wrap leading-relaxed ${msg.role === 'assistant'
                                                    ? 'bg-[#1e293b] border-blue-500/20 rounded-tl-none text-slate-100'
                                                    : 'bg-emerald-900/20 border-emerald-500/20 rounded-tr-none text-emerald-100'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isLoading && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                                <Bot size={20} className="text-white" />
                                            </div>
                                            <div className="bg-[#1e293b] border border-blue-500/20 rounded-2xl rounded-tl-none p-4 shadow-xl flex items-center gap-2 text-slate-400">
                                                <Loader2 className="animate-spin" size={18} />
                                                جاري الكتابة...
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="pt-4 sticky bottom-0 bg-[#0f1016]/80 backdrop-blur-lg pb-4">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSubmitAnswer(); }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-2 shadow-xl focus-within:border-blue-500/50 transition-colors flex gap-2 items-end"
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleRecordToggle}
                                            className={`h-12 w-12 rounded-xl mb-0.5 ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {isRecording ? <Pause size={22} /> : <Mic size={22} />}
                                        </Button>

                                        <Textarea
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSubmitAnswer();
                                                }
                                            }}
                                            placeholder="اكتب إجابتك هنا..."
                                            className="bg-transparent border-0 focus-visible:ring-0 resize-none min-h-[50px] max-h-[150px] py-3 text-lg placeholder:text-slate-600 flex-1"
                                            disabled={isLoading}
                                        />

                                        <Button
                                            type="submit"
                                            disabled={!userAnswer.trim() || isLoading}
                                            className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white mb-0.5"
                                            size="icon"
                                        >
                                            <Send size={20} />
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {step === 'feedback' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-w-3xl mx-auto py-12"
                            >
                                <div className="text-center mb-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/20">
                                        <span className="text-4xl text-white">🏆</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-4">التقييم النهائي</h2>
                                    <p className="text-slate-400">إليك تحليل شامل لأدائك في المقابلة</p>
                                </div>

                                <Card className="bg-[#1e293b]/50 border-white/10 backdrop-blur-xl overflow-hidden mb-8">
                                    <div className="p-8 prose prose-invert max-w-none">
                                        {/* Usually the last message contains the evaluation */}
                                        <div className="whitespace-pre-wrap leading-relaxed text-slate-200">
                                            {feedback || messages[messages.length - 1]?.content}
                                        </div>
                                    </div>
                                </Card>

                                <div className="flex justify-center gap-4">
                                    <Button onClick={() => setStep('select')} size="lg" className="bg-slate-700 hover:bg-slate-600 text-white">
                                        <RefreshCcw className="mr-2 h-4 w-4" /> مقابلة جديدة
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthGate>
    )
}
