"use client"

import Link from "next/link"
import { Instagram, Phone, Mail, MessageCircle, Heart, Send, Globe, Github, Linkedin, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/LanguageContext"

export function Footer() {
  const { t, language } = useLanguage()

  const quickLinks = [
    { label: t('nav.calculator'), href: "/calculator" },
    { label: t('nav.resources'), href: "/resources" },
    { label: t('nav.guide'), href: "/guide" },
    { label: t('tool.faq'), href: "/faq" },
    { label: language === 'ar' ? 'تواصل معنا' : 'Contact Us', href: "/contact" },
  ]

  return (
    <footer className="relative border-t border-white/5 bg-[#0B0F19] overflow-hidden print:hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse-slower"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
      </div>

      <div className="container relative z-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-[1px] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-shadow duration-500">
                  <div className="w-full h-full rounded-2xl bg-[#0B0F19] flex items-center justify-center">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">AF</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors">AF BTEC</span>
                  <span className="text-xs text-slate-400 font-medium tracking-wider">EDUCATION PORTAL</span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
              {language === 'ar'
                ? 'موقع تعليمي رائد مخصص لطلاب BTEC، نجمع بين التكنولوجيا والتعليم لنقدم تجربة فريدة وشاملة تمهد طريقك نحو النجاح والتميز.'
                : 'A leading educational platform dedicated to BTEC students, combining technology and education to provide a unique and comprehensive experience that paves your way to success and excellence.'}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "https://instagram.com/af_btec", color: "hover:text-pink-500 hover:bg-pink-500/10" },
                { icon: MessageCircle, href: "https://wa.me/962780648871", color: "hover:text-green-500 hover:bg-green-500/10" },
                { icon: Send, href: "https://t.me/+lgYAR-xlWOI3YjVk", color: "hover:text-sky-500 hover:bg-sky-500/10" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:border-transparent ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
              {t('footer.quick_links')}
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
              {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-purple-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+962780648871" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium mb-0.5">
                      {language === 'ar' ? 'اتصل بنا' : 'Call Us'}
                    </span>
                    <span className="text-slate-300 group-hover:text-white transition-colors dir-ltr text-sm font-semibold">+962 78 064 8871</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:butcahmad@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium mb-0.5">
                      {language === 'ar' ? 'ارسل بريد الكتروني' : 'Send Email'}
                    </span>
                    <span className="text-slate-300 group-hover:text-white transition-colors text-sm font-semibold">butcahmad@gmail.com</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Info & Newsletter */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-2 text-base flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-400" />
                {language === 'ar' ? 'عن المطور' : 'About Developer'}
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {language === 'ar'
                  ? <>تم تطوير هذا الموقع بشغف بواسطة <span className="text-white font-bold">أحمد الفقيه</span>. متخصص في بناء تجارب ويب حديثة ومبتكرة.</>
                  : <>This website was passionately developed by <span className="text-white font-bold">Ahmad Al-Faqeih</span>. Specialized in building modern and innovative web experiences.</>}
              </p>
              <div className="flex gap-2">
                <Link href="#" className="flex-1 w-full">
                  <Button size="sm" variant="outline" className="w-full text-xs h-8 border-white/10 hover:bg-white/5 hover:text-white text-slate-400 bg-transparent">
                    {language === 'ar' ? 'تواصل معي' : 'Contact Me'}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Input
                placeholder={language === 'ar' ? 'اشترك في النشرة البريدية' : 'Subscribe to newsletter'}
                className={`bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl ${language === 'ar' ? 'pr-10' : 'pl-10'} focus-visible:ring-primary/50`}
              />
              <Button size="icon" className={`absolute ${language === 'ar' ? 'left-1' : 'right-1'} top-1 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-white`}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            © 2026 <span className="text-white font-semibold">AF BTEC</span>. {t('footer.rights')}
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
              {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400">
              <span>{language === 'ar' ? 'صنع بـ' : 'Made with'}</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span>{language === 'ar' ? 'في الأردن' : 'in Jordan'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
