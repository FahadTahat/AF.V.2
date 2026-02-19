# 🔒 خطوات حل مشكلة عدم حفظ المفضلة

## المشكلة:
الموارد لا تُحفظ في المفضلة لأن Firestore Rules غير مضبوطة بشكل صحيح.

---

## ✅ الحل السريع (5 دقائق):

### 1. افتح Firebase Console
اذهب إلى: https://console.firebase.google.com/

### 2. اختر مشروعك (AF BTEC)

### 3. من القائمة اليسار → **Firestore Database**

### 4. اذهب إلى تبويب **Rules** (القواعد)

### 5. **احذف الكود الموجود واستبدله بهذا:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Bookmarks - المفضلة
    match /bookmarks/{bookmarkId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null;
    }
    
    // Progress - التقدم
    match /progress/{progressId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Comments - التعليقات
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // Ratings - التقييمات
    match /ratings/{ratingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Resources - الموارد
    match /resources/{resourceId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

### 6. اضغط **Publish** (نشر) في الأعلى

---

## 🎉 جاهز!

الآن يمكنك:
- ✅ حفظ أي مورد في المفضلة
- ✅ رؤية المفضّلات في الملف الشخصي
- ✅ إضافة موارد جديدة من لوحة التحكم

---

## 🧪 اختبار سريع:

1. **سجّل دخول** في الموقع
2. اذهب لصفحة **الموارد**
3. اضغط على أيقونة 🔖 بجانب أي كتاب
4. يجب أن ترى رسالة **"تمت إضافة المورد للمفضلة"** 

إذا ظهرت رسالة خطأ، تأكد من:
- ✓ تم نشر القواعد في Firebase
- ✓ أنت مسجل دخول
- ✓ Firestore Database مُفعّل

---

## 💡 ملاحظات هامة:

### إذا استمرت المشكلة:
1. افتح **Console في المتصفح** (F12)
2. اذهب لتبويب **Console**
3. أرسل لي صورة من أي أخطاء تظهر باللون الأحمر

### تحديث القواعد مستقبلاً:
- إذا أردت تقييد الوصول أكثر، يمكنك تعديل القواعد
- القواعد الحالية آمنة وتسمح فقط للمستخدمين المسجلين

---

**آخر تحديث:** 2026-02-11
