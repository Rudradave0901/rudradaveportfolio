import express from "express";
import { createBanner, deleteBanner, getBannerData, updateBanner } from "../controllers/Banner.controller.js";
import { uploadBannerImages } from "../middleweres/BannerUpload.middleware.js";
import { protect, authorize } from "../middleweres/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBannerData);
router.post("/",
    protect,
    authorize("admin"),
    uploadBannerImages.fields([
        { name: "BannerImage", maxCount: 1 }, { name: "smallBannerImage", maxCount: 1 }
    ]),
    createBanner);
router.put("/",
    protect,
    authorize("admin"),
    uploadBannerImages.fields([
        { name: "BannerImage", maxCount: 1 }, { name: "smallBannerImage", maxCount: 1 }
    ]),
    updateBanner);
router.delete("/", protect, authorize("admin"), deleteBanner);

export default router;