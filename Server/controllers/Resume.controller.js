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

  const resumeDir = path.join("uploads", "resume");
  const fileName = "resume.pdf";
  const filePath = path.join(resumeDir, fileName);
  const tempPath = path.join(resumeDir, `resume_temp_${Date.now()}.pdf`);

  // Ensure directory exists
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }

  try {
    // Write new file to temporary location first (safe replacement)
    fs.writeFileSync(tempPath, req.file.buffer);

    // If writing temp file succeeded, move it to the final location
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete old file
    }
    fs.renameSync(tempPath, filePath);

    return res
      .status(200)
      .json(new ApiResponse(200, { url: `/uploads/resume/${fileName}?t=${Date.now()}` }, "Resume PDF generated and stored successfully"));
  } catch (error) {
    // Cleanup temp file if it exists
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (e) { }
    }
    throw new ApiError(500, "Failed to save PDF file: " + error.message);
  }
});

/* =========================
   DOWNLOAD RESUME PDF (PUBLIC)
========================= */
export const downloadResumePDF = asyncHandler(async (req, res) => {
  const filePath = path.resolve("uploads", "resume", "resume.pdf");

  if (!fs.existsSync(filePath)) {
    // If not found, we could potentially redirect to /resume?action=download
    // as a fallback, but per requirements we want to serve the stored file.
    throw new ApiError(404, "Resume PDF file not found. Please contact the administrator.");
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(filePath);
});
