# Document API — Postman Test Guide

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
| `DOCUMENT_ID`    | Created document এর ID            |

---

## 1. POST — Create Document (Protected)

```
POST {{BASE_URL}}/documents
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "jobApplicationId": "{{APPLICATION_ID}}",
  "type": "RESUME",
  "fileUrl": "https://drive.google.com/file/d/xxx/view",
  "version": 1
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Document created successfully",
  "data": {
    "id": "cm8...",
    "jobApplicationId": "cm8...",
    "type": "RESUME",
    "fileUrl": "https://drive.google.com/file/d/xxx/view",
    "version": 1,
    "createdAt": "2026-07-31T10:00:00.000Z"
  }
}
```

---

## 2. GET — Documents by Application (Protected)

```
GET {{BASE_URL}}/documents/application/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": [ ... ]
}
```

---

## 3. DELETE — Delete Document (Protected)

```
DELETE {{BASE_URL}}/documents/{{DOCUMENT_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": null
}
```

---

## Error Cases

### 404 — Application Not Found
```json
{
  "success": false,
  "message": "Job application not found"
}
```
