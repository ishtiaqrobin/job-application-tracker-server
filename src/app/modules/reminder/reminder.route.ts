import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReminderValidation } from "./reminder.validation";
import { ReminderController } from "./reminder.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ReminderValidation.createReminderZodSchema),
  ReminderController.createReminder,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), ReminderController.getAllReminders);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ReminderValidation.updateReminderZodSchema),
  ReminderController.updateReminder,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), ReminderController.deleteReminder);

export const ReminderRouter: Router = router;
