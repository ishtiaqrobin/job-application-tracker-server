import { DocumentType } from "../../../generated/prisma";

export interface CreateDocumentInput {
  jobApplicationId: string;
  type: DocumentType;
  fileUrl: string;
  version?: number;
}
