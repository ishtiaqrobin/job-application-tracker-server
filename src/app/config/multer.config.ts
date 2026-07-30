import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const fileSizeLimitBytes = 5 * 1024 * 1024;

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) and PDFs are allowed.",
      ),
    );
  }
};

// ✅ Factory function — folder name parameter নাও
export const createMulterUpload = (
  folder: "about" | "projects" | "profiles" | "blogs" | "experiences",
) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: async (_req, file) => {
      const originalName = file.originalname;
      const nameWithoutExt = originalName
        .split(".")
        .slice(0, -1)
        .join(".")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "");

      const uniqueName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        nameWithoutExt;

      return {
        folder: `ishtiaq-robin/${folder}`, // ✅ সঠিক folder
        public_id: uniqueName,
        resource_type: "auto",
      };
    },
  });

  return multer({
    storage,
    limits: { fileSize: fileSizeLimitBytes },
    fileFilter,
  });
};
