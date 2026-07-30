import rateLimit from "express-rate-limit";
import status from "http-status";

/**
 * Standard error payload sent when the client exceeds the rate limit.
 * Shape kept consistent with the rest of the API's error responses.
 */
const buildLimitMessage = (message: string) => ({
  success: false,
  statusCode: status.TOO_MANY_REQUESTS,
  message,
  errorSources: [
    {
      path: "",
      message,
    },
  ],
});

/**
 * Global API limiter
 * ─ Applies to all `/api/v1/*` routes (projects, blogs, services, etc.)
 * ─ 100 requests / 15 minutes / IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // 100 requests
  standardHeaders: true, // `RateLimit-*` headers
  legacyHeaders: false, // disable `X-RateLimit-*`
  message: buildLimitMessage(
    "Too many requests from this IP. Please try again after 15 minutes.",
  ),
});

/**
 * Auth limiter
 * ─ Applies to `/api/auth/*` (Better Auth — login, register, OAuth callbacks)
 * ─ Stricter to mitigate brute-force / credential stuffing.
 * ─ 20 requests / 15 minutes / IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // 20 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: buildLimitMessage(
    "Too many authentication attempts. Please try again after 15 minutes.",
  ),
});

/**
 * Strict limiter
 * ─ For very sensitive endpoints (contact form, password reset, etc.)
 * ─ 5 requests / 1 minute / IP
 * ─ Apply per-route as needed.
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 10 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: buildLimitMessage(
    "Too many requests. Please slow down and try again shortly.",
  ),
});
