"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Shield,
  Activity,
  Stethoscope,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

/* ---- Inline SVG Illustrations for Sitting / Ergonomic Policies ---- */

function PostureIllustration({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
      {/* Desk */}
      <rect x="20" y="95" width="160" height="6" rx="3" fill={color} opacity="0.3" />
      <rect x="30" y="101" width="8" height="40" rx="2" fill={color} opacity="0.2" />
      <rect x="162" y="101" width="8" height="40" rx="2" fill={color} opacity="0.2" />
      {/* Monitor */}
      <rect x="75" y="55" width="50" height="35" rx="4" fill={color} opacity="0.25" />
      <rect x="80" y="60" width="40" height="25" rx="2" fill={color} opacity="0.15" />
      <rect x="95" y="90" width="10" height="6" rx="1" fill={color} opacity="0.2" />
      {/* Chair */}
      <rect x="110" y="105" width="40" height="6" rx="3" fill={color} opacity="0.35" />
      <rect x="145" y="85" width="6" height="26" rx="3" fill={color} opacity="0.3" />
      <rect x="118" y="111" width="6" height="25" rx="2" fill={color} opacity="0.2" />
      <rect x="138" y="111" width="6" height="25" rx="2" fill={color} opacity="0.2" />
      {/* Person - correct posture */}
      <circle cx="130" cy="55" r="12" fill={color} opacity="0.4" />
      <line x1="130" y1="67" x2="130" y2="100" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      <line x1="130" y1="78" x2="110" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <line x1="130" y1="100" x2="120" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      {/* Check mark */}
      <circle cx="165" cy="30" r="14" fill="#22c55e" opacity="0.2" />
      <path d="M158 30l4 4 8-8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Angle guide line */}
      <path d="M130 67 Q135 82 130 100" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      <text x="30" y="150" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">✓ وضعية صحيحة</text>
    </svg>
  );
}

function StretchIllustration({ color = "#f59e0b" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
      {/* Person stretching */}
      <circle cx="100" cy="35" r="14" fill={color} opacity="0.4" />
      <line x1="100" y1="49" x2="100" y2="95" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      {/* Arms up stretching */}
      <line x1="100" y1="60" x2="70" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <line x1="100" y1="60" x2="130" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      {/* Legs */}
      <line x1="100" y1="95" x2="80" y2="130" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <line x1="100" y1="95" x2="120" y2="130" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      {/* Motion lines */}
      <path d="M60 32 L55 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M58 42 L52 42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M140 32 L145 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M142 42 L148 42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      {/* Timer icon */}
      <circle cx="165" cy="85" r="18" stroke={color} strokeWidth="2" opacity="0.25" fill="none" />
      <line x1="165" y1="75" x2="165" y2="85" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <line x1="165" y1="85" x2="173" y2="90" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <text x="150" y="115" fill={color} opacity="0.4" fontSize="9" fontFamily="sans-serif" textAnchor="middle">50 دقيقة</text>
      {/* Floor */}
      <line x1="60" y1="135" x2="140" y2="135" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
      <text x="40" y="152" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">تمارين إطالة</text>
    </svg>
  );
}

function Rule202020Illustration({ color = "#f59e0b" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
      {/* Eye */}
      <ellipse cx="50" cy="65" rx="22" ry="14" stroke={color} strokeWidth="2" opacity="0.4" fill="none" />
      <circle cx="50" cy="65" r="7" fill={color} opacity="0.3" />
      <circle cx="50" cy="65" r="3" fill={color} opacity="0.5" />
      {/* Arrow */}
      <line x1="78" y1="65" x2="130" y2="65" stroke={color} strokeWidth="2" strokeDasharray="5 3" opacity="0.3" />
      <polygon points="130,60 140,65 130,70" fill={color} opacity="0.3" />
      {/* Distance object (window/tree) */}
      <rect x="150" y="45" width="30" height="40" rx="4" fill={color} opacity="0.15" />
      <circle cx="165" cy="55" r="8" fill="#22c55e" opacity="0.25" />
      <line x1="165" y1="63" x2="165" y2="78" stroke="#22c55e" strokeWidth="2" opacity="0.2" />
      {/* Three 20s */}
      <g opacity="0.6">
        <rect x="15" y="100" width="50" height="28" rx="8" fill={color} opacity="0.15" />
        <text x="40" y="118" fill={color} fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20 دقيقة</text>
      </g>
      <g opacity="0.6">
        <rect x="75" y="100" width="50" height="28" rx="8" fill={color} opacity="0.15" />
        <text x="100" y="118" fill={color} fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20 قدم</text>
      </g>
      <g opacity="0.6">
        <rect x="135" y="100" width="50" height="28" rx="8" fill={color} opacity="0.15" />
        <text x="160" y="118" fill={color} fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20 ثانية</text>
      </g>
      <text x="30" y="150" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">قاعدة 20-20-20</text>
    </svg>
  );
}

