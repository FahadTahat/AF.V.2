# دليل إضافة الترجمة للصفحات - Translation Guide

هذا الدليل يشرح كيفية إضافة الترجمة لأي صفحة في الموقع.

## الخطوات الأساسية

### 1. إضافة نصوص الترجمة في `lib/translations.ts`

أولاً، أضف النصوص التي تحتاجها في ملف `lib/translations.ts`:

```typescript
export const translations = {
  ar: {
    'page.example.title': 'عنوان الصفحة',
    'page.example.subtitle': 'عنوان فرعي',
    // ... بقية النصوص
  },
  en: {
    'page.example.title': 'Page Title',
    'page.example.subtitle': 'Subtitle',
    // ... rest of texts
  }
}
```

### 2. استخدام الترجمة في الصفحة

```typescript
"use client"  // Important for client components!

import { useLanguage } from "@/contexts/LanguageContext"

export default function ExamplePage() {
  const { t, language } = useLanguage()
  
  return (
    <div>
      <h1>{t('page.example.title')}</h1>
      <p>{t('page.example.subtitle')}</p>
      
      {/* For conditional text based on language */}
      {language === 'ar' ? 'نص عربي' : 'English text'}
    </div>
  )
}
```

## أمثلة عملية

### مثال 1: عنوان بسيط
```typescript
<h1 className="text-4xl font-bold">
  {t('about.title')}
</h1>
```

### مثال 2: قائمة مترجمة
```typescript
const features = [
  {
    title: t('feature.1.title'),
    desc: t('feature.1.desc')
  },
  {
    title: t('feature.2.title'),
    desc: t('feature.2.desc')
  }
]
```

### مثال 3: نص مشروط
```typescript
<p>
  {language === 'ar' 
    ? 'نص معقد بالعربية مع HTML' 
    : 'Complex English text with HTML'}
</p>
```

### مثال 4: اتجاه الأيقونات
```typescript
<ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
```

## الملفات التي تم تحديثها ✅

- [x] `components/navigation.tsx` - شريط التنقل
- [x] `components/footer.tsx` - التذييل
- [x] `app/page.tsx` - الصفحة الرئيسية
- [x] `components/language-toggle.tsx` - زر تغيير اللغة
- [x] `lib/translations.ts` - ملف الترجمة الرئيسي
- [x] `contexts/LanguageContext.tsx` - سياق اللغة

## الملفات المتبقية للتحديث 🔄

### الصفحات الأساسية
- [ ] `app/about/page.tsx`
- [ ] `app/calculator/page.tsx`
- [ ] `app/chat/page.tsx`
- [ ] `app/resources/page.tsx`
- [ ] `app/guide/page.tsx`
- [ ] `app/faq/page.tsx`
- [ ] `app/profile/page.tsx`
- [ ] `app/dubai-roadmap/page.tsx`
- [ ] `app/leaderboard/page.tsx`

### صفحات الأدوات (Tools)
- [ ] `app/tools/ai-chat/page.tsx`
- [ ] `app/tools/assignments/page.tsx`
- [ ] `app/tools/focus/page.tsx`
- [ ] `app/tools/interview/page.tsx`
- [ ] `app/tools/ai-checker/page.tsx`
- [ ] `app/tools/image-platform/page.tsx`
- [ ] `app/tools/btec-verbs/page.tsx`

### صفحات المصادقة (Auth)
- [ ] `app/auth/login/page.tsx`
- [ ] `app/auth/signup/page.tsx`

## ملاحظات مهمة

1. **"use client" directive**: يجب إضافتها في أعلى أي ملف يستخدم `useLanguage()`
2. **اتجاه النص (RTL/LTR)**: يتم تطبيقه تلقائياً على مستوى الصفحة
3. **الأيقونات المتجهة**: استخدم `rotate-180` للعربية إذا لزم الأمر
4. **الهوامش والحواشي**: استخدم `ml` للإنجليزية و `mr` للعربية

## كيفية الاستمرار

1. اختر صفحة من القائمة أعلاه
2. افتح الملف المطلوب
3. أضف `"use client"` في السطر الأول
4. استورد `useLanguage`
5. استبدل النصوص الثابتة بـ `t('key')`
6. أضف النصوص المطلوبة في `lib/translations.ts`
7. اختبر الصفحة بتغيير اللغة

## مثال كامل: صفحة About

راجع: `app/about/page.tsx` (تم تحديثها كمثال)
