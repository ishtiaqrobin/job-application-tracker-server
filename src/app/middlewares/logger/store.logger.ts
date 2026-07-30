import { Request } from "express";
import { writeLog } from "./index";

/**
 * Store Events — Product ও Order model-এর lifecycle
 *
 * DB schema:
 *   Product { title, slug, price, discountPrice, status }
 *   Order { buyerEmail, amount, currency, status, paymentMethod,
 *           transactionId, downloadToken, downloadCount, downloadExpiry }
 *   OrderStatus: PENDING | PAID | FAILED | REFUNDED | EXPIRED
 */
type StoreEvent =
  // Order lifecycle
  | "ORDER_CREATED"       // Order তৈরি হয়েছে (status: PENDING)
  | "PAYMENT_SUCCESS"     // Payment confirm (status: PAID, paidAt set)
  | "PAYMENT_FAILED"      // Payment gateway error (status: FAILED)
  | "ORDER_REFUNDED"      // Refund হয়েছে (status: REFUNDED)
  // Download
  | "DOWNLOAD_STARTED"    // Buyer download শুরু করেছে
  | "DOWNLOAD_EXPIRED"    // downloadExpiry পার হয়ে গেছে
  | "DOWNLOAD_LIMIT_HIT"  // downloadCount max পৌঁছে গেছে
  | "INVALID_TOKEN"       // downloadToken ভুল বা না পাওয়া
  // Admin
  | "ORDER_EXPIRED";      // Admin manually expire করেছে

type StoreLogMeta = {
  /** Order.id */
  orderId?: string;
  /** Product.id */
  productId?: string;
  /** Product.slug */
  productSlug?: string;
  /** Privacy: buyer email domain — e.g. "gmail.com" */
  buyerEmailDomain?: string;
  /** Order.amount */
  amount?: number;
  /** Order.currency */
  currency?: string;
  /** Order.paymentMethod ("stripe", "bkash", "paypal") */
  paymentMethod?: string;
  /** Order.transactionId (payment gateway ID) */
  transactionId?: string;
  /** Order.downloadCount (ডাউনলোড কতবার হয়েছে) */
  downloadCount?: number;
  /** Payment বা validation error message */
  errorMessage?: string;
  /** Admin userId (ORDER_EXPIRED) */
  changedBy?: string;
};

/**
 * logStoreEvent — digital store-এর সব event লগ করে।
 *
 * Usage:
 *   // Order create:
 *   await logStoreEvent(req, "ORDER_CREATED", {
 *     orderId: order.id,
 *     productId: product.id,
 *     productSlug: product.slug,
 *     buyerEmailDomain: extractEmailDomain(body.buyerEmail),
 *     amount: Number(order.amount),
 *     currency: order.currency,
 *     paymentMethod: body.paymentMethod,
 *   });
 *
 *   // Payment success (webhook):
 *   await logStoreEvent(req, "PAYMENT_SUCCESS", {
 *     orderId: order.id,
 *     transactionId: event.transactionId,
 *     amount: Number(order.amount),
 *   });
 *
 *   // Download:
 *   await logStoreEvent(req, "DOWNLOAD_STARTED", {
 *     orderId: order.id,
 *     productSlug: product.slug,
 *     downloadCount: order.downloadCount,
 *   });
 *
 *   // Invalid token:
 *   await logStoreEvent(req, "INVALID_TOKEN", {
 *     errorMessage: "Token not found or expired",
 *   });
 */
export const logStoreEvent = async (
  req: Request,
  event: StoreEvent,
  meta: StoreLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("store.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(meta.orderId           && { orderId:           meta.orderId }),
      ...(meta.productId         && { productId:         meta.productId }),
      ...(meta.productSlug       && { productSlug:       meta.productSlug }),
      ...(meta.buyerEmailDomain  && { buyerEmailDomain:  meta.buyerEmailDomain }),
      ...(meta.amount            !== undefined && { amount:   meta.amount }),
      ...(meta.currency          && { currency:          meta.currency }),
      ...(meta.paymentMethod     && { paymentMethod:     meta.paymentMethod }),
      ...(meta.transactionId     && { transactionId:     meta.transactionId }),
      ...(meta.downloadCount     !== undefined && { downloadCount: meta.downloadCount }),
      ...(meta.errorMessage      && { errorMessage:      meta.errorMessage }),
      ...(meta.changedBy         && { changedBy:         meta.changedBy }),
      ip:        req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("Failed to write store log:", err);
  }
};

function resolveLevel(event: StoreEvent): "INFO" | "WARN" | "ERROR" {
  if (event === "PAYMENT_FAILED") return "ERROR";
  if (
    event === "DOWNLOAD_EXPIRED"   ||
    event === "DOWNLOAD_LIMIT_HIT" ||
    event === "INVALID_TOKEN"      ||
    event === "ORDER_REFUNDED"
  ) return "WARN";
  return "INFO";
}