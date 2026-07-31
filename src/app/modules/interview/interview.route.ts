import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { InterviewValidation } from "./interview.validation";
import { InterviewController } from "./interview.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(InterviewValidation.createInterviewZodSchema),
  InterviewController.createInterview,
);

router.get(
  "/application/:applicationId",
  auth(UserRole.ADMIN, UserRole.USER),
  InterviewController.getInterviewsByApplication,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), InterviewController.getAllInterviews);

router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), InterviewController.getInterviewById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(InterviewValidation.updateInterviewZodSchema),
  InterviewController.updateInterview,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), InterviewController.deleteInterview);

export const InterviewRouter: Router = router;
