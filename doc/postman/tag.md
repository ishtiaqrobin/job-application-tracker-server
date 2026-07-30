# Tag API — Postman Test Guide

## Base URL

```
{{BASE_URL}} = http://localhost:5000/api/v1
```

## Environment Variables

| Variable | Value                             |
| -------- | --------------------------------- |
| `BASE_URL` | `http://localhost:5000/api/v1` |
| `TOKEN`  | Login করে Bearer token paste করুন |
| `TAG_ID` | Created tag এর ID                 |

---

## 1. POST — Create Tag (Protected)

```
POST {{BASE_URL}}/tags
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "name": "Frontend",
  "color": "#3B82F6"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "id": "cm8...",
    "userId": "uuid...",
    "name": "Frontend",
    "color": "#3B82F6"
  }
}
```

---

## 2. GET — All Tags (Protected)

```
GET {{BASE_URL}}/tags
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Tags retrieved successfully",
  "data": [
    {
      "id": "cm8...",
      "name": "Frontend",
      "color": "#3B82F6"
    },
    {
      "id": "cm8...",
      "name": "Backend",
      "color": "#10B981"
    }
  ]
}
```

---

## 3. PATCH — Update Tag (Protected)

```
PATCH {{BASE_URL}}/tags/{{TAG_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body → raw JSON:**
```json
{
  "color": "#EF4444"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Tag updated successfully",
  "data": { ... }
}
```

---

## 4. DELETE — Delete Tag (Protected)

```
DELETE {{BASE_URL}}/tags/{{TAG_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Tag deleted successfully",
  "data": null
}
```

---

## Error Cases

### 409 — Duplicate Tag Name
```json
{
  "success": false,
  "message": "Tag with this name already exists"
}
```
