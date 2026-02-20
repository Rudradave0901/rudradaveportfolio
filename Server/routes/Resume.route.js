import express from "express";
import { createResume, deleteResume, getResume, updateResume } from "../controllers/Resume.controller.js";


const router = express.Router();

// ADMIN
router.post("/", createResume)

// PUBLIC
router.get("/", getResume)

// DELETE
router.delete("/", deleteResume)

router.put("/", updateResume);

export default router;