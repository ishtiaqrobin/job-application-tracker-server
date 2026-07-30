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

const deleteFollowUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await FollowUpService.deleteFollowUp(req.params.id as string);

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
  deleteFollowUp,
};
