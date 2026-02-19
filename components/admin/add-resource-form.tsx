"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { db, storage } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Loader2, UploadCloud } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "العنوان يجب أن يكون حرفين على الأقل",
    }),
    description: z.string().optional(),
    type: z.string({
        required_error: "يرجى اختيار نوع المورد",
    }),
    specialization: z.string({
        required_error: "يرجى اختيار التخصص",
    }),
    grade: z.string({
        required_error: "يرجى اختيار الصف",
    }),
    semester: z.string({
        required_error: "يرجى اختيار الفصل",
    }),
    subject: z.string().min(2, "يرجى إدخال اسم المادة"),
})

export function AddResourceForm() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            subject: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!file) {
            toast.error("يرجى اختيار ملف للرفع")
            return
        }

        setUploading(true)
        try {
            // 1. Upload File
            const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`)
            const snapshot = await uploadBytes(storageRef, file)
            const downloadUrl = await getDownloadURL(snapshot.ref)

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, "resources"), {
                ...values,
                downloadUrl,
                size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                fileType: file.name.split('.').pop()?.toUpperCase() || "unknown",
                createdAt: serverTimestamp(),
            })

            toast.success("تم رفع المورد بنجاح")
            form.reset()
            setFile(null)
        } catch (error) {
            console.error(error)
            toast.error("حدث خطأ أثناء الرفع")
        } finally {
            setUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>عنوان المورد</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: كتاب البرمجة الشيئية" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>النوع</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر النوع" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="book">كتاب</SelectItem>
                                        <SelectItem value="specification">مواصفات</SelectItem>
                                        <SelectItem value="handout">شروحات</SelectItem>
                                        <SelectItem value="explanation">دليل معلم</SelectItem>
                                        <SelectItem value="assignment">مهام</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>التخصص</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر التخصص" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="تكنولوجيا المعلومات">تكنولوجيا المعلومات</SelectItem>
                                        <SelectItem value="الهندسة">الهندسة</SelectItem>
                                        <SelectItem value="إدارة الأعمال">إدارة الأعمال</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الصف</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الصف" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="العاشر">العاشر</SelectItem>
                                        <SelectItem value="الأول ثانوي">الأول ثانوي</SelectItem>
                                        <SelectItem value="الثاني ثانوي (التوجيهي)">الثاني ثانوي</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="semester"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>الفصل</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الفصل" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                                        <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                                        <SelectItem value="الفصل الثالث">الفصل الثالث</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>المادة</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: البرمجة" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>الوصف (اختياري)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="وصف قصير للملف..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>الملف (PDF, Word, etc.)</FormLabel>
                    <FormControl>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">اضغط للرفع</span> أو اسحب الملف هنا</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{file ? file.name : "PDF, DOCX (MAX. 10MB)"}</p>
                                </div>
                                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            </label>
                        </div>
                    </FormControl>
                </FormItem>

                <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الرفع...
                        </>
                    ) : (
                        "إضافة المورد"
                    )}
                </Button>
            </form>
        </Form>
    )
}