function ErgonomicChairIllustration({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
      {/* Chair back */}
      <path d="M110 25 Q108 60 110 90 L140 90 Q142 60 140 25 Z" fill={color} opacity="0.2" rx="5" />
      <path d="M112 30 Q111 58 112 85 L138 85 Q139 58 138 30 Z" fill={color} opacity="0.1" />
      {/* Lumbar support highlight */}
      <ellipse cx="125" cy="65" rx="12" ry="6" fill={color} opacity="0.3" />
      <text x="155" y="68" fill={color} opacity="0.5" fontSize="8" fontFamily="sans-serif">دعم أسفل الظهر</text>
      {/* Seat */}
      <rect x="100" y="90" width="50" height="8" rx="4" fill={color} opacity="0.3" />
      {/* Armrest */}
      <rect x="95" y="75" width="6" height="20" rx="3" fill={color} opacity="0.2" />
      <rect x="149" y="75" width="6" height="20" rx="3" fill={color} opacity="0.2" />
      <rect x="88" y="73" width="14" height="4" rx="2" fill={color} opacity="0.25" />
      <rect x="148" y="73" width="14" height="4" rx="2" fill={color} opacity="0.25" />
      {/* Base */}
      <line x1="125" y1="98" x2="125" y2="120" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.25" />
      <line x1="105" y1="125" x2="145" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      {/* Wheels */}
      <circle cx="108" cy="128" r="4" fill={color} opacity="0.2" />
      <circle cx="142" cy="128" r="4" fill={color} opacity="0.2" />
      <circle cx="125" cy="130" r="4" fill={color} opacity="0.2" />
      {/* Adjustment arrows */}
      <line x1="80" y1="95" x2="80" y2="75" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <polygon points="76,78 80,70 84,78" fill={color} opacity="0.3" />
      <line x1="80" y1="100" x2="80" y2="120" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <polygon points="76,117 80,125 84,117" fill={color} opacity="0.3" />
      <text x="60" y="150" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">كرسي إرجونومي</text>
    </svg>
  );
}

function WalkingIllustration({ color = "#f59e0b" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
      {/* Person walking */}
      <circle cx="90" cy="30" r="12" fill={color} opacity="0.4" />
      <line x1="90" y1="42" x2="90" y2="80" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      {/* Arms swinging */}
      <line x1="90" y1="55" x2="72" y2="70" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <line x1="90" y1="55" x2="108" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      {/* Legs walking */}
      <line x1="90" y1="80" x2="72" y2="110" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <line x1="90" y1="80" x2="108" y2="110" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      {/* Feet */}
      <line x1="72" y1="110" x2="65" y2="112" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      <line x1="108" y1="110" x2="115" y2="112" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      {/* Path/trail */}
      <path d="M40 115 Q80 108 120 115 Q160 122 180 115" stroke={color} strokeWidth="2" strokeDasharray="6 4" opacity="0.2" fill="none" />
      {/* Trees */}
      <circle cx="155" cy="75" r="12" fill="#22c55e" opacity="0.15" />
      <line x1="155" y1="87" x2="155" y2="110" stroke="#22c55e" strokeWidth="3" opacity="0.15" />
      <circle cx="175" cy="82" r="9" fill="#22c55e" opacity="0.12" />
      <line x1="175" y1="91" x2="175" y2="110" stroke="#22c55e" strokeWidth="2" opacity="0.12" />
      {/* 30 min badge */}
      <rect x="20" y="120" width="60" height="24" rx="12" fill={color} opacity="0.15" />
      <text x="50" y="136" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">30 دقيقة يومياً</text>
    </svg>
  );
}

