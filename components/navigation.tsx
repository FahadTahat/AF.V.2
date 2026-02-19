"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Calculator, BookOpen, Users, HelpCircle, Settings, Menu, UserCircle, MessageSquare, Home, Shield, Image, Sparkles, Wrench, ChevronDown, Map, ClipboardList, Quote, Headphones, Briefcase, Bot, LogOut, User, MessageCircle, Heart, Moon } from "lucide-react"
import { SettingsMenu } from "./settings-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAchievements } from "@/contexts/AchievementContext"

export function Navigation() {
  const pathname = usePathname()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const { incrementProgress } = useAchievements()
  const [scrolled, setScrolled] = useState(false)
  const { t, language } = useLanguage()

  // Achievement Triggers
  useEffect(() => {
    // Explorer & Time Based Achievements
    incrementProgress('explorer')

    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()

    // Early Bird: 5 AM - 8 AM
    if (hour >= 5 && hour < 8) incrementProgress('early_bird')

    // Night Owl: 12 AM - 4 AM
    if (hour >= 0 && hour < 4) incrementProgress('night_owl')

    // Weekend Warrior: Friday (5) or Saturday (6)
    if (day === 5 || day === 6) incrementProgress('weekend_warrior')

    // Daily Streak Logic (simplified for now, full logic would require saving last login date)
    // For now, let's trigger daily_streak_3 if they visit 3 different pages in a session? 
    // No, better to stick to simple visit count or implement proper date check in Context.
    // We already have daily_streak logic in achievements-data but implementing the "consecutive days" check is complex without backend logic.
    // For this MVP, we can treat "Daily Learner" as "Visit 3 times" or rely on a simple local storage timestamp check in Context if we wanted.
    // Let's keep it simple here.

  }, [pathname])

  const navigationItems = [
    {
      title: "رمضان",
      href: "/ramadan",
      icon: Moon,
      description: "فعاليات وأجواء رمضانية",
    },
    {
      title: t('nav.home'),
      href: "/",
      icon: Home,
      description: t('desc.home'),
    },
    {
      title: t('nav.resources'),
      href: "/resources",
      icon: BookOpen,
      description: t('desc.resources'),
    },
    {
      title: t('nav.verbs'),
      href: "/tools/btec-verbs",
      icon: BookOpen,
      description: t('desc.verbs'),
    },
    {
      title: t('nav.calculator'),
      href: "/calculator",
      icon: Calculator,
      description: t('desc.calculator'),
    },
    {
      title: t('nav.community'),
      href: "/chat",
      icon: MessageCircle,
      description: t('desc.community'),
    },
    {
      title: t('nav.roadmap'),
      href: "/dubai-roadmap",
      icon: Map,
      description: t('desc.roadmap'),
    },
    {
      title: t('nav.guide'),
      href: "/guide",
      icon: Users,
      description: t('desc.guide'),
    },
    {
      title: t('nav.ai_chat'),
      href: "/tools/ai-chat",
      icon: Bot,
      description: t('desc.ai_chat'),
    },
    {
      title: t('nav.about'),
      href: "/about",
      icon: UserCircle,
      description: t('desc.about'),
    },
  ]

  const toolsItems = [
    {
      title: t('tool.project_manager'),
      href: "/tools/assignments",
      icon: ClipboardList,
      description: t('tool.project_manager'),
    },
    {
      title: t('nav.ai_chat'),
      href: "/tools/ai-chat",
      icon: Bot,
      description: t('desc.ai_chat'),
    },
    {
      title: t('tool.focus_zone'),
      href: "/tools/focus",
      icon: Headphones,
      description: t('tool.focus_zone'),
    },
    {
      title: t('tool.ai_checker'),
      href: "/tools/ai-checker",
      icon: Shield,
      description: t('tool.ai_checker'),
    },
    {
      title: t('tool.interview_sim'),
      href: "/tools/interview",
      icon: Briefcase,
      description: t('tool.interview_sim'),
    },
    {
      title: t('tool.smart_future'),
      href: "/tools/ni",
      icon: Sparkles,
      description: t('tool.smart_future'),
    },
    {
      title: t('tool.image_platform'),
      href: "/tools/image-platform",
      icon: Image,
      description: t('tool.image_platform'),
    },
    {
      title: t('tool.student_health'),
      href: "/tools/student-health",
      icon: Heart,
      description: t('desc.student_health'),
    },
    {
      title: t('tool.messages'),
      href: "/messages",
      icon: MessageSquare,
      description: t('tool.messages'),
    },
    {
      title: t('tool.faq'),
      href: "/faq",
      icon: HelpCircle,
      description: t('tool.faq'),
    },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-4 py-4",
        scrolled ? "pt-2" : "pt-6"
      )}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className={cn(
        "container mx-auto rounded-full transition-all duration-500 border border-transparent",
        scrolled
          ? "bg-slate-900/80 backdrop-blur-3xl border-white/10 shadow-2xl shadow-black/20"
          : "bg-transparent"
      )}>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 space-x-reverse group relative z-50 mr-4">
            <div className="relative h-12 w-12 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <NextImage
                src="/logo.png"
                alt="AF Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
              AF <span className="text-primary">BTEC</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center p-1.5 rounded-full bg-slate-950/20 backdrop-blur-2xl border border-white/5 relative overflow-hidden">
              {/* Liquid Background for Container */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />

              {navigationItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2",
                      isActive ? "text-white" : "text-slate-400 hover:text-white"
                    )}
                    onMouseEnter={() => setHoveredPath(item.href)}
                    onMouseLeave={() => setHoveredPath(null)}
                  >
                    {/* Active Indicator (Liquid/Water Effect) */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-liquid-bg"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] z-0"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          mass: 1
                        }}
                      />
                    )}

                    {/* Hover Effect (Subtle Water Ripple) */}
                    {hoveredPath === item.href && !isActive && (
                      <motion.div
                        layoutId="nav-hover-bg"
                        className="absolute inset-0 bg-white/5 rounded-full z-0"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-1.5">
                      <item.icon className={cn("w-4 h-4 transition-transform duration-300", isActive && "scale-110", hoveredPath === item.href && !isActive && "scale-110")} />
                      <span>{item.title}</span>
                    </span>
                  </Link>
                )
              })}

              {/* Tools Dropdown Trigger */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 outline-none",
                      (pathname.startsWith("/tools") && pathname !== "/tools/btec-verbs") ? "text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {(pathname.startsWith("/tools") && pathname !== "/tools/btec-verbs") && (
                      <motion.div
                        layoutId="nav-liquid-bg"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" />
                      <span>{t('nav.tools')}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none rounded-2xl" />
                  {toolsItems.map((tool) => (
                    <DropdownMenuItem key={tool.href} asChild className="p-0 mb-1 last:mb-0 focus:bg-transparent">
                      <Link
                        href={tool.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all w-full cursor-pointer group relative overflow-hidden"
                      >
                        <div className="relative z-10 p-2 rounded-lg bg-white/5 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                          <tool.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-0.5 relative z-10">
                          <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{tool.title}</span>
                          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors line-clamp-1">{tool.description}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-50">
            <div className="hidden lg:flex items-center gap-2">
              <SettingsMenu />
            </div>

            {/* User Account Button (Enhanced Cloud Design) */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden lg:flex items-center gap-3 pl-2 pr-4 py-1.5 h-auto rounded-full bg-slate-800/50 hover:bg-slate-800/80 border border-white/5 backdrop-blur-md group transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-500/30"
                  >
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-purple-500/20 group-hover:border-purple-500 transition-colors shadow-lg">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs font-bold">
                          {user.displayName ? getInitials(user.displayName) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online Status Indicator */}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>

                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors leading-none">
                        {user.displayName?.split(' ')[0] || t('nav.profile')}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors">
                        {t('nav.active_student')}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 bg-slate-900/90 backdrop-blur-2xl border-white/10 rounded-2xl shadow-xl animate-in slide-in-from-top-2 p-2">
                  <div className="px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-sm font-bold text-white mb-0.5">{user.displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>

                  <DropdownMenuItem asChild className="p-0 mb-1 focus:bg-transparent">
                    <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer">
                      <div className="p-2 rounded-md bg-blue-500/10 text-blue-400">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10 my-1" />

                  <DropdownMenuItem onClick={logout} className="p-0 focus:bg-transparent">
                    <button className="flex w-full items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-colors cursor-pointer">
                      <div className="p-2 rounded-md bg-red-500/10 text-red-500">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{t('nav.logout')}</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-3 pl-1 bg-slate-950/30 p-1 rounded-full border border-white/5 backdrop-blur-md">
                <Button variant="ghost" asChild className="rounded-full text-slate-300 hover:text-white hover:bg-white/5 px-4">
                  <Link href="/auth/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 px-5">
                  <Link href="/auth/signup">{t('nav.signup')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden rounded-full w-10 h-10 hover:bg-white/10 text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{language === 'ar' ? 'فتح القائمة' : 'Open Menu'}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-white/10 bg-slate-950/95 backdrop-blur-2xl">
                <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <span className="font-bold text-lg text-white">{t('nav.menu')}</span>
                    <SettingsMenu />
                  </div>

                  <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <SheetClose key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                              isActive
                                ? "bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/20"
                                : "hover:bg-white/5 text-slate-400 hover:text-white"
                            )}
                          >
                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-50" />}
                            <div className={cn(
                              "p-2 rounded-lg transition-colors relative z-10",
                              isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white/5 group-hover:bg-white/10"
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col relative z-10">
                              <span className="text-sm">{item.title}</span>
                              <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors line-clamp-1 font-normal">{item.description}</span>
                            </div>
                            {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
                          </Link>
                        </SheetClose>
                      )
                    })}

                    <div className="my-4 border-t border-white/5" />

                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="w-3 h-3" />
                      {t('nav.tools')}
                    </div>
                    {toolsItems.map((tool) => {
                      const isActive = pathname === tool.href
                      return (
                        <SheetClose key={tool.href} asChild>
                          <Link
                            href={tool.href}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                              isActive
                                ? "bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/20"
                                : "hover:bg-white/5 text-slate-400 hover:text-white"
                            )}
                          >
                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-50" />}
                            <div className={cn(
                              "p-2 rounded-lg transition-colors relative z-10",
                              isActive ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "bg-white/5 group-hover:bg-white/10"
                            )}>
                              <tool.icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col relative z-10">
                              <span className="text-sm">{tool.title}</span>
                              <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors line-clamp-1 font-normal">{tool.description}</span>
                            </div>
                          </Link>
                        </SheetClose>
                      )
                    })}
                  </div>

                  {user && (
                    <div className="p-4 border-t border-white/5 bg-white/5">
                      <SheetClose asChild>
                        <Button
                          onClick={logout}
                          variant="ghost"
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('nav.logout')}
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
