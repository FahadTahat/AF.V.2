"use client";

import Link from "next/link";
import { Heart, Shield, Sparkles, ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_center,#2e1065_0%,#0f172a_50%,#020617_100%)]" />
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px]" />

      {/* Nav */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center animate-glow-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AF BTEC</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/health-policies" className="text-sm text-slate-400 hover:text-white transition-colors">
              سياسات الصحة
            </Link>
            <Link href="/it-safety" className="text-sm text-slate-400 hover:text-white transition-colors">
              السلامة الرقمية
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 glass-panel rounded-full px-5 py-2.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-slate-300">BTEC Student Wellbeing Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="gradient-text-alt">سياسات صحة</span>
            <br />
            <span className="text-white">طلاب BTEC</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            نهتم بصحتك الجسدية والرقمية - دليلك الشامل للسلامة والحماية في رحلتك التعليمية
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { label: "سياسة صحية", value: "5+" },
              { label: "نصيحة أمنية", value: "30+" },
              { label: "قسم حماية", value: "6+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Cards */}
        <main className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Health Policies Card */}
            <Link href="/health-policies" className="group block">
              <div className="glass-card rounded-3xl p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg glow-blue group-hover:scale-110 transition-transform duration-500">
                    <Heart className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">سياسات الصحة</h2>
                    <p className="text-slate-500 text-sm">Health Policies</p>
                  </div>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed font-light">
                  سياسات شاملة تغطي السلامة الجسدية، الإرشاد الصحي، البيئة الدراسية الآمنة، والتوعية الحركية لطلاب BTEC.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["السلامة الجسدية", "الإرشاد الصحي", "بيئة آمنة", "صحتك تهمنا", "التوعية الحركية"].map((tag) => (
                    <span key={tag} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">استكشف السياسات</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* IT Safety Card */}
            <Link href="/it-safety" className="group block">
              <div className="glass-card rounded-3xl p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg glow-purple group-hover:scale-110 transition-transform duration-500">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">السلامة الرقمية</h2>
                    <p className="text-slate-500 text-sm">IT & Digital Safety</p>
                  </div>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed font-light">
                  حماية من المخاطر الرقمية، فحص قوة كلمات المرور، نصائح تفعيل المصادقة الثنائية، وأمان الأجهزة والبيانات.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["فحص كلمة المرور", "2FA", "أمان الأجهزة", "الخصوصية", "التصيد الإلكتروني"].map((tag) => (
                    <span key={tag} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-pink-400 group-hover:text-pink-300 transition-colors">
                  <span className="text-sm font-medium">استكشف الأمان</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 text-center">
          <p className="text-sm text-slate-600">
            AF BTEC Platform &copy; 2026 — Ahmad AL-faqeih
          </p>
        </footer>
      </div>
    </div>
  );
}
