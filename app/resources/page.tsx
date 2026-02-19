"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  FileText,
  Video,
  PenTool,
  Download,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Calendar,
  Building,
  ArrowRight,
  Library,
  Bookmark,
  BookmarkCheck
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toggleBookmark, getBookmarks } from "@/lib/user-data"
import { toast } from "sonner"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// ... (Keep existing interfaces and data constants: Resource, resourceTypes, specializations, grades, semesters, itSubjects, buty, sampleResources)
interface Resource {
  id: string
  title: string
  description: string
  type: "book" | "specification" | "handout" | "explanation" | "assignment"
  specialization: string
  grade: string
  semester: string
  subject: string
  downloadUrl?: string
  viewUrl?: string
  fileSize?: string
  fileType?: string
}

const resourceTypes = [
  {
    value: "book",
    label: "كتب",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    value: "specification",
    label: "المواصفات",
    icon: FileText,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    value: "handout",
    label: "الشروحات",
    icon: Video,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    telegramUrl: "https://t.me/+lgYAR-xlWOI3YjVk",
  },
  {
    value: "explanation",
    label: "دليل المعلم",
    icon: PenTool,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  {
    value: "assignment",
    label: "مهام",
    icon: Download,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  },
]

const specializations = [
  "تكنولوجيا المعلومات",
  "الهندسة",
  "إدارة الأعمال",
  "الفندقي",
  "الزراعي",
  "التصميم",
  "التجميل"
]

const grades = ["العاشر", "الأول ثانوي", "الثاني ثانوي (التوجيهي)"]
const semesters = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"]


const itSubjects = {
  العاشر: [
    "استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    "نمذجة البيانات وجداول البيانات",
    "مقدمة إلى شبكات الكمبيوتر",
    "مقدمة إلى البرمجة",
    "مقدمة إلى الرسومات الرقمية والرسوم المتحركة",
    "مقدمة إلى تطوير مواقع الويب",
    "مقدمة إلى تطوير التطبيقات",
    "مقدمة لتصميم الألعاب",
  ],
  "الأول ثانوي": [
    "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    "تطوير المواقع الإلكترونية",
    "تطوير تطبيقات الهاتف المحمول",
    "الدعم الفني وإدارة تكنولوجيا المعلومات",
    "تطوير ألعاب الحاسوب",
  ],
  "الثاني ثانوي التوجيهي": [
    "الأمن السيبراني وإدارة الحوادث",
    "البرمجة",
    "إدارة مشاريع تكنولوجيا المعلومات",
    "مقدمة في الذكاء الاصطناعي",
  ],
}
const buty = {
  العاشر: [
    "استكشاف مجال العناية بالشعر التجميل",
    "الجلد والشعر والأظافر",
    "مهام الاستقبال في الصالون",
    "ترويج وبيع المنتجات والخدمات للعملاء في الصالون",
    "شامبو وبلسم الشعر",
    "فن تصفيف الشعر",
    "فن تزيين الأظافر",
    " تقديم خدمات العناية ببشرة الوجه",
    "تطبيق مستحضرات التجميل",
    "تقنيات إزالة الشعر",
    "تقنيات إزالة الشعر",
    "تطبيق تقنيات المانيكير والباديكير",

  ],
  "الأول ثانوي": [

  ],
  "الثاني ثانوي التوجيهي": [

  ],
}

const sampleResources: Resource[] = [
  // Grade 10 IT Resources
  // Books L2 IT
  {
    id: "1",
    title: "استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    description: "كتاب الوحدة الاولى",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    downloadUrl: "https://drive.google.com/file/d/1ErBf6MvfhxbrUEtHcX1CQQbyBpYbVbws/view?usp=drive_link",
    fileSize: "11.4 MB",
    fileType: "PDF",
  },
  {
    id: "2",
    title: "نمذجة البيانات وجداول البيانات",
    description: "كتاب الوحدة الثانية",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "نمذجة البيانات وجداول البيانات",
    downloadUrl: "https://drive.google.com/file/d/1E9JXb7i1-FzR3Olg_w4SPZp5PiCZoXX-/view?usp=drive_link",
    fileSize: "6.9 MB",
    fileType: "PDF",
  },
  {
    id: "3",
    title: " مقدمة إلى شبكات الكمبيوتر",
    description: " كتاب الوحدة الثالثة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مقدمة إلى شبكات الكمبيوتر",
    downloadUrl: "https://drive.google.com/file/d/1b377tsMPMdLcxc9PpEgzlgIQ49iHLJt9/view?usp=drive_link",
    fileSize: "24.9 MB",
    fileType: "PDF",
  },
  {
    id: "4",
    title: " مقدمة في البرمجة",
    description: " كتاب الوحدة الرابعة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مقدمة في البرمجة",
    downloadUrl: "https://drive.google.com/file/d/1SoBXqpMh75HOA3ly_YwVmcCreDsIWLKd/view?usp=drive_link",
    fileSize: "33.5 MB",
    fileType: "PDF",
  },
  {
    id: "5",
    title: " مقدمة للرسومات الرقمية والرسوم المتحركة ",
    description: " كتاب الوحدة الخامسة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "  مقدمة للرسومات الرقمية والرسوم المتحركة",
    downloadUrl: "https://drive.google.com/file/d/1gGyEgJGBY6d__D07gYB_qoWlW29pzZwj/view?usp=drive_link",
    fileSize: "16.0 MB",
    fileType: "PDF",
  },
  {
    id: "6",
    title: "مقدمة لتطوير مو اقع الويب ",
    description: " كتاب الوحدة السادسة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "مقدمة لتطوير مو اقع الويب ",
    downloadUrl: "https://drive.google.com/file/d/1a8BbOrkWduOnYOFBZ0ehu7rBUU0x5Ef7/view?usp=drive_link",
    fileSize: "13.8 MB",
    fileType: "PDF",
  },
  {
    id: "7",
    title: "مقدمة في التطبيقات",
    description: " كتاب الوحدة السابعة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1qroSN3PvhrpGhEM7AKifciTeEws3MOKm/view?usp=drive_link",
    fileSize: "4.5 MB",
    fileType: "PDF",
  },
  {
    id: "8",
    title: " مقدمة في تصميم الألعاب",
    description: " كتاب الوحدة الثامنة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مقدمة في تصميم الألعاب",
    downloadUrl: "https://drive.google.com/file/d/1-1Qf8_kiTAwvA06U4OfE_Ni3UjICa0yz/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  // Assignments L2 IT
  {
    id: "9",
    title: " مهمة استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    description: " مهمة الوحدة الاولى",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " مهمة استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    downloadUrl: "https://drive.google.com/file/d/13NOq-g0ggjhjFet9Oy4gQKk2jENzpz3H/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "10",
    title: "  مهمة نمذجة البيانات و جداول البيانات",
    description: " مهمة الوحدة الثانية",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " مهمة نمذجة البيانات و جداول البيانات",
    downloadUrl: "https://drive.google.com/file/d/1l4RdyuMiiF2oSSp2b2UL6_CuQoKDtpDn/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "11",
    title: "مهمة مقدمة إلى شبكات الكمبيوتر الهدف أ",
    description: " مهمة الوحدة الثالثة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهمة مقدمة إلى شبكات الكمبيوتر",
    downloadUrl: "https://drive.google.com/file/d/1Smg9hhlyMWv_WOrZhCLLymgKmt9PYcvv/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "12",
    title: "مهمة مقدمة إلى شبكات الكمبيوتر الهدف ب+ج",
    description: " مهمة الوحدة الثالثة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهمة مقدمة إلى شبكات الكمبيوتر",
    downloadUrl: "https://drive.google.com/file/d/18SMO_0LCpdWDHi8FWZSJKGQP-XzFXTor/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "13",
    title: "  مهمة مقدمة في البرمجة هدف أ",
    description: " مهمة الوحدة الرابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهمة مقدمة في البرمجة",
    downloadUrl: "https://drive.google.com/file/d/13wx7mgPcCsq6j6grAlSjnu1t3lmT8hLj/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "14",
    title: "  مهمة مقدمة في البرمجة هدف ب+ج",
    description: " مهمة الوحدة الرابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهمة مقدمة في البرمجة",
    downloadUrl: "https://drive.google.com/file/d/1TntTwz0_HnAIafA7xXYg1SbUU60o6dTj/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  //.......
  {
    id: "15",
    title: " مهمة مقدمة للرسومات الرقمية والرسوم المتحركة  أ",
    description: " مهمة الوحدة الخامسة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهمة مقدمة للرسومات الرقمية والرسوم المتحركة",
    downloadUrl: "https://drive.google.com/file/d/1QWQYlR7y6zzCBY4tPYhdCFmyOxXGQxJ4/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  //...
  {
    id: "16",
    title: " مهمة مقدمة للرسومات الرقمية والرسوم المتحركة  ب+ج",
    description: " مهمة الوحدة الخامسة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهمة مقدمة للرسومات الرقمية والرسوم المتحركة",
    downloadUrl: "https://drive.google.com/file/d/1QWQYlR7y6zzCBY4tPYhdCFmyOxXGQxJ4/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "17",
    title: " مهمة مقدمة لتطوير مو اقع الويب هدف أ",
    description: " مهمة الوحدة السادسة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مهمة مقدمة لتطوير مو اقع الويب",
    downloadUrl: "https://drive.google.com/file/d/1ih1hblXu9my9Z8eacS61nBkIbWAeL61o/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "18",
    title: " مهمة مقدمة لتطوير مو اقع الويب هدف ب+ج",
    description: " مهمة الوحدة السادسة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مهمة مقدمة لتطوير مو اقع الويب",
    downloadUrl: "https://drive.google.com/file/d/1ih1hblXu9my9Z8eacS61nBkIbWAeL61o/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "19",
    title: "  مهمة مقدمة في التطبيقات هدف أ",
    description: " مهمة الوحدة السابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مهمة مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1SONOiU-95W61fYCKZcNBiY5ZLSHKkteA/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "20",
    title: "  مهمة مقدمة في التطبيقات هدف ب+ج",
    description: " مهمة الوحدة السابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مهمة مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1qMqSLdZsIKaHLuaRBkXr_Fixt-ARinru/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "21",
    title: "  مهمة مقدمة في تصميم الالعاب هدف أ",
    description: " مهمة الوحدة السابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مهمة مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1AXizRg9vUT0AuBoqq6F-QHDra5J1-1cj/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "22",
    title: "  مهمة مقدمة في تصميم الالعاب هدف ب+ج",
    description: " مهمة الوحدة السابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " مهمة مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1wtAq-3kJcAEpCjprZWBv0GuEJohrhz_-/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  // Specifications  L2 IT
  {
    id: "23",
    title: "كتاب المواصفات استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    description: "كتاب المواصفات الوحدة الاولى",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " كتاب المواصفات استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    downloadUrl: "https://drive.google.com/file/d/1ZIz9O-d-iJSLo18oMiaygl5uQkIPLer5/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "24",
    title: " كتاب المواصفات نمذجة البيانات و جداول البيانات",
    description: "كتاب المواصفات الوحدة الثانية",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " كتاب المواصفات نمذجة البيانات و جداول البيانات",
    downloadUrl: "https://drive.google.com/file/d/19_ZxHbbKu5FcPgVHJJ4CMQnAiQCuuNgT/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "25",
    title: " كتاب المواصفات مقدمة إلى شبكات الكمبيوتر",
    description: "كتاب المواصفات الوحدة الثالثة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " كتاب المواصفات مقدمة إلى شبكات الكمبيوتر",
    downloadUrl: "https://drive.google.com/file/d/19hpTbSSwTC5JQZ_ivr-73NMKDg6eLx5n/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "26",
    title: "كتاب المواصفات مقدمة في البرمجة",
    description: "كتاب المواصفات الوحدة الرابعة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " كتاب المواصفات مقدمة في البرمجة",
    downloadUrl: "https://drive.google.com/file/d/1vdZ1TzME0CQ2Miz1DQ6UYW_z-XBBzx1G/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "27",
    title: " كتاب المواصفات مقدمة للرسومات الرقمية والرسوم المتحركة",
    description: "كتاب المواصفات الوحدة الخامسة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " كتاب المواصفات مقدمة للرسومات الرقمية والرسوم المتحركة",
    downloadUrl: "https://drive.google.com/file/d/1qfO2D_grBFfCgVyypb6n2u5Qdvn7J-1-/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "28",
    title: " كتاب المواصفات مقدمة إلى تطوير مو اقع الويب",
    description: "كتاب المواصفات الوحدة السادسة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " كتاب المواصفات مقدمة إلى تطوير مو اقع الويب",
    downloadUrl: "https://drive.google.com/file/d/14i59gSJjbHhpWIoCXdAvKhsGiVnBRaTX/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "29",
    title: " كتاب المواصفات مقدمة في التطبيقات",
    description: "كتاب المواصفات الوحدة السابعة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " كتاب المواصفات مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1-HKuHWZagWsIsP9Pd0xjcGdMydoJgzwk/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "30",
    title: " كتاب المواصفات مقدمة في تصميم الألعاب",
    description: "كتاب المواصفات الوحدة الثامنة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " كتاب المواصفات مقدمة في تصميم الألعاب",
    downloadUrl: "https://drive.google.com/file/d/1C8mG-b5xwau_nyBIqh10pyOdf9umuBO7/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  // Explanations L2 IT
  {
    id: "31",
    title: " دليل المعلم استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    description: " دليل المعلم الوحدة الاولى",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " دليل المعلم استخدام تكنولوجيا المعلومات لدعم المعلومات والاتصالات في المؤسسات",
    downloadUrl: "https://drive.google.com/file/d/1FFAEfMxDRlTCmY88f69cnzKW3S311G3P/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },

  {
    id: "32",
    title: " دليل المعلم نمذجة البيانات و جداول البيانات",
    description: " دليل المعلم الوحدة الثانية",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " دليل المعلم نمذجة البيانات و جداول البيانات",
    downloadUrl: "https://drive.google.com/file/d/1Xes-6O78SbTxUyRIEA4575TEuu374jLd/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "33",
    title: " دليل المعلم مقدمة إلى شبكات الكمبيوتر هدف أ ",
    description: " دليل المعلم الوحدة الثالثة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "  دليل المعلم مقدمة إلى شبكات الكمبيوتر",
    downloadUrl: "https://drive.google.com/file/d/17M6h_QQ9x7ZVM8y_J1jgvgcr4bmQHk0u/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "34",
    title: " دليل المعلم مقدمة إلى شبكات الكمبيوتر هدف ب+ج",
    description: " دليل المعلم الوحدة الثالثة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: " الفصل الثاني",
    subject: " دليل المعلم مقدمة إلى شبكات الكمبيوتر",
    downloadUrl: "https://drive.google.com/file/d/1edFXYqXMJfaQJfkptE0Ck2k1bo_UUFmY/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "35",
    title: " دليل المعلم مقدمة في البرمجة هدف أ",
    description: " دليل المعلم الوحدة الرابعة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " دليل المعلم مقدمة في البرمجة",
    downloadUrl: "https://drive.google.com/file/d/1gyu9giZzlI3UB7X6_omAsjkCF9zhZTvx/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "36",
    title: " دليل المعلم مقدمة في البرمجة هدف ب+ج",
    description: " دليل المعلم الوحدة الرابعة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " دليل المعلم مقدمة في البرمجة",
    downloadUrl: "https://drive.google.com/file/d/1gyu9giZzlI3UB7X6_omAsjkCF9zhZTvx/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "37",
    title: " دليل المعلم مقدمة للرسومات الرقمية والرسوم المتحركة هدف أ",
    description: " دليل المعلم الوحدة الخامسة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " دليل المعلم مقدمة للرسومات الرقمية والرسوم المتحركة",
    downloadUrl: "https://drive.google.com/file/d/10sy0DnYfT51cufTI71cty_fGMiQ4XRYv/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "38",
    title: " دليل المعلم مقدمة للرسومات الرقمية والرسوم المتحركة هدف ب+ج",
    description: " دليل المعلم الوحدة الخامسة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " دليل المعلم مقدمة للرسومات الرقمية والرسوم المتحركة",
    downloadUrl: "https://drive.google.com/file/d/1uhRIC1sbeg1Oo_11i2p04Wpo3t3MDzEM/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },

  {
    id: "39",
    title: " دليل المعلم مقدمة لتطوير مو اقع الويب هدف أ",
    description: " دليل المعلم الوحدة السادسة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " دليل المعلم مقدمة لتطوير مو اقع الويب",
    downloadUrl: "https://drive.google.com/file/d/1RNvlIomcurgrjj6ODIo8-eqEmXmVo2MA/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "40",
    title: " دليل المعلم مقدمة لتطوير مو اقع الويب هدف ب+ج",
    description: " دليل المعلم الوحدة السادسة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " دليل المعلم مقدمة لتطوير مو اقع الويب",
    downloadUrl: "https://drive.google.com/file/d/1RNvlIomcurgrjj6ODIo8-eqEmXmVo2MA/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "41",
    title: " دليل المعلم مقدمة في التطبيقات هدف أ",
    description: " دليل المعلم الوحدة السابعة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " دليل المعلم مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1s_kja5xfmuuxdUKrWXL_OdwjoOlfyYcb/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "42",
    title: " دليل المعلم مقدمة في التطبيقات هدف ب+ج",
    description: " دليل المعلم الوحدة السابعة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " دليل المعلم مقدمة في التطبيقات",
    downloadUrl: "https://drive.google.com/file/d/1s_kja5xfmuuxdUKrWXL_OdwjoOlfyYcb/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "43",
    title: " دليل المعلم مقدمة في تصميم الألعاب هدف أ",
    description: " دليل المعلم الوحدة الثامنة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " دليل المعلم مقدمة في تصميم الألعاب",
    downloadUrl: "https://drive.google.com/file/d/1Fc0-QlxhBYFcCW6k1PbLBm_OKFBBx-Mz/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  {
    id: "44",
    title: " دليل المعلم مقدمة في تصميم الألعاب هدف ب+ج",
    description: " دليل المعلم الوحدة الثامنة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " دليل المعلم مقدمة في تصميم الألعاب",
    downloadUrl: "https://drive.google.com/file/d/1JLcHs6RS2m9_b3tM6fmMGBqn-PIzdmux/view?usp=drive_link",
    fileSize: "7.6 MB",
    fileType: "PDF",
  },
  ///////////.....................................................................


  // Grade 11 IT Resources
  // Books L3 IT (1) 
  {
    id: "45",
    title: "كتاب أنظمة تكنولوجيا المعلومات الإستراتيجية",
    description: "كتاب الوحدة الأولى",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    downloadUrl: "https://drive.google.com/file/d/1UPJppeWWj2WufCxTTIbQC11f3mJSGs06/view?usp=drive_link",
    fileSize: "12.0 MB",
    fileType: "PDF",
  },
  {
    id: "80",
    title: "دوسية أنظمة تكنولوجيا المعلومات الإستراتيجية",
    description: "دوسية الوحدة الأولى",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    downloadUrl: "https://drive.google.com/file/d/1TUCpV-EVZcdGXM2VR443Pd02sXAGhRQx/view?usp=drive_link",
    fileSize: "12.0 MB",
    fileType: "PDF",
  },
  {
    id: "46",
    title: "كتاب تطوير المواقع الإلكترونية",
    description: "كتاب الوحدة الثانية",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: " تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1EyrYXuCUbPbdrxW2PJm7hmwLlz_x3HMx/view?usp=drive_link",
    fileSize: "10.5 MB",
    fileType: "PDF",
  },
  {
    id: "47",
    title: "تطوير تطبيقات الهاتف المحمول",
    description: "كتاب الوحدة الثالثة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير تطبيقات الهاتف المحمول",
    downloadUrl: "https://drive.google.com/file/d/1Id-JkPe3kQtICu6N8XTysx3ID7ZRCyzj/view?usp=drive_link",
    fileSize: "15.2 MB",
    fileType: "PDF",
  },
  {
    id: "48",
    title: "الدعم الفني وإدارة تكنولوجيا المعلومات",
    description: "كتاب الوحدة الرابعة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "الدعم الفني وإدارة تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1gouF628abMFsE1hUZhk2crVC-vpSfD0m/view?usp=drive_link",
    fileSize: "14.8 MB",
    fileType: "PDF",
  },
  {
    id: "49",
    title: "تطوير ألعاب الحاسوب",
    description: "كتاب الوحدة الخامسة",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "تطوير ألعاب الحاسوب",
    downloadUrl: "https://drive.google.com/file/d/19ndas08iwr_tH0OB-qRtoBnnBUN5NEqN/view?usp=drive_link",
    fileSize: "16.0 MB",
    fileType: "PDF",
  },
  // Assignments L3 IT (1)
  {
    id: "50",
    title: "مهمة أنظمة تكنولوجيا المعلومات الإستراتيجية",
    description: "مهمة الوحدة الأولى",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    downloadUrl: "https://drive.google.com/file/d/1zkNE88w3YcSvMEufYJexXYohPWdSJK5T/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "51",
    title: "مهمة تطوير المواقع الإلكترونية",
    description: "مهمة الوحدة الثانية",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1TKQUEVV2cQYrUNxoyI6UEEFWQiNfhfmi/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "52",
    title: "مهمة تطوير تطبيقات الهاتف المحمول هدف أ",
    description: "مهمة الوحدة الثالثة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير تطبيقات الهاتف المحمول",
    downloadUrl: "https://drive.google.com/file/d/1StEgKp9nmsVeMVRdT1QMKI9OzTvIzeiN/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "53",
    title: "مهمة تطوير تطبيقات الهاتف المحمول هدف ب+ج",
    description: "مهمة الوحدة الثالثة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير تطبيقات الهاتف المحمول",
    downloadUrl: "https://drive.google.com/file/d/11s9_zwvndc3rnlWWOqJZGlinV200sS1Q/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "54",
    title: " مهمة الدعم الفني وإدارة تكنولوجيا المعلومات هدف أ",
    description: "مهمة الوحدة الرابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " الدعم الفني وإدارة تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1Fh481QyqZZSWBNNBcRSmWO96nmv3ng0T/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "55",
    title: " مهمة الدعم الفني وإدارة تكنولوجيا المعلومات هدف ب",
    description: "مهمة الوحدة الرابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " الدعم الفني وإدارة تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1BeM7WTdGBh3VNYvtn5cTUltGOy5bUBjh/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "56",
    title: " مهمة الدعم الفني وإدارة تكنولوجيا المعلومات هدف ج",
    description: "مهمة الوحدة الرابعة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " الدعم الفني وإدارة تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1w1PxmWFuFkdsolZMjVCuEPTOxCBIhNrt/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "57",
    title: " مهمة تطوير ألعاب الحاسوب هدف أ",
    description: "مهمة الوحدة الخامسة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " تطوير ألعاب الحاسوب",
    downloadUrl: "https://drive.google.com/file/d/1G_KrWtGijRr74Rzf25TS4Co8W9YaDv_U/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "58",
    title: " مهمة تطوير ألعاب الحاسوب هدف ب+ج",
    description: "مهمة الوحدة الخامسة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " تطوير ألعاب الحاسوب",
    downloadUrl: "https://drive.google.com/file/d/1m9o-fcMZ-m8S0nNcIdjKAaalbInyaSg5/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },

  // Specifications L3 IT (1)
  {
    id: "59",
    title: "كتاب المواصفات أنظمة تكنولوجيا المعلومات الإستراتيجية",
    description: "كتاب المواصفات الوحدة الأولى",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    downloadUrl: "https://drive.google.com/file/d/11BndZRSETRpxxGSKdBCrRr1pWZIcAKbH/view?usp=drive_link",
    fileSize: "9.0 MB",
    fileType: "PDF",
  },
  {
    id: "60",
    title: "كتاب المواصفات تطوير المواقع الإلكترونية",
    description: "كتاب المواصفات الوحدة الثانية",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1pUVG9wPn8_C9t_gW4gp3v9lrz5a5pb7u/view?usp=drive_link",
    fileSize: "8.5 MB",
    fileType: "PDF",
  },
  {
    id: "61",
    title: "كتاب المواصفات  تطوير تطبيقات الهاتف المحمول",
    description: "كتاب المواصفات الوحدة الثالثة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير  تطبيقات الهاتف المحمول",
    downloadUrl: "https://drive.google.com/file/d/17WCyxfUa9AV3470o_avYLs0JsPN0FOk5/view?usp=drive_link",
    fileSize: "8.5 MB",
    fileType: "PDF",
  },
  {
    id: "62",
    title: "كتاب المواصفات  الدعم الفني وإدارة تكنولوجيا المعلومات",
    description: "كتاب المواصفات الوحدة الرابعة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "الدعم الفني وإدارة تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1-QKr5Dvw4D8gBtt8hMNKoV9O-JiDrGuo/view?usp=drive_link",
    fileSize: "8.5 MB",
    fileType: "PDF",
  },
  {
    id: "63",
    title: "كتاب المواصفات تطوير ألعاب الحاسوب",
    description: "كتاب المواصفات الوحدة الخامسة",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " تطوير ألعاب الحاسوب",
    downloadUrl: "https://drive.google.com/file/d/1gaVGCXOgI2-Mf8cHDcHp29m0juIR3zJh/view?usp=drive_link",
    fileSize: "8.5 MB",
    fileType: "PDF",
  },

  // Explanations L3 IT (1)
  {
    id: "64",
    title: "دليل المعلم أنظمة تكنولوجيا المعلومات الإستراتيجية",
    description: "دليل المعلم الوحدة الأولى",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    downloadUrl: "",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "65",
    title: "دليل المعلم تطوير المواقع الإلكترونية",
    description: "دليل المعلم الوحدة الثانية",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/18LJcRFEd3wEa88drI2uCW9epAxmmTxti/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "66",
    title: "دليل  المعلم تطوير تطبيقات الهاتف المحمول هدف أ",
    description: "دليل المعلم الوحدة الثالثة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1fjem3VFj9UzB3JvFAbWsVEC4OQeCXxM9/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "67",
    title: "دليل  المعلم تطوير تطبيقات الهاتف المحمول هدف ب+ج",
    description: "دليل المعلم الوحدة الثالثة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1tNf0jLFFRArgw968_KPhcVFfQSP7jN2M/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "68",
    title: " دليل المعلم الدعم الفني وإدارة تكنولوجيا المعلومات هدف أ",
    description: "دليل المعلم الوحدة الرابعة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: " الدعم الفني وإدارة تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1RAl9ZSngJtGWGraB8icloUbsV3p-DEZx/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "69",
    title: " دليل المعلم تطوير ألعاب الحاسوب هدف أ",
    description: " دليل المعلم الوحدة الخامسة",
    type: "explanation",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "تطوير ألعاب الحاسوب",
    downloadUrl: "https://drive.google.com/file/d/1XEhzOE0kyQLyi6MQftn195GsNWLljPcW/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  // Assignments L3 IT (PSA)
  {
    id: "70",
    title: "مهمة تجريبية أنظمة تكنولوجيا المعلومات الإستراتيجية",
    description: "مهمة تجريبية الوحدة الأولى",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "أنظمة تكنولوجيا المعلومات الإستراتيجية",
    downloadUrl: "https://drive.google.com/file/d/149iZC3K8iqO2_f20Yf6VX3MCyVf-2a5A/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "71",
    title: "مهمة تجريبية تطوير المواقع الإلكترونية",
    description: "مهمة تجريبية الوحدة الثانية",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1Mw4GJMvyR7-IQxYs4FN1RqWL7pBsf68C/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "72",
    title: "مهمة تجريبية تطوير تطبيقات الهاتف المحمول هدف أ",
    description: "مهمة تجريبية الوحدة الثالثة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1iZOmkGyENJvwxjkLNsggY6pwJnFwj4jC/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },
  {
    id: "73",
    title: " مهمة تجريبية تطوير تطبيقات الهاتف المحمول هدف ب+ج",
    description: "مهمة تجريبية الوحدة الثالثة",
    type: "assignment",
    specialization: "تكنولوجيا المعلومات",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تطوير المواقع الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/1tkXB7XUo9x0MSZgw54quBTYFdGdbufzG/view?usp=drive_link",
    fileSize: "7.5 MB",
    fileType: "PDF",
  },


  // Grade 11 IT Resources
  // Books L3 IT (2)

  {
    id: "74",
    title: " كتاب الأمن السيبراني وإدارة الحوادث",
    description: " كتاب الوحدة الأولى",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: " الأمن السيبراني وإدارة الحوادث",
    downloadUrl: "https://drive.google.com/file/d/1BB96PD8E3wiBFUoApSRGrPSCZy-xPXjN/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "75",
    title: " دوسية الأمن السيبراني وإدارة الحوادث",
    description: " دوسية الوحدة الأولى",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: " الأمن السيبراني وإدارة الحوادث",
    downloadUrl: "https://drive.google.com/file/d/1g70YOJLCMHKKQ1FQTi_5PIMudWO8C3T4/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "76",
    title: " كتاب البرمجة",
    description: " كتاب الوحدة الثانية",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: " البرمجة ",
    downloadUrl: "https://drive.google.com/file/d/1cCa1-w7qlmQPyyrQYITsKf-noALwBqlp/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "77",
    title: " كتاب إدارة مشاريع تكنولوجيا المعلومات",
    description: " كتاب الوحدة الثالثة ",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: " إدارة مشاريع تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/18k5AWatEt5pp9kTKjHgdWpat5WjqMGvY/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "78",
    title: " كتاب إدارة مشاريع تكنولوجيا المعلومات",
    description: " كتاب الوحدة الثالثة ",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: " إدارة مشاريع تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/18k5AWatEt5pp9kTKjHgdWpat5WjqMGvY/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "79",
    title: " كتاب مقدمة في الذكاء الاصطناعي",
    description: " كتاب الوحدة  الرابعة ",
    type: "book",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: " مقدمة في الذكاء الاصطناعي",
    downloadUrl: "https://drive.google.com/file/d/1oCJDi001fvr2anddZrQMHpr7EvST15yq/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  // specifications L3 IT (2)
  {
    id: "81",
    title: " كتاب المواصفات الأمن السيبراني وإدارة الحوادث",
    description: "  الوحدة الأولى",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: " الأمن السيبراني وإدارة الحوادث",
    downloadUrl: "https://drive.google.com/file/d/1xoRstZtFO51Onm15Lty-3OCZm-azeTbO/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "82",
    title: " كتاب المواصفات البرمجة",
    description: "  الوحدة الثانية",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: " البرمجة ",
    downloadUrl: "https://drive.google.com/file/d/15YDiuPYR6Q-FABFz-Uco0iTKS3tNp5hV/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "83",
    title: " كتاب المواصفات إدارة مشاريع تكنولوجيا المعلومات",
    description: "  الوحدة الثالثة ",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: " إدارة مشاريع تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1SZB6UHBzNKQNuwggYKtsZclhuh7QBKse/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "84",
    title: " كتاب المواصفات إدارة مشاريع تكنولوجيا المعلومات",
    description: "  الوحدة الثالثة ",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: " إدارة مشاريع تكنولوجيا المعلومات",
    downloadUrl: "https://drive.google.com/file/d/1SZB6UHBzNKQNuwggYKtsZclhuh7QBKse/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "85",
    title: " كتاب المواصفات مقدمة في الذكاء الاصطناعي",
    description: "  الوحدة  الرابعة ",
    type: "specification",
    specialization: "تكنولوجيا المعلومات",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: " مقدمة في الذكاء الاصطناعي",
    downloadUrl: "https://drive.google.com/file/d/1GVfAKM4oqW7rS2P5LiYhy6n9XSG_dj6y/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  // buty l2 books

  {

    id: "86",
    title: " كتاب استكشاف مجال العناية بالشعر التجميل",
    description: "  الوحدة الاوالى",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " استكشاف مجال العناية بالشعر التجميل ",
    downloadUrl: "https://drive.google.com/file/d/1-k-5HI-4LepULvxxWfPjZFG1fM6dp0mH/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "87",
    title: " كتاب الجلد والشعر والأظافر",
    description: "   الوحدة الثانية",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " الجلد والشعر والأظافر",
    downloadUrl: "https://drive.google.com/file/d/1yblVQFggISVSYm7n41MXSIzdIoFvPsVL/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {

    id: "88",
    title: " كتاب مهام الاستقبال في الصالون",
    description: "  الوحدة  الثالثة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهام الاستقبال في الصالون",
    downloadUrl: "https://drive.google.com/file/d/1V5GGBtvxhk9s_2YIogkmU6v20APfFNSn/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "89",
    title: " كتاب ترويج وبيع المنتجات والخدمات للعملاء في الصالون",
    description: "  الوحدة  الرابعة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "  ترويج وبيع المنتجات والخدمات للعملاء في الصالون",
    downloadUrl: "https://drive.google.com/file/d/1YJCE2BJmkuDO5pjxFjaA3mAFdr33clyK/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "90",
    title: " كتاب شامبو وبلسم الشعر",
    description: "  الوحدة  الخامسة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " شامبو وبلسم الشعر",
    downloadUrl: "https://drive.google.com/file/d/1RcamF28i-GHglI62261Wd04Vzl2SYrAZ/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "91",
    title: " كتاب فن تصفيف الشعر",
    description: "الوحدة السادسة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " فن تصفيف الشعر",
    downloadUrl: "https://drive.google.com/file/d/11ut3mOlpZ8x_R7x969RgJjnD9E9X3CvX/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "92",
    title: " كتاب فن تزيين الأظافر",
    description: "  الوحدة السابعة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " فن تزيين الأظافر",
    downloadUrl: "https://drive.google.com/file/d/1_F83LyaHHCbdVQ3oB8RQccG3LsUCaw4z/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "93",
    title: " كتاب  تقديم خدمات العناية ببشرة الوجه",
    description: "  الوحدة الثامنة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تقديم خدمات العناية ببشرة الوجه",
    downloadUrl: "https://drive.google.com/file/d/1iNBy-sTN-cMkl2WaVewQT023am8nfZJN/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "94",
    title: " كتاب  تطبيق مستحضرات التجميل",
    description: "  الوحدة  التاسعة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تطبيق مستحضرات التجميل",
    downloadUrl: "https://drive.google.com/file/d/1EUEBCrXNRhigkVQmP071RK-wO5dqqaez/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "95",
    title: " كتاب تطبيق تقنيات المانيكير والباديكير",
    description: "  الوحدة  العاشرة",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تطبيق تقنيات المانيكير والباديكير",
    downloadUrl: "https://drive.google.com/file/d/1HrytQWQlPm4XYa0XAlduelu5MLFWBTV3/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "96",
    title: " كتاب المؤسسة التجارية",
    description: "  الوحدة  الحادية عشر",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " المؤسسة التجارية",
    downloadUrl: "https://drive.google.com/file/d/1rhDxbivDJIdFB1eK_e2Gbu4tm0lQZAxS/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {

    id: "97",
    title: " كتاب تقنيات إزالة الشعر",
    description: "  الوحدة  الثانية عشر",
    type: "book",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تقنيات إزالة الشعر",
    downloadUrl: "https://drive.google.com/file/d/170CxnnqNRb-euGkR-ulILRvsWuqYs1Si/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  //l3_1 by books
  {
    id: "98",
    title: " كتاب  تدريب صالون التجميل المهني ",
    description: "  الوحدةالأولى",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "تدريب صالون التجميل المهني",
    downloadUrl: "https://drive.google.com/file/d/1YeT647N2cS5goDOMnlS70o-TRn_IHfJ7/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "99",
    title: " كتاب  الصحة والتعافي ",
    description: "اللوحدةالثانية",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "الصحة والتعافي",
    downloadUrl: "https://drive.google.com/file/d/1aYy2T9E01_EXADAfzICgfXl1IrIXeMLo/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "100",
    title: " كتاب  الأساليب المتقدمة للعناية بالأظافر وتجميلها ",
    description: "  الوحدة الثالثة",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "الأساليب المتقدمة للعناية بالأظافروتجميلها",
    downloadUrl: "https://drive.google.com/file/d/1V1o5AbsbquSCTTQpiC2Adao5kE-f4nG4/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "101",
    title: " كتاب علاجات البشرة المتقدمة  ",
    description: " الوحدة الرابعة",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "علاجات البشرة المتقدمة",
    downloadUrl: "https://drive.google.com/file/d/1oZ931CKpxCqZ_efpuGfFiGFQ9yE88a2e/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "102",
    title: " كتاب المكياج الإبداعي وفن الحناء",
    description: " الوحدة الخامسة",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "المكياج الإبداعي وفن الحناء",
    downloadUrl: "https://drive.google.com/file/d/1MAJRzzkUd1VFTpJBxsNQ933By6UTfjXt/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "103",
    title: " كتاب تلوين وتفتيح الشعر وتقنية الهايلايت",
    description: "الوحدة السادسة",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "تلوين وتفتيح الشعر وتقنية الهايلايت",
    downloadUrl: "https://drive.google.com/file/d/122u1oGe-KmpYfY_U114r2Bfb7mreuJMk/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "104",
    title: " كتاب نظرة عامة على البيع والترويج",
    description: "الوحدة السابعة",
    type: "book",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "نظرة عامة على البيع والترويج",
    downloadUrl: "https://drive.google.com/file/d/1m-xyzGcfEaZqrdSz5Ak_e1TMkOu7KPGX/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //l3_2 by books

  {
    id: "105",
    title: " كتاب  قص الشعر والتصفيف ",
    description: " الوحدة الاولى",
    type: "book",
    specialization: "التجميل",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "قص الشعر والتصفيف",
    downloadUrl: "https://drive.google.com/file/d/1VcfrmPENF9scOfam3aLQomcwLn6MUuVK/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "106",
    title: " كتاب  التدليك والعلاج بالروائح العطرية ",
    description: " الوحدة الثانية",
    type: "book",
    specialization: "التجميل",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "التدليك والعلاج بالروائح العطرية",
    downloadUrl: "https://drive.google.com/file/d/14L8NMLqCNPEsBCNkiGGy3RTwCSa6GNpQ/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "107",
    title: " كتاب بدء مشروع وإدارته  ",
    description: "الوحدة الثالثة",
    type: "book",
    specialization: "التجميل",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "بدء مشروع وإدارته",
    downloadUrl: "https://drive.google.com/file/d/1TpyLCW64x-uKfineBSqEIqyLrKmToLXE/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  // l2 by specifications2/5
  {
    id: "108",
    title: " كتاب  المواصفات استكشاف مجال العناية بالشعر التجميل",
    description: " المواصفات الوحدة الأولى",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " استكشاف مجال العناية بالشعر التجميل",
    downloadUrl: "https://drive.google.com/file/d/1hgollkkmc-5OYcUPf2VxY3QXw7zE8a4a/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "109",
    title: " كتاب  المواصفات الجلد والشعر والأظافر",
    description: " المواصفات الوحدة الثانية",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " الجلد والشعر والأظافر",
    downloadUrl: "https://drive.google.com/file/d/1KyCX9rCfqtovqXgPRscyG2fw5sU2aSCr/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "110",
    title: " كتاب  المواصفات مهام الاستقبال في الصالون",
    description: " المواصفات الوحدة الثالثة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " مهام الاستقبال في الصالون",
    downloadUrl: "https://drive.google.com/file/d/1Vzb_yd4Ik9AzoVBhDbkkg3rQtwKwcbK4/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "111",
    title: " كتاب   المواصفات ترويج وبيع المنتجات والخدمات للعملاء في الصالون",
    description: " المواصفات الوحدة الرابعة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " ترويج وبيع المنتجات والخدمات للعملاء في الصالون",
    downloadUrl: "https://drive.google.com/file/d/1lCThxXOw_v1a7IWju9-q9BTQDgRfzN1N/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "112",
    title: " كتاب  المواصفات شامبو وبلسم الشعر",
    description: " المواصفات الوحدة  الخامسة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "  شامبو وبلسم الشعر",
    downloadUrl: "https://drive.google.com/file/d/1WEhGXqhivFsbUVPiIvj4g106l7pD0VOh/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "113",
    title: " كتاب  المواصفات فن تصفيف الشعر",
    description: " المواصفات الوحدة السادسة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "  فن تصفيف الشعر",
    downloadUrl: "https://drive.google.com/file/d/1R3beFJGGYwxOg68frf3ZjbuVXISaHqhN/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "114",
    title: " كتاب  المواصفات فن تزيين الأظافر",
    description: " المواصفات الوحدة  السابعة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: " فن تزيين الأظافر",
    downloadUrl: "https://drive.google.com/file/d/1XwvKb-_JD50_L0-38oDJo8fPgsrEgj0p/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "115",
    title: " كتاب  المواصفات تقديم خدمات العناية ببشرة الوجه",
    description: " المواصفات الوحدة  الثامنة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "  تقديم خدمات العناية ببشرة الوجه",
    downloadUrl: "https://drive.google.com/file/d/1AKxAFCHGSNLVB6LPQIZNIlLLpmGMQGeu/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "116",
    title: " كتاب  المواصفات تطبيق مستحضرات التجميل",
    description: " المواصفات الوحدة  التاسعة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "  تطبيق مستحضرات التجميل",
    downloadUrl: "https://drive.google.com/file/d/1MeeHiHBhkZdBrml_kqkQrKxtEi4Sc0gq/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "117",
    title: " كتاب  المواصفات تطبيق تقنيات المانيكير والباديكير",
    description: " المواصفات الوحدة  العاشرة",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تطبيق تقنيات المانيكير والباديكير",
    downloadUrl: "https://drive.google.com/file/d/1jyqEF45rQ62eHmBS6Xrc7qTH59aeFvGl/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "118",
    title: "كتاب المواصفات تقنيات ازالة الشعر ",
    description: " المواصفات الوحدة الحادية عشر ",
    type: "specification",
    specialization: "التجميل",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تقنيات ازالة الشعر",
    downloadUrl: "https://drive.google.com/file/d/1r4pQcWaRXKw-PJnMDLGxtkqG4r8ADmDe/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //spa l3_1
  {
    id: "119",
    title: " كتاب  المواصفات تدريب صالون التجميل المهني ",
    description: "  الوحدةالأولى",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "تدريب صالون التجميل المهني",
    downloadUrl: "https://drive.google.com/file/d/10PDJwYy2_loXDi247YsWvvtz61dEf3hr/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "120",
    title: " كتاب المواصفات الصحة والتعافي ",
    description: "اللوحدةالثانية",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "الصحة والتعافي",
    downloadUrl: "https://drive.google.com/file/d/19bmVoW4oQE7qAxRP-ukkhFIcyT8fAjU_/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "121",
    title: " كتاب المواصفات الأساليب المتقدمة للعناية بالأظافر وتجميلها ",
    description: "  الوحدة الثالثة",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "الأساليب المتقدمة للعناية بالأظافروتجميلها",
    downloadUrl: "https://drive.google.com/file/d/1gDnMOlLw1JGF-b9TcczvKsnx0Wq2eQl3/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "122",
    title: " كتاب  المواصفات علاجات البشرة المتقدمة  ",
    description: " الوحدة الرابعة",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "علاجات البشرة المتقدمة",
    downloadUrl: "https://drive.google.com/file/d/13VW0IoPXMFRev9zKyc6GhelVO87wS8e0/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "123",
    title: " كتاب المواصفات المكياج الإبداعي وفن الحناء",
    description: " الوحدة الخامسة",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "المكياج الإبداعي وفن الحناء",
    downloadUrl: "https://drive.google.com/file/d/1nFS-X9q_X0u3SYmKGv8qmB1ag_h2WO_Y/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "124",
    title: " كتاب المواصفات تلوين وتفتيح الشعر وتقنية الهايلايت",
    description: "",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "تلوين وتفتيح الشعر وتقنية الهايلايت",
    downloadUrl: "https://drive.google.com/file/d/1MefkmrWoywFCtFAMAxtOTZTgPxXHxDcN/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "125",
    title: " كتاب المواصفات نظرة عامة على البيع والترويج",
    description: "",
    type: "specification",
    specialization: "التجميل",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "نظرة عامة على البيع والترويج",
    downloadUrl: "https://drive.google.com/file/d/1AjCm45MaIEjF9_qWe6u8vDN0yXhhMBba/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //l3_2 by books

  {
    id: "126",
    title: " كتاب المواصفات قص الشعر والتصفيف ",
    description: " الوحدة الاولى",
    type: "specification",
    specialization: "التجميل",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "قص الشعر والتصفيف",
    downloadUrl: "https://drive.google.com/file/d/1LtGSrZt3PTLu5jwcX4H4SwSAG0oxD-WH/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "127",
    title: " كتاب المواصفات التدليك والعلاج بالروائح العطرية ",
    description: " الوحدة الثانية",
    type: "specification",
    specialization: "التجميل",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "التدليك والعلاج بالروائح العطرية",
    downloadUrl: "https://drive.google.com/file/d/1STE-XHmdRO_vkTpOj-Z10LJZjSTb-Yiz/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "128",
    title: " كتاب المواصفات بدء مشروع وإدارته  ",
    description: "الوحدة الثالثة",
    type: "specification",
    specialization: "التجميل",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "بدء مشروع وإدارته",
    downloadUrl: "https://drive.google.com/file/d/1-CFJnuFpSOmJdbk5zAqOtRUGwl09OQWz/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  // eng l2
  {
    id: "129",
    title: " كتاب   العمل بأمان وفاعلية في الورشة الهندسية  ",
    description: "  الوحدة الاولى",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " العمل بأمان وفاعلية في الورشة الهندسية",
    downloadUrl: "https://drive.google.com/file/d/1zEnftn-sUj9vrgXgaj6IT_BaRPUv4QE5/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "130",
    title: " كتاب   مهارات في المسائل الهندسية لابتكار الحلول     ",
    description: "  الوحدة الثانية",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "  مهارات في المسائل الهندسية لابتكار الحلول",
    downloadUrl: "https://drive.google.com/file/d/1VDUfHpJ9qTzFEt6Bp4etDPR5wJeDtpQF/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "131",
    title: " كتاب   التحقق من منتج هندسي  ",
    description: "  الوحدة الثالثة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: " التحقق من منتج هندسي",
    downloadUrl: "https://drive.google.com/file/d/1yIubxopc1aTJgo21Pat0WjOTzkAwAUo6/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "132",
    title: " كتاب الصيانة الهندسية",
    description: "  الوحدة الرابعة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "الصيانة الهندسية",
    downloadUrl: "https://drive.google.com/file/d/1d7GZA3vvEwSFNdtAfKFKAjCcWnHNbTTi/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "133",
    title: " كتاب الرياضيات لفني الهندسي ",
    description: "  الوحدة الخامس",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "الرياضيات لفني الهندسي",
    downloadUrl: "https://drive.google.com/file/d/1fBOienHtGRz9rZ5VtK0_iik8ACpXqFWx/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "134",
    title: " كتاب المواد الهندسية ",
    description: "  الوحدة السادسة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "المواد الهندسية",
    downloadUrl: "https://drive.google.com/file/d/1MY9ZL6ykFsdFW38OMgVJKty1IJcW2M63/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "135",
    title: " كتاب إنشاء الدوائر الكهربائية والإلكترونيةواختبارها ",
    description: "  الوحدة السابعة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "إنشاء الدوائر الكهربائية والإلكترونيةواختبارها",
    downloadUrl: "https://drive.google.com/file/d/11grQ1vPzaK_WOAwtwcMI0GMNtYaci4Ft/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "136",
    title: " كتاب البرمجة العامة ",
    description: "  الوحدة الثامنة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "البرمجة العامة",
    downloadUrl: "https://drive.google.com/file/d/1qd7BIlPs9-Nxzo_IfBNmM5CWr1wA6VMY/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "137",
    title: " كتاب تقنيات صيانة المركبات ",
    description: "  الوحدة التاسعة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "تقنيات صيانة المركبات",
    downloadUrl: "https://drive.google.com/file/d/1aa0TScs88l4KayZi5Kfe6nvv46aGZjXF/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "138",
    title: " كتاب   الرسم الهندسي",
    description: "  الوحدة العاشرة",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "الرسم الهندسي",
    downloadUrl: "https://drive.google.com/file/d/1QXgi2fF8pcHSKJ561rSC_LCedgeHEfp-/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "139",
    title: " كتاب   تقنيات تحسين الادارة ",
    description: "  الوحدة الحادية عشر",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "تقنيات تحسين الادارة ",
    downloadUrl: "https://drive.google.com/file/d/1o2n0R3htgfNFW7gXf2HX50esnYosAZaa/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "140",
    title: " كتاب  تقنيات التصنيع  ",
    description: "  الوحدة الثانية عشر",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: " تقنيات التصنيع",
    downloadUrl: "https://drive.google.com/file/d/1N7fzE_36yJhNKib8zMxuhgDRnTFph_PW/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "141",
    title: " كتاب   العلوم الكهربائية و الميكانيكة الهندسية ",
    description: "  الوحدة الثالثة عشر",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "العلوم الكهربائية و الميكانيكة الهندسية ",
    downloadUrl: "https://drive.google.com/file/d/1aEPyTIF-rpilxoC4GFdWfRtai3mYe8UR/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "142",
    title: " كتاب تشغيل و صيانة الانظمة والمكونات الكهربائية و الالكترونية  ",
    description: "  الوحدة الرابعة عشر",
    type: "book",
    specialization: "الهندسة",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "تشغيل و صيانة الانظمة والمكونات الكهربائية و الالكترونية",
    downloadUrl: "https://drive.google.com/file/d/1T6Z5gPi93_CnwNPft3Q7SR_PnqjneaxZ/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  // eng l3 (1)

  {
    id: "143",
    title: " كتاب  المبادئ الميكانيكية ",
    description: "  الوحدة الاولى ",
    type: "book",
    specialization: "الهندسة",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: " المبادئ الميكانيكية",
    downloadUrl: "https://drive.google.com/file/d/1yPiDnK9IHkxaVG9lGR6Fo8v164ZW4O8K/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "144",
    title: " كتاب  المبادئ الكهربائية و الالكترونية ",
    description: "  الوحدة الثانية ",
    type: "book",
    specialization: "الهندسة",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: " المبادئ الكهربائية و الالكترونية",
    downloadUrl: "https://drive.google.com/file/d/1CSeNGDRPzRCPER9QIdOK574JQCX-dlQG/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "145",
    title: " كتاب مبادئ التجاره والجوده التطبيقيه بالهندسه ",
    description: "  الوحدة الثالثة ",
    type: "book",
    specialization: "الهندسة",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: " مبادئ التجاره والجوده التطبيقيه بالهندسه",
    downloadUrl: "https://drive.google.com/file/d/1ulu55FQZCyiI1hbXUQ4hT_oFSqP8HLdH/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "146",
    title: " كتاب تقديم العمليات الهندسيه بامان كفريق",
    description: "  الوحدة الرابعة ",
    type: "book",
    specialization: "الهندسة",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "  تقديم العمليات الهندسيه بامان كفريق  ",
    downloadUrl: "https://drive.google.com/file/d/1kM1Ulr3PaT1PtrzcL00xV0WhuO9dgXoN/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "147",
    title: " كتاب تصميم وتصنيع المنتجات في مجال الهندسة",
    description: "  الوحدة الخامسة ",
    type: "book",
    specialization: "الهندسة",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "  تصميم وتصنيع المنتجات في مجال الهندسة ",
    downloadUrl: "https://drive.google.com/file/d/1p4rfw2j8Gzscb8o4Lk9oKBDMqlrCqvWe/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  // eng l3(2)

  {
    id: "148",
    title: " كتاب    محركات المركبات الكهربائية والهجينة  ",
    description: "  الوحدة الاولى تخصص صناعه السيارات الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "محركات المركبات الكهربائية والهجينة",
    downloadUrl: "https://drive.google.com/file/d/1T6CJjFdmyR2nPH5SSOzlQyQhVitp5oQ4/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "149",
    title: " كتاب  تقنية اللحام ",
    description: "  الوحدة الاولى تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "تقنية اللحام",
    downloadUrl: "https://drive.google.com/file/d/1seLNp8l4IBHMjmPbEW19wkbDuWcixRwS/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "150",
    title: " كتاب   الأجهزة والدوائر الإلكترونية   ",
    description: "  الوحدة الاولى تخصص الهندسه الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "الأجهزة والدوائر الإلكترونية",
    downloadUrl: "https://drive.google.com/file/d/13R4MsKjAk7OYUhC-RovqNs6sCx56lUya/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "151",
    title: " كتاب    أنظمة الدفع في المركبات الكهربائية  ",
    description: "  الوحدة الثانية تخصص صناعه السيارات الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "أنظمة الدفع في المركبات الكهربائية",
    downloadUrl: "https://drive.google.com/file/d/1HQB1c5SvMFfG_ym5XKAbf1onnn_98lz3/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "152",
    title: " كتاب  صيانة الأنظمة الميكانيكية",
    description: "  الوحدة الثانية تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "صيانة الأنظمة الميكانيكية",
    downloadUrl: "https://drive.google.com/file/d/1lDLfub0Hg79bM388PixnhaBs557-YfCq/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "153",
    title: " كتاب    الدوائر الإلكترونية التناظرية ",
    description: "  الوحدة الثانية تخصص الهندسه الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "الدوائر الإلكترونية التناظرية",
    downloadUrl: "https://drive.google.com/file/d/1jXUzuRbVT8FlZkznUb-s0-4Uq8a4pWhR/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //....................................................
  {
    id: "154",
    title: " كتاب    التنقل الكهربي  ",
    description: "  الوحدة الثالثة تخصص صناعه السيارات الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "التنقل الكهربي",
    downloadUrl: "https://drive.google.com/file/d/1GiQQ8DtEpcJg02BjcFIrimkjxYJU7kPf/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "155",
    title: " كتاب السلوك الميكانيكي للمواد المعدنية ",
    description: "  الوحدة الثالثة تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "السلوك الميكانيكي للمواد المعدنية",
    downloadUrl: "https://drive.google.com/file/d/1guD0rpTjACflKYO38WRxtyjMPQ39YMck/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "156",
    title: " كتاب    القياس والاختبار الإلكتروني للدوائر ",
    description: "  الوحدة الثالثة تخصص الهندسه الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "القياس والاختبار الإلكتروني للدوائر",
    downloadUrl: "https://drive.google.com/file/d/118aQm5c_dwC-614aPrpuj-fVd5e9T7lU/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "157",
    title: " كتاب    تشغيل أنظمة الإشعال الإلكترونية في المركبات واختبارها  ",
    description: "  الوحدة الرابعة تخصص صناعه السيارات الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "تشغيل أنظمة الإشعال الإلكترونية في المركبات واختبارها",
    downloadUrl: "https://drive.google.com/file/d/1kor1zJvGk1QXV_OkxdEgGZ-srBeS5zuH/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "158",
    title: "  كتاب السلوك الميكانيكي للمواد غير المعدنية",
    description: "  الوحدة الرابعة تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "السلوك الميكانيكي للمواد غير المعدنية",
    downloadUrl: "https://drive.google.com/file/d/1dgnkUpoZwgJqKi-vKY_1S5kHMFlgl05d/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "159",
    title: " كتاب   الأنظمة الإلكترونية التناظرية والرقمية   ",
    description: "  الوحدة الرابعة تخصص الهندسه الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "الأنظمة الإلكترونية التناظرية والرقمية",
    downloadUrl: "https://drive.google.com/file/d/1j9Kv63qqtR76RfddxewByANrZbaq87FS/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //...................................
  {
    id: "160",
    title: " كتاب   أنظمة التعليق والتوجيه والكبح في المركبات الخفيفة   ",
    description: "  الوحدة الخامسة تخصص صناعه السيارات الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "أنظمة التعليق والتوجيه والكبح في المركبات الخفيفة",
    downloadUrl: "https://drive.google.com/file/d/1GCVYH609lXukYZvh4e8TcQ4-ITrA2Ot9/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "161",
    title: "  كتاب عمليات المعالجة الآلية الثانوية المستخدمة في التصنيع",
    description: "  الوحدة الخامسة تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "عمليات المعالجة الآلية الثانوية المستخدمة في التصنيع",
    downloadUrl: "https://drive.google.com/file/d/13JOT_hoTvDjWpP_7jqyWBB9Qnxoi6OeM/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "162",
    title: " كتاب   المتحكمات المنطقية القابلة للبرمجة   ",
    description: "  الوحدة الخامسة تخصص الهندسه الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "المتحكمات المنطقية القابلة للبرمجة",
    downloadUrl: "https://drive.google.com/file/d/16K-OxxWq3uxN9ldJCAJKzHzJEH7E9-dd/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "163",
    title: " كتاب    تشغيل أنظمة نقل الحركة في المركبات الخفيفة وصيانتها  ",
    description: "  الوحدة السادسة تخصص صناعه السيارات الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "تشغيل أنظمة نقل الحركة في المركبات الخفيفة وصيانتها",
    downloadUrl: "https://drive.google.com/file/d/12YQiwM56IYxS5216TJdFrPBug0dZ88K3/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "164",
    title: "  كتاب عمليات التصنيع والتجميع",
    description: "  الوحدة السادسة تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "عمليات التصنيع والتجميع",
    downloadUrl: "https://drive.google.com/file/d/1fS2BwPXvWAGv5oXWBxxgN4mQmnzIFUkT/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "165",
    title: " كتاب   الروبوتات الصناعية   ",
    description: "  الوحدة السادسة تخصص الهندسه الكهربائيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "الروبوتات الصناعية",
    downloadUrl: "https://drive.google.com/file/d/1ovxU_gXMPYAnfswisxCA5Exvoj55scoG/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "166",
    title: "  كتاب عمليات المعالجة الآلية الثانوية المستخدمة في التصنيع",
    description: "  الوحدة السابعة تخصص الهندسه الميكانيكيه",
    type: "book",
    specialization: "الهندسة",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "عمليات المعالجة الآلية الثانوية المستخدمة في التصنيع",
    downloadUrl: "https://drive.google.com/file/d/13AUmcVp-QmUirDPbfRf2VBIudo9sTX6F/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //....................................................................................
  // Business Administration Resources l2 book

  {
    id: "167",
    title: "  كتاب الغرض من الشركة",
    description: "  الوحدة الاولى",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "الغرض من الشركة",
    downloadUrl: "https://drive.google.com/file/d/1yIcVWoB_5lkbhEL6roWMU09GNx14I083/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "168",
    title: "  كتاب مؤسسات ىالاعمال",
    description: "  الوحدة الثانية",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "مؤسسات ىالاعمال",
    downloadUrl: "https://drive.google.com/file/d/1EVq7MmAQHOXMm2MwgkvHTCgNA8aUFJJO/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "169",
    title: "  كتاب التنبؤ بالأداء المالي للشركة",
    description: "  الوحدة الثالثة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "التنبؤ بالأداء المالي للشركة",
    downloadUrl: "https://drive.google.com/file/d/1TzJ2M87tMQ-noUrn00TToR7lxDUiU7RS/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "170",
    title: "  كتاب خطة تسويق",
    description: "  الوحدة الرايعة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الأول",
    subject: "خطة تسويق",
    downloadUrl: "https://drive.google.com/file/d/1LmeNL47lQsyRea2e5Qw3dZTcoVIRYJgz/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //...................2
  {
    id: "171",
    title: "  كتاب إنشاء شركة صغيرة ",
    description: "  الوحدة الخامسة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "إنشاء شركة صغيرة ",
    downloadUrl: "https://drive.google.com/file/d/1mHaSHvTfxCVdGhtKVV6Q3ZxoZJSTAvVg/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "172",
    title: "  كتاب العمل ضمن فريق",
    description: "  الوحدة السادسة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "العمل ضمن فريق",
    downloadUrl: "https://drive.google.com/file/d/1iIXHTMXNGiQtotYl7Ztf5N1PIfCnhuUY/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "173",
    title: "  كتاب إدارة الشؤون المالية الشخصية",
    description: "  الوحدة السابعة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "إدارة الشؤون المالية الشخصية",
    downloadUrl: "https://drive.google.com/file/d/1-gNkQQIJw3OBoJXjRanfJ_U-dOAuOYMT/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "174",
    title: "  كتاب تقنيات العرض والترويج البصري لشركات البيع بالتجزئة",
    description: "  الوحدة الثامنة ",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثاني",
    subject: "تقنيات العرض والترويج البصري لشركات البيع بالتجزئة",
    downloadUrl: "https://drive.google.com/file/d/1TIfCNyyAGNCnBQ3_elHleuGuqGRdPP0y/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //.....................3
  {
    id: "175",
    title: "  كتاب الموظفون في الشركات",
    description: "  الوحدة التاسعة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "الموظفون في الشركات",
    downloadUrl: "https://drive.google.com/file/d/1ON9NiSMuE66Ln-8qqxPvhSeJV7nQasPg/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "176",
    title: "  كتاب الشركات عبر الإنترنت",
    description: "  الوحدة العاشرة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "الشركات عبر الإنترنت",
    downloadUrl: "https://drive.google.com/file/d/1MUGybReOqCJCu0waDKaVLmwWYeGz65n6/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  {
    id: "177",
    title: "  كتاب أخلاقيات العمل",
    description: "  الوحدة الحادية عشر",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "أخلاقيات العمل",
    downloadUrl: "https://drive.google.com/file/d/1U6crAMpmRIOSSHzYOL3S6UgeDfiZQGHm/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "178",
    title: "  كتاب إدارة شركة صغيرة",
    description: "  الوحدة الثانية عشر",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "العاشر",
    semester: "الفصل الثالث",
    subject: "إدارة شركة صغيرة",
    downloadUrl: "https://drive.google.com/file/d/1ts1TU7s4InsNjuj3lzZ8jLOF_c0IUP6O/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  //-----
  // bopk l3 (1)

  {
    id: "179",
    title: "  كتاب استكشاف الأعمال",
    description: "  الوحدة الاولى",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "استكشاف الأعمال",
    downloadUrl: "https://drive.google.com/file/d/1TwIlK7mgOnhIpsVUXRtu9Oyet8z3RV8v/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "180",
    title: "  كتاب البحث والتخطيط لحملة تسويقية",
    description: "  الوحدة الثانية",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الأول ثانوي",
    semester: "الفصل الأول",
    subject: "البحث والتخطيط لحملة تسويقية",
    downloadUrl: "https://drive.google.com/file/d/1p4fhKoj6_G6ruF-d16wfnJzkAn6c6tXV/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //.....2

  {
    id: "182",
    title: "  كتاب تمويل الأعمال",
    description: "  الوحدة الثالثة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الأول ثانوي",
    semester: "الفصل الثاني",
    subject: "تمويل الأعمال",
    downloadUrl: "https://drive.google.com/file/d/16xZelW6ivwLvdVHmonm1TPljtsSNBlKa/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //............3
  {
    id: "183",
    title: "  كتاب إدارة إحدى الفعاليات",
    description: "  الوحدة الرابعة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الأول ثانوي",
    semester: "الفصل الثالث",
    subject: "إدارة إحدى الفعاليات",
    downloadUrl: "https://drive.google.com/file/d/1a43MOK0lrEiC7a_ni4sGd0MxIrPsIqHA/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },


  // l3 (2)book

  {
    id: "185",
    title: "  كتاب مبادئ الإدارة",
    description: "  الوحدة الاولى",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الأول",
    subject: "مبادئ الإدارة",
    downloadUrl: "https://drive.google.com/file/d/1pbhgDxRzbdvooDPrde3Yyn67OKnFXjOu/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //....2
  {
    id: "186",
    title: "  كتاب اتخاذ قرارات الأعمال",
    description: "  الوحدة الثانية",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "اتخاذ قرارات الأعمال",
    downloadUrl: "https://drive.google.com/file/d/1YPK30l9OUB2tBHp8IPCEuPXwja_hWy4R/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "187",
    title: "  كتاب الموارد البشرية",
    description: "  الوحدة الثالثة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثاني",
    subject: "الموارد البشرية",
    downloadUrl: "https://drive.google.com/file/d/19MlX9wzzLSyYPv326ghT7FJReULNiMCZ/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //........3
  {
    id: "188",
    title: "  كتاب دراسة خدمة العملاء",
    description: "  الوحدة الرابعة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "دراسة خدمة العملاء",
    downloadUrl: "https://drive.google.com/file/d/1w1e3zK3wZx4M0acbxbYH6hegK9Oq0iYp/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },

  {
    id: "189",
    title: "  كتاب أخلاقيات الأعمال",
    description: "  الوحدة الخامسة",
    type: "book",
    specialization: "إدارة الأعمال",
    grade: "الثاني ثانوي (التوجيهي)",
    semester: "الفصل الثالث",
    subject: "أخلاقيات الأعمال",
    downloadUrl: "https://drive.google.com/file/d/18WTF7xdP9CRMCfJoKetYY88A1aJ1xLEo/view?usp=drive_link",
    fileSize: "8.0 MB",
    fileType: "PDF",
  },
  //................................................................



































]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const { user } = useAuth()
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [loadingBookmarks, setLoadingBookmarks] = useState(false)
  const [resources, setResources] = useState<Resource[]>(sampleResources)
  const [loadingResources, setLoadingResources] = useState(false)

  // Load Resources from Firestore
  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true)
      try {
        const querySnapshot = await getDocs(collection(db, "resources"))
        const firestoreResources: Resource[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Resource))

        // Merge with sample resources (avoid duplicates if any logic exists, but for now just concat)
        setResources([...sampleResources, ...firestoreResources])
      } catch (error) {
        console.error("Error fetching resources:", error)
        toast.error("فشل تحميل الموارد الإضافية")
      } finally {
        setLoadingResources(false)
      }
    }
    fetchResources()
  }, [])

  // Load Bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      if (user) {
        setLoadingBookmarks(true)
        try {
          const bookmarks = await getBookmarks(user.uid)
          setBookmarkedIds(bookmarks.map((b: any) => b.resourceId))
        } catch (error) {
          console.error("Error loading bookmarks:", error)
        } finally {
          setLoadingBookmarks(false)
        }
      } else {
        setBookmarkedIds([])
      }
    }
    loadBookmarks()
  }, [user])

  // Handle Toggle Bookmark
  const handleToggleBookmark = async (resource: Resource) => {
    if (!user) {
      toast.error("يجب عليك تسجيل الدخول لإضافة الموارد للمفضلة")
      return
    }

    // Optimistic update
    const isCurrentlyBookmarked = bookmarkedIds.includes(resource.id)
    if (isCurrentlyBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== resource.id))
      toast.success("تمت إزالة المورد من المفضلة")
    } else {
      setBookmarkedIds(prev => [...prev, resource.id])
      toast.success("تمت إضافة المورد للمفضلة")
    }

    try {
      await toggleBookmark(user.uid, resource)
    } catch (error) {
      // Revert on error
      if (isCurrentlyBookmarked) {
        setBookmarkedIds(prev => [...prev, resource.id])
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== resource.id))
      }
      toast.error("حدث خطأ أثناء حفظ التغييرات")
    }
  }

  // Filter Logic
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.includes(searchTerm) ||
        resource.description.includes(searchTerm) ||
        resource.subject.includes(searchTerm)
      const matchesType = selectedType === "all" || resource.type === selectedType
      const matchesSpecialization = selectedSpecialization === "all" || resource.specialization === selectedSpecialization
      const matchesGrade = selectedGrade === "all" || resource.grade === selectedGrade
      const matchesSemester = selectedSemester === "all" || resource.semester === selectedSemester

      return matchesSearch && matchesType && matchesSpecialization && matchesGrade && matchesSemester
    })
  }, [searchTerm, selectedType, selectedSpecialization, selectedGrade, selectedSemester])

  // Reset Filters
  const handleReset = () => {
    setSearchTerm("")
    setSelectedType("all")
    setSelectedSpecialization("all")
    setSelectedGrade("all")
    setSelectedSemester("all")
  }

  const getResourceTypeInfo = (type: string) => {
    return resourceTypes.find((t) => t.value === type) || resourceTypes[0]
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-2 mb-6 rounded-2xl bg-white/5 shadow-sm border border-white/10 backdrop-blur-md">
              <span className="px-3 py-1 text-xs font-medium text-white bg-primary rounded-lg ml-2 shadow-lg shadow-primary/20">جديد</span>
              <span className="text-sm font-medium text-slate-300">مكتبة شاملة لجميع التخصصات</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6 text-white drop-shadow-2xl">
              الموارد <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500">التعليمية</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              بوابة متكاملة تضم الكتب، الشروحات، أدلة المعلمين، والمهام الدراسية لمساعدتك في رحلتك التعليمية.
            </p>

            {/* Floating Search Bar */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 p-2">
                <Search className="w-6 h-6 text-slate-400 mr-3 ml-2" />
                <input
                  type="text"
                  placeholder="ابحث عن كتاب، تخصص، أو مادة..."
                  className="w-full bg-transparent border-none text-lg text-white placeholder-slate-400 focus:ring-0 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredResources.length > 0 && searchTerm && (
                  <Badge className="hidden sm:flex ml-2 bg-primary text-white hover:bg-primary/80">
                    {filteredResources.length} نتيجة
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slower"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 -mt-10 relative z-20">

        {/* Quick Access Shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType("all")}
            className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group ${selectedType === "all"
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
              }`}
          >
            <div className={`p-3 rounded-xl ${selectedType === "all" ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"}`}>
              <Library className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">الكل</span>
          </motion.div>

          {resourceTypes.map((type) => {
            const isSelected = selectedType === type.value
            return (
              <motion.div
                key={type.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type.value)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group ${isSelected
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${isSelected
                  ? "bg-white/20 text-white"
                  : `${type.color.split(' ')[0]} ${type.color.split(' ')[1]}`
                  }`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">{type.label}</span>
              </motion.div>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/4 space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                  <Filter className="w-5 h-5 text-primary" />
                  تصنيف الموارد
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-slate-400 hover:text-red-400 hover:bg-red-400/10 h-8">
                  إعادة تعيين
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">نوع الملف</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-primary/50">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="all">الكل</SelectItem>
                      {resourceTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">التخصص</label>
                  <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-primary/50">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="all">جميع التخصصات</SelectItem>
                      {specializations.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">الصف الدراسي</label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-primary/50">
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="all">جميع الصفوف</SelectItem>
                      {grades.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">الفصل الدراسي</label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-primary/50">
                      <SelectValue placeholder="اختر الفصل" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="all">جميع الفصول</SelectItem>
                      {semesters.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resources Grid */}
          <div className="w-full lg:w-3/4">
            {filteredResources.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-dashed border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Library className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد موارد مطابقة</h3>
                <p className="text-slate-400 max-w-md mx-auto">حاول تغيير معايير البحث أو الفلترة للعثور على ما تبحث عنه.</p>
                <Button onClick={handleReset} variant="link" className="mt-4 text-primary">إزالة جميع الفلاتر</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredResources.map((resource, index) => {
                    const typeInfo = getResourceTypeInfo(resource.type)
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="group h-full flex flex-col border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/5 backdrop-blur-md overflow-hidden hover:border-primary/50 hover:-translate-y-1">
                          <CardHeader className="relative p-0 h-40 overflow-hidden bg-black/20">
                            {/* Decorative Pattern */}
                            <div className={`absolute inset-0 opacity-20 ${typeInfo.color.split(' ')[0]} bg-[url('/grid-pattern.svg')]`}></div>
                            <div className="absolute top-4 right-4 z-10">
                              <Badge className="bg-black/50 text-white backdrop-blur-md border border-white/10 shadow-sm">
                                {resource.grade}
                              </Badge>
                            </div>

                            {/* Bookmark Button */}
                            <div className="absolute top-4 left-4 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-black/70 hover:text-primary transition-colors"
                                onClick={() => handleToggleBookmark(resource)}
                              >
                                {bookmarkedIds.includes(resource.id) ? (
                                  <BookmarkCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="absolute -bottom-6 left-6 z-10 w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 shadow-xl flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500">
                              <typeInfo.icon className={`h-8 w-8 ${typeInfo.color.split(' ')[1]}`} />
                            </div>
                          </CardHeader>

                          <CardContent className="flex-1 pt-10 pb-4 px-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className={`${typeInfo.color} bg-transparent border`}>
                                {typeInfo.label}
                              </Badge>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs font-medium text-slate-400">{resource.semester}</span>
                            </div>

                            <h3 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {resource.title}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-4 font-light">
                              {resource.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              <div className="inline-flex items-center text-[10px] sm:text-xs text-slate-300 bg-white/10 px-2 py-1 rounded-md">
                                <Building className="w-3 h-3 ml-1 text-slate-400" />
                                {resource.specialization}
                              </div>
                              {resource.fileType && (
                                <div className="inline-flex items-center text-[10px] sm:text-xs text-slate-300 bg-white/10 px-2 py-1 rounded-md">
                                  <FileText className="w-3 h-3 ml-1 text-slate-400" />
                                  {resource.fileType}
                                </div>
                              )}
                            </div>
                          </CardContent>

                          <CardFooter className="p-6 pt-0 border-t border-white/5 mt-auto bg-white/[0.02]">
                            <div className="flex items-center justify-between w-full mt-4 gap-3">
                              {resource.downloadUrl && (
                                <Button className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all rounded-xl" asChild>
                                  <a href={resource.downloadUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4 ml-2" />
                                    تحميل
                                  </a>
                                </Button>
                              )}

                              {typeInfo.value === "handout" && typeInfo.telegramUrl && (
                                <Button variant="outline" className="flex-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-xl" asChild>
                                  <a href={typeInfo.telegramUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                    تيليجرام
                                  </a>
                                </Button>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  )
}


