import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import BannerService from "../services/Banner.service.js";
import { optimizeImage } from "../utils/imageOptimizer.js";
import path from "path";

// CREATE BANNER DATA
export const createBanner = asyncHandler(async (req, res) => {
    if (!req.files?.BannerImage || !req.files?.smallBannerImage) {
        throw new ApiError(400, "Both images are required");
    }

    const bannerOptimized = await optimizeImage(
        req.files.BannerImage[0],
        path.join(process.cwd(), 'uploads/banners'),
        { width: 1920, quality: 85 }
    );

    const smallOptimized = await optimizeImage(
        req.files.smallBannerImage[0],
        path.join(process.cwd(), 'uploads/banners'),
        { width: 300, quality: 80 }
    );

    const banner = await BannerService.createBanner({
        name: req.body.name,
        headline: req.body.headline,
        designations: JSON.parse(req.body.designations),
        bannerImageUrl: bannerOptimized.filePath,
        smallImageUrl: smallOptimized.filePath
    });

    return res
        .status(201)
        .json(new ApiResponse(201, banner, "Banner data added successfully"));
});

// GET BANNER DATA
export const getBannerData = asyncHandler(async (req, res) => {
    const banner = await BannerService.getBanner();

    return res
        .status(200)
        .json(new ApiResponse(200, banner, "Banner data fetched successfully"));
});

// DELETE BANNER DATA
export const deleteBanner = asyncHandler(async (req, res) => {
    await BannerService.deleteBanner();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Banner data deleted successfully"));
});

export const updateBanner = asyncHandler(async (req, res) => {
    const banner = await BannerService.getBanner();

    const updateData = {
        name: req.body.name || banner.name,
        headline: req.body.headline || banner.headline,
        designations: req.body.designations ? JSON.parse(req.body.designations) : banner.designations
    };

    if (req.files?.BannerImage) {
        BannerService.deleteLocalFile(banner.bannerImageUrl);
        const optimized = await optimizeImage(
            req.files.BannerImage[0],
            path.join(process.cwd(), 'uploads/banners'),
            { width: 1920, quality: 85 }
        );
        updateData.bannerImageUrl = optimized.filePath;
    }

    if (req.files?.smallBannerImage) {
        BannerService.deleteLocalFile(banner.smallImageUrl);
        const optimized = await optimizeImage(
            req.files.smallBannerImage[0],
            path.join(process.cwd(), 'uploads/banners'),
            { width: 300, quality: 80 }
        );
        updateData.smallImageUrl = optimized.filePath;
    }

    const updatedBanner = await BannerService.updateBanner(updateData);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBanner, "Banner updated successfully"));
});
