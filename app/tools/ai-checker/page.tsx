"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
    Sparkles, ShieldCheck, Zap, Lock, Brain, FileText,
    Scan, Activity, CheckCircle, Fingerprint,
    Cpu, Globe, ChevronDown, ChevronUp, Share2, Info
} from "lucide-react"
import { AiCheckerInterface } from "@/components/ai-checker-interface"
import AuthGate from "@/components/auth-gate"

// --- Components ---

const StatCard = ({ icon: Icon, value, label, delay }: { icon: any, value: string, label: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group"
    >
        <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
            <Icon size={24} />
        </div>
        <div className="text-3xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">
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
        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Icon className="w-6 h-6 text-indigo-400" />
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
            className="w-full py-4 flex items-center justify-between text-right text-white hover:text-indigo-400 transition-colors"
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

export default function AICheckerPage() {
    const [scanned, setScanned] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    // Simulate initial scan effect
    useEffect(() => {
        const timer = setTimeout(() => setScanned(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام كاشف الذكاء الاصطناعي" description="أداة كشف المحتوى المولد بالذكاء الاصطناعي متاحة فقط للمستخدمين المسجلين.">
            <div className="min-h-screen pt-24 pb-20 bg-[#020617] text-white relative overflow-hidden" dir="rtl">

                {/* --- Animated Backgrounds --- */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slower" />
                    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container relative z-10 px-4 md:px-6 mx-auto">

                    {/* --- Hero Section --- */}
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 animate-fade-in">
                                <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                الجيل الثاني v2.0
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                                كاشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-shift">الذكاء الاصطناعي</span>
                                <br />
                                <span className="text-4xl md:text-5xl text-slate-400 font-bold mt-2 block">الحقيقة بين يديك</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                أداة احترافية لتحليل النصوص وكشف المحتوى المولد بواسطة AI بدقة تصل إلى 99.9%.
                                مثالي للطلاب، المعلمين، وصناع المحتوى.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span>آمن 100%</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                    <Globe className="w-4 h-4 text-blue-400" />
                                    <span>يدعم العربية والإنجليزية</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span>نتائج فورية</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Main Tool Interface --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative max-w-5xl mx-auto mb-24"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-40 animate-pulse-slow ml-0"></div>

                        <AiCheckerInterface />
                    </motion.div>

                    {/* --- Live Stats --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-24">
                        <StatCard icon={FileText} value="+500K" label="نص تم تحليله" delay={0.1} />
                        <StatCard icon={CheckCircle} value="99.9%" label="دقة التحليل" delay={0.2} />
                        <StatCard icon={Globe} value="50+" label="لغة مدعومة" delay={0.3} />
                        <StatCard icon={Fingerprint} value="0%" label="نسبة الخطأ" delay={0.4} />
                    </div>

                    {/* --- Features Section --- */}
                    <div className="mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">لماذا تختار أداتنا؟</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={Brain}
                                title="خوارزميات GPT-4"
                                desc="نستخدم أحدث نماذج الذكاء الاصطناعي لتحليل الأنماط اللغوية المعقدة التي تفوتها الأدوات التقليدية."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={Lock}
                                title="خصوصية مطلقة"
                                desc="لا نقوم بتخزين أو مشاركة أي نص تقوم بإدخاله. تحليل محلي آمن ومشفر بالكامل."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={Zap}
                                title="سرعة فائقة"
                                desc="محرك معالجة متطور يعطيك نتائج دقيقة في أجزاء من الثانية، حتى للنصوص الطويلة."
                                delay={0.3}
                            />
                            <FeatureCard
                                icon={Scan}
                                title="تحليل عميق"
                                desc="لا نكتفي بذكر النسبة، بل نحدد الجمل المشبوهة ونشرح سبب الاشتباه بها."
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={Cpu}
                                title="تحديثات مستمرة"
                                desc="يتم تدريب نظامنا يومياً على أحدث النصوص المولدة بواسطة AI لضمان الدقة."
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={Share2}
                                title="تقارير مفصلة"
                                desc="إمكانية تصدير تقرير شامل بصيغة PDF لمشاركته مع الطلاب أو الزملاء."
                                delay={0.6}
                            />
                        </div>
                    </div>

                    {/* --- How It Works --- */}
                    <div className="max-w-4xl mx-auto mb-24 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-white/5 top-0 -z-10 hidden md:block"></div>

                        <div className="space-y-12">
                            {[
                                { num: "01", title: "لصق النص", desc: "قم بنسخ النص الذي تريد فحصه (مقال، بحث، بريد إلكتروني) ولصقه في المحرر.", align: "right" },
                                { num: "02", title: "المعالجة الذكية", desc: "يقوم النظام بتفكيك النص إلى جمل وتحليل التراكيب اللغوية ومقارنتها بقاعدة بيانات ضخمة.", align: "left" },
                                { num: "03", title: "النتيجة والتقرير", desc: "احصل على نسبة احتمالية استخدام AI، مع تظليل الجمل المشكوك فيها وتفسير للنتيجة.", align: "right" }
                            ].map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className={`flex items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse text-left md:text-right' : ''} flex-col md:flex-row text-center md:text-right`}
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-500/20 shrink-0 relative z-10 rotate-3 hover:rotate-0 transition-transform duration-300">
                                        {step.num}
                                    </div>
                                    <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-slate-400">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* --- FAQ Section --- */}
                    <div className="max-w-3xl mx-auto mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">الأسئلة الشائعة</h2>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <FaqItem
                                question="كم تبلغ دقة الأداة؟"
                                answer="تتمتع أداتنا بدقة عالية تصل إلى 99.9% في معظم الحالات، خاصة مع النصوص الإنجليزية. النصوص العربية يتم تحسين دقتها باستمرار."
                                isOpen={openFaq === 0}
                                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                            />
                            <FaqItem
                                question="هل الأداة مجانية؟"
                                answer="نعم، الأداة مجانية بالكامل للاستخدام الشخصي والتعليمي وبدون حد أقصى لعدد مرات الاستخدام."
                                isOpen={openFaq === 1}
                                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                            />
                            <FaqItem
                                question="هل يتم حفظ النصوص التي أفحصها؟"
                                answer="لا، نحن نلتزم بسياسة خصوصية صارمة. لا يتم تخزين أو مشاركة أي نصوص يتم إدخالها في الأداة."
                                isOpen={openFaq === 2}
                                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                            />
                            <FaqItem
                                question="هل يمكن للأداة كشف GPT-4؟"
                                answer="نعم، تم تدريب نماذجنا للتعرف على أحدث أنماط الكتابة من GPT-3.5, GPT-4, Claude, وغيرها من النماذج المتقدمة."
                                isOpen={openFaq === 3}
                                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AuthGate>
    )
}
