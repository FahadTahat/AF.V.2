"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Map, Calendar, Layers, BookOpen, AlertTriangle, CheckCircle,
    ArrowRight, Star, Clock, FileText, GraduationCap, ChevronDown, ChevronUp
} from "lucide-react";
import { levels } from "@/lib/schedule-data";
import SemesterHeader from "@/components/dubai-roadmap/schedule/SemesterHeader";
import TimelineNode from "@/components/dubai-roadmap/schedule/TimelineNode";
import ResubmissionStation from "@/components/dubai-roadmap/schedule/ResubmissionStation";
import ImportantNotes from "@/components/dubai-roadmap/schedule/ImportantNotes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAchievements } from "@/contexts/AchievementContext";
import AuthGate from "@/components/auth-gate";

// --- Components ---

const StatCard = ({ icon: Icon, value, label, delay }: { icon: any, value: string, label: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
    >
        <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            <Icon size={24} />
        </div>
        <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all">
            {value}
        </div>
        <div className="text-slate-400 text-sm font-medium">{label}</div>
    </motion.div>
)

const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </motion.div>
)

const FaqItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-white/10 last:border-0">
        <button
            onClick={onClick}
            className="w-full py-4 flex items-center justify-between text-right text-white hover:text-blue-400 transition-colors"
        >
            <span className="font-medium text-lg">{question}</span>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <p className="pb-4 text-slate-400 leading-relaxed text-sm">
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

