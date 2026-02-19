"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, HelpCircle, Calculator, BookOpen, Settings, Users, MessageCircle, ChevronDown, Sparkles, Send } from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

const faqCategories = [
  { id: "general", name: "عام حول BTEC", icon: HelpCircle, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-500" },
  { id: "calculator", name: "حاسبة المعدل", icon: Calculator, color: "from-green-500 to-emerald-500", bg: "bg-green-500/10", text: "text-green-500" },
  { id: "resources", name: "الموارد التعليمية", icon: BookOpen, color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10", text: "text-purple-500" },
  { id: "programs", name: "البرامج والتقنية", icon: Settings, color: "from-orange-500 to-amber-500", bg: "bg-orange-500/10", text: "text-orange-500" },
  { id: "assessment", name: "التقييم والمهام", icon: Users, color: "from-red-500 to-rose-500", bg: "bg-red-500/10", text: "text-red-500" },
]

const faqs: FAQ[] = [
  // General BTEC Questions
  {
    id: "1",
    question: "ما هو نظام BTEC التعليمي؟",
    answer: "BTEC (Business and Technology Education Council) هو نظام تعليمي مهني يركز على التطبيق العملي والمهارات المهنية. يتميز بالتقييم المستمر من خلال المهام العملية بدلاً من الامتحانات التقليدية، ويهدف إلى إعداد الطلاب لسوق العمل أو للدراسة الجامعية.",
    category: "general",
    tags: ["BTEC", "نظام تعليمي", "تعريف"],
  },
  {
    id: "2",
    question: "ما الفرق بين BTEC والأنظمة التعليمية الأخرى؟",
    answer: "يختلف BTEC عن الأنظمة التقليدية في أنه يركز على التطبيق العملي والمهارات المهنية. بدلاً من الامتحانات النهائية، يتم التقييم من خلال مهام عملية ومشاريع. كما يوفر مسارات مرنة للانتقال إلى الجامعة أو سوق العمل مباشرة.",
    category: "general",
    tags: ["مقارنة", "نظام تعليمي", "مميزات"],
  },
  {
    id: "3",
    question: "كم عدد المستويات في BTEC؟",
    answer: "يتكون نظام BTEC من ستة مستويات رئيسية، تمتد من المستوى الأول (مقدمة) إلى المستوى السادس (بكالوريوس). وتُصنف كالتالي:\n\n- **المستوى 1**: مستوى مقدمة، يعادل التعليم الإعدادي.\n- **المستوى 2**: مستوى متوسط، يعادل شهادة GCSE.\n- **المستوى 3**: مستوى متقدم، يعادل شهادة A-Levels، ويفتح المجال للالتحاق بالجامعة أو سوق العمل.\n- **المستوى 4**: دبلوم عالٍ (HNC)، يعادل السنة الأولى من البكالوريوس.\n- **المستوى 5**: دبلوم عالٍ (HND)، يعادل السنة الثانية من البكالوريوس.\n- **المستوى 6**: يمثل مستوى درجة البكالوريوس (Bachelor’s Degree).\n\nكما توجد مستويات متقدمة (7 و8) تشمل الماجستير والدكتوراه.",
    category: "general",
    tags: ["مستويات", "هيكل", "تدرج"],
  },
  // Calculator Questions
  {
    id: "4",
    question: "كيف أحسب معدلي التراكمي باستخدام الحاسبة؟",
    answer: "لحساب معدلك التراكمي، اتبع هذه الخطوات: 1) اختر تخصصك من القائمة، 2) أدخل اسم كل مادة ووزنها (من 1-10)، 3) أدخل العلامة التي حصلت عليها (من 0-100)، 4) اضغط 'احسب المعدل'. الحاسبة ستقوم بحساب المعدل المرجح تلقائياً وعرض التقدير المناسب.",
    category: "calculator",
    tags: ["حساب المعدل", "خطوات", "استخدام"],
  },
  {
    id: "5",
    question: "ما معنى 'وزن المادة' في حاسبة المعدل؟",
    answer: "وزن المادة يعكس أهمية المادة في حساب المعدل التراكمي. المواد الأساسية والمتخصصة عادة ما تحمل وزناً أكبر (5-10)، بينما المواد المساعدة تحمل وزناً أقل (1-3). هذا يضمن أن المواد المهمة لها تأثير أكبر على معدلك النهائي.",
    category: "calculator",
    tags: ["وزن المادة", "أهمية", "تأثير"],
  },
  // Resources Questions
  {
    id: "7",
    question: "كيف يمكنني الوصول إلى الموارد التعليمية؟",
    answer: "يمكنك الوصول إلى الموارد من خلال صفحة 'الموارد التعليمية'. استخدم خيارات البحث والتصفية لإيجاد المواد المناسبة لتخصصك ومستواك. الموارد مقسمة إلى: كتب، دوسيات، شروحات، تلخيصات، ومهام.",
    category: "resources",
    tags: ["وصول", "بحث", "تصفية"],
  },
  {
    id: "8",
    question: "هل الموارد التعليمية مجانية؟",
    answer: "نعم، جميع الموارد المتاحة على الموقع مجانية تماماً. نهدف إلى توفير مصادر تعليمية عالية الجودة لجميع طلاب BTEC دون أي تكلفة. إذا كان لديك موارد مفيدة، نشجعك على مشاركتها مع المجتمع الطلابي.",
    category: "resources",
    tags: ["مجاني", "تكلفة", "مشاركة"],
  },
  // Programs Questions
  {
    id: "10",
    question: "ما هي البرامج الأساسية المطلوبة؟",
    answer: "البرامج الأساسية تشمل: Microsoft Office 365 (Word, Excel, PowerPoint)، متصفح ويب حديث، وبرنامج قراءة PDF. للتخصصات التقنية قد تحتاج لبرامج إضافية مثل VS Code أو Adobe Creative Cloud حسب المادة.",
    category: "programs",
    tags: ["برامج", "متطلبات", "تقنية"],
  },
  // Assessment Questions
  {
    id: "13",
    question: "ما الفرق بين Pass وMerit وDistinction؟",
    answer: "Pass (P): المستوى الأساسي للنجاح. Merit (M): مستوى أعلى يتطلب تحليلاً أعمق. Distinction (D): أعلى مستوى يتطلب تقييماً نقدياً، حلولاً مبتكرة، وفهماً عميقاً للموضوع.",
    category: "assessment",
    tags: ["تقييم", "درجات", "مستويات"],
  },
  {
    id: "14",
    question: "كيف أحصل على Distinction في مهامي؟",
    answer: "للحصول على Distinction: اقرأ معايير التقييم بعناية، قدم تحليلاً نقدياً، استخدم مصادر متنوعة، اربط النظرية بالتطبيق، وقدم حلولاً مبتكرة.",
    category: "assessment",
    tags: ["Distinction", "تميز", "نصائح"],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryInfo = (categoryId: string) => {
    return faqCategories.find((cat) => cat.id === categoryId) || faqCategories[0]
  }

  return (
    <div className="min-h-screen pt-36 pb-20 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="container relative z-10 px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">الأسئلة الشائعة</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            هل لديك <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">استفسار؟</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            لقد جمعنا لك إجابات لأكثر الأسئلة شيوعاً لمساعدتك على فهم كل ما يتعلق بـ BTEC وموقعنا التعليمي.
          </p>
        </motion.div>

        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/* Search Bar */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-2 shadow-xl">
              <Search className="h-6 w-6 text-slate-400 mr-4 ml-2" />
              <Input
                placeholder="عن ماذا تبحث؟ (مثال: حاسبة المعدل، كيفية التقييم...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none bg-transparent text-lg h-12 text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="bg-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-400 hidden sm:block border border-white/5">
                Press / to search
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-6 py-2 border-white/10 hover:bg-white/10 hover:text-white transition-all ${selectedCategory === "all"
                ? "bg-white/10 text-white border-primary/50"
                : "bg-transparent text-slate-400"
                }`}
            >
              الكل
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-2 border-white/10 hover:bg-white/10 hover:text-white transition-all space-x-2 space-x-reverse ${selectedCategory === category.id
                  ? `bg-white/10 text-white border-${category.text.split('-')[1]}-500/50`
                  : "bg-transparent text-slate-400"
                  }`}
              >
                <category.icon className={`w-4 h-4 ${selectedCategory === category.id ? "text-white" : category.text}`} />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* FAQs List */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredFAQs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFAQs.map((faq, index) => {
                    const categoryInfo = getCategoryInfo(faq.category)
                    return (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden px-0 data-[state=open]:border-primary/50 data-[state=open]:bg-white/10 transition-all duration-300 group"
                      >
                        <AccordionTrigger className="px-6 py-5 hover:no-underline">
                          <div className="flex items-center gap-4 w-full text-right">
                            <div className={`w-10 h-10 rounded-xl ${categoryInfo.bg} ${categoryInfo.text} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <categoryInfo.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors text-right flex-1 leading-snug">
                              {faq.question}
                            </h3>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                          <div className="mr-14">
                            <p className="text-slate-300 leading-relaxed text-base border-l-2 border-white/10 pl-4">
                              {faq.answer}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">لم نجد نتائج مطابقة</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  لم نعثر على أي أسئلة تطابق بحثك "{searchTerm}". جرب البحث بكلمات مختلفة أو تصفح الأقسام.
                </p>
                <Button
                  variant="link"
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-primary hover:text-primary/80"
                >
                  مسح البحث وعرض الكل
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Support CTA - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mt-24"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/10 border border-primary/20 p-8 md:p-12 text-center group">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-500"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/30 transition-colors duration-500"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25 transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">لم تجد الإجابة التي تبحث عنها؟</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
                فريقنا جاهز دائماً لمساعدتك. لا تتردد في التواصل معنا لأي استفسار أو اقتراح، وسنرد عليك في أقرب وقت ممكن.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-8 text-lg h-12">
                  <Send className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 text-lg h-12 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 ml-2 text-yellow-400" />
                  اقتراح سؤال جديد
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
