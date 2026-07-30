import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateInterviewInput,
  UpdateInterviewInput,
} from "./interview.interface";

const createInterview = async (payload: CreateInterviewInput) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: payload.jobApplicationId },
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Job application not found");
  }

  const result = await prisma.interview.create({
    data: {
      jobApplicationId: payload.jobApplicationId,
      round: payload.round,
      ...(payload.scheduledAt && { scheduledAt: new Date(payload.scheduledAt) }),
      ...(payload.duration !== undefined && { duration: payload.duration }),
      ...(payload.location !== undefined && { location: payload.location }),
      interviewerNames: payload.interviewerNames ?? [],
      ...(payload.feedback !== undefined && { feedback: payload.feedback }),
      ...(payload.result !== undefined && { result: payload.result }),
    },
  });

  return result;
};

const getInterviewsByApplication = async (jobApplicationId: string) => {
  const result = await prisma.interview.findMany({
    where: { jobApplicationId },
    orderBy: { scheduledAt: "asc" },
  });

  return result;
};

const getInterviewById = async (id: string) => {
  const result = await prisma.interview.findUnique({ where: { id } });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Interview not found");
  }

  return result;
};

const updateInterview = async (id: string, payload: UpdateInterviewInput) => {
  await getInterviewById(id);

  const result = await prisma.interview.update({
    where: { id },
    data: {
      ...(payload.round !== undefined && { round: payload.round }),
      ...(payload.scheduledAt && { scheduledAt: new Date(payload.scheduledAt) }),
      ...(payload.duration !== undefined && { duration: payload.duration }),
      ...(payload.location !== undefined && { location: payload.location }),
      ...(payload.interviewerNames !== undefined && { interviewerNames: payload.interviewerNames }),
      ...(payload.feedback !== undefined && { feedback: payload.feedback }),
      ...(payload.result !== undefined && { result: payload.result }),
    },
  });

  return result;
};

const deleteInterview = async (id: string) => {
  await getInterviewById(id);

  await prisma.interview.delete({ where: { id } });
};

export const InterviewService = {
  createInterview,
  getInterviewsByApplication,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
