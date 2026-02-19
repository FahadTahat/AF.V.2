import { NextRequest, NextResponse } from 'next/server'

const HF_TOKEN = process.env.HUGGING_FACE_TOKEN
const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/roberta-base-openai-detector'

// Fallback local analysis for Arabic text (HF model is English-focused)
function localAnalyze(text: string): { aiScore: number; fallback: boolean } {
    let aiScore = 0
    const input = text.trim()

    // AI formal connectors (Arabic)
    const aiConnectors = [
        "بناءً على ذلك", "من الجدير بالذكر", "في هذا السياق",
        "علاوة على ذلك", "تجدر الإشارة إلى", "في الختام",
        "من ناحية أخرى", "بالإضافة إلى ذلك", "في هذا الصدد",
        "بشكل عام", "مما لا شك فيه", "خلاصة القول",
        "تكمن أهمية", "على سبيل المثال", "نتيجة لذلك",
        "وفي هذا الإطار", "ومن هنا يتضح", "وخلاصة ما سبق",
        "ومما يجدر الإشارة", "وعلى صعيد آخر"
    ]
    let connectorCount = 0
    aiConnectors.forEach(phrase => {
        const regex = new RegExp(phrase, 'g')
        const matches = input.match(regex)
        if (matches) connectorCount += matches.length
    })
    aiScore += Math.min(connectorCount * 7, 40)

    // Perfect punctuation (AI indicator)
    const commas = (input.match(/،/g) || []).length
    const correctCommas = (input.match(/،\s/g) || []).length
    if (commas > 3 && correctCommas === commas) aiScore += 15

    // Colloquialism (human indicators)
    const humanWords = [
        "عشان", "مشان", "بدي", "بدنا", "ليش", "ايش", "شنو",
        "هيك", "كتير", "شلون", "هلا", "رح", "راح", "لسة",
        "طيب", "يعني", "ماشي", "صار", "والله", "أه", "لأ",
        "ياسطا", "اوكي", "تمام", "بصراحة", "بجد", "كده"
    ]
    let humanWordCount = 0
    humanWords.forEach(word => {
        if (input.includes(word)) humanWordCount++
    })
    aiScore -= humanWordCount * 10

    // Repeated punctuation (human)
    if (/\.\.+/.test(input)) aiScore -= 10
    if (/!!+/.test(input)) aiScore -= 10
    if (/\?\?+/.test(input)) aiScore -= 10

    // Long structured text with no colloquialisms often AI
    const avgWordLength = input.replace(/\s+/g, '').length / (input.split(/\s+/).length || 1)
    if (avgWordLength > 5.5 && humanWordCount === 0) aiScore += 10

    // Normalization
    if (aiScore < 0) aiScore = Math.floor(Math.random() * 8) + 2
    if (aiScore > 97) aiScore = 97
    if (text.length < 50) aiScore = Math.floor(Math.random() * 25) + 5

    if (aiScore === 0 && connectorCount === 0 && humanWordCount === 0) {
        aiScore = 40 + Math.floor(Math.random() * 15)
    }

    return { aiScore: Math.floor(aiScore), fallback: true }
}

