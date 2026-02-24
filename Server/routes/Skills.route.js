import express from "express"
import { createskillData, deleteAllSkillData, deleteManySkillData, deleteSkillData, getSkillData, updateskillData } from "../controllers/Skills.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getSkillData)
router.post("/",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "skillImageURL", maxCount: 1 },
    ]),
    createskillData)
router.put("/:id",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "skillImageURL", maxCount: 1 },
    ]),
    updateskillData)

router.delete("/all", protect, authorize("admin"), deleteAllSkillData);
router.delete("/:id", protect, authorize("admin"), deleteSkillData);
router.delete("/", protect, authorize("admin"), deleteManySkillData);




export default router