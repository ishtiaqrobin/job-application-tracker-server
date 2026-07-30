import { NextFunction, Request, Response } from "express";
import { ActivityLogService } from "./activityLog.service";

const getLogsByApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ActivityLogService.getLogsByApplication(req.params.applicationId as string);

    res.status(200).json({
      success: true,
      message: "Activity logs retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ActivityLogController = {
  getLogsByApplication,
};
