import { Request, Response, NextFunction } from "express";
import { writeLog } from "./index";

/**
 * resumeDownloadLogger — CV/Resume download track করে।
 * DB schema:
 *   ResumeDownloadLog { ipAddress, country, userAgent }
 *   About.resumeDownloadCount (increment হবে service layer-এ)
 *
 * NOTE: country পেতে IP geolocation middleware দরকার (pageview.logger-এর মতো)।
 *
 * এটি route-level middleware — global নয়।
 *
 * Usage (resume route):
 *   router.get("/resume", resumeDownloadLogger, serveResumeHandler);
 *   // অথবা:
 *   app.use("/resume.pdf", resumeDownloadLogger);
 */
export const resumeDownloadLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", async () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    try {
      // IP geolocation — middleware set করলে পাওয়া যাবে
      const ipInfo = (req as any).ipInfo ?? {};

      await writeLog("resume-downloads.log", {
        timestamp: new Date().toISOString(),
        level: "INFO",
        type: "RESUME_DOWNLOAD",
        // ResumeDownloadLog model fields
        ipAddress: req.ip ?? null,
        country: ipInfo.country ?? null, // ResumeDownloadLog.country
        userAgent: req.get("user-agent") || "unknown",
        // Extra context (file log শুধু)
        statusCode: res.statusCode,
        referrer: req.get("referer") || req.get("referrer") || "direct",
        language: req.get("accept-language")?.split(",")[0] ?? null,
      });
    } catch (err) {
      console.error("Failed to write resume download log:", err);
    }
  });

  next();
};
