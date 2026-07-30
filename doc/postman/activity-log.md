# Activity Log API — Postman Test Guide

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

> **Note:** Activity logs are created **automatically** when a job application status changes. You don't create them manually.

---

## 1. GET — Activity Logs by Application (Protected)

```
GET {{BASE_URL}}/activity-logs/application/{{APPLICATION_ID}}
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Activity logs retrieved successfully",
  "data": [
    {
      "id": "cm8...",
      "jobApplicationId": "cm8...",
      "fromStatus": null,
      "toStatus": "APPLIED",
      "note": "Application created",
      "createdAt": "2026-07-31T10:00:00.000Z"
    },
    {
      "id": "cm8...",
      "jobApplicationId": "cm8...",
      "fromStatus": "APPLIED",
      "toStatus": "SHORT_LISTED",
      "note": null,
      "createdAt": "2026-08-01T10:00:00.000Z"
    },
    {
      "id": "cm8...",
      "jobApplicationId": "cm8...",
      "fromStatus": "SHORT_LISTED",
      "toStatus": "INTERVIEW",
      "note": null,
      "createdAt": "2026-08-05T10:00:00.000Z"
    }
  ]
}
```

---

## How Activity Logs Work

| Action | What happens |
|--------|-------------|
| Application created | Log created with `fromStatus: null`, `toStatus: APPLIED` |
| Status updated via PATCH | Log created with previous status → new status |
| Other updates (no status change) | No log created |

The activity log is read-only via API. It provides an automatic audit trail of every status change.
