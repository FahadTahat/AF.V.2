"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Settings,
    Globe,
    Type,
    Contrast,
    Zap,
    BookOpen,
    Eye,
    Check,
    X,
    Cloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface UserSettings {
    fontSize: number
    highContrast: boolean
    reduceMotion: boolean
    readingMode: boolean
    dyslexiaFont: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
    fontSize: 100,
    highContrast: false,
    reduceMotion: false,
    readingMode: false,
    dyslexiaFont: false,
}

export function SettingsMenu() {
    const { language, setLanguage } = useLanguage()
    const { user } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [syncing, setSyncing] = useState(false)

    // Accessibility Settings
    const [fontSize, setFontSize] = useState(100)
    const [highContrast, setHighContrast] = useState(false)
    const [reduceMotion, setReduceMotion] = useState(false)
    const [readingMode, setReadingMode] = useState(false)
    const [dyslexiaFont, setDyslexiaFont] = useState(false)

    // Save settings to both localStorage and Firestore
    const saveSettings = useCallback(async (settings: UserSettings) => {
        // Always save to localStorage as fallback
        localStorage.setItem("fontSize", settings.fontSize.toString())
        localStorage.setItem("highContrast", settings.highContrast.toString())
        localStorage.setItem("reduceMotion", settings.reduceMotion.toString())
        localStorage.setItem("readingMode", settings.readingMode.toString())
        localStorage.setItem("dyslexiaFont", settings.dyslexiaFont.toString())

        // If user is logged in, sync to Firestore
        if (user) {
            try {
                setSyncing(true)
                const userRef = doc(db, 'users', user.uid)
                await setDoc(userRef, {
                    settings: {
                        fontSize: settings.fontSize,
                        highContrast: settings.highContrast,
                        reduceMotion: settings.reduceMotion,
                        readingMode: settings.readingMode,
                        dyslexiaFont: settings.dyslexiaFont,
                        updatedAt: new Date().toISOString(),
                    }
                }, { merge: true })
            } catch (error) {
                console.error("Error saving settings to Firestore:", error)
            } finally {
                setSyncing(false)
            }
        }
    }, [user])

    // Load settings from Firestore (priority) or localStorage (fallback)
    useEffect(() => {
        setMounted(true)

        const loadSettings = async () => {
            // First, load from localStorage for instant display
            const localSettings: UserSettings = {
                fontSize: Number(localStorage.getItem("fontSize")) || DEFAULT_SETTINGS.fontSize,
                highContrast: localStorage.getItem("highContrast") === "true",
                reduceMotion: localStorage.getItem("reduceMotion") === "true",
                readingMode: localStorage.getItem("readingMode") === "true",
                dyslexiaFont: localStorage.getItem("dyslexiaFont") === "true",
            }

            setFontSize(localSettings.fontSize)
            setHighContrast(localSettings.highContrast)
            setReduceMotion(localSettings.reduceMotion)
            setReadingMode(localSettings.readingMode)
            setDyslexiaFont(localSettings.dyslexiaFont)

            // If user is logged in, try to load from Firestore (takes priority)
            if (user) {
                try {
                    const userRef = doc(db, 'users', user.uid)
                    const docSnap = await getDoc(userRef)
                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        if (data.settings) {
                            const firebaseSettings = data.settings as UserSettings
                            setFontSize(firebaseSettings.fontSize ?? DEFAULT_SETTINGS.fontSize)
                            setHighContrast(firebaseSettings.highContrast ?? DEFAULT_SETTINGS.highContrast)
                            setReduceMotion(firebaseSettings.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion)
                            setReadingMode(firebaseSettings.readingMode ?? DEFAULT_SETTINGS.readingMode)
                            setDyslexiaFont(firebaseSettings.dyslexiaFont ?? DEFAULT_SETTINGS.dyslexiaFont)

                            // Also update localStorage to keep them in sync
                            localStorage.setItem("fontSize", (firebaseSettings.fontSize ?? DEFAULT_SETTINGS.fontSize).toString())
                            localStorage.setItem("highContrast", (firebaseSettings.highContrast ?? DEFAULT_SETTINGS.highContrast).toString())
                            localStorage.setItem("reduceMotion", (firebaseSettings.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion).toString())
                            localStorage.setItem("readingMode", (firebaseSettings.readingMode ?? DEFAULT_SETTINGS.readingMode).toString())
                            localStorage.setItem("dyslexiaFont", (firebaseSettings.dyslexiaFont ?? DEFAULT_SETTINGS.dyslexiaFont).toString())
                        }
                    }
                } catch (error) {
                    console.error("Error loading settings from Firestore:", error)
                    // Fallback: localStorage values already loaded above
                }
            }
        }

        loadSettings()
    }, [user])

    useEffect(() => {
        if (!mounted) return

        // Apply font size
        document.documentElement.style.fontSize = `${fontSize}%`

        // Apply high contrast
        if (highContrast) {
            document.documentElement.classList.add("high-contrast")
        } else {
            document.documentElement.classList.remove("high-contrast")
        }

        // Apply reduce motion
        if (reduceMotion) {
            document.documentElement.classList.add("reduce-motion")
        } else {
            document.documentElement.classList.remove("reduce-motion")
        }

        // Apply reading mode
        if (readingMode) {
            document.documentElement.classList.add("reading-mode")
        } else {
            document.documentElement.classList.remove("reading-mode")
        }

        // Apply dyslexia font
        if (dyslexiaFont) {
            document.documentElement.classList.add("dyslexia-font")
        } else {
            document.documentElement.classList.remove("dyslexia-font")
        }

        // Save settings (debounced save to Firestore)
        const timer = setTimeout(() => {
            saveSettings({ fontSize, highContrast, reduceMotion, readingMode, dyslexiaFont })
        }, 500)

        return () => clearTimeout(timer)
    }, [fontSize, highContrast, reduceMotion, readingMode, dyslexiaFont, mounted, saveSettings])

    const resetSettings = async () => {
        // Reset state
        setFontSize(DEFAULT_SETTINGS.fontSize)
        setHighContrast(DEFAULT_SETTINGS.highContrast)
        setReduceMotion(DEFAULT_SETTINGS.reduceMotion)
        setReadingMode(DEFAULT_SETTINGS.readingMode)
        setDyslexiaFont(DEFAULT_SETTINGS.dyslexiaFont)

        // Apply immediately to DOM
        document.documentElement.style.fontSize = `${DEFAULT_SETTINGS.fontSize}%`
        document.documentElement.classList.remove("high-contrast", "reduce-motion", "reading-mode", "dyslexia-font")

        // Clear localStorage
        localStorage.removeItem("fontSize")
        localStorage.removeItem("highContrast")
        localStorage.removeItem("reduceMotion")
        localStorage.removeItem("readingMode")
        localStorage.removeItem("dyslexiaFont")

        // Also reset in Firestore
        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid)
                await setDoc(userRef, {
                    settings: { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() }
                }, { merge: true })
            } catch (error) {
                console.error("Error resetting settings in Firestore:", error)
            }
        }
    }

    if (!mounted) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative group hover:bg-white/10"
                >
                    <Settings className="h-5 w-5 text-slate-300 group-hover:text-white transition-all group-hover:rotate-90 duration-300" />
                    <span className="sr-only">
                        {language === "ar" ? "الإعدادات" : "Settings"}
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={language === "ar" ? "start" : "end"}
                className="w-80 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white"
            >
                <div dir={language === "ar" ? "rtl" : "ltr"} className="py-1">
                    <DropdownMenuLabel className="text-base font-bold flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        {language === "ar" ? "الإعدادات وإمكانية الوصول" : "Settings & Accessibility"}
                        {/* Sync Status Indicator */}
                        {user && (
                            <span className="mr-auto">
                                {syncing ? (
                                    <Cloud className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                ) : (
                                    <Cloud className="w-3.5 h-3.5 text-green-400" />
                                )}
                            </span>
                        )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />

                    {/* Cloud Sync Notice */}
                    {user && (
                        <div className="px-3 py-1.5 mb-1">
                            <p className="text-[10px] text-green-400/70 flex items-center gap-1.5">
                                <Cloud className="w-3 h-3" />
                                {language === "ar" ? "إعداداتك متزامنة عبر جميع أجهزتك" : "Your settings are synced across devices"}
                            </p>
                        </div>
                    )}

                    {/* Language Settings */}
                    <DropdownMenuGroup>
                        <div className="px-2 py-2">
                            <Label className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-2 mb-2">
                                <Globe className="w-3 h-3" />
                                {language === "ar" ? "اللغة" : "Language"}
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={language === "ar" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLanguage("ar")}
                                    className={`w-full ${language === "ar"
                                        ? "bg-primary hover:bg-primary/90"
                                        : "bg-white/5 hover:bg-white/10 border-white/10"
                                        }`}
                                >
                                    {language === "ar" && <Check className="w-3 h-3 mr-1" />}
                                    العربية
                                </Button>
                                <Button
                                    variant={language === "en" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLanguage("en")}
                                    className={`w-full ${language === "en"
                                        ? "bg-primary hover:bg-primary/90"
                                        : "bg-white/5 hover:bg-white/10 border-white/10"
                                        }`}
                                >
                                    {language === "en" && <Check className="w-3 h-3 mr-1" />}
                                    English
                                </Button>
                            </div>
                        </div>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuSeparator className="bg-white/10" />

                    {/* Font Size */}
                    <div className="px-2 py-3">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-2">
                                <Type className="w-3 h-3" />
                                {language === "ar" ? "حجم الخط" : "Font Size"}
                            </Label>
                            <span className="text-xs text-primary font-bold">{fontSize}%</span>
                        </div>
                        <Slider
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                            min={75}
                            max={150}
                            step={5}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>{language === "ar" ? "صغير" : "Small"}</span>
                            <span>{language === "ar" ? "عادي" : "Normal"}</span>
                            <span>{language === "ar" ? "كبير" : "Large"}</span>
                        </div>
                    </div>

                    <DropdownMenuSeparator className="bg-white/10" />

                    {/* Accessibility Options */}
                    <DropdownMenuGroup>
                        <div className="px-2 py-2 space-y-3">
                            <Label className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-2 mb-3">
                                <Eye className="w-3 h-3" />
                                {language === "ar" ? "إمكانية الوصول" : "Accessibility"}
                            </Label>

                            {/* High Contrast */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Contrast className="w-4 h-4 text-slate-400" />
                                    <Label className="text-sm cursor-pointer">
                                        {language === "ar" ? "تباين عالي" : "High Contrast"}
                                    </Label>
                                </div>
                                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                            </div>

                            {/* Reduce Motion */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-slate-400" />
                                    <Label className="text-sm cursor-pointer">
                                        {language === "ar" ? "تقليل الحركة" : "Reduce Motion"}
                                    </Label>
                                </div>
                                <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
                            </div>

                            {/* Reading Mode */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-slate-400" />
                                    <Label className="text-sm cursor-pointer">
                                        {language === "ar" ? "وضع القراءة" : "Reading Mode"}
                                    </Label>
                                </div>
                                <Switch checked={readingMode} onCheckedChange={setReadingMode} />
                            </div>

                            {/* Dyslexia Font */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Type className="w-4 h-4 text-slate-400" />
                                    <Label className="text-sm cursor-pointer">
                                        {language === "ar" ? "خط عسر القراءة" : "Dyslexia Font"}
                                    </Label>
                                </div>
                                <Switch checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
                            </div>
                        </div>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-white/10" />

                    {/* Reset Button */}
                    <div className="px-2 py-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 hover:text-red-300"
                            onClick={resetSettings}
                        >
                            <X className="w-3 h-3 mr-2" />
                            {language === "ar" ? "إعادة تعيين الإعدادات" : "Reset Settings"}
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
