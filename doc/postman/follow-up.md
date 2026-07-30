# Follow-Up API — Postman Test Guide

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
| `FOLLOWUP_ID`    | Created follow-up এর ID           |

---

## 1. POST — Create Follow-Up (Protected)

```
POST {{BASE_URL}}/follow-ups
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "jobApplicationId": "{{APPLICATION_ID}}",
  "contactedAt": "2026-08-05T10:00:00.000Z",
  "note": "Sent a follow-up email to the recruiter",
  "response": "No reply yet"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Follow-up created successfully",
  "data": {
    "id": "cm8...",
    "jobApplicationId": "cm8...",
    "contactedAt": "2026-08-05T10:00:00.000Z",
    "note": "Sent a follow-up email to the recruiter",
    "response": "No reply yet",
    "createdAt": "2026-07-31T10:00:00.000Z"
  }
}
```

> **Note:** Creating a follow-up automatically increments the `followUpCount` on the job application.

---

## 2. GET — Follow-Ups by Application (Protected)

```
GET {{BASE_URL}}/follow-ups/application/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Follow-ups retrieved successfully",
  "data": [
    {
      "id": "cm8...",
      "jobApplicationId": "cm8...",
      "contactedAt": "2026-08-05T10:00:00.000Z",
      "note": "Sent a follow-up email",
      "response": "No reply yet",
      "createdAt": "..."
    },
    {
      "id": "cm8...",
      "jobApplicationId": "cm8...",
      "contactedAt": "2026-08-01T10:00:00.000Z",
      "note": "Initial application",
      "response": null,
      "createdAt": "..."
    }
  ]
}
```

---

## 3. DELETE — Delete Follow-Up (Protected)

```
DELETE {{BASE_URL}}/follow-ups/{{FOLLOWUP_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Follow-up deleted successfully",
  "data": null
}
```

> **Note:** Deleting a follow-up automatically decrements the `followUpCount` on the job application.
