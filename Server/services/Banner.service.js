import { BannerModel } from "../models/Banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

class BannerService {
    async getBanner() {
        const banner = await BannerModel.findOne();
        if (!banner) {
            throw new ApiError(404, "Banner not found");
        }
        return banner;
    }

    async createBanner(bannerData) {
        const existingBanner = await BannerModel.findOne();
        if (existingBanner) {
            throw new ApiError(400, "Banner Data Already Exists");
        }
        return await BannerModel.create(bannerData);
    }

    async updateBanner(bannerData) {
        const banner = await BannerModel.findOne();
        if (!banner) {
            throw new ApiError(404, "Banner not found");
        }

        Object.assign(banner, bannerData);
        return await banner.save();
    }

    async deleteBanner() {
        const result = await BannerModel.deleteOne();
        if (result.deletedCount === 0) {
            throw new ApiError(404, "No banner to delete");
        }
        return result;
    }

    async deleteLocalFile(filePath) {
        if (!filePath) return;
        await deleteFromCloudinary(filePath);
    }
}

export default new BannerService();
