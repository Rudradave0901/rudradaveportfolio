import { ResumeModel } from "../models/resume.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import { cloudinary } from "../utils/cloudinary.js";

/* =========================
   CREATE RESUME (ADMIN)
========================= */
export const createResume = asyncHandler(async (req, res) => {
  // Only one resume allowed (like banner)
  const existingResume = await ResumeModel.findOne();

  if (existingResume) {
    throw new ApiError(400, "Resume already exists");
  }

  const resume = await ResumeModel.create(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, resume, "Resume created successfully"));
});

/* =========================
   GET RESUME (PUBLIC)
========================= */
export const getResume = asyncHandler(async (req, res) => {
  const resume = await ResumeModel.findOne({ isActive: true });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

export const deleteResume = asyncHandler(async (req, res) => {
  const existingResume = await ResumeModel.findOne();

  if (!existingResume) {
    throw new ApiError(404, "No data found in Resume");
  }

  await ResumeModel.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Resume Data deleted successfully"));
});

export const updateResume = asyncHandler(async (req, res) => {
  const updatedResume = await ResumeModel.findOneAndUpdate(
    {},
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedResume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
});

/* =========================
   UPLOAD RESUME PDF (ADMIN)
========================= */
export const uploadResumePDF = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "PDF file is required");
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resume',
          public_id: 'Rudra_Dave_Resume',
          resource_type: 'raw',
          type: 'upload',
          overwrite: true
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { url: uploadResult.secure_url }, "Resume PDF generated and stored successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to save PDF file: " + error.message);
  }
});

/* =========================
   DOWNLOAD RESUME PDF (PUBLIC)
========================= */
export const downloadResumePDF = asyncHandler(async (req, res) => {
  // Construct the secure URL based on Cloudinary's raw upload pattern
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new ApiError(404, "Cloudinary is not configured.");
  }

  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/resume/Rudra_Dave_Resume.pdf`;
  
  // Redirect the client to download/view the file from Cloudinary
  res.redirect(cloudinaryUrl);
});
