"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    ExternalLink,
    Download,
    Monitor,
    Code,
    Palette,
    Globe,
    FileText,
    Video,
    Smartphone,
    Network,
    Gamepad2Icon as GameController2,
    Shield,
    Brain,
    Wrench,
} from "lucide-react"

interface Program {
    name: string
    description: string
    downloadUrl?: string
    officialUrl?: string
    icon: any
    color: string
    category: string
}

interface Unit {
    id: string
    name: string
    programs: Program[]
}

interface Semester {
    id: string
    name: string
    units: Unit[]
}

interface ProgramsTabProps {
    gradeId: "grade10" | "grade11" | "grade12"
}

const programsDataByGrade = {
    grade10: {
        name: "الصف العاشر",
        semesters: [
            {
                id: "semester1",
                name: "الفصل الأول",
                units: [
                    {
                        id: "unit1",
                        name: "الوحدة الأولى: استخدام تكنولوجيا المعلومات",
                        programs: [
                            {
                                name: "Zeoob",
                                description: "نظام لإدارة المعلومات والاتصالات",
                                officialUrl: "https://zeoob.com",
                                icon: Globe,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "web",
                            },
                        ],
                    },
                    {
                        id: "unit2",
                        name: "الوحدة الثانية: نمذجة البيانات وجداول البيانات",
                        programs: [
                            {
                                name: "Microsoft Excel",
                                description: "برنامج جداول البيانات والحسابات المتقدم",
                                officialUrl: "https://www.microsoft.com/excel",
                                icon: FileText,
                                color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
                                category: "office",
                            },
                        ],
                    },
                ],
            },
            {
                id: "semester2",
                name: "الفصل الثاني",
                units: [
                    {
                        id: "unit4",
                        name: "الوحدة الرابعة: مقدمة في الشبكات",
                        programs: [
                            {
                                name: "Cisco Packet Tracer",
                                description: "محاكي الشبكات لتعلم أساسيات الشبكات",
                                officialUrl: "https://www.netacad.com/courses/packet-tracer",
                                icon: Network,
                                color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300",
                                category: "network",
                            },
                        ],
                    },
                    {
                        id: "unit5",
                        name: "الوحدة الخامسة: مقدمة في البرمجة",
                        programs: [
                            {
                                name: "Visual Studio Code",
                                description: "محرر أكواد متقدم ومجاني",
                                officialUrl: "https://code.visualstudio.com",
                                icon: Code,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "programming",
                            },
                            {
                                name: "Python",
                                description: "لغة برمجة سهلة التعلم",
                                officialUrl: "https://www.python.org",
                                icon: Code,
                                color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300",
                                category: "programming",
                            },
                        ],
                    },
                    {
                        id: "unit6",
                        name: "الوحدة السادسة: الرسوم الرقمية والمتحركة",
                        programs: [
                            {
                                name: "GIMP",
                                description: "برنامج تحرير الصور المجاني",
                                officialUrl: "https://www.gimp.org",
                                icon: Palette,
                                color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300",
                                category: "design",
                            },
                            {
                                name: "Pencil2D",
                                description: "برنامج الرسوم المتحركة",
                                officialUrl: "https://www.pencil2d.org",
                                icon: Video,
                                color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300",
                                category: "animation",
                            },
                        ],
                    },
                ],
            },
            {
                id: "semester3",
                name: "الفصل الثالث",
                units: [
                    {
                        id: "unit7",
                        name: "الوحدة السابعة: تطوير مواقع الويب",
                        programs: [
                            {
                                name: "Visual Studio Code",
                                description: "محرر أكواد متقدم لتطوير الويب",
                                officialUrl: "https://code.visualstudio.com",
                                icon: Code,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "programming",
                            },
                        ],
                    },
                    {
                        id: "unit8",
                        name: "الوحدة الثامنة: التطبيقات",
                        programs: [
                            {
                                name: "Android Studio",
                                description: "بيئة التطوير الرسمية للأندرويد",
                                officialUrl: "https://developer.android.com/studio",
                                icon: Smartphone,
                                color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
                                category: "mobile",
                            },
                            {
                                name: "Flutter",
                                description: "إطار عمل متعدد الأنظمة",
                                officialUrl: "https://flutter.dev",
                                icon: Smartphone,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "mobile",
                            },
                        ],
                    },
                    {
                        id: "unit9",
                        name: "الوحدة التاسعة: تصميم الألعاب",
                        programs: [
                            {
                                name: "Unity",
                                description: "محرك ألعاب احترافي",
                                officialUrl: "https://unity.com",
                                icon: GameController2,
                                color: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300",
                                category: "games",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    grade11: {
        name: "الصف الأول ثانوي",
        semesters: [
            {
                id: "semester2",
                name: "الفصل الثاني",
                units: [
                    {
                        id: "unit6",
                        name: "الوحدة السادسة: تطوير المواقع الإلكترونية",
                        programs: [
                            {
                                name: "Visual Studio Code",
                                description: "محرر أكواد متقدم",
                                officialUrl: "https://code.visualstudio.com",
                                icon: Code,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "programming",
                            },
                        ],
                    },
                    {
                        id: "unit7",
                        name: "الوحدة السابعة: تطوير تطبيقات الهاتف",
                        programs: [
                            {
                                name: "Android Studio",
                                description: "بيئة التطوير للأندرويد",
                                officialUrl: "https://developer.android.com/studio",
                                icon: Smartphone,
                                color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
                                category: "mobile",
                            },
                            {
                                name: "Flutter",
                                description: "إطار عمل متعدد الأنظمة",
                                officialUrl: "https://flutter.dev",
                                icon: Smartphone,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "mobile",
                            },
                        ],
                    },
                ],
            },
            {
                id: "semester3",
                name: "الفصل الثالث",
                units: [
                    {
                        id: "unit12",
                        name: "الوحدة 12: الدعم الفني وإدارة تكنولوجيا المعلومات",
                        programs: [
                            {
                                name: "osTicket",
                                description: "نظام تذاكر الدعم الفني",
                                officialUrl: "https://osticket.com",
                                icon: Wrench,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "support",
                            },
                            {
                                name: "VMware / VirtualBox",
                                description: "برامج الأجهزة الافتراضية",
                                officialUrl: "https://www.vmware.com",
                                icon: Monitor,
                                color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300",
                                category: "virtualization",
                            },
                        ],
                    },
                    {
                        id: "unit8",
                        name: "الوحدة الثامنة: تطوير ألعاب الحاسوب",
                        programs: [
                            {
                                name: "Unity",
                                description: "محرك ألعاب احترافي",
                                officialUrl: "https://unity.com",
                                icon: GameController2,
                                color: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300",
                                category: "games",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    grade12: {
        name: "الصف الثاني عشر (التوجيهي)",
        semesters: [
            {
                id: "semester1",
                name: "الفصل الأول",
                units: [
                    {
                        id: "unit11",
                        name: "الوحدة 11: الأمن السيبراني",
                        programs: [
                            {
                                name: "لا توجد برامج مطلوبة",
                                description: "وحدة نظرية",
                                icon: Shield,
                                color: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300",
                                category: "theory",
                            },
                        ],
                    },
                ],
            },
            {
                id: "semester2",
                name: "الفصل الثاني",
                units: [
                    {
                        id: "unit4",
                        name: "الوحدة الرابعة: البرمجة",
                        programs: [
                            {
                                name: "Visual Studio (C# / VB.NET)",
                                description: "بيئة تطوير متقدمة",
                                officialUrl: "https://visualstudio.microsoft.com",
                                icon: Code,
                                color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300",
                                category: "programming",
                            },
                        ],
                    },
                ],
            },
            {
                id: "semester3",
                name: "الفصل الثالث",
                units: [
                    {
                        id: "unit21",
                        name: "الوحدة 21: مقدمة في الذكاء الاصطناعي",
                        programs: [
                            {
                                name: "Google Colab",
                                description: "بيئة تطوير الذكاء الاصطناعي",
                                officialUrl: "https://colab.research.google.com",
                                icon: Brain,
                                color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                                category: "ai",
                            },
                        ],
                    },
                ],
            },
        ],
    },
}

export default function ProgramsTab({ gradeId }: ProgramsTabProps) {
    const gradeData = programsDataByGrade[gradeId]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{gradeData.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    البرامج والأدوات اللازمة لكل وحدة دراسية
                </p>
            </div>

            {gradeData.semesters.map((semester) => (
                <Card key={semester.id} className="mb-6 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                        <CardTitle className="text-xl text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            {semester.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {semester.units.map((unit) => (
                                <AccordionItem
                                    key={unit.id}
                                    value={unit.id}
                                    className="border rounded-lg px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="text-right">
                                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{unit.name}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {unit.programs.length} {unit.programs.length === 1 ? "برنامج" : "برامج"} مطلوبة
                                            </p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {unit.programs.map((program, index) => (
                                                <Card key={index} className="h-full flex flex-col hover:shadow-md transition-all duration-300 hover:scale-105">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className={`w-10 h-10 rounded-lg ${program.color} flex items-center justify-center`}>
                                                                <program.icon className="h-5 w-5" />
                                                            </div>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {program.category}
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-base">{program.name}</CardTitle>
                                                        <CardDescription className="text-sm">{program.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex-1 flex flex-col justify-end pt-0">
                                                        {program.officialUrl && (
                                                            <Button size="sm" className="w-full" asChild>
                                                                <a href={program.officialUrl} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4 ml-2" />
                                                                    الموقع الرسمي
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
