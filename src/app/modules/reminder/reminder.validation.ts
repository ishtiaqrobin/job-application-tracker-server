import { z } from "zod";

const createReminderZodSchema = z.object({
  jobApplicationId: z.string().optional(),
  title: z.string("Reminder title is required"),
  remindAt: z.string("Reminder date is required").datetime(),
});

const updateReminderZodSchema = z.object({
  title: z.string().optional(),
  remindAt: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});

export const ReminderValidation = {
  createReminderZodSchema,
  updateReminderZodSchema,
};
