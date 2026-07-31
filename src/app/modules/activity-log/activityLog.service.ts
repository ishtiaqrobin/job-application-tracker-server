import { prisma } from "../../lib/prisma";
import { ActivityLogQueryInput } from "./activityLog.interface";

const getLogsByApplication = async (jobApplicationId: string) => {
  const result = await prisma.activityLog.findMany({
    where: { jobApplicationId },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getAllLogs = async (userId: string, query: ActivityLogQueryInput) => {
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
    prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
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
    prisma.activityLog.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const ActivityLogService = {
  getLogsByApplication,
  getAllLogs,
};