export default function DubaiRoadmapPage() {
    const [activeLevel, setActiveLevel] = useState(levels[0].id);
    const [isFading, setIsFading] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { t, language } = useLanguage();
    const { incrementProgress } = useAchievements();

    // Trigger on mount
    useEffect(() => {
        incrementProgress('navigator');
    }, []);

    const currentLevel = levels.find((l) => l.id === activeLevel)!;

    const handleLevelChange = (levelId: string) => {
        if (levelId === activeLevel) return;
        incrementProgress('navigator');
        setIsFading(true);
        setTimeout(() => {
            setActiveLevel(levelId);
            setIsFading(false);
        }, 300);
    };

    const faqs = [
        {
            question: language === 'ar' ? 'ما الفرق بين المستوى الثاني والمستوى الثالث؟' : 'What is the difference between Level 2 and Level 3?',
            answer: language === 'ar'
                ? 'المستوى الثاني (Level 2) يعادل الصف العاشر وهو تأسيسي، بينما المستوى الثالث (Level 3) يعادل الصفين الحادي عشر والثاني عشر وهو أكثر تخصصاً وعمقاً.'
                : 'Level 2 is equivalent to grade 10 and is foundational, while Level 3 is equivalent to grades 11 and 12 and is more specialized and in-depth.'
        },
        {
            question: language === 'ar' ? 'متى تكون فترات إعادة التسليم؟' : 'When are resubmission periods?',
            answer: language === 'ar'
                ? 'تكون فترات إعادة التسليم عادةً بعد انتهاء الفصل الدراسي، وتمنح فرصة للطلاب لتحسين درجاتهم أو استكمال النواقص.'
                : 'Resubmission periods are usually after the end of the semester and give students the opportunity to improve their grades or complete deficiencies.'
        },
        {
            question: language === 'ar' ? 'هل هذا الجدول نهائي؟' : 'Is this schedule final?',
            answer: language === 'ar'
                ? 'هذا الجدول استرشادي ويعتمد على الخطة الدراسية المعتمدة لمدارس BTEC، ولكنه قد يخضع لبعض التعديلات الطفيفة حسب المدرسة.'
                : 'This schedule is indicative and depends on the approved curriculum for BTEC schools, but it may be subject to minor modifications depending on the school.'
        }
    ];

    return (
        <AuthGate mode="blur" title="سجّل دخولك لعرض خارطة الطريق" description="خارطة الطريق الأكاديمية متاحة فقط للمستخدمين المسجلين. سجّل دخولك لاستكشاف مسارك الدراسي بشكل تفاعلي ومفصل.">
            <div className="min-h-screen pt-24 pb-20 bg-[#020617] text-white relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                {/* --- Animated Backgrounds --- */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slower" />
                    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container relative z-10 px-4 md:px-6 mx-auto">

                    {/* --- Hero Section --- */}
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold mb-4 animate-fade-in">
                                <Map className="w-4 h-4 text-amber-400" />
                                {language === 'ar' ? 'رود ماب الأكاديمية' : 'Academic Roadmap'}
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-tight">
                                {language === 'ar' ? 'مسارك في' : 'Your Path in'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-shift">BTEC IT</span>
                            </h1>

                            <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
                                {language === 'ar'
                                    ? 'دليل شامل وتفاعلي يرافقك خطوة بخطوة من بداية رحلتك الدراسية وحتى التخرج.'
                                    : 'A comprehensive and interactive guide that accompanies you step by step from the beginning of your educational journey until graduation.'}
                            </p>
                        </motion.div>
                    </div>

                    {/* --- Main Roadmap Interface --- */}
                    <div className="max-w-6xl mx-auto mb-24 relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-40 animate-pulse-slow"></div>

                        <div className="relative z-10 bg-[#0b101b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Top Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            <div className="p-8 md:p-12">
                                {/* Level Tabs */}
                                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                                    {levels.map((level) => {
                                        const isActive = activeLevel === level.id;
                                        return (
                                            <button
                                                key={level.id}
                                                onClick={() => handleLevelChange(level.id)}
                                                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden group
                                                ${isActive ? "text-white shadow-lg scale-105 ring-2 ring-blue-500/50" : "text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10"}`}
                                            >
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-100" />
                                                )}
                                                <span className="relative z-10">{level.nameAr}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Timeline Content */}
                                <div className={`transition-all duration-500 transform ${isFading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`} key={activeLevel}>
                                    <div className="relative pl-4 md:pl-0">
                                        {/* Central Line */}
                                        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent md:-translate-x-1/2 -z-10" />

                                        {currentLevel.semesters.map((semester, sIdx) => {
                                            const prevSemester = sIdx > 0 ? currentLevel.semesters[sIdx - 1] : null;
                                            const prevColor = prevSemester ? prevSemester.resubmission ? "#eab308" : prevSemester.color : undefined;

                                            return (
                                                <div key={semester.id} className="mb-16 relative">
                                                    <SemesterHeader
                                                        number={semester.number}
                                                        name={semester.name}
                                                        color={semester.color}
                                                        gradientFrom={semester.gradientFrom}
                                                        gradientTo={semester.gradientTo}
                                                        isFirst={sIdx === 0}
                                                        prevColor={prevColor} />

                                                    <div className="space-y-4 mt-8 md:w-full">
                                                        {semester.units.map((unit, uIdx) => (
                                                            <TimelineNode
                                                                key={unit.id}
                                                                unit={unit}
                                                                index={uIdx}
                                                                color={semester.color}
                                                                isLast={uIdx === semester.units.length - 1}
                                                                gradeId={activeLevel === 'level2' ? 'grade10' : activeLevel.includes('year1') ? 'grade11' : 'grade12'}
                                                            />
                                                        ))}
                                                    </div>

                                                    {semester.resubmission &&
                                                        <div className="mt-12">
                                                            <ResubmissionStation
                                                                semesterNumber={semester.number}
                                                                period={semester.resubmission.period}
                                                                note={semester.resubmission.note} />
                                                        </div>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-12">
                                        <ImportantNotes prevColor={currentLevel.semesters[currentLevel.semesters.length - 1]?.color} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Stats Section --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-24">
                        <StatCard icon={Layers} value="+18" label={language === 'ar' ? 'وحدة دراسية' : 'Study Units'} delay={0.1} />
                        <StatCard icon={Calendar} value="2" label={language === 'ar' ? 'سنة دراسية' : 'Academic Years'} delay={0.2} />
                        <StatCard icon={CheckCircle} value="100%" label={language === 'ar' ? 'تغطية المنهج' : 'Curriculum Coverage'} delay={0.3} />
                        <StatCard icon={GraduationCap} value="+3" label={language === 'ar' ? 'مستويات' : 'Levels'} delay={0.4} />
                    </div>

                    {/* --- Features Section --- */}
                    <div className="mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {language === 'ar' ? 'مميزات الرود ماب' : 'Roadmap Features'}
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={Calendar}
                                title={language === 'ar' ? 'جدول زمني دقيق' : 'Accurate Timeline'}
                                desc={language === 'ar'
                                    ? 'تعرف على مواعيد تسليم الوحدات وفترات التقييم بدقة متناهية لتنظيم وقتك.'
                                    : 'Know the deadlines for submitting units and assessment periods with utmost accuracy to organize your time.'}
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={BookOpen}
                                title={language === 'ar' ? 'تفاصيل الوحدات' : 'Unit Details'}
                                desc={language === 'ar'
                                    ? 'كل ما تحتاج معرفته عن كل وحدة: المعايير، المتطلبات، وكيفية التحضير لها.'
                                    : 'Everything you need to know about each unit: criteria, requirements, and how to prepare for it.'}
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={AlertTriangle}
                                title={language === 'ar' ? 'محطات الإعادة' : 'Resubmission Stations'}
                                desc={language === 'ar'
                                    ? 'تنبيهات واضحة لفترات إعادة التسليم لضمان عدم تفويت أي فرصة.'
                                    : 'Clear alerts for resubmission periods to ensure you don\'t miss any opportunity.'}
                                delay={0.3}
                            />
                        </div>
                    </div>

                    {/* --- FAQ Section --- */}
                    <div className="max-w-3xl mx-auto mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                            </h2>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            {faqs.map((faq, index) => (
                                <FaqItem
                                    key={index}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openFaq === index}
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthGate>
    );
}
