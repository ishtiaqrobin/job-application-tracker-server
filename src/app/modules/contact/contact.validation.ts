import { ContactStatus } from "../../../generated/prisma";
import { z } from "zod";

const createContactZodSchema = z.object({
  name: z.string("Name is required"),
  email: z.string("Email is required").email("Invalid email format"),
  subject: z.string("Subject is required"),
  message: z.string().optional(),
  ipAddress: z.string().optional(),
});

const updateContactZodSchema = z.object({
  status: z.nativeEnum(ContactStatus).optional(),
  adminNote: z.string().optional(),
});

export const ContactValidation = {
  createContactZodSchema,
  updateContactZodSchema,
};
