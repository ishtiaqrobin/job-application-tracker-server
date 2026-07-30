import { Request } from "express";
import { writeLog } from "./index";

/**
 * Chatbot Events — ChatbotLog model + ChatbotConfig rate limit
 *
 * DB schema:
 *   ChatbotLog { sessionId, role, message, ipAddress }
 *   ChatbotConfig { rateLimit, rateLimitWindow, isEnabled }
 */
type ChatbotEvent =
  | "MESSAGE_SENT"        // user message পাঠিয়েছে
  | "RESPONSE_GENERATED"  // AI response তৈরি হয়েছে
  | "RATE_LIMITED"        // ChatbotConfig.rateLimit exceed করেছে
  | "BOT_DISABLED"        // ChatbotConfig.isEnabled = false থাকলে
  | "AI_ERROR"            // AI provider error (Gemini/OpenAI/Anthropic)
  | "CONTEXT_BUILT"       // DB context (portfolio data) successfully loaded
  | "CONTEXT_FAILED";     // DB context load করতে ব্যর্থ

type ChatbotLogMeta = {
  /** ChatbotLog.sessionId */
  sessionId?: string;
  /** AI provider (ChatbotConfig.provider) */
  provider?: string;
  /** ChatbotConfig.model */
  model?: string;
  /** User message-এর character count (full message না রেখে) */
  messageLength?: number;
  /** AI response-এর character count */
  responseLength?: number;
  /** Rate limit window-এ কতটা request হয়েছে */
  requestCount?: number;
  /** ChatbotConfig.rateLimit */
  rateLimit?: number;
  /** Error message (AI_ERROR, CONTEXT_FAILED) */
  errorMessage?: string;
};

/**
 * logChatbotEvent — chatbot interaction সব event লগ করে।
 *
 * Usage:
 *   // User message:
 *   await logChatbotEvent(req, "MESSAGE_SENT", {
 *     sessionId: session,
 *     messageLength: userMessage.length,
 *   });
 *
 *   // AI response:
 *   await logChatbotEvent(req, "RESPONSE_GENERATED", {
 *     sessionId: session,
 *     provider: config.provider,
 *     model: config.model,
 *     responseLength: aiReply.length,
 *   });
 *
 *   // Rate limited:
 *   await logChatbotEvent(req, "RATE_LIMITED", {
 *     sessionId: session,
 *     requestCount: currentCount,
 *     rateLimit: config.rateLimit,
 *   });
 *
 *   // AI provider error:
 *   await logChatbotEvent(req, "AI_ERROR", {
 *     sessionId: session,
 *     provider: config.provider,
 *     errorMessage: err.message,
 *   });
 */
export const logChatbotEvent = async (
  req: Request,
  event: ChatbotEvent,
  meta: ChatbotLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("chatbot.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(meta.sessionId      && { sessionId:      meta.sessionId }),
      ...(meta.provider       && { provider:       meta.provider }),
      ...(meta.model          && { model:          meta.model }),
      ...(meta.messageLength  !== undefined && { messageLength:  meta.messageLength }),
      ...(meta.responseLength !== undefined && { responseLength: meta.responseLength }),
      ...(meta.requestCount   !== undefined && { requestCount:   meta.requestCount }),
      ...(meta.rateLimit      !== undefined && { rateLimit:      meta.rateLimit }),
      ...(meta.errorMessage   && { errorMessage:   meta.errorMessage }),
      ip:        req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("Failed to write chatbot log:", err);
  }
};

function resolveLevel(event: ChatbotEvent): "INFO" | "WARN" | "ERROR" {
  if (event === "AI_ERROR" || event === "CONTEXT_FAILED") return "ERROR";
  if (event === "RATE_LIMITED" || event === "BOT_DISABLED") return "WARN";
  return "INFO";
}