import { DocumentType } from "../../../generated/prisma";

export interface CreateDocumentInput {
  jobApplicationId: string;
  type: DocumentType;
  fileUrl: string;
  version?: number;
}

export interface DocumentQueryInput {
  search?: string;
  type?: DocumentType;
  page?: number;
  limit?: number;
}
