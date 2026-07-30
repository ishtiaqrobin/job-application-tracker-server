import { Request } from "express";
import { writeLog } from "./index";

/**
 * Auth Events — Better Auth + custom app events
 *
 * Better Auth core:
 *   LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT
 *   TOKEN_INVALID, TOKEN_EXPIRED
 *   EMAIL_VERIFIED
 *   PASSWORD_RESET_REQUESTED, PASSWORD_RESET_SUCCESS
 *   OAUTH_LOGIN (Google, GitHub, etc.)
 *
 * App-level (admin dashboard):
 *   ACCOUNT_BANNED, ACCOUNT_UNBANNED
 *   ACCOUNT_DELETED, ROLE_CHANGED
 *   PASSWORD_CHANGED (needPasswordChange flow)
 */
type AuthEvent =
  // Session
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  // Email & Password
  | "EMAIL_VERIFIED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_SUCCESS"
  | "PASSWORD_CHANGED"
  // OAuth (Better Auth provider)
  | "OAUTH_LOGIN"
  // Admin actions (User model: isBanned, isDeleted, role)
  | "ACCOUNT_BANNED"
  | "ACCOUNT_UNBANNED"
  | "ACCOUNT_DELETED"
  | "ROLE_CHANGED";

type AuthLogMeta = {
  userId?: string;
  role?: string; // User.role (USER | ADMIN)
  provider?: string; // OAuth provider (google, github)
  reason?: string; // failure বা ban-এর কারণ
  changedBy?: string; // admin userId (ROLE_CHANGED, ACCOUNT_BANNED এ)
};

/**
 * logAuthEvent — auth-related সব event লগ করে।
 *
 * Usage:
 *   // Login success (Better Auth callback):
 *   await logAuthEvent(req, "LOGIN_SUCCESS", { userId: user.id, role: user.role });
 *
 *   // OAuth:
 *   await logAuthEvent(req, "OAUTH_LOGIN", { userId: user.id, provider: "google" });
 *
 *   // Admin banning a user:
 *   await logAuthEvent(req, "ACCOUNT_BANNED", {
 *     userId: targetUser.id,
 *     reason: "Spam activity",
 *     changedBy: adminUser.id,
 *   });
 */
export const logAuthEvent = async (
  req: Request,
  event: AuthEvent,
  meta: AuthLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("auth.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      userId: meta.userId ?? null,
      role: meta.role ?? null,
      provider: meta.provider ?? null,
      reason: meta.reason ?? null,
      changedBy: meta.changedBy ?? null,
      ip: req.ip,
      userAgent: req.get("user-agent") || "unknown",
      endpoint: req.originalUrl,
    });
  } catch (err) {
    console.error("Failed to write auth log:", err);
  }
};

function resolveLevel(event: AuthEvent): "INFO" | "WARN" | "ERROR" {
  const errors: AuthEvent[] = ["TOKEN_INVALID", "TOKEN_EXPIRED"];
  const warns: AuthEvent[] = [
    "LOGIN_FAILED",
    "ACCOUNT_BANNED",
    "ACCOUNT_DELETED",
  ];
  if (errors.includes(event)) return "ERROR";
  if (warns.includes(event)) return "WARN";
  return "INFO";
}
