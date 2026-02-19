"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getLeaderboard, updateLeaderboardEntry } from "@/lib/user-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Trophy, Medal, Star, Crown, Flame, RefreshCw, User } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function LeaderboardPage() {
    const { user } = useAuth()
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getLeaderboard()
            setLeaderboard(data)
        } catch (error) {
            console.error("Error loading leaderboard:", error)
            toast.error("فشل تحميل قائمة المتصدرين")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleUpdateMyScore = async () => {
        if (!user) {
            toast.error("يجب عليك تسجيل الدخول أولاً")
            return
        }

        setUpdating(true)
        try {
            await updateLeaderboardEntry(user)
            toast.success("تم تحديث نقاطك بنجاح! 🚀")
            await loadData() // Refresh list
        } catch (error) {
            console.error(error)
            toast.error("حدث خطأ أثناء التحديث")
        } finally {
            setUpdating(false)
        }
    }

    if (loading && leaderboard.length === 0) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    const topThree = leaderboard.slice(0, 3)
    const rest = leaderboard.slice(3)

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/10 mb-4"
                    >
                        <Trophy className="w-10 h-10 text-yellow-500" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white">
                        لوحة الأبطال <span className="text-primary">AF BTEC</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        تنافس مع زملائك واجمع النقاط من خلال إنجاز المهام وقراءة الكتب!
                    </p>

                    <div className="pt-4">
                        <Button
                            onClick={handleUpdateMyScore}
                            disabled={updating}
                            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/20"
                        >
                            <RefreshCw className={`w-4 h-4 ml-2 ${updating ? 'animate-spin' : ''}`} />
                            {updating ? 'جاري التحديث...' : 'تحديث نقاطي والمشاركة'}
                        </Button>
                        {!user && <p className="text-xs text-red-400 mt-2">سجل دخولك للمشاركة في المنافسة</p>}
                    </div>
                </div>

                {/* Top 3 Podium */}
                {leaderboard.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 px-4">

                        {/* 2nd Place */}
                        {topThree[1] && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="order-2 md:order-1 w-full md:w-1/3"
                            >
                                <div className="bg-slate-800/50 border border-slate-700 rounded-t-2xl p-6 text-center relative overflow-hidden h-64 flex flex-col justify-end shadow-xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
                                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-slate-400 bg-slate-900 overflow-hidden mb-4 relative">
                                        {topThree[1].photoURL ? (
                                            <img src={topThree[1].photoURL} alt={topThree[1].displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-2xl font-bold">{topThree[1].displayName[0]}</div>
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-slate-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-tl-md">#2</div>
                                    </div>
                                    <h3 className="font-bold text-white text-lg truncate">{topThree[1].displayName}</h3>
                                    <div className="text-slate-400 font-mono font-bold mt-1">{topThree[1].points} XP</div>
                                </div>
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="order-1 md:order-2 w-full md:w-1/3 z-10"
                            >
                                <div className="bg-gradient-to-b from-yellow-500/20 to-slate-900/80 border border-yellow-500/50 rounded-t-2xl p-8 text-center relative overflow-hidden h-80 flex flex-col justify-end shadow-2xl shadow-yellow-500/20">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                        <Crown className="w-20 h-20 text-yellow-400 fill-yellow-400/20 animate-bounce" />
                                    </div>
                                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 bg-slate-900 overflow-hidden mb-4 relative shadow-lg shadow-yellow-500/20">
                                        {topThree[0].photoURL ? (
                                            <img src={topThree[0].photoURL} alt={topThree[0].displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-yellow-500 text-3xl font-bold">{topThree[0].displayName[0]}</div>
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-tl-md">#1</div>
                                    </div>
                                    <h3 className="font-bold text-white text-xl truncate">{topThree[0].displayName}</h3>
                                    <div className="text-yellow-400 font-mono font-bold text-2xl mt-1">{topThree[0].points} XP</div>
                                    <div className="mt-2 inline-flex items-center justify-center gap-1 text-xs text-yellow-200/70 bg-yellow-500/10 px-2 py-1 rounded-full">
                                        <Trophy className="w-3 h-3" />
                                        البطل الحالي
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="order-3 md:order-3 w-full md:w-1/3"
                            >
                                <div className="bg-slate-800/50 border border-orange-700 rounded-t-2xl p-6 text-center relative overflow-hidden h-56 flex flex-col justify-end shadow-xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
                                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-orange-600 bg-slate-900 overflow-hidden mb-4 relative">
                                        {topThree[2].photoURL ? (
                                            <img src={topThree[2].photoURL} alt={topThree[2].displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-orange-600 text-xl font-bold">{topThree[2].displayName[0]}</div>
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-tl-md">#3</div>
                                    </div>
                                    <h3 className="font-bold text-white text-lg truncate">{topThree[2].displayName}</h3>
                                    <div className="text-orange-400 font-mono font-bold mt-1">{topThree[2].points} XP</div>
                                </div>
                            </motion.div>
                        )}

                    </div>
                )}

                {/* The Rest of the List */}
                <div className="space-y-4">
                    {rest.map((entry, index) => (
                        <motion.div
                            key={entry.uid}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 font-mono">
                                        #{index + 4}
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                        {entry.photoURL ? (
                                            <img src={entry.photoURL} alt={entry.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{entry.displayName}</h4>
                                        <p className="text-xs text-slate-500">
                                            {entry.achievements} إنجازات
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold text-primary text-lg">{entry.points}</div>
                                        <div className="text-xs text-slate-500">نقطة</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {leaderboard.length === 0 && !loading && (
                        <div className="text-center py-12 text-slate-500">
                            <p>لا يوجد متصدرين بعد.. كن الأول!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
