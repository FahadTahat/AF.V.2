"use client"

import { useMemo } from "react"
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Brain, Moon, Utensils, Scale, PieChart as PieIcon } from "lucide-react"

interface DashboardProps {
    answers: Record<string, any>
    lang: 'ar' | 'en'
}

export function SmartFutureDashboard({ answers, lang }: DashboardProps) {

    // --- Data Processing Helpers ---

    const radarData = useMemo(() => {
        // Quantify qualitative answers
        const sleepScore =
            answers.sleepQuality === 'Excellent' || answers.sleepQuality === 'ممتاز' ? 100 :
                answers.sleepQuality === 'Good' || answers.sleepQuality === 'جيد' ? 70 : 40;

        const moodScore =
            answers.mood === 'Positive' || answers.mood === 'إيجابي' ? 95 :
                answers.mood === 'Neutral' || answers.mood === 'محايد' ? 65 : 35;

        const dietScore =
            answers.dietFollowed === 'Yes' || answers.dietFollowed === 'نعم' ? 90 : 50;

        // Normalize numeric values (caps at reasonable maximums)
        const studyScore = Math.min(Number(answers.studyHours || 0) * 10, 100); // 10 hours = 100
        const sleepHoursScore = Math.min((Number(answers.sleepHours || 0) / 8) * 100, 100); // 8 hours = 100

        return [
            { subject: lang === 'ar' ? 'جودة النوم' : 'Sleep Qual', A: sleepScore, fullMark: 100 },
            { subject: lang === 'ar' ? 'المزاج' : 'Mood', A: moodScore, fullMark: 100 },
            { subject: lang === 'ar' ? 'النظام الغذائي' : 'Diet', A: dietScore, fullMark: 100 },
            { subject: lang === 'ar' ? 'الدراسة' : 'Study', A: studyScore, fullMark: 100 },
            { subject: lang === 'ar' ? 'كفاية النوم' : 'Sleep Qty', A: sleepHoursScore, fullMark: 100 },
        ];
    }, [answers, lang]);

    const pieData = useMemo(() => {
        const sleep = Number(answers.sleepHours) || 8;
        const study = Number(answers.studyHours) || 4;
        const school = 6; // Average school day
        const remaining = Math.max(0, 24 - (sleep + study + school));

        return [
            { name: lang === 'ar' ? 'نوم' : 'Sleep', value: sleep, color: '#3b82f6' },
            { name: lang === 'ar' ? 'دراسة' : 'Study', value: study, color: '#06b6d4' },
            { name: lang === 'ar' ? 'مدرسة/جامعة' : 'School', value: school, color: '#10b981' },
            { name: lang === 'ar' ? 'وقت حر' : 'Free Time', value: remaining, color: '#f59e0b' },
        ];
    }, [answers, lang]);

    const bmiData = useMemo(() => {
        const h = Number(answers.height) / 100;
        const w = Number(answers.weight);
        if (!h || !w) return null;
        const bmi = w / (h * h);

        return [
            { name: lang === 'ar' ? 'مؤشر الكتلة' : 'BMI', value: Number(bmi.toFixed(1)) }
        ]
    }, [answers, lang]);

    const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Row: General Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* 1. Radar Chart: Wellness Balance */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-xl overflow-hidden relative group hover:border-blue-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                            <Activity size={18} className="text-blue-400" />
                            {lang === 'ar' ? 'توازن الحياة' : 'Life Balance'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="#60a5fa"
                                    strokeWidth={3}
                                    fill="#3b82f6"
                                    fillOpacity={0.4}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Pie Chart: 24h Distribution */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-xl overflow-hidden relative group hover:border-cyan-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                            <PieIcon size={18} className="text-cyan-400" />
                            {lang === 'ar' ? 'توزيع اليوم (24 ساعة)' : 'Daily Distribution'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Bar Chart: BMI Visualization */}
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md shadow-xl overflow-hidden relative group hover:border-pink-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                            <Scale size={18} className="text-pink-400" />
                            {lang === 'ar' ? 'التحليل الجسدي (BMI)' : 'Body Analysis (BMI)'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex flex-col justify-center relative z-10">
                        {bmiData ? (
                            <div className="w-full flex flex-col items-center gap-4">
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    {/* Custom SVG Gauge Background */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="80" stroke="#334155" strokeWidth="12" fill="none" />
                                        <circle
                                            cx="96" cy="96" r="80"
                                            stroke={
                                                bmiData[0].value < 18.5 ? '#facc15' :
                                                    bmiData[0].value < 25 ? '#10b981' :
                                                        bmiData[0].value < 30 ? '#f97316' : '#ef4444'
                                            }
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${(Math.min(bmiData[0].value, 40) / 40) * 502} 502`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white">{bmiData[0].value}</span>
                                        <span className="text-xs text-slate-400">BMI</span>
                                    </div>
                                </div>
                                <Badge variant="outline" className={`
                                    ${bmiData[0].value < 18.5 ? 'text-yellow-400 border-yellow-400/30' :
                                        bmiData[0].value < 25 ? 'text-emerald-400 border-emerald-400/30' :
                                            bmiData[0].value < 30 ? 'text-orange-400 border-orange-400/30' : 'text-red-400 border-red-400/30'}
                                `}>
                                    {bmiData[0].value < 18.5 ? (lang === 'ar' ? 'نحيف' : 'Underweight') :
                                        bmiData[0].value < 25 ? (lang === 'ar' ? 'وزن مثالي' : 'Normal') :
                                            bmiData[0].value < 30 ? (lang === 'ar' ? 'زيادة وزن' : 'Overweight') : (lang === 'ar' ? 'سمنة' : 'Obese')}
                                </Badge>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 italic">
                                {lang === 'ar' ? 'البيانات غير كافية' : 'Insufficient Data'}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
