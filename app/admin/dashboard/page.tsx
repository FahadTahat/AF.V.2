"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AddResourceForm } from "@/components/admin/add-resource-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldAlert, FileText, Users, Settings } from "lucide-react"

export default function AdminDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("resources")

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login")
        }
    }, [user, loading, router])

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <ShieldAlert className="w-10 h-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
                        <p className="text-slate-400">إدارة موارد الموقع والمستخدمين</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-white/5 border border-white/10 p-1">
                        <TabsTrigger value="resources" className="data-[state=active]:bg-primary">
                            <FileText className="w-4 h-4 ml-2" />
                            إدارة الموارد
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-primary">
                            <Users className="w-4 h-4 ml-2" />
                            المستخدمين
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
                            <Settings className="w-4 h-4 ml-2" />
                            الإعدادات
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="resources">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                    <CardHeader>
                                        <CardTitle>إضافة مورد جديد</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <AddResourceForm />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-2">
                                <Card className="border-white/10 bg-white/5 backdrop-blur-xl h-full">
                                    <CardHeader>
                                        <CardTitle>الموارد المرفوعة</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center text-slate-400 py-10">
                                            جاري العمل على عرض القائمة...
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>كل المستخدمين</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400">قريباً...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>إعدادات الموقع</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400">قريباً...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
