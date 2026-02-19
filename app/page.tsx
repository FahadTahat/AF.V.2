"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, BookOpen, Users, HelpCircle, Settings, ArrowLeft, UserCircle, MessageSquare, Shield, Sparkles, Image, Map, TrendingUp, Award, Zap, Star, ClipboardList, Quote, Headphones, Briefcase, ArrowRight, Moon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { InstallPWAButton } from "@/components/install-pwa-button"
import { useLanguage } from "@/contexts/LanguageContext"
import { RamadanDecorations } from "@/components/ramadan-decorations"

export default function HomePage() {
    const { t, language } = useLanguage()

    const features = [
        {
            title: t('feature.calculator.title'),
            description: t('feature.calculator.desc'),
            icon: Calculator,
            href: "/calculator",
            color: "from-blue-500 to-cyan-500",
            iconBg: "bg-blue-500/10",
        },
        {
            title: t('feature.resources.title'),
            description: t('feature.resources.desc'),
            icon: BookOpen,
            href: "/resources",
            color: "from-purple-500 to-pink-500",
            iconBg: "bg-purple-500/10",
        },
        {
            title: t('feature.project_manager.title'),
            description: t('feature.project_manager.desc'),
            icon: ClipboardList,
            href: "/tools/assignments",
            color: "from-indigo-500 to-cyan-500",
            iconBg: "bg-indigo-500/10",
        },
        {
            title: t('feature.focus.title'),
            description: t('feature.focus.desc'),
            icon: Headphones,
            href: "/tools/focus",
            color: "from-violet-500 to-fuchsia-500",
            iconBg: "bg-violet-500/10",
        },
        {
            title: t('feature.interview.title'),
            description: t('feature.interview.desc'),
            icon: Briefcase,
            href: "/tools/interview",
            color: "from-blue-600 to-sky-500",
            iconBg: "bg-blue-600/10",
        },
        {
            title: t('feature.guide.title'),
            description: t('feature.guide.desc'),
            icon: Users,
            href: "/guide",
            color: "from-emerald-500 to-green-500",
            iconBg: "bg-emerald-500/10",
        },
        {
            title: t('feature.roadmap.title'),
            description: t('feature.roadmap.desc'),
            icon: Map,
            href: "/dubai-roadmap",
            color: "from-amber-500 to-orange-500",
            iconBg: "bg-amber-500/10",
        },
        {
            title: t('feature.verbs.title'),
            description: t('feature.verbs.desc'),
            icon: BookOpen,
            href: "/tools/btec-verbs",
            color: "from-indigo-500 to-purple-500",
            iconBg: "bg-indigo-500/10",
        },
        {
            title: t('feature.ai_checker.title'),
            description: t('feature.ai_checker.desc'),
            icon: Shield,
            href: "/tools/ai-checker",
            color: "from-red-500 to-rose-500",
            iconBg: "bg-red-500/10",
        },
        {
            title: t('feature.image.title'),
            description: t('feature.image.desc'),
            icon: Image,
            href: "/tools/image-platform",
            color: "from-cyan-500 to-blue-500",
            iconBg: "bg-cyan-500/10",
        },
        {
            title: t('feature.smart_future.title'),
            description: t('feature.smart_future.desc'),
            icon: Sparkles,
            href: "/tools/ni",
            color: "from-yellow-500 to-orange-500",
            iconBg: "bg-yellow-500/10",
        },
    ]

    const stats = [
        { number: "1000+", label: t('home.stats.students'), icon: Users },
        { number: "500+", label: t('home.stats.resources'), icon: BookOpen },
        { number: "11+", label: t('home.stats.tools'), icon: Award },
        { number: "24/7", label: t('home.stats.available'), icon: Zap },
    ]

    const whyFeatures = [
        { emoji: "🎯", title: language === 'ar' ? "متخصص 100%" : "100% Specialized", desc: language === 'ar' ? "مصمم خصيصاً لنظام BTEC" : "Designed specifically for BTEC" },
        { emoji: "👥", title: language === 'ar' ? "مجتمع نشط" : "Active Community", desc: language === 'ar' ? "آلاف الطلاب يستخدمون الموقع" : "Thousands of students use the platform" },
        { emoji: "🤖", title: language === 'ar' ? "أدوات ذكية" : "Smart Tools", desc: language === 'ar' ? "مدعومة بالذكاء الاصطناعي" : "Powered by AI" },
        { emoji: "🚀", title: language === 'ar' ? "تحديثات مستمرة" : "Continuous Updates", desc: language === 'ar' ? "محتوى جديد باستمرار" : "New content regularly" },
    ]

    return (
        <div className="min-h-screen overflow-hidden text-white">
            <RamadanDecorations />
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slower"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            {/* Hero Section */}
            <section className="container px-4 pt-32 pb-20 md:pt-40 md:pb-32 relative">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-colors">
                            <Star className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-amber-400 fill-amber-400`} />
                            {t('home.badge')}
                        </Badge>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
                    >
                        <span className="text-white drop-shadow-lg">{t('home.title')}</span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-400 drop-shadow-2xl">
                            AF BTEC
                        </span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        {t('home.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                    >
                        <InstallPWAButton />

                        <Link href="/ramadan">
                            <Button size="lg" className="w-full sm:w-auto h-12 text-lg shadow-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-105 transition-all duration-300 rounded-full px-8 text-white border border-amber-400/20">
                                <Moon className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} animate-pulse text-yellow-200`} />
                                <span>{language === 'ar' ? 'فعاليات رمضان' : 'Ramadan Events'}</span>
                            </Button>
                        </Link>

                        <Link href="/tools">
                            <Button size="lg" className="w-full sm:w-auto h-12 text-lg shadow-2xl bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all duration-300 rounded-full px-8">
                                <Sparkles className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} animate-pulse`} />
                                {t('home.start_now')}
                            </Button>
                        </Link>

                        <Link href="#features">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 text-lg border-white/20 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-white rounded-full px-8 backdrop-blur-sm group">
                                {t('home.view_features')}
                                <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'mr-2' : 'ml-2'} group-hover:-translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-16"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                            <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                {stat.number}
                            </div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Video Section */}
            <section className="container px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <Badge className="mb-4 px-4 py-2 bg-primary/10 border-primary/20 text-primary">
                            <Sparkles className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                            {t('home.video.badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                            {t('home.video.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">AF BTEC</span>
                        </h2>
                        <p className="text-lg text-slate-400">
                            {t('home.video.desc')}
                        </p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/NGRVz_QEh-4?si=UKZHeq34Cueaa88m"
                                title="AF BTEC - دليل استخدام الموقع"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="container px-4 py-16" id="features">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Badge className="mb-4 px-4 py-2 bg-primary/10 border-primary/20 text-primary">
                        <TrendingUp className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                        {t('home.features.badge')}
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                        {t('home.features.title1')} <span className="text-primary">{t('home.features.title2')}</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        {t('home.features.desc')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Link href={feature.href}>
                                <Card className="h-full border border-white/10 shadow-lg bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 overflow-hidden group cursor-pointer transition-all duration-500">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    <CardHeader className="relative">
                                        <div className={`w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                            <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 leading-relaxed font-light">
                                            {feature.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                                            <span>{language === 'ar' ? 'استكشف' : 'Explore'}</span>
                                            <ArrowLeft className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${language === 'ar' ? '' : 'rotate-180'}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why Section */}
            <section className="container px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                        {language === 'ar' ? (
                            <>لماذا <span className="text-primary">AF BTEC</span>؟</>
                        ) : (
                            <>Why <span className="text-primary">AF BTEC</span>?</>
                        )}
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        {language === 'ar' ? 'نحن أكثر من مجرد موقع - نحن شريكك في رحلة التفوق' : 'We are more than just a website - we are your partner in the journey of excellence'}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {whyFeatures.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">{item.emoji}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm font-light">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container px-4 py-16 pb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="border border-white/10 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]"></div>

                        <CardContent className="p-12 text-center relative z-10">
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-4">
                                {language === 'ar' ? 'ابدأ رحلتك نحو' : 'Start your journey towards'} <span className="text-primary">{language === 'ar' ? 'التميز' : 'Excellence'}</span>
                            </h3>
                            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto font-light">
                                {language === 'ar' ? 'انضم لآلاف الطلاب واستفد من جميع الأدوات والموارد المتاحة مجاناً' : 'Join thousands of students and benefit from all the tools and resources available for free'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    asChild
                                    className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full"
                                >
                                    <Link href="/calculator" className="flex items-center gap-2">
                                        <Calculator className="h-5 w-5" />
                                        {language === 'ar' ? 'احسب معدلك الآن' : 'Calculate your GPA now'}
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="h-14 px-8 text-lg border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 text-white rounded-full"
                                >
                                    <Link href="/resources">{language === 'ar' ? 'استعرض الموارد' : 'Browse Resources'}</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>
        </div>
    )
}
