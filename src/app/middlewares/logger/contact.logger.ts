import { Request } from "express";
import { writeLog } from "./index";

/**
 * Contact Events — Contact model এর lifecycle
 *
 * DB schema: Contact { name, email, subject, message, status, ipAddress }
 * ContactStatus: UNREAD | READ | REPLIED | ARCHIVED | SPAM
 */
type ContactEvent =
  | "FORM_SUBMITTED" // নতুন message এসেছে (status: UNREAD)
  | "FORM_FAILED" // server-side save error
  | "VALIDATION_ERROR" // invalid input (name/email/subject missing)
  | "SPAM_DETECTED" // rate-limit বা honeypot triggered
  | "STATUS_CHANGED" // admin status update (READ, REPLIED, ARCHIVED, SPAM)
  | "EMAIL_SENT" // auto-reply বা notification email সফল
  | "EMAIL_FAILED"; // email service error

type ContactLogMeta = {
  /** Contact.id (save হওয়ার পরে) */
  contactId?: string;
  /** Contact.name */
  name?: string;
  /** Privacy: full email না রেখে শুধু domain — e.g. "gmail.com" */
  emailDomain?: string;
  /** Contact.subject */
  subject?: string;
  /** STATUS_CHANGED এ নতুন status */
  newStatus?: string;
  /** Admin userId যে status change করেছে */
  changedBy?: string;
  /** Validation বা spam-এর কারণ */
  reason?: string;
  /** Email service provider-এর message ID */
  providerMessageId?: string;
};

/**
 * logContactEvent — contact form-এর সব event লগ করে।
 *
 * Usage (contact route):
 *   // সফল submit:
 *   await logContactEvent(req, "FORM_SUBMITTED", {
 *     contactId: saved.id,
 *     name: body.name,
 *     emailDomain: extractEmailDomain(body.email),
 *     subject: body.subject,
 *   });
 *
 *   // Admin status update:
 *   await logContactEvent(req, "STATUS_CHANGED", {
 *     contactId: id,
 *     newStatus: "REPLIED",
 *     changedBy: admin.id,
 *   });
 */
export const logContactEvent = async (
  req: Request,
  event: ContactEvent,
  meta: ContactLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("contact.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(meta.contactId && { contactId: meta.contactId }),
      ...(meta.name && { name: meta.name }),
      ...(meta.emailDomain && { emailDomain: meta.emailDomain }),
      ...(meta.subject && { subject: meta.subject }),
      ...(meta.newStatus && { newStatus: meta.newStatus }),
      ...(meta.changedBy && { changedBy: meta.changedBy }),
      ...(meta.reason && { reason: meta.reason }),
      ...(meta.providerMessageId && {
        providerMessageId: meta.providerMessageId,
      }),
      ip: req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("Failed to write contact log:", err);
  }
};

function resolveLevel(event: ContactEvent): "INFO" | "WARN" | "ERROR" {
  if (event === "FORM_FAILED" || event === "EMAIL_FAILED") return "ERROR";
  if (event === "VALIDATION_ERROR" || event === "SPAM_DETECTED") return "WARN";
  return "INFO";
}

/**
 * email থেকে শুধু domain বের করে (privacy-safe)
 * "user@gmail.com" → "gmail.com"
 */
export const extractEmailDomain = (email: string): string | undefined => {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1]?.toLowerCase() : undefined;
};
