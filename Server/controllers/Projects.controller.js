import fs from "fs";
import path from "path";
import { projectsModel } from "../models/Projects.model.js";

export const createdProjectsController = async (req, res) => {
    try {

        const projectImageURL = req.files?.projectImageURL ? `/uploads/projects/${req.files.projectImageURL[0].filename}` : undefined
        // 3️⃣ Parse stack safely
        const stack = req.body.stack ? JSON.parse(req.body.stack) : {};

        // 4️⃣ Create single project
        const projectData = await projectsModel.create({
            projectName: req.body.projectName,
            projectURL: req.body.projectURL,
            projectImageURL,
            stack,
        });

        // 1️⃣ Image is REQUIRED
        if (!req.files?.projectImageURL) {
            return res.status(400).json({
                success: false,
                message: "Project image is required",
            });
        }

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: projectData
        });

    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
}

export const getProjectsController = async (req, res) => {
    try {
        const projectsData = await projectsModel.find();

        if (!projectsData || projectsData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No projects found"
            });
        }

        res.status(200).json({
            success: true,
            data: projectsData
        });
    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
}

export const deleteProjectsData = async (req, res) => {
    try {

        const id = req.params.id;

        const getData = await projectsModel.findById(id);

        if (!getData) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }


        // 2️⃣ Delete image if exists
        if (getData.projectImageURL) {
            const imagePath = path.join(
                process.cwd(),
                getData.projectImageURL.replace(/^\/+/, "")
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // 3️⃣ Delete DB record
        await projectsModel.findByIdAndDelete(getData._id);

        res.status(200).json({
            success: true,
            message: "Data deleted successfully",
            // data: getData,
            // deletedCounts: getData.deletedCounts
        })

    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
}

export const updateProjectsController = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProject = await projectsModel.findById(id);

        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        let projectImageURL = existingProject.projectImageURL;

        if (req.files?.projectImageURL) {
            // Delete old image
            if (existingProject.projectImageURL) {
                const oldImagePath = path.join(
                    process.cwd(),
                    existingProject.projectImageURL.replace(/^\/+/, "")
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            projectImageURL = `/uploads/projects/${req.files.projectImageURL[0].filename}`;
        }

        const stack = req.body.stack ? JSON.parse(req.body.stack) : existingProject.stack;

        const updatedProject = await projectsModel.findByIdAndUpdate(
            id,
            {
                projectName: req.body.projectName || existingProject.projectName,
                projectURL: req.body.projectURL || existingProject.projectURL,
                projectImageURL,
                stack,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject,
        });
    } catch (error) {
        console.log("error message :- ", error);
        res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};