import express from "express";
import { createResume, deleteResume, getResume, updateResume, uploadResumePDF, downloadResumePDF } from "../controllers/Resume.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", protect, authorize("admin"), createResume)

// PUBLIC (Now Protected for Viewer/Admin as per RBAC requirement)
router.get("/", getResume)

// DELETE
router.delete("/", protect, authorize("admin"), deleteResume)

router.put("/", protect, authorize("admin"), updateResume);

// PDF UPLOAD
router.post("/upload-pdf", protect, authorize("admin"), upload.single("resume"), uploadResumePDF);

// PDF DOWNLOAD
router.get("/download", downloadResumePDF);
router.get("/Rudra_Dave_Resume.pdf", downloadResumePDF);

export default router;