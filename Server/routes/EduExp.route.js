import express from "express";
import { createEduExpData, deleteEduExpData, getEduExpData, updateEduExpData } from "../controllers/EduExp.controller.js";

const router = express.Router();

router.get("/", getEduExpData)
router.post("/", createEduExpData)
router.put("/:id", updateEduExpData)
router.delete("/:id", deleteEduExpData)

export default router;