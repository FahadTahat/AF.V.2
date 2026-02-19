interface ImportantNotesProps {
    prevColor?: string;
}

export default function ImportantNotes({ prevColor }: ImportantNotesProps) {
    const traceColor = prevColor || "#eab308";
    return (
        <div className="mt-0 mb-8 mx-auto max-w-2xl flex flex-col items-center">
            {/* Top circuit connector from last resubmission station */}
            <svg width="140" height="70" viewBox="-70 0 140 70" className="overflow-visible" style={{ filter: `drop-shadow(0 0 6px ${traceColor}40)` }}>
                {/* Background trace */}
                <path d="M 0 0 L 0 15 L -25 35 L 0 55 L 0 70" stroke={traceColor} strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.2" />
                {/* Main trace */}
                <path d="M 0 0 L 0 15 L -25 35 L 0 55 L 0 70" stroke={traceColor} strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.6" />
                {/* Animated current */}
                <path d="M 0 0 L 0 15 L -25 35 L 0 55 L 0 70" stroke={traceColor} strokeWidth="2" fill="none" strokeLinecap="square" strokeLinejoin="miter" opacity="0.9" strokeDasharray="8 16">
                    <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.2s" repeatCount="indefinite" />
                </path>
                {/* Junction solder points */}
                <circle cx="0" cy="0" r="3" fill={traceColor} opacity="0.7" />
                <circle cx="0" cy="15" r="2" fill={traceColor} opacity="0.5" />
                <circle cx="-25" cy="35" r="2.5" fill={traceColor} opacity="0.5" />
                <circle cx="0" cy="55" r="2" fill={traceColor} opacity="0.5" />
                <circle cx="0" cy="70" r="3" fill={traceColor} opacity="0.7" />
                {/* Traveling glow */}
                <circle r="3" fill={traceColor} opacity="0.9">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L -25 35 L 0 55 L 0 70" />
                </circle>
                <circle r="6" fill={traceColor} opacity="0.15">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 0 0 L 0 15 L -25 35 L 0 55 L 0 70" />
                </circle>
            </svg>

            {/* Solder pad connector */}
            <div className="w-4 h-4 rounded-full mb-4 border-2" style={{ borderColor: "#f59e0b", background: "#f59e0b20", boxShadow: "0 0 10px rgba(245,158,11,0.4)" }} />

            <div
                className="w-full rounded-2xl p-6 relative"
                style={{
                    background: "rgba(0,0,0,0.7)",
                    border: "2px solid rgba(245,158,11,0.5)",
                    boxShadow: "0 0 25px rgba(245,158,11,0.1), 0 0 50px rgba(245,158,11,0.05)",
                    backdropFilter: "blur(10px)",
                }}
            >
                {/* Corner circuit pads */}
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-500/60 border border-amber-400/40" />
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-500/60 border border-amber-400/40" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-500/60 border border-amber-400/40" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-500/60 border border-amber-400/40" />

                {/* Pin connectors on sides */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-3 flex flex-col gap-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center">
                            <div className="w-3 h-1 rounded-sm bg-amber-500/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                        </div>
                    ))}
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-3 flex flex-col gap-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                            <div className="w-3 h-1 rounded-sm bg-amber-500/50" />
                        </div>
                    ))}
                </div>

                {/* Circuit traces extending left and right */}
                <svg className="absolute top-1/2 -translate-y-1/2 -left-20 w-20 h-8" viewBox="0 0 80 32" style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.3))" }}>
                    <line x1="0" y1="16" x2="80" y2="16" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
                    <line x1="0" y1="16" x2="80" y2="16" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" strokeDasharray="4 4">
                        <animate attributeName="stroke-dashoffset" values="16;0" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    <circle cx="5" cy="16" r="2" fill="#f59e0b" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                </svg>
                <svg className="absolute top-1/2 -translate-y-1/2 -right-20 w-20 h-8" viewBox="0 0 80 32" style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.3))" }}>
                    <line x1="0" y1="16" x2="80" y2="16" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3" />
                    <line x1="0" y1="16" x2="80" y2="16" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" strokeDasharray="4 4">
                        <animate attributeName="stroke-dashoffset" values="0;16" dur="1.5s" repeatCount="indefinite" />
                    </line>
                    <circle cx="75" cy="16" r="2" fill="#f59e0b" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                </svg>

                <h3 className="text-amber-400 font-bold text-lg mb-4 text-center flex items-center justify-center gap-2">
                    <div className="relative">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-led-blink" />
                    </div>
                    ملاحظات هامة
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Internal Audit */}
                    <div className="rounded-xl p-4 bg-blue-500/10 border border-blue-500/20 relative">
                        {/* Mini solder pads */}
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                        <div className="absolute -top-1 -left-1 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                        <div className="flex items-center gap-2 mb-2">
                            <div className="relative">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 animate-led-blink" />
                            </div>
                            <span className="text-blue-400 font-bold text-sm">التدقيق الداخلي</span>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">
                            يتم إجراء تدقيق داخلي على جميع الأعمال المقدمة لضمان الجودة والتوافق مع المعايير الأكاديمية المطلوبة.
                        </p>
                    </div>

                    {/* Resubmission Condition */}
                    <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/20 relative">
                        {/* Mini solder pads */}
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        <div className="absolute -top-1 -left-1 w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-amber-400/50" />
                        <div className="flex items-center gap-2 mb-2">
                            <div className="relative">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-led-blink" />
                            </div>
                            <span className="text-amber-400 font-bold text-sm">شرط الإعادة</span>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">
                            يحق للطالب إعادة تسليم المهام خلال 15 يوم عمل من تاريخ صدور النتائج، بشرط الالتزام بالتعليمات والتعديلات المطلوبة.
                        </p>
                    </div>
                </div>

                {/* Bottom circuit trace - ground symbol */}
                <div className="flex flex-col items-center mt-4">
                    <div className="w-0.5 h-4 bg-amber-500/40" />
                    <div className="w-8 h-0.5 bg-amber-500/30" />
                    <div className="w-5 h-0.5 bg-amber-500/20 mt-0.5" />
                    <div className="w-2 h-0.5 bg-amber-500/10 mt-0.5" />
                </div>
            </div>
        </div>
    );
}
