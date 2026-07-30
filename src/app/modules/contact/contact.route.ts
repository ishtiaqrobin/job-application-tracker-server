import express, { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { ContactValidation } from "./contact.validation";
import { ContactController } from "./contact.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { strictLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

// ─── Public ───

// Submit a contact message
router.post(
  "/",
  strictLimiter,
  validateRequest(ContactValidation.createContactZodSchema),
  ContactController.createContact,
);

// ─── Admin ───

// Get all contacts (with optional status / date filters)
router.get("/", auth(UserRole.ADMIN), ContactController.getAllContacts);

// Get contact stats grouped by status
router.get("/stats", auth(UserRole.ADMIN), ContactController.getContactStats);

// Get a single contact by ID
router.get("/:id", auth(UserRole.ADMIN), ContactController.getContactById);

// Update contact status / admin note
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(ContactValidation.updateContactZodSchema),
  ContactController.updateContact,
);

// Delete a contact
router.delete("/:id", auth(UserRole.ADMIN), ContactController.deleteContact);

export const ContactRouter: Router = router;
