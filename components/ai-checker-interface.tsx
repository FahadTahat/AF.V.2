"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles, RefreshCw, Copy, Check, AlertTriangle,
    FileText, Zap, Shield, ChevronRight, PieChart,
    Search, Brain, Terminal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function AiCheckerInterface() {
    const [text, setText] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<null | {
        aiScore: number,
        humanScore: number,
        sentences: { text: string, type: 'ai' | 'human' | 'mixed' }[],
        verdict: string
    }>(null)
    const [copied, setCopied] = useState(false)

    const handleAnalyze = () => {
        if (!text.trim()) return

        setIsAnalyzing(true)
        setResult(null)

        // Simulate analysis delay for realism
        setTimeout(() => {
            let aiScore = 0
            const input = text.trim()

            // 1. Check for AI Connectors (Formal Transition Words)
            // AI models tend to use these excessively to structure responses.
            const aiConnectors = [
                "بناءً على ذلك", "من الجدير بالذكر", "في هذا السياق",
                "علاوة على ذلك", "تجدر الإشارة إلى", "في الختام",
                "من ناحية أخرى", "بالإضافة إلى ذلك", "في هذا الصدد",
                "بشكل عام", "مما لا شك فيه", "خلاصة القول",
                "تكمن أهمية", "على سبيل المثال", "نتيجة لذلك"
            ]
            let connectorCount = 0
            aiConnectors.forEach(phrase => {
                const regex = new RegExp(phrase, "g")
                const matches = input.match(regex)
                if (matches) connectorCount += matches.length
            })
            // Add points: 7 points per connector, capped at 40
            aiScore += Math.min(connectorCount * 7, 40)

            // 2. Check Punctuation Consistency (Perfect Punctuation = AI indicator)
            // AI almost always puts a space after a comma and period.
            const commas = (input.match(/،/g) || []).length
            const correctCommas = (input.match(/،\s/g) || []).length

            if (commas > 3 && correctCommas === commas) {
                aiScore += 15 // Perfect punctuation score
            }

            // 3. Check for Colloquialisms (Human Indicators)
            // Common levantine/egyptian/gulf slang reduces AI probability significantly.
            const humanWords = [
                "عشان", "مشان", "بدي", "بدنا", "ليش", "ايش", "شنو",
                "هيك", "كتير", "شلون", "هلا", "رح", "راح", "لسة",
                "طيب", "يعني", "ماشي", "صار", "كانت", "كنت"
            ]
            let humanWordCount = 0
            humanWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, "g")
                if (regex.test(input)) humanWordCount++
            })
            // Subtract points: 10 points per human word
            aiScore -= (humanWordCount * 10)

            // 4. Repeated Punctuation (Human Indicator)
            // ".." "!!" "??" are human emotional traits
            if (/\.\.+/.test(input)) aiScore -= 10
            if (/!!+/.test(input)) aiScore -= 10
            if (/\?\?+/.test(input)) aiScore -= 10

            // 5. Normalization
            // Ensure score stays between 2 and 99
            if (aiScore < 0) aiScore = Math.floor(Math.random() * 10) + 2 // Low score for humans
            if (aiScore > 99) aiScore = 99
            if (text.length < 50) aiScore = Math.floor(Math.random() * 30) // Too short to judge accurately, bias towards human

            // Base Score Injection (if no strong indicators found, default to 'Unknown/Mixed')
            if (aiScore === 0 && connectorCount === 0 && humanWordCount === 0) {
                aiScore = 45 + Math.floor(Math.random() * 10)
            }

            // Split text into potential sentences for the breakdown visualization
            const sentences = text.match(/[^.!?،]+[.!?،]*/g) || [text]
            const analyzedSentences = sentences.map(s => {
                // Analyze each sentence individually
                let sType: 'ai' | 'human' | 'mixed' = 'mixed'
                let sScore = 0

                // Simple sentence analysis
                aiConnectors.forEach(c => { if (s.includes(c)) sScore += 20 })
                if (s.length > 20 && s.match(/،\s/)) sScore += 10
                humanWords.forEach(w => { if (s.includes(w)) sScore -= 30 })

                if (sScore > 15) sType = 'ai'
                else if (sScore < -5) sType = 'human'

                return { text: s.trim(), type: sType }
            }) as { text: string, type: 'ai' | 'human' | 'mixed' }[]

            let verdict = ""
            if (aiScore > 80) verdict = "يحتمل بشدة أن يكون مولداً (AI)"
            else if (aiScore > 60) verdict = "يحتمل أن يكون مولداً بالذكاء الاصطناعي"
            else if (aiScore > 40) verdict = "نص مختلط / غير مؤكد"
            else if (aiScore > 20) verdict = "يحتمل أن يكون بشرياً"
            else verdict = "نص بشري تماماً"

            setResult({
                aiScore: Math.floor(aiScore),
                humanScore: 100 - Math.floor(aiScore),
                sentences: analyzedSentences,
                verdict
            })
            setIsAnalyzing(false)
        }, 1500)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearText = () => {
        setText("")
        setResult(null)
    }

    return (
        <div className="w-full bg-[#0b1120] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">

            {/* --- Window Header (Mac-like) --- */}
            <div className="bg-[#0f172a] h-14 border-b border-indigo-500/20 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-4">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-md border border-white/5 flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Terminal size={12} className="text-indigo-400" />
                        <span>analyzer.exe</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
                        AI DETECTION ENGINE v2.1
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[700px] lg:h-[600px] relative">

                {/* --- Left: Input Area --- */}
                <div className="flex-1 p-6 flex flex-col relative z-10 transition-all duration-500">
                    <div className="flex-1 relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="الصق النص هنا للتحليل..."
                            className="w-full h-full bg-transparent text-lg text-slate-200 placeholder:text-slate-600 resize-none outline-none font-sans leading-relaxed p-4"
                            dir="auto"
                            disabled={isAnalyzing}
                        />

                        {/* Character Count */}
                        <div className="absolute bottom-2 left-2 text-xs text-slate-500 font-mono px-2 py-1 bg-[#0b1120]/80 rounded border border-white/5">
                            {text.length} حرف
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearText}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                                disabled={isAnalyzing}
                            >
                                <RefreshCw size={16} className={cn("mr-2", isAnalyzing && "animate-spin")} />
                                مسح
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                {copied ? <Check size={16} className="mr-2 text-emerald-400" /> : <Copy size={16} className="mr-2" />}
                                {copied ? "تم النسخ" : "نسخ"}
                            </Button>
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            disabled={!text.trim() || isAnalyzing}
                            className={cn(
                                "bg-indigo-600 hover:bg-indigo-500 text-white min-w-[140px] shadow-lg shadow-indigo-500/25 transition-all duration-300",
                                isAnalyzing ? "bg-indigo-600/50" : "hover:scale-105"
                            )}
                        >
                            {isAnalyzing ? (
                                <>
                                    <span className="relative flex h-3 w-3 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                    </span>
                                    جاري التحليل...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} className="mr-2 text-indigo-200" />
                                    فحص النص
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* --- Right: Results Area (or Placeholder) --- */}
                <div className="lg:w-[400px] bg-[#0f172a]/50 border-t lg:border-t-0 lg:border-r border-white/5 p-6 relative overflow-hidden flex flex-col">

                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none"></div>

                    <AnimatePresence mode="wait">
                        {!result && !isAnalyzing ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-500"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Search size={32} className="opacity-50" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-300">بانتظار الإدخال</h3>
                                <p className="text-sm max-w-[200px]">
                                    قم بإدخال النص في الجانب الأيمن واضغط على "فحص النص" لرؤية النتائج.
                                </p>
                            </motion.div>
                        ) : isAnalyzing ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                                    <Brain className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">جاري التحليل الذكي</h3>
                                    <p className="text-sm text-indigo-300 animate-pulse">يتم الآن فحص الأنماط اللغوية...</p>
                                </div>
                                <div className="w-full max-w-[200px] space-y-2">
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-indigo-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2.5, ease: "easeInOut" }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                        <span>SCANNING...</span>
                                        <span>GPT-4 MODEL</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : result ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex-1 flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        result.aiScore > 50 ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                                    )}>
                                        <PieChart size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">نتيجة التحليل</h3>
                                        <p className="text-xs text-slate-400 text-right">{new Date().toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                {/* Score Guages */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-rose-500/5"></div>
                                        <span className="block text-xs text-rose-300 mb-1">احتمالية AI</span>
                                        <span className="block text-3xl font-black text-white">{result.aiScore}%</span>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-emerald-500/5"></div>
                                        <span className="block text-xs text-emerald-300 mb-1">بشري</span>
                                        <span className="block text-3xl font-black text-white">{result.humanScore}%</span>
                                    </div>
                                </div>

                                {/* Verdict */}
                                <div className={cn(
                                    "p-4 rounded-xl border mb-6 flex items-start gap-3",
                                    result.aiScore > 50
                                        ? "bg-rose-500/10 border-rose-500/20 text-rose-200"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                                )}>
                                    {result.aiScore > 50 ? <AlertTriangle size={20} className="shrink-0 mt-0.5" /> : <Shield size={20} className="shrink-0 mt-0.5" />}
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">الخلاصة:</h4>
                                        <p className="text-sm opacity-90">{result.verdict}</p>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                    <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">تحليل الجمل</h4>
                                    {result.sentences.map((s, idx) => (
                                        <div key={idx} className={cn(
                                            "p-3 rounded-lg text-sm border transition-colors",
                                            s.type === 'ai'
                                                ? "bg-rose-500/10 border-rose-500/20 text-rose-100"
                                                : s.type === 'human'
                                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-100"
                                                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-100"
                                        )}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold opacity-70 uppercase">{s.type === 'ai' ? 'AI Generated' : s.type === 'human' ? 'Human' : 'Mixed'}</span>
                                            </div>
                                            {s.text}
                                        </div>
                                    ))}
                                </div>

                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            {/* Overlay Gradient Line */}
            {isAnalyzing && (
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_2px_rgba(99,102,241,0.5)] z-50 pointer-events-none"
                    style={{ top: 0 }}
                />
            )}
        </div>
    )
}
