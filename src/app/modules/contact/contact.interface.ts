import { ContactStatus } from "../../../generated/prisma";

// Used when a visitor submits the contact form (public)
export interface CreateContactInput {
  name: string;
  email: string;
  subject: string;
  message?: string;
  ipAddress?: string;
}

// Used by admin to update status / leave a note
export interface UpdateContactInput {
  status?: ContactStatus;
  adminNote?: string;
}

// Query filters for fetching contacts (admin)
export interface ContactQueryInput {
  status?: ContactStatus;
  startDate?: string;
  endDate?: string;
}
