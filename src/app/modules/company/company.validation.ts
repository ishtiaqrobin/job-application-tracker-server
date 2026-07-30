import { z } from "zod";

const createCompanyZodSchema = z.object({
  name: z.string("Company name is required"),
  website: z.string().url().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

const updateCompanyZodSchema = z.object({
  name: z.string().optional(),
  website: z.string().url().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

export const CompanyValidation = {
  createCompanyZodSchema,
  updateCompanyZodSchema,
};
