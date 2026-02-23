import { AboutModel } from "../models/About.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// CREATE ABOUTDATA CONTROLLER
export const createAboutData = asyncHandler(async (req, res) => {
    let aboutData = await AboutModel.findOne();
    if (aboutData) {
        throw new ApiError(400, "about Data is already created");
    }

    aboutData = await AboutModel.create(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, aboutData, "About Data Created Successfully"));
});

// GET ABOUT DATA
export const getAboutData = asyncHandler(async (req, res) => {
    const aboutData = await AboutModel.findOne();

    if (!aboutData) {
        throw new ApiError(404, "Data not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, aboutData, "About data fetched successfully"));
});

// UPDATE ABOUT DATA
export const updateAboutData = asyncHandler(async (req, res) => {
    const aboutData = await AboutModel.findOneAndUpdate({}, req.body, { new: true });

    if (!aboutData) {
        throw new ApiError(404, "Data not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, aboutData, "About Data Updated Successfully"));
});

// DELETE ABOUT DATA
export const deleteAboutData = asyncHandler(async (req, res) => {
    const aboutData = await AboutModel.findOne();

    if (!aboutData) {
        throw new ApiError(404, "Data not found");
    }

    await AboutModel.deleteOne();
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Data Deleted Successfully"));
});