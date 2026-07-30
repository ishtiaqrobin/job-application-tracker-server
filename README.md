# Job Application Tracker — Backend API

RESTful API for tracking job applications — manage applications, companies, contacts, interviews, documents, reminders, follow-ups, and more.

Built with **Express 5 + TypeScript + Prisma ORM + PostgreSQL**.

---

## Tech Stack

| Layer          | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| Language       | TypeScript (5.9)                                                 |
| Framework      | Express.js (5.x)                                                 |
| Database       | PostgreSQL                                                       |
| ORM            | Prisma (7.x) with `@prisma/adapter-pg`                           |
| Auth           | Better Auth (1.4)                                                |
| Validation     | Zod (4.x)                                                        |
| Email          | Nodemailer + EJS templates                                       |
| Rate Limiting  | express-rate-limit                                               |

---

## Project Structure

```
Backend/
├── prisma/
│   ├── schema/                    # Modular Prisma schema files
│   │   ├── schema.prisma          # Generator + datasource
│   │   ├── enums.prisma           # All enums
│   │   ├── auth.prisma            # User, Session, Account, Verification
│   │   ├── application.prisma     # JobApplication
│   │   ├── company.prisma         # Company
│   │   ├── contact.prisma         # Contact
│   │   ├── document.prisma        # Document
│   │   ├── interview.prisma       # Interview
│   │   ├── log.prisma             # ActivityLog
│   │   ├── reminder.prisma        # Reminder
│   │   ├── tag.prisma             # Tag
│   │   └── followup.prisma        # FollowUp
│   └── migrations/
├── src/
│   ├── app.ts                     # Express app setup & middleware
│   ├── server.ts                  # Entry point
│   └── app/
│       ├── config/                # env, cloudinary, multer
│       ├── lib/                   # prisma, auth (Better Auth)
│       ├── interfaces/            # TypeScript types
│       ├── errorHelpers/          # AppError, Zod/Prisma error handlers
│       ├── middlewares/            # auth, validateRequest, errorHandler, etc.
│       ├── routes/index.ts        # Route aggregator
│       ├── scripts/               # seedAdmin, verifyAdmin
│       ├── templates/             # EJS email templates
│       ├── utils/                 # catchAsync, sendResponse, email
│       └── modules/               # Feature modules
│           ├── auth/              # Register, login, logout, password mgmt
│           ├── user/              # Profile management
│           ├── company/           # Company CRUD
│           ├── application/       # Job application CRUD + stats
│           ├── contact/           # Contact person CRUD
│           ├── interview/         # Interview CRUD
│           ├── document/          # Document CRUD
│           ├── activity-log/      # Status change timeline (read-only)
│           ├── reminder/          # Reminder CRUD
│           ├── tag/               # Tag CRUD
│           ├── follow-up/         # Follow-up CRUD
│           └── health/            # Health check endpoint
├── doc/postman/                   # API test guides
├── .env.example
└── package.json
```

---

## Getting Started

```bash
# Install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and credentials

# Generate Prisma client & run migrations
npm run generate
npm run migrate

# Seed admin user (optional)
npm run seed:admin

# Start dev server
npm run dev
```

Server starts at `http://localhost:5000`.

---

## Environment Variables

| Key | Description | Required |
| --- | ----------- | -------- |
| `NODE_ENV` | `development` / `production` | Yes |
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Better Auth secret | Yes |
| `BETTER_AUTH_URL` | Backend base URL | Yes |
| `FRONTEND_URL` | Frontend URL (CORS + OAuth redirect) | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `CONTACT_RECEIVER_EMAIL` | Email for notifications | Yes |
| `EMAIL_SENDER_*` | SMTP configuration | Yes |
| `CLOUDINARY_*` | Cloudinary credentials | Yes |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Admin seed | For seeding |

---

## API Overview

All routes prefixed with `/api/v1`. Auth routes at `/api/auth` (Better Auth).

| Prefix | Module | Auth |
| ------ | ------ | ---- |
| `/api/auth/*` | Better Auth (login, register, OAuth, OTP) | Some |
| `/api/v1/auth/*` | Auth (change password, logout, verify/reset) | Some |
| `/api/v1/users/*` | User profile | USER, ADMIN |
| `/api/v1/companies/*` | Company CRUD | USER, ADMIN |
| `/api/v1/applications/*` | Job application CRUD + stats | USER, ADMIN |
| `/api/v1/contacts/*` | Contact person CRUD | USER, ADMIN |
| `/api/v1/interviews/*` | Interview CRUD | USER, ADMIN |
| `/api/v1/documents/*` | Document CRUD | USER, ADMIN |
| `/api/v1/activity-logs/*` | Status change timeline | USER, ADMIN |
| `/api/v1/reminders/*` | Reminder CRUD | USER, ADMIN |
| `/api/v1/tags/*` | Tag CRUD | USER, ADMIN |
| `/api/v1/follow-ups/*` | Follow-up CRUD | USER, ADMIN |
| `/health` | Health check | Public |

---

## Module Details

### Auth (`/api/v1/auth`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/register` | POST | No | Register via Better Auth |
| `/login` | POST | No | Login via Better Auth |
| `/change-password` | POST | USER, ADMIN | Change password |
| `/logout` | POST | USER, ADMIN | Destroy session |
| `/verify-email` | POST | No | Verify email with OTP |
| `/forget-password` | POST | No | Send password reset OTP |
| `/reset-password` | POST | No | Reset password with OTP |

