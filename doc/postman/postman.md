# About API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables (Postman এ set করুন)

| Variable   | Value                             |
| ---------- | --------------------------------- |
| `BASE_URL` | `http://localhost:5000/api/v1`    |
| `TOKEN`    | Login করে Bearer token paste করুন |
| `ABOUT_ID` | `singleton`                       |

---

## 1. GET — About Data আনা (Public)

```
GET {{BASE_URL}}/about
```

**Headers:** কিছু লাগবে না

**Expected Response (200):**

```json
{
  "success": true,
  "message": "About fetched successfully",
  "data": {
    "id": "singleton",
    "heroImg": "https://res.cloudinary.com/...",
    "aboutMeImg": "https://res.cloudinary.com/...",
    "title": "Full Stack Developer",
    "subtitle": "Passionate about building great products",
    "description": "I am a developer...",
    "resumeUrl": "https://drive.google.com/...",
    "resumeDownloadCount": 5,
    "createdAt": "2026-06-02T10:00:00.000Z",
    "updatedAt": "2026-06-02T10:00:00.000Z"
  }
}
```

---

## 2. POST — About তৈরি করা (Protected)

```
POST {{BASE_URL}}/about
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body → form-data:**
| Key | Type | Value |
|---|---|---|
| `heroImg` | File | hero image সিলেক্ট করুন |
| `aboutMeImg` | File | about me image সিলেক্ট করুন |
| `title` | Text | `Full Stack Developer` |
| `subtitle` | Text | `Passionate about building great products` |
| `description` | Text | `I am a developer with 3+ years of experience...` |
| `resumeUrl` | Text | `https://drive.google.com/your-resume-link` |

> **Note:** সব field optional। শুধু image দিলেও কাজ করবে।

**Expected Response (201):**

```json
{
  "success": true,
  "message": "About created successfully",
  "data": { ... }
}
```

---

## 3. PUT — About আপডেট করা (Protected)

```
PUT {{BASE_URL}}/about/{{ABOUT_ID}}
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body → form-data (যা যা বদলাতে চান শুধু সেটা দিন):**
| Key | Type | Value |
|---|---|---|
| `title` | Text | `Senior Full Stack Developer` |
| `heroImg` | File | নতুন image (optional) |
| `resumeUrl` | Text | নতুন resume link |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "About updated successfully",
  "data": { ... }
}
```

---

## 4. DELETE — About মুছে ফেলা (Protected)

```
DELETE {{BASE_URL}}/about/{{ABOUT_ID}}
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "About deleted successfully",
  "data": null
}
```

---

## 5. PATCH — Resume Download Track করা (Public)

> Frontend এ "Download CV" বাটনে click করলে automatically call হবে।
> Manual test করতে চাইলে:

```
PATCH {{BASE_URL}}/about/{{ABOUT_ID}}/resume-download
```

**Headers:** কিছু লাগবে না

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Resume download tracked",
  "data": {
    "id": "singleton",
    "resumeDownloadCount": 6
  }
}
```

---

## Error Cases

### 401 — Token ছাড়া Protected Route

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 — About না থাকলে

```json
{
  "success": false,
  "message": "About not found"
}
```

### 400 — Image ছাড়া শুধু non-image file দিলে

```json
{
  "success": false,
  "message": "Only image files are allowed"
}
```

---

## About API Test করার সহজ ক্রম

1. **GET** করুন → data আছে কিনা দেখুন
2. data না থাকলে **POST** করুন → সব field দিয়ে
3. **GET** করুন → data ঠিকমতো এলো কিনা দেখুন
4. **PUT** করুন → শুধু `title` বদলান
5. **GET** করুন → title বদলেছে কিনা দেখুন
6. **PATCH** করুন → `resumeDownloadCount` বাড়েছে কিনা দেখুন
7. **DELETE** করুন → সব মুছে গেছে কিনা দেখুন

---

---

# Certificate API — Postman Test Guide

## 1. GET — সব Certificates আনা (Public)

```
GET {{BASE_URL}}/certificates
```

**Query Parameters (Optional):**
| Parameter | Type | Value |
|---|---|---|
| `isPublished` | Boolean | `true` or `false` |

**Headers:** কিছু লাগবে না

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Retrieved certificates successfully",
  "data": [
    {
      "id": "uuid-1234-5678",
      "title": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "issuedDate": "2025-06-01T00:00:00.000Z",
      "expiryDate": "2027-06-01T00:00:00.000Z",
      "credentialId": "AWS-123456",
      "credentialUrl": "https://aws.amazon.com/verify/123456",
      "imageUrl": "https://res.cloudinary.com/.../certificate.png",
      "isPublished": true,
      "sortOrder": 1,
      "createdAt": "2026-06-02T10:00:00.000Z",
      "updatedAt": "2026-06-02T10:00:00.000Z"
    }
  ]
}
```

