"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Wifi,
  Mail,
  Monitor,
  Key,
  Bug,
  ShieldCheck,
  ShieldAlert,
  Info,
  Zap,
  Laptop,
  HardDrive,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => {
    if (!password) return null;

    const checks = [
      { label: "8 أحرف على الأقل", passed: password.length >= 8 },
      { label: "حرف كبير (A-Z)", passed: /[A-Z]/.test(password) },
      { label: "حرف صغير (a-z)", passed: /[a-z]/.test(password) },
      { label: "رقم (0-9)", passed: /[0-9]/.test(password) },
      { label: "رمز خاص (!@#$...)", passed: /[^A-Za-z0-9]/.test(password) },
      { label: "12 حرف أو أكثر (مستحسن)", passed: password.length >= 12 },
    ];

    const score = checks.filter((c) => c.passed).length;

    let strength: { label: string; color: string; bg: string; width: string };
    if (score <= 2) strength = { label: "ضعيفة جداً", color: "text-red-400", bg: "bg-red-500", width: "w-1/6" };
    else if (score <= 3) strength = { label: "ضعيفة", color: "text-orange-400", bg: "bg-orange-500", width: "w-2/6" };
    else if (score <= 4) strength = { label: "متوسطة", color: "text-yellow-400", bg: "bg-yellow-500", width: "w-3/6" };
    else if (score <= 5) strength = { label: "قوية", color: "text-blue-400", bg: "bg-blue-500", width: "w-4/6" };
    else strength = { label: "قوية جداً", color: "text-green-400", bg: "bg-green-500", width: "w-full" };

    const warnings: string[] = [];
    if (/^(123|abc|password|qwerty|111|000)/i.test(password)) warnings.push("تجنب الأنماط الشائعة مثل 123 أو abc أو password");
    if (/(.)\1{2,}/.test(password)) warnings.push("تجنب تكرار نفس الحرف أكثر من مرتين");
    if (/^[0-9]+$/.test(password)) warnings.push("لا تستخدم أرقام فقط");

    return { checks, score, strength, warnings };
  }, [password]);

  return (
    <div className="glass-card-subtle rounded-2xl p-6 border border-blue-500/20">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg glow-blue">
          <Key className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">فحص قوة كلمة المرور</h3>
          <p className="text-sm text-slate-500">Password Strength Checker</p>
        </div>
      </div>

      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="أدخل كلمة المرور لفحصها..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
          dir="ltr"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-5 flex items-center gap-1">
        <Info className="w-3 h-3" />
        كلمة المرور لا يتم إرسالها أو تخزينها - الفحص يتم محلياً فقط
      </p>

      {analysis && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-400">القوة:</span>
              <span className={`text-sm font-bold ${analysis.strength.color}`}>
                {analysis.strength.label}
              </span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${analysis.strength.bg} ${analysis.strength.width} rounded-full transition-all duration-500`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.checks.map((check, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span className={check.passed ? "text-green-400" : "text-slate-500"}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>

          {analysis.warnings.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              {analysis.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const securitySections = [
  {
    id: "2fa",
    title: "المصادقة الثنائية (2FA)",
    subtitle: "Two-Factor Authentication",
    icon: Smartphone,
    gradient: "from-violet-500 to-purple-500",
    glowColor: "rgba(139, 92, 246, 0.3)",
    accentText: "text-violet-400",
    tips: [
      "فعّل المصادقة الثنائية (2FA) على جميع حساباتك المهمة - البريد الإلكتروني، منصة الدراسة، وحسابات التواصل الاجتماعي.",
      "استخدم تطبيقات المصادقة مثل Google Authenticator أو Microsoft Authenticator بدلاً من رسائل SMS لأنها أكثر أماناً.",
      "احتفظ برموز الاسترداد (Recovery Codes) في مكان آمن غير إلكتروني في حال فقدت هاتفك.",
      "لا تشارك رموز التحقق مع أي شخص حتى لو ادعى أنه من الدعم الفني - هذه عملية تصيد.",
      "استخدم مفاتيح الأمان المادية (Security Keys) مثل YubiKey للحماية القصوى إن أمكن.",
    ],
  },
  {
    id: "device-safety",
    title: "أمان الأجهزة",
    subtitle: "Device Safety",
    icon: Laptop,
    gradient: "from-cyan-500 to-blue-500",
    glowColor: "rgba(6, 182, 212, 0.3)",
    accentText: "text-cyan-400",
    tips: [
      "أقفل جهازك دائماً عند مغادرة مكانك حتى لو لدقائق - استخدم Win+L في Windows أو Cmd+Ctrl+Q في Mac.",
      "حدّث نظام التشغيل والبرامج فوراً عند توفر تحديثات أمنية - التأخير يعرضك لثغرات معروفة.",
      "لا توصل USB أو أي جهاز تخزين غير معروف المصدر - قد يحتوي على برمجيات خبيثة.",
      "فعّل تشفير القرص الصلب (BitLocker على Windows أو FileVault على Mac) لحماية بياناتك إذا سُرق جهازك.",
      "استخدم برنامج مكافحة فيروسات محدث ولا تعطل جدار الحماية (Firewall) أبداً.",
      "احذر من شحن هاتفك عبر منافذ USB عامة (Juice Jacking) - استخدم شاحنك الخاص أو كابل شحن فقط.",
    ],
  },
  {
    id: "phishing",
    title: "التصيد الإلكتروني",
    subtitle: "Phishing Protection",
    icon: Mail,
    gradient: "from-red-500 to-rose-500",
    glowColor: "rgba(239, 68, 68, 0.3)",
    accentText: "text-red-400",
    tips: [
      "تحقق دائماً من عنوان المرسل - الرسائل المزيفة تستخدم عناوين مشابهة مثل support@g00gle.com بدل google.com.",
      "لا تنقر على روابط في رسائل غير متوقعة - مرر الماوس فوق الرابط أولاً لرؤية العنوان الحقيقي.",
      "لا تدخل بيانات تسجيل الدخول في صفحات وصلت إليها عبر رسالة بريد - ادخل الموقع مباشرة من المتصفح.",
      "كن حذراً من الرسائل العاجلة التي تطلب إجراء فوري مثل 'حسابك سيُغلق خلال 24 ساعة'.",
      "أبلغ فريق تكنولوجيا المعلومات فوراً عن أي رسالة مشبوهة تصلك على بريدك الجامعي.",
    ],
  },
  {
    id: "network-safety",
    title: "أمان الشبكات",
    subtitle: "Network Safety",
    icon: Wifi,
    gradient: "from-emerald-500 to-green-500",
    glowColor: "rgba(16, 185, 129, 0.3)",
    accentText: "text-emerald-400",
    tips: [
      "لا تتصل بشبكات Wi-Fi مفتوحة (بدون كلمة مرور) في الأماكن العامة - بياناتك قد تكون مكشوفة.",
      "استخدم VPN عند الاتصال بشبكات عامة لتشفير اتصالك وحماية بياناتك.",
      "تأكد أن المواقع تستخدم HTTPS (القفل الأخضر) قبل إدخال أي معلومات شخصية.",
      "عطّل خاصية الاتصال التلقائي بالشبكات المعروفة لمنع الاتصال بشبكات مزيفة بنفس الاسم.",
      "استخدم شبكة الجامعة الرسمية فقط للوصول إلى منصات الدراسة والموارد الأكاديمية.",
    ],
  },
  {
    id: "data-privacy",
    title: "خصوصية البيانات",
    subtitle: "Data Privacy",
    icon: HardDrive,
    gradient: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    accentText: "text-amber-400",
    tips: [
      "لا تشارك معلوماتك الشخصية (رقم الهوية، العنوان، الصور) على منصات عامة أو مع أشخاص لا تعرفهم.",
      "راجع إعدادات الخصوصية في حساباتك على وسائل التواصل الاجتماعي واجعلها أكثر تقييداً.",
      "استخدم كلمات مرور مختلفة لكل حساب - استخدم مدير كلمات مرور مثل Bitwarden أو 1Password.",
      "احذف الحسابات والتطبيقات التي لا تستخدمها - كل حساب هو نقطة هجوم محتملة.",
      "قم بعمل نسخ احتياطية منتظمة لملفاتك الدراسية على خدمة سحابية مشفرة أو قرص خارجي.",
    ],
  },
  {
    id: "physical-digital",
    title: "السلامة الجسدية من الأجهزة",
    subtitle: "Physical Safety from Devices",
    icon: Monitor,
    gradient: "from-indigo-500 to-blue-500",
    glowColor: "rgba(99, 102, 241, 0.3)",
    accentText: "text-indigo-400",
    tips: [
      "اتبع قاعدة 20-20-20: كل 20 دقيقة، انظر لمسافة 20 قدم لمدة 20 ثانية لراحة عينيك.",
      "اضبط سطوع الشاشة ليتناسب مع إضاءة المحيط وفعّل فلتر الضوء الأزرق (Night Shift) في المساء.",
      "حافظ على وضعية جلوس صحيحة: الظهر مستقيم، القدمان مسطحتان على الأرض، الشاشة على مستوى العين.",
      "استخدم لوحة مفاتيح وماوس خارجيين مع اللابتوب لتقليل إجهاد المعصمين والرقبة.",
      "خذ استراحة لمدة 5-10 دقائق كل ساعة - قم وتحرك وأرح عينيك وجسمك.",
      "تأكد من سلامة كابلات الشحن والأجهزة الكهربائية لتجنب مخاطر الصدمة الكهربائية أو الحريق.",
    ],
  },
];

function SecuritySection({ section }: { section: (typeof securitySections)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = section.icon;

  return (
    <div className="glass-card-subtle rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white shadow-lg`}
            style={{ boxShadow: `0 8px 24px ${section.glowColor}` }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-white">{section.title}</h3>
            <p className="text-xs text-slate-500">{section.subtitle}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-3 animate-in fade-in duration-300">
          {section.tips.map((tip, i) => (
            <div key={i} className="flex gap-3">
              <ShieldCheck className={`w-4 h-4 ${section.accentText} mt-1 shrink-0`} />
              <p className="text-sm text-slate-400 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ITSafetyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_center,#2e1065_0%,#0f172a_50%,#020617_100%)]" />
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg glow-purple">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">السلامة الرقمية وأمان IT</h1>
              <p className="text-slate-400 mt-1 font-light">حماية شاملة للطالب في العالم الرقمي</p>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 pb-10 space-y-6">
          {/* Password Checker */}
          <PasswordChecker />

          {/* Password Tips */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
            <div className="relative p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                نصائح لكلمة مرور قوية
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "استخدم جملة سر بدل كلمة مرور - مثلاً: 'أحب_القهوة_الساعة7صباحاً!'",
                  "لا تستخدم معلومات شخصية كتاريخ ميلادك أو اسمك",
                  "استخدم مدير كلمات مرور مثل Bitwarden (مجاني) أو 1Password",
                  "غيّر كلمة المرور فوراً إذا شككت أن حسابك مخترق",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <Zap className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Sections */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShieldAlert className="w-7 h-7 text-blue-400" />
              أقسام السلامة الرقمية
            </h2>
            {securitySections.map((section) => (
              <SecuritySection key={section.id} section={section} />
            ))}
          </div>

          {/* IT Emergency */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900" />
            <div className="relative p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Bug className="w-7 h-7 text-red-400" />
                <h2 className="text-xl font-bold">تعرضت لاختراق أو مشكلة أمنية؟</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-bold mb-1 text-red-400">فوراً:</p>
                  <p className="text-slate-400 text-sm">غيّر كلمات مرورك على الفور من جهاز آخر آمن</p>
                </div>
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-bold mb-1 text-yellow-400">أبلغ:</p>
                  <p className="text-slate-400 text-sm">تواصل مع فريق IT على الرقم 4321 أو البريد it-support@btec.edu</p>
                </div>
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-bold mb-1 text-green-400">وثّق:</p>
                  <p className="text-slate-400 text-sm">احتفظ بلقطات شاشة وسجلات لأي نشاط مشبوه لاحظته</p>
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
