import { NextFunction, Request, Response } from "express";
import { InterviewService } from "./interview.service";

const createInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await InterviewService.createInterview(req.body);

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getInterviewsByApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await InterviewService.getInterviewsByApplication(req.params.applicationId as string);

    res.status(200).json({
      success: true,
      message: "Interviews retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await InterviewService.updateInterview(req.params.id as string, req.body);

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await InterviewService.deleteInterview(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const InterviewController = {
  createInterview,
  getInterviewsByApplication,
  updateInterview,
  deleteInterview,
};
