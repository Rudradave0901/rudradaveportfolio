import { createAboutData, deleteAboutData, getAboutData, updateAboutData } from "../controllers/About.controller.js";
import express from "express";
import { protect, authorize } from "../middleweres/auth.middleware.js";

const router = express.Router();


router.post("/", protect, authorize("admin"), createAboutData);
router.get("/", protect, getAboutData);
router.put("/", protect, authorize("admin"), updateAboutData);
router.delete("/", protect, authorize("admin"), deleteAboutData)

export default router;