import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateInterviewInput,
  UpdateInterviewInput,
  InterviewQueryInput,
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

const getAllInterviews = async (userId: string, query: InterviewQueryInput) => {
  const { search, round, result } = query;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const skip = (page - 1) * limit;

  const applicationWhere: any = { userId };
  if (search) {
    applicationWhere.OR = [
      { position: { contains: search, mode: "insensitive" } },
      { companyNameSnapshot: { contains: search, mode: "insensitive" } },
    ];
  }

  const where: any = {
    ...(round && { round }),
    ...(result && { result }),
    jobApplication: { is: applicationWhere },
  };

  const [data, total] = await Promise.all([
    prisma.interview.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledAt: "desc" },
      include: {
        jobApplication: {
          select: {
            id: true,
            position: true,
            companyNameSnapshot: true,
            company: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.interview.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getInterviewById = async (id: string, userId: string) => {
  const result = await prisma.interview.findFirst({
    where: { id, jobApplication: { userId } },
    include: {
      jobApplication: {
        select: {
          id: true,
          position: true,
          companyNameSnapshot: true,
          company: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Interview not found");
  }

  return result;
};

const updateInterview = async (id: string, userId: string, payload: UpdateInterviewInput) => {
  await getInterviewById(id, userId);

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

const deleteInterview = async (id: string, userId: string) => {
  await getInterviewById(id, userId);

  await prisma.interview.delete({ where: { id } });
};

export const InterviewService = {
  createInterview,
  getInterviewsByApplication,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
