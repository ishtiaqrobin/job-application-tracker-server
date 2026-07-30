import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./app/config/env";
import { IndexRoutes } from "./app/routes";
import { notFound } from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { globalLimiter, authLimiter } from "./app/middlewares/rateLimiter";

import { prisma } from "./app/lib/prisma";
import { HealthRoutes } from "./app/modules/health/health.route";

const app: Application = express();

// ── View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

// ── Core Middlewares
app.use(
  cors({
    origin: [
      env.FRONTEND_URL,
      env.BETTER_AUTH_URL,
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Auth Routes (Better Auth — logger-এর পরে রাখতে হবে)
// Stricter limiter to mitigate brute-force / credential stuffing.
app.all("/api/auth/*splat", authLimiter, toNodeHandler(auth));

// ── App Routes (Global rate limit: 100 req / 15 min / IP)
app.use("/api/v1", globalLimiter, IndexRoutes);

// ── Root Route
app.get("/", (_req: Request, res: Response) => {
  res.send("Ishtiaq Robin Portfolio Backend is running");
});

// ── Health Check Route
app.use("/health", HealthRoutes);

// ── Error Handler
app.use(notFound);
app.use(globalErrorHandler);

export default app;
