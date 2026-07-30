import { prisma } from "../../lib/prisma";

const getLogsByApplication = async (jobApplicationId: string) => {
  const result = await prisma.activityLog.findMany({
    where: { jobApplicationId },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export const ActivityLogService = {
  getLogsByApplication,
};
