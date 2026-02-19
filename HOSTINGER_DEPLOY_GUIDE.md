# 🚀 دليل رفع AF BTEC على Hostinger

## الملفات المطلوب رفعها

بعد تشغيل `npm run build`، ارفع هذه الملفات والمجلدات:

```
✅ .next/              ← مجلد البيلد (مهم جداً)
✅ public/             ← الملفات العامة والصور
✅ server.js           ← نقطة دخول Node.js
✅ package.json        ← قائمة الـ packages
✅ package-lock.json   ← إصدارات دقيقة للـ packages
✅ next.config.mjs     ← إعدادات Next.js
✅ .env.production     ← متغيرات البيئة (مهم!)

❌ node_modules/       ← لا ترفعها (كبيرة جداً)
❌ .env.local          ← لا ترفعها (للتطوير المحلي فقط)
❌ src/                ← لا ترفعها (الكود المصدري)
❌ .git/               ← لا ترفعها
```

## خطوات الرفع في hPanel

### 1. تفعيل Node.js
- hPanel → Node.js → Enable
- اختر إصدار: **Node.js 20.x**
- Application Entry Point: `server.js`
- Application Root: `/`

### 2. رفع الملفات
- hPanel → File Manager → انتقل لـ `public_html`
- ارفع الملفات المذكورة أعلاه

### 3. إضافة Environment Variables
في hPanel → Node.js → Environment Variables، أضف:
```
NODE_ENV=production
GOOGLE_API_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
HUGGING_FACE_TOKEN=...
```

### 4. تنصيب الـ Dependencies
في hPanel → Terminal (SSH):
```bash
cd public_html
npm install --production
```

### 5. تشغيل التطبيق
- hPanel → Node.js → **Start/Restart Application**

### 6. تفعيل SSL
- hPanel → SSL → Install SSL Certificate (مجاني)

## عند الفشل - استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| 502 Bad Gateway | أعد تشغيل Node.js من hPanel |
| صفحة بيضاء | تحقق من `NODE_ENV=production` |
| Firebase لا يعمل | تأكد من Environment Variables |
| `/api` لا يعمل | تأكد من `server.js` وتشغيل Node.js |
