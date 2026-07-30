import { Request, Response, NextFunction } from "express";
import { writeLog } from "./index";

/**
 * successLogger — শুধু 2xx এবং 3xx responses লগ করে।
 * 4xx/5xx গুলো error.logger handle করবে।
 *
 * Usage (app.ts):
 *   app.use(successLogger);
 */
export const successLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", async () => {
    // শুধু success range (2xx ও 3xx) লগ করবে
    if (res.statusCode < 200 || res.statusCode >= 400) return;

    try {
      const responseTimeMs = Number(
        (Number(process.hrtime.bigint() - startTime) / 1_000_000).toFixed(2),
      );

      await writeLog("success.log", {
        timestamp: new Date().toISOString(),
        // 3xx = REDIRECT, 2xx = SUCCESS
        level: res.statusCode >= 300 ? "REDIRECT" : "SUCCESS",
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs,
        ip: req.ip,
        userAgent: req.get("user-agent") || "unknown",
        // 3xx হলে কোথায় redirect হচ্ছে সেটাও লগ করবে
        redirectTo:
          res.statusCode >= 300
            ? (res.getHeader("Location") ?? null)
            : undefined,
      });
    } catch (err) {
      console.error("Failed to write success log:", err);
    }
  });

  next();
};
