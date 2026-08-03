import { NextFunction, Request, Response } from "express";
import { ReminderService } from "./reminder.service";

const createReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ReminderService.createReminder(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllReminders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ReminderService.getAllReminders(userId, req.query as any);

    res.status(200).json({
      success: true,
      message: "Reminders retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await ReminderService.updateReminder(req.params.id as string, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await ReminderService.deleteReminder(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const ReminderController = {
  createReminder,
  getAllReminders,
  updateReminder,
  deleteReminder,
};
