# Reminder API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables

| Variable         | Value                             |
| ---------------- | --------------------------------- |
| `BASE_URL`       | `http://localhost:5000/api/v1`    |
| `TOKEN`          | Login করে Bearer token paste করুন |
| `APPLICATION_ID` | Job application এর ID (optional)  |
| `REMINDER_ID`    | Created reminder এর ID            |

---

## 1. POST — Create Reminder (Protected)

```
POST {{BASE_URL}}/reminders
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "jobApplicationId": "{{APPLICATION_ID}}",
  "title": "Follow up with recruiter",
  "remindAt": "2026-08-10T09:00:00.000Z"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Reminder created successfully",
  "data": {
    "id": "cm8...",
    "userId": "uuid...",
    "jobApplicationId": "cm8...",
    "title": "Follow up with recruiter",
    "remindAt": "2026-08-10T09:00:00.000Z",
    "isCompleted": false,
    "createdAt": "2026-07-31T10:00:00.000Z"
  }
}
```

---

## 2. GET — All Reminders (Protected)

```
GET {{BASE_URL}}/reminders
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reminders retrieved successfully",
  "data": [
    {
      "id": "cm8...",
      "userId": "uuid...",
      "jobApplicationId": "cm8...",
      "title": "Follow up with recruiter",
      "remindAt": "2026-08-10T09:00:00.000Z",
      "isCompleted": false,
      "createdAt": "..."
    }
  ]
}
```

---

## 3. PATCH — Update / Mark Complete (Protected)

```
PATCH {{BASE_URL}}/reminders/{{REMINDER_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Mark as completed:**
```json
{
  "isCompleted": true
}
```

**Or update title/time:**
```json
{
  "title": "Updated reminder title",
  "remindAt": "2026-08-12T09:00:00.000Z"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reminder updated successfully",
  "data": { ... }
}
```

---

## 4. DELETE — Delete Reminder (Protected)

```
DELETE {{BASE_URL}}/reminders/{{REMINDER_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reminder deleted successfully",
  "data": null
}
```
