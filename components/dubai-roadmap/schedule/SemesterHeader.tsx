interface SemesterHeaderProps {
    number: number;
    name: string;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    isFirst?: boolean;
    prevColor?: string;
}

export default function SemesterHeader({ number, name, color, gradientFrom, gradientTo, isFirst, prevColor }: SemesterHeaderProps) {
    const incomingColor = prevColor || gradientFrom;
    return (
        <div className="flex flex-col items-center mb-6">
            {/* Top incoming connector from previous section */}
            {!isFirst &&
                <svg width="140" height="50" viewBox="-70 0 140 50" className="overflow-visible" style={{ filter: `drop-shadow(0 0 6px ${incomingColor}40)` }}>
                    <path d="M 0 0 L 0 15 L 20 30 L 0 50" stroke={incomingColor} strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.2" />
                    <path d="M 0 0 L 0 15 L 20 30 L 0 50" stroke={incomingColor} strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.6" />
                    <path d="M 0 0 L 0 15 L 20 30 L 0 50" stroke={incomingColor} strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.9" strokeDasharray="8 16">
                        <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.2s" repeatCount="indefinite" />
                    </path>
                    <circle cx="0" cy="0" r="3" fill={incomingColor} opacity="0.7" className="!w-[30px] !h-5" />
                    <circle cx="0" cy="15" r="2" fill={incomingColor} opacity="0.5" />
                    <circle cx="20" cy="30" r="2" fill={incomingColor} opacity="0.5" />
                    <circle cx="0" cy="50" r="3" fill={incomingColor} opacity="0.7" />
                    <circle r="3" fill={incomingColor} opacity="0.9">
                        <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L 20 30 L 0 50" />
                    </circle>
                    <circle r="6" fill={incomingColor} opacity="0.15">
                        <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L 20 30 L 0 50" />
                    </circle>
                </svg>
            }

            {/* Top connector pin */}
            <div className="w-3 h-3 rounded-full mb-1" style={{ background: gradientFrom, boxShadow: `0 0 8px ${gradientFrom}60` }} />

            {/* Main IC package */}
            <div className="relative">
                {/* Pin rows on left */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 flex flex-col gap-2">
                    {[0, 1, 2].map((i) =>
                        <div key={i} className="flex items-center">
                            <div className="w-4 h-1 rounded-sm" style={{ background: gradientFrom, opacity: 0.5 }} />
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: gradientFrom, opacity: 0.7 }} />
                        </div>
                    )}
                </div>

                {/* Pin rows on right */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-4 flex flex-col gap-2">
                    {[0, 1, 2].map((i) =>
                        <div key={i} className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: gradientTo, opacity: 0.7 }} />
                            <div className="w-4 h-1 rounded-sm" style={{ background: gradientTo, opacity: 0.5 }} />
                        </div>
                    )}
                </div>

                {/* IC body */}
                <div
                    className="relative px-10 py-4 rounded-lg text-center"
                    style={{
                        background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
                        border: `2px solid ${gradientFrom}60`,
                        boxShadow: `0 0 30px ${gradientFrom}20, 0 0 60px ${gradientFrom}10, inset 0 0 20px ${gradientFrom}08`
                    }}>

                    {/* Notch indicator (IC chip style) */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-3 rounded-b-full"
                        style={{ background: `${gradientFrom}30`, border: `1px solid ${gradientFrom}40`, borderTop: "none" }} />


                    {/* Corner solder pads */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: gradientFrom, opacity: 0.5 }} />
                    <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full" style={{ background: gradientFrom, opacity: 0.5 }} />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full" style={{ background: gradientTo, opacity: 0.5 }} />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full" style={{ background: gradientTo, opacity: 0.5 }} />

                    <div className="flex items-center justify-center gap-3">
                        <div className="relative">
                            <svg className="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-led-blink" style={{ background: gradientFrom }} />
                        </div>
                        <h2 className="text-white text-xl font-bold">{name}</h2>
                        <span
                            className="text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1"
                            style={{ background: `${gradientFrom}40`, border: `1px solid ${gradientFrom}60` }}>

                            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-led-blink" />
                            {number}
                        </span>
                    </div>
                </div>
            </div>

            {/* Connecting trace to first unit */}
            <svg width="20" height="40" viewBox="0 0 20 40" className="overflow-visible" style={{ filter: `drop-shadow(0 0 4px ${gradientFrom}40)` }}>
                <line x1="10" y1="0" x2="10" y2="40" stroke={gradientFrom} strokeWidth="2" opacity="0.4" />
                <line x1="10" y1="0" x2="10" y2="40" stroke={gradientFrom} strokeWidth="2" opacity="0.8" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" values="0;-8" dur="1s" repeatCount="indefinite" />
                </line>
                <circle cx="10" cy="0" r="2.5" fill={gradientFrom} opacity="0.6" />
                <circle cx="10" cy="40" r="2.5" fill={gradientFrom} opacity="0.6" />
                <circle r="2" fill={gradientFrom} opacity="0.9">
                    <animateMotion dur="1s" repeatCount="indefinite" path="M 10 0 L 10 40" />
                </circle>
                <circle r="4" fill={gradientFrom} opacity="0.2">
                    <animateMotion dur="1s" repeatCount="indefinite" path="M 10 0 L 10 40" />
                </circle>
            </svg>
        </div>);

}
