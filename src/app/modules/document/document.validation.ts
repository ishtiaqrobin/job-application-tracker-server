import { DocumentType } from "../../../generated/prisma";
import { z } from "zod";

const createDocumentZodSchema = z.object({
  jobApplicationId: z.string("Job application ID is required"),
  type: z.nativeEnum(DocumentType, "Document type is required"),
  fileUrl: z.string("File URL is required"),
  version: z.number().int().positive().optional(),
});

export const DocumentValidation = {
  createDocumentZodSchema,
};
