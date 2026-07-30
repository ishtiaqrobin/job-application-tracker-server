# Job Application API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables

| Variable         | Value                             |
| ---------------- | --------------------------------- |
| `BASE_URL`       | `http://localhost:5000/api/v1`    |
| `TOKEN`          | Login করে Bearer token paste করুন |
| `APPLICATION_ID` | Created application এর ID         |
| `COMPANY_ID`     | Company এর ID                     |

---

## 1. POST — Create Application (Protected)

```
POST {{BASE_URL}}/applications
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "companyId": "{{COMPANY_ID}}",
  "companyNameSnapshot": "Google",
  "position": "Senior Software Engineer",
  "jobLink": "https://careers.google.com/jobs/123",
  "jobLocation": "Mountain View, CA",
  "jobNature": "FULL_TIME",
  "workMode": "HYBRID",
  "experienceLevel": "SENIOR",
  "status": "APPLIED",
  "priority": "HIGH",
  "source": "LINKEDIN",
  "appliedDate": "2026-07-30T10:00:00.000Z",
  "deadline": "2026-08-30T10:00:00.000Z",
  "salaryRangeMin": 150000,
  "salaryRangeMax": 200000,
  "currency": "USD",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "resumeDriveLink": "https://drive.google.com/file/d/xxx/view",
  "coverLetterLink": "https://drive.google.com/file/d/yyy/view",
  "isReferral": true,
  "referredBy": "Jane Doe",
  "tagIds": ["tag-id-1", "tag-id-2"]
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Job application created successfully",
  "data": {
    "id": "cm8...",
    "userId": "uuid...",
    "companyId": "cm8...",
    "companyNameSnapshot": "Google",
    "position": "Senior Software Engineer",
    "status": "APPLIED",
    "source": "LINKEDIN",
    "tags": [...],
    "_count": {
      "interviews": 0,
      "documents": 0,
      "followUps": 0,
      "reminders": 0
    }
  }
}
```

---

## 2. GET — All Applications (Protected)

```
GET {{BASE_URL}}/applications
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Query Parameters (all optional):**
| Parameter    | Type   | Value                     |
|-------------|--------|---------------------------|
| `status`    | String | `APPLIED`, `INTERVIEW` etc |
| `priority`  | String | `HIGH`, `MEDIUM`, `LOW`   |
| `source`    | String | `LINKEDIN`, `COMPANY_WEBSITE` |
| `workMode`  | String | `REMOTE`, `ONSITE`, `HYBRID` |
| `jobNature` | String | `FULL_TIME`, `CONTRACT`    |
| `search`    | String | `Google` (searches position, company, techStack) |
| `startDate` | String | `2026-01-01T00:00:00.000Z` |
| `endDate`   | String | `2026-12-31T00:00:00.000Z` |
| `page`      | Number | `1`                       |
| `limit`     | Number | `20`                      |

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Job applications retrieved successfully",
  "data": {
    "data": [ ... ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

## 3. GET — Application Stats (Protected)

> Route must be placed before `/:id`

```
GET {{BASE_URL}}/applications/stats
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Application stats retrieved successfully",
  "data": {
    "byStatus": [
      { "status": "APPLIED", "count": 5 },
      { "status": "INTERVIEW", "count": 3 },
      { "status": "REJECTED", "count": 2 }
    ],
    "bySource": [
      { "source": "LINKEDIN", "count": 6 },
      { "source": "COMPANY_WEBSITE", "count": 4 }
    ],
    "byPriority": [
      { "priority": "HIGH", "count": 5 },
      { "priority": "MEDIUM", "count": 3 },
      { "priority": "LOW", "count": 2 }
    ]
  }
}
```

---

## 4. GET — Single Application (Protected)

```
GET {{BASE_URL}}/applications/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Job application retrieved successfully",
  "data": {
    "id": "cm8...",
    "position": "Senior Software Engineer",
    "company": { ... },
    "contacts": [ ... ],
    "interviews": [ ... ],
    "documents": [ ... ],
    "followUps": [ ... ],
    "activityLogs": [ ... ],
    "reminders": [ ... ],
    "tags": [ ... ]
  }
}
```

---

## 5. PATCH — Update Application (Protected)

```
PATCH {{BASE_URL}}/applications/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON (partial update):**
```json
{
  "status": "INTERVIEW",
  "priority": "HIGH"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Job application updated successfully",
  "data": { ... }
}
```

> **Note:** When `status` changes, an `ActivityLog` entry is automatically created.

---

## 6. DELETE — Delete Application (Protected)

```
DELETE {{BASE_URL}}/applications/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Job application deleted successfully",
  "data": null
}
```

---

## Error Cases

### 400 — Validation Error
```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "position",
      "message": "Required"
    }
  ]
}
```

### 404 — Not Found
```json
{
  "success": false,
  "message": "Job application not found"
}
```
