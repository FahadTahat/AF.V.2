"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send, Users, Laptop, Briefcase, Settings, Activity, FlaskConical, AlertTriangle,
    Lock, User as UserIcon, Mail, Calendar, Shield, Hash, MessageCircle,
    Megaphone, Code, Wifi, Cpu, TrendingUp, Bot, Gamepad, Rocket, ChevronDown,
    Search, Bell, MoreVertical, Phone, Video
} from 'lucide-react'
import { useChat } from '@/hooks/use-chat'
import { CHANNELS } from '@/lib/chat-utils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getUserStats, followUser, unfollowUser, checkIsFollowing, getLeaderboard, updateLeaderboardEntry } from '@/lib/user-data'










// Group Channels by Category Helper
const groupChannels = () => {
    const groups: Record<string, typeof CHANNELS> = {
        'administrative': [],
        'general': [],
        'tech': [],
        'business': [],
        'engineering': [],
        'science': [],
        'projects': [],
        'social': []
    }

    CHANNELS.forEach(channel => {
        const cat = channel.category || 'general'
        if (groups[cat]) groups[cat].push(channel)
        else groups['general'].push(channel)
    })

    return groups
}

const CATEGORY_NAMES: Record<string, string> = {
    'administrative': 'الإدارة والإعلانات',
    'general': 'ساحة النقاش',
    'tech': 'التكنولوجيا والبرمجة',
    'business': 'إدارة الأعمال',
    'engineering': 'الهندسة',
    'science': 'العلوم التطبيقية',
    'projects': 'المشاريع والتعاون',
    'social': 'استراحة الطلاب'
}

