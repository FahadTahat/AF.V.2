import {
    Calculator, Search, Map, BookOpen, MessageSquare,
    User, BatteryCharging, Flame, LayoutGrid, Award, Trophy, Star,
    Clock, Moon, Sun, Calculator as CalcIcon, GraduationCap, Zap,
    Share2, MousePointer, Hash, FileText, Calendar
} from "lucide-react";

export interface Achievement {
    id: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    icon: any;
    category: 'tools' | 'learning' | 'engagement' | 'secret' | 'time';
    xp: number;
    maxProgress: number;
    secret?: boolean; // If true, description is hidden until unlocked
}

export const ACHIEVEMENTS: Achievement[] = [
    // --- 🛠️ فئة الأدوات (Tools) ---
    {
        id: 'strategic_planner',
        titleAr: 'المخطط الاستراتيجي',
        titleEn: 'Strategic Planner',
        descriptionAr: 'استخدم حاسبة المعدل لحساب سيناريو امتياز (Distinction).',
        descriptionEn: 'Calculate a Distinction scenario using the GPA Calculator.',
        icon: Calculator,
        category: 'tools',
        xp: 150,
        maxProgress: 1
    },
    {
        id: 'verb_master',
        titleAr: 'خبير المصطلحات',
        titleEn: 'Verb Master',
        descriptionAr: 'ابحث عن 10 كلمات مختلفة في أداة "جمل الأمر".',
        descriptionEn: 'Search for 10 verbs in the Command Verbs tool.',
        icon: Search,
        category: 'tools',
        xp: 200,
        maxProgress: 10
    },
    {
        id: 'navigator',
        titleAr: 'المستطلع',
        titleEn: 'The Navigator',
        descriptionAr: 'تصفح صفحة خارطة الطريق لسنوات دراسية مختلفة.',
        descriptionEn: 'Browse different years in the Roadmap.',
        icon: Map,
        category: 'tools',
        xp: 100,
        maxProgress: 3
    },
    {
        id: 'image_wizard',
        titleAr: 'ساحر الصور',
        titleEn: 'Image Wizard',
        descriptionAr: 'استخدم منصة الصور للبحث عن صور تعليمية.',
        descriptionEn: 'Use the Image Platform to find educational images.',
        icon: Hash,
        category: 'tools',
        xp: 100,
        maxProgress: 5
    },

    // --- 📚 فئة التعلم (Learning) ---
    {
        id: 'knowledge_seeker',
        titleAr: 'الباحث عن المعرفة',
        titleEn: 'Knowledge Seeker',
        descriptionAr: 'افتح 5 ملفات من صفحة المصادر.',
        descriptionEn: 'Open 5 files from Resources.',
        icon: BookOpen,
        category: 'learning',
        xp: 250,
        maxProgress: 5
    },
    {
        id: 'tech_buddy',
        titleAr: 'صديق الذكاء الاصطناعي',
        titleEn: 'Tech Buddy',
        descriptionAr: 'تحدث مع المساعد الذكي (AF AI).',
        descriptionEn: 'Chat with AF AI.',
        icon: MessageSquare,
        category: 'learning',
        xp: 150,
        maxProgress: 1
    },
    {
        id: 'guide_reader',
        titleAr: 'قارئ الدليل',
        titleEn: 'Guide Reader',
        descriptionAr: 'اقرأ صفحة دليل الطالب بالكامل.',
        descriptionEn: 'Read the entire Student Guide page.',
        icon: FileText,
        category: 'learning',
        xp: 200,
        maxProgress: 1
    },

    // --- ⏳ فئة الوقت والالتزام (Time & Dedication) ---
    {
        id: 'early_bird',
        titleAr: 'طائر الصباح',
        titleEn: 'Early Bird',
        descriptionAr: 'قم بتسجيل الدخول بين الساعة 5 و 8 صباحاً.',
        descriptionEn: 'Login between 5 AM and 8 AM.',
        icon: Sun,
        category: 'time',
        xp: 300,
        maxProgress: 1,
        secret: true
    },
    {
        id: 'night_owl',
        titleAr: 'ساهر الليل',
        titleEn: 'Night Owl',
        descriptionAr: 'استخدم الموقع بعد منتصف الليل.',
        descriptionEn: 'Use the website after midnight.',
        icon: Moon,
        category: 'time',
        xp: 300,
        maxProgress: 1,
        secret: true
    },
    {
        id: 'weekend_warrior',
        titleAr: 'محارب العطلة',
        titleEn: 'Weekend Warrior',
        descriptionAr: 'استخدم الموقع للدراسة في يوم الجمعة أو السبت.',
        descriptionEn: 'Study on Friday or Saturday.',
        icon: Calendar,
        category: 'time',
        xp: 250,
        maxProgress: 1
    },

    // --- 🌙 رمضان (Ramadan) ---
    {
        id: 'ramadan_kareem',
        titleAr: 'رمضان كريم',
        titleEn: 'Ramadan Kareem',
        descriptionAr: 'قم بتسجيل الدخول خلال شهر رمضان المبارك.',
        descriptionEn: 'Login during the holy month of Ramadan.',
        icon: Moon,
        category: 'time',
        xp: 500,
        maxProgress: 1
    },
    {
        id: 'fasting_focus',
        titleAr: 'تركيز الصائم',
        titleEn: 'Fasting Focus',
        descriptionAr: 'استخدم "منطقة التركيز" لمدة 30 دقيقة في نهار رمضان.',
        descriptionEn: 'Use "Focus Zone" for 30 minutes during Ramadan days.',
        icon: Star,
        category: 'time',
        xp: 400,
        maxProgress: 1
    },

    // --- 👤 فئة التفاعل (Engagement) ---
    {
        id: 'digital_identity',
        titleAr: 'الهوية الرقمية',
        titleEn: 'Digital Identity',
        descriptionAr: 'أكمل صورة البروفايل الخاصة بك.',
        descriptionEn: 'Set your profile picture.',
        icon: User,
        category: 'engagement',
        xp: 150,
        maxProgress: 1
    },
    {
        id: 'daily_streak_3',
        titleAr: 'البداية القوية',
        titleEn: 'Strong Start',
        descriptionAr: 'زر الموقع 3 أيام متتالية.',
        descriptionEn: 'Visit for 3 consecutive days.',
        icon: Flame,
        category: 'engagement',
        xp: 300,
        maxProgress: 3
    },
    {
        id: 'daily_streak_7',
        titleAr: 'مدمن تعلم',
        titleEn: 'Learning Addict',
        descriptionAr: 'زر الموقع 7 أيام متتالية!',
        descriptionEn: 'Visit for 7 consecutive days!',
        icon: Zap,
        category: 'engagement',
        xp: 1000,
        maxProgress: 7
    },
    {
        id: 'explorer',
        titleAr: 'المستكشف',
        titleEn: 'The Explorer',
        descriptionAr: 'زر جميع الصفحات الرئيسية في الموقع.',
        descriptionEn: 'Visit all main pages.',
        icon: LayoutGrid,
        category: 'engagement',
        xp: 400,
        maxProgress: 5 // Home, Roadmap, Verbs, Calculator, Guide
    },

    // --- 🤫 أسرار (Secrets) ---
    {
        id: 'click_master',
        titleAr: 'ناقر الشعار',
        titleEn: 'Logo Clicker',
        descriptionAr: 'نقرت على الشعار 10 مرات... لماذا؟',
        descriptionEn: 'Clicked the logo 10 times... why?',
        icon: MousePointer,
        category: 'secret',
        xp: 50,
        maxProgress: 10,
        secret: true
    }
];


