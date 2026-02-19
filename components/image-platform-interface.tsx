"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Image as ImageIcon, X, Download, Search,
    LayoutGrid, Wand2, Library, Sparkles, Loader2, Share2,
    Check, ChevronDown, BookOpen, Layers, Monitor,
    GraduationCap, Palette, PieChart, Type, Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ImageCard } from "./image-platform-card"
import { levels } from "@/lib/schedule-data"

interface SearchImage {
    id: string; url: string; title: string; source: string; photographer?: string;
}
interface GeneratedImage {
    id: string; url: string; title: string; prompt: string; createdAt: Date; source?: string;
}

const MOCK_IMAGES: SearchImage[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', title: 'Tech Circuit Board', source: 'Unsplash', photographer: 'Adi Goldstein' },
    { id: '2', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', title: 'Data Analytics Chart', source: 'Unsplash', photographer: 'Luke Chesser' },
    { id: '3', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', title: 'Cybersecurity Matrix', source: 'Unsplash', photographer: 'Markus Spiske' },
    { id: '4', url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80', title: 'Coding Screen', source: 'Unsplash', photographer: 'Markus Spiske' },
    { id: '5', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', title: 'Laptop Mockup', source: 'Unsplash', photographer: 'Domenico Loia' },
    { id: '6', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', title: 'Server Room', source: 'Unsplash', photographer: 'Brett Sayles' },
    { id: '7', url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80', title: 'Team Meeting', source: 'Unsplash', photographer: 'Annie Spratt' },
    { id: '8', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', title: 'Writing Report', source: 'Unsplash', photographer: 'Hello I am Nik' },
]

const UNIT_PROMPTS: Record<string, { theme: string; keywords: string; colors: string }> = {
    "it-support": { theme: "Technical Support", keywords: "computer hardware, ethernet cables, server racks, troubleshooting, helpdesk headset, motherboard", colors: "blue and orange" },
    "data-modeling": { theme: "Data Analysis", keywords: "excel spreadsheets, data visualization, graphs, pie charts, analytics dashboard, business intelligence", colors: "emerald green and white" },
    "networks-intro": { theme: "Network Infrastructure", keywords: "fiber optics, router, switch, cloud computing connection, digital data flow, network topology", colors: "cyan and dark blue" },
    "programming-intro": { theme: "Coding Basics", keywords: "python code snippets, algorithm flowchart, logic gates, curly braces, developer terminal", colors: "yellow and black" },
    "digital-graphics": { theme: "Digital Art", keywords: "vector bezier curves, rgba color palette, wacom tablet, creative design studio, pixels", colors: "magenta and purple" },
    "web-development-intro": { theme: "Web Design", keywords: "html css code, responsive layout, browser window, ux/ui wireframe, javascript logo", colors: "orange and blue" },
    "app-development-intro": { theme: "Mobile Apps", keywords: "smartphone mockup, app icons, user interface, touch screen gestures, swift code", colors: "indigo and white" },
    "game-design-intro": { theme: "Game Design", keywords: "video game controller, level editor, 3d assets, character concept art, unreal engine interface", colors: "purple and neon green" },
    "strategic-it": { theme: "IT Strategy", keywords: "business meeting, strategic roadmap, kpi dashboard, enterprise architecture, corporate boardroom", colors: "navy blue and gold" },
    "web-development-advanced": { theme: "Advanced Web Dev", keywords: "react component structure, backend server, database schema, api integration, cloud deployment", colors: "react blue and dark gray" },
    "game-development": { theme: "Game Dev", keywords: "c++ code, physics engine simulation, vr headset, game loop, shader programming", colors: "neon purple and black" },
    "it-project-management": { theme: "Project Management", keywords: "gantt chart, kanban board, agile methodology, scrum meeting, project timeline", colors: "teal and slate" },
    "it-support-management": { theme: "IT Management", keywords: "system administrator, data center, uptime monitoring, sla contract, service desk manager", colors: "corporate blue" },
    "cybersecurity": { theme: "Cyber Security", keywords: "digital padlock, firewall shield, binary code rain, matrix style, malware protection, encryption key", colors: "neon green and black" },
    "artificial-intelligence": { theme: "AI Systems", keywords: "neural network nodes, machine learning brain, futuristic robot hand, deep learning data, automation", colors: "electric blue and silver" },
    "advanced-programming": { theme: "Advanced Coding", keywords: "software architecture, object oriented programming, cloud api, debugging tools, complex algorithms", colors: "monochrome and blue" },
    "mobile-development": { theme: "Mobile Dev", keywords: "android studio, ios simulator, flutter widgets, mobile ux patterns, app store deployment", colors: "green and blue" }
}

const PROMPT_TYPES = [
    { label: "غلاف تقرير", icon: BookOpen, key: "cover" },
    { label: "كتابة نصية", icon: Type, key: "typography" },
    { label: "رسم توضيحي", icon: Palette, key: "illustration" },
    { label: "مخطط بياني", icon: PieChart, key: "diagram" },
    { label: "أجهزة ومعدات", icon: Monitor, key: "hardware" },
    { label: "بيئة عمل", icon: Layers, key: "realistic" },
]

function buildPrompt(specifics: { theme: string; keywords: string; colors: string }, type: string): string {
    switch (type) {
        case "cover": return `Abstract professional cover background for "${specifics.theme}", styled in ${specifics.colors}, including subtle elements of ${specifics.keywords}, corporate minimalist, geometric shapes, 8k resolution, plenty of negative space for title`
        case "typography": return `The text "${specifics.theme}" rendered in bold 3D futuristic typography, surrounded by floating elements of ${specifics.keywords}, ${specifics.colors} lighting, clean studio background, highly detailed 8k`
        case "illustration": return `Educational isometric illustration of ${specifics.theme}, featuring ${specifics.keywords}, distinct vector style, soft lighting, clean white background, professional infographic, ${specifics.colors} accents`
        case "diagram": return `Professional technical diagram explaining ${specifics.theme} concepts, showing flow between ${specifics.keywords}, flat vector style, organized flowchart, isolated on white background, business clarity`
        case "hardware": return `Photorealistic studio photography of ${specifics.keywords}, sharp focus, cinematic lighting, neutral bright background, 8k uhd, professional product shot style`
        case "realistic": return `Modern professional workspace for ${specifics.theme}, showing screens displaying ${specifics.keywords}, authentic candid shot, depth of field, natural light, 4k`
        default: return `Professional image about ${specifics.theme}, ${specifics.keywords}, ${specifics.colors}, high quality`
    }
}

export function ImagePlatformInterface() {
    const [isMaximized, setIsMaximized] = useState(false)
    const [activeMode, setActiveMode] = useState<'generate' | 'search'>('generate')

    // Unit Selector State
    const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null)
    const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(null)
    const [selectedUnit, setSelectedUnit] = useState<any | null>(null)
    const [selectedPromptType, setSelectedPromptType] = useState<string>("cover")
    const [customPrompt, setCustomPrompt] = useState("")

    // Generation State
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
    const [imageCount, setImageCount] = useState(1)

    // Search State
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchImage[]>(MOCK_IMAGES)

    // Preview
    const [previewImage, setPreviewImage] = useState<any | null>(null)

    const currentSemesters = useMemo(() => {
        if (!selectedLevelId) return []
        return levels.find(l => l.id === selectedLevelId)?.semesters || []
    }, [selectedLevelId])

    const currentUnits = useMemo(() => {
        if (!selectedSemesterId || !selectedLevelId) return []
        return currentSemesters.find(s => s.id === selectedSemesterId)?.units || []
    }, [selectedSemesterId, currentSemesters, selectedLevelId])

    const currentSpecifics = useMemo(() => {
        if (!selectedUnit?.guideId) return null
        return UNIT_PROMPTS[selectedUnit.guideId] || null
    }, [selectedUnit])

    const finalPrompt = useMemo(() => {
        if (customPrompt.trim()) return customPrompt
        if (currentSpecifics) return buildPrompt(currentSpecifics, selectedPromptType)
        return ""
    }, [customPrompt, currentSpecifics, selectedPromptType])

    const handleSearch = useCallback(() => {
        setIsSearching(true)
        setTimeout(() => {
            const shuffled = [...MOCK_IMAGES].sort(() => 0.5 - Math.random())
            setSearchResults(shuffled)
            setIsSearching(false)
        }, 400)
    }, [])

    const handleGenerate = async () => {
        if (!finalPrompt.trim()) {
            toast.error("اختر مادة أو اكتب وصفاً أولاً")
            return
        }
        setIsGenerating(true)

        try {
            const newImages: GeneratedImage[] = []
            for (let i = 0; i < imageCount; i++) {
                const response = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: finalPrompt }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || 'Failed to generate image')
                }

                const blob = await response.blob()
                const url = URL.createObjectURL(blob)

                newImages.push({
                    id: Date.now() + i + '',
                    url,
                    title: selectedUnit?.name || finalPrompt.slice(0, 40),
                    prompt: finalPrompt,
                    source: response.headers.get("X-Generated-By") || "AI Generated",
                    createdAt: new Date()
                })
            }

            setGeneratedImages(prev => [...newImages, ...prev])
            toast.success("✨ تم توليد الصور بنجاح!")
        } catch (error: any) {
            toast.error(error.message || "حدث خطأ أثناء التوليد")
        } finally {
            setIsGenerating(false)
        }
    }

    const downloadImg = (url: string, filename: string) => {
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.target = "_blank"
        link.click()
    }

    return (
        <div className={cn(
            "w-full bg-[#070d1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans text-right transition-all duration-500",
            isMaximized ? "fixed inset-0 z-50 rounded-none" : "h-[850px]"
        )} dir="rtl">

            {/* ── Header ── */}
            <div className="bg-[#0c1526] h-12 border-b border-white/5 px-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2" dir="ltr">
                    <button className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
                    <button className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                    <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ImageIcon size={14} className="text-blue-400" />
                    <span>Media Studio Pro — Image Generator</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveMode('generate')} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", activeMode === 'generate' ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white")}>
                        <Wand2 size={12} className="inline mr-1" />توليد AI
                    </button>
                    <button onClick={() => setActiveMode('search')} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all", activeMode === 'search' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white")}>
                        <Search size={12} className="inline mr-1" />بحث
                    </button>
                </div>
            </div>

            {/* ── Body: Split Panel ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── LEFT PANEL: Controls ── */}
                <div className="w-[340px] shrink-0 bg-[#0c1526] border-l border-white/5 flex flex-col overflow-y-auto custom-scrollbar">

                    {activeMode === 'generate' && (
                        <div className="p-4 space-y-5">

                            {/* Step 1: Level */}
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                                    المستوى الدراسي
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {levels.map(level => (
                                        <button key={level.id} onClick={() => { setSelectedLevelId(level.id); setSelectedSemesterId(null); setSelectedUnit(null) }}
                                            className={cn("py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all",
                                                selectedLevelId === level.id ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                                            )}>
                                            {level.nameAr}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Semester */}
                            <AnimatePresence>
                                {selectedLevelId && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                                            الفصل الدراسي
                                        </p>
                                        <div className="space-y-1.5">
                                            {currentSemesters.map(sem => (
                                                <button key={sem.id} onClick={() => { setSelectedSemesterId(sem.id); setSelectedUnit(null) }}
                                                    className={cn("w-full py-2 px-3 rounded-lg border text-xs font-medium text-right transition-all",
                                                        selectedSemesterId === sem.id ? "bg-purple-600/20 border-purple-500 text-purple-200" : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                                                    )}>
                                                    {sem.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Step 3: Unit */}
                            <AnimatePresence>
                                {selectedSemesterId && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                                            الوحدة / المادة
                                        </p>
                                        <div className="space-y-1.5">
                                            {currentUnits.map(unit => (
                                                <button key={unit.id} onClick={() => setSelectedUnit(unit)}
                                                    className={cn("w-full py-2.5 px-3 rounded-lg border text-xs font-medium text-right transition-all flex items-center justify-between gap-2",
                                                        selectedUnit?.id === unit.id ? "bg-emerald-600/20 border-emerald-500 text-emerald-100" : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                                                    )}>
                                                    <span className="line-clamp-2">{unit.name}</span>
                                                    {selectedUnit?.id === unit.id && <Check size={14} className="text-emerald-400 shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Step 4: Prompt Type */}
                            <AnimatePresence>
                                {selectedUnit && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                                            نوع الصورة
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {PROMPT_TYPES.map(pt => (
                                                <button key={pt.key} onClick={() => setSelectedPromptType(pt.key)}
                                                    className={cn("py-2.5 px-3 rounded-xl border text-xs font-medium text-center flex flex-col items-center gap-1.5 transition-all",
                                                        selectedPromptType === pt.key ? "bg-pink-600/20 border-pink-500 text-pink-200" : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                                                    )}>
                                                    <pt.icon size={16} className={selectedPromptType === pt.key ? "text-pink-400" : "text-slate-500"} />
                                                    {pt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Custom Prompt Override */}
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">أو اكتب وصفاً مخصصاً</p>
                                <textarea
                                    value={customPrompt}
                                    onChange={e => setCustomPrompt(e.target.value)}
                                    placeholder="اكتب وصف الصورة هنا..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 resize-none h-20 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            {/* Preview of Prompt */}
                            {finalPrompt && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                    <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">الأمر المُرسل للـ AI:</p>
                                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed" dir="ltr">{finalPrompt}</p>
                                </div>
                            )}

                            {/* Count + Generate Button */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">عدد الصور:</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(n => (
                                            <button key={n} onClick={() => setImageCount(n)}
                                                className={cn("w-8 h-8 rounded-lg border text-xs font-bold transition-all",
                                                    imageCount === n ? "bg-purple-600 border-purple-500 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                                                )}>
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !finalPrompt}
                                    className={cn(
                                        "w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                                        isGenerating || !finalPrompt
                                            ? "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95"
                                    )}
                                >
                                    {isGenerating ? (
                                        <><Loader2 className="animate-spin" size={18} /> جاري التوليد...</>
                                    ) : (
                                        <><Wand2 size={18} /> توليد الصورة</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeMode === 'search' && (
                        <div className="p-4 space-y-4">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">بحث عن صور</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="ابحث..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                                />
                                <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
                                    {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT PANEL: Results ── */}
                <div className="flex-1 bg-[#050b18] overflow-y-auto custom-scrollbar relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.05),_transparent_60%)] pointer-events-none" />

                    {activeMode === 'generate' && (
                        <div className="p-5">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span className="text-sm font-bold text-white">الصور المولدة</span>
                                    {generatedImages.length > 0 && (
                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                                            {generatedImages.length}
                                        </span>
                                    )}
                                </div>
                                {generatedImages.length > 0 && (
                                    <button onClick={() => setGeneratedImages([])} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
                                        مسح الكل
                                    </button>
                                )}
                            </div>

                            {/* Loading Skeletons */}
                            {isGenerating && (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                    {[...Array(imageCount)].map((_, i) => (
                                        <div key={`sk-${i}`} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 animate-pulse">
                                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <Loader2 className="animate-spin text-purple-400" size={24} />
                                            </div>
                                            <span className="text-xs text-slate-500">جاري التوليد...</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Generated Images Grid */}
                            {generatedImages.length > 0 && (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {generatedImages.map(img => (
                                        <ImageCard
                                            key={img.id}
                                            {...img}
                                            onClick={setPreviewImage}
                                            source={img.source || "AI Generated"}
                                            isGenerated
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {generatedImages.length === 0 && !isGenerating && (
                                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                                    <div className="w-24 h-24 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                                        <Wand2 size={40} className="text-purple-400/50" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-300 mb-2">جاهز للتوليد</h3>
                                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                                        اختر مادة دراسية من القائمة على اليسار، ثم اضغط على زر التوليد
                                    </p>
                                    <p className="text-xs text-slate-600 mt-3">الصور ستظهر هنا مباشرة ✨</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeMode === 'search' && (
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-5">
                                <Search size={16} className="text-blue-400" />
                                <span className="text-sm font-bold text-white">نتائج البحث</span>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {isSearching ? (
                                    [...Array(6)].map((_, i) => (
                                        <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
                                    ))
                                ) : (
                                    searchResults.map(img => (
                                        <ImageCard key={img.id} {...img} onClick={setPreviewImage} source={img.source} />
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Preview Modal ── */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="relative max-w-4xl w-full bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
                        >
                            <div className="flex-1 bg-black min-h-[300px] flex items-center justify-center">
                                <img src={previewImage.url} alt={previewImage.title} className="max-w-full max-h-[70vh] object-contain" />
                            </div>
                            <div className="w-full md:w-72 bg-[#1e293b] p-6 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-base font-bold text-white leading-tight">{previewImage.title}</h3>
                                    <button onClick={() => setPreviewImage(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                        <X size={18} className="text-slate-400" />
                                    </button>
                                </div>
                                {previewImage.prompt && (
                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-4" dir="ltr">{previewImage.prompt}</p>
                                )}
                                <div className="mt-auto space-y-2">
                                    <button
                                        onClick={() => downloadImg(previewImage.url, `af-btec-${previewImage.id}.jpg`)}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Download size={16} /> تحميل الصورة
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