export function ChatInterface() {
    const [activeChannel, setActiveChannel] = useState('general')
    const [inputText, setInputText] = useState('')
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [selectedUserStats, setSelectedUserStats] = useState<any>(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [showMembers, setShowMembers] = useState(true) // Toggle Right Sidebar
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)
    const activeChannelData = CHANNELS.find(c => c.id === activeChannel) || CHANNELS[0]

    // Using useChat hook
    const { messages, loading, sendMessage, isTimedOut, timeoutUntil, user, indexLink, activeUsers } = useChat(activeChannel)

    // Grouped Channels
    const channelGroups = groupChannels()
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        'administrative': true,
        'general': true,
        'tech': true,
        'business': false,
        'engineering': false,
        'science': false,
        'projects': true,
        'social': false
    })

    const toggleCategory = (cat: string) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }))
    }

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Fetch Leaderboard & Update User Score
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard()
                setLeaderboard(data)
            } catch (error) {
                console.error("Error fetching leaderboard:", error)
            }
        }

        fetchLeaderboard()

        if (user) {
            updateLeaderboardEntry(user).then(() => fetchLeaderboard())
        }
    }, [user])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputText.trim()) return

        await sendMessage(inputText)
        setInputText('')

        // Refocus input
        const inputElement = document.getElementById('chat-input')
        if (inputElement) inputElement.focus()
    }

    const handleUserClick = async (msgUser: any) => {
        if (!msgUser.userId) return

        let userData = {
            uid: msgUser.userId,
            displayName: msgUser.displayName,
            photoURL: msgUser.photoURL,
            email: 'مخفي',
            joinedAt: null as any,
            role: 'طالب',
            level: 1,
            bio: ''
        }

        setSelectedUserStats(null) // Reset stats

        try {
            const userDoc = await getDoc(doc(db, 'users', msgUser.userId))
            if (userDoc.exists()) {
                const data = userDoc.data()
                userData = {
                    ...userData,
                    email: data.email || userData.email,
                    role: data.role || 'طالب',
                    joinedAt: data.createdAt ? data.createdAt.toDate() : null,
                    level: data.achievementsProgress ? Math.floor(Object.values(data.achievementsUnlocked || {}).length / 2) + 1 : 1, // Simple level calculation
                    bio: data.bio || "طالب مجتهد في تخصص BTEC"
                }
            }

            // Fetch real stats
            getUserStats(msgUser.userId).then(stats => setSelectedUserStats(stats))

            // Check if following
            if (user) {
                checkIsFollowing(user.uid, msgUser.userId).then(setIsFollowing)
            }

        } catch (error) {
            console.error("Error fetching user details:", error)
        }

        setSelectedUser(userData)
        setIsProfileOpen(true)
    }

    const handleFollowToggle = async () => {
        if (!user || !selectedUser) return

        try {
            if (isFollowing) {
                await unfollowUser(user.uid, selectedUser.uid)
                setIsFollowing(false)
                setSelectedUserStats((prev: any) => ({
                    ...prev,
                    followersCount: Math.max(0, (prev?.followersCount || 0) - 1)
                }))
            } else {
                await followUser(user.uid, selectedUser.uid)
                setIsFollowing(true)
                setSelectedUserStats((prev: any) => ({
                    ...prev,
                    followersCount: (prev?.followersCount || 0) + 1
                }))
            }
        } catch (error) {
            console.error("Error toggling follow:", error)
        }
    }

    const getChannelIcon = (iconName: string) => {
        const iconProps = { className: "w-4 h-4" }
        switch (iconName) {
            case 'Users': return <Users {...iconProps} />
            case 'Laptop': return <Laptop {...iconProps} />
            case 'Briefcase': return <Briefcase {...iconProps} />
            case 'Settings': return <Settings {...iconProps} />
            case 'Activity': return <Activity {...iconProps} />
            case 'FlaskConical': return <FlaskConical {...iconProps} />
            case 'Megaphone': return <Megaphone {...iconProps} />
            case 'Code': return <Code {...iconProps} />
            case 'Shield': return <Shield {...iconProps} />
            case 'Wifi': return <Wifi {...iconProps} />
            case 'Cpu': return <Cpu {...iconProps} />
            case 'TrendingUp': return <TrendingUp {...iconProps} />
            case 'Bot': return <Bot {...iconProps} />
            case 'Gamepad': return <Gamepad {...iconProps} />
            case 'Rocket': return <Rocket {...iconProps} />
            default: return <Hash {...iconProps} />
        }
    }

    return (
        <div className="flex bg-slate-950/90 border border-white/10 rounded-2xl overflow-hidden h-full shadow-2xl backdrop-blur-xl ring-1 ring-white/5 relative">

            {/* LEFT SIDEBAR - Channels List */}
            <div className="w-64 md:w-72 bg-slate-900/50 border-l border-white/5 flex flex-col shrink-0">
                {/* Server/Community Header */}
                <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                    <h2 className="font-bold text-white text-base">مجتمع AF BTEC</h2>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>

                {/* Filter/Search */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="بحث عن قناة..."
                            className="w-full bg-slate-950/50 border border-white/5 rounded-md py-1.5 px-8 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
                        />
                    </div>
                </div>

                {/* Categories & Channels */}
                <ScrollArea className="flex-1 px-2">
                    <div className="space-y-4 pb-4">
                        {Object.entries(channelGroups).map(([catId, channels]) => {
                            if (channels.length === 0) return null
                            const isOpen = openCategories[catId]
                            return (
                                <div key={catId}>
                                    <button
                                        onClick={() => toggleCategory(catId)}
                                        className="flex items-center gap-1 w-full text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-wider mb-1 px-1 py-1 transition-colors"
                                    >
                                        <ChevronDown className={cn("w-3 h-3 transition-transform", !isOpen && "-rotate-90")} />
                                        {CATEGORY_NAMES[catId]}
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden space-y-0.5"
                                            >
                                                {channels.map(channel => (
                                                    <button
                                                        key={channel.id}
                                                        onClick={() => setActiveChannel(channel.id)}
                                                        className={cn(
                                                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all group",
                                                            activeChannel === channel.id
                                                                ? "bg-white/10 text-white font-medium"
                                                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                                        )}
                                                    >
                                                        <div className={cn("shrink-0", activeChannel === channel.id ? "text-primary" : "text-slate-500 group-hover:text-slate-400")}>
                                                            {getChannelIcon(channel.icon)}
                                                        </div>
                                                        <span className="truncate">{channel.name.split('(')[0]}</span>
                                                        {activeChannel === channel.id && <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                {/* User Status Area */}
                <div className="h-14 bg-black/20 px-3 flex items-center gap-2 text-white">
                    <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                        <AvatarImage src={user?.photoURL || undefined} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">{user?.displayName?.substring(0, 2) || "زائر"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{user?.displayName || "زائر"}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user ? "متصل #1234" : "غير مسجل"}</div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm hover:bg-white/10">
                            <Settings className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-900/30">
                {/* Header */}
                <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between shadow-sm bg-slate-900/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="text-slate-400">
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                {activeChannelData.name}
                                {activeChannel === 'announcements' && <Badge variant="secondary" className="h-5 text-[10px] px-1 pointer-events-none">رسمي</Badge>}
                            </h3>
                            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-md">{activeChannelData.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 transition-colors", showMembers ? "text-white bg-white/10" : "hover:text-white")}
                            onClick={() => setShowMembers(!showMembers)}
                            title="قائمة الأعضاء"
                        >
                            <Users className="w-4 h-4" />
                        </Button>

                        {/* Search Dropdown / More Options (Optional) */}
                        <div className="relative">
                            <Search className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-4 pt-4" ref={scrollRef}>
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
                            <p className="text-xs text-slate-500 animate-pulse">جاري تحميل الرسائل...</p>
                        </div>
                    ) : indexLink ? (
                        <div className="m-auto max-w-md bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <h3 className="font-bold text-white mb-2">مطلوب إعداد الفهرس</h3>
                            <p className="text-sm text-slate-400 mb-4">يجب ضبط قواعد البيانات في Firebase ليعمل الشات.</p>
                            <Button size="sm" variant="destructive" onClick={() => window.open(indexLink, '_blank')}>إصلاح المشكلة</Button>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-10">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Hash className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="font-bold text-white text-lg">مرحباً بك في #{activeChannelData.name}</h3>
                            <p className="text-sm text-slate-400">هذه بداية القناة. كن أول من يكتب هنا!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4 min-h-0">
                            {/* Intro Message */}
                            <div className="py-6 border-b border-white/5 mb-4">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                                    <Hash className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-1">مرحباً بك في #{activeChannelData.name.split('(')[0]}</h1>
                                <p className="text-slate-400 text-sm">هنا بداية تاريخ هذه القناة.</p>
                            </div>

                            {messages.map((msg, i) => {
                                const isMe = user?.uid === msg.userId;
                                const prevMsg = messages[i - 1];
                                const isSequence = prevMsg && prevMsg.userId === msg.userId && (msg.createdAt?.toMillis() - prevMsg.createdAt?.toMillis() < 60000);

                                // Group messages styling (Discord style)
                                if (isSequence) {
                                    return (
                                        <div key={msg.id} className="group flex items-start pl-[52px] pr-4 -mt-3 py-1 hover:bg-black/20 w-full relative">
                                            <div className="absolute left-4 top-2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 w-8 text-right select-none">
                                                {msg.createdAt ? format(msg.createdAt.toDate(), 'HH:mm', { locale: ar }) : ''}
                                            </div>
                                            <p className="text-slate-200 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    )
                                }

                                return (
                                    <div key={msg.id} className={cn("group flex items-start gap-4 px-2 py-2 hover:bg-black/10 rounded-lg transition-colors w-full mt-2", isMe && "bg-primary/5")}>
                                        <div onClick={() => handleUserClick(msg)} className="cursor-pointer hover:drop-shadow-md transition-all pt-1">
                                            <Avatar className="w-9 h-9 border border-white/10">
                                                <AvatarImage src={msg.photoURL || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-xs text-white">
                                                    {msg.displayName?.substring(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span onClick={() => handleUserClick(msg)} className="font-semibold text-white text-sm hover:underline cursor-pointer">
                                                    {msg.displayName}
                                                </span>
                                                <span className="text-[10px] text-slate-500">
                                                    {msg.createdAt ? format(msg.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: ar }) : ''}
                                                </span>
                                                {msg.userId === user?.uid && <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 border-white/10 text-slate-400">أنت</Badge>}
                                            </div>
                                            <p className="text-slate-200 text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                                {msg.text}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="h-4" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 px-4 bg-slate-900/50 shrink-0">
                    <div className="bg-white/5 rounded-xl p-2 relative shadow-inner ring-1 ring-white/5 focus-within:ring-primary/50 transition-all">
                        {isTimedOut ? (
                            <div className="h-10 flex items-center justify-center text-red-400 text-sm gap-2">
                                <Lock className="w-4 h-4" />
                                أنت في وضع الصامت (Timeout) حتى {timeoutUntil ? format(timeoutUntil, 'HH:mm:ss') : ''}
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className="flex flex-col gap-2">
                                <Input
                                    id="chat-input"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={`مراسلة #${activeChannelData.name.split('(')[0]}`}
                                    className="bg-transparent border-none focus-visible:ring-0 px-3 h-auto min-h-[40px] text-slate-200 placeholder:text-slate-500"
                                    autoComplete="off"
                                    disabled={!user}
                                />
                                <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5">
                                    <div className="flex gap-1 text-slate-400">
                                    </div>
                                    <div className="text-[10px] text-slate-600 hidden sm:block">
                                        اضغط Enter للإرسال
                                    </div>
                                </div>
                            </form>
                        )}
                        {!user && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20">
                                <Button size="sm" variant="secondary" onClick={() => window.location.href = '/auth/login'}>
                                    سجل دخول للمشاركة
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR - Members & Info */}
            <AnimatePresence>
                {showMembers && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 240, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-slate-900/50 border-r border-white/5 hidden lg:flex flex-col shrink-0 overflow-hidden"
                    >
                        <div className="h-14 border-b border-white/5 flex items-center justify-center relative shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-yellow-500" />
                                أفضل 10 (XP)
                            </h3>
                        </div>

                        <ScrollArea className="flex-1 p-3">
                            {/* Leaderboard List */}
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">المتصدرين في النقاط</h4>
                                <div className="space-y-1">
                                    {leaderboard.map((member: any, index: number) => (
                                        <div
                                            key={member.uid || member.id}
                                            onClick={() => handleUserClick({ userId: member.uid, ...member })}
                                            className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-md cursor-pointer group transition-colors relative"
                                        >
                                            {/* Rank Badge */}
                                            <div className="absolute -left-1 -top-1 z-10">
                                                {index === 0 && <span className="bg-yellow-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-white/20">1</span>}
                                                {index === 1 && <span className="bg-gray-300 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-white/20">2</span>}
                                                {index === 2 && <span className="bg-amber-600 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-white/20">3</span>}
                                                {index > 2 && <span className="bg-slate-700 text-slate-300 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-white/10">{index + 1}</span>}
                                            </div>

                                            <div className="relative">
                                                <Avatar className="w-9 h-9 rounded-full border-2 border-slate-800">
                                                    <AvatarImage src={member.photoURL} />
                                                    <AvatarFallback className="bg-slate-700 text-[10px] text-white">
                                                        {member.displayName?.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {index < 3 && <div className="absolute -bottom-1 -right-1 text-xs">
                                                    {index === 0 && "👑"}
                                                    {index === 1 && "🥈"}
                                                    {index === 2 && "🥉"}
                                                </div>}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <div className={cn("text-sm font-medium truncate max-w-[80px]", member.uid === user?.uid ? "text-primary" : "text-slate-300")}>
                                                        {member.displayName}
                                                    </div>
                                                    <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 border-white/10 bg-white/5 text-yellow-500/90 font-mono">
                                                        {member.points || 0} XP
                                                    </Badge>
                                                </div>
                                                <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <span>مستوى {Math.floor((member.achievements || 0) / 2) + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <div className="text-center py-8 opacity-50">
                                            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                            <p className="text-xs text-slate-500">جاري تحميل القائمة...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Dialog */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-xl sm:max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">بطاقة المستخدم</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="flex flex-col items-center space-y-6 py-6 px-2">
                            {/* Profile Header */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                <Avatar className="w-28 h-28 border-4 border-slate-900 shadow-2xl relative z-10">
                                    <AvatarImage src={selectedUser.photoURL} />
                                    <AvatarFallback className="text-3xl bg-slate-800">{selectedUser.displayName?.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-slate-950 z-20 shadow-lg">
                                    Lvl {selectedUser.level || 1}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                                    {selectedUser.displayName}
                                    {selectedUser.role === 'admin' && <Shield className="w-4 h-4 text-blue-400" />}
                                </h3>
                                <Badge variant="secondary" className="px-3 py-0.5 bg-white/10 text-slate-300 border-white/5 hover:bg-white/20">
                                    {selectedUser.role}
                                </Badge>
                                <p className="text-sm text-slate-400 max-w-[250px] mx-auto italic">"{selectedUser.bio}"</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 w-full">
                                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                    <div className="text-lg font-bold text-white">{selectedUserStats?.followersCount || 0}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">متابعون</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                    <div className="text-lg font-bold text-white">{selectedUserStats?.activitiesCount || 0}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">نشاط</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                    <div className="text-lg font-bold text-white">{selectedUser.joinedAt ? format(selectedUser.joinedAt, 'yyyy') : '2025'}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">انضمام</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 w-full">
                                <Button
                                    className={`flex-1 font-bold ${isFollowing ? 'bg-white/10 hover:bg-white/20' : 'bg-primary hover:bg-primary/90'}`}
                                    onClick={handleFollowToggle}
                                    disabled={!user || user.uid === selectedUser.uid}
                                >
                                    {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                                </Button>
                                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 hover:text-white" onClick={() => window.open(`/p/${selectedUser.uid}`, '_blank')}>
                                    الملف الشخصي
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
