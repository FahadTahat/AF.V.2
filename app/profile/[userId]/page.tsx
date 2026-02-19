"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    getUserStats,
    getUserActivities,
    getUserProfile,
    checkIsFollowing,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} from "@/lib/user-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
    DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Activity, TrendingUp, Calendar, Sparkles,
    UserPlus, UserMinus, MessageSquare, MapPin,
    Medal, Trophy, Users, CheckCircle, Zap, Target,
    Share2, Laptop, Code, PenTool, Layout, Box, Star,
    Briefcase, GraduationCap, Github, Linkedin, Globe, Crown
} from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/LanguageContext"
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { cn } from "@/lib/utils"

// --- Mock Skill Data (To be replaced with real data later) ---
const SKILLS_DATA = [
    { subject: 'Coding', A: 120, fullMark: 150 },
    { subject: 'Design', A: 98, fullMark: 150 },
    { subject: 'Logic', A: 86, fullMark: 150 },
    { subject: 'Teamwork', A: 99, fullMark: 150 },
    { subject: 'Communication', A: 85, fullMark: 150 },
    { subject: 'Management', A: 65, fullMark: 150 },
];

const ACTIVITY_CHART_DATA = [
    { name: 'Sat', value: 4 }, { name: 'Sun', value: 7 },
    { name: 'Mon', value: 3 }, { name: 'Tue', value: 8 },
    { name: 'Wed', value: 6 }, { name: 'Thu', value: 5 },
    { name: 'Fri', value: 9 },
]

