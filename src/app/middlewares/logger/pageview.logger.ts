import { Request, Response, NextFunction } from "express";
import { writeLog } from "./index";

/**
 * pageviewLogger — প্রতিটি page visit লগ করে।
 * DB schema: PageView { page, userAgent, ipAddress, country, city, referrer }
 *
 * NOTE: country ও city পেতে IP geolocation middleware দরকার।
 * e.g. `express-ipinfo` বা `@maxmind/geoip2-node`
 * Middleware সেট করলে req.ipInfo.country ও req.ipInfo.city available হবে।
 *
 * Usage (app.ts — core middleware-এর পরে):
 *   app.use(pageviewLogger);
 */

// Static assets — log করার দরকার নেই
const IGNORED_EXT =
  /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|webp|avif)$/i;

// API ও internal routes বাদ দেওয়া হবে
const IGNORED_PREFIX = ["/api/", "/health", "/favicon", "/_next", "/static"];

// Portfolio sections — route অনুযায়ী customize করুন
const SECTION_MAP: [string, string][] = [
  ["/projects", "projects"],
  ["/work", "projects"],
  ["/blog", "blog"],
  ["/posts", "blog"],
  ["/about", "about"],
  ["/contact", "contact"],
  ["/resume", "resume"],
  ["/cv", "resume"],
  ["/skills", "skills"],
  ["/services", "services"],
  ["/store", "store"],
  ["/gallery", "gallery"],
  ["/reviews", "reviews"],
];

export const pageviewLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method !== "GET") return next();

  const cleanPath = req.originalUrl.split("?")[0];

  if (
    IGNORED_EXT.test(cleanPath as string) ||
    IGNORED_PREFIX.some((p) => cleanPath?.startsWith(p))
  ) {
    return next();
  }

  res.on("finish", async () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    try {
      // IP geolocation — middleware set করলে পাওয়া যাবে
      const ipInfo = (req as any).ipInfo ?? {};

      await writeLog("pageviews.log", {
        timestamp: new Date().toISOString(),
        level: "INFO",
        // PageView model fields
        page: cleanPath,
        userAgent: req.get("user-agent") || "unknown",
        ipAddress: req.ip ?? null,
        country: ipInfo.country ?? null, // PageView.country
        city: ipInfo.city ?? null, // PageView.city
        referrer: req.get("referer") || req.get("referrer") || null,
        // Extra context (file log শুধু — DB-তে নেই)
        section: resolveSection(cleanPath as string),
        query: Object.keys(req.query).length ? req.query : null,
        language: req.get("accept-language")?.split(",")[0] ?? null,
        statusCode: res.statusCode,
      });
    } catch (err) {
      console.error("Failed to write pageview log:", err);
    }
  });

  next();
};

function resolveSection(path: string): string {
  if (path === "/" || path === "") return "home";
  for (const [prefix, section] of SECTION_MAP) {
    if (path.startsWith(prefix)) return section;
  }
  return "other";
}
