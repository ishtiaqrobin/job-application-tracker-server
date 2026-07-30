import { env } from "../../config/env";
import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/email";
import {
  ContactQueryInput,
  CreateContactInput,
  UpdateContactInput,
} from "./contact.interface";

// Allowed email domains whitelist
const ALLOWED_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "aol.com",
  "gmx.com",
  "gmx.net",
  "yandex.com",
  "mail.com",
];

// Create contact (public)
const createContact = async (payload: CreateContactInput) => {
  const emailDomain = payload.email.split("@")[1]?.toLowerCase();

  if (!ALLOWED_DOMAINS.includes(emailDomain as string)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "We only accept emails from trusted providers (Gmail, Outlook, Yahoo, etc.). Please use a valid email address.",
    );
  }

  const result = await prisma.contact.create({
    data: payload,
  });

  // Send email notification
  await sendEmail({
    to: env.CONTACT_RECEIVER_EMAIL,
    subject: `New Contact: ${payload.subject}`,
    templateName: "contact",
    templateData: {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
  });

  return result;
};

// Get all contacts with optional filters (admin)
const getAllContacts = async (query: ContactQueryInput) => {
  const { status, startDate, endDate } = query;

  const result = await prisma.contact.findMany({
    where: {
      ...(status && { status }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Get a single contact by ID (admin)
const getContactById = async (id: string) => {
  const result = await prisma.contact.findUnique({
    where: { id },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contact not found");
  }

  return result;
};

// Get contact stats grouped by status (admin)
const getContactStats = async () => {
  const result = await prisma.contact.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  return result.map((item) => ({
    status: item.status,
    total: item._count.id,
  }));
};

// Update contact status / admin note (admin)
const updateContact = async (id: string, payload: UpdateContactInput) => {
  await getContactById(id); // ensure it exists

  const result = await prisma.contact.update({
    where: { id },
    data: payload,
  });

  return result;
};

// Delete a contact (admin)
const deleteContact = async (id: string) => {
  await getContactById(id); // ensure it exists

  await prisma.contact.delete({
    where: { id },
  });
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
  getContactStats,
  updateContact,
  deleteContact,
};