export default function UserProfilePage() {
    const params = useParams()
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const { language, t } = useLanguage()

    // User Data
    const userId = params?.userId as string
    const [profileUser, setProfileUser] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [activities, setActivities] = useState<any[]>([])
    const [achievements, setAchievements] = useState<any[]>([])
    const [followersList, setFollowersList] = useState<any[]>([])
    const [followingList, setFollowingList] = useState<any[]>([])

    // UI State
    const [loading, setLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        if (!userId) return

        const loadProfile = async () => {
            try {
                setLoading(true)
                const [userProfile, userStats, userActivities, userAchievements, userFollowers, userFollowing] = await Promise.all([
                    getUserProfile(userId),
                    getUserStats(userId),
                    getUserActivities(userId, 10),
                    import("@/lib/user-data").then(mod => mod.getUserAchievements(userId)),
                    getFollowers(userId),
                    getFollowing(userId)
                ])

                if (!userProfile) {
                    toast.error("المستخدم غير موجود")
                    router.push("/")
                    return
                }

                setProfileUser(userProfile)
                setStats(userStats)
                setActivities(userActivities)
                setAchievements(userAchievements)
                setFollowersList(userFollowers)
                setFollowingList(userFollowing)

                if (currentUser) {
                    const followingStatus = await checkIsFollowing(currentUser.uid, userId)
                    setIsFollowing(followingStatus)
                }
            } catch (error) {
                console.error("Error loading profile:", error)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [userId, currentUser, router])

    const handleFollow = async () => {
        if (!currentUser) {
            toast.error("يجب تسجيل الدخول للمتابعة")
            return
        }

        try {
            setFollowLoading(true)
            if (isFollowing) {
                await unfollowUser(currentUser.uid, userId)
                setIsFollowing(false)
                setProfileUser((prev: any) => ({
                    ...prev,
                    followersCount: Math.max(0, (prev.followersCount || 0) - 1)
                }))
                setFollowersList(prev => prev.filter(f => f.uid !== currentUser.uid))
                toast.success("تم إلغاء المتابعة")
            } else {
                await followUser(currentUser.uid, userId)
                setIsFollowing(true)
                setProfileUser((prev: any) => ({
                    ...prev,
                    followersCount: (prev.followersCount || 0) + 1
                }))
                setFollowersList(prev => [...prev, {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                }])
                toast.success("تمت المتابعة بنجاح")
            }
        } catch (error) {
            console.error("Follow error:", error)
            toast.error("حدث خطأ ما")
        } finally {
            setFollowLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 animate-pulse">Loading Profile...</p>
                </div>
            </div>
        )
    }

    if (!profileUser) return null

    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U'
    const joinDate = profileUser.metadata?.creationTime
        ? new Date(profileUser.metadata.creationTime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Unknown'

    // Calculate level based on XP (simplified)
    const currentLevel = Math.floor((stats?.totalPoints || 0) / 1000) + 1
    const nextLevelXP = currentLevel * 1000
    const currentLevelXP = (stats?.totalPoints || 0) % 1000
    const progressPercent = (currentLevelXP / 1000) * 100

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* ── Dynamic Background ── */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            {/* ── Profile Cover ── */}
            <div className="h-[350px] relative w-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 animate-gradient-shift bg-[length:200%_200%]"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 -mt-32 pb-20">

                {/* ── Header Section ── */}
                <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    {/* Avatar with Ring */}
                    <div className="relative group shrink-0 mx-auto md:mx-0">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur transition-opacity duration-500 group-hover:opacity-100 animate-pulse-slow"></div>
                        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#020617] bg-[#020617] overflow-hidden">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={profileUser.photoURL || profileUser.photoBase64} className="object-cover" />
                                <AvatarFallback className="bg-slate-900 text-slate-300 text-4xl">{getInitials(profileUser.displayName)}</AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Level Badge */}
                        <div className="absolute -bottom-2 -right-2 md:bottom-2 md:right-2">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-[1px] rounded-2xl shadow-lg shadow-amber-500/20">
                                <div className="bg-black/90 px-3 py-1 rounded-[14px] flex flex-col items-center">
                                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Lvl</span>
                                    <span className="text-xl font-black text-white leading-none">{currentLevel}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Check if user is viewing their own profile */}
                    <div className="flex-1 text-center md:text-right space-y-3 pb-2 w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                                    {profileUser.displayName}
                                    {achievements.length > 5 && <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/50" variant="outline"><Crown size={14} className="mr-1" /> Elite</Badge>}
                                </h1>
                                <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2 mt-2 font-light flex-wrap">
                                    {(profileUser as any).program && <><GraduationCap size={16} /> {(profileUser as any).program}</>}
                                    {(profileUser as any).program && (profileUser as any).location && <span className="text-slate-600">|</span>}
                                    {(profileUser as any).location && <><MapPin size={16} /> {(profileUser as any).location}</>}
                                    {!(profileUser as any).program && !(profileUser as any).location && <span className="text-slate-500">{language === 'ar' ? 'لم يتم تعيين التخصص بعد' : 'No program set yet'}</span>}
                                </p>
                                {(profileUser as any).bio && (
                                    <p className="text-slate-300 text-sm mt-3 max-w-2xl leading-relaxed font-light">
                                        {(profileUser as any).bio}
                                    </p>
                                )}
                                {(profileUser as any).username && (
                                    <p className="text-slate-500 text-sm mt-1 font-mono">@{(profileUser as any).username}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 shrink-0">
                                {currentUser?.uid !== userId && (
                                    <Button
                                        onClick={handleFollow}
                                        disabled={followLoading}
                                        size="lg"
                                        className={cn(
                                            "min-w-[140px] shadow-lg transition-all border",
                                            isFollowing
                                                ? "bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700"
                                                : "bg-blue-600 border-blue-500 hover:bg-blue-500 text-white shadow-blue-500/20"
                                        )}
                                    >
                                        {isFollowing ? <><UserMinus className="mr-2 w-4 h-4" /> Unfollow</> : <><UserPlus className="mr-2 w-4 h-4" /> Follow</>}
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-white/5 hover:bg-white/10 rounded-full">
                                    <MessageSquare size={18} />
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-white/5 hover:bg-white/10 rounded-full">
                                    <Share2 size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Social Links & Join Date */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                            {(profileUser as any).socialLinks?.github && (
                                <a href={`https://${(profileUser as any).socialLinks.github}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24292e] text-white hover:bg-[#2f363d] border border-white/5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                                    <Github size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-sm">GitHub</span>
                                </a>
                            )}
                            {(profileUser as any).socialLinks?.linkedin && (
                                <a href={`https://${(profileUser as any).socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077b5] text-white hover:bg-[#0088cc] border border-white/5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                                    <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-sm">LinkedIn</span>
                                </a>
                            )}
                            {(profileUser as any).socialLinks?.website && (
                                <a href={`https://${(profileUser as any).socialLinks.website}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 border border-white/5 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                                    <Globe size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="font-medium text-sm">Portfolio</span>
                                </a>
                            )}

                            <div className="ml-auto flex items-center gap-2 text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <Calendar size={14} />
                                <span className="text-xs font-medium">{language === 'ar' ? `انضم ${joinDate}` : `Joined ${joinDate}`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Layout Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Stats & Skills */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Stats Card */}
                        <Card className="bg-[#0b101b]/80 border-white/5 backdrop-blur-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-24 bg-blue-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/5 divide-x-reverse">
                                    <button className="group">
                                        <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{stats?.totalPoints || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">XP</div>
                                    </button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="group">
                                                <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{followersList.length}</div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Followers</div>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-slate-900 border-white/10 text-white">
                                            <DialogHeader><DialogTitle>Followers</DialogTitle></DialogHeader>
                                            <ScrollArea className="h-72 pr-4">{followersList.map(f => (
                                                <div key={f.uid} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg mb-2 cursor-pointer" onClick={() => router.push(`/profile/${f.uid}`)}>
                                                    <Avatar className="w-10 h-10 border border-white/10"><AvatarImage src={f.photoURL} /><AvatarFallback>{getInitials(f.displayName)}</AvatarFallback></Avatar>
                                                    <div className="font-medium">{f.displayName}</div>
                                                </div>
                                            ))}</ScrollArea>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="group">
                                                <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{followingList.length}</div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">Following</div>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-slate-900 border-white/10 text-white">
                                            <DialogHeader><DialogTitle>Following</DialogTitle></DialogHeader>
                                            <ScrollArea className="h-72 pr-4">{followingList.map(f => (
                                                <div key={f.uid} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg mb-2 cursor-pointer" onClick={() => router.push(`/profile/${f.uid}`)}>
                                                    <Avatar className="w-10 h-10 border border-white/10"><AvatarImage src={f.photoURL} /><AvatarFallback>{getInitials(f.displayName)}</AvatarFallback></Avatar>
                                                    <div className="font-medium">{f.displayName}</div>
                                                </div>
                                            ))}</ScrollArea>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rank Progress */}
                        <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border-white/10 backdrop-blur-xl relative overflow-hidden">
                            <CardHeader className="relative z-10">
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Sparkles className="w-5 h-5 text-amber-400" /> Rank Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-300 font-medium">Level {currentLevel}</span>
                                    <span className="text-blue-300 font-bold">{Math.round(progressPercent)}%</span>
                                </div>
                                <Progress value={progressPercent} className="h-3 bg-slate-800 mb-2" />
                                <div className="text-xs text-slate-500 text-right font-mono">{currentLevelXP} / 1000 XP</div>
                            </CardContent>
                            {/* Background decoration */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        </Card>

                        {/* Skills Radar Chart */}
                        <Card className="bg-[#0b101b]/80 border-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Skills Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILLS_DATA}>
                                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                        <Radar name="Skills" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#60a5fa' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                    </div>

                    {/* RIGHT COLUMN: Tabs & Feed */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                            <div className="flex items-center justify-between mb-6">
                                <TabsList className="bg-[#0b101b]/80 border border-white/5 p-1 rounded-xl h-12 w-full max-w-md">
                                    <TabsTrigger value="overview" className="flex-1 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
                                    <TabsTrigger value="achievements" className="flex-1 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">Achievements</TabsTrigger>
                                    <TabsTrigger value="activity" className="flex-1 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">Activity</TabsTrigger>
                                </TabsList>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* OVERVIEW TAB */}
                                <TabsContent value="overview" className="space-y-6 mt-0">
                                    {/* Activity Graph */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                        <Card className="bg-[#0b101b]/80 border-white/5">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-white">Weekly Activity</CardTitle>
                                            </CardHeader>
                                            <CardContent className="h-[200px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={ACTIVITY_CHART_DATA}>
                                                        <defs>
                                                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    {/* Recent Badges Row */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white">Latest Badges</h3>
                                            <Button variant="link" className="text-blue-400" onClick={() => setActiveTab("achievements")}>View All</Button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {achievements.slice(0, 4).map((badge, i) => (
                                                <div key={i} className="bg-[#1e293b]/50 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                                                        {badge.icon || "🏆"}
                                                    </div>
                                                    <div className="font-bold text-sm text-slate-200 truncate w-full">{badge.title}</div>
                                                    <div className="text-[10px] text-slate-500">{new Date(badge.unlockedAt?.seconds * 1000).toLocaleDateString()}</div>
                                                </div>
                                            ))}
                                            {achievements.length === 0 && (
                                                <div className="col-span-4 text-center py-8 text-slate-500 border border-dashed border-white/10 rounded-xl">No badges yet. Start learning!</div>
                                            )}
                                        </div>
                                    </motion.div>
                                </TabsContent>

                                {/* ACHIEVEMENTS TAB */}
                                <TabsContent value="achievements" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {achievements.map((achievement: any, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                key={achievement.id}
                                                className="group relative overflow-hidden p-5 rounded-2xl bg-[#0b101b]/80 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
                                            >
                                                {/* Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                                <div className="flex gap-4 relative z-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-2xl shadow-lg shadow-blue-900/20 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                        {achievement.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h3 className="font-bold text-white text-base truncate pr-2">{achievement.title}</h3>
                                                            {achievement.unlockedAt && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] px-1.5 h-5">Unlocked</Badge>}
                                                        </div>
                                                        <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">{achievement.description}</p>
                                                        {achievement.unlockedAt && (
                                                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 opacity-70">
                                                                <Calendar size={10} /> {new Date(achievement.unlockedAt.seconds * 1000).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {achievements.length === 0 && <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-3xl bg-white/5">No achievements yet.</div>}
                                </TabsContent>

                                {/* ACTIVITY TAB */}
                                <TabsContent value="activity" className="mt-0">
                                    <div className="space-y-0 relative border-l border-white/10 ml-4 pl-8 py-2">
                                        {activities.map((activity, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="mb-8 relative"
                                            >
                                                <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-[#020617] border-2 border-blue-500 flex items-center justify-center z-10">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                                </div>
                                                <div className="bg-[#0b101b]/60 border border-white/5 p-4 rounded-xl hover:bg-[#1e293b]/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-semibold text-white text-sm">{activity.details}</h4>
                                                        <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(activity.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400">Completed activity in <span className="text-blue-400">{activity.type || 'General'}</span> category.</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {activities.length === 0 && <div className="text-slate-500 italic ml-2">No recent activity found.</div>}
                                    </div>
                                </TabsContent>
                            </AnimatePresence>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
