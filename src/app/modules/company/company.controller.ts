import { NextFunction, Request, Response } from "express";
import { CompanyService } from "./company.service";

const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CompanyService.createCompany(req.body);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CompanyService.getAllCompanies(req.query as any);

    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CompanyService.getCompanyById(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Company retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CompanyService.updateCompany(req.params.id as string, req.body);

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CompanyService.deleteCompany(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const CompanyController = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
