"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from '@/lib/translations'

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: keyof typeof translations['ar']) => string
    dir: 'rtl' | 'ltr'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('ar')

    // Initialize language from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
            setLanguageState(savedLang)
            updateDocumentDir(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('language', lang)
        updateDocumentDir(lang)
    }

    const updateDocumentDir = (lang: Language) => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.dir = dir
        document.documentElement.lang = lang
    }

    const t = (key: keyof typeof translations['ar']) => {
        return translations[language][key] || key
    }

    const dir = language === 'ar' ? 'rtl' : 'ltr'

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
