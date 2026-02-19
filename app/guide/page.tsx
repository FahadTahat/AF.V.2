"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAchievements } from "@/contexts/AchievementContext"
import { programsBySubject } from "@/lib/programs-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Monitor,
  Code,
  Globe,
  Smartphone,
  Gamepad2,
  Shield,
  Brain,
  Database,
  Laptop,
  ExternalLink,
  Sparkles,
  Zap,
  GraduationCap
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function GuidePage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "guidelines"
  const subjectId = searchParams.get("subject")
  const [activeTab, setActiveTab] = useState(initialTab)

  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined)

  const subjectsByGrade = {
    grade10: [
      {
        id: "it-support",
        name: language === 'ar' ? "استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات" : "Using IT to Support Information and Communication in Organizations",
        icon: Monitor,
        description: language === 'ar' ? "تعلم كيفية استخدام التكنولوجيا لدعم العمليات في المؤسسات" : "Learn how to use technology to support operations in organizations",
        whatYouLearn: language === 'ar' ? [
          "أساسيات أنظمة المعلومات في المؤسسات",
          "استخدام برامج المكتب المتقدمة",
          "إدارة قواعد البيانات البسيطة",
          "أنظمة الاتصالات الرقمية",
          "الدعم الفني الأساسي",
        ] : [
          "Fundamentals of IT systems in organizations",
          "Using advanced office software",
          "Managing simple databases",
          "Digital communication systems",
          "Basic Technical Support",
        ],
        skills: language === 'ar' ? ["الدعم الفني", "إدارة البيانات", "التواصل التقني"] : ["Tech Support", "Data Management", "Tech Communication"],
      },
      {
        id: "data-modeling",
        name: language === 'ar' ? "نمذجة البيانات وجداول البيانات" : "Data Modeling and Spreadsheets",
        icon: Database,
        description: language === 'ar' ? "تعلم تصميم وإدارة قواعد البيانات وجداول البيانات" : "Learn to design and manage databases and spreadsheets",
        whatYouLearn: language === 'ar' ? [
          "مبادئ تصميم قواعد البيانات",
          "استخدام Excel المتقدم",
          "إنشاء النماذج والتقارير",
          "تحليل البيانات الأساسي",
          "ربط الجداول والاستعلامات",
        ] : [
          "Database design principles",
          "Advanced Excel usage",
          "Creating models and reports",
          "Basic data analysis",
          "Linking tables and queries",
        ],
        skills: language === 'ar' ? ["تحليل البيانات", "Excel المتقدم", "تصميم قواعد البيانات"] : ["Data Analysis", "Advanced Excel", "Database Design"],
      },
      {
        id: "networks-intro",
        name: language === 'ar' ? "مقدمة إلى شبكات الكمبيوتر" : "Introduction to Computer Networks",
        icon: Globe,
        description: language === 'ar' ? "أساسيات الشبكات وكيفية عملها وإدارتها" : "Basics of networks and how they work and are managed",
        whatYouLearn: language === 'ar' ? [
          "مفاهيم الشبكات الأساسية",
          "بروتوكولات الإنترنت",
          "أمان الشبكات الأساسي",
          "إعداد الشبكات المحلية",
          "استكشاف أخطاء الشبكات",
        ] : [
          "Basic network concepts",
          "Internet protocols",
          "Basic network security",
          "Setting up LANs",
          "Network troubleshooting",
        ],
        skills: language === 'ar' ? ["إدارة الشبكات", "استكشاف الأخطاء", "الأمان الأساسي"] : ["Network Management", "Troubleshooting", "Basic Security"],
      },
      {
        id: "programming-intro",
        name: language === 'ar' ? "مقدمة إلى البرمجة" : "Introduction to Programming",
        icon: Code,
        description: language === 'ar' ? "تعلم أساسيات البرمجة والخوارزميات" : "Learn programming basics and algorithms",
        whatYouLearn: language === 'ar' ? [
          "مفاهيم البرمجة الأساسية",
          "الخوارزميات وهياكل البيانات",
          "لغات البرمجة الأساسية",
          "حل المشكلات البرمجية",
          "تطوير التطبيقات البسيطة",
        ] : [
          "Basic programming concepts",
          "Algorithms and data structures",
          "Basic programming languages",
          "Software problem solving",
          "Developing simple applications",
        ],
        skills: language === 'ar' ? ["البرمجة", "التفكير المنطقي", "حل المشكلات"] : ["Programming", "Logical Thinking", "Problem Solving"],
      },
      {
        id: "digital-graphics",
        name: language === 'ar' ? "مقدمة إلى الرسومات الرقمية والرسوم المتحركة" : "Introduction to Digital Graphics and Animation",
        icon: Monitor,
        description: language === 'ar' ? "تعلم إنشاء وتحرير الرسومات والرسوم المتحركة" : "Learn to create and edit graphics and animations",
        whatYouLearn: language === 'ar' ? [
          "برامج التصميم الجرافيكي",
          "إنشاء الرسوم المتحركة",
          "تحرير الصور والفيديو",
          "مبادئ التصميم البصري",
          "إنتاج المحتوى الرقمي",
        ] : [
          "Graphic design software",
          "Creating animations",
          "Image and video editing",
          "Visual design principles",
          "Digital content production",
        ],
        skills: language === 'ar' ? ["التصميم الجرافيكي", "الرسوم المتحركة", "الإبداع البصري"] : ["Graphic Design", "Animation", "Visual Creativity"],
      },
      {
        id: "web-development-intro",
        name: language === 'ar' ? "مقدمة إلى تطوير مواقع الويب" : "Introduction to Web Development",
        icon: Globe,
        description: language === 'ar' ? "تعلم إنشاء وتطوير مواقع الويب" : "Learn to create and develop websites",
        whatYouLearn: language === 'ar' ? [
          "HTML و CSS الأساسي",
          "JavaScript للمبتدئين",
          "تصميم واجهات المستخدم",
          "استضافة المواقع",
          "أساسيات تجربة المستخدم",
        ] : [
          "Basic HTML & CSS",
          "JavaScript for beginners",
          "UI Design",
          "Web hosting",
          "UX basics",
        ],
        skills: language === 'ar' ? ["تطوير الويب", "التصميم التفاعلي", "البرمجة الأمامية"] : ["Web Development", "Interactive Design", "Frontend Coding"],
      },
      {
        id: "app-development-intro",
        name: language === 'ar' ? "مقدمة إلى تطوير التطبيقات" : "Introduction to App Development",
        icon: Smartphone,
        description: language === 'ar' ? "تعلم تطوير التطبيقات للأجهزة المختلفة" : "Learn to develop apps for different devices",
        whatYouLearn: language === 'ar' ? [
          "مبادئ تطوير التطبيقات",
          "واجهات المستخدم للتطبيقات",
          "قواعد البيانات في التطبيقات",
          "اختبار التطبيقات",
          "نشر التطبيقات",
        ] : [
          "App development principles",
          "App UI",
          "Databases in apps",
          "App testing",
          "App deployment",
        ],
        skills: language === 'ar' ? ["تطوير التطبيقات", "تصميم UI/UX", "البرمجة المتقدمة"] : ["App Development", "UI/UX Design", "Advanced Programming"],
      },
      {
        id: "game-design-intro",
        name: language === 'ar' ? "مقدمة لتصميم الألعاب" : "Introduction to Game Design",
        icon: Gamepad2,
        description: language === 'ar' ? "تعلم أساسيات تصميم وتطوير الألعاب" : "Learn basics of game design and development",
        whatYouLearn: language === 'ar' ? [
          "مفاهيم تصميم الألعاب",
          "محركات الألعاب الأساسية",
          "برمجة الألعاب",
          "تصميم الشخصيات والبيئات",
          "اختبار وتحسين الألعاب",
        ] : [
          "Game design concepts",
          "Basic game engines",
          "Game programming",
          "Character and environment design",
          "Game testing and optimization",
        ],
        skills: language === 'ar' ? ["تصميم الألعاب", "البرمجة الإبداعية", "التفكير الإبداعي"] : ["Game Design", "Creative Programming", "Creative Thinking"],
      },
    ],
    grade11: [
      {
        id: "strategic-it",
        name: language === 'ar' ? "أنظمة تكنولوجيا المعلومات الإستراتيجية" : "Strategic IT Systems",
        icon: Target,
        description: language === 'ar' ? "تعلم كيفية استخدام التكنولوجيا لتحقيق الأهداف الاستراتيجية" : "Learn how to use technology to achieve strategic goals",
        whatYouLearn: language === 'ar' ? [
          "التخطيط الاستراتيجي للتكنولوجيا",
          "تحليل احتياجات المؤسسات",
          "إدارة مشاريع تكنولوجيا المعلومات",
          "تقييم الأنظمة التكنولوجية",
          "التكامل بين الأنظمة المختلفة",
        ] : [
          "Strategic technology planning",
          "Organizational needs analysis",
          "IT project management",
          "Evaluating technological systems",
          "Integration between different systems",
        ],
        skills: language === 'ar' ? ["التخطيط الاستراتيجي", "إدارة المشاريع", "التحليل المؤسسي"] : ["Strategic Planning", "Project Management", "Organizational Analysis"],
      },
      {
        id: "web-development-advanced",
        name: language === 'ar' ? "تطوير المواقع الإلكترونية" : "Website Development",
        icon: Globe,
        description: language === 'ar' ? "تطوير مواقع ويب متقدمة وتفاعلية" : "Develop advanced and interactive websites",
        whatYouLearn: language === 'ar' ? [
          "تطوير الواجهات المتقدمة",
          "برمجة الخادم والقواعد",
          "أمان مواقع الويب",
          "تحسين الأداء والسرعة",
          "التطوير المتجاوب",
        ] : [
          "Advanced interface development",
          "Server and database programming",
          "Website security",
          "Performance and speed optimization",
          "Responsive development",
        ],
        skills: language === 'ar' ? ["تطوير الويب المتقدم", "أمان الويب", "تحسين الأداء"] : ["Advanced Web Dev", "Web Security", "Performance Optimization"],
      },
      {
        id: "mobile-development",
        name: language === 'ar' ? "تطوير تطبيقات الهاتف المحمول" : "Mobile App Development",
        icon: Smartphone,
        description: language === 'ar' ? "تطوير تطبيقات احترافية للهواتف الذكية" : "Develop professional apps for smartphones",
        whatYouLearn: language === 'ar' ? [
          "تطوير تطبيقات Android و iOS",
          "واجهات المستخدم المتقدمة",
          "التكامل مع الخدمات السحابية",
          "أمان التطبيقات",
          "نشر التطبيقات في المتاجر",
        ] : [
          "Android and iOS app development",
          "Advanced User Interfaces",
          "Cloud services integration",
          "App security",
          "Publishing apps to stores",
        ],
        skills: language === 'ar' ? ["تطوير التطبيقات المتقدم", "البرمجة متعددة المنصات", "أمان التطبيقات"] : ["Advanced App Dev", "Cross-platform Programming", "App Security"],
      },
      {
        id: "it-support-management",
        name: language === 'ar' ? "الدعم الفني وإدارة تكنولوجيا المعلومات" : "IT Support and Management",
        icon: Monitor,
        description: language === 'ar' ? "إدارة الأنظمة التقنية وتقديم الدعم الفني" : "Manage technical systems and provide support",
        whatYouLearn: language === 'ar' ? [
          "إدارة الأنظمة والخوادم",
          "استكشاف الأخطاء المتقدم",
          "إدارة قواعد البيانات",
          "أمان الأنظمة",
          "إدارة فرق الدعم الفني",
        ] : [
          "Systems and server management",
          "Advanced troubleshooting",
          "Database management",
          "System security",
          "Managing support teams",
        ],
        skills: language === 'ar' ? ["إدارة الأنظمة", "القيادة التقنية", "استكشاف الأخطاء المتقدم"] : ["Systems Management", "Technical Leadership", "Advanced Troubleshooting"],
      },
      {
        id: "game-development",
        name: language === 'ar' ? "تطوير ألعاب الحاسوب" : "Computer Game Development",
        icon: Gamepad2,
        description: language === 'ar' ? "تطوير ألعاب احترافية للحاسوب" : "Develop professional PC games",
        whatYouLearn: language === 'ar' ? [
          "محركات الألعاب المتقدمة",
          "برمجة الذكاء الاصطناعي للألعاب",
          "تصميم المستويات والبيئات",
          "تحسين أداء الألعاب",
          "تسويق ونشر الألعاب",
        ] : [
          "Advanced game engines",
          "AI programming for games",
          "Level and environment design",
          "Game performance optimization",
          "Game marketing and publishing",
        ],
        skills: language === 'ar' ? ["تطوير الألعاب المتقدم", "الذكاء الاصطناعي", "تحسين الأداء"] : ["Advanced Game Dev", "AI", "Performance Optimization"],
      },
    ],
    grade12: [
      {
        id: "cybersecurity",
        name: language === 'ar' ? "الأمن السيبراني وإدارة الحوادث" : "Cybersecurity and Incident Management",
        icon: Shield,
        description: language === 'ar' ? "حماية الأنظمة والبيانات من التهديدات السيبرانية" : "Protect systems and data from cyber threats",
        whatYouLearn: language === 'ar' ? [
          "تحليل التهديدات السيبرانية",
          "تطوير استراتيجيات الأمان",
          "إدارة حوادث الأمان",
          "اختبار الاختراق الأخلاقي",
          "الامتثال للمعايير الأمنية",
        ] : [
          "Cyber threat analysis",
          "Developing security strategies",
          "Security incident management",
          "Ethical penetration testing",
          "Compliance with security standards",
        ],
        skills: language === 'ar' ? ["الأمن السيبراني", "تحليل التهديدات", "إدارة المخاطر"] : ["Cybersecurity", "Threat Analysis", "Risk Management"],
      },
      {
        id: "advanced-programming",
        name: language === 'ar' ? "البرمجة" : "Programming",
        icon: Code,
        description: language === 'ar' ? "البرمجة المتقدمة وتطوير الأنظمة المعقدة" : "Advanced programming and complex systems development",
        whatYouLearn: language === 'ar' ? [
          "لغات البرمجة المتقدمة",
          "هندسة البرمجيات",
          "تطوير الأنظمة الموزعة",
          "اختبار البرمجيات",
          "إدارة دورة حياة التطوير",
        ] : [
          "Advanced programming languages",
          "Software engineering",
          "Distributed systems development",
          "Software testing",
          "Development lifecycle management",
        ],
        skills: language === 'ar' ? ["البرمجة المتقدمة", "هندسة البرمجيات", "إدارة المشاريع التقنية"] : ["Advanced Programming", "Software Engineering", "Tech Project Management"],
      },
      {
        id: "it-project-management",
        name: language === 'ar' ? "إدارة مشاريع تكنولوجيا المعلومات" : "IT Project Management",
        icon: Target,
        description: language === 'ar' ? "إدارة المشاريع التقنية من التخطيط إلى التنفيذ" : "Manage technical projects from planning to execution",
        whatYouLearn: language === 'ar' ? [
          "منهجيات إدارة المشاريع",
          "تخطيط وتنفيذ المشاريع التقنية",
          "إدارة الفرق والموارد",
          "إدارة المخاطر والجودة",
          "تقييم نجاح المشاريع",
        ] : [
          "Project management methodologies",
          "Planning and executing tech projects",
          "Team and resource management",
          "Risk and quality management",
          "Evaluating project success",
        ],
        skills: language === 'ar' ? ["إدارة المشاريع", "القيادة", "التخطيط الاستراتيجي"] : ["Project Management", "Leadership", "Strategic Planning"],
      },
      {
        id: "artificial-intelligence",
        name: language === 'ar' ? "مقدمة في الذكاء الاصطناعي" : "Introduction to AI",
        icon: Brain,
        description: language === 'ar' ? "أساسيات الذكاء الاصطناعي وتطبيقاته" : "Basics of AI and its applications",
        whatYouLearn: language === 'ar' ? [
          "مفاهيم الذكاء الاصطناعي",
          "تعلم الآلة والشبكات العصبية",
          "معالجة اللغات الطبيعية",
          "رؤية الحاسوب",
          "أخلاقيات الذكاء الاصطناعي",
        ] : [
          "AI concepts",
          "Machine learning and neural networks",
          "Natural language processing",
          "Computer vision",
          "AI ethics",
        ],
        skills: language === 'ar' ? ["الذكاء الاصطناعي", "تعلم الآلة", "التحليل المتقدم"] : ["AI", "Machine Learning", "Advanced Analysis"],
      },
    ],
  }

  const btecTermsLevel2 = [
    {
      term: language === 'ar' ? "التحليل (Analysis)" : "Analysis",
      definition: language === 'ar' ? "يقدم المتعلم نتيجة الفحص المنهجي والمفصل من خلال تفصيل موضوع أو فكرة أو موقف من أجل تفسير العلاقات المتبادلة بين الأجزاء ودراستها" : "The learner presents the outcome of a systematic and detailed examination to break down a topic, idea, or situation in order to interpret and study the interrelationships between the parts.",
      example: language === 'ar' ? "تحليل البيانات المالية لشركة لفهم الاتجاهات والعلاقات" : "Analyzing a company's financial data to understand trends and relationships",
    },
    {
      term: language === 'ar' ? "التقييم (Evaluation)" : "Evaluation",
      definition: language === 'ar' ? "يقدم المتعلمون دراسة متأنية للعوامل أو الأحداث المتنوعة التي تنطبق على موقف معين من أجل تحديد العوامل الأكثر أهمية ذات الصلة والوصول إلى نتيجة" : "Learners present a careful consideration of various factors or events that apply to a specific situation in order to identify the most significant relevant factors and reach a conclusion.",
      example: language === 'ar' ? "تقييم فعالية استراتيجية تسويقية معينة" : "Evaluating the effectiveness of a specific marketing strategy",
    },
    {
      term: language === 'ar' ? "إجراء (Carry out)" : "Carry out",
      definition: language === 'ar' ? "يُظهر المتعلمون المهارات، وغالباً ما يشيرون إلى عمليات أو تقنيات معينة" : "Learners demonstrate skills, often referring to specific processes or techniques.",
      example: language === 'ar' ? "إجراء اختبار لبرنامج حاسوبي" : "Carrying out a test for a computer program",
    },
    {
      term: language === 'ar' ? "تواصل/تقديم (Communicate/Present)" : "Communicate/Present",
      definition: language === 'ar' ? "يمكن للمتعلم تقديم الأفكار أو المعلومات للآخرين" : "The learner can present ideas or information to others.",
      example: language === 'ar' ? "تقديم عرض تقديمي عن نتائج البحث" : "Presenting a presentation on research findings",
    },
    {
      term: language === 'ar' ? "إنشاء/تصميم (Create/Design)" : "Create/Design",
      definition: language === 'ar' ? "إنتاج عمل المتعلمين أو تحقيق نية معينة" : "Produce learners' work or achieve a specific intention.",
      example: language === 'ar' ? "تصميم موقع ويب لشركة صغيرة" : "Designing a website for a small business",
    },
    {
      term: language === 'ar' ? "الاستعراض (Demonstrate)" : "Demonstrate",
      definition: language === 'ar' ? "يثبت عمل المتعلمين أو أدائهم أو ممارساتهم القدرة على تنفيذ وتطبيق المعرفة والفهم و/أو المهارات في موقف عملي" : "Learners' work, performance, or practice proves the ability to carry out and apply knowledge, understanding, and/or skills in a practical situation.",
      example: language === 'ar' ? "استعراض كيفية استخدام برنامج محاسبة" : "Demonstrating how to use accounting software",
    },
    {
      term: language === 'ar' ? "وصف (Describe)" : "Describe",
      definition: language === 'ar' ? "يقدم المتعلمون وصفاً لموضوعات معينة أو استخراج المعلومات ذات الصلة والمعلمات ذات الحالة بموضوع معين" : "Learners provide a description of specific topics or extract relevant information and characteristics related to a specific topic.",
      example: language === 'ar' ? "وصف خطوات تطوير تطبيق جوال" : "Describing the steps of mobile app development",
    },
    {
      term: language === 'ar' ? "التطوير (Develop)" : "Develop",
      definition: language === 'ar' ? "يكتسب المتعلمون المهارات ويطبقونها من خلال الأنشطة العملية لإنشاء منتج أو خدمة أو نظام فعال يناسب الجمهور والغرض" : "Learners acquire and apply skills through practical activities to create a product, service, or effective system that suits the audience and purpose.",
      example: language === 'ar' ? "تطوير نظام إدارة مخزون لمتجر" : "Developing an inventory management system for a store",
    },
  ]

  const btecTermsLevel3 = [
    {
      term: language === 'ar' ? "التحليل (Analysis)" : "Analysis",
      definition: language === 'ar' ? "يقدم المتعلمون نتيجة الفحص المنهجي والمفصل من خلال تفصيل موضوع أو فكرة أو موقف من أجل تفسير العلاقات المتبادلة بين الأجزاء ودراستها" : "Learners present the outcome of a systematic and detailed examination to break down a topic, idea, or situation in order to interpret and study the interrelationships between the parts.",
      example: language === 'ar' ? "تحليل متطلبات النظام وتحديد العلاقات بين المكونات المختلفة" : "Analyzing system requirements and identifying relationships between different components",
    },
    {
      term: language === 'ar' ? "المقارنة (Compare)" : "Compare",
      definition: language === 'ar' ? "يحدد المتعلمون العوامل المتعلقة بعنصرين أو أكثر/مواقف أو جوانب من موضوع يمتد لشرح التشابهات والاختلافات والمزايا والعيوب" : "Learners identify factors related to two or more elements/situations or aspects of a subject extending to explain similarities, differences, advantages, and disadvantages.",
      example: language === 'ar' ? "مقارنة بين لغات البرمجة المختلفة من حيث الأداء والسهولة" : "Comparing different programming languages in terms of performance and ease",
    },
    {
      term: language === 'ar' ? "التصميم (Design)" : "Design",
      definition: language === 'ar' ? "يقوم المتعلمون بتطبيق المهارات والمعرفة لإنشاء مخطط لمنتج أو خدمة أو نظام فعال يناسب الجمهور و/أو الغرض" : "Learners apply skills and knowledge to create a plan for a product, service, or effective system that suits the audience and/or purpose.",
      example: language === 'ar' ? "تصميم قاعدة بيانات لنظام إدارة المستشفى" : "Designing a database for a hospital management system",
    },
    {
      term: language === 'ar' ? "النقاش (Discuss)" : "Discuss",
      definition: language === 'ar' ? "يأخذ المتعلمون في الاعتبار جوانب مختلفة من موضوع أو فكرة والكيفية التي يرتبطان بها ومدى أهميتها" : "Learners consider different aspects of a topic or idea and how they relate and their significance.",
      example: language === 'ar' ? "نقاش حول تأثير الذكاء الاصطناعي على سوق العمل" : "Discussion on the impact of AI on the job market",
    },
    {
      term: language === 'ar' ? "التبرير (Justify)" : "Justify",
      definition: language === 'ar' ? "يقدم المتعلمون أسباباً أو أدلة لدعم الرأي أو إثبات شيء صحيح أو معقول" : "Learners provide reasons or evidence to support an opinion or prove something correct or reasonable.",
      example: language === 'ar' ? "تبرير اختيار تقنية معينة لتطوير التطبيق" : "Justifying the choice of a specific technology for app development",
    },
    {
      term: language === 'ar' ? "المراقبة (Monitor)" : "Monitor",
      definition: language === 'ar' ? "يراقب المتعلمون تقدم شيء ما أو جودته ويتحققون من ذلك على مدى فترة من الزمن، مع الحفاظ على المراجعة المنهجية" : "Learners observe the progress or quality of something and check it over a period of time, maintaining systematic review.",
      example: language === 'ar' ? "مراقبة أداء النظام وتسجيل المشاكل" : "Monitoring system performance and logging issues",
    },
    {
      term: language === 'ar' ? "التحسين (Optimise)" : "Optimise",
      definition: language === 'ar' ? "يقوم المتعلمون بتحسين العملية أو المنتج/الخدمة من خلال خطوات تدريجية لتحقيق أداء أفضل في ظل القيود الموجودة" : "Learners improve a process or product/service through incremental steps to achieve better performance under existing constraints.",
      example: language === 'ar' ? "تحسين كود البرنامج لتقليل وقت التنفيذ" : "Optimizing program code to reduce execution time",
    },
    {
      term: language === 'ar' ? "البحث (Research)" : "Research",
      definition: language === 'ar' ? "يسعى المتعلمون للحصول على المعلومات وتحديد الوسائل والموارد للقيام بذلك بشكل استباقي" : "Learners seek information and proactively determine means and resources to do so.",
      example: language === 'ar' ? "البحث عن أحدث التقنيات في مجال الأمن السيبراني" : "Researching the latest technologies in cybersecurity",
    },
  ]

  const guidelines = [
    {
      title: language === 'ar' ? "التخطيط للدراسة" : "Study Planning",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      tips: language === 'ar' ? [
        "ضع جدولاً زمنياً واقعياً للمذاكرة",
        "خصص وقتاً كافياً لكل مادة حسب صعوبتها",
        "استخدم تقنيات إدارة الوقت مثل تقنية البومودورو",
        "راجع خطتك الدراسية بانتظام وعدلها حسب الحاجة",
      ] : [
        "Create a realistic study schedule",
        "Allocate enough time for each subject based on difficulty",
        "Use time management techniques like Pomodoro",
        "Review your study plan regularly and adjust as needed",
      ],
    },
    {
      title: language === 'ar' ? "كتابة المهام" : "Writing Assignments",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      tips: language === 'ar' ? [
        "اقرأ متطلبات المهمة بعناية قبل البدء",
        "ضع مخططاً للمهمة قبل الكتابة",
        "استخدم مصادر موثوقة ووثق المراجع بشكل صحيح",
        "راجع عملك قبل التسليم وتأكد من استيفاء جميع المعايير",
      ] : [
        "Read assignment requirements carefully before starting",
        "Outline the task before writing",
        "Use reliable sources and document references correctly",
        "Review your work before submission and ensure all criteria are met",
      ],
    },
    {
      title: language === 'ar' ? "العمل الجماعي" : "Teamwork",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      tips: language === 'ar' ? [
        "تواصل بفعالية مع أعضاء الفريق",
        "وزع المهام بعدالة حسب قدرات كل عضو",
        "ضع جدولاً زمنياً للاجتماعات والمراجعات",
        "احترم آراء الآخرين وكن منفتحاً للنقد البناء",
      ] : [
        "Communicate effectively with team members",
        "Distribute tasks fairly based on member capabilities",
        "Set a schedule for meetings and reviews",
        "Respect others' opinions and be open to constructive criticism",
      ],
    },
    {
      title: language === 'ar' ? "الاستعداد للامتحانات" : "Exam Preparation",
      icon: CheckCircle,
      color: "from-amber-500 to-orange-500",
      tips: language === 'ar' ? [
        "ابدأ المراجعة مبكراً ولا تؤجل للحظة الأخيرة",
        "استخدم تقنيات مختلفة للمراجعة مثل الخرائط الذهنية",
        "حل أسئلة سابقة وتدرب على إدارة الوقت",
        "احصل على قسط كافٍ من النوم قبل الامتحان",
      ] : [
        "Start revising early and don't delay until the last minute",
        "Use different revision techniques like mind maps",
        "Solve past papers and practice time management",
        "Get enough sleep before the exam",
      ],
    },
  ]

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  // Scroll to subject if present in URL and open accordion
  useEffect(() => {
    if (subjectId) {
      setAccordionValue(subjectId)
      const timer = setTimeout(() => {
        const element = document.getElementById(subjectId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          element.classList.add("ring-2", "ring-primary", "ring-offset-2")
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary", "ring-offset-2")
          }, 2000)
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [subjectId, searchParams])

  // Achievement Trigger
  const { incrementProgress } = useAchievements()
  useEffect(() => {
    const timer = setTimeout(() => {
      incrementProgress('guide_reader')
    }, 5000) // Delay to ensure they actually read a bit
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen pt-36 pb-20 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{language === 'ar' ? "المرجع الشامل" : "Comprehensive Reference"}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {language === 'ar' ? (
              <>دليل الطالب <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">الأكاديمي</span></>
            ) : (
              <><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Academic</span> Student Guide</>
            )}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('guide.subtitle')}
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-12">
          {/* Enhanced Tabs List */}
          <div className="flex justify-center">
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-full overflow-hidden">
              <TabsTrigger value="guidelines" className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300">
                <Lightbulb className="h-4 w-4 ml-2" />
                <span>{t('guide.tips')}</span>
              </TabsTrigger>
              <TabsTrigger value="subjects" className="rounded-full px-6 py-2.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-300">
                <BookOpen className="h-4 w-4 ml-2" />
                <span>{t('guide.programs')}</span>
              </TabsTrigger>
              <TabsTrigger value="terms" className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-300">
                <Info className="h-4 w-4 ml-2" />
                <span>{language === 'ar' ? "المصطلحات" : "Terminology"}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Guidelines Tab - Redesigned */}
          <TabsContent value="guidelines" className="space-y-8 focus:outline-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {guidelines.map((guideline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden group hover:border-white/20 transition-all">
                    <div className={`h-2 w-full bg-gradient-to-r ${guideline.color}`} />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-white text-xl">
                        <div className={`p-3 rounded-xl bg-white/5 text-white group-hover:bg-white/10 transition-colors`}>
                          <guideline.icon className="h-6 w-6" />
                        </div>
                        {guideline.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {guideline.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-3">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0`} />
                            <span className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-amber-500/10 border-amber-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500 flex-shrink-0 animate-pulse-slow">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-500 text-lg mb-2">{language === 'ar' ? "نصيحة ذهبية" : "Golden Tip"}</h3>
                      <p className="text-amber-200/80 leading-relaxed">
                        {language === 'ar' ? (
                          <>
                            تذكر أن النجاح في BTEC يعتمد بشكل كبير على <span className="text-white font-semibold">الفهم العملي والتطبيق</span> أكثر من مجرد الحفظ النظري.
                            حاول دائماً ربط ما تتعلمه بمشاريع واقعية وتجارب عملية لترسيخ المعلومة.
                          </>
                        ) : (
                          <>
                            Remember that success in BTEC depends significantly on <span className="text-white font-semibold">Practical Understanding and Application</span> more than just theoretical memorization.
                            Always try to link what you learn to real-world projects and practical experiences to solidify the information.
                          </>
                        )}

                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Subjects Tab - Redesigned */}
          <TabsContent value="subjects" className="space-y-8 focus:outline-none">
            <Tabs defaultValue={searchParams.get("grade") || "grade10"} className="w-full">
              <div className="flex justify-center mb-10">
                <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl h-auto flex flex-wrap justify-center gap-2">
                  <TabsTrigger value="grade10" className="rounded-xl px-6 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/25 transition-all">
                    {language === 'ar' ? "الصف العاشر" : "Grade 10"}
                  </TabsTrigger>
                  <TabsTrigger value="grade11" className="rounded-xl px-6 py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-600/25 transition-all">
                    {t('calc.grade11')}
                  </TabsTrigger>
                  <TabsTrigger value="grade12" className="rounded-xl px-6 py-3 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-600/25 transition-all">
                    {t('calc.grade12')}
                  </TabsTrigger>
                </TabsList>
              </div>

              {Object.entries(subjectsByGrade).map(([gradeKey, subjects]) => (
                <TabsContent key={gradeKey} value={gradeKey} className="space-y-6">
                  <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full space-y-4">
                    {subjects.map((subject, index) => (
                      <AccordionItem
                        key={subject.id}
                        value={subject.id}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden px-0 data-[state=open]:border-primary/50 data-[state=open]:bg-white/10 transition-all duration-300"
                        id={subject.id}
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                          <div className="flex items-center gap-4 w-full text-right" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
                              <subject.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 text-start">
                              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{subject.name}</h3>
                              <p className="text-sm text-slate-400 group-hover:text-slate-300">{subject.description}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 pt-6 border-t border-white/10">
                            {/* Learning Outcomes */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2 text-primary">
                                <Zap className="w-5 h-5" />
                                <h4 className="font-bold text-white">{language === 'ar' ? "ماذا ستتعلم؟" : "What You'll Learn"}</h4>
                              </div>
                              <ul className="space-y-3">
                                {subject.whatYouLearn.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Skills */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2 text-purple-400">
                                <Target className="w-5 h-5" />
                                <h4 className="font-bold text-white">{language === 'ar' ? "المهارات المكتسبة" : "Skills Acquired"}</h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {subject.skills.map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20 py-1.5">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Software */}
                            {programsBySubject[subject.id] && programsBySubject[subject.id].length > 0 && (
                              <div className="col-span-full space-y-4 mt-4">
                                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                  <Laptop className="w-5 h-5" />
                                  <h4 className="font-bold text-white">{language === 'ar' ? "البرامج والأدوات المطلوبة" : "Required Software & Tools"}</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {programsBySubject[subject.id].map((program, pIdx) => (
                                    <motion.a
                                      key={pIdx}
                                      href={program.officialUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.02 }}
                                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                                    >
                                      <div className="w-12 h-12 rounded-lg bg-white p-2 flex items-center justify-center">
                                        <img src={program.logoUrl} alt={program.name} className="w-full h-full object-contain" />
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">{program.name}</h5>
                                        <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 h-5">
                                          {program.category}
                                        </Badge>
                                      </div>
                                      <ExternalLink className="w-4 h-4 text-slate-500 mr-auto group-hover:text-emerald-400" />
                                    </motion.a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* Terms Tab - Redesigned */}
          <TabsContent value="terms" className="space-y-12 focus:outline-none">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-2 rounded-full bg-blue-500" />
                <h2 className="text-3xl font-bold text-white">{language === 'ar' ? "مصطلحات المستوى الثاني (Level 2)" : "Level 2 Terms"}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {btecTermsLevel2.map((term, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                          {term.term}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed border-b border-white/5 pb-4">
                          {term.definition}
                        </p>
                        <div className="bg-blue-500/5 rounded-lg p-3 text-xs text-blue-200">
                          <strong className="block mb-1 text-blue-400">{language === 'ar' ? "مثال:" : "Example:"}</strong>
                          {term.example}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-2 rounded-full bg-purple-500" />
                <h2 className="text-3xl font-bold text-white">{language === 'ar' ? "مصطلحات المستوى الثالث (Level 3)" : "Level 3 Terms"}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {btecTermsLevel3.map((term, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all group">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-400 group-hover:text-purple-300 transition-colors">
                          {term.term}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed border-b border-white/5 pb-4">
                          {term.definition}
                        </p>
                        <div className="bg-purple-500/5 rounded-lg p-3 text-xs text-purple-200">
                          <strong className="block mb-1 text-purple-400">{language === 'ar' ? "مثال:" : "Example:"}</strong>
                          {term.example}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
