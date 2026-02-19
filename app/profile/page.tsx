"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { getUserStats, getUserActivities, getUserProfile, updateUserProfile } from "@/lib/user-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
    Activity, StickyNote, TrendingUp, Calendar, Sparkles,
    Loader2, Camera, Lock, Check, Share2, Trophy, Bookmark,
    LogOut, CheckCircle, Clock, Zap, Target, Medal, Users,
    Edit3, Globe, Github, Linkedin, MapPin, GraduationCap, Save, AtSign, User as UserIcon, Eye
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useAchievements } from "@/contexts/AchievementContext"
import { ACHIEVEMENTS } from "@/lib/achievements-data"
import { useLanguage } from "@/contexts/LanguageContext"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ProfilePage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()
    const { progress, unlocked, totalXP, level } = useAchievements()
    const { language, t } = useLanguage()

    const [stats, setStats] = useState<any>(null)
    const [activities, setActivities] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.photoURL || null)

    // Profile editing state
    const [profileData, setProfileData] = useState({
        username: '',
        fullName: '',
        bio: '',
        program: '',
        location: '',
        socialLinks: { github: '', linkedin: '', website: '' }
    })
    const [savingProfile, setSavingProfile] = useState(false)
    const [profileLoaded, setProfileLoaded] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user) {
            setAvatarUrl(user.photoURL)
        }
    }, [user])

    useEffect(() => {
        const loadUserData = async () => {
            if (user?.uid) {
                try {
                    const [statsData, activitiesData, profile] = await Promise.all([
                        getUserStats(user.uid),
                        getUserActivities(user.uid, 10),
                        getUserProfile(user.uid)
                    ])
                    setStats(statsData)
                    setActivities(activitiesData)
                    if (profile) {
                        setProfileData(prev => ({
                            ...prev,
                            username: (profile as any).username || prev.username,
                            fullName: (profile as any).fullName || (profile as any).displayName || user.displayName || prev.fullName,
                            bio: (profile as any).bio || prev.bio,
                            program: (profile as any).program || prev.program,
                            location: (profile as any).location || prev.location,
                            socialLinks: {
                                github: (profile as any).socialLinks?.github || prev.socialLinks.github,
                                linkedin: (profile as any).socialLinks?.linkedin || prev.socialLinks.linkedin,
                                website: (profile as any).socialLinks?.website || prev.socialLinks.website
                            }
                        }))
                        setProfileLoaded(true)
                    }
                } catch (error) {
                    console.error("Error loading user data:", error)
                } finally {
                    setLoadingData(false)
                }
            }
        }

        if (user?.uid && !profileLoaded) {
            loadUserData()
        }
    }, [user?.uid])

    const handleSaveProfile = async () => {
        if (!user) return
        try {
            setSavingProfile(true)
            await updateUserProfile(user.uid, profileData)
            toast.success(language === 'ar' ? 'تم حفظ البروفايل بنجاح!' : 'Profile saved successfully!')
        } catch (error: any) {
            if (error.message === 'USERNAME_TAKEN') {
                toast.error(language === 'ar' ? 'اسم المستخدم مأخوذ، اختر اسماً آخر' : 'Username is taken, choose another')
            } else {
                toast.error(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving profile')
            }
        } finally {
            setSavingProfile(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("حجم الملف كبير جداً")
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error("يرجى اختيار ملف صورة صحيح")
            return
        }

        try {
            setUploading(true)
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = async (event) => {
                const img = new Image()
                img.src = event.target?.result as string
                img.onload = async () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    const MAX_WIDTH = 300
                    const MAX_HEIGHT = 300
                    let width = img.width
                    let height = img.height
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }
                    canvas.width = width
                    canvas.height = height
                    ctx?.drawImage(img, 0, 0, width, height)
                    const base64String = canvas.toDataURL('image/jpeg', 0.8)

                    const { doc, setDoc } = await import('firebase/firestore')
                    const { db } = await import('@/lib/firebase')

                    await setDoc(doc(db, 'users', user.uid), {
                        photoBase64: base64String,
                        updatedAt: new Date()
                    }, { merge: true })

                    setAvatarUrl(base64String)
                    toast.success("تم تحديث الصورة الشخصية بنجاح")
                    setUploading(false)
                }
            }
        } catch (error) {
            console.error("Error saving image:", error)
            toast.error("حدث خطأ أثناء حفظ الصورة")
            setUploading(false)
        }
    }

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const joinDate = user.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Unknown'

    const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
        const aUnlocked = unlocked[a.id] ? 1 : 0;
        const bUnlocked = unlocked[b.id] ? 1 : 0;
        if (aUnlocked !== bUnlocked) return bUnlocked - aUnlocked;
        return (progress[b.id] || 0) - (progress[a.id] || 0);
    });

    const unlockedCount = Object.keys(unlocked).length;
    const progressPercentage = (unlockedCount / ACHIEVEMENTS.length) * 100;

    // Mock Chart Data - In a real app, calculate this from actual activity logs timestamps
    const activityData = [
        { name: language === 'ar' ? 'السبت' : 'Sat', activity: 4 },
        { name: language === 'ar' ? 'الأحد' : 'Sun', activity: 7 },
        { name: language === 'ar' ? 'الاثنين' : 'Mon', activity: 3 },
        { name: language === 'ar' ? 'الثلاثاء' : 'Tue', activity: 8 },
        { name: language === 'ar' ? 'الأربعاء' : 'Wed', activity: 6 },
        { name: language === 'ar' ? 'الخميس' : 'Thu', activity: 5 },
        { name: language === 'ar' ? 'الجمعة' : 'Fri', activity: 2 },
    ]

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-[#0f172a]" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f172a]/80 backdrop-blur-2xl shadow-2xl group"
                >
                    {/* Dynamic Banner */}
                    <div className="h-64 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 opacity-90" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]" />

                        {/* Animated background shapes */}
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-purple-500/30 rounded-full blur-[120px] animate-pulse-slow" />
                        <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse-slower" />
                    </div>

                    <div className="px-8 pb-8 -mt-24 flex flex-col md:flex-row items-end md:items-center gap-8 relative z-10">

                        {/* Avatar Section */}
                        <div className="relative group/avatar">
                            <div className="w-44 h-44 rounded-full p-1.5 bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-md border border-white/20 shadow-2xl relative">
                                {/* Glowing ring */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-xl opacity-50 group-hover/avatar:opacity-75 transition-opacity duration-500" />

                                <Avatar className="w-full h-full border-4 border-[#0f172a] relative z-10 group-hover/avatar:scale-[1.02] transition-transform duration-500">
                                    <AvatarImage src={avatarUrl || ""} className="object-cover" />
                                    <AvatarFallback className="bg-slate-900 text-white text-5xl font-black bg-gradient-to-br from-violet-600 to-indigo-600">
                                        {user.displayName ? getInitials(user.displayName) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <label className="absolute bottom-2 right-2 w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-white/10 border-4 border-[#0f172a] transition-all hover:scale-110 active:scale-95 z-20 hover:bg-violet-50">
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-violet-600" /> : <Camera className="w-5 h-5 text-violet-600" />}
                                <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-right pb-2 space-y-3">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-2">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                                        {profileData.fullName || user.displayName || (language === 'ar' ? 'مستخدم' : 'User')}
                                    </h1>
                                    {profileData.username && (
                                        <p className="text-slate-400 text-sm mt-1 font-mono">@{profileData.username}</p>
                                    )}
                                </div>
                                <Badge variant="outline" className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/20 px-4 py-1.5 text-sm font-semibold rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    <Medal className="w-4 h-4 mr-2 text-amber-400" />
                                    {language === 'ar' ? 'عضو مميز' : 'Premium Member'}
                                </Badge>
                            </div>

                            {/* Bio */}
                            {profileData.bio && (
                                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-light">
                                    {profileData.bio}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-slate-300 text-sm font-medium">
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    {user.email}
                                </span>
                                {profileData.program && (
                                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <GraduationCap className="w-4 h-4 text-cyan-400" />
                                        {profileData.program}
                                    </span>
                                )}
                                {profileData.location && (
                                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <MapPin className="w-4 h-4 text-pink-400" />
                                        {profileData.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <Calendar className="w-4 h-4 text-violet-400" />
                                    {language === 'ar' ? `انضم في ${joinDate}` : `Joined ${joinDate}`}
                                </span>
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    {stats?.followersCount || 0} {language === 'ar' ? 'متابعين' : 'Followers'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
                            <Button variant="secondary" className="flex-1 md:flex-none h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300" asChild>
                                <Link href="/bookmarks">
                                    <Bookmark className="w-5 h-5 mr-2 text-indigo-400" />
                                    {language === 'ar' ? 'المفضلة' : 'Bookmarks'}
                                </Link>
                            </Button>
                            <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 text-slate-300 hover:text-white" asChild>
                                <Link href={`/p/${user.uid}`} target="_blank">
                                    <Eye className="w-5 h-5 mr-2 text-blue-400" />
                                    {language === 'ar' ? 'مشاهدة البروفايل' : 'View Public Profile'}
                                </Link>
                            </Button>
                            <Button variant="destructive" className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 hover:scale-105 transition-all duration-300" onClick={logout}>
                                <LogOut className="w-5 h-5 mr-2" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Rank */}
                    <div className="space-y-8 lg:col-span-1">

                        {/* Rank Card */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl overflow-hidden relative shadow-xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                        {language === 'ar' ? 'المستوى الحالي' : 'Current Rank'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center py-6">
                                        <div className="relative mb-6 group cursor-default">
                                            {/* Rank Circle */}
                                            <div className="w-32 h-32 rounded-full border-[6px] border-[#0f172a] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-500">
                                                <Trophy className="w-14 h-14 text-white drop-shadow-md" />
                                            </div>
                                            {/* Level Badge */}
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0f172a] border border-amber-500/50 px-4 py-1.5 rounded-full text-sm font-black text-amber-500 shadow-lg z-20 whitespace-nowrap">
                                                LEVEL {level}
                                            </div>
                                            {/* Glows */}
                                            <div className="absolute inset-0 rounded-full bg-amber-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                        </div>

                                        <div className="w-full space-y-3">
                                            <div className="flex justify-between text-sm font-medium px-1">
                                                <span className="text-slate-400">XP Progress</span>
                                                <span className="text-white">{totalXP} <span className="text-slate-500 text-xs">/ {1000} XP</span></span>
                                            </div>
                                            <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(totalXP % 1000) / 10}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                                />
                                            </div>
                                            <p className="text-xs text-center text-slate-500 mt-2 font-mono">
                                                {1000 - (totalXP % 1000)} XP needed for Level {level + 1}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <StatsCard
                                icon={<CheckCircle className="w-6 h-6" />}
                                label={language === 'ar' ? 'مكتمل' : 'Completed'}
                                value={stats?.completedCount || 0}
                                color="text-emerald-400"
                                bg="from-emerald-500/20 to-teal-500/5"
                                border="border-emerald-500/20"
                            />
                            <StatsCard
                                icon={<Clock className="w-6 h-6" />}
                                label={language === 'ar' ? 'قيد القراءة' : 'Reading'}
                                value={stats?.inProgressCount || 0}
                                color="text-blue-400"
                                bg="from-blue-500/20 to-indigo-500/5"
                                border="border-blue-500/20"
                            />
                            <StatsCard
                                icon={<Zap className="w-6 h-6" />}
                                label={language === 'ar' ? 'تفاعل' : 'Actions'}
                                value={stats?.activitiesCount || 0}
                                color="text-yellow-400"
                                bg="from-amber-500/20 to-orange-500/5"
                                border="border-amber-500/20"
                            />
                            <StatsCard
                                icon={<Target className="w-6 h-6" />}
                                label={language === 'ar' ? 'أوسمة' : 'Badges'}
                                value={unlockedCount}
                                color="text-purple-400"
                                bg="from-purple-500/20 to-fuchsia-500/5"
                                border="border-purple-500/20"
                            />
                        </motion.div>
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="edit" className="space-y-8">
                            <TabsList className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 p-1.5 w-full flex justify-start h-14 rounded-2xl shadow-lg">
                                <TabsTrigger value="edit" className="flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white font-medium transition-all duration-300">
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    {language === 'ar' ? 'تعديل البروفايل' : 'Edit Profile'}
                                </TabsTrigger>
                                <TabsTrigger value="achievements" className="flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-medium transition-all duration-300">
                                    <Medal className="w-4 h-4 mr-2" />
                                    {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                                </TabsTrigger>
                                <TabsTrigger value="activity" className="flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-medium transition-all duration-300">
                                    <Activity className="w-4 h-4 mr-2" />
                                    {language === 'ar' ? 'النشاط' : 'Activity'}
                                </TabsTrigger>
                                <TabsTrigger value="stats" className="flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white font-medium transition-all duration-300">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    {language === 'ar' ? 'التحليلات' : 'Analytics'}
                                </TabsTrigger>
                            </TabsList>

                            {/* ═══════ EDIT PROFILE TAB ═══════ */}
                            <TabsContent value="edit" className="space-y-6">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card className="border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl overflow-hidden relative shadow-xl">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                <Edit3 className="w-5 h-5 text-pink-400" />
                                                {language === 'ar' ? 'تخصيص البروفايل' : 'Customize Profile'}
                                            </CardTitle>
                                            <CardDescription className="text-slate-400">
                                                {language === 'ar' ? 'هذه المعلومات ستظهر للآخرين عند زيارة بروفايلك في المجتمع' : 'This info will be visible to others when they visit your profile'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6 relative z-10">

                                            {/* Username */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <AtSign className="w-4 h-4 text-violet-400" />
                                                    {language === 'ar' ? 'اسم المستخدم (Username)' : 'Username'}
                                                </label>
                                                <Input
                                                    placeholder={language === 'ar' ? 'مثال: ahmed_dev' : 'e.g. ahmed_dev'}
                                                    value={profileData.username}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() }))}
                                                    className="bg-white/5 border-white/10 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 h-12 rounded-xl text-white placeholder:text-slate-500 font-mono"
                                                    maxLength={20}
                                                    dir="ltr"
                                                />
                                                <p className="text-xs text-slate-500">{language === 'ar' ? 'أحرف إنجليزية وأرقام و _ فقط' : 'Letters, numbers and underscore only'}</p>
                                            </div>

                                            {/* Full Name */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-blue-400" />
                                                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                                </label>
                                                <Input
                                                    placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed'}
                                                    value={profileData.fullName}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                                                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 h-12 rounded-xl text-white placeholder:text-slate-500"
                                                    maxLength={50}
                                                />
                                            </div>

                                            {/* Bio */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <Edit3 className="w-4 h-4 text-emerald-400" />
                                                    {language === 'ar' ? 'نبذة عنك (Bio)' : 'Bio'}
                                                </label>
                                                <Textarea
                                                    placeholder={language === 'ar' ? 'اكتب نبذة قصيرة عن نفسك...' : 'Write a short bio about yourself...'}
                                                    value={profileData.bio}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                                    className="bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 rounded-xl text-white placeholder:text-slate-500 min-h-[100px] resize-none"
                                                    maxLength={200}
                                                />
                                                <p className="text-xs text-slate-500 text-left" dir="ltr">{profileData.bio.length}/200</p>
                                            </div>

                                            {/* Program & Location Row */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-cyan-400" />
                                                        {language === 'ar' ? 'التخصص / البرنامج' : 'Program / Major'}
                                                    </label>
                                                    <Input
                                                        placeholder={language === 'ar' ? 'مثال: BTEC IT Level 3' : 'e.g. BTEC IT Level 3'}
                                                        value={profileData.program}
                                                        onChange={(e) => setProfileData(prev => ({ ...prev, program: e.target.value }))}
                                                        className="bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 h-12 rounded-xl text-white placeholder:text-slate-500"
                                                        maxLength={40}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-pink-400" />
                                                        {language === 'ar' ? 'الموقع' : 'Location'}
                                                    </label>
                                                    <Input
                                                        placeholder={language === 'ar' ? 'مثال: الرياض' : 'e.g. Riyadh'}
                                                        value={profileData.location}
                                                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                                        className="bg-white/5 border-white/10 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 h-12 rounded-xl text-white placeholder:text-slate-500"
                                                        maxLength={30}
                                                    />
                                                </div>
                                            </div>

                                            {/* Social Links */}
                                            <div className="space-y-4">
                                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-indigo-400" />
                                                    {language === 'ar' ? 'روابط التواصل (اختياري)' : 'Social Links (Optional)'}
                                                </label>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                                                            <Github className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                        <Input
                                                            placeholder="github.com/username"
                                                            value={profileData.socialLinks.github}
                                                            onChange={(e) => setProfileData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, github: e.target.value } }))}
                                                            className="bg-white/5 border-white/10 focus:border-white/20 h-10 rounded-lg text-white placeholder:text-slate-600 text-sm"
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                                                            <Linkedin className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <Input
                                                            placeholder="linkedin.com/in/username"
                                                            value={profileData.socialLinks.linkedin}
                                                            onChange={(e) => setProfileData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                                                            className="bg-white/5 border-white/10 focus:border-white/20 h-10 rounded-lg text-white placeholder:text-slate-600 text-sm"
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-white/5">
                                                            <Globe className="w-5 h-5 text-emerald-400" />
                                                        </div>
                                                        <Input
                                                            placeholder="yourwebsite.com"
                                                            value={profileData.socialLinks.website}
                                                            onChange={(e) => setProfileData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, website: e.target.value } }))}
                                                            className="bg-white/5 border-white/10 focus:border-white/20 h-10 rounded-lg text-white placeholder:text-slate-600 text-sm"
                                                            dir="ltr"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <Button
                                                onClick={handleSaveProfile}
                                                disabled={savingProfile}
                                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-lg font-bold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:scale-[1.01] transition-all duration-300"
                                            >
                                                {savingProfile ? (
                                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</>
                                                ) : (
                                                    <><Save className="w-5 h-5 mr-2" /> {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}</>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="achievements" className="space-y-6">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                                    {/* Overall Progress */}
                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-transparent border border-white/10 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {language === 'ar' ? 'تقدم الإنجازات' : 'Achievement Progress'}
                                            </h3>
                                            <span className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</span>
                                        </div>
                                        <Progress value={progressPercentage} className="h-3 bg-slate-800" />
                                        <p className="text-sm text-slate-400 mt-2">
                                            {language === 'ar'
                                                ? `حصلت على ${unlockedCount} من أصل ${ACHIEVEMENTS.length} وسام`
                                                : `You have earned ${unlockedCount} out of ${ACHIEVEMENTS.length} badges`}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sortedAchievements.map((achievement, index) => {
                                            const isUnlocked = unlocked[achievement.id];
                                            const currentProgress = progress[achievement.id] || 0;
                                            const percent = Math.min(100, (currentProgress / achievement.maxProgress) * 100);
                                            const Icon = achievement.icon;

                                            return (
                                                <motion.div
                                                    key={achievement.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <div className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-300 h-full
                                                        ${isUnlocked
                                                            ? 'bg-slate-900/60 border-primary/30 shadow-lg shadow-primary/5 hover:border-primary/50'
                                                            : 'bg-slate-950/40 border-white/5 opacity-70 hover:opacity-100'}`}
                                                    >
                                                        {isUnlocked && <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />}

                                                        <div className="flex gap-4 relative z-10">
                                                            <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-xl
                                                                ${isUnlocked ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-500'}`}>
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className={`font-bold truncate ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                                                        {language === 'ar' ? achievement.titleAr : achievement.titleEn}
                                                                    </h4>
                                                                    {isUnlocked ? (
                                                                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] px-1.5 py-0">Completed</Badge>
                                                                    ) : (
                                                                        <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                                                                            {currentProgress}/{achievement.maxProgress}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                                    {language === 'ar' ? achievement.descriptionAr : achievement.descriptionEn}
                                                                </p>
                                                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                                                    <span className="text-yellow-500 flex items-center gap-1">
                                                                        <Zap className="w-3 h-3" /> +{achievement.xp} XP
                                                                    </span>
                                                                    {!isUnlocked && (
                                                                        <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-slate-600" style={{ width: `${percent}%` }} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="activity">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                    {activities.length === 0 ? (
                                        <Card className="bg-slate-950/50 border-white/10 p-12 text-center rounded-3xl border-dashed">
                                            <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 border border-white/5">
                                                <Activity className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{language === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}</h3>
                                            <p className="text-slate-500">{language === 'ar' ? 'ابدأ في استكشاف الموقع لتسجيل نشاطك' : 'Start exploring to track your journey'}</p>
                                        </Card>
                                    ) : (
                                        <div className="relative border-r border-white/10 mr-4 pr-6 space-y-8">
                                            {activities.map((activity, i) => (
                                                <motion.div
                                                    key={activity.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="relative group"
                                                >
                                                    {/* Timeline Dot */}
                                                    <div className={`absolute top-0 -right-[43px] w-4 h-4 rounded-full border-2 border-[#0f172a] ${getActivityColor(activity.type, true)} ring-4 ring-[#0f172a] shadow-lg`} />

                                                    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all shadow-sm group-hover:shadow-md">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}>
                                                                    {getActivityIcon(activity.type)}
                                                                </div>
                                                                <h4 className="font-bold text-white text-base">{activity.details}</h4>
                                                            </div>
                                                            <span className="text-xs font-mono text-slate-500 bg-black/20 px-2 py-1 rounded">{formatActivityDate(activity.createdAt)}</span>
                                                        </div>

                                                        {activity.resourceTitle && (
                                                            <div className="mt-2 pl-[52px]">
                                                                <div className="flex items-center gap-2 text-sm text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                    <span className="truncate">{activity.resourceTitle}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="stats">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    {/* Activity Chart */}
                                    <Card className="bg-slate-950/50 border-white/10 mb-6">
                                        <CardHeader>
                                            <CardTitle className="text-base">{language === 'ar' ? 'النشاط الأسبوعي' : 'Weekly Activity'}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="h-[250px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={activityData}>
                                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    />
                                                    <Bar dataKey="activity" radius={[4, 4, 0, 0]}>
                                                        {activityData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#8b5cf6' : '#3b82f6'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Card className="bg-slate-950/50 border-white/10">
                                            <CardContent className="p-5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-400 text-sm mb-1">{language === 'ar' ? 'متوسط الـ XP اليومي' : 'Avg. Daily XP'}</p>
                                                    <p className="text-2xl font-bold text-white">45 XP</p>
                                                </div>
                                                <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-slate-950/50 border-white/10">
                                            <CardContent className="p-5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-400 text-sm mb-1">{language === 'ar' ? 'سلسلة النشاط' : 'Day Streak'}</p>
                                                    <p className="text-2xl font-bold text-white">3 Days</p>
                                                </div>
                                                <Sparkles className="w-8 h-8 text-yellow-500 opacity-50" />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ icon, label, value, color, bg, border }: any) {
    return (
        <Card className={`border ${border || 'border-white/5'} bg-gradient-to-br ${bg || 'from-white/5 to-white/0'} overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300`}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-5 flex flex-col items-center justify-center text-center relative z-10">
                <div className={`p-3 rounded-xl ${bg?.split(' ')[0].replace('from-', 'bg-').replace('/20', '/10')} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={color}>{icon}</div>
                </div>
                <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
            </CardContent>
        </Card>
    )
}

function getActivityIcon(type: string) {
    switch (type) {
        case 'bookmark': return <Bookmark className="w-5 h-5 text-indigo-400" />
        case 'complete': return <CheckCircle className="w-5 h-5 text-emerald-400" />
        case 'rating': return <Sparkles className="w-5 h-5 text-amber-400" />
        case 'comment': return <Activity className="w-5 h-5 text-violet-400" />
        case 'note': return <StickyNote className="w-5 h-5 text-pink-400" />
        default: return <Activity className="w-5 h-5 text-slate-400" />
    }
}

function getActivityColor(type: string, isDot = false) {
    const colors = {
        bookmark: isDot ? 'bg-indigo-500' : 'bg-indigo-500/10',
        complete: isDot ? 'bg-emerald-500' : 'bg-emerald-500/10',
        rating: isDot ? 'bg-amber-500' : 'bg-amber-500/10',
        comment: isDot ? 'bg-violet-500' : 'bg-violet-500/10',
        note: isDot ? 'bg-pink-500' : 'bg-pink-500/10',
        default: isDot ? 'bg-slate-500' : 'bg-slate-500/10'
    }
    return (colors as any)[type] || colors.default
}

function formatActivityDate(timestamp: any) {
    if (!timestamp?.seconds) return 'Just now'
    return new Date(timestamp.seconds * 1000).toLocaleDateString()
}
