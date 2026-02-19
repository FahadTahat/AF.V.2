"use client"

import { motion } from "framer-motion"
import {
    TrendingUp, ArrowUp, Dumbbell, Moon, Brain,
    AlertTriangle, CheckCircle, Zap, Scale, Apple
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface SmartInsight {
    id: string
    category: 'growth' | 'weight' | 'sleep' | 'academic' | 'general'
    title: { ar: string, en: string }
    status: 'warning' | 'success' | 'info'
    message: { ar: string, en: string }
    actionPlan: { ar: string, en: string }
}

interface SmartRecommendationsProps {
    insights: SmartInsight[]
    lang: 'ar' | 'en'
}

export function SmartRecommendations({ insights, lang }: SmartRecommendationsProps) {

    const getIcon = (category: string) => {
        switch (category) {
            case 'growth': return ArrowUp;
            case 'weight': return Scale;
            case 'sleep': return Moon;
            case 'academic': return Brain;
            case 'diet': return Apple;
            default: return Zap;
        }
    }

    const getColor = (status: string) => {
        switch (status) {
            case 'warning': return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case 'success': return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            case 'info': return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                    <Brain className="text-white w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">
                        {lang === 'ar' ? 'تحليل الذكاء الاصطناعي والتوصيات' : 'AI Analysis & Recommendations'}
                    </h3>
                    <p className="text-slate-400 text-sm">
                        {lang === 'ar' ? 'خطط عمل مخصصة لتحسين جودة حياتك بناءً على بياناتك' : 'Tailored action plans to improve your life quality based on your data'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, index) => {
                    const Icon = getIcon(insight.category)
                    const colorClass = getColor(insight.status)

                    return (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-white/5 border-white/10 hover:border-white/20 transition-all backdrop-blur-sm overflow-hidden group">
                                <div className={cn("absolute top-0 left-0 w-1 h-full",
                                    insight.status === 'warning' ? 'bg-amber-500' :
                                        insight.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                                )} />

                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg", colorClass)}>
                                                <Icon size={20} />
                                            </div>
                                            <CardTitle className="text-lg text-slate-100">
                                                {insight.title[lang]}
                                            </CardTitle>
                                        </div>
                                        {insight.status === 'warning' && (
                                            <Badge variant="outline" className="border-amber-500/50 text-amber-500">
                                                {lang === 'ar' ? 'انتبه' : 'Attention'}
                                            </Badge>
                                        )}
                                        {insight.status === 'success' && (
                                            <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">
                                                {lang === 'ar' ? 'ممتاز' : 'Great'}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-slate-300 leading-relaxed">
                                        {insight.message[lang]}
                                    </p>

                                    <div className={cn("mt-4 p-4 rounded-xl border flex gap-3", colorClass)}>
                                        <TrendingUp className="shrink-0 w-5 h-5 mt-0.5" />
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                                                {lang === 'ar' ? 'خطة العمل المقترحة' : 'Action Plan'}
                                            </span>
                                            <span className="font-medium text-sm">
                                                {insight.actionPlan[lang]}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
