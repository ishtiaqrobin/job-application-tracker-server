import { NextFunction, Request, Response } from "express";
import { FollowUpService } from "./followUp.service";

const createFollowUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FollowUpService.createFollowUp(req.body);

    res.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getFollowUpsByApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FollowUpService.getFollowUpsByApplication(req.params.applicationId as string);

    res.status(200).json({
      success: true,
      message: "Follow-ups retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllFollowUps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await FollowUpService.getAllFollowUps(userId, req.query as any);

    res.status(200).json({
      success: true,
      message: "Follow-ups retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getFollowUpById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await FollowUpService.getFollowUpById(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Follow-up retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateFollowUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await FollowUpService.updateFollowUp(req.params.id as string, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteFollowUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await FollowUpService.deleteFollowUp(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Follow-up deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const FollowUpController = {
  createFollowUp,
  getFollowUpsByApplication,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
};
