import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  ContactQueryInput,
  CreateContactInput,
  UpdateContactInput,
} from "./contact.interface";

const createContact = async (userId: string, payload: CreateContactInput) => {
  const { companyId, jobApplicationId, name, role, email, phone, linkedin } = payload;

  const result = await prisma.contact.create({
    data: {
      userId,
      name,
      ...(companyId !== undefined && { companyId }),
      ...(jobApplicationId !== undefined && { jobApplicationId }),
      ...(role !== undefined && { role }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(linkedin !== undefined && { linkedin }),
    },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  return result;
};

const getAllContacts = async (userId: string, query: ContactQueryInput) => {
  const { search, companyId, jobApplicationId } = query;

  const result = await prisma.contact.findMany({
    where: {
      userId,
      ...(companyId && { companyId }),
      ...(jobApplicationId && { jobApplicationId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { role: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      company: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getContactById = async (id: string, userId: string) => {
  const result = await prisma.contact.findFirst({
    where: { id, userId },
    include: {
      company: { select: { id: true, name: true } },
      jobApplication: {
        select: { id: true, position: true, companyNameSnapshot: true },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

const updateContact = async (id: string, userId: string, payload: UpdateContactInput) => {
  await getContactById(id, userId);

  const { companyId, jobApplicationId, name, role, email, phone, linkedin } = payload;

  const result = await prisma.contact.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(companyId !== undefined && { companyId }),
      ...(jobApplicationId !== undefined && { jobApplicationId }),
      ...(role !== undefined && { role }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(linkedin !== undefined && { linkedin }),
    },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  return result;
};

const deleteContact = async (id: string, userId: string) => {
  await getContactById(id, userId);

  await prisma.contact.delete({ where: { id } });
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
