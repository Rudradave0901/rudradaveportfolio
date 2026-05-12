import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ProjectService from "../services/Project.service.js";
import { projectSettingsModel } from "../models/ProjectSettings.model.js";
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
    if (!req.body.projectName || !req.body.projectURL || !req.body.categories) {
        throw new ApiError(400, "Project name, URL, and categories are required");
    }

    let categories = [];
    if (req.body.categories) {
        try {
            categories = typeof req.body.categories === 'string' ? JSON.parse(req.body.categories) : req.body.categories;
        } catch (error) {
            categories = [req.body.categories];
        }
    }

    const project = await ProjectService.createProject({
        projectName: req.body.projectName,
        projectURL: req.body.projectURL,
        githubURL: req.body.githubURL,
        description: req.body.description,
        projectImageURL,
        stack,
        categories,
        isVisible: req.body.isVisible !== undefined ? req.body.isVisible === 'true' || req.body.isVisible === true : true,
        showOnHomepage: req.body.showOnHomepage === 'true' || req.body.showOnHomepage === true,
        homepageOrder: Number(req.body.homepageOrder) || 0,
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

    let categories = existingProject.categories;
    if (req.body.categories) {
        try {
            categories = typeof req.body.categories === 'string' ? JSON.parse(req.body.categories) : req.body.categories;
        } catch (error) {
            categories = [req.body.categories];
        }
    }

    let isVisible = existingProject.isVisible;
    if (req.body.isVisible !== undefined) {
        isVisible = req.body.isVisible === 'true' || req.body.isVisible === true;
    }

    let showOnHomepage = existingProject.showOnHomepage;
    if (req.body.showOnHomepage !== undefined) {
        showOnHomepage = req.body.showOnHomepage === 'true' || req.body.showOnHomepage === true;
    }

    let homepageOrder = existingProject.homepageOrder;
    if (req.body.homepageOrder !== undefined) {
        homepageOrder = Number(req.body.homepageOrder) || 0;
    }

    const updatedProject = await ProjectService.updateProject(id, {
        projectName: req.body.projectName || existingProject.projectName,
        projectURL: req.body.projectURL || existingProject.projectURL,
        githubURL: req.body.githubURL !== undefined ? req.body.githubURL : existingProject.githubURL,
        description: req.body.description !== undefined ? req.body.description : existingProject.description,
        categories,
        isVisible,
        showOnHomepage,
        homepageOrder,
        projectImageURL,
        stack,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"));
});

export const getProjectSettings = asyncHandler(async (req, res) => {
    let settings = await projectSettingsModel.findOne();
    if (!settings) {
        settings = await projectSettingsModel.create({ maxProjectsLimit: 0 });
    }
    return res.status(200).json(new ApiResponse(200, settings, "Settings fetched successfully"));
});

export const updateProjectSettings = asyncHandler(async (req, res) => {
    let settings = await projectSettingsModel.findOne();
    const { maxProjectsLimit } = req.body;
    
    if (!settings) {
        settings = await projectSettingsModel.create({ maxProjectsLimit: Number(maxProjectsLimit) || 0 });
    } else {
        settings.maxProjectsLimit = Number(maxProjectsLimit) || 0;
        await settings.save();
    }
    
    return res.status(200).json(new ApiResponse(200, settings, "Settings updated successfully"));
});