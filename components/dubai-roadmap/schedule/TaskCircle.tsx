"use client";

import type { Task } from "@/lib/schedule-data";

interface TaskCircleProps {
    task: Task;
    color: string;
    unitName: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function TaskCircle({ task, color, unitName, isSelected, onClick }: TaskCircleProps) {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 transition-all duration-300 hover:scale-110 cursor-pointer ${isSelected
                    ? "scale-110 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] bg-opacity-100"
                    : "border-white/30 hover:border-white/70"
                    }`}
                style={{
                    background: isSelected ? color : `${color}80`, // More opaque when selected
                    boxShadow: isSelected ? `0 0 15px ${color}` : "none"
                }}
            >
                {task.id}
            </button>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap transition-opacity duration-200 pointer-events-none z-10 ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                style={{ background: color }}
            >
                {task.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                    style={{ borderTopColor: color }}
                />
            </div>
        </div>
    );
}
