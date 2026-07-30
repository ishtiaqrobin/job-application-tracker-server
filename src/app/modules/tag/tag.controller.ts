import { NextFunction, Request, Response } from "express";
import { TagService } from "./tag.service";

const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await TagService.createTag(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await TagService.getAllTags(userId);

    res.status(200).json({
      success: true,
      message: "Tags retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const result = await TagService.updateTag(req.params.id as string, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await TagService.deleteTag(req.params.id as string, userId);

    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const TagController = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
};
