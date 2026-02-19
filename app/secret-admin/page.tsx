"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import {
    collection,
    getDocs,
    writeBatch,
    limit,
    query,
    where,
    updateDoc,
    doc,
    getDoc
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { Trash2, ShieldCheck, Lock, UserX, AlertTriangle, KeyRound } from "lucide-react"

// كلمة المرور السرية - يمكنك تغييرها من هنا
const ADMIN_PASSWORD = "af-btec-master"

export default function HiddenAdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [targetEmail, setTargetEmail] = useState("")
    const { user } = useAuth()

    // تحقق من الجلسة المحفوظة
    useEffect(() => {
        const session = sessionStorage.getItem("admin_session")
        if (session === "true") {
            setIsAuthenticated(true)
        }
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            sessionStorage.setItem("admin_session", "true")
            toast.success("تم تسجيل الدخول بنجاح")
        } else {
            toast.error("كلمة المرور غير صحيحة")
        }
    }

    // حذف جميع المحادثات
    const clearAllChat = async () => {
        if (!confirm("تحذير: هل أنت متأكد من حذف جميع رسائل الشات؟ هذا الإجراء لا يمكن التراجع عنه.")) return

        try {
            setLoading(true)
            const messagesRef = collection(db, "messages")
            const snapshot = await getDocs(messagesRef) // قد يحتاج لتحسين إذا كان العدد ضخماً (batch delete)

            const batch = writeBatch(db)
            let count = 0
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref)
                count++
            })

            if (count > 0) {
                await batch.commit()
                toast.success(`تم حذف ${count} رسالة بنجاح`)
            } else {
                toast.info("لا توجد رسائل لحذفها")
            }
        } catch (error) {
            console.error("Error clearing chat:", error)
            toast.error("حدث خطأ أثناء الحذف")
        } finally {
            setLoading(false)
        }
    }

    // فك الحظر عني
    const unbanSelf = async () => {
        if (!user) {
            toast.error("يجب تسجيل الدخول أولاً")
            return
        }
        try {
            setLoading(true)
            await updateDoc(doc(db, "users", user.uid), {
                timeoutUntil: null
            })
            toast.success("تم فك الحظر عن حسابك")
            // تحديث الصفحة لاحقاً لتنعكس التغييرات
            setTimeout(() => window.location.reload(), 1500)
        } catch (error) {
            console.error("Error unbanning self:", error)
            toast.error("حدث خطأ")
        } finally {
            setLoading(false)
        }
    }

    // فك الحظر عن مستخدم آخر بالايميل
    const unbanUserByEmail = async () => {
        if (!targetEmail) {
            toast.error("يرجى إدخال البريد الإلكتروني")
            return
        }

        try {
            setLoading(true)
            const usersRef = collection(db, "users")
            const q = query(usersRef, where("email", "==", targetEmail))
            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                toast.error("لم يتم العثور على مستخدم بهذا البريد الإلكتروني")
                setLoading(false)
                return
            }

            const batch = writeBatch(db)
            snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, { timeoutUntil: null })
            })

            await batch.commit()
            toast.success(`تم فك الحظر عن المستخدم: ${targetEmail}`)
            setTargetEmail("")
        } catch (error) {
            console.error("Error unbanning user:", error)
            toast.error("حدث خطأ أثناء البحث عن المستخدم")
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-bold">منطقة محظورة</CardTitle>
                        <CardDescription>يرجى إدخال رمز الوصول للمتابعة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <KeyRound className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="رمز الوصول..."
                                    className="pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full font-bold">
                                تأكيد الدخول
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 bg-background/50">
            <div className="container max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            لوحة التحكم السرية
                        </h1>
                        <p className="text-muted-foreground mt-2">إدارة نظام الشات والمستخدمين</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                        sessionStorage.removeItem("admin_session")
                        setIsAuthenticated(false)
                    }}>
                        تسجيل الخروج
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* قسم الشات */}
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="w-5 h-5" />
                                تصفير الشات
                            </CardTitle>
                            <CardDescription>حذف جميع الرسائل نهائياً من قاعدة البيانات</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={clearAllChat}
                                disabled={loading}
                            >
                                {loading ? "جاري التنفيذ..." : "حذف كل الرسائل"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* قسم حسابي */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-green-500" />
                                إدارة حسابي
                            </CardTitle>
                            <CardDescription>إزالة العقوبات عن حسابك الحالي ({user?.email || 'غير مسجل'})</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="default" // Changed from outline to default for better visibility
                                className="w-full"
                                onClick={unbanSelf}
                                disabled={loading || !user}
                            >
                                فك الحظر عني
                            </Button>
                            {!user && <p className="text-xs text-destructive mt-2 text-center">يجب تسجيل الدخول أولاً</p>}
                        </CardContent>
                    </Card>

                    {/* فك حظر مستخدم آخر */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserX className="w-5 h-5" />
                                فك حظر مستخدم
                            </CardTitle>
                            <CardDescription>إدخال البريد الإلكتروني للمستخدم لإزالة العقوبة عنه</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Input
                                    placeholder="example@email.com"
                                    value={targetEmail}
                                    onChange={(e) => setTargetEmail(e.target.value)}
                                    disabled={loading}
                                />
                                <Button onClick={unbanUserByEmail} disabled={loading}>
                                    فك الحظر
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function UserCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    )
}
