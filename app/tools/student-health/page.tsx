"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Shield,
    Sparkles,
    ArrowRight,
    ShieldAlert,
    ChevronDown,
    ChevronUp,
    LayoutGrid,
    List,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { healthSections, securitySections } from "@/components/student-health/data";
import { PasswordChecker } from "@/components/student-health/password-checker";
import { cn } from "@/lib/utils";
import AuthGate from "@/components/auth-gate";

// Component for a single Health Section Card
function HealthSectionCard({ section, index }: { section: any; index: number }) {
    const [expanded, setExpanded] = useState(index === 0);
    const Icon = section.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-slate-900/60",
                expanded ? "ring-1 ring-white/10" : ""
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-500",
                    section.gradient,
                    expanded ? "opacity-10" : "group-hover:opacity-10"
                )}
            />

            <button
                onClick={() => setExpanded(!expanded)}
                className="relative flex w-full items-center justify-between p-6 text-right"
            >
                <div className="flex items-center gap-5">
                    <div
                        className={cn(
                            "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-105",
                            section.gradient
                        )}
                        style={{ boxShadow: `0 8px 24px ${section.glowColor}` }}
                    >
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                            {section.title}
                        </h2>
                        <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300">
                            {section.subtitle}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("hidden sm:flex bg-slate-950/50", section.accentText, section.accentBorder)}>
                        {section.content.points.length} نقاط
                    </Badge>
                    {expanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-500 transition-colors group-hover:text-white" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500 transition-colors group-hover:text-white" />
                    )}
                </div>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="border-t border-white/5 bg-slate-950/20 px-6 pb-6 pt-4">
                            <p className={cn("mb-6 rounded-xl border p-4 text-sm font-medium leading-relaxed", section.accentBg, section.accentText, section.accentBorder)}>
                                {section.content.intro}
                            </p>

                            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                                {section.content.points.map((point: any, i: number) => {
                                    const Illustration = point.Illustration;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
                                        >
                                            <div className="flex gap-4">
                                                <div className={cn("mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold", section.accentBg, section.accentText)}>
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="mb-1 font-bold text-white">{point.title}</h3>
                                                    <p className="text-sm leading-relaxed text-slate-400">
                                                        {point.desc}
                                                    </p>

                                                    {/* Illustration if available */}
                                                    {Illustration && (
                                                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 p-2">
                                                            <Illustration color={section.accentText.split('-')[1] ? `var(--${section.accentText.split('-')[1]}-500)` : undefined} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Component for IT Security Section
function SecuritySectionCard({ section, index }: { section: any; index: number }) {
    const Icon = section.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl"
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-10", section.gradient)} />

            <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg", section.gradient)} style={{ boxShadow: `0 8px 24px ${section.glowColor}` }}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-white/5 text-slate-400 hover:bg-white/10"> نصائح أمنية</Badge>
                </div>

                <h3 className="mb-1 text-lg font-bold text-white">{section.title}</h3>
                <p className="mb-4 text-xs font-medium text-slate-500">{section.subtitle}</p>

                <ul className="space-y-3">
                    {section.tips.slice(0, 3).map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <ShieldAlert className={cn("mt-0.5 h-4 w-4 flex-shrink-0", section.accentText)} />
                            <span className="leading-tight">{tip}</span>
                        </li>
                    ))}
                    {section.tips.length > 3 && (
                        <li className="pt-2 text-center text-xs text-slate-500">
                            +{section.tips.length - 3} نصائح إضافية...
                        </li>
                    )}
                </ul>
            </div>
        </motion.div>
    );
}

export default function StudentHealthPage() {
    return (
        <AuthGate mode="block" title="سجّل دخولك لعرض دليل الصحة والسلامة" description="دليل الصحة والسلامة الرقمية متاح فقط للمستخدمين المسجلين.">
            <div className="min-h-screen pb-20 pt-24 " dir="rtl">
                {/* Background Ambience */}
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
                <div className="fixed -left-[10%] top-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="fixed -right-[10%] bottom-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <Badge className="mb-4 bg-primary/20 px-4 py-1.5 text-sm text-primary hover:bg-primary/30">
                            <Sparkles className="mr-2 h-4 w-4" />
                            بوابة الطالب الشاملة
                        </Badge>
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                            الصحة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">والسلامة الرقمية</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-slate-400">
                            دليلك التفاعلي للحفاظ على صحتك الجسدية وأمانك الرقمي في بيئة BTEC التعليمية.
                        </p>
                    </div>

                    {/* Content Tabs */}
                    <Tabs defaultValue="health" className="space-y-8">
                        <div className="flex justify-center">
                            <TabsList className="grid w-full max-w-md grid-cols-2 rounded-full bg-slate-900/80 p-1 backdrop-blur-md border border-white/10">
                                <TabsTrigger value="health" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                                    <Heart className="ml-2 h-4 w-4" />
                                    الصحة والبيئة
                                </TabsTrigger>
                                <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                                    <Shield className="ml-2 h-4 w-4" />
                                    الأمان الرقمي
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Health Tab */}
                        <TabsContent value="health" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid gap-6">
                                {healthSections.map((section, index) => (
                                    <HealthSectionCard key={section.id} section={section} index={index} />
                                ))}
                            </div>

                            {/* Emergency Banner */}
                            <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-red-900/50 to-red-600/20 border border-red-500/30 p-8 backdrop-blur-md">
                                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                                    <div className="flex items-center gap-4 text-center md:text-right">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 ring-4 ring-red-500/10">
                                            <ShieldAlert className="h-8 w-8 text-red-500 animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">هل تواجه حالة طوارئ؟</h3>
                                            <p className="text-red-200">فريقنا متاح على مدار الساعة لمساعدتك</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="destructive" size="lg" className="rounded-full font-bold shadow-lg shadow-red-900/20">
                                            اتصل بالطوارئ (999)
                                        </Button>
                                        <Button variant="outline" size="lg" className="rounded-full border-red-500/30 text-red-100 hover:bg-red-500/20">
                                            دليل الإسعافات
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid gap-8 lg:grid-cols-3">

                                {/* Left Column: Password Checker ( Sticky ) */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-24 space-y-6">
                                        <PasswordChecker />

                                        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/50 to-transparent p-6 backdrop-blur-md">
                                            <h3 className="mb-3 text-lg font-bold text-white">تلميح سريع 💡</h3>
                                            <p className="text-sm leading-relaxed text-slate-400">
                                                هل تعلم؟ استخدام جملة مكونة من 3 كلمات عشوائية (مثل "حصان_أزرق_سريع") أسهل في التذكر وأصعب في الاختراق من كلمة مرور معقدة قصيرة!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Tips Grid */}
                                <div className="lg:col-span-2">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {securitySections.map((section, index) => (
                                            <SecuritySectionCard key={section.id} section={section} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthGate>
    );
}
