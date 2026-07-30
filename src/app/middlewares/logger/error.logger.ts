import { Request, Response, NextFunction } from "express";
import { writeLog } from "./index";

export const errorLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", async () => {
    // শুধু 4xx এবং 5xx লগ করবে
    if (res.statusCode < 400) return;

    try {
      const responseTimeMs = Number(
        (Number(process.hrtime.bigint() - startTime) / 1_000_000).toFixed(2)
      );

      await writeLog("error.log", {
        timestamp: new Date().toISOString(),
        // 5xx = ERROR, 4xx = WARN
        level: res.statusCode >= 500 ? "ERROR" : "WARN",
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs,
        ip: req.ip,
        userAgent: req.get("user-agent") || "unknown",
        // error middleware থেকে আসবে
        errorMessage: res.locals.errorMessage || null,
        stack: res.statusCode >= 500 ? res.locals.errorStack || null : undefined,
      });
    } catch (err) {
      console.error("Failed to write error log:", err);
    }
  });

  next();
};