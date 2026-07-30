import { Request } from "express";
import { writeLog } from "./index";

/**
 * Appointment Events — Appointment model-এর lifecycle
 *
 * DB schema:
 *   Appointment { name, email, topic, date, status, slotId, meetLink }
 *   AppointmentStatus: PENDING | CONFIRMED | CANCELLED | COMPLETED | NO_SHOW
 */
type AppointmentEvent =
  | "BOOKING_REQUESTED"   // visitor slot book করেছে (status: PENDING)
  | "BOOKING_CONFIRMED"   // admin confirm করেছে + meetLink add করেছে
  | "BOOKING_CANCELLED"   // admin বা visitor cancel করেছে
  | "BOOKING_COMPLETED"   // meeting শেষ হয়েছে
  | "NO_SHOW"             // visitor আসেনি
  | "BOOKING_FAILED"      // save error
  | "VALIDATION_ERROR"    // invalid slot বা input
  | "SLOT_UNAVAILABLE";   // slot আর available নেই

type AppointmentLogMeta = {
  /** Appointment.id */
  appointmentId?: string;
  /** Appointment.slotId */
  slotId?: string;
  /** Appointment.topic */
  topic?: string;
  /** Appointment.date (ISO string) */
  date?: string;
  /** Privacy: full email না রেখে domain */
  emailDomain?: string;
  /** নতুন status (BOOKING_CANCELLED, BOOKING_CONFIRMED) */
  newStatus?: string;
  /** Admin userId যে action নিয়েছে */
  changedBy?: string;
  /** Cancellation বা failure-এর কারণ */
  reason?: string;
};

/**
 * logAppointmentEvent — appointment-সংক্রান্ত সব event লগ করে।
 *
 * Usage:
 *   // Visitor booking করলে:
 *   await logAppointmentEvent(req, "BOOKING_REQUESTED", {
 *     appointmentId: saved.id,
 *     slotId: body.slotId,
 *     topic: body.topic,
 *     date: body.date,
 *     emailDomain: extractEmailDomain(body.email),
 *   });
 *
 *   // Admin confirm করলে:
 *   await logAppointmentEvent(req, "BOOKING_CONFIRMED", {
 *     appointmentId: id,
 *     changedBy: admin.id,
 *   });
 *
 *   // Slot নেই:
 *   await logAppointmentEvent(req, "SLOT_UNAVAILABLE", {
 *     slotId: body.slotId,
 *     reason: "Slot already booked",
 *   });
 */
export const logAppointmentEvent = async (
  req: Request,
  event: AppointmentEvent,
  meta: AppointmentLogMeta = {},
) => {
  try {
    const level = resolveLevel(event);

    await writeLog("appointments.log", {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(meta.appointmentId && { appointmentId: meta.appointmentId }),
      ...(meta.slotId        && { slotId:        meta.slotId }),
      ...(meta.topic         && { topic:         meta.topic }),
      ...(meta.date          && { date:          meta.date }),
      ...(meta.emailDomain   && { emailDomain:   meta.emailDomain }),
      ...(meta.newStatus     && { newStatus:     meta.newStatus }),
      ...(meta.changedBy     && { changedBy:     meta.changedBy }),
      ...(meta.reason        && { reason:        meta.reason }),
      ip:        req.ip,
      userAgent: req.get("user-agent") || "unknown",
    });
  } catch (err) {
    console.error("Failed to write appointment log:", err);
  }
};

function resolveLevel(event: AppointmentEvent): "INFO" | "WARN" | "ERROR" {
  if (event === "BOOKING_FAILED")    return "ERROR";
  if (
    event === "BOOKING_CANCELLED"  ||
    event === "NO_SHOW"            ||
    event === "SLOT_UNAVAILABLE"   ||
    event === "VALIDATION_ERROR"
  ) return "WARN";
  return "INFO";
}