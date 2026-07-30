import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

const SERVER_START_TIME = Date.now();

const formatUptime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
};

export const healthCheck = async (_req: Request, res: Response) => {
  let dbStatus: "connected" | "disconnected" = "disconnected";
  let dbLatency: number | null = null;

  try {
    const start = Date.now();

    await prisma.$queryRaw`SELECT 1`;

    dbLatency = Date.now() - start;
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  const uptimeMs = Date.now() - SERVER_START_TIME;

  const memoryUsage = process.memoryUsage();

  const isHealthy = dbStatus === "connected";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "error",
    db: dbStatus,
    dbLatency: dbLatency ? `${dbLatency}ms` : null,
    uptime: formatUptime(uptimeMs),
    uptimeMs,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV || "development",

    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
    },
  });
};
