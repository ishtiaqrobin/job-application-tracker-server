# Sitemap & SEO

Auto-generated `sitemap.xml`, `sitemap.json`, and `robots.txt` for SEO.
Whenever a new **Blog**, **Project**, **Service**, **Certificate**, or **Product**
is created/updated in the database, the sitemap reflects the change on the
next request — no manual rebuild needed.

---

## Endpoints

All endpoints are mounted at the **root**, not under `/api/v1`, because Google
and other crawlers expect the canonical URL `/sitemap.xml` / `/robots.txt`.

| Method | URL             | Description                              |
| ------ | --------------- | ---------------------------------------- |
| GET    | `/sitemap.xml`  | XML sitemap (Google / Bing consume this) |
| GET    | `/sitemap.json` | JSON form — useful for debugging / FE    |
| GET    | `/robots.txt`   | robots.txt referencing the sitemap       |

Response is cached via `Cache-Control: public, max-age=3600` (1 hour) for
the sitemap and 24 hours for robots.txt, so the DB is not hit on every
crawler request.

---

## What gets included

### Static routes (always present)

- `/`
- `/about`
- `/projects`
- `/blogs`
- `/services`
- `/certificates`
- `/gallery`
- `/contact`
- `/store`

### Dynamic routes (from DB)

| Model       | Filter              | URL pattern          |
| ----------- | ------------------- | -------------------- |
| Blog        | `status: PUBLISHED` | `/blogs/{slug}`      |
| Project     | `isPublished: true` | `/projects/{id}`     |
| Service     | `isPublished: true` | `/services/{id}`     |
| Certificate | `isPublished: true` | `/certificates/{id}` |
| Product     | `status: PUBLISHED` | `/store/{slug}`      |

`lastmod` is derived from `updatedAt` (or `publishedAt` for blogs as a
fallback). Drafts and unpublished items are excluded automatically.

---

## Postman / curl

```bash
curl http://localhost:5000/sitemap.xml
curl http://localhost:5000/sitemap.json
curl http://localhost:5000/robots.txt
```

Expected: `200 OK`, `Content-Type: application/xml` (or `text/plain` for
robots). The XML validates against the
[sitemaps.org 0.9 schema](https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd).

---

## Submitting to Google

1. Deploy backend (sitemap URL: `https://api.your-domain.com/sitemap.xml`).
2. Go to [Google Search Console](https://search.google.com/search-console).
3. Add your **frontend** property.
4. **Sitemaps** → enter the backend sitemap URL → **Submit**.
5. Google will re-crawl periodically; the cache header keeps things fast.

> Tip: If you serve the frontend on `your-domain.com` and the backend on
> `api.your-domain.com`, you can also proxy `your-domain.com/sitemap.xml`
> → `api.your-domain.com/sitemap.xml` in Next.js `rewrites` for a fully
> canonical setup.

### Next.js rewrite example

```ts
// Frontend/next.config.ts
async rewrites() {
  return [
    {
      source: "/sitemap.xml",
      destination: `${process.env.NEXT_PUBLIC_API_URL}/sitemap.xml`,
    },
    {
      source: "/robots.txt",
      destination: `${process.env.NEXT_PUBLIC_API_URL}/robots.txt`,
    },
  ];
}
```

---

## Adding a new model to the sitemap

Open `src/app/modules/sitemap/sitemap.service.ts` and:

1. Add a new `prisma.<model>.findMany(...)` inside `getDynamicRoutes`'s
   `Promise.all`.
2. Map it to `SitemapUrl[]` with the correct `loc`, `lastmod`,
   `changefreq`, and `priority`.
3. Spread it into the returned array.

That's it — no other file changes required.
