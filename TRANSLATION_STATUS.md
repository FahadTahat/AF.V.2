# نظام الترجمة - دليل التطبيق السريع

## ✅ تم تحديثه بالكامل

### المكونات الأساسية
- ✅ `contexts/LanguageContext.tsx` - سياق اللغة
- ✅ `lib/translations.ts` - ملف الترجمة (شامل لجميع الصفحات)
- ✅ `components/language-toggle.tsx` - زر تغيير اللغة
- ✅ `components/navigation.tsx` - شريط التنقل
- ✅ `components/footer.tsx` - التذييل
- ✅ `app/page.tsx` - الصفحة الرئيسية
- ✅ `app/layout.tsx` - تم إضافة LanguageProvider

## 🔄 كيفية إضافة الترجمة لأي صفحة

### الخطوة 1: إضافة "use client"
```typescript
"use client"  // في أول سطر
```

### الخطوة 2: استيراد useLanguage
```typescript
import { useLanguage } from "@/contexts/LanguageContext"
```

### الخطوة 3: استخدام الترجمة
```typescript
export default function MyPage() {
  const { t, language } = useLanguage()
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{t('page.description')}</p>
      
      {/* للنصوص المشروطة */}
      {language === 'ar' ? 'نص عربي' : 'English text'}
    </div>
  )
}
```

## 📝 قائمة الصفحات المطلوب تحديثها

ملاحظة: نظراً لعدد الصفحات الكبير، قمت بإنشاء ملف الترجمة الشامل. الآن كل ما عليك فعله هو:

1. افتح الصفحة
2. أضف `"use client"` في أول سطر (إذا لم تكن موجودة)
3. استورد `useLanguage`
4. استخدم `t('key')` لترجمة النصوص

### الصفحات الأساسية (Priority 1)
- [ ] `app/about/page.tsx` - About
- [ ] `app/calculator/page.tsx` - Calculator
- [ ] `app/chat/page.tsx` - Community Chat
- [ ] `app/resources/page.tsx` - Resources
- [ ] `app/guide/page.tsx` - Student Guide
- [ ] `app/faq/page.tsx` - FAQ
- [ ] `app/profile/page.tsx` - Profile
- [ ] `app/dubai-roadmap/page.tsx` - Roadmap
- [ ] `app/leaderboard/page.tsx` - Leaderboard

### صفحات المصادقة (Priority 2)
- [ ] `app/auth/login/page.tsx` - Login
- [ ] `app/auth/signup/page.tsx` - Sign Up

### صفحات الأدوات (Priority 3)
- [ ] `app/tools/ai-chat/page.tsx` - AI Chat
- [ ] `app/tools/assignments/page.tsx` - Project Manager
- [ ] `app/tools/focus/page.tsx` - Focus Zone
- [ ] `app/tools/interview/page.tsx` - Interview Simulator
- [ ] `app/tools/ai-checker/page.tsx` - AI Checker
- [ ] `app/tools/image-platform/page.tsx` - Image Platform
- [ ] `app/tools/btec-verbs/page.tsx` - BTEC Verbs
- [ ] `app/tools/ni/page.tsx` - Smart Future

## 🎯 مفاتيح الترجمة المتاحة

جميع المفاتيح موجودة في `lib/translations.ts`. إليك بعض الأمثلة:

### Navigation
- `nav.home`, `nav.calculator`, `nav.resources`, etc.

### About Page
- `about.title`, `about.subtitle`, `about.who_am_i`, `about.certificates`, `about.skills`, `about.contact`

### Calculator
- `calc.title`, `calc.add_unit`, `calc.calculate`, `calc.reset`

### Resources
- `resources.title`, `resources.search`, `resources.filter`, `resources.download`

### Common
- `common.back`, `common.save`, `common.cancel`, `common.loading`, `common.error`

## 💡 نصائح مهمة

1. **الاتجاه المعكوس**: اللغة العربية RTL تلقائياً - لا حاجة لتعديل CSS
2. **الأيقونات**: استخدم `rotate-180` للعربية إذا لزم الأمر
3. **الهوامش**: استخدم margin conditionally حسب اللغة
4. **التاريخ والأرقام**: قد تحتاج formatting خاص

## 🚀 مثال كامل

```typescript
"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ExamplePage() {
  const { t, language } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">
        {t('example.title')}
      </h1>
      
      <p className="text-slate-600 mb-8">
        {t('example.description')}
      </p>
      
      <Button>
        {t('common.get_started')}
        <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
      </Button>
    </div>
  )
}
```

## ✨ النتيجة النهائية

بمجرد تطبيق الترجمة على جميع الصفحات، سيكون لديك:
- ✅ موقع كامل بلغتين (عربي/إنجليزي)
- ✅ تبديل فوري بين اللغات
- ✅ حفظ اللغة المفضلة
- ✅ اتجاه صحيح (RTL/LTR)
- ✅ تجربة مستخدم محسنة

---

**ملاحظة**: نظراً لحجم المشروع الكبير، أنصح بتطبيق الترجمة تدريجياً بدءاً من الصفحات الأكثر استخداماً.

النظام جاهز بالكامل والملف `lib/translations.ts` يحتوي على جميع النصوص المطلوبة! 🎉
