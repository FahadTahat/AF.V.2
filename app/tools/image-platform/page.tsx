"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Image as ImageIcon, Layers, Zap, Cloud, Palette, Share2, Sparkles,
    Monitor, Grid, Database, ChevronDown, ChevronUp, CheckCircle,
    ShieldCheck, Eye
} from "lucide-react"
import { ImagePlatformInterface } from "@/components/image-platform-interface"
import { useLanguage } from "@/contexts/LanguageContext"
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
            <span className="font-medium text-lg text-start">{question}</span>
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
                    <p className="pb-4 text-slate-400 leading-relaxed text-sm text-start">
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

export default function ImagePlatformPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const { t, language } = useLanguage()

    return (
        <AuthGate mode="block" title="سجّل دخولك لاستخدام موقع الصور" description="موقع إدارة الصور متاح فقط للمستخدمين المسجلين. سجّل دخولك لرفع ومشاركة وتوليد الصور بالذكاء الاصطناعي.">
            <div className="min-h-screen pt-24 pb-20 bg-[#020617] text-white relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>

                {/* --- Animated Backgrounds --- */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[128px] animate-pulse-slower" />
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
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold mb-6 animate-fade-in">
                                <span className="relative flex h-2 w-2 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                {t('image.badge')}
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                                {language === 'ar' ? (
                                    <>
                                        موقع <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-gradient-shift">إدارة الصور</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-gradient-shift">Image Management</span> Platform
                                    </>
                                )}
                                <br />
                                <span className="text-4xl md:text-5xl text-slate-400 font-bold mt-2 block">{t('image.hero.subtitle')}</span>
                            </h1>

                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                {t('image.hero.desc')}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                    <Cloud className="w-4 h-4 text-blue-400" />
                                    <span>{t('image.label.cloud')}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span>{t('image.label.instant')}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span>{t('image.label.secure')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Main Tool Interface --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative max-w-6xl mx-auto mb-24"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-3xl blur-lg opacity-40 animate-pulse-slow ml-0"></div>

                        <ImagePlatformInterface />

                    </motion.div>

                    {/* --- Live Stats --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-24">
                        <StatCard icon={ImageIcon} value="+10K" label={t('image.stat.uploaded')} delay={0.1} />
                        <StatCard icon={Monitor} value="4K" label={t('image.stat.resolution')} delay={0.2} />
                        <StatCard icon={Database} value="99.9%" label={t('image.stat.uptime')} delay={0.3} />
                        <StatCard icon={Share2} value="+50K" label={t('image.stat.shares')} delay={0.4} />
                    </div>

                    {/* --- Features Section --- */}
                    <div className="mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('image.why.title')}</h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            <FeatureCard
                                icon={Grid}
                                title={t('image.feat.org.title')}
                                desc={t('image.feat.org.desc')}
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={Palette}
                                title={t('image.feat.res.title')}
                                desc={t('image.feat.res.desc')}
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={Share2}
                                title={t('image.feat.share.title')}
                                desc={t('image.feat.share.desc')}
                                delay={0.3}
                            />
                            <FeatureCard
                                icon={Eye}
                                title={t('image.feat.prev.title')}
                                desc={t('image.feat.prev.desc')}
                                delay={0.4}
                            />
                            <FeatureCard
                                icon={Layers}
                                title={t('image.feat.proj.title')}
                                desc={t('image.feat.proj.desc')}
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={Sparkles}
                                title={t('image.feat.ai.title')}
                                desc={t('image.feat.ai.desc')}
                                delay={0.6}
                            />
                        </div>
                    </div>

                    {/* --- FAQ Section --- */}
                    <div className="max-w-3xl mx-auto mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">{t('faq.title')}</h2>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <FaqItem
                                question={t('image.faq.size.q')}
                                answer={t('image.faq.size.a')}
                                isOpen={openFaq === 0}
                                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                            />
                            <FaqItem
                                question={t('image.faq.secure.q')}
                                answer={t('image.faq.secure.a')}
                                isOpen={openFaq === 1}
                                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                            />
                            <FaqItem
                                question={t('image.faq.mobile.q')}
                                answer={t('image.faq.mobile.a')}
                                isOpen={openFaq === 2}
                                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AuthGate>
    )
}
