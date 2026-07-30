import { z } from "zod";

const createContactZodSchema = z.object({
  companyId: z.string().optional(),
  jobApplicationId: z.string().optional(),
  name: z.string("Contact name is required"),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional(),
});

const updateContactZodSchema = z.object({
  companyId: z.string().optional(),
  jobApplicationId: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional(),
});

export const ContactValidation = {
  createContactZodSchema,
  updateContactZodSchema,
};
