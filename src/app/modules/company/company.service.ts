import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CompanyQueryInput,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "./company.interface";

const createCompany = async (payload: CreateCompanyInput) => {
  const existing = await prisma.company.findUnique({
    where: { name: payload.name },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Company with this name already exists");
  }

  const result = await prisma.company.create({
    data: {
      name: payload.name,
      ...(payload.website !== undefined && { website: payload.website }),
      ...(payload.location !== undefined && { location: payload.location }),
      ...(payload.industry !== undefined && { industry: payload.industry }),
      ...(payload.logoUrl !== undefined && { logoUrl: payload.logoUrl }),
    },
  });
  return result;
};

const getAllCompanies = async (query: CompanyQueryInput) => {
  const { search, industry, location } = query;

  const result = await prisma.company.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { industry: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(industry && { industry: { contains: industry, mode: "insensitive" } }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
    },
    orderBy: { name: "asc" },
  });

  return result;
};

const getCompanyById = async (id: string) => {
  const result = await prisma.company.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true, contacts: true } },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Company not found");
  }

  return result;
};

const updateCompany = async (id: string, payload: UpdateCompanyInput) => {
  await getCompanyById(id);

  if (payload.name) {
    const existing = await prisma.company.findUnique({
      where: { name: payload.name },
    });
    if (existing && existing.id !== id) {
      throw new AppError(httpStatus.CONFLICT, "Company with this name already exists");
    }
  }

  const result = await prisma.company.update({
    where: { id },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.website !== undefined && { website: payload.website }),
      ...(payload.location !== undefined && { location: payload.location }),
      ...(payload.industry !== undefined && { industry: payload.industry }),
      ...(payload.logoUrl !== undefined && { logoUrl: payload.logoUrl }),
    },
  });

  return result;
};

const deleteCompany = async (id: string) => {
  await getCompanyById(id);

  await prisma.company.delete({ where: { id } });
};

export const CompanyService = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
