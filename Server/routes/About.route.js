import { createAboutData, deleteAboutData, getAboutData, updateAboutData } from "../controllers/About.controller.js";
import express from "express";

const router = express.Router();


router.post("/", createAboutData);
router.get("/", getAboutData);
router.put("/", updateAboutData);
router.delete("/", deleteAboutData)

export default router;