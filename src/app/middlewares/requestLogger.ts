import fs from "fs/promises";
import path from "path";
import { Request, Response, NextFunction } from "express";

const logDir = path.resolve(process.cwd(), "logs");
const accessLogPath = path.join(logDir, "access.log");

const ensureLogDir = async () => {
  await fs.mkdir(logDir, { recursive: true });
};

export const requestLogger = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", async () => {
    try {
      const endTime = process.hrtime.bigint();
      const responseTime = Number(endTime - startTime) / 1_000_000;
      const logEntry = JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs: Number(responseTime.toFixed(2)),
        ip: req.ip,
        userAgent: req.get("user-agent") || "unknown",
      });

      console.log(logEntry);

      await ensureLogDir();
      await fs.appendFile(accessLogPath, `${logEntry}\n`, "utf-8");
    } catch (error) {
      console.error("Failed to write access log:", error);
    }
  });

  next();
};
