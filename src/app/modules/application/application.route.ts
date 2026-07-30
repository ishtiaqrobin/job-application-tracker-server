import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { ApplicationValidation } from "./application.validation";
import { ApplicationController } from "./application.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ApplicationValidation.createApplicationZodSchema),
  ApplicationController.createApplication,
);

router.get("/stats", auth(UserRole.ADMIN, UserRole.USER), ApplicationController.getApplicationStats);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), ApplicationController.getAllApplications);

router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), ApplicationController.getApplicationById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(ApplicationValidation.updateApplicationZodSchema),
  ApplicationController.updateApplication,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), ApplicationController.deleteApplication);

export const ApplicationRouter: Router = router;
