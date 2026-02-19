"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Filter } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAchievements } from "@/contexts/AchievementContext"
import AuthGate from "@/components/auth-gate"

interface BTECVerb {
    id: number
    nameEn: string
    nameAr: string
    meaningEn: string
    meaningAr: string
    exampleEn: string
    exampleAr: string
    frequency: number
    level: "pass" | "merit" | "distinction"
}

// Complete BTEC Verbs Database (67 verbs)
const passVerbs: BTECVerb[] = [
    { id: 1, nameEn: "Describe", nameAr: "صف", meaningEn: "Give a detailed account of something, like its features or process.", meaningAr: "شرح ميزات الشيء بفقرة صغيرة (مثل وصف مواصفات هاتف).", exampleEn: "Describe computer components.", exampleAr: "صف مكونات الحاسوب.", frequency: 95, level: "pass" },
    { id: 2, nameEn: "Identify", nameAr: "سمي / حدد", meaningEn: "List or name main points or characteristics without detail.", meaningAr: "ذكر رؤوس أقلام أو نقاط أساسية بدون شرح طويل.", exampleEn: "Identify types of networks.", exampleAr: "حدد أنواع الشبكات.", frequency: 88, level: "pass" },
    { id: 3, nameEn: "List", nameAr: "اكتب قائمة", meaningEn: "Provide items in a series without explanation.", meaningAr: "كتابة المعلومات على شكل نقاط فقط بدون أي شرح.", exampleEn: "List Office programs.", exampleAr: "اكتب قائمة ببرامج الأوفيس.", frequency: 92, level: "pass" },
    { id: 4, nameEn: "State", nameAr: "اذكر", meaningEn: "Express information clearly and briefly.", meaningAr: "تقديم جواب مباشر وواضح ومختصر جداً.", exampleEn: "State the capital of Jordan.", exampleAr: "اذكر عاصمة الأردن.", frequency: 85, level: "pass" },
    { id: 5, nameEn: "Define", nameAr: "عرف", meaningEn: "Give exact meaning of a word or concept.", meaningAr: "كتابة تعريف الكلمة أو المفهوم بدقة كما ورد في الكتاب.", exampleEn: "Define software.", exampleAr: "عرف البرمجيات.", frequency: 80, level: "pass" },
    { id: 6, nameEn: "Name", nameAr: "سمي", meaningEn: "State name of something without explanation.", meaningAr: "ذكر الاسم فقط دون الحاجة لأي تفاصيل إضافية.", exampleEn: "Name the CPU.", exampleAr: "سمي وحدة المعالجة المركزية.", frequency: 75, level: "pass" },
    { id: 7, nameEn: "Label", nameAr: "سمي على الرسم", meaningEn: "Add names or tags to a diagram or image.", meaningAr: "كتابة أسماء الأجزاء على صورة توضيحية أو مخطط.", exampleEn: "Label cell parts.", exampleAr: "سمي أجزاء الخلية على الرسم.", frequency: 60, level: "pass" },
    { id: 8, nameEn: "Give", nameAr: "أعط", meaningEn: "Provide an example or item.", meaningAr: "تقديم مثال واحد أو عنصر واحد دون شرح طويل.", exampleEn: "Give an example of input.", exampleAr: "أعط مثالاً على مدخلات الحاسوب.", frequency: 70, level: "pass" },
    { id: 9, nameEn: "Match", nameAr: "طابق", meaningEn: "Link items that belong together.", meaningAr: "توصيل كل عنصر بما يناسبه من القائمة الأخرى.", exampleEn: "Match device with function.", exampleAr: "طابق الجهاز بوظيفته.", frequency: 55, level: "pass" },
    { id: 10, nameEn: "Outline", nameAr: "أوجز", meaningEn: "Provide a brief overview or summary.", meaningAr: "شرح الفكرة العامة باختصار شديد دون الدخول في التفاصيل.", exampleEn: "Outline manager tasks.", exampleAr: "أوجز مهام المدير.", frequency: 65, level: "pass" },
    { id: 11, nameEn: "Recall", nameAr: "استرجع", meaningEn: "Remember and state information.", meaningAr: "كتابة المعلومة كما هي محفوظة في الذاكرة تماماً.", exampleEn: "Recall startup steps.", exampleAr: "استرجع خطوات تشغيل الجهاز.", frequency: 50, level: "pass" },
    { id: 12, nameEn: "Select", nameAr: "اختر", meaningEn: "Choose correct option.", meaningAr: "اختيار الإجابة الصحيحة من بين عدة خيارات.", exampleEn: "Select the right CPU.", exampleAr: "اختر نوع المعالج المناسب.", frequency: 45, level: "pass" },
    { id: 13, nameEn: "Show", nameAr: "بين", meaningEn: "Provide evidence or proof.", meaningAr: "عرض الدليل سواء كان صورة أو مثالاً أو تطبيقاً عملياً.", exampleEn: "Show how the app works.", exampleAr: "بين كيفية عمل البرنامج.", frequency: 58, level: "pass" },
    { id: 14, nameEn: "Use", nameAr: "استخدم", meaningEn: "Apply something correctly.", meaningAr: "تطبيق الشيء أو الأداة بالطريقة الصحيحة المحددة.", exampleEn: "Use SUM in Excel.", exampleAr: "استخدم دالة الجمع في إكسل.", frequency: 62, level: "pass" },
    { id: 15, nameEn: "Complete", nameAr: "أكمل", meaningEn: "Finish a task correctly.", meaningAr: "إنهاء المهمة المطلوبة بناءً على التعليمات المعطاة.", exampleEn: "Complete the following table.", exampleAr: "أكمل الجدول التالي.", frequency: 78, level: "pass" },
    { id: 16, nameEn: "Measure", nameAr: "قس", meaningEn: "Find size, amount, or degree.", meaningAr: "إيجاد الحجم أو الكمية باستخدام الأرقام والوحدات.", exampleEn: "Measure internet speed.", exampleAr: "قس سرعة الإنترنت.", frequency: 40, level: "pass" },
    { id: 17, nameEn: "Recognise", nameAr: "تعرف", meaningEn: "Identify something when you see it.", meaningAr: "القدرة على تمييز الشيء ومعرفته بمجرد رؤيته.", exampleEn: "Recognise the app icon.", exampleAr: "تعرف على أيقونة البرنامج.", frequency: 35, level: "pass" },
    { id: 18, nameEn: "Indicate", nameAr: "أشر إلى", meaningEn: "Point out or show something.", meaningAr: "الإشارة إلى الشيء أو الدلالة عليه دون الحاجة لشرح.", exampleEn: "Indicate the code error.", exampleAr: "أشر إلى الخطأ في الكود.", frequency: 42, level: "pass" },
    { id: 19, nameEn: "Record", nameAr: "سجل", meaningEn: "Write down information accurately.", meaningAr: "تدوين البيانات والمعلومات بدقة كما هي.", exampleEn: "Record experiment results.", exampleAr: "سجل نتائج التجربة.", frequency: 52, level: "pass" },
    { id: 20, nameEn: "Observe", nameAr: "لاحظ", meaningEn: "Watch something carefully.", meaningAr: "التركيز على ما يحدث وتدوين الملاحظات الدقيقة.", exampleEn: "Observe solution color change.", exampleAr: "لاحظ تغير لون المحلول.", frequency: 30, level: "pass" },
    { id: 21, nameEn: "Follow", nameAr: "اتبع", meaningEn: "Carry out instructions correctly.", meaningAr: "تنفيذ التعليمات المعطاة خطوة بخطوة بدقة.", exampleEn: "Follow installation steps.", exampleAr: "اتبع خطوات التثبيت.", frequency: 68, level: "pass" },
    { id: 22, nameEn: "Tick", nameAr: "علم", meaningEn: "Mark correct answer.", meaningAr: "وضع علامة (صح) بجانب الإجابة الصحيحة.", exampleEn: "Tick the correct option.", exampleAr: "علم على الخيار الصحيح.", frequency: 48, level: "pass" },
    { id: 23, nameEn: "Fill in", nameAr: "عبئ", meaningEn: "Complete missing information.", meaningAr: "تعبئة الفراغات بالمعلومات الصحيحة والمناسبة.", exampleEn: "Fill in the blanks.", exampleAr: "عبئ الفراغات في الجملة.", frequency: 72, level: "pass" },
    { id: 24, nameEn: "Copy", nameAr: "انسخ", meaningEn: "Write information exactly as shown.", meaningAr: "نقل النص أو المعلومات كما هي دون أي تغيير.", exampleEn: "Copy the source code.", exampleAr: "انسخ الكود البرمجي.", frequency: 25, level: "pass" }
]

