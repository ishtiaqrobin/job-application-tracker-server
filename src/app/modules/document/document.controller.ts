import { NextFunction, Request, Response } from "express";
import { DocumentService } from "./document.service";

const createDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await DocumentService.createDocument(req.body);

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDocumentsByApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await DocumentService.getDocumentsByApplication(req.params.applicationId as string);

    res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await DocumentService.deleteDocument(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const DocumentController = {
  createDocument,
  getDocumentsByApplication,
  deleteDocument,
};
