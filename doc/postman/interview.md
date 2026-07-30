# Interview API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables

| Variable         | Value                             |
| ---------------- | --------------------------------- |
| `BASE_URL`       | `http://localhost:5000/api/v1`    |
| `TOKEN`          | Login করে Bearer token paste করুন |
| `APPLICATION_ID` | Job application এর ID             |
| `INTERVIEW_ID`   | Created interview এর ID           |

---

## 1. POST — Create Interview (Protected)

```
POST {{BASE_URL}}/interviews
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "jobApplicationId": "{{APPLICATION_ID}}",
  "round": "TECHNICAL",
  "scheduledAt": "2026-08-15T10:00:00.000Z",
  "duration": 60,
  "location": "Google Meet",
  "interviewerNames": ["John Doe", "Jane Smith"],
  "result": "PENDING"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Interview created successfully",
  "data": {
    "id": "cm8...",
    "jobApplicationId": "cm8...",
    "round": "TECHNICAL",
    "scheduledAt": "2026-08-15T10:00:00.000Z",
    "duration": 60,
    "location": "Google Meet",
    "interviewerNames": ["John Doe", "Jane Smith"],
    "feedback": null,
    "result": "PENDING",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 2. GET — Interviews by Application (Protected)

```
GET {{BASE_URL}}/interviews/application/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Interviews retrieved successfully",
  "data": [ ... ]
}
```

---

## 3. PATCH — Update Interview (Protected)

```
PATCH {{BASE_URL}}/interviews/{{INTERVIEW_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "result": "PASSED",
  "feedback": "Strong technical skills. Good communication."
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Interview updated successfully",
  "data": { ... }
}
```

---

## 4. DELETE — Delete Interview (Protected)

```
DELETE {{BASE_URL}}/interviews/{{INTERVIEW_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Interview deleted successfully",
  "data": null
}
```
