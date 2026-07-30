import { Router } from "express";
import { ActivityLogController } from "./activityLog.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get(
  "/application/:applicationId",
  auth(UserRole.ADMIN, UserRole.USER),
  ActivityLogController.getLogsByApplication,
);

export const ActivityLogRouter: Router = router;
