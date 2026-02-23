import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import BannerService from "../services/Banner.service.js";

// CREATE BANNER DATA
export const createBanner = asyncHandler(async (req, res) => {
    if (!req.files?.BannerImage || !req.files?.smallBannerImage) {
        throw new ApiError(400, "Both images are required");
    }

    const bannerImageUrl = `/uploads/banners/${req.files.BannerImage[0].filename}`;
    const smallImageUrl = `/uploads/banners/${req.files.smallBannerImage[0].filename}`;

    const banner = await BannerService.createBanner({
        name: req.body.name,
        headline: req.body.headline,
        designations: JSON.parse(req.body.designations),
        bannerImageUrl,
        smallImageUrl
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
        updateData.bannerImageUrl = `/uploads/banners/${req.files.BannerImage[0].filename}`;
    }

    if (req.files?.smallBannerImage) {
        BannerService.deleteLocalFile(banner.smallImageUrl);
        updateData.smallImageUrl = `/uploads/banners/${req.files.smallBannerImage[0].filename}`;
    }

    const updatedBanner = await BannerService.updateBanner(updateData);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBanner, "Banner updated successfully"));
});
