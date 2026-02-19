"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function InstallPWAButton() {
    const [supportsPWA, setSupportsPWA] = useState(false)
    const [promptInstall, setPromptInstall] = useState<any>(null)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault()
            setSupportsPWA(true)
            setPromptInstall(e)
        }

        window.addEventListener("beforeinstallprompt", handler)

        // Check if iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = (window.navigator as any).standalone; // Check if already installed on iOS

        if (isIosDevice && !isStandalone) {
            setIsIOS(true)
            setSupportsPWA(true)
        }

        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstallClick = async () => {
        if (isIOS) {
            toast("لتثبيت التطبيق على آيفون: اضغط على زر المشاركة (Share) بالأسفل ثم اختر 'Add to Home Screen'", {
                duration: 5000,
                icon: <Share className="w-5 h-5" />
            })
            return
        }

        if (!promptInstall) {
            return
        }

        promptInstall.prompt()
        const { outcome } = await promptInstall.userChoice
        if (outcome === 'accepted') {
            setSupportsPWA(false)
        }
    }

    if (!supportsPWA) {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <Button
                    onClick={handleInstallClick}
                    size="lg"
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2 backdrop-blur-sm shadow-xl"
                >
                    <Download className="w-5 h-5 animate-bounce" />
                    تثبيت التطبيق
                </Button>
            </motion.div>
        </AnimatePresence>
    )
}
