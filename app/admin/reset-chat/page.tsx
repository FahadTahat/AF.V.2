"use client"

import { useState } from "react"
import { db, auth } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export default function ResetChatPage() {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const handleReset = async () => {
        if (!confirm("هل أنت متأكد أنك تريد حذف جميع الرسائل وإزالة الحظر؟ لا يمكن التراجع عن هذا الإجراء.")) return

        setLoading(true)
        try {
            const batch = writeBatch(db)
            let operationCount = 0

            // 1. Delete all messages
            const messagesRef = collection(db, "messages")
            const snapshot = await getDocs(messagesRef)

            snapshot.docs.forEach((document) => {
                batch.delete(document.ref)
                operationCount++
            })

            // 2. Remove timeout from current user
            if (user) {
                const userRef = doc(db, "users", user.uid)
                batch.update(userRef, {
                    timeoutUntil: null
                })
                operationCount++
            }

            // Commit changes
            if (operationCount > 0) {
                await batch.commit()
                toast.success(`تم حذف ${snapshot.size} رسالة وإزالة الحظر بنجاح!`)
            } else {
                toast.info("لا يوجد رسائل لحذفها.")
            }

        } catch (error) {
            console.error("Reset Error:", error)
            toast.error("حدث خطأ أثناء عملية إعادة التعيين: " + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-20 flex flex-col items-center justify-center space-y-8">
            <h1 className="text-3xl font-bold text-red-500">منطقة الخطر - إعادة تعيين الشات</h1>
            <p className="text-center text-muted-foreground max-w-md">
                هذه الصفحة مخصصة للمسؤولين فقط (أو لأغراض التطوير). في هذا الإصدار، يمكن لأي شخص الضغط على الزر أدناه لتنظيف قاعدة البيانات.
            </p>

            <div className="p-8 border border-red-500/30 bg-red-500/5 rounded-xl text-center">
                <p className="mb-4 font-semibold">الإجراءات التي ستتم:</p>
                <ul className="list-disc list-inside text-right mb-6 space-y-2 text-sm">
                    <li>حذف جميع الرسائل من جميع القنوات (مجموعة messages).</li>
                    <li>إزالة الحظر (Timeout) عن حسابك الحالي.</li>
                </ul>

                <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full font-bold"
                >
                    {loading ? "جاري التنظيف..." : "حذف كل شيء وإزالة الحظر"}
                </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-8">
                ملاحظة: تأكد من أن قواعد Firestore (firestore.rules) تسمح بالحذف (تم تحديثها سابقاً لتسمح بذلك).
            </p>
        </div>
    )
}
