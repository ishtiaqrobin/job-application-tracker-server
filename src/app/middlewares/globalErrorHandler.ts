/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { z } from "zod";
import multer from "multer";

import { env } from "../../app/config/env";
import { Prisma } from "../../generated/prisma";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import AppError from "../errorHelpers/AppError";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";
import { handleZodError } from "../errorHelpers/handleZodError";
import {
  handlePrismaInitializationError,
  handlePrismaKnownRequestError,
  handlePrismaRustPanicError,
  handlePrismaUnknownRequestError,
  handlePrismaValidationError,
} from "../errorHelpers/handlePrismaError";

/**
 * Node.js system errors we want to translate to user-friendly responses
 * instead of leaking raw `ECONNREFUSED` etc. to the client.
 */
const NETWORK_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ENOTFOUND",
  "EAI_AGAIN",
]);

/** Cleans up any files that Multer/Cloudinary uploaded before the error. */
const cleanupUploadedFiles = async (req: Request): Promise<void> => {
  try {
    if (req.file?.path) {
      await deleteFileFromCloudinary(req.file.path);
    }

    if (Array.isArray(req.files) && req.files.length > 0) {
      await Promise.all(
        req.files.map((file) =>
          file?.path ? deleteFileFromCloudinary(file.path) : null,
        ),
      );
    } else if (req.files && typeof req.files === "object") {
      // `req.files` can also be a fields object: { fieldName: File[] }
      const grouped = req.files as Record<string, Express.Multer.File[]>;
      const all = Object.values(grouped).flat();
      await Promise.all(
        all.map((file) =>
          file?.path ? deleteFileFromCloudinary(file.path) : null,
        ),
      );
    }
  } catch (cleanupErr) {
    // Never let cleanup errors mask the original error.
    if (env.NODE_ENV === "development") {
      console.error("[globalErrorHandler] cleanup failed:", cleanupErr);
    }
  }
};

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): Promise<void> => {
  // ── 1. Cleanup any orphaned uploaded files ────────────────────────────
  await cleanupUploadedFiles(req);

  // ── 2. Defaults ───────────────────────────────────────────────────────
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources: TErrorSources[] = [];

  // ── 3. Map known error types to a consistent response shape ──────────
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = err.errorSources ?? [{ path: "", message: err.message }];
  } else if (err instanceof z.ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode ?? status.BAD_REQUEST;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplified = handlePrismaKnownRequestError(err);
    statusCode = simplified.statusCode ?? status.BAD_REQUEST;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const simplified = handlePrismaValidationError(err);
    statusCode = simplified.statusCode ?? status.BAD_REQUEST;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    const simplified = handlePrismaInitializationError(err);
    statusCode = simplified.statusCode ?? status.SERVICE_UNAVAILABLE;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const simplified = handlePrismaUnknownRequestError(err);
    statusCode = simplified.statusCode ?? status.INTERNAL_SERVER_ERROR;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    const simplified = handlePrismaRustPanicError(err);
    statusCode = simplified.statusCode ?? status.INTERNAL_SERVER_ERROR;
    message = simplified.message;
    errorSources = simplified.errorSources ?? [];
  } else if (err instanceof multer.MulterError) {
    statusCode = status.BAD_REQUEST;
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Maximum allowed size is 5MB.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = `Unexpected file field: '${err.field}'.`;
        break;
      case "LIMIT_PART_COUNT":
        message = "Too many parts in the form data.";
        break;
      default:
        message = err.message || "File upload error";
    }
    errorSources = [{ path: err.field || "file", message }];
  } else if (err instanceof SyntaxError && "body" in err) {
    // express.json() failed to parse the request body
    statusCode = status.BAD_REQUEST;
    message = "Malformed JSON in request body";
    errorSources = [{ path: "body", message }];
  } else if (
    err &&
    typeof err.code === "string" &&
    NETWORK_ERROR_CODES.has(err.code)
  ) {
    statusCode = status.SERVICE_UNAVAILABLE;
    message = "Upstream Service Unavailable";
    errorSources = [
      {
        path: "",
        message:
          "A downstream service is temporarily unreachable. Please try again.",
      },
    ];
  } else if (err instanceof Error) {
    // Generic fallback — DO NOT leak err.message to client in production
    // because it may contain DB queries, stack info, file paths, etc.
    message =
      env.NODE_ENV === "development" ? err.message : "Internal Server Error";
    errorSources = [{ path: "", message }];
  } else {
    // Non-Error throw (e.g. `throw "oops"`)
    errorSources = [{ path: "", message: "An unexpected error occurred." }];
  }

  // ── 4. Structured server-side logging ─────────────────────────────────
  // Always log 5xx errors. Log 4xx only in development to avoid noise.
  const shouldLog = statusCode >= 500 || env.NODE_ENV === "development";
  if (shouldLog) {
    console.error(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${statusCode} ${message}`,
    );
    if (env.NODE_ENV === "development") {
      console.error(err);
    }
  }

  // ── 5. Send response (never leak stack/raw err in production) ────────
  const errorResponse: TErrorResponse = {
    statusCode,
    success: false,
    message,
    errorSources,
    stack: env.NODE_ENV === "development" ? err?.stack : undefined,
    error: env.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
