interface ResubmissionStationProps {
    semesterNumber: number;
    period: string;
    note: string;
}

export default function ResubmissionStation({ semesterNumber, period, note }: ResubmissionStationProps) {
    return (
        <div className="relative flex flex-col items-center my-0">
            {/* Top connector - long PCB trace from last node */}
            <svg width="140" height="60" viewBox="-70 0 140 60" className="overflow-visible" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.4))" }}>
                {/* Background trace */}
                <path d="M 0 0 L 0 15 L 25 30 L 25 45 L 0 60" stroke="#eab308" strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.2" />
                {/* Main trace */}
                <path d="M 0 0 L 0 15 L 25 30 L 25 45 L 0 60" stroke="#eab308" strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.6" />
                {/* Animated current */}
                <path d="M 0 0 L 0 15 L 25 30 L 25 45 L 0 60" stroke="#eab308" strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.9" strokeDasharray="8 16">
                    <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.2s" repeatCount="indefinite" />
                </path>
                {/* Junction solder points */}
                <circle cx="0" cy="0" r="3" fill="#eab308" opacity="0.7" />
                <circle cx="0" cy="15" r="2.5" fill="#eab308" opacity="0.5" />
                <circle cx="25" cy="30" r="2.5" fill="#eab308" opacity="0.5" />
                <circle cx="25" cy="45" r="2.5" fill="#eab308" opacity="0.5" />
                <circle cx="0" cy="60" r="3" fill="#eab308" opacity="0.7" />
                {/* Traveling glow */}
                <circle r="3" fill="#eab308" opacity="0.9">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L 25 30 L 25 45 L 0 60" />
                </circle>
                <circle r="7" fill="#eab308" opacity="0.15">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L 25 30 L 25 45 L 0 60" />
                </circle>
            </svg>

            {/* Main relay station */}
            <div className="relative">
                {/* Circuit traces extending left and right */}
                <svg className="absolute top-1/2 -translate-y-1/2 -left-32 w-32 h-12" viewBox="0 0 128 48" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.3))" }}>
                    <line x1="0" y1="24" x2="128" y2="24" stroke="#eab308" strokeWidth="2" opacity="0.3" />
                    <line x1="0" y1="24" x2="128" y2="24" stroke="#eab308" strokeWidth="2" opacity="0.7" strokeDasharray="6 4">
                        <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    {/* Resistor zigzag */}
                    <polyline points="20,24 30,14 40,34 50,14 60,34 70,24" stroke="#eab308" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <circle cx="10" cy="24" r="3" fill="#eab308" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="24" r="2" fill="#eab308" opacity="0.5" />
                    {/* Capacitor */}
                    <line x1="90" y1="16" x2="90" y2="32" stroke="#eab308" strokeWidth="2" opacity="0.4" />
                    <line x1="95" y1="16" x2="95" y2="32" stroke="#eab308" strokeWidth="2" opacity="0.4" />
                </svg>

                <svg className="absolute top-1/2 -translate-y-1/2 -right-32 w-32 h-12" viewBox="0 0 128 48" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.3))" }}>
                    <line x1="0" y1="24" x2="128" y2="24" stroke="#eab308" strokeWidth="2" opacity="0.3" />
                    <line x1="0" y1="24" x2="128" y2="24" stroke="#eab308" strokeWidth="2" opacity="0.7" strokeDasharray="6 4">
                        <animate attributeName="stroke-dashoffset" values="0;20" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    {/* Inductor coils */}
                    <path d="M 30,24 Q 38,14 46,24 Q 54,34 62,24 Q 70,14 78,24" stroke="#eab308" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <circle cx="118" cy="24" r="3" fill="#eab308" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                    <circle cx="48" cy="24" r="2" fill="#eab308" opacity="0.5" />
                </svg>

                {/* Central relay box */}
                <div
                    className="relative z-10 px-8 py-5 rounded-lg text-center circuit-relay"
                    style={{
                        background: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(234,179,8,0.15))",
                        border: "2px solid rgba(234,179,8,0.4)",
                        boxShadow: "0 0 25px rgba(234,179,8,0.1), 0 0 50px rgba(234,179,8,0.05), inset 0 0 20px rgba(234,179,8,0.05)",
                    }}
                >
                    {/* Corner pin markers */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-yellow-500/60" />

                    {/* Content */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="relative">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400 animate-led-blink" />
                        </div>
                        <span className="text-yellow-400 font-bold text-sm tracking-wide">
                            محطة الإعادة - الفصل {semesterNumber}
                        </span>
                    </div>
                    <p className="text-white/60 text-xs">{period}</p>
                    <p className="text-yellow-500/50 text-[10px] mt-1 flex items-center justify-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-yellow-500/50" />
                        {note}
                    </p>
                </div>
            </div>

            {/* Bottom connector - long PCB trace to next semester */}
            <svg width="140" height="60" viewBox="-70 0 140 60" className="overflow-visible" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,0.4))" }}>
                {/* Background trace */}
                <path d="M 0 0 L 0 15 L -30 30 L -30 45 L 0 60" stroke="#eab308" strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.2" />
                {/* Main trace */}
                <path d="M 0 0 L 0 15 L -30 30 L -30 45 L 0 60" stroke="#eab308" strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.6" />
                {/* Animated current */}
                <path d="M 0 0 L 0 15 L -30 30 L -30 45 L 0 60" stroke="#eab308" strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.9" strokeDasharray="8 16">
                    <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.2s" repeatCount="indefinite" />
                </path>
                {/* Junction solder points */}
                <circle cx="0" cy="0" r="3" fill="#eab308" opacity="0.7" />
                <circle cx="0" cy="15" r="2.5" fill="#eab308" opacity="0.5" />
                <circle cx="-30" cy="30" r="2.5" fill="#eab308" opacity="0.5" />
                <circle cx="-30" cy="45" r="2.5" fill="#eab308" opacity="0.5" />
                <circle cx="0" cy="60" r="3" fill="#eab308" opacity="0.7" />
                {/* Traveling glow */}
                <circle r="3" fill="#eab308" opacity="0.9">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L -30 30 L -30 45 L 0 60" />
                </circle>
                <circle r="7" fill="#eab308" opacity="0.15">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L -30 30 L -30 45 L 0 60" />
                </circle>
            </svg>
        </div>
    );
}
