import express from "express";
import { createdProjectsController, deleteProjectsData, getProjectsController, updateProjectsController } from "../controllers/Projects.controller.js";
import { uploadProjectsImages } from "../middlewares/ProjectsUpload.middlewere.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Sample route for projects
router.get("/", getProjectsController)
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