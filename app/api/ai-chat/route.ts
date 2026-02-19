import { NextResponse } from 'next/server';

const CUSTOM_API = "https://viscodev.x10.mx/GPT-4/api.php";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const messages = JSON.parse(formData.get('messages') as string);
        const image = formData.get('image') as File | null;

        // Get the last user message
        const lastMessage = messages[messages.length - 1];
        const userMessage = lastMessage?.content || '';

        // Build context from previous messages
        let fullMessage = userMessage;
        if (messages.length > 1) {
            const context = messages
                .filter((m: any) => m.role !== 'system')
                .slice(-5) // Last 5 messages for context
                .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');

            fullMessage = `${context}\nUser: ${userMessage}`;
        }

        // Add system instruction prefix
        const systemMsg = messages.find((m: any) => m.role === 'system');
        if (systemMsg) {
            fullMessage = `${systemMsg.content}\n\n${fullMessage}`;
        }

        // If image is provided, add note about it
        if (image) {
            fullMessage = `[المستخدم أرفق صورة]\n${fullMessage}`;
        }

        // Call the custom API
        const response = await fetch(CUSTOM_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: fullMessage,
                chat_id: Date.now().toString(),
                message_id: Date.now().toString()
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.response) {
            return NextResponse.json({ content: data.response });
        } else {
            throw new Error(data.error || 'فشل في الحصول على رد');
        }

    } catch (error: any) {
        console.error('AI Chat API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'خطأ في الاتصال بالخادم' },
            { status: 500 }
        );
    }
}
