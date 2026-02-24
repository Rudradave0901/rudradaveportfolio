import express from "express";
import { createBanner, deleteBanner, getBannerData, updateBanner } from "../controllers/Banner.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getBannerData);
router.post("/",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "BannerImage", maxCount: 1 }, { name: "smallBannerImage", maxCount: 1 }
    ]),
    createBanner);
router.put("/",
    protect,
    authorize("admin"),
    upload.fields([
        { name: "BannerImage", maxCount: 1 }, { name: "smallBannerImage", maxCount: 1 }
    ]),
    updateBanner);
router.delete("/", protect, authorize("admin"), deleteBanner);

export default router;