### User (`/api/v1/users`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/me` | GET | USER, ADMIN | Get current profile |
| `/profile` | PUT | USER, ADMIN | Update profile (name, phone, image) |

### Company (`/api/v1/companies`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | USER, ADMIN | List companies (search, industry, location filters) |
| `/` | POST | USER, ADMIN | Create company |
| `/:id` | GET | USER, ADMIN | Get company with application/contact counts |
| `/:id` | PATCH | USER, ADMIN | Update company |
| `/:id` | DELETE | USER, ADMIN | Delete company |

### Application (`/api/v1/applications`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | USER, ADMIN | List applications (status, source, search, date filters + pagination) |
| `/stats` | GET | USER, ADMIN | Stats grouped by status, source, priority |
| `/` | POST | USER, ADMIN | Create application |
| `/:id` | GET | USER, ADMIN | Get application with all relations |
| `/:id` | PATCH | USER, ADMIN | Update application (status changes auto-log) |
| `/:id` | DELETE | USER, ADMIN | Delete application |

### Contact (`/api/v1/contacts`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | USER, ADMIN | List contacts (search, companyId, applicationId) |
| `/` | POST | USER, ADMIN | Create contact (name, role, email, phone, linkedin) |
| `/:id` | GET | USER, ADMIN | Get contact |
| `/:id` | PATCH | USER, ADMIN | Update contact |
| `/:id` | DELETE | USER, ADMIN | Delete contact |

### Interview (`/api/v1/interviews`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | POST | USER, ADMIN | Create interview |
| `/application/:applicationId` | GET | USER, ADMIN | List interviews for an application |
| `/:id` | PATCH | USER, ADMIN | Update interview |
| `/:id` | DELETE | USER, ADMIN | Delete interview |

### Document (`/api/v1/documents`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | POST | USER, ADMIN | Create document (resume, cover letter, etc.) |
| `/application/:applicationId` | GET | USER, ADMIN | List documents for an application |
| `/:id` | DELETE | USER, ADMIN | Delete document |

### Activity Log (`/api/v1/activity-logs`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/application/:applicationId` | GET | USER, ADMIN | Get status change timeline (read-only) |

Logs are auto-created when application status changes.

### Reminder (`/api/v1/reminders`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | USER, ADMIN | List reminders |
| `/` | POST | USER, ADMIN | Create reminder |
| `/:id` | PATCH | USER, ADMIN | Update reminder (mark complete, edit) |
| `/:id` | DELETE | USER, ADMIN | Delete reminder |

### Tag (`/api/v1/tags`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | GET | USER, ADMIN | List tags |
| `/` | POST | USER, ADMIN | Create tag (name, color) |
| `/:id` | PATCH | USER, ADMIN | Update tag |
| `/:id` | DELETE | USER, ADMIN | Delete tag |

### Follow-Up (`/api/v1/follow-ups`)

| Endpoint | Method | Auth | Description |
| -------- | ------ | ---- | ----------- |
| `/` | POST | USER, ADMIN | Create follow-up (auto-increments application's followUpCount) |
| `/application/:applicationId` | GET | USER, ADMIN | List follow-ups for an application |
| `/:id` | DELETE | USER, ADMIN | Delete follow-up (auto-decrements followUpCount) |

### Health

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/health` | GET | Server health (DB status, latency, uptime, memory) |

---

## Architecture

### Module Pattern
```
Route → Controller → Service → Prisma
```

Each module has 5 files: `interface.ts`, `validation.ts`, `service.ts`, `controller.ts`, `route.ts`.

### Data Ownership
- All data is user-scoped — users only see their own applications, contacts, reminders, etc.
- Admins can also access all data.

### Auto Audit Trail
- Status changes on applications automatically create entries in `ActivityLog`
- Creating/deleting follow-ups automatically updates `followUpCount` on the application

---

## Error Handling

| Error Type | HTTP Status | Description |
| ---------- | ----------- | ----------- |
| `AppError` | Custom | Operational errors |
| `ZodError` | 400 | Validation failures |
| Prisma `P2002` | 409 | Unique constraint |
| Prisma `P2025` | 404 | Not found |
| Prisma `P2003` | 400 | Foreign key violation |

---

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Generate Prisma + tsup bundle |
| `npm run migrate` | Run Prisma migrations |
| `npm run generate` | Generate Prisma client |
| `npm run studio` | Open Prisma Studio |
| `npm run seed:admin` | Seed admin user |

---

## Database

### Models

| Model | Description |
| ----- | ----------- |
| User | Auth users (USER/ADMIN roles) |
| JobApplication | Core — tracks each job application |
| Company | Companies applied to |
| Contact | People at companies (HR, recruiters) |
| Interview | Interview rounds per application |
| Document | Resumes, cover letters, etc. |
| ActivityLog | Auto-generated status change history |
| Reminder | Follow-up or deadline reminders |
| Tag | User-defined labels for applications |
| FollowUp | Track individual follow-up attempts |

### Enums

`Role`, `UserStatus`, `JobNature`, `WorkMode`, `ExperienceLevel`, `ApplicationStatus`, `Priority`, `ApplicationSource`, `InterviewRound`, `InterviewResult`, `DocumentType`

---

## Postman Testing

API test guides are in `doc/postman/`. Import the markdown files for endpoint-by-endpoint testing instructions.

---

## License

MIT
