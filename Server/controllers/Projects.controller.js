import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ProjectService from "../services/Project.service.js";
import { optimizeImage } from "../utils/imageOptimizer.js";
import path from "path";

export const createdProjectsController = asyncHandler(async (req, res) => {
    // console.log("Request Body:", req.body);
    // console.log("Request Files:", req.files);

    if (!req.files?.projectImageURL || req.files.projectImageURL.length === 0) {
        throw new ApiError(400, "Project image is required");
    }

    let optimized;
    try {
        optimized = await optimizeImage(
            req.files.projectImageURL[0],
            path.join(process.cwd(), 'uploads/projects'),
            { width: 1000, quality: 85 }
        );
    } catch (error) {
        console.error("Image optimization/upload failed:", error);
        throw new ApiError(500, `Image upload failed: ${error.message}`);
    }

    const projectImageURL = optimized.filePath;
    
    let stack = {};
    if (req.body.stack) {
        try {
            stack = typeof req.body.stack === 'string' ? JSON.parse(req.body.stack) : req.body.stack;
        } catch (error) {
            console.error("Failed to parse stack JSON:", error);
            throw new ApiError(400, "Invalid stack format. Must be a valid JSON string.");
        }
    }

    // Validate required fields for Mongoose
    if (!req.body.projectName || !req.body.projectURL || !req.body.category) {
        throw new ApiError(400, "Project name, URL, and category are required");
    }

    const project = await ProjectService.createProject({
        projectName: req.body.projectName,
        projectURL: req.body.projectURL,
        projectImageURL,
        stack,
        category: req.body.category,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

export const getProjectsController = asyncHandler(async (req, res) => {
    const projects = await ProjectService.getProjects();

    if (!projects || projects.length === 0) {
        throw new ApiError(404, "No projects found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

export const deleteProjectsData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ProjectService.deleteProject(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export const updateProjectsController = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingProject = await ProjectService.getProjectById(id);

    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    let projectImageURL = existingProject.projectImageURL;

    if (req.files?.projectImageURL && req.files.projectImageURL.length > 0) {
        // Delete old image using service utility
        try {
            await ProjectService.deleteLocalFile(existingProject.projectImageURL);
        } catch (error) {
            console.warn("Failed to delete old image from Cloudinary:", error);
            // Continue anyway, it's not a fatal error for updating
        }

        try {
            const optimized = await optimizeImage(
                req.files.projectImageURL[0],
                path.join(process.cwd(), 'uploads/projects'),
                { width: 1000, quality: 85 }
            );
            projectImageURL = optimized.filePath;
        } catch (error) {
            console.error("Image optimization/upload failed during update:", error);
            throw new ApiError(500, `Image upload failed: ${error.message}`);
        }
    }

    let stack = existingProject.stack;
    if (req.body.stack) {
        try {
            stack = typeof req.body.stack === 'string' ? JSON.parse(req.body.stack) : req.body.stack;
        } catch (error) {
            console.error("Failed to parse stack JSON during update:", error);
            throw new ApiError(400, "Invalid stack format. Must be a valid JSON string.");
        }
    }

    const updatedProject = await ProjectService.updateProject(id, {
        projectName: req.body.projectName || existingProject.projectName,
        projectURL: req.body.projectURL || existingProject.projectURL,
        category: req.body.category || existingProject.category,
        projectImageURL,
        stack,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"));
});