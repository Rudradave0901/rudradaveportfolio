import axiosInstance from "../api/axiosInstance";

class AboutService {
    async getAboutData() {
        const response = await axiosInstance.get("/about");
        return response.data;
    }

    async createAbout(data) {
        const response = await axiosInstance.post("/about", data);
        return response.data;
    }

    async updateAbout(data) {
        const response = await axiosInstance.put("/about", data);
        return response.data;
    }
}

export default new AboutService();
