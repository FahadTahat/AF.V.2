"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    // Spring only for the outer ring (creates the "follow" lag effect)
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
    const ringX = useSpring(cursorX, springConfig)
    const ringY = useSpring(cursorY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            // Update raw values directly
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)

            // Check if cursor is over clickable element
            const target = e.target as HTMLElement
            const isClickable = target.closest('a') ||
                target.closest('button') ||
                target.closest('input') ||
                target.closest('.cursor-pointer') ||
                window.getComputedStyle(target).cursor === 'pointer'

            setIsHovered(!!isClickable)
        }

        window.addEventListener("mousemove", moveCursor)
        return () => window.removeEventListener("mousemove", moveCursor)
    }, [cursorX, cursorY])

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 2147483647,
                overflow: 'hidden'
            }}
        >
            {/* Main Cursor Dot - INSTANT MOVEMENT */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#22d3ee', // cyan-400
                    boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)',
                    border: '1px solid white',
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            />

            {/* Outer Ring - SMOOTH FOLLOW */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    boxSizing: 'border-box',
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    opacity: isHovered ? 1 : 0.5,
                    borderColor: isHovered ? "#ec4899" : "rgba(255, 255, 255, 0.5)",
                    backgroundColor: isHovered ? "rgba(236, 72, 153, 0.1)" : "transparent",
                    borderWidth: isHovered ? "2px" : "1px"
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }}
            />
        </div>
    )
}
