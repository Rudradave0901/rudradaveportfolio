import express from "express";
import { createResume, deleteResume, getResume, updateResume } from "../controllers/Resume.controller.js";
import { protect, authorize } from "../middleweres/auth.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", protect, authorize("admin"), createResume)

// PUBLIC (Now Protected for Viewer/Admin as per RBAC requirement)
router.get("/", getResume)

// DELETE
router.delete("/", protect, authorize("admin"), deleteResume)

router.put("/", protect, authorize("admin"), updateResume);

export default router;