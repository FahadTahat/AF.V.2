"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getUserStats } from "@/lib/user-data"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Trophy, Calendar, Check, Share2, MapPin, GraduationCap,
    Github, Linkedin, Globe, Users, Star, Medal, Zap, Activity,
    User as UserIcon, Copy, CheckCircle
} from "lucide-react"
import { ACHIEVEMENTS } from "@/lib/achievements-data"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { format } from "date-fns"

export default function PublicProfilePage() {
    const params = useParams()
    const uid = params.uid as string
    const { language } = useLanguage()

    const [userData, setUserData] = useState<any>(null)
    const [userStats, setUserStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [achievements, setAchievements] = useState<any>({ progress: {}, unlocked: {} })

    useEffect(() => {
        const fetchUser = async () => {
            if (!uid) return
            try {
                // Fetch User Profile
                const docRef = doc(db, 'users', uid)
                const docSnap = await getDoc(docRef)

                // Fetch User Stats
                const stats = await getUserStats(uid)
                setUserStats(stats)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setUserData(data)
                    setAchievements({
                        progress: data.achievementsProgress || {},
                        unlocked: data.achievementsUnlocked || {}
                    })
                }
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [uid])

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-lg shadow-primary/20"></div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-[#0f172a] text-white">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <UserIcon className="w-10 h-10 text-slate-500" />
                </div>
                <h1 className="text-4xl font-bold mb-2">404</h1>
                <p className="text-slate-400 text-lg">{language === 'ar' ? 'المستخدم غير موجود' : 'User not found'}</p>
            </div>
        )
    }

    // Calculations
    const unlockedCount = Object.keys(achievements.unlocked).length
    const progressPercentage = (unlockedCount / ACHIEVEMENTS.length) * 100
    const level = userData.achievementsProgress ? Math.floor(Object.values(userData.achievementsUnlocked || {}).length / 2) + 1 : 1
    const joinDate = userData.createdAt?.seconds
        ? format(new Date(userData.createdAt.seconds * 1000), 'MMMM yyyy')
        : 'Unknown'

    const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success(language === 'ar' ? 'تم نسخ الرابط!' : 'Link copied!')
    }

    const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
        const aUnlocked = achievements.unlocked[a.id] ? 1 : 0
        const bUnlocked = achievements.unlocked[b.id] ? 1 : 0
        return bUnlocked - aUnlocked
    })

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#0f172a] text-white overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] opacity-50" />
            </div>

            <div className="container max-w-5xl mx-auto px-4 relative z-10">

                {/* ══════ HERO CARD ══════ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[2.5rem] border border-white/10 bg-[#0f172a]/80 backdrop-blur-2xl shadow-2xl overflow-hidden mb-8"
                >
                    {/* Header Banner */}
                    <div className="h-64 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 opacity-90" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay" />

                        {/* Decorative Circles */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-[#0f172a] to-transparent opacity-80" />

                        <div className="absolute top-4 right-4 z-20">
                            <Button variant="secondary" size="icon" className="rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md" onClick={copyLink}>
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="px-8 pb-8 -mt-20 relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                                <div className="w-40 h-40 rounded-full p-1.5 bg-[#0f172a] relative z-10">
                                    <Avatar className="w-full h-full border-4 border-slate-800 shadow-xl">
                                        <AvatarImage src={userData.photoBase64 || userData.photoURL} className="object-cover" />
                                        <AvatarFallback className="bg-slate-800 text-4xl font-bold bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                                            {getInitials(userData.displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                {/* Level Badge */}
                                <div className="absolute bottom-2 right-2 z-20 bg-amber-500 text-slate-900 text-sm font-black px-3 py-1 rounded-full border-4 border-[#0f172a] shadow-lg flex items-center gap-1 cursor-help hover:scale-110 transition-transform">
                                    <Star className="w-3 h-3 fill-black stroke-black" />
                                    Lvl {level}
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="flex-1 text-center md:text-left rtl:md:text-right space-y-2 mb-2">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center justify-center md:justify-start gap-3">
                                        {userData.displayName}
                                        {userData.role === 'admin' && <Medal className="w-6 h-6 text-blue-400" />}
                                    </h1>
                                    {userData.username && (
                                        <p className="text-slate-400 font-mono text-sm">@{userData.username}</p>
                                    )}
                                </div>

                                <p className="text-slate-300 max-w-2xl text-sm leading-relaxed mx-auto md:mx-0 font-light">
                                    {userData.bio || (language === 'ar' ? 'لا توجد نبذة شخصية.' : 'No bio provided.')}
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-400 pt-2">
                                    {userData.program && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                                            {userData.program}
                                        </div>
                                    )}
                                    {userData.location && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                            <MapPin className="w-3.5 h-3.5 text-pink-400" />
                                            {userData.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                        <Calendar className="w-3.5 h-3.5 text-violet-400" />
                                        {language === 'ar' ? `انضم ${joinDate}` : `Joined ${joinDate}`}
                                    </div>
                                </div>

                                {/* Social Links */}
                                {userData.socialLinks && Object.values(userData.socialLinks).some(Boolean) && (
                                    <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                                        {userData.socialLinks.github && (
                                            <a href={`https://${userData.socialLinks.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        {userData.socialLinks.linkedin && (
                                            <a href={`https://${userData.socialLinks.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="p-2 bg-white/5 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {userData.socialLinks.website && (
                                            <a href={`https://${userData.socialLinks.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="p-2 bg-white/5 text-emerald-400 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-colors border border-white/5">
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/5 divide-x divide-white/5 divide-x-reverse:rtl bg-black/20">
                        <div className="p-4 text-center hover:bg-white/5 transition-colors">
                            <div className="text-xl font-bold text-white">{userStats?.followersCount || 0}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{language === 'ar' ? 'متابعين' : 'Followers'}</div>
                        </div>
                        <div className="p-4 text-center hover:bg-white/5 transition-colors">
                            <div className="text-xl font-bold text-white">{userStats?.followingCount || 0}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{language === 'ar' ? 'يتابع' : 'Following'}</div>
                        </div>
                        <div className="p-4 text-center hover:bg-white/5 transition-colors">
                            <div className="text-xl font-bold text-white">{userStats?.totalPoints || 0}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total XP</div>
                        </div>
                        <div className="p-4 text-center hover:bg-white/5 transition-colors">
                            <div className="text-xl font-bold text-white text-green-400">#{userStats?.rank || '--'}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{language === 'ar' ? 'الترتيب' : 'Rank'}</div>
                        </div>
                    </div>
                </motion.div>

                {/* ══════ TABS CONTENT ══════ */}
                <Tabs defaultValue="achievements" className="space-y-6">
                    <TabsList className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 p-1 w-full flex justify-center h-12 rounded-xl">
                        <TabsTrigger value="achievements" className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium">
                            <Trophy className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-medium">
                            <Activity className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'النشاط' : 'Activity'}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="achievements">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedAchievements.map((ach, index) => {
                                const isUnlocked = achievements.unlocked[ach.id]
                                const Icon = ach.icon
                                if (!isUnlocked && ach.secret) return null

                                return (
                                    <motion.div
                                        key={ach.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className={`h-full border transition-all duration-300 group
                                            ${isUnlocked
                                                ? 'bg-slate-900/60 border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                                                : 'bg-slate-950/40 border-white/5 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                                            <CardContent className="p-4 flex gap-4 items-start">
                                                <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-xl transition-colors
                                                    ${isUnlocked ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className={`font-bold truncate text-sm ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                                            {language === 'ar' ? ach.titleAr : ach.titleEn}
                                                        </h3>
                                                        {isUnlocked && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                                                    </div>
                                                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                                                        {language === 'ar' ? ach.descriptionAr : ach.descriptionEn}
                                                    </p>
                                                    <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-[10px] text-yellow-500 border border-white/5">
                                                        +{ach.xp} XP
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="activity">
                        <Card className="bg-slate-950/50 border-white/10 p-12 text-center rounded-2xl border-dashed">
                            <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 border border-white/5">
                                <Activity className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{language === 'ar' ? 'سجل النشاط' : 'Activity Log'}</h3>
                            <p className="text-slate-500">{language === 'ar' ? 'سجل النشاط لهذا المستخدم غير متاح للعامة حالياً.' : 'This user activity log is currently private.'}</p>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    )
}
