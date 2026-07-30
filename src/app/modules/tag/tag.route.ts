import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { TagValidation } from "./tag.validation";
import { TagController } from "./tag.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(TagValidation.createTagZodSchema),
  TagController.createTag,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), TagController.getAllTags);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(TagValidation.updateTagZodSchema),
  TagController.updateTag,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), TagController.deleteTag);

export const TagRouter: Router = router;
