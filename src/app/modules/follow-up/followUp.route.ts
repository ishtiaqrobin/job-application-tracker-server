import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { FollowUpValidation } from "./followUp.validation";
import { FollowUpController } from "./followUp.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(FollowUpValidation.createFollowUpZodSchema),
  FollowUpController.createFollowUp,
);

router.get(
  "/application/:applicationId",
  auth(UserRole.ADMIN, UserRole.USER),
  FollowUpController.getFollowUpsByApplication,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), FollowUpController.getAllFollowUps);

router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), FollowUpController.getFollowUpById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(FollowUpValidation.updateFollowUpZodSchema),
  FollowUpController.updateFollowUp,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), FollowUpController.deleteFollowUp);

export const FollowUpRouter: Router = router;
