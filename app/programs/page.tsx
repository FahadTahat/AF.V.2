"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Download,
  ExternalLink,
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

interface Grade {
  id: string
  name: string
  semesters: Semester[]
}

const programsData: Grade[] = [
  {
    id: "grade10",
    name: "الصف العاشر",
    semesters: [
      {
        id: "semester1",
        name: "الفصل الأول",
        units: [
          {
            id: "unit1",
            name: "الوحدة الأولى: استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
            programs: [
              {
                name: "Zeoob",
                description: "نظام لإدارة المعلومات والاتصالات في المؤسسات",
                officialUrl: "https://zeoob.com",
                icon: Globe,
                color: "bg-blue-50 text-blue-600",
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
                color: "bg-green-50 text-green-600",
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
                color: "bg-cyan-50 text-cyan-600",
                category: "network",
              },
              {
                name: "Microsoft 365 Visio",
                description: "برنامج رسم المخططات والشبكات",
                officialUrl: "https://www.microsoft.com/visio",
                icon: Monitor,
                color: "bg-purple-50 text-purple-600",
                category: "design",
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
                color: "bg-blue-50 text-blue-600",
                category: "programming",
              },
              {
                name: "Python",
                description: "لغة برمجة سهلة التعلم ومتعددة الاستخدامات",
                officialUrl: "https://www.python.org",
                icon: Code,
                color: "bg-yellow-50 text-yellow-600",
                category: "programming",
              },
            ],
          },
          {
            id: "unit6",
            name: "الوحدة السادسة: مقدمة في الرسوم الرقمية والرسوم المتحركة",
            programs: [
              {
                name: "GIMP",
                description: "برنامج تحرير الصور المجاني",
                officialUrl: "https://www.gimp.org",
                icon: Palette,
                color: "bg-orange-50 text-orange-600",
                category: "design",
              },
              {
                name: "Inkscape",
                description: "برنامج الرسوم المتجهة المجاني",
                officialUrl: "https://inkscape.org",
                icon: Palette,
                color: "bg-purple-50 text-purple-600",
                category: "design",
              },
              {
                name: "Pencil2D",
                description: "برنامج الرسوم المتحركة ثنائية الأبعاد",
                officialUrl: "https://www.pencil2d.org",
                icon: Video,
                color: "bg-red-50 text-red-600",
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
            name: "الوحدة السابعة: مقدمة في تطوير مواقع الويب",
            programs: [
              {
                name: "Visual Studio Code",
                description: "محرر أكواد متقدم لتطوير الويب",
                officialUrl: "https://code.visualstudio.com",
                icon: Code,
                color: "bg-blue-50 text-blue-600",
                category: "programming",
              },
              {
                name: "Notepad++",
                description: "محرر نصوص متقدم للبرمجة",
                officialUrl: "https://notepad-plus-plus.org",
                icon: FileText,
                color: "bg-green-50 text-green-600",
                category: "programming",
              },
            ],
          },
          {
            id: "unit8",
            name: "الوحدة الثامنة: مقدمة في التطبيقات",
            programs: [
              {
                name: "MIT App Inventor",
                description: "نظام تطوير التطبيقات المرئية",
                officialUrl: "https://appinventor.mit.edu",
                icon: Smartphone,
                color: "bg-green-50 text-green-600",
                category: "mobile",
              },
              {
                name: "Android Studio",
                description: "بيئة التطوير الرسمية لتطبيقات الأندرويد",
                officialUrl: "https://developer.android.com/studio",
                icon: Smartphone,
                color: "bg-green-50 text-green-600",
                category: "mobile",
              },
              {
                name: "Flutter",
                description: "إطار عمل لتطوير التطبيقات متعدد الأنظمة",
                officialUrl: "https://flutter.dev",
                icon: Smartphone,
                color: "bg-blue-50 text-blue-600",
                category: "mobile",
              },
              {
                name: "Dart",
                description: "لغة البرمجة المستخدمة مع Flutter",
                officialUrl: "https://dart.dev",
                icon: Code,
                color: "bg-blue-50 text-blue-600",
                category: "programming",
              },
              {
                name: "Kotlin",
                description: "لغة برمجة حديثة لتطوير تطبيقات الأندرويد",
                officialUrl: "https://kotlinlang.org",
                icon: Code,
                color: "bg-purple-50 text-purple-600",
                category: "programming",
              },
              {
                name: "Java",
                description: "لغة برمجة شائعة لتطوير التطبيقات",
                officialUrl: "https://www.oracle.com/java",
                icon: Code,
                color: "bg-red-50 text-red-600",
                category: "programming",
              },
            ],
          },
          {
            id: "unit9",
            name: "الوحدة التاسعة: مقدمة في تصميم الألعاب",
            programs: [
              {
                name: "Scratch",
                description: "نظام برمجة مرئي لتعلم البرمجة",
                officialUrl: "https://scratch.mit.edu",
                icon: GameController2,
                color: "bg-orange-50 text-orange-600",
                category: "games",
              },
              {
                name: "Unity",
                description: "محرك ألعاب احترافي متعدد الأنظمة",
                officialUrl: "https://unity.com",
                icon: GameController2,
                color: "bg-gray-50 text-gray-600",
                category: "games",
              },
              {
                name: "GameMaker Studio",
                description: "أداة تطوير الألعاب ثنائية الأبعاد",
                officialUrl: "https://www.yoyogames.com/gamemaker",
                icon: GameController2,
                color: "bg-green-50 text-green-600",
                category: "games",
              },
              {
                name: "Godot",
                description: "محرك ألعاب مفتوح المصدر",
                officialUrl: "https://godotengine.org",
                icon: GameController2,
                color: "bg-blue-50 text-blue-600",
                category: "games",
              },
              {
                name: "Unreal Development Kit",
                description: "محرك ألعاب متقدم للمشاريع الكبيرة",
                officialUrl: "https://www.unrealengine.com",
                icon: GameController2,
                color: "bg-purple-50 text-purple-600",
                category: "games",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "grade11",
    name: "الصف الأول ثانوي",
    semesters: [
      {
        id: "semester1",
        name: "الفصل الأول",
        units: [
          {
            id: "unit1",
            name: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
            programs: [
              {
                name: "لا توجد برامج مطلوبة",
                description: "هذه الوحدة نظرية ولا تتطلب برامج خاصة",
                icon: FileText,
                color: "bg-gray-50 text-gray-600",
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
            id: "unit6",
            name: "الوحدة السادسة: تطوير المواقع الإلكترونية",
            programs: [
              {
                name: "Visual Studio Code",
                description: "محرر أكواد متقدم لتطوير الويب",
                officialUrl: "https://code.visualstudio.com",
                icon: Code,
                color: "bg-blue-50 text-blue-600",
                category: "programming",
              },
              {
                name: "HTML",
                description: "لغة ترميز النصوص التشعبية",
                officialUrl: "https://developer.mozilla.org/docs/Web/HTML",
                icon: Code,
                color: "bg-orange-50 text-orange-600",
                category: "web",
              },
              {
                name: "CSS",
                description: "لغة تنسيق صفحات الويب",
                officialUrl: "https://developer.mozilla.org/docs/Web/CSS",
                icon: Palette,
                color: "bg-blue-50 text-blue-600",
                category: "web",
              },
              {
                name: "JavaScript",
                description: "لغة برمجة لتطوير الويب التفاعلي",
                officialUrl: "https://developer.mozilla.org/docs/Web/JavaScript",
                icon: Code,
                color: "bg-yellow-50 text-yellow-600",
                category: "web",
              },
              {
                name: "Dreamweaver",
                description: "برنامج تطوير مواقع الويب من Adobe",
                officialUrl: "https://www.adobe.com/products/dreamweaver.html",
                icon: Globe,
                color: "bg-purple-50 text-purple-600",
                category: "web",
              },
              {
                name: "RocketCake",
                description: "محرر مواقع ويب مجاني",
                officialUrl: "https://www.ambiera.com/rocketcake",
                icon: Globe,
                color: "bg-green-50 text-green-600",
                category: "web",
              },
              {
                name: "KompoZer",
                description: "محرر صفحات ويب مجاني ومفتوح المصدر",
                officialUrl: "http://kompozer.net",
                icon: Globe,
                color: "bg-blue-50 text-blue-600",
                category: "web",
              },
            ],
          },
          {
            id: "unit7",
            name: "الوحدة السابعة: تطوير تطبيقات الهاتف المحمول",
            programs: [
              {
                name: "Android Studio",
                description: "بيئة التطوير الرسمية لتطبيقات الأندرويد",
                officialUrl: "https://developer.android.com/studio",
                icon: Smartphone,
                color: "bg-green-50 text-green-600",
                category: "mobile",
              },
              {
                name: "Flutter",
                description: "إطار عمل لتطوير التطبيقات متعدد الأنظمة",
                officialUrl: "https://flutter.dev",
                icon: Smartphone,
                color: "bg-blue-50 text-blue-600",
                category: "mobile",
              },
              {
                name: "Dart",
                description: "لغة البرمجة المستخدمة مع Flutter",
                officialUrl: "https://dart.dev",
                icon: Code,
                color: "bg-blue-50 text-blue-600",
                category: "programming",
              },
              {
                name: "Kotlin",
                description: "لغة برمجة حديثة لتطوير تطبيقات الأندرويد",
                officialUrl: "https://kotlinlang.org",
                icon: Code,
                color: "bg-purple-50 text-purple-600",
                category: "programming",
              },
              {
                name: "Java",
                description: "لغة برمجة شائعة لتطوير التطبيقات",
                officialUrl: "https://www.oracle.com/java",
                icon: Code,
                color: "bg-red-50 text-red-600",
                category: "programming",
              },
              {
                name: "GitHub",
                description: "موقع استضافة وإدارة المشاريع البرمجية",
                officialUrl: "https://github.com",
                icon: Code,
                color: "bg-gray-50 text-gray-600",
                category: "tools",
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
                description: "نظام تذاكر الدعم الفني مفتوح المصدر",
                officialUrl: "https://osticket.com",
                icon: Wrench,
                color: "bg-blue-50 text-blue-600",
                category: "support",
              },
              {
                name: "UVdesk",
                description: "نظام خدمة العملاء والدعم الفني",
                officialUrl: "https://www.uvdesk.com",
                icon: Wrench,
                color: "bg-purple-50 text-purple-600",
                category: "support",
              },
              {
                name: "Odoo",
                description: "نظام إدارة الأعمال المتكامل",
                officialUrl: "https://www.odoo.com",
                icon: Monitor,
                color: "bg-green-50 text-green-600",
                category: "business",
              },
              {
                name: "DeskFresh",
                description: "نظام إدارة تذاكر الدعم الفني",
                officialUrl: "https://deskfresh.com",
                icon: Wrench,
                color: "bg-orange-50 text-orange-600",
                category: "support",
              },
              {
                name: "VMware",
                description: "برنامج الأجهزة الافتراضية",
                officialUrl: "https://www.vmware.com",
                icon: Monitor,
                color: "bg-blue-50 text-blue-600",
                category: "virtualization",
              },
              {
                name: "Oracle VirtualBox",
                description: "برنامج الأجهزة الافتراضية المجاني",
                officialUrl: "https://www.virtualbox.org",
                icon: Monitor,
                color: "bg-orange-50 text-orange-600",
                category: "virtualization",
              },
              {
                name: "AnyDesk",
                description: "برنامج الاتصال عن بُعد",
                officialUrl: "https://anydesk.com",
                icon: Monitor,
                color: "bg-red-50 text-red-600",
                category: "remote",
              },
              {
                name: "RustDesk",
                description: "برنامج الاتصال عن بُعد مفتوح المصدر",
                officialUrl: "https://rustdesk.com",
                icon: Monitor,
                color: "bg-orange-50 text-orange-600",
                category: "remote",
              },
              {
                name: "TeamViewer",
                description: "برنامج الاتصال عن بُعد الشهير",
                officialUrl: "https://www.teamviewer.com",
                icon: Monitor,
                color: "bg-blue-50 text-blue-600",
                category: "remote",
              },
            ],
          },
          {
            id: "unit8",
            name: "الوحدة الثامنة: تطوير ألعاب الحاسوب",
            programs: [
              {
                name: "Unity",
                description: "محرك ألعاب احترافي متعدد الأنظمة",
                officialUrl: "https://unity.com",
                icon: GameController2,
                color: "bg-gray-50 text-gray-600",
                category: "games",
              },
              {
                name: "GameMaker Studio",
                description: "أداة تطوير الألعاب ثنائية الأبعاد",
                officialUrl: "https://www.yoyogames.com/gamemaker",
                icon: GameController2,
                color: "bg-green-50 text-green-600",
                category: "games",
              },
              {
                name: "Godot",
                description: "محرك ألعاب مفتوح المصدر",
                officialUrl: "https://godotengine.org",
                icon: GameController2,
                color: "bg-blue-50 text-blue-600",
                category: "games",
              },
              {
                name: "Unreal Development Kit",
                description: "محرك ألعاب متقدم للمشاريع الكبيرة",
                officialUrl: "https://www.unrealengine.com",
                icon: GameController2,
                color: "bg-purple-50 text-purple-600",
                category: "games",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "grade12",
    name: "الصف الثاني عشر (التوجيهي)",
    semesters: [
      {
        id: "semester1",
        name: "الفصل الأول",
        units: [
          {
            id: "unit11",
            name: "الوحدة 11: الأمن السيبراني وإدارة الحوادث",
            programs: [
              {
                name: "لا توجد برامج مطلوبة",
                description: "هذه الوحدة نظرية ولا تتطلب برامج خاصة",
                icon: Shield,
                color: "bg-gray-50 text-gray-600",
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
                name: "C#",
                description: "لغة برمجة متقدمة من مايكروسوفت",
                officialUrl: "https://docs.microsoft.com/dotnet/csharp",
                icon: Code,
                color: "bg-purple-50 text-purple-600",
                category: "programming",
              },
              {
                name: "Visual Studio Express (VB.NET)",
                description: "بيئة تطوير مجانية لـ VB.NET",
                officialUrl: "https://visualstudio.microsoft.com/vs/express",
                icon: Code,
                color: "bg-blue-50 text-blue-600",
                category: "programming",
              },
            ],
          },
          {
            id: "unit9",
            name: "الوحدة التاسعة: إدارة مشاريع تكنولوجيا المعلومات",
            programs: [
              {
                name: "ProjectLibre",
                description: "برنامج إدارة المشاريع مفتوح المصدر",
                officialUrl: "https://www.projectlibre.com",
                icon: Monitor,
                color: "bg-green-50 text-green-600",
                category: "project-management",
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
                description: "بيئة تطوير الذكاء الاصطناعي السحابية",
                officialUrl: "https://colab.research.google.com",
                icon: Brain,
                color: "bg-blue-50 text-blue-600",
                category: "ai",
              },
              {
                name: "Kaggle Dataset",
                description: "موقع مجموعات البيانات للذكاء الاصطناعي",
                officialUrl: "https://www.kaggle.com/datasets",
                icon: Brain,
                color: "bg-orange-50 text-orange-600",
                category: "ai",
              },
            ],
          },
        ],
      },
    ],
  },
]

export default function ProgramsPage() {
  const [selectedGrade, setSelectedGrade] = useState("grade10")

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slower"></div>
      </div>
      <div className="container px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-lg">البرامج المطلوبة</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              البرامج والأدوات اللازمة لكل صف دراسي مقسمة حسب الوحدات
            </p>
          </div>

          <Tabs value={selectedGrade} onValueChange={setSelectedGrade} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/5 backdrop-blur-sm p-1 rounded-xl border border-white/10">
              <TabsTrigger value="grade10" className="text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-slate-400 transition-all font-medium">
                الصف العاشر
              </TabsTrigger>
              <TabsTrigger value="grade11" className="text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-slate-400 transition-all font-medium">
                الأول ثانوي
              </TabsTrigger>
              <TabsTrigger value="grade12" className="text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-slate-400 transition-all font-medium">
                الثاني عشر
              </TabsTrigger>
            </TabsList>

            {programsData.map((grade) => (
              <TabsContent key={grade.id} value={grade.id} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{grade.name}</h2>
                </div>

                {grade.semesters.map((semester) => (
                  <Card key={semester.id} className="mb-6 animate-slide-up border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/5">
                      <CardTitle className="text-xl text-white flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-emerald-400" />
                        {semester.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {semester.units.map((unit) => (
                          <AccordionItem
                            key={unit.id}
                            value={unit.id}
                            className="border border-white/10 rounded-lg px-4 hover:bg-white/5 transition-colors mb-2"
                          >
                            <AccordionTrigger className="hover:no-underline py-4 group">
                              <div className="text-right w-full">
                                <h3 className="text-base font-semibold text-white group-hover:text-primary transition-colors">
                                  {unit.name}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                  {unit.programs.length} برنامج مطلوب
                                </p>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {unit.programs.map((program, index) => (
                                  <Card
                                    key={index}
                                    className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/5 border border-white/10"
                                  >
                                    <CardHeader className="pb-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <div
                                          className={`w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center`}
                                        >
                                          <program.icon className={`h-5 w-5 ${program.color.split(" ")[1]}`} />
                                        </div>
                                        <Badge variant="secondary" className="text-xs bg-white/10 text-slate-300 hover:bg-white/20">
                                          {program.category}
                                        </Badge>
                                      </div>
                                      <CardTitle className="text-base text-white">{program.name}</CardTitle>
                                      <CardDescription className="text-sm text-slate-400">{program.description}</CardDescription>
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
                                      {program.downloadUrl && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="w-full mt-2 bg-transparent"
                                          asChild
                                        >
                                          <a href={program.downloadUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-4 w-4 ml-2" />
                                            تحميل
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
              </TabsContent>
            ))}
          </Tabs>

          {/* Help Section */}
          <Card className="mt-12 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">تحتاج مساعدة في التثبيت؟</h3>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                  نوفر دليل تثبيت مفصل لجميع البرامج مع حلول للمشاكل الشائعة
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 hover:scale-105 transition-transform bg-primary hover:bg-primary/90 text-white">
                    دليل التثبيت
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                  >
                    تواصل مع الدعم
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

