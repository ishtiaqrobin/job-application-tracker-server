import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DocumentValidation } from "./document.validation";
import { DocumentController } from "./document.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(DocumentValidation.createDocumentZodSchema),
  DocumentController.createDocument,
);

router.get(
  "/application/:applicationId",
  auth(UserRole.ADMIN, UserRole.USER),
  DocumentController.getDocumentsByApplication,
);

router.get("/", auth(UserRole.ADMIN, UserRole.USER), DocumentController.getAllDocuments);

router.delete("/:id", auth(UserRole.ADMIN, UserRole.USER), DocumentController.deleteDocument);

export const DocumentRouter: Router = router;
