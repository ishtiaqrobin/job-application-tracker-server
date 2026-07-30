# Company API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables

| Variable   | Value                             |
| ---------- | --------------------------------- |
| `BASE_URL` | `http://localhost:5000/api/v1`    |
| `TOKEN`    | Login করে Bearer token paste করুন |
| `COMPANY_ID` | Created company এর ID          |

---

## 1. POST — Create Company (Protected)

```
POST {{BASE_URL}}/companies
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "name": "Google",
  "website": "https://careers.google.com",
  "location": "Mountain View, CA",
  "industry": "Technology"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "id": "cm8...",
    "name": "Google",
    "website": "https://careers.google.com",
    "location": "Mountain View, CA",
    "industry": "Technology",
    "logoUrl": null,
    "createdAt": "2026-07-31T10:00:00.000Z",
    "updatedAt": "2026-07-31T10:00:00.000Z"
  }
}
```

---

## 2. GET — All Companies (Protected)

```
GET {{BASE_URL}}/companies
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Query Parameters (Optional):**
| Parameter | Type | Value |
|-----------|------|-------|
| `search` | String | `Google` |
| `industry` | String | `Technology` |
| `location` | String | `Mountain View` |

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Companies retrieved successfully",
  "data": [ ... ]
}
```

---

## 3. GET — Single Company (Protected)

```
GET {{BASE_URL}}/companies/{{COMPANY_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Company retrieved successfully",
  "data": {
    "id": "cm8...",
    "name": "Google",
    "website": "https://careers.google.com",
    "location": "Mountain View, CA",
    "industry": "Technology",
    "createdAt": "...",
    "updatedAt": "...",
    "_count": {
      "applications": 3,
      "contacts": 1
    }
  }
}
```

---

## 4. PATCH — Update Company (Protected)

```
PATCH {{BASE_URL}}/companies/{{COMPANY_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "industry": "Software & Technology"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Company updated successfully",
  "data": { ... }
}
```

---

## 5. DELETE — Delete Company (Protected)

```
DELETE {{BASE_URL}}/companies/{{COMPANY_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Company deleted successfully",
  "data": null
}
```

---

## Error Cases

### 401 — No Token
```json
{
  "success": false,
  "message": "Unauthorized! You must be logged in to access this resource"
}
```

### 404 — Company Not Found
```json
{
  "success": false,
  "message": "Company not found"
}
```

### 409 — Duplicate Name
```json
{
  "success": false,
  "message": "Company with this name already exists"
}
```
