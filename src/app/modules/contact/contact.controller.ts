import { NextFunction, Request, Response } from "express";
import { ContactService } from "./contact.service";

// Create contact (public)
const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ContactService.createContact(req.body);

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all contacts (admin)
const getAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ContactService.getAllContacts(req.query as any);

    res.status(200).json({
      success: true,
      message: "Retrieved all contacts successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single contact by ID (admin)
const getContactById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await ContactService.getContactById(id as string);

    res.status(200).json({
      success: true,
      message: "Retrieved contact successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get contact stats grouped by status (admin)
const getContactStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ContactService.getContactStats();

    res.status(200).json({
      success: true,
      message: "Retrieved contact stats successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update contact status / admin note (admin)
const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await ContactService.updateContact(id as string, req.body);

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a contact (admin)
const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    await ContactService.deleteContact(id as string);

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
  getContactStats,
  updateContact,
  deleteContact,
};
