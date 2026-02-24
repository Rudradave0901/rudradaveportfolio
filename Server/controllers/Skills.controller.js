import fs from "fs";
import path from "path";
import { SkillsModel } from "../models/Skills.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { optimizeImage } from "../utils/imageOptimizer.js";

// CREATE SKILLS DATA
export const createskillData = asyncHandler(async (req, res) => {
    let skillImageURL;

    if (req.files?.skillImageURL) {
        const optimized = await optimizeImage(
            req.files.skillImageURL[0],
            path.join(process.cwd(), 'uploads/skills'),
            { width: 300 }
        );
        skillImageURL = optimized.filePath;
    }

    const getData = await SkillsModel.create({
        skillName: req.body.skillName,
        skillContent: req.body.skillContent,
        skillUse: req.body.skillUse,
        skillImageURL
    });

    return res
        .status(201)
        .json(new ApiResponse(201, getData, "Data Created Successfully"));
});

// GET SKILLS DATA
export const getSkillData = asyncHandler(async (req, res) => {
    const getData = await SkillsModel.find();

    if (!getData || getData.length === 0) {
        throw new ApiError(404, "No data found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getData, "Data Fetched Successfully"));
});

export const updateskillData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingSkill = await SkillsModel.findById(id);

    if (!existingSkill) {
        throw new ApiError(404, "Skill not found");
    }

    let skillImageURL = existingSkill.skillImageURL;

    if (req.files?.skillImageURL) {
        // Delete old image
        if (existingSkill.skillImageURL) {
            const oldImagePath = path.join(
                process.cwd(),
                existingSkill.skillImageURL.replace(/^\/+/, "")
            );
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const optimized = await optimizeImage(
            req.files.skillImageURL[0],
            path.join(process.cwd(), 'uploads/skills'),
            { width: 300 }
        );
        skillImageURL = optimized.filePath;
    }

    const updatedSkill = await SkillsModel.findByIdAndUpdate(
        id,
        {
            skillName: req.body.skillName || existingSkill.skillName,
            skillContent: req.body.skillContent || existingSkill.skillContent,
            skillUse: req.body.skillUse || existingSkill.skillUse,
            skillImageURL,
        },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedSkill, "Skill updated successfully"));
});

// DELETE SKILLS DATA (Delete 1 Data at a time)
export const deleteSkillData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const getDataID = await SkillsModel.findById(id);

    if (!getDataID) {
        throw new ApiError(404, "Skill not found");
    }

    // Delete image if exists
    if (getDataID.skillImageURL) {
        const imagePath = path.join(
            process.cwd(),
            getDataID.skillImageURL.replace(/^\/+/, "")
        );

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    // Delete DB record
    await SkillsModel.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Data Deleted Successfully"));
});

// DELETE SKILLS DATA (Delete many Data at a time)
export const deleteManySkillData = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Skill IDs are required");
    }

    const result = await SkillsModel.deleteMany({
        _id: { $in: ids },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Data Deleted Successfully"));
});

// DELETE SKILLS DATA (Delete all Data at a time)
export const deleteAllSkillData = asyncHandler(async (req, res) => {
    const deleteAllData = await SkillsModel.deleteMany({});
    return res
        .status(200)
        .json(new ApiResponse(200, deleteAllData, "All data deleted successfully"));
});
// =============================================== //
//      DELETE SKILLS DATA CODE END                //
// =============================================== //