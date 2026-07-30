import { InterviewRound, InterviewResult } from "../../../generated/prisma";
import { z } from "zod";

const createInterviewZodSchema = z.object({
  jobApplicationId: z.string("Job application ID is required"),
  round: z.nativeEnum(InterviewRound, "Interview round is required"),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  location: z.string().optional(),
  interviewerNames: z.array(z.string()).optional(),
  feedback: z.string().optional(),
  result: z.nativeEnum(InterviewResult).optional(),
});

const updateInterviewZodSchema = z.object({
  round: z.nativeEnum(InterviewRound).optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
  location: z.string().optional(),
  interviewerNames: z.array(z.string()).optional(),
  feedback: z.string().optional(),
  result: z.nativeEnum(InterviewResult).optional(),
});

export const InterviewValidation = {
  createInterviewZodSchema,
  updateInterviewZodSchema,
};
