import express from "express";
import { createResume, deleteResume, getResume, getAllResumes, updateResume, uploadResumePDF, downloadResumePDF } from "../controllers/Resume.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", protect, authorize("admin"), createResume);

// PUBLIC
router.get("/", getResume);
router.get("/all", getAllResumes);

// DELETE
router.delete("/:id", protect, authorize("admin"), deleteResume);

router.put("/:id", protect, authorize("admin"), updateResume);

// PDF UPLOAD
router.post("/upload-pdf", protect, authorize("admin"), upload.single("resume"), uploadResumePDF);

// PDF DOWNLOAD
router.get("/download", downloadResumePDF);
router.get("/Rudra_Dave_Resume.pdf", downloadResumePDF);

export default router;