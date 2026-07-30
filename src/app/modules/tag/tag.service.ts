import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CreateTagInput, UpdateTagInput } from "./tag.interface";

const createTag = async (userId: string, payload: CreateTagInput) => {
  const existing = await prisma.tag.findUnique({
    where: { userId_name: { userId, name: payload.name } },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Tag with this name already exists");
  }

  const result = await prisma.tag.create({
    data: {
      name: payload.name,
      userId,
      ...(payload.color !== undefined && { color: payload.color }),
    },
  });

  return result;
};

const getAllTags = async (userId: string) => {
  const result = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return result;
};

const getTagById = async (id: string, userId: string) => {
  const result = await prisma.tag.findFirst({
    where: { id, userId },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Tag not found");
  }

  return result;
};

const updateTag = async (id: string, userId: string, payload: UpdateTagInput) => {
  await getTagById(id, userId);

  if (payload.name) {
    const existing = await prisma.tag.findUnique({
      where: { userId_name: { userId, name: payload.name } },
    });
    if (existing && existing.id !== id) {
      throw new AppError(httpStatus.CONFLICT, "Tag with this name already exists");
    }
  }

  const result = await prisma.tag.update({
    where: { id },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.color !== undefined && { color: payload.color }),
    },
  });

  return result;
};

const deleteTag = async (id: string, userId: string) => {
  await getTagById(id, userId);

  await prisma.tag.delete({ where: { id } });
};

export const TagService = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
