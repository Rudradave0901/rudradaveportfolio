import express from "express"
import { createskillData, deleteAllSkillData, deleteManySkillData, deleteSkillData, getSkillData, updateskillData } from "../controllers/Skills.controller.js";
import { uploadSkillImages } from "../middleweres/SkillUpload.middlewere.js";

const router = express.Router();

router.get("/", getSkillData)
router.post("/",
    uploadSkillImages.fields([
        { name: "skillImageURL", maxCount: 10 },
    ]),
    createskillData)
router.put("/:id",
    uploadSkillImages.fields([
        { name: "skillImageURL", maxCount: 1 },
    ]),
    updateskillData)

router.delete("/all", deleteAllSkillData);
router.delete("/:id", deleteSkillData);
router.delete("/", deleteManySkillData);




export default router