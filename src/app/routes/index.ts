import { Router } from "express";

import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { ContactRouter } from "../modules/contact/contact.route";
import { CompanyRouter } from "../modules/company/company.route";
import { ApplicationRouter } from "../modules/application/application.route";
import { DocumentRouter } from "../modules/document/document.route";
import { InterviewRouter } from "../modules/interview/interview.route";
import { ActivityLogRouter } from "../modules/activity-log/activityLog.route";
import { ReminderRouter } from "../modules/reminder/reminder.route";
import { TagRouter } from "../modules/tag/tag.route";
import { FollowUpRouter } from "../modules/follow-up/followUp.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/contacts", ContactRouter);
router.use("/companies", CompanyRouter);
router.use("/applications", ApplicationRouter);
router.use("/documents", DocumentRouter);
router.use("/interviews", InterviewRouter);
router.use("/activity-logs", ActivityLogRouter);
router.use("/reminders", ReminderRouter);
router.use("/tags", TagRouter);
router.use("/follow-ups", FollowUpRouter);

export const IndexRoutes = router;
