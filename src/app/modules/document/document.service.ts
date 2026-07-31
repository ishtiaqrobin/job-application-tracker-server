import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateDocumentInput,
  DocumentQueryInput,
} from "./document.interface";

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

const getAllDocuments = async (userId: string, query: DocumentQueryInput) => {
  const { search, type } = query;

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
    ...(type && { type }),
    jobApplication: { is: applicationWhere },
  };

  const [data, total] = await Promise.all([
    prisma.document.findMany({
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
    prisma.document.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getDocumentById = async (id: string) => {
  const result = await prisma.document.findUnique({ where: { id } });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Document not found");
  }

  return result;
};

const deleteDocument = async (id: string, userId: string) => {
  const document = await prisma.document.findFirst({
    where: { id, jobApplication: { userId } },
  });

  if (!document) {
    throw new AppError(httpStatus.NOT_FOUND, "Document not found");
  }

  await prisma.document.delete({ where: { id } });
};

export const DocumentService = {
  createDocument,
  getDocumentsByApplication,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
};
