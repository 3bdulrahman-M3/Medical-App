# 📮 Postman Collection - Medical Record Backend API

## 📥 كيفية الاستيراد:

1. افتح Postman
2. اضغط على **Import** (أعلى يسار)
3. اختر ملف `Medical-Record-Backend.postman_collection.json`
4. اضغط **Import**

## 🔧 إعداد Environment Variables:

بعد الاستيراد، يمكنك تعديل المتغيرات في Collection Variables:

- `base_url`: `http://localhost:3000` (أو URL السيرفر الخاص بك)
- `auth_token`: سيتم تعبئته تلقائياً بعد تسجيل الدخول
- `patient_id`, `doctor_id`, `record_id`, `appointment_id`: أضفها يدوياً بعد إنشاء السجلات

## 📋 الـ Endpoints المتاحة:

### 🔐 Authentication
- **POST** `/api/auth/register` - تسجيل مستخدم جديد
- **POST** `/api/auth/login` - تسجيل الدخول (يحفظ التوكن تلقائياً)
- **GET** `/api/auth/profile` - الحصول على الملف الشخصي

### 👤 Patients
- **POST** `/api/patients` - إنشاء ملف مريض (Super Admin فقط)
- **GET** `/api/patients` - الحصول على جميع المرضى (Admin/Doctor)
- **GET** `/api/patients/:patientId` - الحصول على مريض محدد
- **PUT** `/api/patients/:patientId` - تحديث ملف مريض

### 👨‍⚕️ Doctors
- **POST** `/api/doctors` - إنشاء ملف طبيب (Super Admin فقط)
- **GET** `/api/doctors` - الحصول على جميع الأطباء
- **GET** `/api/doctors/:doctorId` - الحصول على طبيب محدد

### 📋 Medical Records
- **POST** `/api/medical-records` - إنشاء سجل طبي (Doctor فقط)
- **GET** `/api/medical-records` - الحصول على جميع السجلات
- **GET** `/api/medical-records/patient/:patientId` - الحصول على سجلات مريض محدد
- **GET** `/api/medical-records/:recordId` - الحصول على سجل محدد

### 📅 Appointments
- **POST** `/api/appointments` - إنشاء موعد
- **GET** `/api/appointments` - الحصول على جميع المواعيد
- **PUT** `/api/appointments/:appointmentId` - تحديث موعد

### 🏥 Health Check
- **GET** `/api/health` - التحقق من حالة السيرفر

## 🚀 خطوات البدء:

1. **تشغيل السيرفر:**
   ```bash
   npm run dev
   ```

2. **تسجيل الدخول:**
   - استخدم endpoint `Login` مع:
     ```json
     {
       "email": "admin@medical.com",
       "password": "Admin123456"
     }
     ```
   - التوكن سيتم حفظه تلقائياً في `auth_token`

3. **استخدام الـ Endpoints:**
   - جميع الـ requests المحمية تستخدم التوكن تلقائياً
   - أضف IDs يدوياً في Collection Variables عند الحاجة

## 📝 ملاحظات:

- **Roles المتاحة:**
  - `SUPER_ADMIN` - صلاحيات كاملة
  - `DOCTOR` - يمكنه إضافة سجلات طبية
  - `PATIENT` - يرى بياناته فقط

- **Gender Options:**
  - `MALE`, `FEMALE`, `OTHER`

- **Blood Types:**
  - `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

- **Appointment Status:**
  - `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

## 🔒 Authentication:

جميع الـ endpoints (عدا Register و Login) تحتاج إلى:
```
Authorization: Bearer <token>
```

التوكن يتم حفظه تلقائياً بعد تسجيل الدخول الناجح.
