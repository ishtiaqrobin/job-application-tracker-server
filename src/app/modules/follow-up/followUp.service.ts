import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CreateFollowUpInput } from "./followUp.interface";

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

const getFollowUpById = async (id: string) => {
  const result = await prisma.followUp.findUnique({ where: { id } });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Follow-up not found");
  }

  return result;
};

const deleteFollowUp = async (id: string) => {
  const followUp = await getFollowUpById(id);

  await prisma.followUp.delete({ where: { id } });

  await prisma.jobApplication.update({
    where: { id: followUp.jobApplicationId },
    data: { followUpCount: { decrement: 1 } },
  });
};

export const FollowUpService = {
  createFollowUp,
  getFollowUpsByApplication,
  getFollowUpById,
  deleteFollowUp,
};
