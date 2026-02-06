# 🚀 نشر المشروع على Vercel

## 📋 المتطلبات:

1. حساب على [Vercel](https://vercel.com)
2. GitHub/GitLab/Bitbucket repository
3. MongoDB Atlas connection string

## 🔧 خطوات النشر:

### 1️⃣ إعداد Repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2️⃣ رفع المشروع على Vercel:

#### الطريقة الأولى: من خلال Vercel Dashboard

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط **Add New Project**
3. اختر Repository الخاص بك
4. اضغط **Import**

#### الطريقة الثانية: من خلال Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

### 3️⃣ إضافة Environment Variables:

في Vercel Dashboard → Project Settings → Environment Variables:

أضف المتغيرات التالية:

```
MONGODB_URI=mongodb+srv://Abdo:Manna1234@cluster0.mea1xto.mongodb.net/Medical?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=medical-record-super-secret-jwt-key-2024-change-in-production
PORT=3000
```

**⚠️ مهم:** 
- استخدم JWT_SECRET قوي ومختلف للإنتاج
- لا تشارك هذه القيم مع أحد

### 4️⃣ تحديث base_url في Postman:

بعد النشر، ستحصل على URL مثل: `https://your-project.vercel.app`

حدّث `base_url` في Postman Collection:
```
base_url = https://your-project.vercel.app
```

## 📝 ملاحظات مهمة:

### ✅ ما يعمل على Vercel:
- Serverless Functions
- API Routes
- Environment Variables
- MongoDB Atlas connections

### ⚠️ قيود Vercel:
- **Serverless Functions** - كل request يعمل في function منفصلة
- **Timeout** - 10 ثواني للـ Hobby plan، 60 ثانية للـ Pro
- **Cold Start** - قد يستغرق أول request وقت أطول

### 🔧 إعدادات إضافية:

#### إذا كنت تستخدم MongoDB Atlas:
- تأكد من إضافة IP Address `0.0.0.0/0` في Network Access
- أو أضف Vercel IP ranges

#### تحديث DNS (اختياري):
- يمكنك ربط domain مخصص
- Vercel → Project Settings → Domains

## 🧪 اختبار بعد النشر:

1. **Health Check:**
   ```
   GET https://your-project.vercel.app/api/health
   ```

2. **Login:**
   ```
   POST https://your-project.vercel.app/api/auth/login
   {
     "email": "admin@medical.com",
     "password": "Admin123456"
   }
   ```

## 🔄 تحديث المشروع:

```bash
git add .
git commit -m "Update"
git push
```

Vercel سيقوم بـ deployment تلقائياً عند push.

## 📚 روابط مفيدة:

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/)

## 🆘 حل المشاكل:

### مشكلة: Connection timeout
- تأكد من إضافة IP في MongoDB Atlas
- تحقق من connection string

### مشكلة: Environment variables not working
- تأكد من إضافة المتغيرات في Vercel Dashboard
- أعد deploy بعد إضافة المتغيرات

### مشكلة: CORS errors
- تأكد من إعدادات CORS في `index.js`
- أضف domain الخاص بك في allowed origins
