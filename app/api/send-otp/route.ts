export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Generate random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send email using Gmail SMTP (you can also use SendGrid, Resend, etc.)
// Send email using Nodemailer
import nodemailer from 'nodemailer'

async function sendEmail(to: string, otp: string) {
    const emailHTML = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>رمز التحقق - AF BTEC</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Tajawal', Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                <!-- Header with gradient -->
                <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 900;">AF BTEC</h1>
                        <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">منصة التعليم الأولى في المملكة</p>
                    </td>
                </tr>
                
                <!-- Body -->
                <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                        <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                            <p style="margin: 0 0 15px; color: #94a3b8; font-size: 16px;">رمز التحقق الخاص بك:</p>
                            <h2 style="margin: 0; color: #3b82f6; font-size: 48px; font-weight: 900; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h2>
                        </div>
                        
                        <p style="margin: 0 0 20px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                            مرحباً بك في <strong style="color: white;">AF BTEC</strong>!
                            <br><br>
                            استخدم الرمز أعلاه لتفعيل حسابك. الرمز صالح لمدة <strong style="color: #3b82f6;">10 دقائق</strong>.
                        </p>
                        
                        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 15px; margin-top: 30px;">
                            <p style="margin: 0; color: #fbbf24; font-size: 14px;">
                                ⚠️ إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة
                            </p>
                        </div>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background: #0f172a; padding: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                        <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                            © 2026 AF BTEC Platform. جميع الحقوق محفوظة.
                        </p>
                        <p style="margin: 0; color: #475569; font-size: 12px;">
                            المنصة التعليمية الأولى لطلاب BTEC في المملكة
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `

    try {
        console.log(`📧 OTP for ${to}: ${otp}`)

        // If environment variables are set, use Nodemailer
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            })

            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"AF BTEC" <noreply@afbtec.com>',
                to: to,
                subject: 'رمز التحقق - AF BTEC',
                html: emailHTML,
            })
            console.log('✅ Email sent successfully via SMTP')
            return { success: true }
        } else {
            console.warn('⚠️ SMTP credentials not found. Email not sent. Check console for OTP.')
            // Simulate success for dev environment so the UI flow continues
            return { success: true, simulated: true }
        }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

export async function POST(request: NextRequest) {
    try {
        const { email, userId } = await request.json()

        if (!email || !userId) {
            return NextResponse.json(
                { error: 'البريد الإلكتروني ومعرف المستخدم مطلوبان' },
                { status: 400 }
            )
        }

        // Generate OTP
        const otp = generateOTP()

        // Store OTP in Firestore with expiration (10 minutes)
        const otpDoc = doc(db, 'otpCodes', userId)
        await setDoc(otpDoc, {
            code: otp,
            email: email,
            createdAt: serverTimestamp(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            verified: false,
            attempts: 0
        })

        // Send email
        await sendEmail(email, otp)

        return NextResponse.json({
            success: true,
            message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
            // For development only - remove in production!
            devOTP: process.env.NODE_ENV === 'development' ? otp : undefined
        })

    } catch (error: any) {
        console.error('Error sending OTP:', error)
        return NextResponse.json(
            { error: 'فشل إرسال رمز التحقق' },
            { status: 500 }
        )
    }
}
