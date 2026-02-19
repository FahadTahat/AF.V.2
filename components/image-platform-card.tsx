
"use client"

import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Maximize2, Sparkles, User, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageCardProps {
    id: string
    url: string
    title: string
    source: string
    photographer?: string
    isGenerated?: boolean
    onClick: (image: any) => void
    aspectRatio?: "square" | "wide" | "tall"
}

const ImageCard = memo(({ id, url, title, source, photographer, isGenerated, onClick, aspectRatio = "square" }: ImageCardProps) => {

    // Helper for direct download
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement("a");
        link.href = url;
        link.download = `af-btec-image-${id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            layoutId={`image-${id}`}
            layout="position"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onClick({ id, url, title, source, photographer })}
            className={cn(
                "group relative rounded-2xl overflow-hidden cursor-zoom-in bg-slate-900 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform-gpu",
                aspectRatio === "wide" ? "aspect-video" : aspectRatio === "tall" ? "aspect-[2/3]" : "aspect-square"
            )}
        >
            {/* Image Layer */}
            <div className="absolute inset-0 bg-slate-800 animate-pulse" /> {/* Loading placeholder behind */}
            <img
                src={url}
                alt={title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Badge (AI vs Stock) */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
                {isGenerated ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-200 text-[10px] font-medium shadow-sm">
                        <Sparkles size={10} className="text-purple-400" />
                        <span>AI Generated</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-200 text-[10px] font-medium shadow-sm">
                        <User size={10} className="text-blue-400" />
                        <span>Stock Photo</span>
                    </div>
                )}
            </div>

            {/* Hover Actions (Center) */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                <button
                    onClick={handleDownload}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
                    title="Download"
                >
                    <Download size={20} />
                </button>
                <button
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
                    title="View Fullscreen"
                >
                    <Maximize2 size={20} />
                </button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white text-sm font-bold line-clamp-1 mb-1 drop-shadow-md">{title}</h3>
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 opacity-80">
                        {isGenerated ? "High Resolution" : (photographer || source)}
                    </span>
                    {isGenerated && <span className="font-mono opacity-50 text-[9px]">PROMPT-v1</span>}
                </div>
            </div>
        </motion.div>
    )
})

ImageCard.displayName = "ImageCard"

export { ImageCard }
