import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  ApplicationQueryInput,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "./application.interface";

const stripUndefined = <T extends Record<string, unknown>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;

const createApplication = async (userId: string, payload: CreateApplicationInput) => {
  const { tagIds, ...data } = payload;

  const result = await prisma.jobApplication.create({
    data: {
      ...stripUndefined(data),
      userId,
      ...(data.appliedDate && { appliedDate: new Date(data.appliedDate) }),
      ...(data.deadline && { deadline: new Date(data.deadline) }),
      ...(data.followUpDate && { followUpDate: new Date(data.followUpDate) }),
      ...(tagIds && tagIds.length > 0 && {
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      }),
    },
    include: {
      company: true,
      tags: true,
      _count: {
        select: {
          interviews: true,
          documents: true,
          followUps: true,
          reminders: true,
        },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      jobApplicationId: result.id,
      toStatus: result.status,
      note: "Application created",
    },
  });

  return result;
};

const getAllApplications = async (userId: string, query: ApplicationQueryInput) => {
  const { status, priority, source, workMode, jobNature, search, startDate, endDate } = query;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const skip = (page - 1) * limit;

  const where: any = {
    userId,
    ...(status && { status }),
    ...(priority && { priority }),
    ...(source && { source }),
    ...(workMode && { workMode }),
    ...(jobNature && { jobNature }),
    ...(search && {
      OR: [
        { position: { contains: search, mode: "insensitive" } },
        { companyNameSnapshot: { contains: search, mode: "insensitive" } },
        { techStack: { has: search } },
      ],
    }),
    ...((startDate || endDate) && {
      appliedDate: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { appliedDate: "desc" },
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
        tags: { select: { id: true, name: true, color: true } },
        _count: {
          select: {
            interviews: true,
            documents: true,
            followUps: true,
            reminders: true,
          },
        },
      },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getApplicationById = async (id: string, userId: string) => {
  const result = await prisma.jobApplication.findFirst({
    where: { id, userId },
    include: {
      company: true,
      contacts: true,
      interviews: { orderBy: { scheduledAt: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { contactedAt: "desc" } },
      activityLogs: { orderBy: { createdAt: "desc" } },
      reminders: true,
      tags: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Job application not found");
  }

  return result;
};

const updateApplication = async (id: string, userId: string, payload: UpdateApplicationInput) => {
  const existing = await getApplicationById(id, userId);

  const { tagIds, ...data } = payload;

  const statusChanged = data.status && data.status !== existing.status;

  const result = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...stripUndefined(data),
      ...(data.appliedDate && { appliedDate: new Date(data.appliedDate) }),
      ...(data.deadline && { deadline: new Date(data.deadline) }),
      ...(data.followUpDate && { followUpDate: new Date(data.followUpDate) }),
      ...(tagIds !== undefined && {
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      }),
    },
    include: {
      company: true,
      tags: true,
    },
  });

  if (statusChanged) {
    await prisma.activityLog.create({
      data: {
        jobApplicationId: id,
        fromStatus: existing.status,
        toStatus: data.status!,
      },
    });
  }

  return result;
};

const deleteApplication = async (id: string, userId: string) => {
  await getApplicationById(id, userId);

  await prisma.jobApplication.delete({ where: { id } });
};

const getApplicationStats = async (userId: string) => {
  const [statusStats, sourceStats, priorityStats] = await Promise.all([
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.jobApplication.groupBy({
      by: ["source"],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.jobApplication.groupBy({
      by: ["priority"],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return {
    byStatus: statusStats.map((s) => ({ status: s.status, count: s._count.id })),
    bySource: sourceStats.map((s) => ({ source: s.source, count: s._count.id })),
    byPriority: priorityStats.map((s) => ({ priority: s.priority, count: s._count.id })),
  };
};

export const ApplicationService = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
};
