# Ishtiaq Robin — Portfolio Backend API

RESTful API for the [Ishtiaq Robin](https://ishtiaqrobin.com) portfolio website. Handles authentication, portfolio CRUD (projects, experiences, awards, reviews, etc.), contact management, AI chatbot, analytics, SEO sitemaps, and admin controls.

Built with **Express 5 + TypeScript + Prisma ORM + PostgreSQL**, deployed on **Vercel**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Module Details](#module-details)
- [Architecture & Patterns](#architecture--patterns)
- [Error Handling](#error-handling)
- [File Upload](#file-upload)
- [Email System](#email-system)
- [AI Chatbot](#ai-chatbot)
- [Authentication & Authorization](#authentication--authorization)
- [Rate Limiting](#rate-limiting)
- [Sitemap & SEO](#sitemap--seo)
- [Database](#database)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Language         | [TypeScript](https://www.typescriptlang.org/) (5.9)               |
| Framework        | [Express.js](https://expressjs.com/) (5.x)                        |
| Database         | [PostgreSQL](https://www.postgresql.org/)                         |
| ORM              | [Prisma](https://www.prisma.io/) (7.x) with `@prisma/adapter-pg`  |
| Auth             | [Better Auth](https://www.better-auth.com/) (1.4)                 |
| Validation       | [Zod](https://zod.dev/) (4.x)                                     |
| Cloud Storage    | [Cloudinary](https://cloudinary.com/) + Multer                    |
| Email            | [Nodemailer](https://nodemailer.com/) + EJS templates             |
| Payments         | [Stripe](https://stripe.com/) (22.x)                              |
| Rate Limiting    | [express-rate-limit](https://express-rate-limit.com/)             |
| XSS Protection   | [sanitize-html](https://github.com/apostrophecms/sanitize-html)   |
| Build Tool       | [tsup](https://tsup.egoist.dev/) (ESM bundler)                    |
| Runtime          | Node.js 20+                                                       |

---

## Project Structure

```
Backend/
├── api/                          # tsup build output (Vercel entry)
│   └── server.js
├── doc/                          # Documentation
│   ├── config/
│   │   └── ai_provider.md        # AI provider setup guide
│   ├── deploy/
│   │   └── deployment_guide.md   # Vercel deployment guide
│   └── test/                     # Postman testing guides
│       ├── blog.md
│       ├── chatbot.md
│       ├── postman.md
│       ├── sitemap.md
│       └── translation.md
├── prisma/
│   ├── schema/                   # Modular Prisma schema files
│   │   ├── schema.prisma         # Generator + datasource
│   │   ├── about.prisma
│   │   ├── admin.prisma
│   │   ├── analytics.prisma
│   │   ├── auth.prisma           # User, Session, Account, Verification
│   │   ├── award.prisma
│   │   ├── blog.prisma
│   │   ├── category.prisma
│   │   ├── chatbot.prisma        # AiProviderConfig, ChatbotConfig
│   │   ├── contact.prisma
│   │   ├── enums.prisma
│   │   ├── experience.prisma
│   │   ├── faq.prisma
│   │   ├── project.prisma
│   │   ├── review.prisma
│   │   └── settings.prisma
│   └── migrations/               # Auto-generated SQL migrations
├── src/
│   ├── generated/prisma/         # Generated Prisma client (gitignored)
│   ├── app.ts                    # Express app setup & middleware
│   ├── server.ts                 # Entry point (DB connect + listen)
│   ├── app/
│   │   ├── config/
│   │   │   ├── env.ts            # Environment variable loader
│   │   │   ├── cloudinary.config.ts
│   │   │   └── multer.config.ts   # Multer → Cloudinary storage factory
│   │   ├── lib/
│   │   │   ├── prisma.ts         # Prisma client singleton
│   │   │   └── auth.ts           # Better Auth configuration
│   │   ├── interfaces/
│   │   │   ├── error.interface.ts
│   │   │   ├── requestUser.interface.ts
│   │   │   └── index.d.ts        # Express.Request augmentation
│   │   ├── errorHelpers/
│   │   │   ├── AppError.ts        # Operational error class
│   │   │   ├── handleZodError.ts
│   │   │   └── handlePrismaError.ts  # 10+ Prisma error codes
│   │   ├── middlewares/
│   │   │   ├── auth.ts            # Better Auth session + role guard
│   │   │   ├── validateRequest.ts # Zod validation middleware
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   ├── rateLimiter.ts     # Global, auth, and strict limiters
│   │   │   └── logger/            # Activity loggers (commented out)
│   │   ├── routes/
│   │   │   └── index.ts           # Route aggregator
│   │   ├── scripts/
│   │   │   ├── seedAdmin.ts      # Create/update admin user
│   │   │   └── verifyAdmin.ts    # Debug admin user state
│   │   ├── templates/            # EJS email templates
│   │   │   ├── otp.ejs
│   │   │   ├── reset-otp.ejs
│   │   │   ├── contact.ejs
│   │   │   ├── appointment-confirmed.ejs
│   │   │   ├── blog-comment-approved.ejs
│   │   │   ├── googleRedirect.ejs
│   │   │   └── rss-verify.ejs
│   │   ├── utils/
│   │   │   ├── catchAsync.ts      # Async error wrapper
│   │   │   ├── sendResponse.ts    # Standardized JSON response
│   │   │   ├── email.ts          # Nodemailer transport
│   │   │   └── sanitize.ts       # XSS sanitization (text, rich, URL)
│   │   └── modules/              # Feature modules (see below)
│   └── ...
├── .env.example
├── .gitignore
├── .npmrc
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── prisma.config.ts              # Prisma CLI config (multi-file schema)
├── tsconfig.json
├── tsup.config.ts                # ESM bundler config
└── vercel.json                   # Vercel serverless config
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL instance (local or cloud — e.g., Neon, Supabase)
- Cloudinary account (for image uploads)
- SMTP credentials (e.g., Gmail App Password)
- Google OAuth credentials (for social login)
- (Optional) AI provider API key for chatbot

### Installation

```bash
# 1. Clone & install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Generate Prisma client & run migrations
npm run generate
npm run migrate

# 4. Seed initial admin user (optional)
npm run seed:admin

# 5. Start dev server (hot reload)
npm run dev
```

The server starts at `http://localhost:5000`.

---

## Environment Variables

| Key | Description | Required |
| --- | ----------- | -------- |
| `NODE_ENV` | `development` / `production` | Yes |
| `PORT` | Server port (default: `5000`) | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Better Auth secret key | Yes |
| `BETTER_AUTH_URL` | Backend base URL (e.g. `http://localhost:5000`) | Yes |
| `FRONTEND_URL` | Frontend URL for CORS & OAuth redirect | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `1d`) | Yes |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | Yes |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiry (e.g. `30d`) | Yes |
| `CONTACT_RECEIVER_EMAIL` | Email to receive contact submissions | Yes |
| `EMAIL_SENDER_SMTP_USER` | SMTP username | Yes |
| `EMAIL_SENDER_SMTP_PASS` | SMTP password / app password | Yes |
| `EMAIL_SENDER_SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) | Yes |
| `EMAIL_SENDER_SMTP_PORT` | SMTP port (e.g. `465`) | Yes |
| `EMAIL_SENDER_SMTP_FROM` | From address for outgoing emails | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `IPINFO_TOKEN` | IP geolocation token (ipinfo.io) | No |
| `CHATBOT_RATE_LIMIT` | Max chatbot requests per window (default: `10`) | No |
| `CHATBOT_RATE_LIMIT_WINDOW` | Rate limit window in seconds (default: `60`) | No |
| `ADMIN_EMAIL` | Admin seed email | For seeding |
| `ADMIN_PASSWORD` | Admin seed password | For seeding |
| `ADMIN_NAME` | Admin seed display name | For seeding |

---

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start dev server with `tsx watch` (hot reload) |
| `npm run build` | Generate Prisma client + tsup bundle to `api/` |
| `npm run migrate` | Run Prisma migrations in dev mode |
| `npm run migrate:deploy` | Run migrations in production |
| `npm run generate` | Generate Prisma client |
| `npm run db` | Push schema to DB (no migration file) |
| `npm run studio` | Open Prisma Studio (data browser) |
| `npm run reset` | Drop + recreate database |
| `npm run seed:admin` | Seed initial admin user via Better Auth |

---

## API Overview

All API routes are prefixed with `/api/v1`. Auth routes use `/api/auth` (handled by Better Auth).

### Base URL

| Environment | URL |
| ----------- | --- |
| Development | `http://localhost:5000` |
| Production  | `https://api.ishtiaqrobin.com` (or your Vercel domain) |

### Route Map

| Prefix | Module | Auth Required |
| ------ | ------ | ------------- |
| `/api/auth/*` | Better Auth (login, register, OAuth, OTP) | Some |
| `/api/v1/auth/*` | Auth (change password, logout, verify/reset) | Some |
| `/api/v1/users/*` | User profile | USER, ADMIN |
| `/api/v1/admins/*` | Admin controls | ADMIN |
| `/api/v1/projects/*` | Projects | Public GET, ADMIN for write |
| `/api/v1/categories/*` | Categories | Public GET, ADMIN for write |
| `/api/v1/reviews/*` | Reviews | USER for create, ADMIN for manage |
| `/api/v1/contacts/*` | Contact messages | Public POST, ADMIN for manage |
| `/api/v1/settings/*` | Site settings | Public GET, ADMIN for write |
| `/api/v1/about/*` | About section | Public GET, ADMIN for write |
| `/api/v1/experiences/*` | Work experience | Public GET, ADMIN for write |
| `/api/v1/awards/*` | Awards | Public GET, ADMIN for write |
| `/api/v1/faqs/*` | FAQs | Public GET, ADMIN for write |
| `/api/v1/analytics/*` | Page views & resume downloads | Public POST, ADMIN for stats |
| `/api/v1/chatbot/*` | AI chatbot | Public |
| `/sitemap.xml` | XML sitemap | Public |
| `/sitemap.json` | JSON sitemap | Public |
| `/robots.txt` | Robots file | Public |
| `/health` | Health check | Public |

---

## Module Details

Each module follows a strict **Controller → Service → Prisma** layered architecture with optional Zod validation.

### Auth (`/api/v1/auth`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/register` | POST | No | Register with email/password via Better Auth |
| `/login` | POST | No | Login via Better Auth, sets session cookie |
| `/change-password` | POST | USER, ADMIN | Change current password |
| `/logout` | POST | USER, ADMIN | Destroy session |
| `/verify-email` | POST | No | Verify email with OTP (6 digits, 5 min expiry) |
| `/forget-password` | POST | No | Send password reset OTP |
| `/reset-password` | POST | No | Reset password with OTP |

Better Auth handles `/api/auth/*` for sign-up, sign-in, OAuth callbacks, and OTP natively.

**Auth flow:**
- Registration: Sign up → OTP sent to email → Verify OTP → Active session
- Login: Email/password → Session cookie set → Authenticated requests
- Google OAuth: Frontend proxies to `/api/auth/callback/google` (same-domain strategy avoids CORS issues)
- Password reset: Forget password → OTP email → Reset with OTP + new password

### User (`/api/v1/users`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/me` | GET | USER, ADMIN | Get current user profile |
| `/profile` | PUT | USER, ADMIN | Update profile (name, phone, image) |

Supports profile image upload via Multer → Cloudinary.

### Admin (`/api/v1/admins`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/users` | GET | ADMIN | List all users (optional `?role=USER\|ADMIN`) |
| `/users/:userId/ban` | PATCH | ADMIN | Ban a user |
| `/users/:userId/unban` | PATCH | ADMIN | Unban a user |
| `/stats` | GET | ADMIN | Dashboard statistics |

**Dashboard stats include:** total users (by role, verified/unverified), projects, categories, reviews, contacts (unread), and page views. Additional fields are reserved for future modules (skills, services, blogs, store, etc.).

### Projects (`/api/v1/projects`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | List all projects (`?categoryId=&isPublished=&isFeatured=`) |
| `/slug/:slug` | GET | No | Get project by URL slug |
| `/:id` | GET | No | Get project by ID |
| `/` | POST | ADMIN | Create project (multipart: thumbnail, bannerImage) |
| `/:id` | PUT | ADMIN | Update project |
| `/:id` | DELETE | ADMIN | Delete project (+ cloudinary cleanup) |

**Project fields:** `title`, `slug` (unique), `description`, `thumbnail`, `bannerImage`, `year`, `bgColor`, `liveUrl`, `githubUrl`, `roles`, `client`, `techStack` (string[]), `tags` (string[]), `sections` (JSON array of `{id, label, content}`), `isFeatured`, `isPublished`, `sortOrder`, `categoryId`.

Projects are ordered by `sortOrder` ASC. The `sections` JSON field stores flexible project pages (e.g., overview, challenges, results).

### Categories (`/api/v1/categories`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | List all categories (ordered by `sortOrder`) |
| `/` | POST | ADMIN | Create category |
| `/:categoryId` | PUT | ADMIN | Update category |
| `/:categoryId` | DELETE | ADMIN | Delete category |

Categories organize projects. Each project belongs to one category.

### Reviews (`/api/v1/reviews`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | Get approved reviews (`?limit=`) |
| `/my-review` | GET | USER | Get current user's review |
| `/` | POST | USER | Create review (one per user) |
| `/:id` | PUT | USER, ADMIN | Update review (owner or admin) |
| `/:id` | DELETE | USER, ADMIN | Delete review (owner or admin) |
| `/:id/approve` | PATCH | ADMIN | Approve review (public visibility) |
| `/:id/pin` | PATCH | ADMIN | Toggle pin/unpin review |

Reviews are one-per-user (`userId @unique`). Admin must approve before public display.

### Contact (`/api/v1/contacts`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | POST | No | Submit contact form |
| `/` | GET | ADMIN | List contacts (`?status=UNREAD\|READ\|REPLIED\|ARCHIVED`) |
| `/:id` | GET | ADMIN | Get single contact |
| `/:id/status` | PATCH | ADMIN | Update contact status |
| `/:id/reply` | POST | ADMIN | Send email reply to contact |

Contact submissions automatically send a notification email to `CONTACT_RECEIVER_EMAIL`.

### Settings (`/api/v1/settings`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | Get site settings |
| `/` | PUT | ADMIN | Update settings (upsert) |

Singleton model. Stores social links (LinkedIn, GitHub, Facebook, Instagram, Twitter, YouTube), contact info (email, phone, WhatsApp, address), availability status, and SEO meta fields.

### About (`/api/v1/about`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | Get about section |
| `/` | POST | ADMIN | Create/upsert about |
| `/` | PUT | ADMIN | Update about |

Singleton model with `id = "singleton"`. Supports `aboutMeImg` upload and `resumeUrl` link.

### Experiences (`/api/v1/experiences`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | List experiences |
| `/` | POST | ADMIN | Create experience |
| `/:id` | PUT | ADMIN | Update experience |
| `/:id` | DELETE | ADMIN | Delete experience |

**Fields:** `position`, `companyName`, `companyUrl`, `companyLogo`, `responsibilities`, `startDate`, `endDate` (null = Present), `isPublished`, `sortOrder`.

### Awards (`/api/v1/awards`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | List awards |
| `/` | POST | ADMIN | Create award |
| `/:id` | PUT | ADMIN | Update award |
| `/:id` | DELETE | ADMIN | Delete award |

**Fields:** `title`, `subTitle`, `date`, `details` (JSON array stored as string), `isPublished`, `sortOrder`.

### FAQs (`/api/v1/faqs`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | No | List FAQs |
| `/` | POST | ADMIN | Create FAQ |
| `/:id` | PUT | ADMIN | Update FAQ |
| `/:id` | DELETE | ADMIN | Delete FAQ |

**Fields:** `question`, `answer`, `isPublished`, `sortOrder`.

### Analytics (`/api/v1/analytics`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/pageview` | POST | No | Log a page view |
| `/resume-download` | POST | No | Log a resume download |
| `/stats` | GET | ADMIN | Get aggregate stats |

Page views track `page`, `userAgent`, `ipAddress`, `country`, `city`, `referrer`. Resume downloads track `ipAddress`, `country`, `userAgent`.

### Chatbot (`/api/v1/chatbot`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/ai-provider` | GET | ADMIN | Get AI provider config |
| `/ai-provider` | PUT | ADMIN | Update AI provider (upsert) |
| `/config` | GET | ADMIN | Get chatbot config |
| `/config` | PUT | ADMIN | Update chatbot config (upsert) |
| `/message` | POST | No | Send message to chatbot |
| `/logs` | GET | ADMIN | Get chatbot conversation logs |
| `/logs/:id` | DELETE | ADMIN | Delete a specific log |

**AI Provider Config:** Supports Gemini, OpenAI, Anthropic, or any OpenAI-compatible endpoint. Configured via `AiProviderConfig` singleton — change provider/model in dashboard without redeploying.

**Chatbot Config:** Singleton with `isEnabled`, `botName`, `welcomeMsg`, `systemPrompt`. Rate limiting is configured via `.env` (`CHATBOT_RATE_LIMIT`, `CHATBOT_RATE_LIMIT_WINDOW`).

### Sitemap & SEO

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/sitemap.xml` | GET | Auto-generated XML sitemap (cached 1 hour) |
| `/sitemap.json` | GET | JSON representation for debugging |
| `/robots.txt` | GET | Robots file pointing to sitemap (cached 24h) |

Dynamic routes are pulled live from the database so new blogs, projects, services appear automatically.

### Health Check

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/health` | GET | Server health (DB status, latency, uptime, memory) |

---

## Architecture & Patterns

### Controller → Service → Prisma

Every module follows a strict three-layer pattern:

```
Route (HTTP verb + path)
  → Controller (parse request, call service, send response)
    → Service (business logic, Prisma queries)
      → Prisma Client (database operations)
```

Controllers use `catchAsync` to forward errors to the global error handler instead of try/catch in every method.

### Response Shape

All API responses follow a consistent JSON shape:

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": { ... }
}
```

Error responses include `errorSources` (field-level details) and `stack` (development only).

### Singleton Pattern

Models that should have exactly one row (About, Settings, AiProviderConfig, ChatbotConfig) use `id = "singleton"` as a fixed primary key. The service layer uses Prisma's `upsert` for idempotent creation/updates.

### File Upload Pipeline

1. Client sends `multipart/form-data`
2. Multer middleware parses file(s) and uploads to Cloudinary
3. Cloudinary returns the URL in `req.file.path`
4. Controller extracts the URL and passes it to the service
5. Global error handler cleans up orphaned uploads if an error occurs

Cloudinary folders are organized as `ishtiaq-robin/{about|projects|profiles|blogs|experiences}`.

---

## Error Handling

The global error handler at `src/app/middlewares/globalErrorHandler.ts` handles:

| Error Type | HTTP Status | Description |
| ---------- | ----------- | ----------- |
| `AppError` | Custom | Operational errors (not found, bad request, conflict) |
| `ZodError` | 400 | Schema validation failures |
| Prisma `P2002` | 409 | Unique constraint violation |
| Prisma `P2025` | 404 | Record not found |
| Prisma `P2003` | 400 | Foreign key violation |
| Prisma `P2000` | 400 | Value too long |
| Prisma `P2011` | 400 | Null constraint violation |
| Prisma `P2023` | 400 | Invalid ID format |
| Prisma `P2024` | 503 | Connection timeout |
| Prisma `P2034` | 409 | Transaction conflict |
| Prisma validation | 400 | Invalid data types |
| Prisma init error | 503 | DB unavailable |
| Multer errors | 400 | File size, count, unexpected field |
| `SyntaxError` (JSON) | 400 | Malformed request body |
| Network errors | 503 | `ECONNREFUSED`, `ECONNRESET`, etc. |
| Generic `Error` | 500 | Fallback (message hidden in production) |

---

## File Upload

Configured via `createMulterUpload(folder)` factory in `src/app/config/multer.config.ts`:

```typescript
const upload = createMulterUpload("projects"); // folder: ishtiaq-robin/projects
```

**Allowed file types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`, `application/pdf`
**Max file size:** 5MB

### Manual Cloudinary Functions

- `uploadFileToCloudinary(buffer, fileName, folder)` — upload from buffer
- `deleteFileFromCloudinary(imageUrl)` — delete by extracting `public_id` from URL

---

## Email System

Uses **Nodemailer** with **EJS templates** stored in `src/app/templates/`.

### Available Templates

| Template | Purpose |
| -------- | ------- |
| `otp.ejs` | Email verification OTP |
| `reset-otp.ejs` | Password reset OTP |
| `contact.ejs` | Contact form notification to admin |
| `appointment-confirmed.ejs` | Appointment confirmation |
| `blog-comment-approved.ejs` | Blog comment approval notification |
| `googleRedirect.ejs` | Google OAuth redirect page |
| `rss-verify.ejs` | RSS subscription verification |

### Sending Email

```typescript
await sendEmail({
  to: "user@example.com",
  subject: "Verify your email",
  templateName: "otp",
  templateData: { name: "User", otp: "123456" },
});
```

---

## AI Chatbot

The chatbot supports multiple AI providers through a configurable singleton (`AiProviderConfig`):

| Provider | Endpoint |
| -------- | -------- |
| Gemini | Default (Gemini 2.0 Flash) |
| OpenAI | GPT-4o, GPT-4, etc. |
| Anthropic | Claude 3.5 Haiku/Sonnet |
| Custom | Any OpenAI-compatible API (e.g., Groq, OpenRouter) |

Configuration can be changed from the admin dashboard at runtime without redeploying.

The chatbot uses your portfolio data (projects, experiences, skills, about) as context to answer visitor questions intelligently.

---

## Authentication & Authorization

### Better Auth Integration

Better Auth handles:
- Email/password registration & login
- Google OAuth
- Session management (7-day expiry, 1-day refresh)
- Email OTP verification (6 digits, 5 min expiry)
- Password reset via OTP

### Session Flow

1. Better Auth sets `better-auth.session_token` cookie on login/register
2. Frontend proxies `/api/auth/*` via Next.js rewrites (same-domain strategy)
3. Backend validates session via `auth.api.getSession()` in the auth middleware
4. Session cookies use `SameSite=Lax`, `Secure=true`, `HttpOnly=true`

### Role-Based Access

Two roles: `USER` (default) and `ADMIN`.

```typescript
// Protect a route
router.get("/admin/users", auth(UserRole.ADMIN), AdminController.getAllUsers);

// Allow both roles
router.post("/auth/logout", auth(UserRole.USER, UserRole.ADMIN), AuthController.logoutUser);
```

### Additional User Fields

Better Auth's `user.additionalFields` stores: `role`, `status` (ACTIVE/BLOCKED/DELETED), `needPasswordChange`, `isDeleted`, `deletedAt`, `isActive`, `isBanned`, `isReviewed`, `reviewId`.

---

## Rate Limiting

Three tiers defined in `src/app/middlewares/rateLimiter.ts`:

| Limiter | Window | Max Requests | Applied To |
| ------- | ------ | ------------ | ---------- |
| `globalLimiter` | 15 min | 10,000 | `/api/v1/*` |
| `authLimiter` | 15 min | 2,000 | `/api/auth/*` |
| `strictLimiter` | 1 min | 1,000 | Per-route opt-in |

All limiters return a consistent JSON error shape matching the API's error response format.

---

## Sitemap & SEO

Dynamic sitemap generation at `/sitemap.xml` includes:

**Static routes (hardcoded):** `/`, `/about`, `/projects`, `/blogs`, `/services`, `/certificates`, `/gallery`, `/contact`, `/store`

**Dynamic routes (from DB):** Published blogs, published projects, published services, published certificates, published products

Robots.txt at `/robots.txt` disallows `/admin`, `/dashboard`, `/api` and points to the sitemap URL.

---

## Database

### ERD Overview

```
User (1) ──── (1) AdminProfile
User (1) ──── (0..1) Review
User (1) ──── (*) Session
User (1) ──── (*) Account
Category (1) ──── (*) Project
Blog (1) ──── (*) BlogComment
Blog (*) ──── (*) BlogTag (implicit many-to-many)
```

### Singleton Models

| Model | ID | Purpose |
| ----- | -- | ------- |
| About | `"singleton"` | About section content |
| Settings | `"singleton"` | Site-wide settings |
| AiProviderConfig | `"singleton"` | AI provider configuration |
| ChatbotConfig | `"singleton"` | Chatbot behavior settings |

### Enums

`Role` (USER, ADMIN), `UserStatus` (ACTIVE, BLOCKED, DELETED), `SkillLevel` (EXPERT, INTERMEDIATE, LEARNING, RECENTLY_LEARNED), `ContactStatus` (UNREAD, READ, REPLIED, ARCHIVED), `BlogStatus` (DRAFT, PUBLISHED, ARCHIVED), `AppointmentStatus` (PENDING, CONFIRMED, CANCELLED, COMPLETED), `ProductStatus` (DRAFT, PUBLISHED, OUT_OF_STOCK, ARCHIVED), `OrderStatus` (PENDING, PAID, DELIVERED, REFUNDED, CANCELLED).

### Migrations

Prisma migrations are stored in `prisma/migrations/`. Run with:

```bash
npm run migrate       # dev (creates migration file)
npm run migrate:deploy # prod (applies pending migrations)
```

Prisma config in `prisma.config.ts` uses the multi-file schema directory (`prisma/schema/`) and outputs the generated client to `src/generated/prisma/`.

---

## Deployment

The backend is deployed on **Vercel** as a serverless function.

### Build Process

1. `npm run build` runs `prisma generate` then `tsup`
2. `tsup` bundles `src/server.ts` → `api/server.js` (ESM, Node 20 target)
3. Vercel routes all requests to `api/server.js`

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [{ "src": "api/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/server.js" }]
}
```

### Important Notes

- The Prisma client is generated at build time via `postinstall` hook
- `pg-native` is excluded from the bundle (not available on Vercel)
- Environment variables must be set in Vercel dashboard
- The `.npmrc` file uses `legacy-peer-deps=true` for compatibility

### Doc Guides

See `doc/deploy/deployment_guide.md` for detailed deployment steps.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## License

[MIT](./LICENSE)