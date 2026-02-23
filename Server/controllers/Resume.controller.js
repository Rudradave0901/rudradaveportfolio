import { ResumeModel } from "../models/resume.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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
