import express from "express";
import { createdProjectsController, deleteProjectsData, getProjectsController, updateProjectsController, getProjectSettings, updateProjectSettings } from "../controllers/Projects.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Sample route for projects
router.get("/settings", getProjectSettings)
router.put("/settings", protect, authorize("admin"), updateProjectSettings)

router.get("/", getProjectsController)
router.post("/",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "projectImageURL", maxCount: 1 }
    ]),
    createdProjectsController)
router.put("/:id",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "projectImageURL", maxCount: 1 }
    ]),
    updateProjectsController)
router.delete("/:id", protect, authorize("admin"), deleteProjectsData)

export default router;