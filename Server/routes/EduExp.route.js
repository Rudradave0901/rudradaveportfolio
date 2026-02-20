import express from "express";
import { createEduExpData, deleteEduExpData, getEduExpData, updateEduExpData } from "../controllers/EduExp.controller.js";
import { protect, authorize } from "../middleweres/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getEduExpData)
router.post("/", protect, authorize("admin"), createEduExpData)
router.put("/:id", protect, authorize("admin"), updateEduExpData)
router.delete("/:id", protect, authorize("admin"), deleteEduExpData)

export default router;