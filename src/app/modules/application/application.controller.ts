import { NextFunction, Request, Response } from "express";
import { ApplicationService } from "./application.service";

const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const result = await ApplicationService.createApplication(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Job application created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const result = await ApplicationService.getAllApplications(
      userId,
      req.query as any,
    );

    res.status(200).json({
      success: true,
      message: "Job applications retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const result = await ApplicationService.getApplicationById(
      req.params.id as string,
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Job application retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const result = await ApplicationService.updateApplication(
      req.params.id as string,
      userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Job application updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    await ApplicationService.deleteApplication(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const result = await ApplicationService.getApplicationStats(userId);

    res.status(200).json({
      success: true,
      message: "Application stats retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ApplicationController = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
};
