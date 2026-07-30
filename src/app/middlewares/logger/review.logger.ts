import { Request } from "express";
import { writeLog } from "./index";

/**
 * Review Events — Review model-এর lifecycle
 *
 * DB schema:
 *   Review { userId, rating, comment, isApproved, isPinned }
 *   (userId @unique — একজন user একটাই review দিতে পারবে)
 */
type ReviewEvent =
  | "REVIEW_SUBMITTED" // নতুন review (isApproved: false)
  | "REVIEW_APPROVED" // Admin approve করেছে (isApproved: true)
  | "REVIEW_REJECTED" // Admin reject করেছে (delete বা hide)
  | "REVIEW_PINNED" // Admin featured হিসেবে pin করেছে (isPinned: true)
  | "REVIEW_UNPINNED" // Admin unpin করেছে
  | "DUPLICATE_ATTEMPT" // User আগে review দিয়েছে, আবার চেষ্টা করছে
  | "REVIEW_FAILED"; // Save error

type ReviewLogMeta = {
  /** Review.id */
  reviewId?: string;
  /** Review.userId */
  userId?: string;
  /** Review.rating (1–5) */
  rating?: number;
  /** Admin userId যে action নিয়েছে */
  changedBy?: string;
  /** Reject বা failure-এর কারণ */
  reason?: string;
};

/**
 * logReviewEvent — review-এর সব event লগ করে।
 *
 * Usage:
 *   // User review দিলে:
 *   await logReviewEvent(req, "REVIEW_SUBMITTED", {
 *     reviewId: saved.id,
 *     userId: user.id,
 *     rating: body.rating,
 *   });
 *
 *   // Admin approve করলে:
 *   await logReviewEvent(req, "REVIEW_APPROVED", {
 *     reviewId: id,
 *     changedBy: admin.id,
 *   });
 *
 *   // Duplicate attempt:
 *   await logReviewEvent(req, "DUPLICATE_ATTEMPT", {
 *     userId: user.id,
 *     reason: "User already has a review",
 *   });
 */
export const logReviewEvent = async (
  req: Request,
  event: ReviewEvent,
  meta: ReviewLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("reviews.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(meta.reviewId && { reviewId: meta.reviewId }),
      ...(meta.userId && { userId: meta.userId }),
      ...(meta.rating !== undefined && { rating: meta.rating }),
      ...(meta.changedBy && { changedBy: meta.changedBy }),
      ...(meta.reason && { reason: meta.reason }),
      ip: req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("Failed to write review log:", err);
  }
};

function resolveLevel(event: ReviewEvent): "INFO" | "WARN" | "ERROR" {
  if (event === "REVIEW_FAILED") return "ERROR";
  if (event === "REVIEW_REJECTED" || event === "DUPLICATE_ATTEMPT")
    return "WARN";
  return "INFO";
}