function CarpalTunnelIllustration({ color = "#f59e0b" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
      {/* Hand outline */}
      <path d="M80 110 L80 60 Q80 50 88 50 Q96 50 96 60 L96 45 Q96 35 104 35 Q112 35 112 45 L112 40 Q112 30 120 30 Q128 30 128 40 L128 48 Q128 38 136 38 Q144 38 144 48 L144 85 Q144 110 125 120 L80 120 Z"
        stroke={color} strokeWidth="2" opacity="0.35" fill={color} fillOpacity="0.1" />
      {/* Wrist area highlight */}
      <rect x="78" y="110" width="52" height="15" rx="4" fill="#ef4444" opacity="0.15" />
      <line x1="85" y1="117" x2="123" y2="117" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
      {/* Pain indicators */}
      <circle cx="105" cy="117" r="3" fill="#ef4444" opacity="0.4" />
      <path d="M95 108 L92 104" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M115 108 L118 104" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      {/* Keyboard below */}
      <rect x="55" y="135" width="90" height="15" rx="4" fill={color} opacity="0.15" />
      <rect x="60" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
      <rect x="70" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
      <rect x="80" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
      <rect x="90" y="138" width="20" height="4" rx="1" fill={color} opacity="0.15" />
      <rect x="114" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
      <rect x="124" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
      {/* Arrow showing correct wrist position */}
      <path d="M160 95 Q155 110 160 125" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.4" />
      <polygon points="157,122 160,130 163,122" fill="#22c55e" opacity="0.4" />
      <text x="162" y="88" fill="#22c55e" opacity="0.5" fontSize="8" fontFamily="sans-serif">وضعية</text>
      <text x="162" y="98" fill="#22c55e" opacity="0.5" fontSize="8" fontFamily="sans-serif">صحيحة</text>
      <text x="50" y="155" fill={color} opacity="0" fontSize="1" fontFamily="sans-serif">.</text>
    </svg>
  );
}

