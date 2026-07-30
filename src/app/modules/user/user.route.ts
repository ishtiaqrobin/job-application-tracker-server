import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { createMulterUpload } from "../../config/multer.config";

const profileUpload = createMulterUpload("profiles");
const router = express.Router();

// Get current user profile
router.get("/me", auth(UserRole.USER, UserRole.ADMIN), UserController.getMe);

// Update user profile
router.put(
  "/profile",
  auth(UserRole.USER, UserRole.ADMIN),
  profileUpload.single("image"),
  UserController.updateProfile,
);

export const UserRouter: Router = router;
