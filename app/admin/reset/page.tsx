"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import {
    collection,
    getDocs,
    deleteDoc,
    writeBatch,
    limit,
    query,
    getDoc,
    doc,
    updateDoc
} from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { Trash2, AlertTriangle, UserCheck } from "lucide-react"

export default function AdminResetPage() {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    // Function to delete all messages
    const deleteAllMessages = async () => {
        try {
            setLoading(true)
            const messagesRef = collection(db, "messages")
            const q = query(messagesRef, limit(500))

            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                toast.info("لا توجد رسائل لحذفها")
                setLoading(false)
                return
            }

            const batch = writeBatch(db)
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref)
            })

            await batch.commit()
            toast.success(`تم حذف ${snapshot.size} رسالة بنجاح`)

            // Check if more exist
            const nextSnap = await getDocs(q)
            if (!nextSnap.empty) {
                toast.warning("يوجد المزيد من الرسائل، يرجى الضغط مرة أخرى")
            }
        } catch (error) {
            console.error("Error deleting messages:", error)
            toast.error("حدث خطأ أثناء حذف الرسائل")
        } finally {
            setLoading(false)
        }
    }

    // Function to remove timeout from current user
    const removeMyTimeout = async () => {
        if (!user) {
            toast.error("يجب تسجيل الدخول أولاً")
            return
        }

        try {
            setLoading(true)
            const userRef = doc(db, "users", user.uid)

            await updateDoc(userRef, {
                timeoutUntil: null
            })

            toast.success("تم إزالة الحظر عن حسابك بنجاح")
            window.location.reload() // Reload to reflect changes globally
        } catch (error) {
            console.error("Error removing timeout:", error)
            toast.error("حدث خطأ أثناء إزالة الحظر")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-2xl py-20 px-4 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-destructive flex items-center justify-center gap-2">
                    <AlertTriangle className="w-8 h-8" />
                    لوحة تحكم الطوارئ
                </h1>
                <p className="text-muted-foreground">استخدم هذه الأدوات فقط عند الضرورة القصوى</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 border rounded-xl bg-card space-y-4">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        حذف جميع المحادثات
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        سيقوم هذا بحذف جميع الرسائل من جميع القنوات بشكل نهائي.
                    </p>
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={deleteAllMessages}
                        disabled={loading}
                    >
                        {loading ? "جاري الحذف..." : "حذف الكل"}
                    </Button>
                </div>

                <div className="p-6 border rounded-xl bg-card space-y-4">
                    <h2 className="font-semibold flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" />
                        إزالة الحظر عني
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        سيقوم هذا بإلغاء الـ Timeout عن حسابك الحالي فوراً.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={removeMyTimeout}
                        disabled={loading || !user}
                    >
                        فك الحظر
                    </Button>
                </div>
            </div>
        </div>
    )
}
