import express from "express"
import { createskillData, deleteAllSkillData, deleteManySkillData, deleteSkillData, getSkillData, updateskillData } from "../controllers/Skills.controller.js";
import { uploadSkillImages } from "../middleweres/SkillUpload.middlewere.js";
import { protect, authorize } from "../middleweres/auth.middleware.js";

const router = express.Router();

router.get("/", getSkillData)
router.post("/",
    protect,
    authorize("admin"),
    uploadSkillImages.fields([
        { name: "skillImageURL", maxCount: 10 },
    ]),
    createskillData)
router.put("/:id",
    protect,
    authorize("admin"),
    uploadSkillImages.fields([
        { name: "skillImageURL", maxCount: 1 },
    ]),
    updateskillData)

router.delete("/all", protect, authorize("admin"), deleteAllSkillData);
router.delete("/:id", protect, authorize("admin"), deleteSkillData);
router.delete("/", protect, authorize("admin"), deleteManySkillData);




export default router