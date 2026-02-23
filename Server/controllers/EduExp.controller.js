import { EduExpModel } from "../models/EduExp.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Controller for managing Education and Experience data.
 */

/**
 * Creates new education/experience data.
 */
export const createEduExpData = asyncHandler(async (req, res) => {
    const getData = await EduExpModel.create(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, getData, "Data created successfully"));
});

export const getEduExpData = asyncHandler(async (req, res) => {
    const getData = await EduExpModel.find();
    return res
        .status(200)
        .json(new ApiResponse(200, getData, "Data fetched successfully"));
});

export const updateEduExpData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedData = await EduExpModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedData) {
        throw new ApiError(404, "Data not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedData, "Data updated successfully"));
});

export const deleteEduExpData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedData = await EduExpModel.findByIdAndDelete(id);

    if (!deletedData) {
        throw new ApiError(404, "Data not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Data deleted successfully"));
});