import axiosInstance from "../api/axiosInstance";

class BannerService {
    async getBannerData() {
        const response = await axiosInstance.get("/banners");

        return response.data;
    }

    async createBanner(formData) {
        const response = await axiosInstance.post("/banners", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    async updateBanner(formData) {
        const response = await axiosInstance.put("/banners", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    async deleteBanner() {
        const response = await axiosInstance.delete("/banners");
        return response.data;
    }
}

export default new BannerService();
