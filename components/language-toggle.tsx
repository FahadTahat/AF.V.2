"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/LanguageContext"

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Globe className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-200" />
                    <span className="sr-only">تغيير اللغة</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-800">
                <DropdownMenuItem onClick={() => setLanguage("ar")} className="justify-between cursor-pointer">
                    <span className="font-medium">العربية</span>
                    {language === "ar" && <span className="text-primary text-xs">نشط</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="justify-between cursor-pointer">
                    <span className="font-medium">English</span>
                    {language === "en" && <span className="text-primary text-xs">Active</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
