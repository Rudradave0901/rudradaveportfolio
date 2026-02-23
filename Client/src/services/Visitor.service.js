import axiosInstance from "../api/axiosInstance";

class VisitorService {
    async getVisitorStats() {
        const response = await axiosInstance.get("/visitors/stats");
        return response.data;
    }

    async getVisitorLogs() {
        const response = await axiosInstance.get("/visitors");
        return response.data;
    }
}

export default new VisitorService();
