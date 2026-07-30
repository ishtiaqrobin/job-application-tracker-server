import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CreateDocumentInput } from "./document.interface";

const createDocument = async (payload: CreateDocumentInput) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: payload.jobApplicationId },
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, "Job application not found");
  }

  const result = await prisma.document.create({
    data: {
      jobApplicationId: payload.jobApplicationId,
      type: payload.type,
      fileUrl: payload.fileUrl,
      ...(payload.version !== undefined && { version: payload.version }),
    },
  });
  return result;
};

const getDocumentsByApplication = async (jobApplicationId: string) => {
  const result = await prisma.document.findMany({
    where: { jobApplicationId },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getDocumentById = async (id: string) => {
  const result = await prisma.document.findUnique({ where: { id } });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Document not found");
  }

  return result;
};

const deleteDocument = async (id: string) => {
  await getDocumentById(id);

  await prisma.document.delete({ where: { id } });
};

export const DocumentService = {
  createDocument,
  getDocumentsByApplication,
  getDocumentById,
  deleteDocument,
};
