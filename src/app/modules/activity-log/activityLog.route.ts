import { Router } from "express";
import { ActivityLogController } from "./activityLog.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.get(
  "/application/:applicationId",
  auth(UserRole.ADMIN, UserRole.USER),
  ActivityLogController.getLogsByApplication,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), ActivityLogController.getAllLogs);

export const ActivityLogRouter: Router = router;
