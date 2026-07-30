import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.changePassword,
);
router.post(
  "/logout",
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.logoutUser,
);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);

export const AuthRouter: Router = router;
