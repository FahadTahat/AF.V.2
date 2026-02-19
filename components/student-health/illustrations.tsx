import React from "react";

export function PostureIllustration({ color = "#10b981" }: { color?: string }) {
    return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
            {/* Desk */}
            <rect x="20" y="95" width="160" height="6" rx="3" fill={color} opacity="0.3" />
            <rect x="30" y="101" width="8" height="40" rx="2" fill={color} opacity="0.2" />
            <rect x="162" y="101" width="8" height="40" rx="2" fill={color} opacity="0.2" />
            {/* Monitor */}
            <rect x="75" y="55" width="50" height="35" rx="4" fill={color} opacity="0.25" />
            <rect x="80" y="60" width="40" height="25" rx="2" fill={color} opacity="0.15" />
            <rect x="95" y="90" width="10" height="6" rx="1" fill={color} opacity="0.2" />
            {/* Chair */}
            <rect x="110" y="105" width="40" height="6" rx="3" fill={color} opacity="0.35" />
            <rect x="145" y="85" width="6" height="26" rx="3" fill={color} opacity="0.3" />
            <rect x="118" y="111" width="6" height="25" rx="2" fill={color} opacity="0.2" />
            <rect x="138" y="111" width="6" height="25" rx="2" fill={color} opacity="0.2" />
            {/* Person - correct posture */}
            <circle cx="130" cy="55" r="12" fill={color} opacity="0.4" />
            <line x1="130" y1="67" x2="130" y2="100" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
            <line x1="130" y1="78" x2="110" y2="85" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <line x1="130" y1="100" x2="120" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            {/* Check mark */}
            <circle cx="165" cy="30" r="14" fill="#22c55e" opacity="0.2" />
            <path d="M158 30l4 4 8-8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Angle guide line */}
            <path d="M130 67 Q135 82 130 100" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            <text x="30" y="150" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">✓ وضعية صحيحة</text>
        </svg>
    );
}

export function StretchIllustration({ color = "#f59e0b" }: { color?: string }) {
    return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
            {/* Person stretching */}
            <circle cx="100" cy="35" r="14" fill={color} opacity="0.4" />
            <line x1="100" y1="49" x2="100" y2="95" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
            {/* Arms up stretching */}
            <line x1="100" y1="60" x2="70" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <line x1="100" y1="60" x2="130" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            {/* Legs */}
            <line x1="100" y1="95" x2="80" y2="130" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <line x1="100" y1="95" x2="120" y2="130" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            {/* Motion lines */}
            <path d="M60 32 L55 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            <path d="M58 42 L52 42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            <path d="M140 32 L145 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            <path d="M142 42 L148 42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            {/* Timer icon */}
            <circle cx="165" cy="85" r="18" stroke={color} strokeWidth="2" opacity="0.25" fill="none" />
            <line x1="165" y1="75" x2="165" y2="85" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
            <line x1="165" y1="85" x2="173" y2="90" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
            <text x="150" y="115" fill={color} opacity="0.4" fontSize="9" fontFamily="sans-serif" textAnchor="middle">50 دقيقة</text>
            {/* Floor */}
            <line x1="60" y1="135" x2="140" y2="135" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
            <text x="40" y="152" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">تمارين إطالة</text>
        </svg>
    );
}

export function Rule202020Illustration({ color = "#f59e0b" }: { color?: string }) {
    return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
            {/* Eye */}
            <ellipse cx="50" cy="65" rx="22" ry="14" stroke={color} strokeWidth="2" opacity="0.4" fill="none" />
            <circle cx="50" cy="65" r="7" fill={color} opacity="0.3" />
            <circle cx="50" cy="65" r="3" fill={color} opacity="0.5" />
            {/* Arrow */}
            <line x1="78" y1="65" x2="130" y2="65" stroke={color} strokeWidth="2" strokeDasharray="5 3" opacity="0.3" />
            <polygon points="130,60 140,65 130,70" fill={color} opacity="0.3" />
            {/* Distance object (window/tree) */}
            <rect x="150" y="45" width="30" height="40" rx="4" fill={color} opacity="0.15" />
            <circle cx="165" cy="55" r="8" fill="#22c55e" opacity="0.25" />
            <line x1="165" y1="63" x2="165" y2="78" stroke="#22c55e" strokeWidth="2" opacity="0.2" />
            {/* Three 20s */}
            <g opacity="0.6">
                <rect x="15" y="100" width="50" height="28" rx="8" fill={color} opacity="0.15" />
                <text x="40" y="118" fill={color} fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20 دقيقة</text>
            </g>
            <g opacity="0.6">
                <rect x="75" y="100" width="50" height="28" rx="8" fill={color} opacity="0.15" />
                <text x="100" y="118" fill={color} fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20 قدم</text>
            </g>
            <g opacity="0.6">
                <rect x="135" y="100" width="50" height="28" rx="8" fill={color} opacity="0.15" />
                <text x="160" y="118" fill={color} fontSize="11" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20 ثانية</text>
            </g>
            <text x="30" y="150" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">قاعدة 20-20-20</text>
        </svg>
    );
}

