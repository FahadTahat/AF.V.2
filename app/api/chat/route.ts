export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { message, history, images } = body;

        if (!message && (!images || images.length === 0)) {
            return NextResponse.json(
                { error: "الرسالة أو الصورة مطلوبة" },
                { status: 400 }
            )
        }

        // بناء سياق المحادثة من التاريخ
        let conversationContext = "";
        if (history && Array.isArray(history)) {
            // نأخذ آخر 10 رسائل فقط لتجنب تجاوز الحد المسموح
            const recentHistory = history.slice(-10);
            conversationContext = recentHistory.map((msg: any) =>
                `${msg.role === "user" ? "الطالب" : "المساعد"}: ${msg.content}`
            ).join("\n");
        }

        // سياق النظام لتعريف البوت بمهمته
        const systemPrompt = `أنت مساعد ذكي لموقع AF BTEC.
مهمتك مساعدة الطلاب في استكشاف الموقع.

${images && images.length > 0 ? "ملاحظة: المستخدم أرفق صورة مع رسالته. الرجاء تحليل الصورة والإجابة بناءً عليها." : ""}

القواعد:
1. أجب دائماً باللغة العربية بأسلوب ودود.
2. كن مختصراً ومفيداً.

سجل المحادثة السابق:
${conversationContext}

سؤال الطالب الجديد: ${message}
المساعد:`;

        // استخدام الـ API البديل
        const response = await fetch("https://viscodev.x10.mx/GPT-4/api.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: systemPrompt,
                chat_id: "afbtec_web_user_" + Date.now(),
                message_id: "msg_" + Date.now(),
                images: images // تمرير الصور للـ API
            }),
        })

        const data = await response.json()

        if (data.success && data.response) {
            return NextResponse.json({ response: data.response })
        } else {
            // إذا فشل الـ API البديل، نحاول إرسال رسالة خطأ واضحة
            throw new Error(data.error || "عذراً، لم أستطع الحصول على رد من خادم الذكاء الاصطناعي.")
        }

    } catch (error) {
        console.error("Error in chat API:", error)
        return NextResponse.json(
            { error: `حدث خطأ: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        )
    }
}
