import express from "express";
import { createdProjectsController, deleteProjectsData, getProjectsController, updateProjectsController } from "../controllers/Projects.controller.js";
import { uploadProjectsImages } from "../middleweres/ProjectsUpload.middlewere.js";

const router = express.Router();

// Sample route for projects
router.get("/", getProjectsController)
router.post("/",
    uploadProjectsImages.fields([
        { name: "projectImageURL", maxCount: 1 }
    ]),
    createdProjectsController)
router.put("/:id",
    uploadProjectsImages.fields([
        { name: "projectImageURL", maxCount: 1 }
    ]),
    updateProjectsController)
router.delete("/:id", deleteProjectsData)

export default router;