const meritVerbs: BTECVerb[] = [
    { id: 25, nameEn: "Explain", nameAr: "اشرح", meaningEn: "Show how or why something happens, using examples and reasons.", meaningAr: "توضيح كيف ولماذا يحدث الشيء مع ذكر السبب والنتيجة (استخدام Because/Therefore).", exampleEn: "Explain cybersecurity importance.", exampleAr: "اشرح أهمية الأمن السيبراني.", frequency: 98, level: "merit" },
    { id: 26, nameEn: "Analyze", nameAr: "حلل", meaningEn: "Break down complex info into parts to show relationships.", meaningAr: "تفكيك الموضوع إلى أجزاء ودراسة تأثير كل جزء على الآخر.", exampleEn: "Analyze price impact on sales.", exampleAr: "حلل تأثير السعر على المبيعات.", frequency: 90, level: "merit" },
    { id: 27, nameEn: "Compare", nameAr: "قارن", meaningEn: "Show similarities and differences between two or more things.", meaningAr: "ذكر أوجه التشابه والاختلاف بين شيئين أو أكثر.", exampleEn: "Compare Android and iOS.", exampleAr: "قارن بين نظامي أندرويد و iOS.", frequency: 85, level: "merit" },
    { id: 28, nameEn: "Discuss", nameAr: "ناقش", meaningEn: "Explore different ideas or viewpoints before reaching a conclusion.", meaningAr: "استعراض وجهات نظر مختلفة قبل الوصول إلى استنتاج نهائي.", exampleEn: "Discuss tech impact on education.", exampleAr: "ناقش أثر التكنولوجيا على التعليم.", frequency: 82, level: "merit" },
    { id: 29, nameEn: "Explain importance of", nameAr: "اشرح أهمية", meaningEn: "Show why something is important using reasons.", meaningAr: "توضيح سبب أهمية الشيء مع تدعيم ذلك بالأسباب والنتائج.", exampleEn: "Explain teamwork importance.", exampleAr: "اشرح أهمية العمل الجماعي.", frequency: 88, level: "merit" },
    { id: 30, nameEn: "Examine", nameAr: "افحص", meaningEn: "Investigate something in detail to understand it better.", meaningAr: "الدخول في التفاصيل الدقيقة لفهم كيفية عمل الموضوع.", exampleEn: "Examine database structure.", exampleAr: "افحص هيكلية قاعدة البيانات.", frequency: 75, level: "merit" },
    { id: 31, nameEn: "Illustrate", nameAr: "وضح", meaningEn: "Use examples or diagrams to make something clear.", meaningAr: "استخدام الأمثلة أو الرسوم التوضيحية لتوصيل الفكرة بوضوح.", exampleEn: "Illustrate system lifecycle.", exampleAr: "وضح دورة حياة النظام.", frequency: 70, level: "merit" },
    { id: 32, nameEn: "Distinguish", nameAr: "ميز", meaningEn: "Recognize difference between similar things.", meaningAr: "تحديد الفرق الدقيق بين أشياء متشابهة أو متقاربة.", exampleEn: "Distinguish RAM and ROM.", exampleAr: "ميز بين الذاكرة RAM و ROM.", frequency: 65, level: "merit" },
    { id: 33, nameEn: "Review", nameAr: "راجع", meaningEn: "Look back at something and comment on its effectiveness.", meaningAr: "تقييم ما تم إنجازه وذكر النقاط الجيدة وما يحتاج لتحسين.", exampleEn: "Review team performance.", exampleAr: "راجع أداء الفريق في المشروع.", frequency: 60, level: "merit" },
    { id: 34, nameEn: "Explain how", nameAr: "اشرح كيف", meaningEn: "Describe process or method.", meaningAr: "شرح الخطوات أو الطريقة المتبعة بترتيب منطقي.", exampleEn: "Explain how data is encrypted.", exampleAr: "اشرح كيف يتم تشفير البيانات.", frequency: 80, level: "merit" },
    { id: 35, nameEn: "Explain why", nameAr: "اشرح لماذا", meaningEn: "Give reasons for something happening.", meaningAr: "التركيز بشكل أساسي على الأسباب التي أدت لحدوث الشيء.", exampleEn: "Explain why old system failed.", exampleAr: "اشرح لماذا فشل النظام القديم.", frequency: 82, level: "merit" },
    { id: 36, nameEn: "Interpret", nameAr: "فسر", meaningEn: "Explain meaning of information or data.", meaningAr: "توضيح المقصود من البيانات أو الرسوم البيانية المعطاة.", exampleEn: "Interpret survey results.", exampleAr: "فسر نتائج الاستبيان.", frequency: 55, level: "merit" },
    { id: 37, nameEn: "Apply", nameAr: "طبق", meaningEn: "Use knowledge in a new situation.", meaningAr: "أخذ المعلومة واستخدامها في سياق أو مثال جديد تماماً.", exampleEn: "Apply physics laws.", exampleAr: "طبق قوانين الفيزياء في التجربة.", frequency: 62, level: "merit" },
    { id: 38, nameEn: "Investigate", nameAr: "ابحث", meaningEn: "Research and examine in detail.", meaningAr: "جمع المعلومات من مصادر مختلفة وتحليلها بعمق.", exampleEn: "Investigate computer history.", exampleAr: "ابحث في تاريخ الحواسيب.", frequency: 58, level: "merit" },
    { id: 39, nameEn: "Differentiate", nameAr: "فرق", meaningEn: "Show clear differences between things.", meaningAr: "توضيح الفروقات الجوهرية بين أشياء قد تبدو متشابهة.", exampleEn: "Differentiate software and hardware.", exampleAr: "فرق بين البرمجيات والعتاد.", frequency: 68, level: "merit" },
    { id: 40, nameEn: "Summarise", nameAr: "لخص", meaningEn: "Present main points briefly.", meaningAr: "تقديم أهم النقاط الأساسية دون الدخول في التفاصيل المملة.", exampleEn: "Summarise report content.", exampleAr: "لخص محتوى التقرير.", frequency: 72, level: "merit" },
    { id: 41, nameEn: "Explain effects of", nameAr: "اشرح التأثير", meaningEn: "Show what happens as a result of something.", meaningAr: "توضيح النتائج المترتبة على فعل أو حدث معين.", exampleEn: "Explain pollution effects.", exampleAr: "اشرح تأثير التلوث على البيئة.", frequency: 78, level: "merit" },
    { id: 42, nameEn: "Examine role of", nameAr: "افحص الدور", meaningEn: "Look closely at the function of something.", meaningAr: "دراسة وظيفة الشيء وكيفية تأثيره في المنظومة.", exampleEn: "Examine CPU role.", exampleAr: "افحص دور المعالج في الحاسوب.", frequency: 64, level: "merit" },
    { id: 43, nameEn: "Explore", nameAr: "استكشف", meaningEn: "Look at different aspects of something.", meaningAr: "النظر في جوانب متعددة ومختلفة لنفس الموضوع.", exampleEn: "Explore design options.", exampleAr: "استكشف خيارات التصميم المتاحة.", frequency: 50, level: "merit" },
    { id: 44, nameEn: "Calculate", nameAr: "احسب", meaningEn: "Work out an answer using numbers.", meaningAr: "الوصول للنتيجة باستخدام المعادلات الرياضية والأرقام.", exampleEn: "Calculate circle area.", exampleAr: "احسب مساحة الدائرة.", frequency: 45, level: "merit" },
    { id: 45, nameEn: "Classify", nameAr: "صنف", meaningEn: "Arrange items into categories.", meaningAr: "وضع كل عنصر في فئته الصحيحة بناءً على خصائصه.", exampleEn: "Classify programming languages.", exampleAr: "صنف لغات البرمجة.", frequency: 52, level: "merit" },
    { id: 46, nameEn: "Estimate", nameAr: "قدر", meaningEn: "Make an approximate calculation.", meaningAr: "إجراء حساب تقريبي يعطي فكرة عامة وليس دقيقاً 100%.", exampleEn: "Estimate project cost.", exampleAr: "قدر تكلفة المشروع.", frequency: 35, level: "merit" },
    { id: 47, nameEn: "Explain advantages and disadvantages of", nameAr: "اشرح الإيجابيات والسلبيات", meaningEn: "Show positives and negatives with reasons.", meaningAr: "الموازنة بين الطرفين وذكر ميزات وعيوب الشيء مع الأسباب.", exampleEn: "Explain pros and cons of remote work.", exampleAr: "اشرح إيجابيات وسلبيات العمل عن بعد.", frequency: 92, level: "merit" }
]

