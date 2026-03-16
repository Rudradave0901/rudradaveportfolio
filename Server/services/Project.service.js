import { projectsModel } from "../models/Projects.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

class ProjectService {
    async createProject(projectData) {
        return await projectsModel.create(projectData);
    }

    async getProjects() {
        return await projectsModel.find();
    }

    async getProjectById(id) {
        const project = await projectsModel.findById(id);
        if (!project) {
            throw new ApiError(404, "Project not found");
        }
        return project;
    }

    async updateProject(id, updateData) {
        const project = await projectsModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!project) {
            throw new ApiError(404, "Project not found");
        }
        return project;
    }

    async deleteProject(id) {
        const project = await projectsModel.findById(id);
        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        // Delete image if exists
        if (project.projectImageURL) {
            await deleteFromCloudinary(project.projectImageURL);
        }

        await projectsModel.findByIdAndDelete(id);
        return project;
    }

    async deleteLocalFile(filePath) {
        if (!filePath) return;
        await deleteFromCloudinary(filePath);
    }
}

export default new ProjectService();
