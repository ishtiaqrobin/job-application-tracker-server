import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "./env";
import status from "http-status";
import AppError from "../errorHelpers/AppError";

cloudinary.config({
  cloud_name: env.CLOUDINARY.CLOUD_NAME,
  api_key: env.CLOUDINARY.API_KEY,
  api_secret: env.CLOUDINARY.API_SECRET,
});

// ✅ folder parameter যোগ করা হয়েছে
export const uploadFileToCloudinary = (
  buffer: Buffer,
  fileName: string,
  folder: "about" | "projects" | "profiles" | "blogs" | "experiences",
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(
      status.BAD_REQUEST,
      "File buffer and file name are required",
    );
  }

  const nameWithoutExt = fileName
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
  const fullFolder = `ishtiaq-robin/${folder}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", public_id: uniqueName, folder: fullFolder },
        (error, result) => {
          if (error)
            return reject(
              new AppError(
                status.INTERNAL_SERVER_ERROR,
                "Failed to upload file to Cloudinary",
              ),
            );
          resolve(result as UploadApiResponse);
        },
      )
      .end(buffer);
  });
};

// ✅ URL থেকে public_id বের করে delete
export const deleteFileFromCloudinary = async (imageUrl: string) => {
  try {
    // URL থেকে "ishtiaq-robin/gallery/xyz" এই অংশটা বের করে
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = imageUrl.match(regex);

    if (!match?.[1]) return;

    await cloudinary.uploader.destroy(match[1], { resource_type: "image" });
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary",
    );
  }
};

export const cloudinaryUpload = cloudinary;
