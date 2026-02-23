import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import ProjectService from "../services/Project.service.js";

export const createdProjectsController = asyncHandler(async (req, res) => {
    if (!req.files?.projectImageURL) {
        throw new ApiError(400, "Project image is required");
    }

    const projectImageURL = `/uploads/projects/${req.files.projectImageURL[0].filename}`;
    const stack = req.body.stack ? JSON.parse(req.body.stack) : {};

    const project = await ProjectService.createProject({
        projectName: req.body.projectName,
        projectURL: req.body.projectURL,
        projectImageURL,
        stack,
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

    let projectImageURL = existingProject.projectImageURL;

    if (req.files?.projectImageURL) {
        // Delete old image using service utility
        ProjectService.deleteLocalFile(existingProject.projectImageURL);
        projectImageURL = `/uploads/projects/${req.files.projectImageURL[0].filename}`;
    }

    const stack = req.body.stack ? JSON.parse(req.body.stack) : existingProject.stack;

    const updatedProject = await ProjectService.updateProject(id, {
        projectName: req.body.projectName || existingProject.projectName,
        projectURL: req.body.projectURL || existingProject.projectURL,
        projectImageURL,
        stack,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedProject, "Project updated successfully"));
});