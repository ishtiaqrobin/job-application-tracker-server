# Translation API — Postman Testing Guide

> **Base URL:** `http://localhost:5000/api/v1/translations`
> **Auth:** All admin routes require `Authorization: Bearer <token>` header.

---

## Route Collision Warning

Express registers routes **top-to-bottom**. In this router, `/:locale` is registered **before** `/admin/all` and `/admin/:translationId`, which means:

- `GET /admin/all` → Express matches `/:locale` with `locale = "admin"` ✗
- `GET /admin/:translationId` → Express matches `/:locale/:key` ✗

**Fix — move admin GETs above the dynamic public routes:**

```typescript
// ✅ Admin static routes first
router.get(
  "/admin/all",
  auth(UserRole.ADMIN),
  TranslationController.getAllTranslations,
);
router.get(
  "/admin/:translationId",
  auth(UserRole.ADMIN),
  TranslationController.getTranslationById,
);

// ✅ Public dynamic routes after
router.get("/:locale", TranslationController.getTranslationsByLocale);
router.get("/:locale/:key", TranslationController.getTranslationByKeyAndLocale);
```

Same issue for POST `/upsert` — move it above POST `/`.

---

## 1. Public Routes

### `GET /:locale` — Get all translations for a locale

Returns a flat `{ key: value }` map.

**Request**

```
GET /api/v1/translations/en
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "Translations for locale \"en\" retrieved successfully",
  "data": {
    "hero.title": "Hello, I'm Ishtiaq Robin",
    "hero.subtitle": "Full Stack Developer",
    "nav.home": "Home",
    "nav.about": "About",
    "about.bio": "I am a passionate full stack developer from Bangladesh."
  }
}
```

**Test with Bengali**

```
GET /api/v1/translations/bn
```

---

### `GET /:locale/:key` — Get a single translation by key + locale

**Request**

```
GET /api/v1/translations/en/hero.title
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "Translation retrieved successfully",
  "data": {
    "id": "uuid-here",
    "key": "hero.title",
    "locale": "en",
    "value": "Hello, I'm Ishtiaq Robin",
    "createdAt": "2024-11-15T10:00:00.000Z",
    "updatedAt": "2024-11-15T10:00:00.000Z"
  }
}
```

**Not Found Response `404`**

```json
{
  "success": false,
  "message": "Translation not found for key \"hero.title\" and locale \"fr\""
}
```

---

## 2. Admin Routes

### `GET /admin/all` — Get all translations (all locales)

**Request**

```
GET /api/v1/translations/admin/all
Authorization: Bearer <admin_token>
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "All translations retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "key": "hero.title",
      "locale": "en",
      "value": "Hello, I'm Ishtiaq Robin",
      "createdAt": "...",
      "updatedAt": "..."
    },
    {
      "id": "uuid-2",
      "key": "hero.title",
      "locale": "bn",
      "value": "হ্যালো, আমি ইশতিয়াক রবিন",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### `GET /admin/:translationId` — Get single translation by ID

**Request**

```
GET /api/v1/translations/admin/uuid-1
Authorization: Bearer <admin_token>
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "Translation retrieved successfully",
  "data": {
    "id": "uuid-1",
    "key": "hero.title",
    "locale": "en",
    "value": "Hello, I'm Ishtiaq Robin",
    "createdAt": "2024-11-15T10:00:00.000Z",
    "updatedAt": "2024-11-15T10:00:00.000Z"
  }
}
```

---

### `POST /` — Create a single translation

**Request**

```
POST /api/v1/translations
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body (English)**

```json
{
  "key": "contact.title",
  "locale": "en",
  "value": "Get In Touch"
}
```

**Body (Bengali)**

```json
{
  "key": "contact.title",
  "locale": "bn",
  "value": "যোগাযোগ করুন"
}
```

**Expected Response `201`**

```json
{
  "success": true,
  "message": "Translation created successfully",
  "data": {
    "id": "uuid-new",
    "key": "contact.title",
    "locale": "en",
    "value": "Get In Touch",
    "createdAt": "2024-11-15T10:00:00.000Z",
    "updatedAt": "2024-11-15T10:00:00.000Z"
  }
}
```

**Duplicate Conflict `409`**

```json
{
  "success": false,
  "message": "A translation already exists for key \"contact.title\" with locale \"en\". Use update or bulk upsert instead."
}
```

**Validation Error (invalid locale) `400`**

```json
{
  "key": "nav.home",
  "locale": "fr",
  "value": "Accueil"
}
```

---

### `POST /upsert` — Bulk upsert translations

Idempotent — safe to run multiple times.

