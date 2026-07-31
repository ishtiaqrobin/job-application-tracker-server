import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateFollowUpInput,
  FollowUpQueryInput,
  UpdateFollowUpInput,
} from "./followUp.interface";

const createFollowUp = async (payload: CreateFollowUpInput) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: payload.jobApplicationId },
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Job application not found");
  }

  const result = await prisma.followUp.create({
    data: {
      jobApplicationId: payload.jobApplicationId,
      contactedAt: new Date(payload.contactedAt),
      note: payload.note ?? null,
      response: payload.response ?? null,
    },
  });

  await prisma.jobApplication.update({
    where: { id: payload.jobApplicationId },
    data: { followUpCount: { increment: 1 } },
  });

  return result;
};

const getFollowUpsByApplication = async (jobApplicationId: string) => {
  const result = await prisma.followUp.findMany({
    where: { jobApplicationId },
    orderBy: { contactedAt: "desc" },
  });

  return result;
};

const getAllFollowUps = async (userId: string, query: FollowUpQueryInput) => {
  const { search } = query;

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
    jobApplication: { is: applicationWhere },
  };

  const [data, total] = await Promise.all([
    prisma.followUp.findMany({
      where,
      skip,
      take: limit,
      orderBy: { contactedAt: "desc" },
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
    prisma.followUp.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getFollowUpById = async (id: string, userId: string) => {
  const result = await prisma.followUp.findFirst({
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
    throw new AppError(httpStatus.NOT_FOUND, "Follow-up not found");
  }

  return result;
};

const updateFollowUp = async (
  id: string,
  userId: string,
  payload: UpdateFollowUpInput,
) => {
  await getFollowUpById(id, userId);

  const result = await prisma.followUp.update({
    where: { id },
    data: {
      ...(payload.contactedAt && { contactedAt: new Date(payload.contactedAt) }),
      ...(payload.note !== undefined && { note: payload.note }),
      ...(payload.response !== undefined && { response: payload.response }),
    },
  });

  return result;
};

const deleteFollowUp = async (id: string, userId: string) => {
  const followUp = await getFollowUpById(id, userId);

  await prisma.followUp.delete({ where: { id } });

  await prisma.jobApplication.update({
    where: { id: followUp.jobApplicationId },
    data: { followUpCount: { decrement: 1 } },
  });
};

export const FollowUpService = {
  createFollowUp,
  getFollowUpsByApplication,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
};
