import { Request } from "express";
import { writeLog } from "./index";

/**
 * Blog Events — Blog model-এর interactions
 *
 * DB schema:
 *   Blog { slug, viewCount, likeCount, status }
 *   BlogComment { blogId, isApproved, ipAddress, parentId }
 *   BlogStatus: DRAFT | PUBLISHED | ARCHIVED
 */
type BlogEvent =
  // Views & Likes (Blog.viewCount / Blog.likeCount)
  | "POST_VIEWED" // Blog.viewCount + 1
  | "POST_LIKED" // Blog.likeCount + 1
  | "POST_UNLIKED" // Blog.likeCount - 1
  // Comments (BlogComment)
  | "COMMENT_SUBMITTED" // নতুন comment (isApproved: false)
  | "COMMENT_APPROVED" // admin approve করেছে
  | "COMMENT_REJECTED" // admin reject করেছে
  | "COMMENT_SPAM" // spam হিসেবে mark করেছে
  | "REPLY_SUBMITTED" // nested reply (BlogComment.parentId set)
  // Status changes (admin)
  | "POST_PUBLISHED" // DRAFT → PUBLISHED
  | "POST_ARCHIVED"; // → ARCHIVED

type BlogLogMeta = {
  /** Blog.id */
  blogId?: string;
  /** Blog.slug */
  slug?: string;
  /** BlogComment.id */
  commentId?: string;
  /** Reply হলে parent comment-এর id */
  parentCommentId?: string;
  /** Privacy: commenter-এর email domain */
  commenterEmailDomain?: string;
  /** Admin userId (status change, approve, reject) */
  changedBy?: string;
  /** Spam বা reject-এর কারণ */
  reason?: string;
};

/**
 * logBlogEvent — blog interaction সব event লগ করে।
 *
 * Usage:
 *   // Page view (blog detail route):
 *   await logBlogEvent(req, "POST_VIEWED", { blogId: post.id, slug: post.slug });
 *
 *   // Like toggle:
 *   await logBlogEvent(req, "POST_LIKED", { blogId: post.id, slug: post.slug });
 *
 *   // Comment submit:
 *   await logBlogEvent(req, "COMMENT_SUBMITTED", {
 *     blogId: post.id,
 *     slug: post.slug,
 *     commentId: saved.id,
 *     commenterEmailDomain: extractEmailDomain(body.email),
 *   });
 *
 *   // Reply submit:
 *   await logBlogEvent(req, "REPLY_SUBMITTED", {
 *     blogId: post.id,
 *     commentId: saved.id,
 *     parentCommentId: body.parentId,
 *   });
 *
 *   // Admin approves comment:
 *   await logBlogEvent(req, "COMMENT_APPROVED", {
 *     commentId: id,
 *     changedBy: admin.id,
 *   });
 */
export const logBlogEvent = async (
  req: Request,
  event: BlogEvent,
  meta: BlogLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("blog.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(meta.blogId && { blogId: meta.blogId }),
      ...(meta.slug && { slug: meta.slug }),
      ...(meta.commentId && { commentId: meta.commentId }),
      ...(meta.parentCommentId && { parentCommentId: meta.parentCommentId }),
      ...(meta.commenterEmailDomain && {
        commenterEmailDomain: meta.commenterEmailDomain,
      }),
      ...(meta.changedBy && { changedBy: meta.changedBy }),
      ...(meta.reason && { reason: meta.reason }),
      ip: req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("Failed to write blog log:", err);
  }
};

function resolveLevel(event: BlogEvent): "INFO" | "WARN" {
  if (event === "COMMENT_SPAM" || event === "COMMENT_REJECTED") return "WARN";
  return "INFO";
}
