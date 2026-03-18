import { ResumeModel } from "../models/resume.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";

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
    const uploadDir = path.resolve("uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, "Rudra_Dave_Resume.pdf");
    fs.writeFileSync(filePath, req.file.buffer);

    return res
      .status(200)
      .json(new ApiResponse(200, { url: `/api/resume/Rudra_Dave_Resume.pdf` }, "Resume PDF generated and stored successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to save PDF file: " + error.message);
  }
});

/* =========================
   DOWNLOAD RESUME PDF (PUBLIC)
========================= */
export const downloadResumePDF = asyncHandler(async (req, res) => {
  const filePath = path.resolve("uploads", "Rudra_Dave_Resume.pdf");
  
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "Resume PDF not found on the server.");
  }
  
  res.contentType("application/pdf");
  res.sendFile(filePath);
});