const distinctionVerbs: BTECVerb[] = [
    { id: 48, nameEn: "Justify", nameAr: "برر", meaningEn: "Give valid reasons or evidence to support an answer or conclusion.", meaningAr: "إثبات وجهة النظر بالأدلة القوية وتوضيح سبب اختيار حل معين.", exampleEn: "Justify your design choice.", exampleAr: "برر اختيارك لهذا التصميم.", frequency: 95, level: "distinction" },
    { id: 49, nameEn: "Evaluate", nameAr: "قيم", meaningEn: "Judge strengths, weaknesses, and overall value based on evidence.", meaningAr: "ذكر الإيجابيات والسلبيات ثم إعطاء رأي نهائي (Conclusion).", exampleEn: "Evaluate new system efficiency.", exampleAr: "قيم كفاءة النظام الجديد.", frequency: 98, level: "distinction" },
    { id: 50, nameEn: "Recommend", nameAr: "اقترح", meaningEn: "Suggest a solution or action with justification.", meaningAr: "تقديم حل مقترح وتفسير لماذا يعتبر هذا الحل هو الأفضل.", exampleEn: "Recommend a sales plan.", exampleAr: "اقترح خطة لتحسين المبيعات.", frequency: 85, level: "distinction" },
    { id: 51, nameEn: "Critically Evaluate", nameAr: "قيم بشكل نقدي", meaningEn: "Evaluate with depth, questioning validity and assumptions.", meaningAr: "تحليل عميق يتجاوز الإيجابيات والسلبيات لنقد الفرضيات وتقديم رأي قوي.", exampleEn: "Critically evaluate company strategy.", exampleAr: "قيم بشكل نقدي استراتيجية الشركة.", frequency: 92, level: "distinction" },
    { id: 52, nameEn: "Assess impact of", nameAr: "قيم التأثير", meaningEn: "Judge how something affects another thing.", meaningAr: "إصدار حكم حول كيفية تأثير شيء ما على شيء آخر بعمق.", exampleEn: "Assess AI impact on jobs.", exampleAr: "قيم تأثير الذكاء الاصطناعي على الوظائف.", frequency: 88, level: "distinction" },
    { id: 53, nameEn: "Argue", nameAr: "جادل", meaningEn: "Present a reasoned case supported by evidence.", meaningAr: "الدفاع عن رأي معين باستخدام حجج منطقية وأدلة قوية.", exampleEn: "Argue for renewable energy.", exampleAr: "جادل لصالح استخدام الطاقة المتجددة.", frequency: 75, level: "distinction" },
    { id: 54, nameEn: "Conclude", nameAr: "استنتج", meaningEn: "Bring ideas together to form a final judgement.", meaningAr: "تجميع الأفكار والنتائج للوصول إلى قرار أو حكم نهائي.", exampleEn: "Conclude the best solution.", exampleAr: "استنتج أفضل طريقة للحل.", frequency: 80, level: "distinction" },
    { id: 55, nameEn: "Critically Analyze", nameAr: "حلل بشكل نقدي", meaningEn: "Analyze deeply while questioning assumptions.", meaningAr: "تفكيك الموضوع بعمق مع نقد الأجزاء وتقديم رأي مدعوم بالأدلة.", exampleEn: "Critically analyze research results.", exampleAr: "حلل بشكل نقدي نتائج البحث.", frequency: 90, level: "distinction" },
    { id: 56, nameEn: "Synthesize", nameAr: "ركب", meaningEn: "Combine ideas to create something new.", meaningAr: "دمج مجموعة من الأفكار المختلفة للخروج بنتيجة أو مفهوم جديد.", exampleEn: "Synthesize a new management model.", exampleAr: "ركب نموذجاً جديداً للإدارة.", frequency: 60, level: "distinction" },
    { id: 57, nameEn: "Formulate", nameAr: "صغ", meaningEn: "Develop a clear and structured idea or plan.", meaningAr: "إنشاء فكرة أو خطة عمل بشكل منظم وواضح واحترافي.", exampleEn: "Formulate a marketing strategy.", exampleAr: "صغ استراتيجية تسويقية.", frequency: 70, level: "distinction" },
    { id: 58, nameEn: "Validate", nameAr: "تحقق", meaningEn: "Confirm something is correct using evidence.", meaningAr: "التأكد من صحة المعلومات أو النتائج باستخدام أدلة ملموسة.", exampleEn: "Validate financial data.", exampleAr: "تحقق من صحة البيانات المالية.", frequency: 65, level: "distinction" },
    { id: 59, nameEn: "Predict", nameAr: "توقع", meaningEn: "Suggest what is likely to happen next.", meaningAr: "التنبؤ بما قد يحدث مستقبلاً بناءً على المعطيات الحالية.", exampleEn: "Predict future market trends.", exampleAr: "توقع اتجاهات السوق القادمة.", frequency: 55, level: "distinction" },
    { id: 60, nameEn: "Propose", nameAr: "اقترح", meaningEn: "Put forward an idea for consideration.", meaningAr: "تقديم فكرة جديدة للنقاش مع تدعيمها بتبرير منطقي.", exampleEn: "Propose a new startup project.", exampleAr: "اقترح مشروعاً ريادياً جديداً.", frequency: 72, level: "distinction" },
    { id: 61, nameEn: "Critique", nameAr: "انقد", meaningEn: "Give a detailed critical evaluation.", meaningAr: "تقديم تقييم نقدي مفصل يبرز العيوب ونقاط الضعف بوضوح.", exampleEn: "Critique the study methodology.", exampleAr: "انقد منهجية الدراسة.", frequency: 68, level: "distinction" },
    { id: 62, nameEn: "Appraise", nameAr: "ثمن", meaningEn: "Assess value or quality.", meaningAr: "تقييم القيمة أو الجودة بشكل مهني واحترافي.", exampleEn: "Appraise real estate value.", exampleAr: "ثمن قيمة الأصول العقارية.", frequency: 50, level: "distinction" },
    { id: 63, nameEn: "Determine", nameAr: "حدد", meaningEn: "Decide after careful consideration.", meaningAr: "الوصول إلى قرار نهائي بعد عملية تحليل وتفكير عميقة.", exampleEn: "Determine the best career path.", exampleAr: "حدد المسار الوظيفي الأنسب.", frequency: 78, level: "distinction" },
    { id: 64, nameEn: "Develop", nameAr: "طور", meaningEn: "Improve or expand something.", meaningAr: "العمل على تحسين الشيء أو توسيعه لجعله أقوى وأفضل.", exampleEn: "Develop a mobile application.", exampleAr: "طور تطبيقاً للهواتف الذكية.", frequency: 82, level: "distinction" },
    { id: 65, nameEn: "Defend", nameAr: "دافع", meaningEn: "Support an idea against criticism.", meaningAr: "إثبات صحة الرأي والدفاع عنه في وجه الانتقادات الموجهة.", exampleEn: "Defend your thesis.", exampleAr: "دافع عن أطروحتك العلمية.", frequency: 62, level: "distinction" },
    { id: 66, nameEn: "Integrate", nameAr: "ادمج", meaningEn: "Combine parts into a whole.", meaningAr: "ربط الأجزاء المختلفة مع بعضها البعض بشكل ذكي ومتكامل.", exampleEn: "Integrate new techs.", exampleAr: "ادمج التقنيات الجديدة في العمل.", frequency: 58, level: "distinction" },
    { id: 67, nameEn: "Optimize", nameAr: "حسن", meaningEn: "Make something as effective as possible.", meaningAr: "جعل الشيء يعمل بأفضل أداء ممكن مع تقليل المشاكل للحد الأدنى.", exampleEn: "Optimize website performance.", exampleAr: "حسن أداء الموقع الإلكتروني.", frequency: 74, level: "distinction" }
]