// Sentence-level analysis
function analyzeSentences(text: string, overallAiScore: number) {
    const aiConnectors = [
        "بناءً على ذلك", "من الجدير بالذكر", "في هذا السياق",
        "علاوة على ذلك", "تجدر الإشارة إلى", "في الختام",
        "من ناحية أخرى", "بالإضافة إلى ذلك", "في هذا الصدد",
        "بشكل عام", "خلاصة القول", "تكمن أهمية",
        "على سبيل المثال", "نتيجة لذلك"
    ]
    const humanWords = [
        "عشان", "مشان", "بدي", "ليش", "هيك", "كتير",
        "شلون", "هلا", "رح", "يعني", "ماشي", "والله", "بجد"
    ]

    const sentences = text.match(/[^.!?،\n]+[.!?،\n]*/g) || [text]
    return sentences
        .filter(s => s.trim().length > 3)
        .map(s => {
            let sScore = 0
            aiConnectors.forEach(c => { if (s.includes(c)) sScore += 25 })
            if (s.length > 30 && s.match(/،\s/)) sScore += 12
            humanWords.forEach(w => { if (s.includes(w)) sScore -= 30 })
            if (/\.\.+|!!+/.test(s)) sScore -= 15

            let type: 'ai' | 'human' | 'mixed' = 'mixed'
            if (sScore > 15) type = 'ai'
            else if (sScore < -5) type = 'human'
            else if (overallAiScore > 65) type = 'ai'
            else if (overallAiScore < 30) type = 'human'

            return { text: s.trim(), type }
        })
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json()

        if (!text || text.trim().length < 10) {
            return NextResponse.json(
                { error: 'النص قصير جداً للتحليل، يرجى إدخال 10 أحرف على الأقل' },
                { status: 400 }
            )
        }

        let aiScore: number
        let modelUsed: string
        let fallback = false
        let confidence = 'medium'

        // Detect if text is primarily Arabic
        const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length
        const totalChars = text.replace(/\s/g, '').length
        const isArabic = arabicChars / totalChars > 0.4

        if (!isArabic && HF_TOKEN) {
            // Use Hugging Face for English/mixed text
            try {
                const response = await fetch(HF_MODEL_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HF_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: text.slice(0, 512), // Model max tokens
                        options: { wait_for_model: true }
                    }),
                    signal: AbortSignal.timeout(15000) // 15s timeout
                })

                if (response.ok) {
                    const data = await response.json()

                    // HF returns: [[{label: "LABEL_1", score: 0.9}, {label: "LABEL_0", score: 0.1}]]
                    // LABEL_1 = AI, LABEL_0 = Human (for roberta-base-openai-detector)
                    const results = Array.isArray(data[0]) ? data[0] : data
                    const aiLabel = results.find((r: any) =>
                        r.label === 'LABEL_1' || r.label === 'Fake' || r.label === 'AI'
                    )
                    const humanLabel = results.find((r: any) =>
                        r.label === 'LABEL_0' || r.label === 'Real' || r.label === 'Human'
                    )

                    if (aiLabel) {
                        aiScore = Math.round(aiLabel.score * 100)
                        confidence = aiScore > 80 || aiScore < 20 ? 'high' : 'medium'
                        modelUsed = 'roberta-base-openai-detector'
                    } else {
                        throw new Error('Unexpected model response format')
                    }
                } else if (response.status === 503) {
                    // Model is loading, use fallback
                    const local = localAnalyze(text)
                    aiScore = local.aiScore
                    fallback = true
                    modelUsed = 'local-fallback (HF model loading)'
                } else {
                    throw new Error(`HF API error: ${response.status}`)
                }
            } catch (err) {
                console.error('Hugging Face API failed, using local fallback:', err)
                const local = localAnalyze(text)
                aiScore = local.aiScore
                fallback = true
                modelUsed = 'local-fallback'
            }
        } else {
            // Arabic text: use local analyzer (HF model is English-only)
            const local = localAnalyze(text)
            aiScore = local.aiScore
            fallback = local.fallback
            modelUsed = isArabic ? 'local-arabic-analyzer' : 'local-fallback'
        }

        // Verdict in Arabic
        let verdict: string
        let verdictEn: string
        if (aiScore > 85) {
            verdict = "يُرجَّح بقوة أن يكون النص مولَّداً بالذكاء الاصطناعي"
            verdictEn = "Very likely AI-generated"
        } else if (aiScore > 65) {
            verdict = "احتمال كبير أن يكون النص مولَّداً بالذكاء الاصطناعي"
            verdictEn = "Likely AI-generated"
        } else if (aiScore > 45) {
            verdict = "النص مختلط أو غير مؤكد — قد يكون بشرياً أو AI"
            verdictEn = "Mixed or uncertain — could be human or AI"
        } else if (aiScore > 20) {
            verdict = "يُرجَّح أن يكون النص بشرياً مع بعض أنماط الذكاء الاصطناعي"
            verdictEn = "Likely human-written"
        } else {
            verdict = "النص بشري بشكل شبه مؤكد"
            verdictEn = "Almost certainly human-written"
        }

        const sentences = analyzeSentences(text, aiScore)

        return NextResponse.json({
            aiScore,
            humanScore: 100 - aiScore,
            verdict,
            verdictEn,
            sentences,
            modelUsed,
            fallback,
            confidence,
            textLanguage: isArabic ? 'arabic' : 'english',
        })

    } catch (error: any) {
        console.error('AI detection error:', error)
        return NextResponse.json(
            { error: 'حدث خطأ أثناء التحليل، يرجى المحاولة مرة أخرى' },
            { status: 500 }
        )
    }
}