const sections = [
  {
    id: "physical-safety",
    title: "السلامة الجسدية",
    subtitle: "Physical Safety",
    icon: Shield,
    gradient: "from-red-500 to-rose-500",
    glowColor: "rgba(239, 68, 68, 0.3)",
    accentBg: "bg-red-500/10",
    accentText: "text-red-400",
    accentBorder: "border-red-500/20",
    content: {
      intro: "تلتزم مؤسستنا بتوفير بيئة آمنة جسدياً لجميع طلاب BTEC، وتشمل سياساتنا:",
      points: [
        { title: "الفحص الطبي الدوري", desc: "يُطلب من جميع الطلاب إجراء فحص طبي شامل في بداية كل فصل دراسي للتأكد من لياقتهم البدنية وقدرتهم على المشاركة في جميع الأنشطة." },
        { title: "بروتوكولات الطوارئ", desc: "يتم تدريب جميع الموظفين على الإسعافات الأولية، مع توفر حقائب إسعاف في كل طابق وغرفة طوارئ مجهزة بالكامل." },
        { title: "سلامة المختبرات والورش", desc: "يجب ارتداء معدات الحماية الشخصية (PPE) في جميع المختبرات والورش العملية، مع إجراء تقييم المخاطر قبل كل نشاط عملي." },
        { title: "السلامة من الأجهزة الإلكترونية", desc: "فحص دوري لجميع الأجهزة الكهربائية والإلكترونية، والتأكد من سلامة الأسلاك والتوصيلات لمنع أي حوادث كهربائية." },
        { title: "الوقاية من الإصابات المتكررة", desc: "توفير كراسي ومكاتب مريحة تدعم وضعية الجسم الصحيحة، مع تشجيع الاستراحات المنتظمة أثناء العمل على الحاسوب." },
      ],
    },
  },
  {
    id: "health-guidance",
    title: "الإرشاد الصحي",
    subtitle: "Health Guidance",
    icon: Stethoscope,
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.3)",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/20",
    content: {
      intro: "نقدم خدمات إرشاد صحي شاملة تهدف إلى تعزيز صحة الطلاب:",
      points: [
        { title: "الإرشاد النفسي", desc: "يتوفر مرشد نفسي متخصص لمساعدة الطلاب في التعامل مع الضغوط الدراسية والمشاكل الشخصية بسرية تامة." },
        { title: "التغذية السليمة", desc: "برنامج توعوي عن أهمية التغذية المتوازنة وتأثيرها على التركيز والأداء الأكاديمي، مع توفير خيارات غذائية صحية في الكافتيريا." },
        { title: "النظافة الشخصية", desc: "حملات توعية دورية عن أهمية النظافة الشخصية والوقاية من الأمراض المعدية، خاصة في فترات الأوبئة." },
        { title: "إدارة الإجهاد", desc: "ورش عمل منتظمة لتعليم الطلاب تقنيات إدارة الإجهاد والتوتر مثل التنفس العميق والتأمل واليوغا." },
        { title: "النوم الصحي", desc: "إرشادات حول أهمية النوم الكافي (7-9 ساعات) وتأثيره على الأداء الأكاديمي والصحة العامة." },
      ],
    },
  },
  {
    id: "safe-environment",
    title: "بيئة دراسية آمنة",
    subtitle: "Safe Learning Environment",
    icon: Home,
    gradient: "from-emerald-500 to-green-500",
    glowColor: "rgba(16, 185, 129, 0.3)",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/20",
    content: {
      intro: "نسعى لتوفير بيئة دراسية آمنة ومحفزة لجميع طلابنا:",
      points: [
        { title: "جودة الهواء والتهوية", desc: "أنظمة تكييف وتهوية حديثة في جميع القاعات الدراسية مع فلاتر HEPA لضمان جودة الهواء وصحة الجهاز التنفسي." },
        { title: "الإضاءة المناسبة", desc: "إضاءة طبيعية وصناعية متوازنة تقلل من إجهاد العين وتحسن التركيز، مع إمكانية التحكم في شدة الإضاءة." },
        { title: "مكافحة التنمر", desc: "سياسة صارمة ضد التنمر بجميع أشكاله (الجسدي، اللفظي، الإلكتروني) مع قنوات إبلاغ سرية وآمنة." },
        { title: "الأثاث المريح", desc: "كراسي ومكاتب بتصميم إرجونومي (Ergonomic) تدعم صحة الظهر والرقبة أثناء ساعات الدراسة الطويلة." },
        { title: "النظافة والتعقيم", desc: "جدول تنظيف وتعقيم يومي لجميع المرافق، مع توفير معقمات اليدين في كل قاعة ومختبر." },
      ],
    },
  },
  {
    id: "your-health-matters",
    title: "صحتك تهمنا",
    subtitle: "Your Health Matters",
    icon: Heart,
    gradient: "from-pink-500 to-fuchsia-500",
    glowColor: "rgba(236, 72, 153, 0.3)",
    accentBg: "bg-pink-500/10",
    accentText: "text-pink-400",
    accentBorder: "border-pink-500/20",
    content: {
      intro: "نضع صحة كل طالب في مقدمة أولوياتنا من خلال:",
      points: [
        { title: "الدعم للحالات المزمنة", desc: "خطط رعاية فردية للطلاب الذين يعانون من حالات صحية مزمنة مثل الربو، السكري، والحساسية مع تدريب الموظفين على التعامل معها." },
        { title: "الصحة النفسية أولاً", desc: "لا خجل من طلب المساعدة! نوفر جلسات دعم نفسي مجانية وخطوط مساعدة سرية متاحة على مدار الساعة." },
        { title: "التأمين الصحي", desc: "تغطية تأمين صحي شاملة لجميع الطلاب تشمل الحوادث والإصابات التي قد تحدث خلال الأنشطة الدراسية والعملية." },
        { title: "الكشف المبكر", desc: "فحوصات دورية للكشف المبكر عن مشاكل النظر والسمع والوضعية الجسدية التي قد تؤثر على التحصيل الدراسي." },
        { title: "خدمات الإحالة", desc: "شبكة إحالة متكاملة مع المستشفيات والمراكز الصحية القريبة لضمان حصول الطلاب على الرعاية المتخصصة عند الحاجة." },
      ],
    },
  },
  {
    id: "movement-awareness",
    title: "التوعية الحركية",
    subtitle: "Movement Awareness",
    icon: Activity,
    gradient: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    accentBorder: "border-amber-500/20",
    content: {
      intro: "نشجع النشاط البدني وندمجه في الحياة الدراسية اليومية:",
      points: [
        { title: "استراحات حركية", desc: "فترات استراحة إجبارية كل 50 دقيقة تتضمن تمارين إطالة بسيطة لمكافحة آثار الجلوس المطول أمام الحاسوب." },
        { title: "تمارين الوقاية", desc: "تمارين مخصصة لمنع متلازمة النفق الرسغي (Carpal Tunnel) وآلام الظهر والرقبة الناتجة عن استخدام الحاسوب المطول." },
        { title: "النوادي الرياضية", desc: "أندية رياضية متنوعة (كرة قدم، سباحة، يوغا) متاحة لجميع الطلاب لتشجيع النشاط البدني المنتظم." },
        { title: "قاعدة 20-20-20", desc: "كل 20 دقيقة أمام الشاشة، انظر إلى شيء يبعد 20 قدماً لمدة 20 ثانية لحماية عينيك من الإجهاد." },
        { title: "المشي اليومي", desc: "تشجيع المشي لمدة 30 دقيقة يومياً على الأقل، مع مسارات مشي مخصصة وآمنة داخل الحرم الجامعي." },
      ],
    },
  },
];

