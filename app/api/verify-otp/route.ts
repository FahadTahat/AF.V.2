import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
    try {
        const { userId, otp } = await request.json()

        if (!userId || !otp) {
            return NextResponse.json(
                { error: 'معرف المستخدم ورمز التحقق مطلوبان' },
                { status: 400 }
            )
        }

        // Get OTP document from Firestore
        const otpDoc = doc(db, 'otpCodes', userId)
        const otpSnap = await getDoc(otpDoc)

        if (!otpSnap.exists()) {
            return NextResponse.json(
                { error: 'رمز التحقق غير موجود أو منتهي الصلاحية' },
                { status: 404 }
            )
        }

        const otpData = otpSnap.data()

        // Check if already verified
        if (otpData.verified) {
            return NextResponse.json(
                { error: 'تم التحقق من هذا الرمز مسبقاً' },
                { status: 400 }
            )
        }

        // Check attempts (max 5)
        if (otpData.attempts >= 5) {
            await deleteDoc(otpDoc)
            return NextResponse.json(
                { error: 'تم تجاوز عدد المحاولات المسموح بها. يرجى طلب رمز جديد' },
                { status: 429 }
            )
        }

        // Check expiration
        const now = new Date()
        const expiresAt = otpData.expiresAt.toDate()

        if (now > expiresAt) {
            await deleteDoc(otpDoc)
            return NextResponse.json(
                { error: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد' },
                { status: 410 }
            )
        }

        // Verify OTP
        if (otpData.code !== otp) {
            // Increment attempts
            await updateDoc(otpDoc, {
                attempts: otpData.attempts + 1
            })

            const remainingAttempts = 5 - (otpData.attempts + 1)
            return NextResponse.json(
                {
                    error: `رمز التحقق غير صحيح. ${remainingAttempts} محاولات متبقية`,
                    remainingAttempts
                },
                { status: 400 }
            )
        }

        // OTP is correct - mark as verified
        await updateDoc(otpDoc, {
            verified: true
        })

        // Update user document to mark email as verified
        const userDoc = doc(db, 'users', userId)
        await updateDoc(userDoc, {
            emailVerified: true,
            verifiedAt: new Date()
        })

        // Delete OTP document after successful verification
        await deleteDoc(otpDoc)

        return NextResponse.json({
            success: true,
            message: 'تم التحقق من بريدك الإلكتروني بنجاح!'
        })

    } catch (error: any) {
        console.error('Error verifying OTP:', error)
        return NextResponse.json(
            { error: 'حدث خطأ أثناء التحقق من الرمز' },
            { status: 500 }
        )
    }
}
