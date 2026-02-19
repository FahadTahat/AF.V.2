# 🎨 الهوية البصرية الكاملة لموقع AF BTEC

## 📋 نظرة عامة
**AF BTEC Platform** هو الموقع التعليمي الأول في المملكة لطلاب BTEC، مصمم بهوية بصرية حديثة وفخمة تجمع بين الاحترافية والابتكار.

---

## 🎨 لوحة الألوان الأساسية

### الألوان الرئيسية
```css
/* الأزرق الأساسي - Primary Blue */
--primary: #3b82f6 (hsl(217, 91%, 60%))
الاستخدام: الأزرار الرئيسية، الروابط، العناصر التفاعلية

/* الوردي الثانوي - Pink Accent */
--secondary: #ec4899 (hsl(330, 81%, 60%))
الاستخدام: التأكيدات، التدرجات، العناصر المميزة

/* البنفسجي المساعد - Purple Helper */
--purple: #8b5cf6 (#a855f7)
الاستخدام: التدرجات، المؤثرات، الإضاءة
```

### ألوان الخلفية
```css
/* خلفية داكنة - Dark Background */
--background: #000000 (hsl(0, 0%, 0%))

/* تدرج الخلفية الأساسي */
background: radial-gradient(
  circle at top center, 
  #2e1065 0%,      /* بنفسجي داكن */
  #0f172a 50%,     /* أزرق-رمادي */
  #020617 100%     /* أسود مزرق */
)

/* خلفيات البطاقات */
--card: #1e293b (hsl(222, 47%, 11%))
```

### ألوان النصوص
```css
/* نص أساسي */
--foreground: #ffffff (hsl(0, 0%, 100%))

/* نص ثانوي */
--muted-foreground: #94a3b8 (hsl(215, 20%, 65%))

/* نص رمادي فاتح */
--slate-300: #cbd5e1
--slate-400: #94a3b8
```

### تدرجات لونية مميزة
```css
/* التدرج الأساسي - Primary Gradient */
background: linear-gradient(135deg, #3b82f6, #ec4899)

/* تدرج الأزرق-البنفسجي */
background: linear-gradient(135deg, #3b82f6, #8b5cf6)

/* تدرج ثلاثي الألوان */
background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)

/* تدرجات الميزات */
- from-blue-500 to-cyan-500
- from-purple-500 to-pink-500
- from-indigo-500 to-cyan-500
- from-violet-500 to-fuchsia-500
- from-emerald-500 to-green-500
- from-amber-500 to-orange-500
- from-red-500 to-rose-500
```

---

## 🔤 الطباعة والخطوط

### الخط الأساسي
```css
font-family: 'Tajawal', sans-serif

/* الأوزان المستخدمة */
font-weight: 200  /* Extra Light */
font-weight: 300  /* Light */
font-weight: 400  /* Regular */
font-weight: 500  /* Medium */
font-weight: 700  /* Bold */
font-weight: 800  /* Extra Bold */
font-weight: 900  /* Black */
```

### أحجام العناوين
```css
/* عنوان رئيسي ضخم - Hero Title */
font-size: 5rem (80px)      /* Desktop */
font-size: 4.5rem (72px)    /* Tablet */
font-size: 3rem (48px)      /* Mobile */
font-weight: 900

/* عنوان رئيسي - H1 */
font-size: 3rem (48px)      /* Desktop */
font-size: 2.25rem (36px)   /* Mobile */
font-weight: 900

/* عنوان ثانوي - H2 */
font-size: 2.25rem (36px)
font-weight: 800

/* عنوان فرعي - H3 */
font-size: 1.875rem (30px)
font-weight: 700

/* نص عادي - Body */
font-size: 1rem (16px)
font-weight: 400

/* نص كبير - Large Text */
font-size: 1.25rem (20px)
font-weight: 300
```

### تحسينات الخط
```css
font-feature-settings: "kern" 1, "liga" 1, "calt" 1
text-rendering: optimizeLegibility
-webkit-font-smoothing: antialiased
-moz-osx-font-smoothing: grayscale
```

---

## 🪟 Glassmorphism (التأثيرات الزجاجية)

### Glass Panel - لوحة زجاجية أساسية
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### Glass Card - بطاقة زجاجية
```css
.glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}
```

### Glass Card Hover - عند التمرير
```css
.glass-card-hover:hover {
  background: rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 
    0 12px 48px 0 rgba(59, 130, 246, 0.15),
    0 0 0 1px rgba(59, 130, 246, 0.1) inset;
  transform: translateY(-8px) scale(1.02);
}
```

### Navigation Glass - شريط التنقل
```css
.nav-glass {
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
```

---

## ✨ التأثيرات والأنيميشن

