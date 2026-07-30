import { Request, Response, NextFunction } from "express";
import { writeLog } from "./index";

export const accessLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", async () => {
    // 4xx/5xx গুলো error.logger handle করবে
    if (res.statusCode >= 400) return;

    try {
      const responseTimeMs = Number(
        (Number(process.hrtime.bigint() - startTime) / 1_000_000).toFixed(2),
      );

      await writeLog("access.log", {
        timestamp: new Date().toISOString(),
        level: "INFO",
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs,
        ip: req.ip,
        userAgent: req.get("user-agent") || "unknown",
      });
    } catch (err) {
      console.error("Failed to write access log:", err);
    }
  });

  next();
};