**Request**

```
POST /api/v1/translations/upsert
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body — Full seed**

```json
{
  "translations": [
    {
      "key": "hero.title",
      "locale": "en",
      "value": "Hello, I'm Ishtiaq Robin"
    },
    {
      "key": "hero.title",
      "locale": "bn",
      "value": "হ্যালো, আমি ইশতিয়াক রবিন"
    },
    { "key": "hero.subtitle", "locale": "en", "value": "Full Stack Developer" },
    { "key": "hero.subtitle", "locale": "bn", "value": "ফুল স্ট্যাক ডেভেলপার" },
    { "key": "nav.home", "locale": "en", "value": "Home" },
    { "key": "nav.home", "locale": "bn", "value": "হোম" },
    { "key": "nav.about", "locale": "en", "value": "About" },
    { "key": "nav.about", "locale": "bn", "value": "আমার সম্পর্কে" },
    { "key": "nav.projects", "locale": "en", "value": "Projects" },
    { "key": "nav.projects", "locale": "bn", "value": "প্রজেক্ট" },
    { "key": "nav.contact", "locale": "en", "value": "Contact" },
    { "key": "nav.contact", "locale": "bn", "value": "যোগাযোগ" },
    {
      "key": "about.bio",
      "locale": "en",
      "value": "I am a passionate full stack developer from Bangladesh."
    },
    {
      "key": "about.bio",
      "locale": "bn",
      "value": "আমি বাংলাদেশের একজন উৎসাহী ফুল স্ট্যাক ডেভেলপার।"
    },
    { "key": "contact.title", "locale": "en", "value": "Get In Touch" },
    { "key": "contact.title", "locale": "bn", "value": "যোগাযোগ করুন" }
  ]
}
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "16 translation(s) upserted successfully",
  "data": []
}
```

**Validation Error — empty array `400`**

```json
{
  "translations": []
}
```

---

### `PUT /:translationId` — Update a translation's value

Only `value` can be changed. Key and locale are immutable.

**Request**

```
PUT /api/v1/translations/uuid-1
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**

```json
{
  "value": "Hi, I'm Ishtiaq Robin — Full Stack Developer"
}
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "Translation updated successfully",
  "data": {
    "id": "uuid-1",
    "key": "hero.title",
    "locale": "en",
    "value": "Hi, I'm Ishtiaq Robin — Full Stack Developer",
    "createdAt": "2024-11-15T10:00:00.000Z",
    "updatedAt": "2024-11-15T11:00:00.000Z"
  }
}
```

**Validation Error — missing value `400`**

```json
{}
```

---

### `DELETE /locale/:locale` — Delete all translations for a locale

⚠️ Destructive — deletes every entry for that locale.

**Request**

```
DELETE /api/v1/translations/locale/bn
Authorization: Bearer <admin_token>
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "All \"bn\" translations deleted successfully",
  "data": {
    "count": 8
  }
}
```

---

### `DELETE /:translationId` — Delete a single translation by ID

**Request**

```
DELETE /api/v1/translations/uuid-1
Authorization: Bearer <admin_token>
```

**Expected Response `200`**

```json
{
  "success": true,
  "message": "Translation deleted successfully",
  "data": null
}
```

**Not Found `404`**

```json
{
  "success": false,
  "message": "Translation not found"
}
```

---

## 3. Validation Edge Cases

| Scenario                 | Field          | Bad Value              | Expected                            |
| ------------------------ | -------------- | ---------------------- | ----------------------------------- |
| Unsupported locale       | `locale`       | `"fr"`, `"ar"`, `"de"` | `400` — must be `"en"` or `"bn"`    |
| Empty key                | `key`          | `""`                   | `400` — Key is required             |
| Empty value              | `value`        | `""`                   | `400` — Value is required           |
| Empty translations array | `translations` | `[]`                   | `400` — At least one entry required |
| Duplicate create         | `key + locale` | existing pair          | `409` — already exists              |
| Missing value on update  | `value`        | omitted                | `400` — Value is required           |

---

## 4. Recommended Test Order

```
1. POST /upsert          → seed all translations
2. GET  /en              → verify flat map returned
3. GET  /bn              → verify Bengali map
4. GET  /en/hero.title   → verify single key lookup
5. GET  /admin/all       → verify admin sees all rows
6. POST /                → create a new key
7. POST /                → repeat same key → expect 409
8. PUT  /:id             → update the value
9. GET  /admin/:id       → confirm updated value
10. DELETE /:id          → delete single entry
11. DELETE /locale/bn    → wipe all Bengali entries
12. GET  /bn             → expect empty {}
```
