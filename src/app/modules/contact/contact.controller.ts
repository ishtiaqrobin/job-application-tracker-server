import { NextFunction, Request, Response } from "express";
import { ContactService } from "./contact.service";

const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ContactService.createContact(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ContactService.getAllContacts(userId, req.query as any);

    res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ContactService.getContactById(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Contact retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ContactService.updateContact(req.params.id as string, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await ContactService.deleteContact(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const ContactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