### تأثيرات Hover
```css
/* Card Hover */
.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.3);
}

/* Button Hover */
.glass-button:hover {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}
```

### أنيميشن أساسية
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Glow Pulse */
@keyframes glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(59, 130, 246, 0.3),
      0 0 40px rgba(236, 72, 153, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(59, 130, 246, 0.5),
      0 0 60px rgba(236, 72, 153, 0.4);
  }
}
```

### تأثير التدرج المتحرك
```css
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
}
```

---

## 🎯 الأزرار

### الزر الأساسي - Primary Button
```css
background: linear-gradient(135deg, #3b82f6, #8b5cf6);
color: white;
padding: 0.75rem 2rem;
border-radius: 9999px; /* Fully rounded */
font-weight: 600;
transition: all 0.3s;
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);

/* Hover */
hover:scale-105
hover:shadow-xl
```

### الزر الثانوي - Outline Button
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.2);
color: white;
padding: 0.75rem 2rem;
border-radius: 9999px;

/* Hover */
hover:bg-white/10
hover:border-primary/50
```

### الزر الزجاجي - Glass Button
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 📦 البطاقات والمكونات

### بطاقة الميزة - Feature Card
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1.5rem; /* 24px */
padding: 2rem;
transition: all 0.5s;

/* Hover */
hover:bg-white/10
hover:border-white/20
hover:transform: translateY(-8px) scale(1.02)
```

### أيقونة الميزة - Feature Icon Container
```css
width: 4rem; /* 64px */
height: 4rem;
background: rgba(255, 255, 255, 0.1);
border-radius: 1rem; /* 16px */
border: 1px solid rgba(255, 255, 255, 0.05);

/* Hover */
hover:scale-110
transition: transform 0.5s
```

---

## 🌟 تأثيرات خاصة

### Custom Cursor - المؤشر المخصص
```css
position: fixed;
width: 20px;
height: 20px;
border-radius: 50%;
background: linear-gradient(135deg, #3b82f6, #ec4899);
mix-blend-mode: difference;
pointer-events: none;
z-index: 9999;

/* عند Hover */
width: 40px;
height: 40px;
background: rgba(255, 255, 255, 0.1);
border: 2px solid #ec4899;
```

### Scrollbar - شريط التمرير
```css
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 6px;
  border: 2px solid rgba(15, 23, 42, 0.6);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
}
```

### Gradient Text - نص متدرج
```css
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 🎨 الظلال والتمويه

### Shadow Levels
```css
/* Small Shadow */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* Medium Shadow */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

/* Large Shadow */
box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.3);

/* Extra Large Shadow */
box-shadow: 
  0 12px 48px 0 rgba(59, 130, 246, 0.15),
  0 0 0 1px rgba(59, 130, 246, 0.1) inset;

/* Glow Shadow */
box-shadow: 
  0 0 20px rgba(59, 130, 246, 0.3),
  0 0 40px rgba(236, 72, 153, 0.2);
```

### Blur Effects
```css
backdrop-filter: blur(10px);  /* Light blur */
backdrop-filter: blur(16px);  /* Medium blur */
backdrop-filter: blur(20px);  /* Heavy blur */
backdrop-filter: blur(30px);  /* Extra heavy blur */
```

---

## 📐 الحواف والأبعاد

### Border Radius
```css
--radius: 0.75rem; /* 12px - قاعدة */
--radius-sm: 0.5rem; /* 8px */
--radius-md: 0.625rem; /* 10px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px */
--radius-2xl: 1.5rem; /* 24px */
--radius-3xl: 2rem; /* 32px */
--radius-full: 9999px; /* Fully rounded */
```

### Spacing
```css
padding: 1rem;      /* 16px - صغير */
padding: 1.5rem;    /* 24px - متوسط */
padding: 2rem;      /* 32px - كبير */
padding: 3rem;      /* 48px - كبير جداً */

gap: 1rem;          /* 16px */
gap: 1.5rem;        /* 24px */
gap: 2rem;          /* 32px */
```

---

## 🌐 الشعار والأيقونات

### معلومات الشعار
```
الملفات:
- /public/logo.png - الشعار الأساسي
- /public/logo-full.png - الشعار الكامل
- /public/icon.png - الأيقونة (192x192, 512x512)

الألوان في الشعار:
- أزرق أساسي: #3b82f6
- وردي: #ec4899
- خلفية شفافة
```

### الأيقونات
```
مكتبة: Lucide React
حجم قياسي: 
- صغير: w-4 h-4 (16px)
- متوسط: w-5 h-5 (20px)
- كبير: w-6 h-6 (24px)
- كبير جداً: w-8 h-8 (32px)

ألوان:
- text-primary
- text-white
- text-slate-400
```

---

## 📱 PWA (Progressive Web App)

