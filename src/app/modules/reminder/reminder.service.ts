import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateReminderInput,
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

const getAllReminders = async (userId: string) => {
  const result = await prisma.reminder.findMany({
    where: { userId },
    orderBy: { remindAt: "asc" },
  });

  return result;
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
