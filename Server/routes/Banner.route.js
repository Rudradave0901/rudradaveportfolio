import express from "express";
import { createBanner, deleteBanner, getBannerData, updateBanner } from "../controllers/Banner.controller.js";
import { uploadBannerImages } from "../middleweres/BannerUpload.middleware.js";

const router = express.Router();

router.get("/", getBannerData);
router.post("/",
    uploadBannerImages.fields([
        { name: "BannerImage", maxCount: 1 },{ name: "smallBannerImage", maxCount: 1 }
    ]), 
    createBanner);
router.put("/",
    uploadBannerImages.fields([
        { name: "BannerImage", maxCount: 1 },{ name: "smallBannerImage", maxCount: 1 }
    ]), 
    updateBanner);
router.delete("/", deleteBanner);

export default router;