export function ErgonomicChairIllustration({ color = "#10b981" }: { color?: string }) {
    return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
            {/* Chair back */}
            <path d="M110 25 Q108 60 110 90 L140 90 Q142 60 140 25 Z" fill={color} opacity="0.2" rx="5" />
            <path d="M112 30 Q111 58 112 85 L138 85 Q139 58 138 30 Z" fill={color} opacity="0.1" />
            {/* Lumbar support highlight */}
            <ellipse cx="125" cy="65" rx="12" ry="6" fill={color} opacity="0.3" />
            <text x="155" y="68" fill={color} opacity="0.5" fontSize="8" fontFamily="sans-serif">دعم أسفل الظهر</text>
            {/* Seat */}
            <rect x="100" y="90" width="50" height="8" rx="4" fill={color} opacity="0.3" />
            {/* Armrest */}
            <rect x="95" y="75" width="6" height="20" rx="3" fill={color} opacity="0.2" />
            <rect x="149" y="75" width="6" height="20" rx="3" fill={color} opacity="0.2" />
            <rect x="88" y="73" width="14" height="4" rx="2" fill={color} opacity="0.25" />
            <rect x="148" y="73" width="14" height="4" rx="2" fill={color} opacity="0.25" />
            {/* Base */}
            <line x1="125" y1="98" x2="125" y2="120" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.25" />
            <line x1="105" y1="125" x2="145" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
            {/* Wheels */}
            <circle cx="108" cy="128" r="4" fill={color} opacity="0.2" />
            <circle cx="142" cy="128" r="4" fill={color} opacity="0.2" />
            <circle cx="125" cy="130" r="4" fill={color} opacity="0.2" />
            {/* Adjustment arrows */}
            <line x1="80" y1="95" x2="80" y2="75" stroke={color} strokeWidth="1.5" opacity="0.3" />
            <polygon points="76,78 80,70 84,78" fill={color} opacity="0.3" />
            <line x1="80" y1="100" x2="80" y2="120" stroke={color} strokeWidth="1.5" opacity="0.3" />
            <polygon points="76,117 80,125 84,117" fill={color} opacity="0.3" />
            <text x="60" y="150" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif">كرسي إرجونومي</text>
        </svg>
    );
}

export function WalkingIllustration({ color = "#f59e0b" }: { color?: string }) {
    return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
            {/* Person walking */}
            <circle cx="90" cy="30" r="12" fill={color} opacity="0.4" />
            <line x1="90" y1="42" x2="90" y2="80" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
            {/* Arms swinging */}
            <line x1="90" y1="55" x2="72" y2="70" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <line x1="90" y1="55" x2="108" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            {/* Legs walking */}
            <line x1="90" y1="80" x2="72" y2="110" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <line x1="90" y1="80" x2="108" y2="110" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            {/* Feet */}
            <line x1="72" y1="110" x2="65" y2="112" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
            <line x1="108" y1="110" x2="115" y2="112" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
            {/* Path/trail */}
            <path d="M40 115 Q80 108 120 115 Q160 122 180 115" stroke={color} strokeWidth="2" strokeDasharray="6 4" opacity="0.2" fill="none" />
            {/* Trees */}
            <circle cx="155" cy="75" r="12" fill="#22c55e" opacity="0.15" />
            <line x1="155" y1="87" x2="155" y2="110" stroke="#22c55e" strokeWidth="3" opacity="0.15" />
            <circle cx="175" cy="82" r="9" fill="#22c55e" opacity="0.12" />
            <line x1="175" y1="91" x2="175" y2="110" stroke="#22c55e" strokeWidth="2" opacity="0.12" />
            {/* 30 min badge */}
            <rect x="20" y="120" width="60" height="24" rx="12" fill={color} opacity="0.15" />
            <text x="50" y="136" fill={color} opacity="0.5" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">30 دقيقة يومياً</text>
        </svg>
    );
}

export function CarpalTunnelIllustration({ color = "#f59e0b" }: { color?: string }) {
    return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-auto">
            {/* Hand outline */}
            <path d="M80 110 L80 60 Q80 50 88 50 Q96 50 96 60 L96 45 Q96 35 104 35 Q112 35 112 45 L112 40 Q112 30 120 30 Q128 30 128 40 L128 48 Q128 38 136 38 Q144 38 144 48 L144 85 Q144 110 125 120 L80 120 Z"
                stroke={color} strokeWidth="2" opacity="0.35" fill={color} fillOpacity="0.1" />
            {/* Wrist area highlight */}
            <rect x="78" y="110" width="52" height="15" rx="4" fill="#ef4444" opacity="0.15" />
            <line x1="85" y1="117" x2="123" y2="117" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
            {/* Pain indicators */}
            <circle cx="105" cy="117" r="3" fill="#ef4444" opacity="0.4" />
            <path d="M95 108 L92 104" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            <path d="M115 108 L118 104" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            {/* Keyboard below */}
            <rect x="55" y="135" width="90" height="15" rx="4" fill={color} opacity="0.15" />
            <rect x="60" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
            <rect x="70" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
            <rect x="80" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
            <rect x="90" y="138" width="20" height="4" rx="1" fill={color} opacity="0.15" />
            <rect x="114" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
            <rect x="124" y="138" width="6" height="4" rx="1" fill={color} opacity="0.15" />
            {/* Arrow showing correct wrist position */}
            <path d="M160 95 Q155 110 160 125" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.4" />
            <polygon points="157,122 160,130 163,122" fill="#22c55e" opacity="0.4" />
            <text x="162" y="88" fill="#22c55e" opacity="0.5" fontSize="8" fontFamily="sans-serif">وضعية</text>
            <text x="162" y="98" fill="#22c55e" opacity="0.5" fontSize="8" fontFamily="sans-serif">صحيحة</text>
            <text x="50" y="155" fill={color} opacity="0" fontSize="1" fontFamily="sans-serif">.</text>
        </svg>
    );
}
