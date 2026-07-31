import { z } from "zod";

const createFollowUpZodSchema = z.object({
  jobApplicationId: z.string("Job application ID is required"),
  contactedAt: z.string("Contact date is required").datetime(),
  note: z.string().optional(),
  response: z.string().optional(),
});

const updateFollowUpZodSchema = z.object({
  contactedAt: z.string().datetime().optional(),
  note: z.string().optional(),
  response: z.string().optional(),
});

export const FollowUpValidation = {
  createFollowUpZodSchema,
  updateFollowUpZodSchema,
};
