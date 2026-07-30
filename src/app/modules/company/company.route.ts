import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { CompanyValidation } from "./company.validation";
import { CompanyController } from "./company.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(CompanyValidation.createCompanyZodSchema),
  CompanyController.createCompany,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), CompanyController.getAllCompanies);

router.get("/:id", auth(UserRole.ADMIN, UserRole.USER), CompanyController.getCompanyById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(CompanyValidation.updateCompanyZodSchema),
  CompanyController.updateCompany,
);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), CompanyController.deleteCompany);

export const CompanyRouter: Router = router;
