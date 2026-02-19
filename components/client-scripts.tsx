"use client"

import { useEffect } from "react"
import Script from "next/script"

export function ClientScripts() {
    useEffect(() => {
        // Particles.js loading logic is handled by the Script component below
    }, [])

    return (
        <>
            <div id="particles-js"></div>
            <Script
                src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    if (typeof particlesJS !== "undefined") {
                        fetch("/particles-config.json")
                            .then((res) => res.json())
                            // @ts-ignore
                            .then((config) => particlesJS("particles-js", config))
                            .catch((err) => console.error("Failed to load particles config:", err))
                    }
                }}
            />
        </>
    )
}
