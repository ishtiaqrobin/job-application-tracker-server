# Blog API — Postman Testing Guide

> Base URL: `http://localhost:5000/api/blogs`  
> Admin routes require `Authorization: Bearer <token>` header.

---

## 🐛 Bug Fix Summary

**File:** `blog.controller.ts` — `getBlogs` function

**Error:** `Expected 0-1 arguments, but got 6`

**Root cause:** The service function signature is `getBlogs(filters?: { status, isFeatured, tagId })` — it takes **one optional object**. The controller was incorrectly calling it with 3 separate named arguments using invalid TS syntax:

```ts
// ❌ Wrong — invalid syntax, treated as 6 comma-separated expressions
await BlogService.getBlogs(
  status : blogStatus as string,
  isFeatured : isFeaturedFilter,
  tagId : tagId as string,
);

// ✅ Fixed — pass a single object
await BlogService.getBlogs({
  status: blogStatus as string,
  isFeatured: isFeaturedFilter,
  tagId: tagId as string,
});
```

---

## 📝 Blog Endpoints

### 1. Create Blog

| Field      | Value                |
| ---------- | -------------------- |
| **Method** | `POST`               |
| **URL**    | `{{baseUrl}}/`       |
| **Auth**   | Bearer Token (Admin) |
| **Body**   | `form-data`          |

**form-data fields:**
| Key | Type | Value (example) |
|---------------|------|-----------------|
| `title` | Text | `My First Blog Post` |
| `slug` | Text | `my-first-blog-post` |
| `content` | Text | `This is the full content of the blog post.` |
| `excerpt` | Text | `A short preview of the post.` |
| `status` | Text | `PUBLISHED` |
| `isFeatured` | Text | `true` |
| `publishedAt` | Text | `2024-06-01T10:00:00.000Z` |
| `metaTitle` | Text | `SEO Title Here` |
| `metaDescription` | Text | `SEO description here.` |
| `tagIds` | Text | `["tag-uuid-1", "tag-uuid-2"]` |
| `thumbnail` | File | _(select an image file)_ |

---

### 2. Get All Blogs (with filters)

| Field      | Value          |
| ---------- | -------------- |
| **Method** | `GET`          |
| **URL**    | `{{baseUrl}}/` |
| **Auth**   | None           |

**Query params (all optional):**
| Key | Example Value |
|--------------|---------------|
| `status` | `PUBLISHED` |
| `isFeatured` | `true` |
| `tagId` | `some-tag-uuid` |

**Example URL:**

```
GET http://localhost:5000/api/blogs?status=PUBLISHED&isFeatured=true
```

---

### 3. Get Blog by ID

| Field      | Value             |
| ---------- | ----------------- |
| **Method** | `GET`             |
| **URL**    | `{{baseUrl}}/:id` |
| **Auth**   | None              |

**Example URL:**

```
GET http://localhost:5000/api/blogs/some-blog-uuid
```

---

### 4. Get Blog by Slug

| Field      | Value                    |
| ---------- | ------------------------ |
| **Method** | `GET`                    |
| **URL**    | `{{baseUrl}}/slug/:slug` |
| **Auth**   | None                     |

**Example URL:**

```
GET http://localhost:5000/api/blogs/slug/my-first-blog-post
```

> ⚠️ This increments the blog's `viewCount` on every call.

---

### 5. Update Blog

| Field      | Value                |
| ---------- | -------------------- |
| **Method** | `PUT`                |
| **URL**    | `{{baseUrl}}/:id`    |
| **Auth**   | Bearer Token (Admin) |
| **Body**   | `form-data`          |

**form-data fields** _(all optional for update):_
| Key | Type | Value (example) |
|---------------|------|-----------------|
| `title` | Text | `Updated Title` |
| `status` | Text | `ARCHIVED` |
| `isFeatured` | Text | `false` |
| `tagIds` | Text | `["tag-uuid-1"]` |
| `thumbnail` | File | _(select a new image file)_ |

---

### 6. Like Blog

| Field      | Value                  |
| ---------- | ---------------------- |
| **Method** | `PATCH`                |
| **URL**    | `{{baseUrl}}/:id/like` |
| **Auth**   | None                   |

