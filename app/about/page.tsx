"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Award,
  Code,
  Database,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  Instagram,
  MessageCircle,
  Send,
  Shield,
  Users,
  BookOpen,
  Trophy,
  Zap,
  Target,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about")
  const { t, language } = useLanguage()

  const certificates = [
    {
      title: language === 'ar' ? "شهادة BTEC في تكنولوجيا المعلومات - المستوى الثاني" : "BTEC IT Level 2 Certificate",
      issuer: "Pearson Education",
      date: "2022",
      grade: "Distinction*",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: language === 'ar' ? "شهادة BTEC في تكنولوجيا المعلومات - المستوى الثالث" : "BTEC IT Level 3 Certificate",
      issuer: "Pearson Education",
      date: "2023",
      grade: "Distinction*",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "BTEC Computer General Level 4",
      issuer: "Pearson Education",
      date: "2024",
      grade: "Distinction",
      icon: <Globe className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "BTEC CyberSecurity Level 4",
      issuer: "Pearson Education",
      date: "2024",
      grade: "Distinction",
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "42 Network",
      issuer: "42 School",
      date: "2024",
      grade: "C Script",
      icon: <Code className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "BTEC CyberSecurity Level 5",
      issuer: "Pearson Education",
      date: "2025",
      grade: "Certificate",
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-600 to-pink-600",
    },
    {
      title: "Oracle Certified Associate",
      issuer: "Oracle Academy",
      date: "2025",
      grade: "Certified",
      icon: <Database className="w-6 h-6" />,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Cisco Certified Network Associate (CCNA)",
      issuer: "Cisco Network Academy",
      date: "2024",
      grade: "Associate",
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Security+",
      issuer: "CompTIA",
      date: "2023",
      grade: "Certified",
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-500 to-rose-500",
    },
    {
      title: "Network+",
      issuer: "CompTIA",
      date: "2023",
      grade: "Certified",
      icon: <Globe className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "A+",
      issuer: "CompTIA",
      date: "2023",
      grade: "Certified",
      icon: <Award className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Full Stack Web Development",
      issuer: "Udemy",
      date: "2025",
      grade: "Certificate",
      icon: <Code className="w-6 h-6" />,
      color: "from-purple-500 to-violet-500",
    },
  ]

  const skills = [
    { name: "Java Oracle", level: 85, icon: <Database className="w-5 h-5" /> },
    { name: "Web Development", level: 90, icon: <Globe className="w-5 h-5" /> },
    { name: "Network", level: 85, icon: <Smartphone className="w-5 h-5" /> },
    { name: "Python", level: 80, icon: <Code className="w-5 h-5" /> },
    { name: "C#", level: 80, icon: <Code className="w-5 h-5" /> },
    { name: "C Script", level: 70, icon: <Code className="w-5 h-5" /> },
    { name: "DataBases", level: 83, icon: <Database className="w-5 h-5" /> },
    { name: "Mobile Development", level: 80, icon: <Smartphone className="w-5 h-5" /> },
    { name: "Game Development", level: 70, icon: <Code className="w-5 h-5" /> },
    { name: "Technical Support", level: 90, icon: <Users className="w-5 h-5" /> },
    { name: "CyberSecurity", level: 85, icon: <Shield className="w-5 h-5" /> },
  ]

  const stats = [
    { label: t('about.stats.students'), value: "5000+", icon: <Users className="w-8 h-8" /> },
    { label: t('about.stats.certificates'), value: "12+", icon: <Award className="w-8 h-8" /> },
    { label: t('about.stats.projects'), value: "50+", icon: <Trophy className="w-8 h-8" /> },
    { label: t('about.stats.experience'), value: "3+", icon: <Zap className="w-8 h-8" /> },
  ]

  const tabs = [
    { id: "about", label: t('about.tab.about'), icon: <Sparkles className="w-4 h-4" /> },
    { id: "certificates", label: t('about.tab.certificates'), icon: <GraduationCap className="w-4 h-4" /> },
    { id: "skills", label: t('about.tab.skills'), icon: <Code className="w-4 h-4" /> },
    { id: "contact", label: t('about.tab.contact'), icon: <Mail className="w-4 h-4" /> },
  ]

  const journey = [
    {
      year: "2022",
      title: language === 'ar' ? "بداية رحلة BTEC" : "Start of BTEC Journey",
      desc: language === 'ar' ? "التحقت ببرنامج BTEC في تكنولوجيا المعلومات" : "Enrolled in BTEC IT program"
    },
    {
      year: "2022",
      title: language === 'ar' ? "تعلم البرمجة" : "Learning Programming",
      desc: language === 'ar' ? "بدأت تعلم Java Oracle" : "Started learning Java Oracle"
    },
    {
      year: "2024",
      title: language === 'ar' ? "مشاريع متقدمة" : "Advanced Projects",
      desc: language === 'ar' ? "طورت عدة مشاريع وحصلت على شهادات متخصصة" : "Developed several projects and obtained specialized certificates"
    },
    {
      year: "2025",
      title: language === 'ar' ? "إنشاء AF BTEC" : "Creating AF BTEC",
      desc: language === 'ar' ? "أطلقت هذا الموقع لمساعدة الطلاب" : "Launched this website to help students"
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pt-36">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ bottom: "10%", right: "10%" }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl shadow-primary/30"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/ahmad-al-faqih-portrait.png"
                alt={language === 'ar' ? "أحمد الفقيه" : "Ahmad Al-Faqih"}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -right-4 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full p-4 shadow-xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GraduationCap className="w-8 h-8" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 mb-4"
          >
            Ahmad AL-faqih
            <br />
            أحمد الفقيه
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-slate-300 mb-8"
          >
            {t('about.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Badge className="text-base px-6 py-2 bg-primary hover:bg-primary/90">
              <Code className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              Teacher and Lecturer BTEC IT
            </Badge>
            <Badge className="text-base px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600">
              <Award className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              BTEC Level 5
            </Badge>
            <Badge className="text-base px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500">
              <Star className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              Distinction*
            </Badge>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="flex justify-center mb-3 text-primary">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 transition-all ${activeTab === tab.id
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Video Section - Coming Soon */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white relative z-10">
                    <Globe className="w-6 h-6 text-primary" />
                    {t('about.intro_video')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 flex flex-col items-center justify-center text-center p-8 relative">
                    {/* Background Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-10 animate-spin-slow"></div>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 relative"
                    >
                      <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                      <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </motion.div>

                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
                      {language === 'ar' ? 'قريباً جداً' : 'Coming Soon'}
                    </h3>

                    <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                      {language === 'ar'
                        ? 'نعمل حالياً على إعداد فيديو تعريفي احترافي ومميز. ترقبوا شيئاً رائعاً!'
                        : 'We are currently working on a professional and unique intro video. Stay tuned for something amazing!'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* About Text */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <CardTitle className="text-3xl text-white flex items-center gap-2">
                    <Target className="w-8 h-8 text-primary" />
                    {t('about.who_am_i')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-lg leading-relaxed text-slate-300">
                  <p>
                    {language === 'ar'
                      ? 'مرحباً! أنا أحمد الفقيه، متخصص في تكنولوجيا المعلومات ومطور مواقع شغوف بالتكنولوجيا والابتكار. أدرس حالياً في برنامج BTEC المستوى الخامس في تكنولوجيا المعلومات، وأسعى لتقديم الدعم للطلاب لكي يحصلوا على أفضل تجربة تعليمية ممكنة في مجال BTEC IT.'
                      : 'Hello! I\'m Ahmad Al-Faqih, an IT specialist and web developer passionate about technology and innovation. I\'m currently studying in the BTEC Level 5 IT program, and I strive to provide support to students to give them the best possible educational experience in BTEC IT.'}
                  </p>
                  <p>
                    {language === 'ar'
                      ? 'أنشأت هذا الموقع لمساعدة الطلاب في رحلتهم التعليمية، حيث يوفر الموقع أدوات مفيدة مثل حاسبة المعدل التراكمي، والموارد التعليمية، ودليل شامل للطلاب، بالإضافة إلى معلومات عن البرامج المطلوبة لكل مستوى دراسي.'
                      : 'I created this website to help students in their educational journey, where the site provides useful tools such as a GPA calculator, educational resources, and a comprehensive student guide, in addition to information about required programs for each study level.'}
                  </p>
                  <p>
                    {language === 'ar'
                      ? 'أؤمن بأن التعلم المستمر والمشاركة في المعرفة هما مفتاح النجاح في عالم التكنولوجيا المتطور. هدفي هو نشر العلم في الجيل الحالي وتطويره في كل المجالات وأن يخرج جيل متخصص في مجال تكنولوجيا المعلومات والبرمجة وأن يكونوا قادرين على المنافسة في سوق العمل.'
                      : 'I believe that continuous learning and knowledge sharing are the keys to success in the evolving world of technology. My goal is to spread knowledge in the current generation and develop it in all fields, and to produce a generation specialized in information technology and programming who are capable of competing in the job market.'}
                  </p>
                </CardContent>
              </Card>

              {/* Journey Timeline */}
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <CardTitle className="text-3xl text-white flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    {t('about.journey')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {journey.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg shadow-lg">
                          {item.year.slice(-2)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-white mb-1">{item.title}</h3>
                          <p className="text-slate-400">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "certificates" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {certificates.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`bg-gradient-to-br ${cert.color} text-white p-3 rounded-xl shadow-lg`}>
                          {cert.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base text-white mb-2">{cert.title}</CardTitle>
                          <CardDescription className="text-sm text-slate-400">
                            <div className="flex items-center gap-2 mb-1">
                              <Award className="w-3 h-3" />
                              {cert.issuer}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-3 h-3" />
                              {cert.date}
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {cert.grade}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-4xl text-white flex items-center gap-3">
                    <Zap className="w-10 h-10 text-primary" />
                    {t('about.technical_skills')}
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-400">
                    {t('about.skills_overview')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="text-primary">{skill.icon}</div>
                            <span className="font-medium text-lg text-white">{skill.name}</span>
                          </div>
                          <span className="text-primary font-bold text-lg">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{t('about.contact_me')}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {t('about.contact_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-white">butcahmad@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-white">+962 78 064 8871</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-white">{language === 'ar' ? 'الأردن، عمان' : 'Jordan, Amman'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{t('about.social_media')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className={`w-full ${language === 'ar' ? 'justify-end' : 'justify-start'} bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border-pink-500/30 text-white`}
                    asChild
                  >
                    <a href="https://instagram.com/af_btec" target="_blank" rel="noopener noreferrer">
                      <Instagram className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-pink-400`} />
                      {t('about.follow_instagram')}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full ${language === 'ar' ? 'justify-end' : 'justify-start'} bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border-green-500/30 text-white`}
                    asChild
                  >
                    <a href="https://wa.me/962780648871" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-green-400`} />
                      {t('about.whatsapp')}
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={`w-full ${language === 'ar' ? 'justify-end' : 'justify-start'} bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-500/30 text-white`}
                    asChild
                  >
                    <a href="https://t.me/+lgYAR-xlWOI3YjVk" target="_blank" rel="noopener noreferrer">
                      <Send className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-400`} />
                      {t('about.telegram')}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
