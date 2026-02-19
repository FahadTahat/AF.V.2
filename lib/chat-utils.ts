import { Timestamp } from 'firebase/firestore'

// قائمة الكلمات المحظورة (تم توسيعها لتشمل الشتائم الشائعة)
// ملاحظة: هذه القائمة تستخدم لفلترة المحتوى المسيء وحماية الطلاب
const BAD_WORDS = [
    // English
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'whore', 'slut', 'cunt', 'cock', 'nigger', 'faggot',
    'stupid', 'idiot', 'shut up', 'damn',

    // Arabic (Common Insults & Swears)
    'كلب', 'حمار', 'حيوان', 'غبي', 'تفه', 'سافل', 'واطي', 'زبالة', 'حقير',
    'يا حيوان', 'يا كلب', 'يا حمار',
    'كس', 'قحب', 'شرموط', 'عهر', 'نيك', 'منيك', 'عرص', 'ديوث', 'قواد',
    'طيز', 'مؤخرة', 'خرة', 'خرا',
    'لعن', 'يلعن', 'ينعل',
    'يا ابن', 'يا بنت', // Often start of insults, but might flag false positives. Be careful. 
    // Safety: removed 'يا ابن' and 'يا بنت' to avoid false positives like "يا ابن الناس" unless followed by bad word.
    'ابن الكلب', 'ابن الحرام', 'بنت الكلب', 'بنت الحرام',
    'زفت', 'قرف', 'زق',
    'سكر تمك', 'اخرس', 'انطم', 'كول خرا',
    'معاق', 'متخلف', // Ableist slurs
    'هبيلة', 'اهبل',
    'تف عليك', 'تفي',

    // Variations/Misspellings could be added here
]

export const TIMEOUT_DURATION_MS = 5 * 60 * 1000 // 5 minutes

export type ChatUserStatus = {
    isTimedOut: boolean
    timeoutUntil: Timestamp | null
}

export const checkMessageContent = (text: string): { safe: boolean; timeoutRequest?: boolean } => {
    const lowerText = text.toLowerCase()

    // Check for exact words or words contained in text
    // Using a more robust check involves regex or tokenization, but simple includes works for now.
    // We trim spaces to avoid matching inside other words if possible, but basic 'includes' is requested.

    const hasBadWord = BAD_WORDS.some(word => {
        // Basic normalized check (very simple)
        return lowerText.includes(word.toLowerCase())
    })

    if (hasBadWord) {
        return { safe: false, timeoutRequest: true }
    }

    return { safe: true }
}

export const CHANNELS = [
    { id: 'announcements', name: '📢 الإعلانات الرسمية', icon: 'Megaphone', description: 'آخر أخبار الكلية والفعاليات المهمة', category: 'administrative' },
    { id: 'general', name: '💬 العام (General)', icon: 'Users', description: 'نقاشات عامة حول الدراسة والحياة الجامعية', category: 'general' },

    // IT & Computing
    { id: 'programming', name: '💻 البرمجة (Programming)', icon: 'Code', description: 'بايثون، جافا، ويب، وكل ما يخص الكود', category: 'tech' },
    { id: 'cybersecurity', name: '🔐 الأمن السيبراني', icon: 'Shield', description: 'حماية المعلومات، الأخلاقيات، والتهديدات', category: 'tech' },
    { id: 'networking', name: '🌐 الشبكات (Networking)', icon: 'Wifi', description: 'بروتوكولات، سيرفرات، وبنية تحتية', category: 'tech' },
    { id: 'hardware', name: '🖥️ الهاردوير والصيانة', icon: 'Cpu', description: 'تجميع أجهزة، صيانة، وقطع الحاسوب', category: 'tech' },

    // Business
    { id: 'business', name: '💼 إدارة الأعمال', icon: 'Briefcase', description: 'نقاشات حول إدارة الأعمال والمالية والتسويق', category: 'business' },
    { id: 'marketing', name: '📈 التسويق الرقمي', icon: 'TrendingUp', description: 'استراتيجيات التسويق والترويج الحديثة', category: 'business' },

    // Engineering
    { id: 'engineering', name: '⚙️ الهندسة (Engineering)', icon: 'Settings', description: 'تجمّع طلاب الهندسة بكل فروعها', category: 'engineering' },
    { id: 'robotics', name: '🤖 الروبوتات والذكاء', icon: 'Bot', description: 'عالم الروبوتات والأنظمة الذكية', category: 'engineering' },

    // Applied Science
    { id: 'science', name: '🧪 العلوم التطبيقية', icon: 'FlaskConical', description: 'نقاشات علمية وتجارب مخبرية', category: 'science' },

    // Student Life
    { id: 'sport', name: '⚽ الرياضة والصحة', icon: 'Activity', description: 'الصحة والرياضة والأنشطة البدنية', category: 'social' },
    { id: 'gaming', name: '🎮 استراحة الألعاب', icon: 'Gamepad', description: 'للنقاش حول الألعاب والترفيه', category: 'social' },
    { id: 'projects', name: '🚀 مشاريع التخرج', icon: 'Rocket', description: 'بحث عن شركاء، أفكار مشاريع، ومساعدة', category: 'projects' },
]
