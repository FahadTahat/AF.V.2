"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Calculator, BookOpen, GraduationCap, Users, Sparkles, TrendingUp, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useAchievements } from "@/contexts/AchievementContext"
import { useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"

interface BTECSubject {
  id: string
  name: string
  creditHours: number
  grade: string
}

interface SharedSubject {
  id: string
  name: string
  weight: number
  fixedWeight: number
}

interface SectionGPA {
  weightedSum: number
  totalCredits: number
  gpa: number
}

export default function CalculatorPage() {
  const { t, language } = useLanguage()
  const { incrementProgress } = useAchievements()

  const creditHoursOptions = [
    { value: 120, label: "120 " + (language === 'ar' ? 'ساعة' : 'hours') },
    { value: 90, label: "90 " + (language === 'ar' ? 'ساعة' : 'hours') },
    { value: 60, label: "60 " + (language === 'ar' ? 'ساعة' : 'hours') },
  ]

  const btecGradeOptions = [
    { value: "P", label: `P - ${t('calc.pass')} (60)`, color: "bg-amber-500" },
    { value: "M", label: `M - ${t('calc.merit')} (80)`, color: "bg-blue-500" },
    { value: "D", label: `D - ${t('calc.distinction')} (100)`, color: "bg-emerald-500" },
  ]

  const [firstYearSubjects, setFirstYearSubjects] = useState<BTECSubject[]>([
    { id: "1", name: "", creditHours: 120, grade: "" },
  ])

  const [seniorYearSubjects, setSeniorYearSubjects] = useState<BTECSubject[]>([
    { id: "1", name: "", creditHours: 120, grade: "" },
  ])

  const [sharedSubjects, setSharedSubjects] = useState<SharedSubject[]>([
    { id: "1", name: language === 'ar' ? "اللغة الإنجليزية" : "English Language", weight: 0, fixedWeight: 0.1 },
    { id: "2", name: language === 'ar' ? "اللغة العربية" : "Arabic Language", weight: 0, fixedWeight: 0.1 },
    { id: "3", name: language === 'ar' ? "التربية الإسلامية" : "Islamic Studies", weight: 0, fixedWeight: 0.06 },
    { id: "4", name: language === 'ar' ? "التاريخ" : "History", weight: 0, fixedWeight: 0.04 },
  ])

  const [sectionGPAs, setSectionGPAs] = useState<{
    firstYear: SectionGPA | null
    seniorYear: SectionGPA | null
    shared: SectionGPA | null
  }>({
    firstYear: null,
    seniorYear: null,
    shared: null,
  })

  const [finalGPA, setFinalGPA] = useState<number | null>(null)

  const addBTECSubject = (section: "firstYear" | "seniorYear") => {
    const newSubject: BTECSubject = {
      id: Date.now().toString(),
      name: "",
      creditHours: 120,
      grade: "",
    }

    if (section === "firstYear") {
      setFirstYearSubjects([...firstYearSubjects, newSubject])
    } else {
      setSeniorYearSubjects([...seniorYearSubjects, newSubject])
    }
  }

  const removeBTECSubject = (section: "firstYear" | "seniorYear", id: string) => {
    if (section === "firstYear" && firstYearSubjects.length > 1) {
      setFirstYearSubjects(firstYearSubjects.filter((subject) => subject.id !== id))
    } else if (section === "seniorYear" && seniorYearSubjects.length > 1) {
      setSeniorYearSubjects(seniorYearSubjects.filter((subject) => subject.id !== id))
    }
  }

  const updateBTECSubject = (
    section: "firstYear" | "seniorYear",
    id: string,
    field: keyof BTECSubject,
    value: string | number,
  ) => {
    const updateFunction = (subjects: BTECSubject[]) =>
      subjects.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject))

    if (section === "firstYear") {
      setFirstYearSubjects(updateFunction(firstYearSubjects))
    } else {
      setSeniorYearSubjects(updateFunction(seniorYearSubjects))
    }
  }

  const updateSharedSubject = (id: string, field: keyof SharedSubject, value: string | number) => {
    setSharedSubjects((subjects) =>
      subjects.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject)),
    )
  }

  const btecGradeToNumber = (grade: string): number => {
    switch (grade) {
      case "P": return 60
      case "M": return 80
      case "D": return 100
      default: return 0
    }
  }

  const calculateBTECSectionGPA = (subjects: BTECSubject[]): SectionGPA | null => {
    const validSubjects = subjects.filter(
      (subject) => subject.name.trim() !== "" && subject.grade !== "" && subject.creditHours > 0,
    )

    if (validSubjects.length === 0) return null

    const weightedSum = validSubjects.reduce((sum, subject) => {
      const gradeValue = btecGradeToNumber(subject.grade)
      return sum + gradeValue * subject.creditHours
    }, 0)

    const totalCredits = validSubjects.reduce((sum, subject) => sum + subject.creditHours, 0)
    const gpa = weightedSum / totalCredits

    return {
      weightedSum,
      totalCredits,
      gpa: Math.round(gpa * 100) / 100,
    }
  }

  const calculateFinalGPA = () => {
    const firstYearGPA = calculateBTECSectionGPA(firstYearSubjects)
    const seniorYearGPA = calculateBTECSectionGPA(seniorYearSubjects)

    const validSharedSubjects = sharedSubjects.filter((subject) => subject.weight > 0)
    let sharedContribution = 0

    if (validSharedSubjects.length > 0) {
      sharedContribution = validSharedSubjects.reduce((sum, subject) => {
        return sum + subject.weight * subject.fixedWeight
      }, 0)
    }

    setSectionGPAs({
      firstYear: firstYearGPA,
      seniorYear: seniorYearGPA,
      shared:
        validSharedSubjects.length > 0
          ? {
            weightedSum: sharedContribution,
            totalCredits: validSharedSubjects.length,
            gpa: sharedContribution,
          }
          : null,
    })

    if (firstYearGPA || seniorYearGPA || validSharedSubjects.length > 0) {
      const firstYearContribution = firstYearGPA ? (firstYearGPA.weightedSum / 360) * 0.35 : 0
      const seniorContribution = seniorYearGPA ? (seniorYearGPA.weightedSum / 360) * 0.35 : 0
      const final = firstYearContribution + seniorContribution + sharedContribution
      setFinalGPA(Math.round(final * 100) / 100)
    } else {
      setFinalGPA(null)
    }
  }

  // Achievement Trigger
  useEffect(() => {
    if (finalGPA && finalGPA >= 0.8) { // Assuming distinction is high GPA, e.g. 0.8+
      incrementProgress('strategic_planner')
    }
  }, [finalGPA])



  const renderBTECSubjectSection = (
    subjects: BTECSubject[],
    section: "firstYear" | "seniorYear",
    title: string,
    icon: React.ReactNode,
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-white/5">
          <CardTitle className="flex items-center gap-3 text-white">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t('roadmap.units')}
            </Label>
            <Button
              onClick={() => addBTECSubject(section)}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-6"
            >
              <Plus className="h-4 w-4 ml-2" />
              {t('calc.add_subject')}
            </Button>
          </div>

          <AnimatePresence>
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="p-4 bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t('calc.subject_name')}</Label>
                      <Input
                        placeholder={t('calc.subject_placeholder')}
                        value={subject.name}
                        onChange={(e) => updateBTECSubject(section, subject.id, "name", e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t('calc.credits')}</Label>
                      <Select
                        value={subject.creditHours.toString()}
                        onValueChange={(value) =>
                          updateBTECSubject(section, subject.id, "creditHours", Number.parseInt(value))
                        }
                      >
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {creditHoursOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-slate-300">{t('calc.grade')}</Label>
                      <Select
                        value={subject.grade}
                        onValueChange={(value) => updateBTECSubject(section, subject.id, "grade", value)}
                      >
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                          <SelectValue placeholder={t('calc.select_grade')} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {btecGradeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                                {option.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => removeBTECSubject(section, subject.id)}
                      variant="outline"
                      size="sm"
                      disabled={subjects.length === 1}
                      className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderSharedSubjectSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-b border-white/5">
          <CardTitle className="flex items-center gap-3 text-white">
            <Users className="h-5 w-5 text-indigo-400" />
            <span>{t('calc.shared_subjects')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <p className="text-sm text-indigo-200">
              💡 {t('calc.weights_info')}
            </p>
          </div>

          {sharedSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">{t('calc.subject_name')}</Label>
                    <div className="p-3 bg-black/20 rounded-lg border border-white/5 font-medium text-white">
                      {subject.name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">
                      {t('calc.weight')} ({(subject.fixedWeight * 100).toFixed(0)}%)
                    </Label>
                    <div className="p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20 font-bold text-primary text-center">
                      {(subject.fixedWeight * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">{t('calc.mark')}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={subject.weight}
                      onChange={(e) => updateSharedSubject(subject.id, "weight", Number.parseFloat(e.target.value) || 0)}
                      className="bg-black/20 border-white/10 text-white placeholder-slate-500 focus:border-primary/50"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slower"></div>
      </div>

      <div className="container px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-slate-300">{t('calc.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-lg">
              {t('calc.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('calc.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="xl:col-span-2 space-y-6">
              <Tabs defaultValue="firstYear" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm p-1 rounded-xl border border-white/10">
                  <TabsTrigger
                    value="firstYear"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-slate-400 transition-all font-medium"
                  >
                    {t('calc.grade11')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="seniorYear"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-slate-400 transition-all font-medium"
                  >
                    {t('calc.grade12')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="shared"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg text-slate-400 transition-all font-medium"
                  >
                    {t('calc.shared')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="firstYear">
                  {renderBTECSubjectSection(
                    firstYearSubjects,
                    "firstYear",
                    t('calc.grade11_subjects'),
                    <BookOpen className="h-5 w-5 text-primary" />,
                  )}
                </TabsContent>

                <TabsContent value="seniorYear">
                  {renderBTECSubjectSection(
                    seniorYearSubjects,
                    "seniorYear",
                    t('calc.grade12_subjects'),
                    <GraduationCap className="h-5 w-5 text-primary" />,
                  )}
                </TabsContent>

                <TabsContent value="shared">
                  {renderSharedSubjectSection()}
                </TabsContent>
              </Tabs>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={calculateFinalGPA}
                  className="w-full h-14 bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-500 hover:to-pink-500 text-white text-lg font-bold shadow-2xl shadow-primary/25 rounded-2xl"
                  size="lg"
                >
                  <Calculator className="h-5 w-5 ml-2" />
                  {t('calc.calculate_final')}
                </Button>
              </motion.div>
            </div>

            {/* Results Sidebar */}
            <div className="space-y-6">
              <AnimatePresence>
                {finalGPA !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-xl overflow-hidden sticky top-24">
                      <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg text-white">{t('calc.your_gpa')}</CardTitle>
                        </div>
                        {(!sectionGPAs.firstYear || !sectionGPAs.seniorYear || !sectionGPAs.shared) && (
                          <Badge variant="outline" className="bg-amber-900/20 text-amber-500 border-amber-500/30">
                            {t('calc.partial')}
                          </Badge>
                        )}
                      </CardHeader>

                      <CardContent className="text-center space-y-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="relative"
                        >
                          <div className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 mb-2 filter drop-shadow-xl">
                            {finalGPA}%
                          </div>
                        </motion.div>

                        {(!sectionGPAs.firstYear || !sectionGPAs.seniorYear || !sectionGPAs.shared) && (
                          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <p className="text-xs text-blue-300">
                              💡 {t('calc.complete_hint')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {(sectionGPAs.firstYear || sectionGPAs.seniorYear || sectionGPAs.shared) && (
                <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl text-white">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {t('calc.breakdown')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {sectionGPAs.firstYear && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-300">{t('calc.grade11')}</span>
                          <span className="font-bold text-primary">
                            {sectionGPAs.firstYear.gpa}%
                          </span>
                        </div>
                        <Progress value={sectionGPAs.firstYear.gpa} className="h-2 bg-white/10" />
                        <p className="text-xs text-slate-500">
                          {t('calc.contribution')}: {((sectionGPAs.firstYear.weightedSum / 360) * 35).toFixed(1)}% / 35%
                        </p>
                      </div>
                    )}

                    {sectionGPAs.seniorYear && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-300">{t('calc.grade12')}</span>
                          <span className="font-bold text-primary">
                            {sectionGPAs.seniorYear.gpa}%
                          </span>
                        </div>
                        <Progress value={sectionGPAs.seniorYear.gpa} className="h-2 bg-white/10" />
                        <p className="text-xs text-slate-500">
                          {t('calc.contribution')}: {((sectionGPAs.seniorYear.weightedSum / 360) * 35).toFixed(1)}% / 35%
                        </p>
                      </div>
                    )}

                    {sectionGPAs.shared && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-300">{t('calc.shared')}</span>
                          <span className="font-bold text-primary">
                            {(sectionGPAs.shared.gpa * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={(sectionGPAs.shared.gpa / 30) * 100} className="h-2 bg-white/10" />
                        <p className="text-xs text-slate-500">
                          {t('calc.contribution')}: {sectionGPAs.shared.gpa.toFixed(1)}% / 30%
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Info Cards */}
              <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl text-white">
                <CardHeader className="border-b border-white/5">
                  <CardTitle className="text-base">{t('calc.grading_system')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm pt-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></span>
                      <span className="text-slate-300">D - {t('calc.distinction')}</span>
                    </span>
                    <span className="font-bold text-emerald-500">100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20"></span>
                      <span className="text-slate-300">M - {t('calc.merit')}</span>
                    </span>
                    <span className="font-bold text-blue-500">80</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/20"></span>
                      <span className="text-slate-300">P - {t('calc.pass')}</span>
                    </span>
                    <span className="font-bold text-amber-500">60</span>
                  </div>
                </CardContent>
              </Card>

              {/* Calculation Method Card */}
              <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl text-white">
                <CardHeader className="border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{t('calc.method')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Weights Section */}
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {t('calc.weights')}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-300 mr-4 border-r-2 border-white/10 pr-4">
                      <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span>{t('calc.grade11')}</span>
                        <Badge variant="outline" className="font-bold text-primary bg-primary/10 border-primary/20">35%</Badge>
                      </li>
                      <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span>{t('calc.grade12')}</span>
                        <Badge variant="outline" className="font-bold text-primary bg-primary/10 border-primary/20">35%</Badge>
                      </li>
                      <li className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span>{t('calc.shared')}</span>
                        <Badge variant="outline" className="font-bold text-indigo-400 bg-indigo-500/10 border-indigo-500/20">30%</Badge>
                      </li>
                    </ul>
                  </div>

                  {/* Common Subjects Breakdown */}
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      {t('calc.shared')}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 mr-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                        <span className="text-xs font-semibold text-slate-300 mb-1 group-hover:text-white transition-colors">{language === 'ar' ? 'إنجليزي' : 'English'}</span>
                        <span className="text-xl font-black text-indigo-400">10%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                        <span className="text-xs font-semibold text-slate-300 mb-1 group-hover:text-white transition-colors">{language === 'ar' ? 'عربي' : 'Arabic'}</span>
                        <span className="text-xl font-black text-indigo-400">10%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                        <span className="text-xs font-semibold text-slate-300 mb-1 group-hover:text-white transition-colors">{language === 'ar' ? 'تربية إسلامية' : 'Islamic Studies'}</span>
                        <span className="text-xl font-black text-indigo-400">6%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                        <span className="text-xs font-semibold text-slate-300 mb-1 group-hover:text-white transition-colors">{language === 'ar' ? 'تاريخ' : 'History'}</span>
                        <span className="text-xl font-black text-indigo-400">4%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
