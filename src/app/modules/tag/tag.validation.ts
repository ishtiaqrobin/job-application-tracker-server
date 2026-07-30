import { z } from "zod";

const createTagZodSchema = z.object({
  name: z.string("Tag name is required"),
  color: z.string().optional(),
});

const updateTagZodSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
});

export const TagValidation = {
  createTagZodSchema,
  updateTagZodSchema,
};
