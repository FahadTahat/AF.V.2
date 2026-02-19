"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { getBookmarks } from "@/lib/user-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Bookmark, Download, Trash2, BookOpen, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function BookmarksPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const [loadingBookmarks, setLoadingBookmarks] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login")
        }
    }, [user, loading, router])

    useEffect(() => {
        const loadBookmarks = async () => {
            if (user) {
                try {
                    const data = await getBookmarks(user.uid)
                    setBookmarks(data)
                } catch (error) {
                    console.error("Error loading bookmarks:", error)
                    toast.error("فشل تحميل المفضلة")
                } finally {
                    setLoadingBookmarks(false)
                }
            }
        }
        loadBookmarks()
    }, [user])

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Bookmark className="w-12 h-12 text-primary" />
                        <h1 className="text-4xl font-bold text-white">مفضلتي</h1>
                    </div>
                    <p className="text-slate-400 text-lg">
                        جميع الموارد التي حفظتها للرجوع إليها لاحقاً
                    </p>
                </motion.div>

                {/* Loading State */}
                {loadingBookmarks ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : bookmarks.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Bookmark className="w-12 h-12 text-primary/50" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">لا توجد موارد محفوظة بعد</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            ابدأ بحفظ الموارد المفيدة من صفحة الموارد لتسهيل الوصول إليها
                        </p>
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link href="/resources">
                                <BookOpen className="w-5 h-5 ml-2" />
                                تصفح الموارد
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    /* Bookmarks Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((bookmark, index) => (
                            <motion.div
                                key={bookmark.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all group">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                                                    {bookmark.resourceType === 'book' && '📚 كتاب'}
                                                    {bookmark.resourceType === 'specification' && '📄 مواصفات'}
                                                    {bookmark.resourceType === 'handout' && '📖 شروحات'}
                                                    {bookmark.resourceType === 'explanation' && '👨‍🏫 دليل معلم'}
                                                    {bookmark.resourceType === 'assignment' && '📝 مهام'}
                                                </Badge>
                                                <CardTitle className="text-lg text-white line-clamp-2 group-hover:text-primary transition-colors">
                                                    {bookmark.resourceTitle}
                                                </CardTitle>
                                            </div>
                                            <Bookmark className="w-5 h-5 text-primary fill-primary flex-shrink-0" />
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                                            <Sparkles className="w-4 h-4" />
                                            محفوظ منذ {formatDate(bookmark.createdAt)}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                className="flex-1 bg-primary hover:bg-primary/90"
                                                size="sm"
                                            >
                                                <Link href="/resources">
                                                    <Download className="w-4 h-4 ml-2" />
                                                    تحميل
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Stats Footer */}
                {bookmarks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 text-center"
                    >
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl inline-block">
                            <CardContent className="py-6 px-8">
                                <p className="text-slate-300">
                                    لديك <span className="text-primary font-bold text-xl">{bookmarks.length}</span> مورد محفوظ
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

function formatDate(timestamp: any) {
    if (!timestamp?.seconds) return 'غير معروف'

    const date = new Date(timestamp.seconds * 1000)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'اليوم'
    if (diffDays === 1) return 'أمس'
    if (diffDays < 7) return `منذ ${diffDays} أيام`
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`
    if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} أشهر`
    return `منذ ${Math.floor(diffDays / 365)} سنة`
}
