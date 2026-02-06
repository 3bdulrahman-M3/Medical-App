# 📚 API Examples - Medical Record Backend

**Base URL:** `https://medical-app-tau-ten.vercel.app`

---

## 🔐 Authentication

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "role": "PATIENT"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "PATIENT"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "User already exists with this email"
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@medical.com",
  "password": "Admin123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Super Admin",
    "email": "admin@medical.com",
    "role": "SUPER_ADMIN"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Get Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Super Admin",
    "email": "admin@medical.com",
    "role": "SUPER_ADMIN",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "patient": null,
  "doctor": null
}
```

**Response for Patient (200 OK):**
```json
{
  "user": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "PATIENT"
  },
  "patient": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": "65a1b2c3d4e5f6g7h8i9j0k2",
    "age": 30,
    "gender": "MALE",
    "bloodType": "O+",
    "chronicDiseases": ["Diabetes"],
    "allergies": ["Penicillin"],
    "notes": "Patient notes here"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "No token provided, authorization denied"
}
```

---

## 👤 Patients

### 1. Create Patient Profile (Super Admin Only)

**Endpoint:** `POST /api/patients`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**
```json
{
  "userId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "age": 30,
  "gender": "MALE",
  "bloodType": "O+",
  "chronicDiseases": ["Diabetes", "Hypertension"],
  "allergies": ["Penicillin", "Aspirin"],
  "notes": "Patient has history of heart disease"
}
```

**Response (201 Created):**
```json
{
  "message": "Patient profile created successfully",
  "patient": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Ahmed Ali",
      "email": "ahmed@example.com",
      "role": "PATIENT"
    },
    "age": 30,
    "gender": "MALE",
    "bloodType": "O+",
    "chronicDiseases": ["Diabetes", "Hypertension"],
    "allergies": ["Penicillin", "Aspirin"],
    "notes": "Patient has history of heart disease",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Patient profile already exists for this user"
}
```

---

### 2. Get All Patients (Admin/Doctor Only)

**Endpoint:** `GET /api/patients`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Ahmed Ali",
      "email": "ahmed@example.com",
      "role": "PATIENT"
    },
    "age": 30,
    "gender": "MALE",
    "bloodType": "O+",
    "chronicDiseases": ["Diabetes"],
    "allergies": ["Penicillin"],
    "notes": "Patient notes here",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
      "name": "Sara Mohamed",
      "email": "sara@example.com",
      "role": "PATIENT"
    },
    "age": 25,
    "gender": "FEMALE",
    "bloodType": "A+",
    "chronicDiseases": [],
    "allergies": [],
    "notes": "",
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
]
```

---

### 3. Get Patient by ID

**Endpoint:** `GET /api/patients/:patientId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
  "userId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "role": "PATIENT"
  },
  "age": 30,
  "gender": "MALE",
  "bloodType": "O+",
  "chronicDiseases": ["Diabetes"],
  "allergies": ["Penicillin"],
  "notes": "Patient notes here",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Patient not found"
}
```

---

### 4. Update Patient

**Endpoint:** `PUT /api/patients/:patientId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**
```json
{
  "age": 31,
  "bloodType": "A+",
  "allergies": ["Penicillin", "Aspirin", "Ibuprofen"]
}
```

**Response (200 OK):**
```json
{
  "message": "Patient profile updated successfully",
  "patient": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Ahmed Ali",
      "email": "ahmed@example.com",
      "role": "PATIENT"
    },
    "age": 31,
    "gender": "MALE",
    "bloodType": "A+",
    "chronicDiseases": ["Diabetes"],
    "allergies": ["Penicillin", "Aspirin", "Ibuprofen"],
    "notes": "Patient notes here",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 👨‍⚕️ Doctors

### 1. Create Doctor Profile (Super Admin Only)

**Endpoint:** `POST /api/doctors`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**
```json
{
  "userId": "65a1b2c3d4e5f6g7h8i9j0k6",
  "specialization": "Cardiology",
  "licenseNumber": "DOC123456"
}
```

**Response (201 Created):**
```json
{
  "message": "Doctor profile created successfully",
  "doctor": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "name": "Dr. Mohamed Hassan",
      "email": "mohamed@example.com",
      "role": "DOCTOR"
    },
    "specialization": "Cardiology",
    "licenseNumber": "DOC123456",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "User must have DOCTOR role"
}
```

---

### 2. Get All Doctors

**Endpoint:** `GET /api/doctors`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "name": "Dr. Mohamed Hassan",
      "email": "mohamed@example.com",
      "role": "DOCTOR"
    },
    "specialization": "Cardiology",
    "licenseNumber": "DOC123456",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k9",
      "name": "Dr. Fatma Ali",
      "email": "fatma@example.com",
      "role": "DOCTOR"
    },
    "specialization": "Pediatrics",
    "licenseNumber": "DOC789012",
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
]
```

---

### 3. Get Doctor by ID

**Endpoint:** `GET /api/doctors/:doctorId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
  "userId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
    "name": "Dr. Mohamed Hassan",
    "email": "mohamed@example.com",
    "role": "DOCTOR"
  },
  "specialization": "Cardiology",
  "licenseNumber": "DOC123456",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 📋 Medical Records

### 1. Create Medical Record (Doctor Only)

