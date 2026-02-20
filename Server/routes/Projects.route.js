import express from "express";
import { createdProjectsController, deleteProjectsData, getProjectsController, updateProjectsController } from "../controllers/Projects.controller.js";
import { uploadProjectsImages } from "../middleweres/ProjectsUpload.middlewere.js";
import { protect, authorize } from "../middleweres/auth.middleware.js";

const router = express.Router();

// Sample route for projects
router.get("/", protect, getProjectsController)
router.post("/",
    protect,
    authorize("admin"),
    uploadProjectsImages.fields([
        { name: "projectImageURL", maxCount: 1 }
    ]),
    createdProjectsController)
router.put("/:id",
    protect,
    authorize("admin"),
    uploadProjectsImages.fields([
        { name: "projectImageURL", maxCount: 1 }
    ]),
    updateProjectsController)
router.delete("/:id", protect, authorize("admin"), deleteProjectsData)

export default router;