### Manifest Configuration
```json
{
  "name": "AF BTEC Platform",
  "short_name": "AF BTEC",
  "description": "The First Educational Platform for BTEC Students in Jordan",
  "theme_color": "#3b82f6",
  "background_color": "#020617",
  "display": "standalone",
  "orientation": "portrait"
}
```

### Viewport Settings
```
theme-color: #0f172a
width: device-width
initial-scale: 1
maximum-scale: 1
user-scalable: false
```

---

## 🎭 العناصر التفاعلية

### Particles.js - الجزيئات المتحركة
```javascript
// Configuration: /public/particles-config.json
عدد الجزيئات: ~80
اللون: #3b82f6, #ec4899
الحركة: عشوائية (random)
التفاعل: عند Hover
الشفافية: متدرجة
```

### Page Transitions
```css
مدة الانتقال: 0.3s - 0.5s
Easing: cubic-bezier(0.4, 0, 0.2, 1)
أنواع: fadeIn, slideUp, scaleIn
```

---

## 🎨 الوضع الليلي (افتراضي)

```css
defaultTheme: "dark"
enableSystem: true

الخلفية: black (#000000)
النص: white (#ffffff)
البطاقات: rgba(30, 41, 59, 0.4)
الحدود: rgba(255, 255, 255, 0.05-0.2)
```

---

## 🌍 الدعم متعدد اللغات

### RTL Support
```
lang: "ar"
dir: "rtl"
font: 'Tajawal'
font-feature-settings: "kern" 1, "liga" 1, "calt" 1, "rlig" 1
```

---

## 📊 إحصائيات الموقع

```
عدد الطلاب النشطين: 1000+
عدد الموارد التعليمية: 500+
عدد الأدوات الذكية: 11+
التوفر: 24/7
```

---

## 🎯 المبادئ التصميمية

### 1. الحداثة (Modern)
- تصميم نظيف ومعاصر
- استخدام أحدث تقنيات CSS
- تأثيرات Glassmorphism
- تدرجات لونية جذابة

### 2. الفخامة (Premium)
- تأثيرات ضوئية (Glow)
- أنيميشن سلسة
- ظلال عميقة
- تفاصيل دقيقة

### 3. الوضوح (Clarity)
- تباين عالي
- خطوط واضحة
- تسلسل هرمي قوي
- مساحات بيضاء كافية

### 4. التفاعلية (Interactivity)
- استجابة فورية
- تأثيرات Hover مميزة
- رسوم متحركة سلسة
- تغذية راجعة بصرية

### 5. سهولة الاستخدام (Accessibility)
- دعم RTL كامل
- تصميم متجاوب
- تباين لوني مناسب
- أنيميشن قابلة للتعطيل

---

## 📐 Grid System

### Breakpoints
```css
sm: 640px   /* Mobile Large */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large */
```

### Grid Layouts
```css
/* Mobile */
grid-cols-1

/* Tablet */
md:grid-cols-2

/* Desktop */
lg:grid-cols-3
lg:grid-cols-4
```

---

## 🎨 لوحة الألوان الموسعة

### Blues
```css
blue-500: #3b82f6 (Primary)
blue-600: #2563eb
cyan-500: #06b6d4
sky-500: #0ea5e9
```

### Purples
```css
purple-400: #c084fc
purple-500: #a855f7
purple-600: #9333ea
violet-500: #8b5cf6
indigo-500: #6366f1
```

### Pinks
```css
pink-400: #f472b6
pink-500: #ec4899
fuchsia-500: #d946ef
rose-500: #f43f5e
```

### Others
```css
emerald-500: #10b981
green-500: #22c55e
amber-500: #f59e0b
orange-500: #f97316
red-500: #ef4444
```

---

## 💼 معلومات التواصل

```
اسم الموقع: AF BTEC Platform
الوصف: The First Educational Platform for BTEC Students in Jordan
المطور: Ahmad AL-faqeih
النطاق: afbtec.com (إذا كان متاحاً)
```

---

## 📝 ملاحظات مهمة

1. **الاتساق**: استخدم نفس التأثيرات والمسافات عبر جميع الصفحات
2. **الأداء**: استخدم `will-change` للعناصر المتحركة فقط
3. **الوصول**: تأكد من تباين ألوان كافٍ (WCAG AA)
4. **الاستجابة**: اختبر على جميع أحجام الشاشات
5. **التوافق**: استخدم fallbacks للمتصفحات القديمة

---

## 🚀 التحديثات المستقبلية

- [ ] Dark/Light mode toggle
- [ ] مزيد من الألوان المخصصة
- [ ] تأثيرات 3D
- [ ] Micro-interactions إضافية
- [ ] Theme customization للمستخدمين

---

**آخر تحديث:** فبراير 2026
**الإصدار:** 1.0.0