function SectionCard({ section, index }: { section: (typeof sections)[0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const Icon = section.icon;

  return (
    <div className="glass-card-subtle rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-lg`}
            style={{ boxShadow: `0 8px 24px ${section.glowColor}` }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
            <p className="text-sm text-slate-500">{section.subtitle}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 animate-in fade-in duration-300">
          <p className={`${section.accentBg} ${section.accentText} border ${section.accentBorder} p-4 rounded-xl mb-5 font-medium text-sm`}>
            {section.content.intro}
          </p>
          <div className="space-y-4">
            {section.content.points.map((point, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className={`w-5 h-5 ${section.accentText} mt-0.5 shrink-0`} />
                <div>
                  <h3 className="font-semibold text-white mb-1">{point.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HealthPoliciesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_center,#2e1065_0%,#0f172a_50%,#020617_100%)]" />
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[120px]" />

      {/* Nav */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AF BTEC</span>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Header */}
        <header className="max-w-5xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg glow-blue">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">سياسات صحة طلاب BTEC</h1>
              <p className="text-slate-400 mt-1 font-light">دليل شامل للسلامة والصحة</p>
            </div>
          </div>
        </header>

        {/* Quick Nav */}
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="glass-panel rounded-xl p-3 text-center hover:bg-white/[0.05] transition-all hover:-translate-y-0.5"
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${s.accentText}`} />
                  <span className="text-xs font-medium text-slate-300 block">{s.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <main className="max-w-5xl mx-auto px-6 pb-10 space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id}>
              <SectionCard section={section} index={index} />
            </div>
          ))}

          {/* Emergency Info */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-90" />
            <div className="relative p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-7 h-7" />
                <h2 className="text-xl font-bold">في حالة الطوارئ</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-bold mb-1">الإسعافات الأولية</p>
                  <p className="text-white/80 text-sm">غرفة 101 - الطابق الأرضي</p>
                  <p className="text-white/80 text-sm">هاتف: 1234</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-bold mb-1">المرشد النفسي</p>
                  <p className="text-white/80 text-sm">غرفة 205 - الطابق الثاني</p>
                  <p className="text-white/80 text-sm">هاتف: 5678</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-bold mb-1">الأمن والسلامة</p>
                  <p className="text-white/80 text-sm">متاح 24/7</p>
                  <p className="text-white/80 text-sm">هاتف: 9999</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-8 text-center">
          <p className="text-sm text-slate-600">AF BTEC Platform &copy; 2026 — Ahmad AL-faqeih</p>
        </footer>
      </div>
    </div>
  );
}