const allVerbs = [...passVerbs, ...meritVerbs, ...distinctionVerbs]

export default function BTECVerbsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [levelFilter, setLevelFilter] = useState<"all" | "pass" | "merit" | "distinction">("all")
    const { t, language } = useLanguage()
    const { incrementProgress } = useAchievements()

    const filteredVerbs = allVerbs.filter((verb) => {
        const matchesLevel = levelFilter === "all" || verb.level === levelFilter
        const matchesSearch =
            verb.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            verb.nameAr.includes(searchQuery) ||
            verb.meaningAr.includes(searchQuery) ||
            verb.meaningEn.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesLevel && matchesSearch
    })

    // Achievement Trigger: Verb Master
    useEffect(() => {
        if (searchQuery.length > 2 && filteredVerbs.length > 0) {
            const timer = setTimeout(() => {
                incrementProgress('verb_master')
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [searchQuery])

    const levelColors = {
        pass: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
        merit: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
        distinction: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
    }

    return (
        <AuthGate mode="block" title="سجّل دخولك لتصفح جمل الأمر" description="هذا المحتوى حصري للأعضاء المسجلين. انضم إلينا للوصول إلى قاعدة بيانات شاملة لأفعال BTEC.">
            <div className="min-h-screen pt-24 pb-20 animate-fade-in text-right bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {/* Ambient Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow animation-delay-500" />
                </div>

                <div className="container relative z-10 py-8 px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-16 relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up">
                                <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">New</Badge>
                                <span>BTEC Level 3 National</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up animation-delay-100">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-2xl">
                                    {language === 'ar' ? 'جمل الأمر' : 'Command Verbs'}
                                </span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                                {language === 'ar'
                                    ? 'دليلك الشامل لإتقان وفهم جميع أفعال الأمر المستخدمة في تقييمات BTEC. حسن درجاتك من خلال فهم دقيق للمطلوب.'
                                    : 'Your comprehensive guide to mastering BTEC command verbs. Improve your grades with precise understanding of requirements.'}
                            </p>
                        </div>

                        {/* Search & Filters Bar */}
                        <div className="sticky top-24 z-40 mb-12 animate-fade-in-up animation-delay-300">
                            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 md:p-3 max-w-4xl mx-auto transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400`} />
                                        <Input
                                            type="text"
                                            placeholder={language === 'ar' ? 'ابحث عن فعل، تعريف، أو مثال...' : 'Search verbs, definitions...'}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full ${language === 'ar' ? 'pr-12' : 'pl-12'} h-12 bg-transparent border-none text-lg placeholder:text-slate-500 focus-visible:ring-0 text-white`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar px-1">
                                        {(['all', 'pass', 'merit', 'distinction'] as const).map((level) => (
                                            <Button
                                                key={level}
                                                onClick={() => setLevelFilter(level)}
                                                variant="ghost"
                                                className={`rounded-xl px-4 h-10 transition-all duration-300 font-medium capitalize whitespace-nowrap ${levelFilter === level
                                                        ? level === 'pass' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                                            : level === 'merit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                                                : level === 'distinction' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                                                                    : 'bg-slate-700 text-white'
                                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                    }`}
                                            >
                                                {level === 'all' ? (language === 'ar' ? 'الكل' : 'All') : level}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto px-2">
                            <span className="text-slate-400 text-sm font-medium">
                                {language === 'ar' ? 'النتائج:' : 'Results:'} <span className="text-white">{filteredVerbs.length}</span>
                            </span>
                        </div>

                        {/* Verbs Grid */}
                        {filteredVerbs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                                {filteredVerbs.map((verb, index) => {
                                    const colors = levelColors[verb.level]
                                    const isPass = verb.level === 'pass'
                                    const isMerit = verb.level === 'merit'
                                    const isDistinction = verb.level === 'distinction'

                                    return (
                                        <Card
                                            key={verb.id}
                                            className={`group relative overflow-hidden border-0 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ring-1 ring-inset ring-white/5 hover:ring-white/10`}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            {/* Top Color Line */}
                                            <div className={`absolute top-0 left-0 right-0 h-1.5 w-full bg-gradient-to-r ${isPass ? 'from-emerald-500 to-teal-500' :
                                                    isMerit ? 'from-blue-500 to-indigo-500' :
                                                        'from-amber-500 to-orange-500'
                                                }`} />

                                            <div className="p-6 relative z-10">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <Badge className={`${isPass ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            isMerit ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        } border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider`}>
                                                        {verb.level}
                                                    </Badge>
                                                    <span className="text-slate-600 font-mono text-xs font-bold bg-slate-950/50 px-2 py-1 rounded-md">
                                                        #{verb.id.toString().padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                    {verb.nameAr}
                                                </h3>
                                                <div className="text-lg text-slate-400 font-medium mb-5 font-mono tracking-tight group-hover:text-slate-300">
                                                    {verb.nameEn}
                                                </div>

                                                {/* Divider */}
                                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                                                <div className="space-y-4">
                                                    {/* Meaning */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-slate-500" />
                                                            {language === 'ar' ? 'المعنى' : 'Meaning'}
                                                        </h4>
                                                        <p className="text-slate-300 text-sm leading-relaxed mb-1.5">
                                                            {verb.meaningAr}
                                                        </p>
                                                        <p className="text-xs text-slate-500 italic" dir="ltr">
                                                            {verb.meaningEn}
                                                        </p>
                                                    </div>

                                                    {/* Example Box */}
                                                    <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 relative group-hover:border-white/10 transition-colors">
                                                        <div className={`absolute top-0 right-0 w-1 rounded-r-xl h-full opacity-50 ${isPass ? 'bg-emerald-500' :
                                                                isMerit ? 'bg-blue-500' :
                                                                    'bg-amber-500'
                                                            }`} />

                                                        <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                                            <BookOpen className="w-3.5 h-3.5" />
                                                            {language === 'ar' ? 'مثال' : 'Example'}
                                                        </h4>
                                                        <p className="text-sm font-medium text-slate-200 mb-1">
                                                            "{verb.exampleAr}"
                                                        </p>
                                                        <p className="text-xs text-slate-500 font-mono" dir="ltr">
                                                            "{verb.exampleEn}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Background Decoration */}
                                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:from-white/10 transition-all duration-500" />
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-32 animate-fade-in flex flex-col items-center justify-center opacity-60">
                                <div className="bg-slate-800/30 p-6 rounded-full mb-4 ring-1 ring-white/5">
                                    <Search className="h-10 w-10 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-300 mb-2">No results found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthGate>
    )
}