**Example URL:**

```
PATCH http://localhost:5000/api/blogs/some-blog-uuid/like
```

---

### 7. Delete Blog

| Field      | Value                |
| ---------- | -------------------- |
| **Method** | `DELETE`             |
| **URL**    | `{{baseUrl}}/:id`    |
| **Auth**   | Bearer Token (Admin) |

---

## 🏷️ Blog Tag Endpoints

### 8. Get All Tags

| Field      | Value                  |
| ---------- | ---------------------- |
| **Method** | `GET`                  |
| **URL**    | `{{baseUrl}}/tags/all` |
| **Auth**   | None                   |

---

### 9. Create Tag

| Field      | Value                |
| ---------- | -------------------- |
| **Method** | `POST`               |
| **URL**    | `{{baseUrl}}/tags`   |
| **Auth**   | Bearer Token (Admin) |
| **Body**   | `raw → JSON`         |

**JSON body:**

```json
{
  "name": "JavaScript",
  "slug": "javascript"
}
```

---

### 10. Update Tag

| Field      | Value                  |
| ---------- | ---------------------- |
| **Method** | `PUT`                  |
| **URL**    | `{{baseUrl}}/tags/:id` |
| **Auth**   | Bearer Token (Admin)   |
| **Body**   | `raw → JSON`           |

**JSON body:**

```json
{
  "name": "TypeScript",
  "slug": "typescript"
}
```

---

### 11. Delete Tag

| Field      | Value                  |
| ---------- | ---------------------- |
| **Method** | `DELETE`               |
| **URL**    | `{{baseUrl}}/tags/:id` |
| **Auth**   | Bearer Token (Admin)   |

---

## 💬 Blog Comment Endpoints

### 12. Create Comment (Public)

| Field      | Value                  |
| ---------- | ---------------------- |
| **Method** | `POST`                 |
| **URL**    | `{{baseUrl}}/comments` |
| **Auth**   | None                   |
| **Body**   | `raw → JSON`           |

**JSON body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "comment": "Great article! Very helpful.",
  "blogId": "some-blog-uuid"
}
```

**JSON body (reply to a comment):**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "comment": "I agree with the above comment!",
  "blogId": "some-blog-uuid",
  "parentId": "some-parent-comment-uuid"
}
```

> ℹ️ Comments are `isApproved: false` by default. They won't show publicly until approved by admin.

---

### 13. Get All Comments (Admin)

| Field      | Value                      |
| ---------- | -------------------------- |
| **Method** | `GET`                      |
| **URL**    | `{{baseUrl}}/comments/all` |
| **Auth**   | Bearer Token (Admin)       |

**Query params (all optional):**
| Key | Example Value |
|--------------|---------------|
| `blogId` | `some-blog-uuid` |
| `isApproved` | `false` |

**Example URL:**

```
GET http://localhost:5000/api/blogs/comments/all?isApproved=false
```

---

### 14. Approve Comment (Admin)

| Field      | Value                              |
| ---------- | ---------------------------------- |
| **Method** | `PATCH`                            |
| **URL**    | `{{baseUrl}}/comments/:id/approve` |
| **Auth**   | Bearer Token (Admin)               |

---

### 15. Delete Comment (Admin)

| Field      | Value                      |
| ---------- | -------------------------- |
| **Method** | `DELETE`                   |
| **URL**    | `{{baseUrl}}/comments/:id` |
| **Auth**   | Bearer Token (Admin)       |

---

## ⚙️ Postman Environment Variables

Set these in your Postman environment for convenience:

| Variable    | Value                                            |
| ----------- | ------------------------------------------------ |
| `baseUrl`   | `http://localhost:5000/api/blogs`                |
| `token`     | `your_admin_jwt_token_here`                      |
| `blogId`    | _(paste a real blog UUID after creating one)_    |
| `tagId`     | _(paste a real tag UUID after creating one)_     |
| `commentId` | _(paste a real comment UUID after creating one)_ |

Then use `{{baseUrl}}`, `{{token}}`, etc. in your requests.
