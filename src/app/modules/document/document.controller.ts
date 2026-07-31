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

const getAllDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await DocumentService.getAllDocuments(userId, req.query as any);

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
    const userId = req.user!.id;
    await DocumentService.deleteDocument(req.params.id as string, userId);

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
  getAllDocuments,
  deleteDocument,
};
