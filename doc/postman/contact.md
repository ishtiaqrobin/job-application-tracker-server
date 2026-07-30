# Contact API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables

| Variable         | Value                             |
| ---------------- | --------------------------------- |
| `BASE_URL`       | `http://localhost:5000/api/v1`    |
| `TOKEN`          | Login করে Bearer token paste করুন |
| `COMPANY_ID`     | Company ID (optional)             |
| `CONTACT_ID`     | Created contact এর ID             |

---

## 1. POST — Create Contact (Protected)

```
POST {{BASE_URL}}/contacts
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "companyId": "{{COMPANY_ID}}",
  "name": "John Doe",
  "role": "HR Manager",
  "email": "john.doe@company.com",
  "phone": "+1-234-567-8900",
  "linkedin": "https://linkedin.com/in/johndoe"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "id": "cm8...",
    "userId": "uuid...",
    "companyId": "cm8...",
    "jobApplicationId": null,
    "name": "John Doe",
    "role": "HR Manager",
    "email": "john.doe@company.com",
    "phone": "+1-234-567-8900",
    "linkedin": "https://linkedin.com/in/johndoe",
    "createdAt": "2026-07-31T10:00:00.000Z",
    "updatedAt": "2026-07-31T10:00:00.000Z",
    "company": {
      "id": "cm8...",
      "name": "Google"
    }
  }
}
```

---

## 2. GET — All Contacts (Protected)

```
GET {{BASE_URL}}/contacts
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Query Parameters (Optional):**
| Parameter | Type | Value |
|-----------|------|-------|
| `search` | String | `John` |
| `companyId` | String | `{{COMPANY_ID}}` |
| `jobApplicationId` | String | Application ID |

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": [ ... ]
}
```

---

## 3. GET — Single Contact (Protected)

```
GET {{BASE_URL}}/contacts/{{CONTACT_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Contact retrieved successfully",
  "data": {
    "id": "cm8...",
    "name": "John Doe",
    "role": "HR Manager",
    "company": { "id": "cm8...", "name": "Google" },
    "jobApplication": null
  }
}
```

---

## 4. PATCH — Update Contact (Protected)

```
PATCH {{BASE_URL}}/contacts/{{CONTACT_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "role": "Senior HR Manager",
  "phone": "+1-999-888-7777"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Contact updated successfully",
  "data": { ... }
}
```

---

## 5. DELETE — Delete Contact (Protected)

```
DELETE {{BASE_URL}}/contacts/{{CONTACT_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Contact deleted successfully",
  "data": null
}
```