**Endpoint:** `POST /api/medical-records`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**
```json
{
  "patientId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "diagnosis": "Hypertension Stage 2",
  "prescription": "Take Lisinopril 10mg daily, Monitor blood pressure weekly",
  "attachments": [
    "https://example.com/reports/blood-pressure-report.pdf",
    "https://example.com/reports/ecg-report.pdf"
  ]
}
```

**Response (201 Created):**
```json
{
  "message": "Medical record created successfully",
  "medicalRecord": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k10",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "diagnosis": "Hypertension Stage 2",
    "prescription": "Take Lisinopril 10mg daily, Monitor blood pressure weekly",
    "attachments": [
      "https://example.com/reports/blood-pressure-report.pdf",
      "https://example.com/reports/ecg-report.pdf"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Patient not found"
}
```

---

### 2. Get All Medical Records

**Endpoint:** `GET /api/medical-records`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK) - For Patient (sees own only):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k10",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "diagnosis": "Hypertension Stage 2",
    "prescription": "Take Lisinopril 10mg daily",
    "attachments": ["https://example.com/reports/blood-pressure-report.pdf"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Response (200 OK) - For Admin/Doctor (sees all):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k10",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "diagnosis": "Hypertension Stage 2",
    "prescription": "Take Lisinopril 10mg daily",
    "attachments": ["https://example.com/reports/blood-pressure-report.pdf"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k11",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "name": "Sara Mohamed",
        "email": "sara@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k8",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k9",
        "name": "Dr. Fatma Ali",
        "email": "fatma@example.com"
      },
      "specialization": "Pediatrics"
    },
    "diagnosis": "Common Cold",
    "prescription": "Rest and fluids",
    "attachments": [],
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
]
```

---

### 3. Get Medical Records by Patient

**Endpoint:** `GET /api/medical-records/patient/:patientId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k10",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "diagnosis": "Hypertension Stage 2",
    "prescription": "Take Lisinopril 10mg daily",
    "attachments": ["https://example.com/reports/blood-pressure-report.pdf"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 4. Get Medical Record by ID

**Endpoint:** `GET /api/medical-records/:recordId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k10",
  "patientId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Ahmed Ali",
      "email": "ahmed@example.com"
    }
  },
  "doctorId": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
    "userId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
      "name": "Dr. Mohamed Hassan",
      "email": "mohamed@example.com"
    },
    "specialization": "Cardiology"
  },
  "diagnosis": "Hypertension Stage 2",
  "prescription": "Take Lisinopril 10mg daily, Monitor blood pressure weekly",
  "attachments": [
    "https://example.com/reports/blood-pressure-report.pdf",
    "https://example.com/reports/ecg-report.pdf"
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (403 Forbidden) - Patient trying to access other patient's record:**
```json
{
  "message": "Access denied"
}
```

---

## 📅 Appointments

### 1. Create Appointment

**Endpoint:** `POST /api/appointments`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**
```json
{
  "patientId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "doctorId": "65a1b2c3d4e5f6g7h8i9j0k7",
  "date": "2024-12-25T10:00:00Z",
  "status": "PENDING"
}
```

**Response (201 Created):**
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k12",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "date": "2024-12-25T10:00:00.000Z",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Patient not found"
}
```

---

### 2. Get All Appointments

**Endpoint:** `GET /api/appointments`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK) - For Patient (sees own only):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k12",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "date": "2024-12-25T10:00:00.000Z",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Response (200 OK) - For Doctor (sees own appointments):**
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k12",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "date": "2024-12-25T10:00:00.000Z",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 3. Update Appointment

**Endpoint:** `PUT /api/appointments/:appointmentId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request:**
```json
{
  "status": "CONFIRMED",
  "date": "2024-12-25T11:00:00Z"
}
```

**Response (200 OK):**
```json
{
  "message": "Appointment updated successfully",
  "appointment": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k12",
    "patientId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Ahmed Ali",
        "email": "ahmed@example.com"
      }
    },
    "doctorId": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k7",
      "userId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "name": "Dr. Mohamed Hassan",
        "email": "mohamed@example.com"
      },
      "specialization": "Cardiology"
    },
    "date": "2024-12-25T11:00:00.000Z",
    "status": "CONFIRMED",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 🏥 Health Check

**Endpoint:** `GET /api/health`

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "Medical Record Backend API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ⚠️ Common Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide name, email, password, and role"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided, authorization denied"
}
```
```json
{
  "message": "Invalid token"
}
```
```json
{
  "message": "Token expired"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Required roles: SUPER_ADMIN, DOCTOR"
}
```

### 404 Not Found
```json
{
  "message": "Route not found"
}
```
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong!",
  "error": "Error details (only in development)"
}
```

---

## 📝 ملاحظات مهمة:

1. **Authentication:** جميع الـ endpoints (عدا Register و Login و Health Check) تحتاج إلى `Authorization: Bearer <token>` header

2. **Roles:**
   - `SUPER_ADMIN`: صلاحيات كاملة
   - `DOCTOR`: يمكنه إضافة سجلات طبية، يرى مواعيده فقط
   - `PATIENT`: يرى بياناته فقط

3. **Gender Options:** `MALE`, `FEMALE`, `OTHER`

4. **Blood Types:** `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

5. **Appointment Status:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

6. **Date Format:** ISO 8601 format: `2024-12-25T10:00:00Z`
