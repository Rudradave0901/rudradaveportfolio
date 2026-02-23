import { projectsModel } from "../models/Projects.model.js";
import fs from "fs";
import path from "path";
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
            const imagePath = path.join(
                process.cwd(),
                project.projectImageURL.replace(/^\/+/, "")
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await projectsModel.findByIdAndDelete(id);
        return project;
    }

    deleteLocalFile(filePath) {
        if (!filePath) return;
        const fullPath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
}

export default new ProjectService();
