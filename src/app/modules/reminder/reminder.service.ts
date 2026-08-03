import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateReminderInput,
  ReminderQueryInput,
  UpdateReminderInput,
} from "./reminder.interface";

const createReminder = async (userId: string, payload: CreateReminderInput) => {
  const result = await prisma.reminder.create({
    data: {
      userId,
      jobApplicationId: payload.jobApplicationId ?? null,
      title: payload.title,
      remindAt: new Date(payload.remindAt),
    },
  });

  return result;
};

const getAllReminders = async (
  userId: string,
  query: ReminderQueryInput,
) => {
  const { search, isCompleted } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const where: any = {
    userId,
    ...(isCompleted === "true" || isCompleted === "false"
      ? { isCompleted: isCompleted === "true" }
      : {}),
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      {
        jobApplication: {
          is: {
            OR: [
              { position: { contains: search, mode: "insensitive" } },
              {
                companyNameSnapshot: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.reminder.findMany({
      where,
      skip,
      take: limit,
      orderBy: { remindAt: "asc" },
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
    prisma.reminder.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getReminderById = async (id: string, userId: string) => {
  const result = await prisma.reminder.findFirst({
    where: { id, userId },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Reminder not found");
  }

  return result;
};

const updateReminder = async (id: string, userId: string, payload: UpdateReminderInput) => {
  await getReminderById(id, userId);

  const result = await prisma.reminder.update({
    where: { id },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.remindAt && { remindAt: new Date(payload.remindAt) }),
      ...(payload.isCompleted !== undefined && { isCompleted: payload.isCompleted }),
    },
  });

  return result;
};

const deleteReminder = async (id: string, userId: string) => {
  await getReminderById(id, userId);

  await prisma.reminder.delete({ where: { id } });
};

export const ReminderService = {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
};
