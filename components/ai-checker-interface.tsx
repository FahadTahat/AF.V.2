"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles, RefreshCw, Copy, Check, AlertTriangle,
    FileText, Zap, Shield, PieChart,
    Search, Brain, Terminal, Info, Wifi, WifiOff, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnalysisResult {
    aiScore: number
    humanScore: number
    verdict: string
    verdictEn?: string
    sentences: { text: string; type: 'ai' | 'human' | 'mixed' }[]
    modelUsed?: string
    fallback?: boolean
    confidence?: string
    textLanguage?: string
}

const LOADING_STEPS = [
    "إرسال النص إلى النموذج...",
    "تحليل الأنماط اللغوية...",
    "مقارنة مع بيانات التدريب...",
    "حساب درجة الاحتمالية...",
    "إعداد التقرير النهائي...",
]

export function AiCheckerInterface() {
    const [text, setText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loadingStep, setLoadingStep] = useState(0)

    const handleAnalyze = async () => {
        if (!text.trim() || isAnalyzing) return

        setIsAnalyzing(true)
        setResult(null)
        setError(null)
        setLoadingStep(0)

        // Animate loading steps
        const stepInterval = setInterval(() => {
            setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
        }, 600)

        try {
            const response = await fetch('/api/detect-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'حدث خطأ أثناء التحليل')
            }

            // Small delay for UX polish
            await new Promise(r => setTimeout(r, 500))
            setResult(data)
        } catch (err: any) {
            setError(err.message || 'فشل الاتصال بالخادم، يرجى المحاولة مرة أخرى')
        } finally {
            clearInterval(stepInterval)
            setIsAnalyzing(false)
            setLoadingStep(0)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearAll = () => {
        setText("")
        setResult(null)
        setError(null)
    }

    // Score color helpers
    const getScoreColor = (score: number) => {
        if (score > 65) return "text-rose-400"
        if (score > 40) return "text-amber-400"
        return "text-emerald-400"
    }

    const getScoreBg = (score: number) => {
        if (score > 65) return "from-rose-500/20 to-rose-500/5 border-rose-500/20"
        if (score > 40) return "from-amber-500/20 to-amber-500/5 border-amber-500/20"
        return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20"
    }

    const getVerdictStyle = (score: number) => {
        if (score > 65) return "bg-rose-500/10 border-rose-500/20 text-rose-200"
        if (score > 40) return "bg-amber-500/10 border-amber-500/20 text-amber-200"
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
    }

    return (
        <div className="w-full bg-[#0b1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">

            {/* Window Header */}
            <div className="bg-[#0f172a] h-14 border-b border-indigo-500/20 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-4">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-md border border-white/5 flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Terminal size={12} className="text-indigo-400" />
                        <span>ai-detector.exe</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Model badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-[10px] text-indigo-300 font-mono font-bold">HuggingFace API</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[600px] relative">

                {/* Left: Input Area */}
                <div className="flex-1 p-6 flex flex-col relative z-10">
                    <div className="flex-1 relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={"الصق النص هنا للتحليل...\n\nيدعم النصوص العربية والإنجليزية\nيُنصح بإدخال 50 حرفاً على الأقل للحصول على نتائج دقيقة"}
                            className="w-full h-full min-h-[400px] lg:min-h-0 bg-transparent text-base text-slate-200 placeholder:text-slate-600 resize-none outline-none font-sans leading-relaxed p-4"
                            dir="auto"
                            disabled={isAnalyzing}
                        />

                        {/* Character & word count */}
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                            <span className={cn(
                                "text-xs font-mono px-2 py-1 rounded border",
                                text.length < 50
                                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                    : "text-slate-500 bg-[#0b1120]/80 border-white/5"
                            )}>
                                {text.length} حرف
                                {text.length < 50 && text.length > 0 && (
                                    <span className="mr-1 text-[10px]">(يُفضَّل 50+)</span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                                disabled={isAnalyzing}
                            >
                                <RefreshCw size={15} className="mr-2" />
                                مسح
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                                disabled={!text}
                            >
                                {copied
                                    ? <Check size={15} className="mr-2 text-emerald-400" />
                                    : <Copy size={15} className="mr-2" />}
                                {copied ? "تم النسخ" : "نسخ"}
                            </Button>
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            disabled={!text.trim() || isAnalyzing || text.trim().length < 10}
                            className={cn(
                                "bg-indigo-600 hover:bg-indigo-500 text-white min-w-[140px] shadow-lg shadow-indigo-500/25 transition-all duration-300",
                                isAnalyzing ? "bg-indigo-600/50 cursor-not-allowed" : "hover:scale-105"
                            )}
                        >
                            {isAnalyzing ? (
                                <>
                                    <span className="relative flex h-3 w-3 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                                    </span>
                                    جاري التحليل...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} className="mr-2 text-indigo-200" />
                                    فحص النص
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-white/5" />

                {/* Right: Results Area */}
                <div className="lg:w-[400px] bg-[#0f172a]/50 border-t lg:border-t-0 p-6 relative overflow-hidden flex flex-col">

                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

                    <AnimatePresence mode="wait">

                        {/* Idle State */}
                        {!result && !isAnalyzing && !error && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-500"
                            >
                                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-2 relative">
                                    <Search size={36} className="opacity-40" />
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <Zap size={10} className="text-white" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-300">جاهز للتحليل</h3>
                                <p className="text-sm max-w-[220px] leading-relaxed">
                                    أدخل نصاً في الجانب الأيسر واضغط <span className="text-indigo-400 font-medium">فحص النص</span> للحصول على نتائج فورية
                                </p>

                                {/* Model info */}
                                <div className="mt-6 w-full space-y-2">
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400">
                                        <Globe size={12} className="text-indigo-400 shrink-0" />
                                        <div className="text-right">
                                            <div className="text-indigo-300 font-medium">نموذج الإنجليزية</div>
                                            <div className="text-slate-500">roberta-base-openai-detector</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400">
                                        <FileText size={12} className="text-emerald-400 shrink-0" />
                                        <div className="text-right">
                                            <div className="text-emerald-300 font-medium">نموذج العربية</div>
                                            <div className="text-slate-500">محلل الأنماط اللغوية</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Loading State */}
                        {isAnalyzing && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin" />
                                    <div className="absolute inset-2 border-4 border-purple-500/20 rounded-full" />
                                    <div className="absolute inset-2 border-4 border-b-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                                    <Brain className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">جاري الفحص عبر HuggingFace</h3>
                                    <motion.p
                                        key={loadingStep}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-indigo-300"
                                    >
                                        {LOADING_STEPS[loadingStep]}
                                    </motion.p>
                                </div>
                                <div className="w-full max-w-[220px]">
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "90%" }}
                                            transition={{ duration: 3, ease: "easeInOut" }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                                        <span>ANALYZING</span>
                                        <span>HF-API</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Error State */}
                        {error && !isAnalyzing && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                    <WifiOff size={32} className="text-rose-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">فشل التحليل</h3>
                                    <p className="text-sm text-rose-300 max-w-[220px]">{error}</p>
                                </div>
                                <Button
                                    onClick={handleAnalyze}
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                                    disabled={!text.trim()}
                                >
                                    <RefreshCw size={14} className="mr-2" />
                                    إعادة المحاولة
                                </Button>
                            </motion.div>
                        )}

                        {/* Results State */}
                        {result && !isAnalyzing && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 flex flex-col h-full overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                        result.aiScore > 65 ? "bg-rose-500/20 text-rose-400" :
                                            result.aiScore > 40 ? "bg-amber-500/20 text-amber-400" :
                                                "bg-emerald-500/20 text-emerald-400"
                                    )}>
                                        <PieChart size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-sm">نتيجة التحليل</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {result.fallback ? (
                                                <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                                    <WifiOff size={9} /> تحليل محلي
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                                                    <Wifi size={9} /> HuggingFace API
                                                </span>
                                            )}
                                            <span className="text-[10px] text-slate-600">•</span>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                {result.textLanguage === 'arabic' ? 'AR' : 'EN'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Gauges */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className={cn(
                                        "rounded-xl p-4 border text-center relative overflow-hidden bg-gradient-to-b",
                                        result.aiScore > 65
                                            ? "from-rose-500/15 to-rose-500/5 border-rose-500/20"
                                            : result.aiScore > 40
                                                ? "from-amber-500/15 to-amber-500/5 border-amber-500/20"
                                                : "from-slate-500/15 to-slate-500/5 border-slate-500/20"
                                    )}>
                                        <span className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wide">احتمال AI</span>
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", delay: 0.1 }}
                                            className={cn("block text-4xl font-black", getScoreColor(result.aiScore))}
                                        >
                                            {result.aiScore}%
                                        </motion.span>
                                    </div>
                                    <div className="rounded-xl p-4 border text-center relative overflow-hidden bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border-emerald-500/20">
                                        <span className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wide">بشري</span>
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", delay: 0.2 }}
                                            className="block text-4xl font-black text-emerald-400"
                                        >
                                            {result.humanScore}%
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Confidence bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>بشري 100%</span>
                                        <span>AI 100%</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.aiScore}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={cn(
                                                "h-full rounded-full",
                                                result.aiScore > 65
                                                    ? "bg-gradient-to-r from-amber-500 to-rose-500"
                                                    : result.aiScore > 40
                                                        ? "bg-gradient-to-r from-emerald-500 to-amber-500"
                                                        : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                                            )}
                                        />
                                        {/* Needle */}
                                        <motion.div
                                            initial={{ right: "100%" }}
                                            animate={{ right: `${result.humanScore}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                                        />
                                    </div>
                                </div>

                                {/* Verdict */}
                                <div className={cn(
                                    "p-3.5 rounded-xl border mb-4 flex items-start gap-3",
                                    getVerdictStyle(result.aiScore)
                                )}>
                                    {result.aiScore > 65
                                        ? <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                        : result.aiScore > 40
                                            ? <Info size={18} className="shrink-0 mt-0.5 text-amber-400" />
                                            : <Shield size={18} className="shrink-0 mt-0.5" />}
                                    <div>
                                        <h4 className="font-bold text-xs mb-0.5">الخلاصة:</h4>
                                        <p className="text-xs opacity-90 leading-relaxed">{result.verdict}</p>
                                    </div>
                                </div>

                                {/* Model Info */}
                                {result.modelUsed && (
                                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 mb-3">
                                        {result.fallback ? (
                                            <WifiOff size={10} className="text-amber-400 shrink-0" />
                                        ) : (
                                            <Wifi size={10} className="text-indigo-400 shrink-0" />
                                        )}
                                        <span className="text-[10px] text-slate-500 font-mono truncate">
                                            {result.modelUsed}
                                        </span>
                                    </div>
                                )}

                                {/* Sentence Breakdown */}
                                {result.sentences.length > 0 && (
                                    <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            تحليل الجمل ({result.sentences.length})
                                        </h4>
                                        {result.sentences.map((s, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "p-2.5 rounded-lg text-xs border",
                                                    s.type === 'ai'
                                                        ? "bg-rose-500/10 border-rose-500/15 text-rose-100"
                                                        : s.type === 'human'
                                                            ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-100"
                                                            : "bg-amber-500/10 border-amber-500/15 text-amber-100"
                                                )}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={cn(
                                                        "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                                                        s.type === 'ai' ? "bg-rose-500/20 text-rose-300" :
                                                            s.type === 'human' ? "bg-emerald-500/20 text-emerald-300" :
                                                                "bg-amber-500/20 text-amber-300"
                                                    )}>
                                                        {s.type === 'ai' ? '🤖 AI' : s.type === 'human' ? '🧑 Human' : '⚡ Mixed'}
                                                    </span>
                                                </div>
                                                <p className="leading-relaxed opacity-90" dir="auto">{s.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scanning line animation */}
            {isAnalyzing && (
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_3px_rgba(99,102,241,0.5)] z-50 pointer-events-none"
                    style={{ top: 0 }}
                />
            )}
        </div>
    )
}
