import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { ContactValidation } from "./contact.validation";
import { ContactController } from "./contact.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ContactValidation.createContactZodSchema),
  ContactController.createContact,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), ContactController.getAllContacts);

router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), ContactController.getContactById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ContactValidation.updateContactZodSchema),
  ContactController.updateContact,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), ContactController.deleteContact);

export const ContactRouter: Router = router;