---

## 2. GET — Single Certificate (Public)

```
GET {{BASE_URL}}/certificates/:id
```

**Path Parameters:**
| Parameter | Value |
|---|---|
| `id` | Certificate UUID |

**Headers:** কিছু লাগবে না

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Retrieved certificate successfully",
  "data": { ... }
}
```

---

## 3. POST — Certificate তৈরি করা (Protected)

```
POST {{BASE_URL}}/certificates
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body → form-data:**
| Key | Type | Value |
|---|---|---|
| `image` | File | certificate image সিলেক্ট করুন |
| `title` | Text | `AWS Solutions Architect` |
| `issuer` | Text | `Amazon Web Services` |
| `issuedDate` | Text | `2025-06-01` |
| `expiryDate` | Text | `2027-06-01` (optional) |
| `credentialId` | Text | `AWS-123456` (optional) |
| `credentialUrl` | Text | `https://aws.amazon.com/verify` (optional) |
| `isPublished` | Text | `true` or `false` |
| `sortOrder` | Text | `1` |

> **Note:** `title`, `issuer`, `issuedDate`, `isPublished`, `sortOrder` required

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Certificate created successfully",
  "data": { ... }
}
```

---

## 4. PUT — Certificate আপডেট করা (Protected)

```
PUT {{BASE_URL}}/certificates/:id
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Body → form-data (যা যা বদলাতে চান শুধু সেটা দিন):**
| Key | Type | Value |
|---|---|---|
| `title` | Text | নতুন title (optional) |
| `image` | File | নতুন image (optional) |
| `expiryDate` | Text | নতুন expiry date (optional) |
| `isPublished` | Text | `true` or `false` (optional) |

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Certificate updated successfully",
  "data": { ... }
}
```

---

## 5. DELETE — Certificate মুছে ফেলা (Protected)

```
DELETE {{BASE_URL}}/certificates/:id
```

**Headers:**

```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Certificate deleted successfully",
  "data": null
}
```

---

## Certificate Error Cases

### 401 — Token ছাড়া Protected Route

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 — Certificate না থাকলে

```json
{
  "success": false,
  "message": "Certificate not found"
}
```

### 400 — Invalid Date Format

```json
{
  "success": false,
  "message": "Invalid date format"
}
```

---

## Certificate API Test করার সহজ ক্রম

1. **GET** করুন → সব certificates দেখুন
2. **POST** করুন → নতুন certificate তৈরি করুন
3. **GET** করুন (সব) → নতুনটি যোগ হয়েছে কিনা দেখুন
4. **GET** করুন (single) → ID দিয়ে specific certificate দেখুন
5. **PUT** করুন → title বা অন্য field বদলান
6. **GET** করুন (single) → বদলাটা দেখুন
7. **PUT** করুন → নতুন image আপলোড করুন (পুরনো delete হয়ে যাবে)
8. **DELETE** করুন → certificate মুছে ফেলুন
9. **GET** করুন (সব) → deleted হয়েছে কিনা দেখুন
